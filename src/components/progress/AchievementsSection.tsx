import React, { memo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Theme } from '../../theme';
import { Achievement } from '../../hooks/useProgressStats';

interface AchievementsSectionProps {
    achievements: Achievement[];
}

export const AchievementsSection = memo(({ achievements }: AchievementsSectionProps) => {
    return (
        <View>
            <Text style={styles.sectionTitle}>Achievements</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.achievementsScroll}>
                {achievements.map((achievement) => (
                    <View key={achievement.id} style={[styles.achievementCard, !achievement.unlocked && styles.achievementLocked]}>
                        <View style={[styles.achievementIcon, achievement.unlocked ? styles.achievementIconUnlocked : styles.achievementIconLocked]}>
                            <Ionicons name={achievement.icon} size={20} color={achievement.unlocked ? Theme.colors.background : Theme.colors.gray[500]} />
                        </View>
                        <View>
                            <Text style={styles.achievementTitle}>{achievement.title}</Text>
                            <Text style={styles.achievementDesc}>{achievement.description}</Text>
                        </View>
                        {!achievement.unlocked && (
                            <View style={styles.lockOverlay}>
                                <Ionicons name="lock-closed" size={16} color={Theme.colors.gray[500]} />
                            </View>
                        )}
                    </View>
                ))}
            </ScrollView>
        </View>
    );
});

const styles = StyleSheet.create({
    sectionTitle: {
        ...Theme.textVariants.subheader,
        color: Theme.colors.white,
        marginBottom: Theme.spacing.m,
        marginTop: Theme.spacing.s,
    },
    achievementsScroll: {
        marginBottom: Theme.spacing.xl,
    },
    achievementCard: {
        backgroundColor: Theme.colors.surface,
        padding: 12,
        borderRadius: Theme.borderRadius.m,
        marginRight: 10,
        width: 200,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    achievementLocked: {
        opacity: 0.6,
        borderColor: Theme.colors.border,
    },
    achievementIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    achievementIconUnlocked: {
        backgroundColor: Theme.colors.primary,
    },
    achievementIconLocked: {
        backgroundColor: Theme.colors.gray[800],
    },
    achievementTitle: {
        color: Theme.colors.white,
        fontWeight: 'bold',
        fontSize: 14,
    },
    achievementDesc: {
        color: Theme.colors.gray[400],
        fontSize: 10,
        maxWidth: 130,
    },
    lockOverlay: {
        position: 'absolute',
        top: 5,
        right: 5,
    },
});
