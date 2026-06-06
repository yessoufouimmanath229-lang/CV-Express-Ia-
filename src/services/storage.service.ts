import AsyncStorage from '@react-native-async-storage/async-storage';
import { CVFormValues } from '../types/form';
import { GeneratedCV } from '../types/cv';
import { supabase } from './supabase.service';
import { getProfile } from './profile.service';

const FORM_DATA_KEY = '@cv_express_form_data';
const DOCUMENTS_HISTORY_KEY = '@cv_express_documents_history';
const IS_PREMIUM_KEY = '@cv_express_is_premium';

export interface SavedDocument {
  id: string;
  date: string;
  formData: CVFormValues;
  cvData: GeneratedCV;
  title?: string;
  template_id?: string;
}

export const saveFormData = async (data: CVFormValues) => {
  try {
    await AsyncStorage.setItem(FORM_DATA_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving form data:', error);
  }
};

export const getFormData = async (): Promise<CVFormValues | null> => {
  try {
    const data = await AsyncStorage.getItem(FORM_DATA_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting form data:', error);
    return null;
  }
};

export const saveDocumentToHistory = async (document: SavedDocument) => {
  try {
    // 1. Save locally
    const historyJson = await AsyncStorage.getItem(DOCUMENTS_HISTORY_KEY);
    const history: SavedDocument[] = historyJson ? JSON.parse(historyJson) : [];
    history.unshift(document);
    await AsyncStorage.setItem(DOCUMENTS_HISTORY_KEY, JSON.stringify(history));

    // 2. Sync to Cloud if logged in
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const { error } = await supabase
        .from('documents')
        .insert({
          id: document.id,
          user_id: session.user.id,
          title: document.formData.jobTitle,
          form_data: document.formData,
          cv_data: document.cvData,
          template_id: document.template_id || 'standard',
          created_at: document.date
        });
      
      if (error) console.error('Cloud sync error:', error.message);
    }
  } catch (error) {
    console.error('Error saving document to history:', error);
  }
};

export const getDocumentsHistory = async (): Promise<SavedDocument[]> => {
  try {
    // 1. Get local history
    const historyJson = await AsyncStorage.getItem(DOCUMENTS_HISTORY_KEY);
    let localHistory: SavedDocument[] = historyJson ? JSON.parse(historyJson) : [];

    // 2. Try to fetch from cloud and merge if logged in
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const { data: cloudDocs, error } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (!error && cloudDocs) {
        const mappedCloudDocs: SavedDocument[] = cloudDocs.map(doc => ({
          id: doc.id,
          date: doc.created_at,
          formData: doc.form_data,
          cvData: doc.cv_data,
          template_id: doc.template_id
        }));

        // Simple merge: Use Cloud as source of truth for the history list
        // and update local cache
        await AsyncStorage.setItem(DOCUMENTS_HISTORY_KEY, JSON.stringify(mappedCloudDocs));
        return mappedCloudDocs;
      }
    }

    return localHistory;
  } catch (error) {
    console.error('Error getting documents history:', error);
    return [];
  }
};

export const isUserPremium = async (): Promise<boolean> => {
  try {
    // 1. Check local storage
    const localPremium = await AsyncStorage.getItem(IS_PREMIUM_KEY);
    if (localPremium === 'true') return true;

    // 2. Check profile if logged in
    const profile = await getProfile();
    return profile?.is_premium || false;
  } catch (error) {
    return false;
  }
};

export const setPremiumStatus = async (premium: boolean) => {
  try {
    await AsyncStorage.setItem(IS_PREMIUM_KEY, premium ? 'true' : 'false');
  } catch (error) {
    console.error('Error setting premium status:', error);
  }
};

export const canGenerateMore = async (): Promise<boolean> => {
  const premium = await isUserPremium();
  if (premium) return true;
  
  const history = await getDocumentsHistory();
  const profile = await getProfile();
  
  // Base limit is 1, plus any referral credits
  const bonusCredits = profile?.credits || 0;
  return history.length < (1 + bonusCredits);
};
