import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { WorkoutPlansScreen } from '../screens/WorkoutPlansScreen';

import { ProgressScreen } from '../screens/ProgressScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { Theme } from '../theme';

export type MainTabParamList = {
  WorkoutPlans: undefined;
  Progress: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: {
          backgroundColor: Theme.colors.background,
        },
        headerTintColor: Theme.colors.text,
        tabBarStyle: {
          backgroundColor: Theme.colors.background,
        },
        tabBarActiveTintColor: Theme.colors.primary,
        tabBarInactiveTintColor: Theme.colors.gray[500],
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'WorkoutPlans') {
            iconName = focused ? 'barbell' : 'barbell-outline';
          } else if (route.name === 'Progress') {
            iconName = focused ? 'trending-up' : 'trending-up-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName as string} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="WorkoutPlans"
        component={WorkoutPlansScreen}
        options={{ title: 'Workouts' }}
      />
      <Tab.Screen
        name="Progress"
        component={ProgressScreen}
        options={{ title: 'Progress' }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
    </Tab.Navigator>
  );
};
