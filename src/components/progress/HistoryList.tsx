import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Theme } from '../../theme';
import { CompletedWorkout } from '../../store/workoutStore';

interface HistoryListProps {
    workouts: CompletedWorkout[];
}

export const HistoryList = memo(({ workouts }: HistoryListProps) => {
    if (workouts.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No activity on this day.</Text>
            </View>
        );
    }

    return (
        <View>
            {[...workouts].reverse().map((item) => (
                <View key={item.id} style={styles.historyItem}>
                    <View style={styles.historyIcon}>
                        <Ionicons name="barbell-outline" size={20} color={Theme.colors.primary} />
                    </View>
                    <View style={styles.historyContent}>
                        <Text style={styles.historyName}>{item.planName}</Text>
                        <Text style={styles.historyDate}>
                            {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                    </View>
                    <View style={styles.historyStats}>
                        <Text style={styles.historyStatMain}>{item.durationMinutes} min</Text>
                        <Text style={styles.historyStatSub}>{item.caloriesBurned} kcal</Text>
                    </View>
                </View>
            ))}
        </View>
    );
});

const styles = StyleSheet.create({
    emptyContainer: {
        alignItems: 'center',
        padding: Theme.spacing.xl,
        opacity: 0.5,
    },
    emptyText: {
        color: Theme.colors.gray[500],
        textAlign: 'center',
        marginTop: Theme.spacing.m,
        fontSize: 16,
    },
    historyItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Theme.colors.surface,
        padding: Theme.spacing.m,
        borderRadius: Theme.borderRadius.m,
        marginBottom: Theme.spacing.s,
    },
    historyIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(212, 255, 0, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: Theme.spacing.m,
    },
    historyContent: {
        flex: 1,
    },
    historyName: {
        color: Theme.colors.white,
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    historyDate: {
        color: Theme.colors.gray[500],
        fontSize: 12,
    },
    historyStats: {
        alignItems: 'flex-end',
    },
    historyStatMain: {
        color: Theme.colors.primary,
        fontWeight: 'bold',
        fontSize: 14,
    },
    historyStatSub: {
        color: Theme.colors.gray[500],
        fontSize: 11,
        marginTop: 2,
    }
});
