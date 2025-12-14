import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainTabNavigator } from './MainTabNavigator';

export type RootStackParamList = {
  Main: undefined;
  WorkoutDetails: { planId: string };
  WorkoutTracking: { planId: string; day: number };
  CreateCustomPlan: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();


export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
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
