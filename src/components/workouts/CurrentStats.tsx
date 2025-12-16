import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Theme } from '../../theme';

interface Props {
    weight: string;
    reps: number;
}

export const CurrentStats = memo(({ weight, reps }: Props) => {
    return (
        <View style={styles.statsContainer}>
            <View style={styles.statCard}>
                <Text style={styles.statLabel}>WEIGHT</Text>
                <Text style={styles.statValue}>{weight}</Text>
            </View>
            <View style={styles.statCard}>
                <Text style={styles.statLabel}>REPS</Text>
                <Text style={styles.statValue}>{reps}</Text>
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    statsContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: Theme.spacing.l,
    },
    statCard: {
        flex: 1,
        backgroundColor: Theme.colors.surface,
        borderRadius: Theme.borderRadius.m,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statLabel: {
        color: Theme.colors.gray[500],
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 4,
        letterSpacing: 0.5,
    },
    statValue: {
        color: Theme.colors.white,
        fontSize: 24,
        fontWeight: 'bold',
    },
});
