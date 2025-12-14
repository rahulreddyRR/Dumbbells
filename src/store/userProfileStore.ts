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
  hasCompletedOnboarding: boolean;
  updateProfile: (profile: Partial<UserProfile>) => void;
  completeOnboarding: () => void;
  resetProfile: () => void;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
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
      hasCompletedOnboarding: false,
      updateProfile: (updates) => set((state) => ({
        profile: { ...state.profile, ...updates }
      })),
      completeOnboarding: () => set({ hasCompletedOnboarding: true }),
      resetProfile: () => set({ profile: defaultProfile, hasCompletedOnboarding: false }),
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: 'user-profile-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state?: UserProfileState) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
