import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { canGenerateMore } from '../services/storage.service';
import { useIsFocused } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { trackScreenView, trackEvent, AnalyticsEvent } from '../services/analytics.service';
import { supabase } from '../services/supabase.service';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen({ navigation }: any) {
  const { t } = useTranslation();
  const [canCreate, setCanCreate] = useState(true);
  const [user, setUser] = useState<any>(null);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      trackScreenView('Home');
      const checkLimit = async () => {
        const allowed = await canGenerateMore();
        setCanCreate(allowed);
      };
      checkLimit();

      // Check current user
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null);
      });
    }
  }, [isFocused]);

  const handleCreateNew = () => {
    if (canCreate) {
      trackEvent(AnalyticsEvent.FORM_STARTED);
      navigation.navigate('Form');
    } else {
      trackEvent(AnalyticsEvent.PREMIUM_VIEWED, { reason: 'limit_reached' });
      Alert.alert(
        t('common.limit_reached_title'),
        t('common.limit_reached_msg'),
        [
          { text: t('common.later'), style: "cancel" },
          { text: t('common.see_premium'), onPress: () => navigation.navigate('Premium') }
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity 
          style={styles.authButton} 
          onPress={() => user ? supabase.auth.signOut().then(() => setUser(null)) : navigation.navigate('Auth')}
        >
          <Ionicons name={user ? "person-circle" : "person-circle-outline"} size={32} color="#007AFF" />
          <Text style={styles.authText}>{user ? t('common.logout') : t('common.login')}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>{t('common.welcome')}</Text>
      <Text style={styles.subtitle}>{t('common.subtitle')}</Text>
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={handleCreateNew}
      >
        <Text style={styles.buttonText}>{t('common.create_new')}</Text>
      </TouchableOpacity>

      {!canCreate && (
        <TouchableOpacity 
          style={styles.premiumLink} 
          onPress={() => navigation.navigate('Premium')}
        >
          <Text style={styles.premiumLinkText}>{t('common.premium_link')}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
    paddingTop: 40,
    marginBottom: 20,
  },
  authButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  authText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    marginTop: '30%',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  premiumLink: {
    marginTop: 20,
    padding: 10,
  },
  premiumLinkText: {
    color: '#FFD700',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  }
});
