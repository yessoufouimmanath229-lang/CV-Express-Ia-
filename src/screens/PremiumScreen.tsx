import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView, Alert, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { setPremiumStatus } from '../services/storage.service';
import { useTranslation } from 'react-i18next';
import { trackScreenView, trackEvent, AnalyticsEvent } from '../services/analytics.service';

export default function PremiumScreen({ navigation }: any) {
  const { t } = useTranslation();

  React.useEffect(() => {
    trackScreenView('Premium');
  }, []);
  const features = [
    { icon: 'infinite', title: t('premium.feature_unlimited'), description: t('premium.feature_unlimited_desc') },
    { icon: 'color-palette', title: t('premium.feature_designs'), description: t('premium.feature_designs_desc') },
    { icon: 'document-attach', title: t('premium.feature_pdf'), description: t('premium.feature_pdf_desc') },
    { icon: 'rocket', title: t('premium.feature_ai'), description: t('premium.feature_ai_desc') },
  ];

  const handleSubscribe = async () => {
    trackEvent(AnalyticsEvent.PREMIUM_CLICKED);
    // Simulation d'un achat réussi
    await setPremiumStatus(true);
    trackEvent(AnalyticsEvent.PREMIUM_SUBSCRIBED);
    Alert.alert(
      t('premium.congrats'),
      t('premium.activated_msg'),
      [{ text: t('premium.super'), onPress: () => navigation.goBack() }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={28} color="#E2E8F0" />
        </TouchableOpacity>

        <View style={styles.header}>
          <View style={styles.goldBadge}>
            <Text style={styles.goldBadgeText}>{t('premium.offer_limited')}</Text>
          </View>
          <Text style={styles.title}>{t('premium.title')}</Text>
          <Text style={styles.subtitle}>{t('premium.subtitle')}</Text>
        </View>

        <View style={styles.featuresList}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Ionicons name={feature.icon as any} size={24} color="#D4AF37" />
              </View>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.pricingSection}>
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>{t('premium.only')}</Text>
            <Text style={styles.price}>4,99€ <Text style={styles.period}>{t('premium.per_month')}</Text></Text>
            <Text style={styles.pricingNote}>{t('premium.no_commitment')}</Text>
          </View>
          
          <TouchableOpacity style={styles.ctaButton} onPress={handleSubscribe}>
            <Text style={styles.ctaButtonText}>{t('premium.subscribe')}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.ghostButton} onPress={() => navigation.goBack()}>
            <Text style={styles.ghostButtonText}>{t('premium.continue_free')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>{t('premium.footer_terms')}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A202C',
  },
  content: {
    padding: 24,
    paddingTop: 40,
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: 20,
    zIndex: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  goldBadge: {
    backgroundColor: '#D4AF37',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 16,
  },
  goldBadgeText: {
    color: '#1A202C',
    fontWeight: '800',
    fontSize: 10,
    letterSpacing: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFFFFF',
    marginBottom: 12,
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 16,
    color: '#E2E8F0',
    textAlign: 'center',
    paddingHorizontal: 10,
    lineHeight: 22,
  },
  featuresList: {
    marginBottom: 40,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 16,
    borderRadius: 16,
  },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#A0AEC0',
    lineHeight: 20,
  },
  pricingSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  priceContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  priceLabel: {
    color: '#A0AEC0',
    fontSize: 14,
    marginBottom: 4,
  },
  price: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  period: {
    fontSize: 18,
    color: '#E2E8F0',
    fontWeight: 'normal',
  },
  pricingNote: {
    fontSize: 14,
    color: '#718096',
    marginTop: 8,
  },
  ctaButton: {
    backgroundColor: '#D4AF37',
    width: '100%',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  ctaButtonText: {
    color: '#1A202C',
    fontSize: 18,
    fontWeight: 'bold',
  },
  ghostButton: {
    padding: 12,
  },
  ghostButtonText: {
    color: '#A0AEC0',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  footer: {
    marginTop: 20,
    paddingBottom: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#718096',
    textAlign: 'center',
    lineHeight: 18,
  },
});
