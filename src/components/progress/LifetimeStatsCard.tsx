import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Theme } from '../../theme';

interface LifetimeStatsCardProps {
    totalWorkouts: number;
    totalWeight: number;
    totalCalories: number;
}

export const LifetimeStatsCard = memo(({ totalWorkouts, totalWeight, totalCalories }: LifetimeStatsCardProps) => {
    return (
        <View style={styles.miniStatsRow}>
            <View style={styles.miniStat}>
                <Text style={styles.miniStatValue}>{totalWorkouts}</Text>
                <Text style={styles.miniStatLabel}>Workouts</Text>
            </View>
            <View style={[styles.miniStat, styles.miniStatBorder]}>
                <Text style={styles.miniStatValue}>{Math.round(totalWeight)}kg</Text>
                <Text style={styles.miniStatLabel}>Lifted</Text>
            </View>
            <View style={styles.miniStat}>
                <Text style={styles.miniStatValue}>{totalCalories}</Text>
                <Text style={styles.miniStatLabel}>Kcal</Text>
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    miniStatsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: Theme.spacing.l,
        paddingVertical: Theme.spacing.m,
        backgroundColor: Theme.colors.surface,
        borderRadius: Theme.borderRadius.m,
    },
    miniStat: {
        alignItems: 'center',
        flex: 1,
    },
    miniStatBorder: {
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: Theme.colors.border
    },
    miniStatValue: {
        color: Theme.colors.white,
        fontWeight: 'bold',
        fontSize: 16,
    },
    miniStatLabel: {
        color: Theme.colors.gray[500],
        fontSize: 10,
        marginTop: 2,
    },
});
