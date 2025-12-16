import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Theme } from '../../theme';
import { PlanExercise } from '../../data/workoutPlans';

interface Props {
  exercise: PlanExercise;
  index: number;
  onImagePress: (image: any) => void;
}

export const ExerciseCard = memo(({ exercise, index, onImagePress }: Props) => {
  return (
    <View style={styles.exerciseCard}>
      <View style={styles.exerciseNumber}>
        <Text style={styles.exerciseNumberText}>{index + 1}</Text>
      </View>

      <View style={styles.exerciseContent}>
        <Text style={styles.exerciseName}>{exercise.name}</Text>
        <View style={styles.exerciseDetails}>
          <View style={styles.detailItem}>
            <Ionicons name="repeat" size={14} color={Theme.colors.gray[500]} />
            <Text style={styles.detailText}>{exercise.sets} sets</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="barbell-outline" size={14} color={Theme.colors.gray[500]} />
            <Text style={styles.detailText}>{exercise.weight}</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.exerciseAction}
        onPress={() => onImagePress(exercise.image)}
      >
        <Ionicons name="information-circle-outline" size={20} color={Theme.colors.gray[500]} />
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  exerciseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.m,
    padding: Theme.spacing.m,
    marginBottom: Theme.spacing.s,
  },
  exerciseNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(212, 255, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Theme.spacing.m,
  },
  exerciseNumberText: {
    color: Theme.colors.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  exerciseContent: {
    flex: 1,
  },
  exerciseName: {
    color: Theme.colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  exerciseDetails: {
    flexDirection: 'row',
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    color: Theme.colors.gray[500],
    fontSize: 13,
  },
  exerciseAction: {
    padding: 8,
  },
});
