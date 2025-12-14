import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserProfile {
  name: string;
  weight: number; // kg
  height: number; // cm
  age: number;
  fitnessGoal: 'weight_loss' | 'muscle_gain' | 'maintenance' | 'general_fitness';
}

interface UserProfileState {
  profile: UserProfile;
  updateProfile: (profile: Partial<UserProfile>) => void;
  resetProfile: () => void;
}

const defaultProfile: UserProfile = {
  name: '',
  weight: 70,
  height: 170,
  age: 25,
  fitnessGoal: 'general_fitness',
};

export const useUserProfileStore = create<UserProfileState>()(
  persist(
    (set) => ({
      profile: defaultProfile,
      updateProfile: (updates) => set((state) => ({
        profile: { ...state.profile, ...updates }
      })),
      resetProfile: () => set({ profile: defaultProfile }),
    }),
    {
      name: 'user-profile-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
