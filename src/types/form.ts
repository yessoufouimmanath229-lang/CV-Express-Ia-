import { z } from 'zod';

export const cvFormSchema = z.object({
  fullName: z.string().min(2, 'Le nom complet est requis'),
  email: z.string().email('Email invalide'),
  phone: z.string().min(10, 'Numéro de téléphone invalide'),
  jobTitle: z.string().min(2, 'Le poste visé est requis'),
  education: z.string().min(2, 'Le niveau d\'études est requis'),
  experience: z.string().min(10, 'Décrivez brièvement vos expériences'),
  skills: z.string().min(2, 'Vos compétences clés sont requises'),
  targetLanguage: z.enum(['fr', 'en']).default('fr'),
  additionalInfo: z.string().optional(),
});

export type CVFormValues = z.infer<typeof cvFormSchema>;
