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

export type Nickname = z.infer<typeof NicknameSchema>;
export type CreatePlayer = z.infer<typeof CreatePlayerSchema>;
