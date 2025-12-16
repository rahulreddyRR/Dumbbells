import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Theme } from '../../theme';

interface Props {
    calories: number;
    weight: number;
    minutes: number;
}

export const StatsOverview = memo(({ calories, weight, minutes }: Props) => {
    return (
        <View style={styles.statsSection}>
            <View style={styles.statCard}>
                <View style={styles.statIconContainer}>
                    <Ionicons name="flame" size={24} color={Theme.colors.primary} />
                </View>
                <Text style={styles.statValue}>{calories}</Text>
                <Text style={styles.statLabel}>Calories</Text>
            </View>

            <View style={styles.statCard}>
                <View style={styles.statIconContainer}>
                    <Ionicons name="barbell" size={24} color={Theme.colors.primary} />
                </View>
                <Text style={styles.statValue}>{weight.toLocaleString()}</Text>
                <Text style={styles.statLabel}>Kg Lifted</Text>
            </View>

            <View style={styles.statCard}>
                <View style={styles.statIconContainer}>
                    <Ionicons name="time" size={24} color={Theme.colors.primary} />
                </View>
                <Text style={styles.statValue}>{minutes}</Text>
                <Text style={styles.statLabel}>Minutes</Text>
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    statsSection: {
        flexDirection: 'row',
        paddingHorizontal: Theme.spacing.m,
        paddingTop: Theme.spacing.l,
        gap: 12,
    },
    statCard: {
        flex: 1,
        backgroundColor: Theme.colors.surface,
        borderRadius: Theme.borderRadius.m,
        padding: Theme.spacing.m,
        alignItems: 'center',
    },
    statIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(212, 255, 0, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    statValue: {
        color: Theme.colors.white,
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    statLabel: {
        color: Theme.colors.gray[500],
        fontSize: 12,
    },
});
