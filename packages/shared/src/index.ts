export { z } from 'zod';

export const SHARED_PACKAGE_VERSION = '0.0.0';

export {
  QUESTIONS_PER_GAME,
  TIMER_SECONDS,
  TIMER_MS,
} from './constants';

export {
  NicknameSchema,
  CreatePlayerSchema,
  type Nickname,
  type CreatePlayer,
} from './schemas/player';

export {
  OptionLetterSchema,
  PublicQuestionSchema,
  type OptionLetter,
  type PublicQuestion,
} from './schemas/question';

export {
  SubmitAnswerSchema,
  StartGameResponseSchema,
  LeaderboardEntrySchema,
  type SubmitAnswer,
  type StartGameResponse,
  type LeaderboardEntry,
} from './schemas/game';
