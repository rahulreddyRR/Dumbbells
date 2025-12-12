import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Screen } from '../../components/common/Screen';
import { Theme } from '../../theme';

export const PredefinedWorkoutsScreen = () => {
  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.title}>Predefined Workouts</Text>
        <Text style={styles.subtitle}>List of ready-made plans</Text>
        {/* Placeholder for list */}
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Theme.spacing.m,
  },
  title: {
    ...Theme.textVariants.header,
    textAlign: 'center',
    marginBottom: Theme.spacing.s,
  },
  subtitle: {
    ...Theme.textVariants.body,
    textAlign: 'center',
  },
});
