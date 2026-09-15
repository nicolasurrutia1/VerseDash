import { z } from 'zod';
import { QUESTIONS_PER_GAME, TIMER_MS } from '../constants';
import { OptionLetterSchema, PublicQuestionSchema } from './question';

export const CreateGameSchema = z.object({
  playerId: z.string().min(1),
});

export const SubmitAnswerSchema = z.object({
  questionId: z.string().min(1),
  selectedOption: OptionLetterSchema,
  elapsedMs: z.number().int().min(0).max(TIMER_MS),
});

export const StartGameResponseSchema = z.object({
  gameId: z.string(),
  questions: z.array(PublicQuestionSchema).length(QUESTIONS_PER_GAME),
});

export const SubmitAnswerResultSchema = z.object({
  isCorrect: z.boolean(),
  correctOption: OptionLetterSchema,
  pointsEarned: z.number().int(),
  score: z.number().int(),
  finished: z.boolean(),
});

export const LeaderboardEntrySchema = z.object({
  nickname: z.string(),
  score: z.number().int(),
  finishedAt: z.string().datetime(),
});

export type CreateGame = z.infer<typeof CreateGameSchema>;
export type SubmitAnswer = z.infer<typeof SubmitAnswerSchema>;
export type StartGameResponse = z.infer<typeof StartGameResponseSchema>;
export type SubmitAnswerResult = z.infer<typeof SubmitAnswerResultSchema>;
export type LeaderboardEntry = z.infer<typeof LeaderboardEntrySchema>;
