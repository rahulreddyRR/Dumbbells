import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Theme } from '../../theme';

interface StreakCardProps {
    currentStreak: number;
    bestStreak: number;
}

export const StreakCard = memo(({ currentStreak, bestStreak }: StreakCardProps) => {
    return (
        <View style={styles.streakContainer}>
            <View style={styles.streakCard}>
                <Ionicons name="flame" size={24} color={Theme.colors.primary} />
                <View>
                    <Text style={styles.streakValue}>{currentStreak}</Text>
                    <Text style={styles.streakLabel}>Current Streak</Text>
                </View>
            </View>
            <View style={styles.streakCard}>
                <Ionicons name="trophy-outline" size={24} color="#FFD700" />
                <View>
                    <Text style={styles.streakValue}>{bestStreak}</Text>
                    <Text style={styles.streakLabel}>Best Streak</Text>
                </View>
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    streakContainer: {
        flexDirection: 'row',
        gap: Theme.spacing.m,
        marginBottom: Theme.spacing.l,
    },
    streakCard: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Theme.colors.surface,
        padding: Theme.spacing.m,
        borderRadius: Theme.borderRadius.m,
        gap: 12,
    },
    streakValue: {
        color: Theme.colors.white,
        fontWeight: 'bold',
        fontSize: 20,
    },
    streakLabel: {
        color: Theme.colors.gray[400],
        fontSize: 12,
    },
});
