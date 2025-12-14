import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainTabNavigator } from './MainTabNavigator';
import { useUserProfileStore } from '../store/userProfileStore';

export type RootStackParamList = {
  Main: undefined;
  Onboarding: undefined;
  WorkoutDetails: { planId: string };
  WorkoutTracking: { planId: string; day: number };
  CreateCustomPlan: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();


export const AppNavigator = () => {
  const hasCompletedOnboarding = useUserProfileStore((state) => state.hasCompletedOnboarding);
  const hasHydrated = useUserProfileStore((state) => state._hasHydrated);

  if (!hasHydrated) {
    return null; // Or a Splash Screen
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={hasCompletedOnboarding ? "Main" : "Onboarding"}
      >
        <Stack.Screen
          name="Onboarding"
          getComponent={() => require('../screens/onboarding/OnboardingScreen').OnboardingScreen}
        />
        <Stack.Screen
          name="Main"
          component={MainTabNavigator}
        />
        <Stack.Screen
          name="WorkoutDetails"
          getComponent={() => require('../screens/workouts/WorkoutDetailsScreen').WorkoutDetailsScreen}
        />
        <Stack.Screen
          name="WorkoutTracking"
          getComponent={() => require('../screens/workouts/WorkoutTrackingScreen').WorkoutTrackingScreen}
        />
        <Stack.Screen
          name="CreateCustomPlan"
          getComponent={() => require('../screens/workouts/CreateCustomPlanScreen').CreateCustomPlanScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
