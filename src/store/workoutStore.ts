import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WorkoutPlan } from '../data/workoutPlans';

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
  customPlans: WorkoutPlan[];
  addCompletedWorkout: (workout: CompletedWorkout) => void;
  startSession: (session: ActiveSession) => void;
  updateSession: (updates: Partial<ActiveSession>) => void;
  clearSession: () => void;
  addCustomPlan: (plan: WorkoutPlan) => void;
  getCustomPlans: () => WorkoutPlan[];
  clearWorkoutHistory: () => void;
  deleteCustomPlans: () => void;
  deleteCustomPlan: (planId: string) => void;
}

export const useWorkoutStore = create<StoreState>()(
  persist(
    (set, get) => ({
      completedWorkouts: [],
      activeSession: null,
      customPlans: [],
      addCompletedWorkout: (workout) => set((state) => ({ 
        completedWorkouts: [...state.completedWorkouts, workout] 
      })),
      startSession: (session) => set({ activeSession: session }),
      updateSession: (updates) => set((state) => ({
        activeSession: state.activeSession ? { ...state.activeSession, ...updates } : null
      })),
      clearSession: () => set({ activeSession: null }),
      addCustomPlan: (plan) => set((state) => ({
        customPlans: [...state.customPlans, plan]
      })),
      getCustomPlans: () => get().customPlans,
      clearWorkoutHistory: () => set({ completedWorkouts: [] }),
      deleteCustomPlans: () => set({ customPlans: [] }),
      deleteCustomPlan: (planId) => set((state) => ({
        customPlans: state.customPlans.filter(plan => plan.id !== planId)
      })),
    }),
    {
      name: 'workout-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

