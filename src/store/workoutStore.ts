import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface CompletedWorkout {
  id: string;
  date: string; // ISO string
  planId: string;
  planName: string;
  durationMinutes: number;
  caloriesBurned: number;
  weightLifted: number;
}

export interface ActiveSession {
  planId: string;
  day: number;
  currentStepIndex: number;
  completedWeight: number;
  accumulatedCalories: number;
  startTime: string; // ISO string
  restEndTime: string | null; // ISO string for when rest ends
}

interface StoreState {
  completedWorkouts: CompletedWorkout[];
  activeSession: ActiveSession | null;
  addCompletedWorkout: (workout: CompletedWorkout) => void;
  startSession: (session: ActiveSession) => void;
  updateSession: (updates: Partial<ActiveSession>) => void;
  clearSession: () => void;
}

export const useWorkoutStore = create<StoreState>()(
  persist(
    (set) => ({
      completedWorkouts: [],
      activeSession: null,
      addCompletedWorkout: (workout) => set((state) => ({ 
        completedWorkouts: [...state.completedWorkouts, workout] 
      })),
      startSession: (session) => set({ activeSession: session }),
      updateSession: (updates) => set((state) => ({
        activeSession: state.activeSession ? { ...state.activeSession, ...updates } : null
      })),
      clearSession: () => set({ activeSession: null }),
    }),
    {
      name: 'workout-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
