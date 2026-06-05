import { cvFormSchema } from '../src/types/form';

describe('cvFormSchema Validation', () => {
  it('should validate a correct form data', () => {
    const validData = {
      fullName: 'Jean Dupont',
      email: 'jean.dupont@example.com',
      phone: '0612345678',
      jobTitle: 'Développeur Fullstack',
      education: 'Master en Informatique',
      experience: 'Développeur React chez StartupX pendant 3 ans.',
      skills: 'React, Node.js, TypeScript',
      targetLanguage: 'fr',
      additionalInfo: 'Permis B'
    };
    const result = cvFormSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should fail if email is invalid', () => {
    const invalidData = {
      fullName: 'Jean Dupont',
      email: 'invalid-email',
      phone: '0612345678',
      jobTitle: 'Développeur Fullstack',
      education: 'Master en Informatique',
      experience: 'Développeur React chez StartupX pendant 3 ans.',
      skills: 'React, Node.js, TypeScript',
      targetLanguage: 'fr'
    };
    const result = cvFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Email invalide');
    }
  });

  it('should fail if phone is too short', () => {
    const invalidData = {
      fullName: 'Jean Dupont',
      email: 'jean.dupont@example.com',
      phone: '123',
      jobTitle: 'Développeur Fullstack',
      education: 'Master en Informatique',
      experience: 'Développeur React chez StartupX pendant 3 ans.',
      skills: 'React, Node.js, TypeScript',
      targetLanguage: 'fr'
    };
    const result = cvFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Numéro de téléphone invalide');
    }
  });

  it('should fail if experience is too short', () => {
    const invalidData = {
      fullName: 'Jean Dupont',
      email: 'jean.dupont@example.com',
      phone: '0612345678',
      jobTitle: 'Développeur Fullstack',
      education: 'Master en Informatique',
      experience: 'Short',
      skills: 'React, Node.js, TypeScript',
      targetLanguage: 'fr'
    };
    const result = cvFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Décrivez brièvement vos expériences');
    }
  });
});
