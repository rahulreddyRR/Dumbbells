import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Screen } from '../../components/common/Screen';
import { Theme } from '../../theme';

export const IndividualWorkoutsScreen = () => {
  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.title}>Individual Workouts</Text>
        <Text style={styles.subtitle}>Create your own custom routine</Text>
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
