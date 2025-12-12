import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { PredefinedWorkoutsScreen } from './workouts/PredefinedWorkoutsScreen';
import { IndividualWorkoutsScreen } from './workouts/IndividualWorkoutsScreen';
import { Theme } from '../theme';

const Tab = createMaterialTopTabNavigator();

export const WorkoutPlansScreen = () => {
  return (
    <Tab.Navigator
        screenOptions={{
            tabBarStyle: { backgroundColor: Theme.colors.background },
            tabBarLabelStyle: { fontWeight: 'bold' },
            tabBarIndicatorStyle: { backgroundColor: Theme.colors.primary },
            tabBarActiveTintColor: Theme.colors.primary,
            tabBarInactiveTintColor: Theme.colors.gray[500],
        }}
    >
      <Tab.Screen 
        name="Predefined" 
        component={PredefinedWorkoutsScreen} 
        options={{ title: 'Predefined' }}
      />
      <Tab.Screen 
        name="Individual" 
        component={IndividualWorkoutsScreen} 
        options={{ title: 'Individual' }}
      />
    </Tab.Navigator>
  );
};
