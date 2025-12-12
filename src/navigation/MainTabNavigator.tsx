import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { WorkoutPlansScreen } from '../screens/WorkoutPlansScreen';
import { StatisticsScreen } from '../screens/StatisticsScreen';
import { ProgressScreen } from '../screens/ProgressScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { Theme } from '../theme';

export type MainTabParamList = {
  WorkoutPlans: undefined;
  Statistics: undefined;
  Progress: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainTabNavigator = () => {
  return (
    <Tab.Navigator
        screenOptions={{
            headerStyle: {
                backgroundColor: Theme.colors.background,
            },
            headerTintColor: Theme.colors.text,
            tabBarStyle: {
                backgroundColor: Theme.colors.background,
            },
            tabBarActiveTintColor: Theme.colors.primary,
            tabBarInactiveTintColor: Theme.colors.gray[500],
        }}
    >
      <Tab.Screen 
        name="WorkoutPlans" 
        component={WorkoutPlansScreen} 
        options={{ title: 'Workouts' }}
      />
      <Tab.Screen 
        name="Statistics" 
        component={StatisticsScreen} 
        options={{ title: 'Stats' }}
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
