import {
  PlayerResponseSchema,
  QUESTIONS_PER_GAME,
  StartGameResponseSchema,
  z,
  type PlayerResponse,
  type StartGameResponse,
} from '@verse-dash/shared';

const SESSION_KEY = 'versedash.session';

const SessionSchema = z.object({
  player: PlayerResponseSchema,
  game: StartGameResponseSchema,
  phase: z.enum(['lobby', 'playing', 'finished']),
  currentIndex: z.number().int().min(0).max(QUESTIONS_PER_GAME - 1),
  score: z.number().int().min(0),
});

export type GameSession = z.infer<typeof SessionSchema>;
export type GamePhase = GameSession['phase'];

export function newSession(
  player: PlayerResponse,
  game: StartGameResponse,
  phase: GamePhase = 'lobby',
): GameSession {
  return { player, game, phase, currentIndex: 0, score: 0 };
}

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
