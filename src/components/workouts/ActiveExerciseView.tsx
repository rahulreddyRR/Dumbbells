import React, { memo } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Theme } from '../../theme';
import { PlanExercise } from '../../data/workoutPlans';

interface Props {
    exercise: PlanExercise;
    currentSetIndex: number;
    totalSets: number;
}

export const ActiveExerciseView = memo(({ exercise, currentSetIndex, totalSets }: Props) => {
    return (
        <View style={styles.container}>
            {/* Exercise Image */}
            <View style={styles.imageSection}>
                {exercise.image && (
                    <Image
                        source={exercise.image}
                        style={styles.exerciseImage}
                        resizeMode="contain"
                    />
                )}
            </View>

            {/* Exercise Info */}
            <View style={styles.infoSection}>
                <Text style={styles.exerciseTitle} numberOfLines={2}>{exercise.name}</Text>
                <View style={styles.setBadge}>
                    <Ionicons name="repeat" size={12} color={Theme.colors.primary} style={{ marginRight: 4 }} />
                    <Text style={styles.setText}>Set {currentSetIndex} of {totalSets}</Text>
                </View>
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    imageSection: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: Theme.spacing.s,
    },
    exerciseImage: {
        width: '100%',
        height: '100%',
        maxHeight: 300,
    },
    infoSection: {
        alignItems: 'center',
        marginBottom: Theme.spacing.l,
    },
    exerciseTitle: {
        color: Theme.colors.white,
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
    },
    setBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(212, 255, 0, 0.1)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    setText: {
        color: Theme.colors.primary,
        fontSize: 14,
        fontWeight: 'bold',
    },
});
