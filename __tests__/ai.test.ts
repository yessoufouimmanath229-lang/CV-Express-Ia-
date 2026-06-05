import { generateCVContent } from '../src/services/ai.service';
import { CVFormValues } from '../src/types/form';

// Mocking fetch
global.fetch = jest.fn() as jest.Mock;

describe('AI Service', () => {
  const mockFormData: CVFormValues = {
    fullName: 'Jean Dupont',
    email: 'jean.dupont@example.com',
    phone: '0612345678',
    jobTitle: 'Développeur',
    education: 'Bac+5',
    experience: '3 ans d\'expérience en React',
    skills: 'React, JS',
    targetLanguage: 'fr'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_OPENAI_API_KEY = 'test-key';
  });

  it('should call OpenAI API with correct parameters', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: JSON.stringify({
                summary: 'Summary',
                experiences: [],
                education: [],
                skills: [],
                languages: [],
                interests: [],
                coverLetter: 'Letter'
              })
            }
          }
        ]
      })
    });

    await generateCVContent(mockFormData);

    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.openai.com/v1/chat/completions',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Authorization': 'Bearer test-key',
          'Content-Type': 'application/json'
        }),
        body: expect.stringContaining('Jean Dupont')
      })
    );
  });

  it('should use mock generator if API key is missing', async () => {
    delete process.env.EXPO_PUBLIC_OPENAI_API_KEY;
    
    // We expect it to not call fetch
    const result = await generateCVContent(mockFormData);
    
    expect(global.fetch).not.toHaveBeenCalled();
    expect(result.summary).toContain('Jean Dupont'); // mock generates this
  });
});
