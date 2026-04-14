import crypto from "crypto";

interface PendingCode {
  domain: string;
  api_key: string;
  redirect_uri: string;
  expires_at: number;
  code_challenge?: string;
}

interface TokenCredentials {
  domain: string;
  api_key: string;
}

// In-memory stores — cleared on restart, users re-auth automatically
export const pendingCodes = new Map<string, PendingCode>();
export const accessTokens = new Map<string, TokenCredentials>();

export function getCredentialsForToken(token: string): TokenCredentials | undefined {
  return accessTokens.get(token);
}

export function extractBearerToken(authHeader: string | undefined): string | undefined {
  if (!authHeader) return undefined;
  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : undefined;
}

export function oauthMetadata(baseUrl: string) {
  return {
    issuer: baseUrl,
    authorization_endpoint: `${baseUrl}/oauth/authorize`,
    token_endpoint: `${baseUrl}/oauth/token`,
    scopes_supported: ["mcp"],
    response_types_supported: ["code"],
    grant_types_supported: ["authorization_code"],
    code_challenge_methods_supported: ["S256"],
    token_endpoint_auth_methods_supported: ["none"]
  };
}

function escapeHtml(str: string): string {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function renderAuthorizeForm(query: Record<string, string>): string {
  const { redirect_uri = "", state = "", code_challenge = "", code_challenge_method = "" } = query;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Connect Freshservice</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background: #f9fafb;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }
    .card {
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,.1), 0 4px 16px rgba(0,0,0,.06);
      padding: 36px;
      width: 100%;
      max-width: 420px;
    }
    .logo { font-size: 24px; font-weight: 700; color: #1d4ed8; margin-bottom: 8px; }
    h1 { font-size: 20px; font-weight: 600; color: #111827; margin-bottom: 4px; }
    p.sub { font-size: 14px; color: #6b7280; margin-bottom: 28px; }
    label { display: block; font-size: 13px; font-weight: 500; color: #374151; margin-bottom: 6px; }
    input {
      width: 100%; padding: 9px 13px;
      border: 1px solid #d1d5db; border-radius: 8px;
      font-size: 14px; outline: none; transition: border .15s;
    }
    input:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,.12); }
    .field { margin-bottom: 18px; }
    .hint { font-size: 12px; color: #9ca3af; margin-top: 5px; }
    button {
      width: 100%; padding: 11px;
      background: #2563eb; color: #fff;
      border: none; border-radius: 8px;
      font-size: 14px; font-weight: 600; cursor: pointer;
      transition: background .15s; margin-top: 8px;
    }
    button:hover { background: #1d4ed8; }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">FS</div>
    <h1>Connect to Freshservice</h1>
    <p class="sub">Enter your Freshservice credentials to authorize Claude.</p>
    <form method="POST" action="/oauth/authorize">
      <input type="hidden" name="redirect_uri" value="${escapeHtml(redirect_uri)}">
      <input type="hidden" name="state" value="${escapeHtml(state)}">
      <input type="hidden" name="code_challenge" value="${escapeHtml(code_challenge)}">
      <input type="hidden" name="code_challenge_method" value="${escapeHtml(code_challenge_method)}">

      <div class="field">
        <label for="domain">Freshservice Domain</label>
        <input id="domain" type="text" name="domain"
          placeholder="yourcompany.freshservice.com" required autocomplete="off">
        <p class="hint">Your Freshservice subdomain, e.g. acme.freshservice.com</p>
      </div>

      <div class="field">
        <label for="api_key">API Key</label>
        <input id="api_key" type="password" name="api_key"
          placeholder="Your Freshservice API key" required autocomplete="off">
        <p class="hint">Profile → API Settings in Freshservice</p>
      </div>

      <button type="submit">Authorize Claude</button>
    </form>
  </div>
</body>
</html>`;
}

export function processAuthorizeForm(
  body: Record<string, string>
): { redirectUrl: string } | { error: string; status: number } {
  const { domain, api_key, redirect_uri, state, code_challenge } = body;

  if (!domain || !api_key) {
    return { error: "Domain and API key are required.", status: 400 };
  }
  if (!redirect_uri) {
    return { error: "Missing redirect_uri.", status: 400 };
  }

  const code = crypto.randomBytes(32).toString("hex");
  pendingCodes.set(code, {
    domain: domain.trim().replace(/^https?:\/\//, ""),
    api_key: api_key.trim(),
    redirect_uri,
    expires_at: Date.now() + 5 * 60 * 1000,
    code_challenge
  });

  // Prune expired codes
  for (const [k, v] of pendingCodes) {
    if (v.expires_at < Date.now()) pendingCodes.delete(k);
  }

  const url = new URL(redirect_uri);
  url.searchParams.set("code", code);
  if (state) url.searchParams.set("state", state);

  return { redirectUrl: url.toString() };
}

export function processTokenRequest(
  body: Record<string, string>
): { token: object } | { error: string; status: number } {
  const { grant_type, code } = body;

  if (grant_type !== "authorization_code") {
    return { error: "unsupported_grant_type", status: 400 };
  }
  if (!code) {
    return { error: "invalid_request", status: 400 };
  }

  const pending = pendingCodes.get(code);
  if (!pending || pending.expires_at < Date.now()) {
    pendingCodes.delete(code);
    return { error: "invalid_grant", status: 400 };
  }

  pendingCodes.delete(code);

  const token = crypto.randomBytes(32).toString("hex");
  accessTokens.set(token, {
    domain: pending.domain,
    api_key: pending.api_key
  });

  return {
    token: {
      access_token: token,
      token_type: "Bearer",
      scope: "mcp"
    }
  };
}
