export { z } from 'zod';

export const SHARED_PACKAGE_VERSION = '0.0.0';

export {
  QUESTIONS_PER_GAME,
  TIMER_SECONDS,
  TIMER_MS,
  BASE_POINTS,
  MAX_TIME_BONUS,
  calculatePoints,
} from './constants';

export {
  NicknameSchema,
  CreatePlayerSchema,
  PlayerResponseSchema,
  type Nickname,
  type CreatePlayer,
  type PlayerResponse,
} from './schemas/player';

export {
  OptionLetterSchema,
  PublicQuestionSchema,
  type OptionLetter,
  type PublicQuestion,
} from './schemas/question';

export {
  CreateGameSchema,
  SubmitAnswerSchema,
  StartGameResponseSchema,
  SubmitAnswerResultSchema,
  LeaderboardEntrySchema,
  type CreateGame,
  type SubmitAnswer,
  type StartGameResponse,
  type SubmitAnswerResult,
  type LeaderboardEntry,
} from './schemas/game';
