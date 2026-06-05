import { CVFormValues } from '../types/form';
import { GeneratedCV, generatedCVSchema } from '../types/cv';

export const generateCVContent = async (formData: CVFormValues): Promise<GeneratedCV> => {
  const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
  console.log('Génération du contenu avec l\'IA pour:', formData.fullName);
  
  if (!apiKey) {
    console.warn('OPENAI_API_KEY is missing. Using mock data for now.');
    return mockGenerateCVContent(formData);
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo-1106', // Or gpt-4
        messages: [
          {
            role: 'system',
            content: `Tu es un expert en recrutement et en rédaction de CV professionnels. 
            Ta mission est de générer un CV et une lettre de motivation percutants basés sur les informations fournies.
            
            L'intégralité du contenu généré doit être en ${formData.targetLanguage === 'fr' ? 'Français' : 'Anglais'}.

            CONSIGNES POUR LE CV :
            - Le "summary" doit être un paragraphe d'accroche de 3-4 lignes maximum, mettant en avant la valeur ajoutée du candidat.
            - Les "experiences" doivent détailler les missions avec des verbes d'action et inclure des résultats si possible.
            - Les "skills" doivent inclure des mots-clés pertinents pour le poste visé (optimisation ATS).
            - Utilise un ton professionnel, dynamique et moderne.

            CONSIGNES POUR LA LETTRE :
            - La lettre doit être personnalisée pour le poste visé.
            - Elle doit faire environ 250-300 mots.
            - Structure : Accroche percutante, lien entre le profil et les besoins de l'entreprise, appel à l'action (entretien).

            FORMAT DE RÉPONSE :
            Tu dois impérativement répondre au format JSON pur selon ce schéma :
            {
              "summary": "string",
              "experiences": [{ "title": "string", "company": "string", "duration": "string", "description": "string" }],
              "education": [{ "degree": "string", "school": "string", "year": "string" }],
              "skills": ["string"],
              "languages": ["string"],
              "interests": ["string"],
              "coverLetter": "string"
            }`
          },
          {
            role: 'user',
            content: `Voici mes informations : 
            Nom: ${formData.fullName}
            Email: ${formData.email}
            Téléphone: ${formData.phone}
            Poste visé: ${formData.jobTitle}
            Formation: ${formData.education}
            Expériences: ${formData.experience}
            Compétences: ${formData.skills}
            Infos sup: ${formData.additionalInfo || 'N/A'}`
          }
        ],
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = JSON.parse(data.choices[0].message.content);
    
    // Validate with Zod
    return generatedCVSchema.parse(content);
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    throw error;
  }
};

// Fallback mock function
const mockGenerateCVContent = async (formData: CVFormValues): Promise<GeneratedCV> => {
  await new Promise(resolve => setTimeout(resolve, 500)); // Shortened for tests
  return {
    summary: `Professionnel dynamique et motivé, ${formData.fullName} est spécialisé en ${formData.skills}.`,
    experiences: [
      {
        title: formData.jobTitle,
        company: "Entreprise Innovante",
        duration: "2022 - Présent",
        description: `En tant que ${formData.jobTitle}, j'ai travaillé sur des projets utilisant ${formData.skills}. ${formData.experience}`,
      }
    ],
    education: [
      {
        degree: formData.education,
        school: "Université de Technologie",
        year: "2021",
      }
    ],
    skills: formData.skills.split(',').map(s => s.trim()),
    languages: ["Français (Maternel)", "Anglais (B2)"],
    interests: ["Nouvelles technologies", "Voyages"],
    coverLetter: `Objet : Candidature pour le poste de ${formData.jobTitle}\n\nMadame, Monsieur,\n\nC'est avec un grand intérêt que je vous adresse ma candidature pour le poste de ${formData.jobTitle} au sein de votre entreprise...\n\nCordialement,\n${formData.fullName}`,
  };
};
