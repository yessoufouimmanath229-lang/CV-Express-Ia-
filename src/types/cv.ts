import { z } from 'zod';

export const generatedCVSchema = z.object({
  summary: z.string(),
  experiences: z.array(z.object({
    title: z.string(),
    company: z.string(),
    duration: z.string(),
    description: z.string(),
  })),
  education: z.array(z.object({
    degree: z.string(),
    school: z.string(),
    year: z.string(),
  })),
  skills: z.array(z.string()),
  languages: z.array(z.string()).optional(),
  interests: z.array(z.string()).optional(),
  coverLetter: z.string(),
});

export type GeneratedCV = z.infer<typeof generatedCVSchema>;
