import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, ImageSourcePropType } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Theme } from '../../theme';

interface TodaysWorkoutCardProps {
    activePlan: {
        id: string;
        title: string;
        image?: ImageSourcePropType;
        stats: {
            minutes: number;
        };
    } | undefined;
    todaysWorkout: {
        day: number;
        title: string;
        exercises: any[];
        stats?: {
            minutes: number;
        };
    } | undefined;
    isTodayCompleted: boolean;
    onPress: () => void;
}

export const TodaysWorkoutCard = memo(({
    activePlan,
    todaysWorkout,
    isTodayCompleted,
    onPress
}: TodaysWorkoutCardProps) => {
    if (!activePlan) return null;

    if (isTodayCompleted) {
        return (
            <View style={styles.todayContainer}>
                <Text style={styles.sectionTitle}>Today's Workout</Text>
                <View style={styles.completedCard}>
                    <View style={styles.completedIconCallback}>
                        <Ionicons name="checkmark" size={32} color={Theme.colors.background} />
                    </View>
                    <Text style={styles.completedTitle}>Workout Complete!</Text>
                    <Text style={styles.completedSubtitle}>Great job crushing your goals today.</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.todayContainer}>
            <Text style={styles.sectionTitle}>Today's Workout</Text>
            {todaysWorkout ? (
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={onPress}
                >
                    <ImageBackground
                        source={activePlan.image || { uri: 'https://via.placeholder.com/400' }}
                        style={styles.todayCard}
                        imageStyle={styles.todayCardImage}
                    >
                        <View style={styles.todayOverlay}>
                            <View style={styles.todayBadge}>
                                <Text style={styles.todayBadgeText}>DAY {todaysWorkout.day}</Text>
                            </View>
                            <View>
                                <Text style={styles.todayTitle}>{todaysWorkout.title}</Text>
                                <Text style={styles.todayPlanName}>{activePlan.title}</Text>
                                <View style={styles.todayStats}>
                                    <Ionicons name="time-outline" size={14} color={Theme.colors.gray[300]} />
                                    <Text style={styles.todayStatText}>
                                        {todaysWorkout.stats?.minutes || activePlan.stats.minutes} min
                                    </Text>
                                    <View style={styles.dot} />
                                    <Ionicons name="barbell-outline" size={14} color={Theme.colors.gray[300]} />
                                    <Text style={styles.todayStatText}>
                                        {todaysWorkout.exercises.length} Exercises
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.playButton}>
                                <Ionicons name="play" size={20} color={Theme.colors.background} />
                            </View>
                        </View>
                    </ImageBackground>
                </TouchableOpacity>
            ) : (
                <View style={styles.restCard}>
                    <Ionicons name="cafe-outline" size={32} color={Theme.colors.primary} />
                    <Text style={styles.restTitle}>Rest Day</Text>
                    <Text style={styles.restSubtitle}>Take it easy today! Recovery is key.</Text>
                </View>
            )}
        </View>
    );
});

const styles = StyleSheet.create({
    sectionTitle: {
        ...Theme.textVariants.subheader,
        fontSize: 18,
        color: Theme.colors.white,
        marginBottom: Theme.spacing.m,
    },
    todayContainer: {
        marginBottom: Theme.spacing.s,
    },
    todayCard: {
        height: 140,
        width: '100%',
        borderRadius: Theme.borderRadius.l,
        overflow: 'hidden',
    },
    todayCardImage: {
        resizeMode: 'cover',
    },
    todayOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: Theme.spacing.m,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
    },
    todayBadge: {
        position: 'absolute',
        top: 12,
        left: 12,
        backgroundColor: Theme.colors.primary,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    todayBadgeText: {
        color: Theme.colors.background,
        fontSize: 10,
        fontWeight: 'bold',
    },
    todayTitle: {
        color: Theme.colors.white,
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20, // Space for badge
    },
    todayPlanName: {
        color: Theme.colors.gray[300],
        fontSize: 12,
        marginBottom: 8,
    },
    todayStats: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    todayStatText: {
        color: Theme.colors.gray[300],
        fontSize: 12,
        marginLeft: 4,
    },
    dot: {
        width: 3,
        height: 3,
        borderRadius: 1.5,
        backgroundColor: Theme.colors.gray[500],
        marginHorizontal: 6,
    },
    playButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Theme.colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    restCard: {
        backgroundColor: Theme.colors.surface,
        borderRadius: Theme.borderRadius.l,
        padding: Theme.spacing.l,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: Theme.colors.border,
        borderStyle: 'dashed',
    },
    restTitle: {
        color: Theme.colors.white,
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: Theme.spacing.s,
    },
    restSubtitle: {
        color: Theme.colors.gray[500],
        fontSize: 12,
        marginTop: 4,
    },
    completedCard: {
        backgroundColor: Theme.colors.surface,
        borderRadius: Theme.borderRadius.l,
        padding: Theme.spacing.l,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: Theme.colors.success,
        borderWidth: 1,
    },
    completedIconCallback: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: Theme.colors.success,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Theme.spacing.m,
    },
    completedTitle: {
        color: Theme.colors.white,
        fontSize: 20,
        fontWeight: 'bold',
    },
    completedSubtitle: {
        color: Theme.colors.gray[400],
        fontSize: 14,
        marginTop: 4,
        textAlign: 'center',
    },
});
