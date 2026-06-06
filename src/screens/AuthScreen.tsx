import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { supabase } from '../services/supabase.service';
import { useTranslation } from 'react-i18next';

export default function AuthScreen({ navigation }: any) {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleMagicLink = async () => {
    if (!email) {
      Alert.alert(t('auth.error_title'), t('auth.error_email_required'));
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: 'cvexpressia://login-callback',
        data: {
          referral_code: referralCode.trim().toUpperCase() || undefined
        }
      },
    });

    setLoading(false);

    if (error) {
      Alert.alert(t('auth.error_title'), error.message);
    } else {
      Alert.alert(
        t('auth.success_title'),
        t('auth.success_msg'),
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('auth.title')}</Text>
      <Text style={styles.subtitle}>
        {t('auth.subtitle')}
      </Text>

      <TextInput
        style={styles.input}
        placeholder={t('auth.email_placeholder')}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder={t('auth.referral_code_placeholder') || 'Referral Code (Optional)'}
        value={referralCode}
        onChangeText={setReferralCode}
        autoCapitalize="characters"
      />

      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]} 
        onPress={handleMagicLink}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>{t('auth.send_link')}</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.ghostButton} onPress={() => navigation.goBack()}>
        <Text style={styles.ghostButtonText}>{t('auth.continue_guest')}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A202C',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#F7FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  ghostButton: {
    padding: 10,
    alignItems: 'center',
  },
  ghostButtonText: {
    color: '#718096',
    fontSize: 14,
  },
});
