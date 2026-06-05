import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { GeneratedCV } from '../types/cv';
import { CVFormValues } from '../types/form';

export type TemplateId = 'standard' | 'modern' | 'creative' | 'executive';

export const getTemplateStyle = (templateId: TemplateId) => {
  switch (templateId) {
    case 'modern':
      return `
        :root {
          --primary-color: #3182CE;
          --text-color: #E2E8F0;
          --title-color: #FFFFFF;
          --bg-color: #1A202C;
          --font-family: 'Helvetica', sans-serif;
        }
        body { background-color: var(--bg-color); color: var(--text-color); padding: 40px; }
        header { border-bottom: 2px solid var(--primary-color); padding-bottom: 20px; margin-bottom: 30px; }
        h1 { font-size: 32px; letter-spacing: 1px; }
        .section-title { color: var(--primary-color); font-size: 18px; font-weight: bold; margin-top: 30px; margin-bottom: 15px; text-transform: uppercase; border-left: 4px solid var(--primary-color); padding-left: 10px; }
        .skill-tag { background: #2D3748; border: 1px solid var(--primary-color); color: var(--primary-color); padding: 4px 10px; border-radius: 4px; font-family: monospace; }
        .item-header { color: var(--title-color); }
        .item-subtitle { color: #A0AEC0; font-weight: 500; }
        .summary { background: #2D3748; border-radius: 8px; padding: 20px; border-left: 4px solid var(--primary-color); margin-bottom: 25px; }
      `;
    case 'creative':
      return `
        :root {
          --primary-color: #2C7A7B;
          --secondary-color: #D69E2E;
          --text-color: #2D3748;
          --title-color: #2C7A7B;
          --bg-color: #FFFCF5;
          --font-family: 'Trebuchet MS', sans-serif;
        }
        body { background-color: var(--bg-color); padding: 0; }
        .main-container { padding: 40px; }
        header { background: var(--primary-color); color: white; padding: 50px 40px; margin-bottom: 30px; border-bottom: 8px solid var(--secondary-color); }
        header h1 { color: white; font-size: 42px; margin: 0; }
        .contact-info { color: #B2F5EA; font-size: 16px; margin-top: 10px; }
        .section-title { color: var(--secondary-color); font-size: 24px; border-bottom: 2px dashed var(--secondary-color); margin-top: 35px; padding-bottom: 5px; }
        .skill-tag { background: var(--secondary-color); color: white; padding: 6px 15px; border-radius: 20px; font-weight: bold; }
        .summary { border: 2px solid var(--primary-color); border-radius: 25px; padding: 25px; background: white; position: relative; margin-top: -50px; z-index: 1; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        .item-header span:first-child { color: var(--primary-color); font-size: 18px; }
      `;
    case 'executive':
      return `
        :root {
          --primary-color: #2A4365;
          --text-color: #1A202C;
          --title-color: #2A4365;
          --bg-color: #FFFFFF;
          --font-family: 'Georgia', serif;
        }
        body { padding: 50px; }
        header { text-align: center; border-bottom: 2px solid var(--primary-color); padding-bottom: 20px; margin-bottom: 40px; }
        header h1 { font-size: 36px; text-transform: uppercase; letter-spacing: 2px; }
        .section-title { text-align: center; border-top: 1px solid #CBD5E0; border-bottom: 1px solid #CBD5E0; padding: 10px 0; background: #F7FAFC; color: var(--primary-color); letter-spacing: 1px; font-weight: bold; margin-top: 40px; }
        .item-header { font-size: 18px; }
        .item-subtitle { color: #4A5568; text-transform: uppercase; font-size: 14px; letter-spacing: 1px; }
        .summary { text-align: center; font-style: italic; border: none; background: none; padding: 0 40px; margin-bottom: 30px; font-size: 17px; color: #4A5568; }
        .skill-tag { background: none; border: none; padding: 0; font-weight: bold; }
        .skills-list { justify-content: center; }
        .skill-tag::after { content: " • "; margin: 0 8px; }
        .skill-tag:last-child::after { content: ""; }
      `;
    default: // standard
      return `
        :root {
          --primary-color: #2D3748;
          --accent-color: #4A5568;
          --text-color: #2D3748;
          --title-color: #1A202C;
          --bg-color: #FFFFFF;
          --font-family: 'Arial', sans-serif;
        }
        body { padding: 40px; }
        header { border-left: 8px solid var(--primary-color); padding-left: 25px; margin-bottom: 35px; }
        h1 { font-size: 30px; }
        .section-title { border-bottom: 2px solid #E2E8F0; padding-bottom: 8px; margin-top: 30px; color: var(--title-color); font-weight: bold; }
        .skill-tag { background: #EDF2F7; color: var(--text-color); border-radius: 4px; }
        .item-header span:last-child { color: var(--accent-color); font-size: 14px; }
      `;
  }
};

export const generatePDF = async (formData: CVFormValues, cvData: GeneratedCV, templateId: TemplateId = 'standard') => {
  const templateStyle = getTemplateStyle(templateId);
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>CV - ${formData.fullName}</title>
        <style>
          body {
            font-family: var(--font-family);
            color: var(--text-color);
            line-height: 1.6;
            margin: 0;
            background: var(--bg-color);
          }
          ${templateStyle}
          .main-container {
            max-width: 800px;
            margin: 0 auto;
          }
          header h1 {
            margin: 0;
            color: var(--title-color);
          }
          .contact-info {
            font-size: 14px;
            margin-top: 5px;
          }
          .section-title {
            font-size: 18px;
            margin-bottom: 15px;
            text-transform: uppercase;
          }
          .item {
            margin-bottom: 20px;
          }
          .item-header {
            display: flex;
            justify-content: space-between;
            font-weight: bold;
          }
          .item-subtitle {
            font-style: italic;
            margin-bottom: 5px;
          }
          .item-description {
            font-size: 14px;
            white-space: pre-line;
          }
          .skills-list {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            list-style: none;
            padding: 0;
          }
          .skill-tag {
            padding: 5px 12px;
            font-size: 14px;
          }
          .summary {
            font-size: 15px;
            margin-bottom: 25px;
          }
        </style>
      </head>
      <body>
        <div class="main-container">
          <header>
            <h1>${formData.fullName}</h1>
            <div class="contact-info">
              ${formData.email} | ${formData.phone} | ${formData.jobTitle}
            </div>
          </header>

          <div class="summary">
            ${cvData.summary}
          </div>

          <div class="section-title">Expériences Professionnelles</div>
          ${cvData.experiences.map(exp => `
            <div class="item">
              <div class="item-header">
                <span>${exp.title}</span>
                <span>${exp.duration}</span>
              </div>
              <div class="item-subtitle">${exp.company}</div>
              <div class="item-description">${exp.description}</div>
            </div>
          `).join('')}

          <div class="section-title">Formation</div>
          ${cvData.education.map(edu => `
            <div class="item">
              <div class="item-header">
                <span>${edu.degree}</span>
                <span>${edu.year}</span>
              </div>
              <div class="item-subtitle">${edu.school}</div>
            </div>
          `).join('')}

          <div class="section-title">Compétences</div>
          <ul class="skills-list">
            ${cvData.skills.map(skill => `<li class="skill-tag">${skill}</li>`).join('')}
          </ul>

          ${cvData.languages && cvData.languages.length > 0 ? `
            <div class="section-title">Langues</div>
            <p>${cvData.languages.join(', ')}</p>
          ` : ''}

          ${cvData.interests && cvData.interests.length > 0 ? `
            <div class="section-title">Centres d'intérêt</div>
            <p>${cvData.interests.join(', ')}</p>
          ` : ''}
        </div>
      </body>
    </html>
  `;

  try {
    const { uri } = await Print.printToFileAsync({ html });
    await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
  } catch (error) {
    console.error('Erreur lors de la génération ou du partage du PDF:', error);
    throw error;
  }
};

export const generateCoverLetterPDF = async (formData: CVFormValues, cvData: GeneratedCV, templateId: TemplateId = 'standard') => {
  const templateStyle = getTemplateStyle(templateId);
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: var(--font-family); line-height: 1.6; color: var(--text-color); background: var(--bg-color); margin: 0; }
          ${templateStyle}
          .main-container { padding: 60px; max-width: 800px; margin: 0 auto; }
          header { margin-bottom: 40px; }
          .sender-info { margin-bottom: 40px; }
          .date { text-align: right; margin-bottom: 40px; }
          .content { white-space: pre-line; text-align: justify; }
          h1 { color: var(--title-color); }
        </style>
      </head>
      <body>
        <div class="main-container">
          <header>
            <h1>${formData.fullName}</h1>
            <div class="contact-info">
              ${formData.email} | ${formData.phone}
            </div>
          </header>
          <div class="date">
            Fait le ${new Date().toLocaleDateString('fr-FR')}
          </div>
          <div class="content">
            ${cvData.coverLetter}
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const { uri } = await Print.printToFileAsync({ html });
    await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
  } catch (error) {
    console.error('Erreur lors de la génération de la lettre:', error);
    throw error;
  }
};
