import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Screen } from '../components/common/Screen';
import { Theme } from '../theme';

export const SettingsScreen = () => {
  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Configure preferences here.</Text>
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
    marginBottom: Theme.spacing.s,
  },
  subtitle: {
    ...Theme.textVariants.body,
    textAlign: 'center',
  },
});
