import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Theme } from '../../theme';
import { PlanExercise } from '../../data/workoutPlans';
import { ExerciseCard } from './ExerciseCard';

interface Props {
    exercises: PlanExercise[];
    onImagePress: (image: any) => void;
}

export const ExerciseList = memo(({ exercises, onImagePress }: Props) => {
    return (
        <View style={styles.exercisesSection}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Exercises</Text>
                <Text style={styles.exerciseCount}>{exercises.length} exercises</Text>
            </View>

            {exercises.map((item, index) => (
                <ExerciseCard
                    key={item.id}
                    exercise={item}
                    index={index}
                    onImagePress={onImagePress}
                />
            ))}
        </View>
    );
});

const styles = StyleSheet.create({
    exercisesSection: {
        paddingHorizontal: Theme.spacing.m,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Theme.spacing.m,
    },
    sectionTitle: {
        color: Theme.colors.white,
        fontSize: 20,
        fontWeight: 'bold',
    },
    exerciseCount: {
        color: Theme.colors.gray[500],
        fontSize: 14,
    },
});
