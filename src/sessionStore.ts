const sessions = new Map<string, any>();

export function setSession(sessionId: string, config: any) {
  sessions.set(sessionId, config);
}

export function getSession(sessionId: string) {
  return sessions.get(sessionId);
}