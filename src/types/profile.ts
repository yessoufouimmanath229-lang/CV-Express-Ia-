export interface Profile {
  id: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  referral_code: string;
  referred_by?: string;
  is_premium: boolean;
  credits: number;
  updated_at?: string;
}
