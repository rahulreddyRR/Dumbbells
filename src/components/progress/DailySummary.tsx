import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Theme } from '../../theme';
import { CompletedWorkout } from '../../store/workoutStore';

interface DailySummaryProps {
    date: Date;
    stats: {
        workouts: CompletedWorkout[];
        calories: number;
        duration: number;
        weight: number;
    };
}

export const DailySummary = memo(({ date, stats }: DailySummaryProps) => {
    return (
        <View>
            <Text style={styles.historyTitle}>
                Activity for {date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
            </Text>
            <View style={styles.dailySummaryCard}>
                <View style={styles.dailyStatsRow}>
                    <View style={styles.dailyStat}>
                        <Ionicons name="time-outline" size={18} color={Theme.colors.primary} />
                        <Text style={styles.dailyStatText}>{stats.duration} min</Text>
                    </View>
                    <View style={styles.dailyStat}>
                        <Ionicons name="flame-outline" size={18} color={Theme.colors.primary} />
                        <Text style={styles.dailyStatText}>{stats.calories} kcal</Text>
                    </View>
                    <View style={styles.dailyStat}>
                        <Ionicons name="barbell-outline" size={18} color={Theme.colors.primary} />
                        <Text style={styles.dailyStatText}>{stats.workouts.length} workouts</Text>
                    </View>
                </View>
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    historyTitle: {
        ...Theme.textVariants.subheader,
        color: Theme.colors.white,
        marginBottom: Theme.spacing.m,
    },
    dailySummaryCard: {
        backgroundColor: Theme.colors.surface,
        borderRadius: Theme.borderRadius.m,
        padding: Theme.spacing.m,
        marginBottom: Theme.spacing.l,
        borderLeftWidth: 4,
        borderLeftColor: Theme.colors.primary,
    },
    dailyStatsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    dailyStat: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    dailyStatText: {
        color: Theme.colors.gray[300],
        fontSize: 14,
    },
});
