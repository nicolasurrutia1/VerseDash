import { z } from 'zod';

export const OptionLetterSchema = z.enum(['A', 'B', 'C', 'D']);

export const PublicQuestionSchema = z.object({
  id: z.string(),
  text: z.string(),
  reference: z.string(),
  optionA: z.string(),
  optionB: z.string(),
  optionC: z.string(),
  optionD: z.string(),
});

export type OptionLetter = z.infer<typeof OptionLetterSchema>;
export type PublicQuestion = z.infer<typeof PublicQuestionSchema>;
