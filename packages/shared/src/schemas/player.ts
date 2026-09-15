import { z } from 'zod';

export const NicknameSchema = z
  .string()
  .trim()
  .min(3)
  .max(20)
  .regex(/^[a-zA-Z0-9_]+$/);

export const CreatePlayerSchema = z.object({
  nickname: NicknameSchema,
});

export const PlayerResponseSchema = z.object({
  id: z.string(),
  nickname: z.string(),
});

export type Nickname = z.infer<typeof NicknameSchema>;
export type CreatePlayer = z.infer<typeof CreatePlayerSchema>;
export type PlayerResponse = z.infer<typeof PlayerResponseSchema>;
