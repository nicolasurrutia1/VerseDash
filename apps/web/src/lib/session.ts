import {
  PlayerResponseSchema,
  StartGameResponseSchema,
  z,
} from '@verse-dash/shared';

const SESSION_KEY = 'versedash.session';

const SessionSchema = z.object({
  player: PlayerResponseSchema,
  game: StartGameResponseSchema,
});

export type GameSession = z.infer<typeof SessionSchema>;

export function loadSession(): GameSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return SessionSchema.parse(JSON.parse(raw));
  } catch {
    sessionStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function saveSession(session: GameSession): void {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  sessionStorage.removeItem(SESSION_KEY);
}
