import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { generatePDF, generateCoverLetterPDF, TemplateId } from '../services/pdf.service';
import { saveDocumentToHistory, isUserPremium } from '../services/storage.service';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { trackScreenView, trackEvent, AnalyticsEvent } from '../services/analytics.service';

export default function PreviewScreen({ route, navigation }: any) {
  const { t } = useTranslation();
  const { formData, cvData } = route.params;
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>('standard');
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    trackScreenView('Preview');
    const checkPremium = async () => {
      const status = await isUserPremium();
      setIsPremium(status);
    };
    checkPremium();
  }, []);

  const templates: { id: TemplateId, name: string, icon: string, premium?: boolean }[] = [
    { id: 'standard', name: 'Standard', icon: 'document-outline' },
    { id: 'modern', name: 'Moderne', icon: 'code-working-outline', premium: true },
    { id: 'creative', name: 'Créatif', icon: 'color-palette-outline', premium: true },
    { id: 'executive', name: 'Exécutif', icon: 'briefcase-outline', premium: true },
  ];

  const handleSelectTemplate = (template: any) => {
    if (template.premium && !isPremium) {
      trackEvent(AnalyticsEvent.PREMIUM_VIEWED, { reason: 'premium_template', template: template.id });
      navigation.navigate('Premium');
    } else {
      setSelectedTemplate(template.id);
    }
  };

  const handleDownloadCV = async () => {
    try {
      await generatePDF(formData, cvData, selectedTemplate);
      trackEvent(AnalyticsEvent.PDF_DOWNLOADED, { type: 'cv', template: selectedTemplate });
      // Save to history
      await saveDocumentToHistory({
        id: Date.now().toString(),
        date: new Date().toISOString(),
        formData,
        cvData
      });
    } catch (error) {
      Alert.alert(t('common.limit_reached_title'), t('common.error_generating'));
    }
  };

  const handleDownloadCoverLetter = async () => {
    try {
      await generateCoverLetterPDF(formData, cvData, selectedTemplate);
      trackEvent(AnalyticsEvent.PDF_DOWNLOADED, { type: 'cover_letter', template: selectedTemplate });
    } catch (error) {
      Alert.alert(t('common.limit_reached_title'), t('common.error_generating'));
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{t('common.preview_title')}</Text>
        
        <View style={styles.previewCard}>
          <Text style={styles.previewName}>{formData.fullName}</Text>
          <Text style={styles.previewJob}>{formData.jobTitle}</Text>
          <Text style={styles.previewSummary} numberOfLines={3}>{cvData.summary}</Text>
        </View>

        <Text style={styles.sectionTitle}>{t('common.choose_template')}</Text>
        <View style={styles.templateGrid}>
          {templates.map((template) => (
            <TouchableOpacity 
              key={template.id}
              style={[
                styles.templateItem,
                selectedTemplate === template.id && styles.selectedTemplate,
                template.premium && styles.premiumTemplate
              ]}
              onPress={() => handleSelectTemplate(template)}
            >
              <Ionicons 
                name={template.icon as any} 
                size={32} 
                color={selectedTemplate === template.id ? '#007AFF' : '#666'} 
              />
              <Text style={[
                styles.templateName,
                selectedTemplate === template.id && styles.selectedTemplateText
              ]}>
                {template.name}
              </Text>
              {template.premium && <View style={styles.premiumBadge}><Text style={styles.premiumBadgeText}>PRO</Text></View>}
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.downloadButton} onPress={handleDownloadCV}>
          <Ionicons name="download-outline" size={24} color="#fff" style={{ marginRight: 10 }} />
          <Text style={styles.downloadButtonText}>{t('common.download_cv')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.downloadButton, styles.secondaryButton]} onPress={handleDownloadCoverLetter}>
          <Ionicons name="mail-outline" size={24} color="#fff" style={{ marginRight: 10 }} />
          <Text style={styles.downloadButtonText}>{t('common.cover_letter')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.editButton} onPress={() => navigation.goBack()}>
          <Text style={styles.editButtonText}>{t('common.edit_info')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  previewCard: {
    backgroundColor: '#fff',
    width: '100%',
    padding: 20,
    borderRadius: 15,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  previewName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  previewJob: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  previewSummary: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginBottom: 15,
    color: '#333',
  },
  templateGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 30,
  },
  templateItem: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  selectedTemplate: {
    borderColor: '#007AFF',
    backgroundColor: '#EBF5FF',
  },
  premiumTemplate: {
    // Styling for premium templates if needed
  },
  templateName: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
  selectedTemplateText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  premiumBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#FFD700',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  premiumBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000',
  },
  downloadButton: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    width: '100%',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  secondaryButton: {
    backgroundColor: '#34C759',
  },
  downloadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  editButton: {
    marginTop: 10,
    padding: 10,
  },
  editButtonText: {
    color: '#007AFF',
    fontSize: 15,
  },
});
