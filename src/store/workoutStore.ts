import { create } from 'zustand';

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
}

interface StoreState {
  completedWorkouts: CompletedWorkout[];
  activeSession: ActiveSession | null;
  addCompletedWorkout: (workout: CompletedWorkout) => void;
  startSession: (session: ActiveSession) => void;
  updateSession: (updates: Partial<ActiveSession>) => void;
  clearSession: () => void;
}

export const useWorkoutStore = create<StoreState>((set) => ({
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
}));
