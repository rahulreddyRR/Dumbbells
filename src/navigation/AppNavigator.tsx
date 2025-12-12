import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainTabNavigator } from './MainTabNavigator';

export type RootStackParamList = {
  WorkoutDetails: { planId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// Lazy load to avoid cycle or early import issues if needed, but direct import is fine here
import { WorkoutDetailsScreen } from '../screens/workouts/WorkoutDetailsScreen';

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
          component={WorkoutDetailsScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
