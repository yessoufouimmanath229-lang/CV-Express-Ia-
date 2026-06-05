import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import './src/i18n';
import { trackEvent, AnalyticsEvent } from './src/services/analytics.service';
import { supabase } from './src/services/supabase.service';

export default function App() {
  useEffect(() => {
    trackEvent(AnalyticsEvent.APP_OPENED);

    // Initial sync / session check
    supabase.auth.onAuthStateChange((_event, session) => {
      console.log(`[Supabase] Auth state changed: ${_event}`);
      if (session) {
        trackEvent(AnalyticsEvent.CV_GENERATED, { authenticated: true }); // Example
      }
    });
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <AppNavigator />
    </SafeAreaProvider>
  );
}
