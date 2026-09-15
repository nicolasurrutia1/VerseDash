export const QUESTIONS_PER_GAME = 10;
export const TIMER_SECONDS = 45;
export const TIMER_MS = TIMER_SECONDS * 1000;
export const BASE_POINTS = 1000;
export const MAX_TIME_BONUS = 500;

export function calculatePoints(
  isCorrect: boolean,
  elapsedMs: number,
): number {
  if (!isCorrect || elapsedMs >= TIMER_MS) return 0;
  const ratio = 1 - elapsedMs / TIMER_MS;
  return BASE_POINTS + Math.round(MAX_TIME_BONUS * ratio);
}
