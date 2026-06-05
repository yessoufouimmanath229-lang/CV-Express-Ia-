import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cvFormSchema, CVFormValues } from '../types/form';
import { getFormData, saveFormData, canGenerateMore } from '../services/storage.service';
import { generateCVContent } from '../services/ai.service';
import { useTranslation } from 'react-i18next';
import { trackScreenView, trackEvent, AnalyticsEvent } from '../services/analytics.service';

export default function FormScreen({ navigation }: any) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    trackScreenView('Form');
  }, []);
  const { control, handleSubmit, setValue, formState: { errors } } = useForm<CVFormValues>({
    resolver: zodResolver(cvFormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      jobTitle: '',
      education: '',
      experience: '',
      skills: '',
      targetLanguage: 'fr',
      additionalInfo: '',
    }
  });

  useEffect(() => {
    const loadSavedData = async () => {
      const savedData = await getFormData();
      if (savedData) {
        Object.keys(savedData).forEach((key) => {
          setValue(key as keyof CVFormValues, savedData[key as keyof CVFormValues]);
        });
      }
    };
    loadSavedData();
  }, [setValue]);

  const onSubmit = async (data: CVFormValues) => {
    const allowed = await canGenerateMore();
    if (!allowed) {
      trackEvent(AnalyticsEvent.PREMIUM_VIEWED, { reason: 'limit_reached_submit' });
      Alert.alert(
        t('common.limit_reached_title'),
        t('common.limit_reached_msg'),
        [
          { text: t('common.later'), style: "cancel" },
          { text: t('common.see_premium'), onPress: () => navigation.navigate('Premium') }
        ]
      );
      return;
    }

    setLoading(true);
    try {
      await saveFormData(data);
      const generated = await generateCVContent(data);
      trackEvent(AnalyticsEvent.FORM_COMPLETED);
      trackEvent(AnalyticsEvent.CV_GENERATED, { language: data.targetLanguage });
      navigation.navigate('Preview', { formData: data, cvData: generated });
    } catch (error) {
      console.error('Error generating CV:', error);
      Alert.alert(t('common.error_generating'));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>{t('common.loading')}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>{t('form.title')}</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{t('form.full_name')}</Text>
        <Controller
          control={control}
          name="fullName"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder={t('form.placeholder_name')}
            />
          )}
        />
        {errors.fullName && <Text style={styles.errorText}>{errors.fullName.message}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>{t('form.email')}</Text>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder={t('form.placeholder_email')}
              keyboardType="email-address"
            />
          )}
        />
        {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>{t('form.phone')}</Text>
        <Controller
          control={control}
          name="phone"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder={t('form.placeholder_phone')}
              keyboardType="phone-pad"
            />
          )}
        />
        {errors.phone && <Text style={styles.errorText}>{errors.phone.message}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>{t('form.job_title')}</Text>
        <Controller
          control={control}
          name="jobTitle"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder={t('form.placeholder_job')}
            />
          )}
        />
        {errors.jobTitle && <Text style={styles.errorText}>{errors.jobTitle.message}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>{t('form.education')}</Text>
        <Controller
          control={control}
          name="education"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder={t('form.placeholder_edu')}
            />
          )}
        />
        {errors.education && <Text style={styles.errorText}>{errors.education.message}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>{t('form.experience')}</Text>
        <Controller
          control={control}
          name="experience"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, styles.textArea]}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder={t('form.placeholder_exp')}
              multiline
              numberOfLines={4}
            />
          )}
        />
        {errors.experience && <Text style={styles.errorText}>{errors.experience.message}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>{t('form.skills')}</Text>
        <Controller
          control={control}
          name="skills"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder={t('form.placeholder_skills')}
            />
          )}
        />
        {errors.skills && <Text style={styles.errorText}>{errors.skills.message}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>{t('form.language_selection')}</Text>
        <Controller
          control={control}
          name="targetLanguage"
          render={({ field: { onChange, value } }) => (
            <View style={styles.languageContainer}>
              <TouchableOpacity 
                style={[styles.languageButton, value === 'fr' && styles.languageButtonActive]}
                onPress={() => onChange('fr')}
              >
                <Text style={[styles.languageButtonText, value === 'fr' && styles.languageButtonTextActive]}>{t('form.lang_fr')}</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.languageButton, value === 'en' && styles.languageButtonActive]}
                onPress={() => onChange('en')}
              >
                <Text style={[styles.languageButtonText, value === 'en' && styles.languageButtonTextActive]}>{t('form.lang_en')}</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.buttonText}>{t('form.generate')}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#666',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  languageContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  languageButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  languageButtonActive: {
    borderColor: '#007AFF',
    backgroundColor: '#EBF5FF',
  },
  languageButtonText: {
    fontSize: 16,
    color: '#666',
  },
  languageButtonTextActive: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
});
