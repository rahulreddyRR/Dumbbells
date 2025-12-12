import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from '../components/common/Button';
import { Theme } from '../theme';
import { useStore } from '../store/useStore';

export const HomeScreen = () => {
  const { count, increment, decrement } = useStore();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Screen</Text>
      <Text style={styles.subtitle}>Welcome to the new folder structure!</Text>
      
      <View style={styles.counterContainer}>
        <Text style={styles.countText}>Count: {count}</Text>
        <View style={styles.buttonRow}>
          <Button
            title="-"
            onPress={decrement}
            style={styles.button}
            variant="secondary"
          />
          <View style={styles.spacer} />
          <Button
            title="+"
            onPress={increment}
            style={styles.button}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
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
    marginBottom: Theme.spacing.xl,
    textAlign: 'center',
  },
  counterContainer: {
    alignItems: 'center',
    width: '100%',
  },
  countText: {
    ...Theme.textVariants.header,
    marginBottom: Theme.spacing.m,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    minWidth: 60,
  },
  spacer: {
    width: Theme.spacing.m,
  },
});
