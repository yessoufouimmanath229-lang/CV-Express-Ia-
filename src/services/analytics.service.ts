// Simple analytics service
// This could be integrated with Firebase Analytics, Segment, or Expo Analytics

export enum AnalyticsEvent {
  APP_OPENED = 'app_opened',
  FORM_STARTED = 'form_started',
  FORM_COMPLETED = 'form_completed',
  CV_GENERATED = 'cv_generated',
  PDF_DOWNLOADED = 'pdf_downloaded',
  PREMIUM_VIEWED = 'premium_viewed',
  PREMIUM_CLICKED = 'premium_clicked',
  PREMIUM_SUBSCRIBED = 'premium_subscribed',
  LANGUAGE_CHANGED = 'language_changed',
}

export const trackEvent = (event: AnalyticsEvent, properties?: Record<string, any>) => {
  console.log(`[Analytics] Event: ${event}`, properties || '');
  // Integration with real SDK would go here:
  // firebase.analytics().logEvent(event, properties);
};

export const trackScreenView = (screenName: string) => {
  console.log(`[Analytics] Screen View: ${screenName}`);
  // firebase.analytics().logScreenView({ screen_name: screenName, screen_class: screenName });
};
