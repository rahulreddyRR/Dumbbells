import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Screen } from '../components/common/Screen';
import { Theme } from '../theme';

import { useWorkoutStore } from '../store/workoutStore';
import Ionicons from 'react-native-vector-icons/Ionicons';

export const ProgressScreen = () => {
  const completedWorkouts = useWorkoutStore((state) => state.completedWorkouts);

  const totalWorkouts = completedWorkouts.length;
  const totalCalories = completedWorkouts.reduce((acc, w) => acc + w.caloriesBurned, 0);
  const totalMinutes = completedWorkouts.reduce((acc, w) => acc + w.durationMinutes, 0);

  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.title}>Your Progress</Text>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Ionicons name="trophy" size={24} color={Theme.colors.primary} />
            <Text style={styles.statValue}>{totalWorkouts}</Text>
            <Text style={styles.statLabel}>Workouts</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="flame" size={24} color={Theme.colors.primary} />
            <Text style={styles.statValue}>{totalCalories}</Text>
            <Text style={styles.statLabel}>Kcal Burned</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="time" size={24} color={Theme.colors.primary} />
            <Text style={styles.statValue}>{totalMinutes}</Text>
            <Text style={styles.statLabel}>Minutes</Text>
          </View>
        </View>

        <Text style={styles.historyTitle}>History</Text>
        {/* Placeholder for list, or could render a FlatList here */}
        {completedWorkouts.length === 0 ? (
          <Text style={styles.emptyText}>No workouts completed yet. Start one!</Text>
        ) : (
          <View style={{ marginTop: Theme.spacing.m }}>
            {completedWorkouts.slice(0, 5).map(workout => (
              <View key={workout.id} style={styles.historyItem}>
                <Text style={styles.historyName}>{workout.planName}</Text>
                <Text style={styles.historyDate}>{new Date(workout.date).toLocaleDateString()}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Theme.spacing.m,
  },
  title: {
    ...Theme.textVariants.header,
    marginBottom: Theme.spacing.l,
    textAlign: 'center',
    color: Theme.colors.white,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Theme.spacing.xl,
  },
  statCard: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.m,
    padding: Theme.spacing.m,
    alignItems: 'center',
    width: '30%',
  },
  statValue: {
    color: Theme.colors.white,
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  statLabel: {
    color: Theme.colors.gray[500],
    fontSize: 12,
  },
  historyTitle: {
    ...Theme.textVariants.subheader,
    color: Theme.colors.white,
    marginBottom: Theme.spacing.m,
  },
  emptyText: {
    color: Theme.colors.gray[500],
    textAlign: 'center',
    marginTop: Theme.spacing.l,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Theme.spacing.s,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.surface,
  },
  historyName: {
    color: Theme.colors.white,
    fontSize: 16,
  },
  historyDate: {
    color: Theme.colors.gray[500],
    fontSize: 14,
  }
});
