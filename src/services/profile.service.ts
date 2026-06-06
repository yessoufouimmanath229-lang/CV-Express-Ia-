import { supabase } from './supabase.service';
import { Profile } from '../types/profile';

export const getProfile = async (): Promise<Profile | null> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error.message);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Profile service error:', error);
    return null;
  }
};

export const updateProfile = async (updates: Partial<Profile>): Promise<boolean> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return false;

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', session.user.id);

    if (error) {
      console.error('Error updating profile:', error.message);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Profile update error:', error);
    return false;
  }
};
