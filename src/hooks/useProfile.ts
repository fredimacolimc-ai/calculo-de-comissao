import { useState, useEffect } from 'react';
import type { Profile } from '@/types';

const STORAGE_KEY = 'minhas-viagens-profile';

const DEFAULT_PROFILE: Profile = {
  name: '',
  vehicle_plate: '',
  default_commission: 7,
};

export function useProfile() {
  const [profile, setProfile] = useState<Profile>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? { ...DEFAULT_PROFILE, ...JSON.parse(raw) } : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }, [profile]);

  const updateProfile = (updates: Partial<Profile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  return { profile, updateProfile };
}
