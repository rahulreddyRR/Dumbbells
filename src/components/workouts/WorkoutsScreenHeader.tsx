import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Theme } from '../../theme';

interface WorkoutsScreenHeaderProps {
    userName: string | undefined;
    todaysWorkoutComponent: React.ReactNode;
}

export const WorkoutsScreenHeader = memo(({ userName, todaysWorkoutComponent }: WorkoutsScreenHeaderProps) => {
    return (
        <View style={styles.header}>
            <Text style={styles.title}>Hey {userName || 'there'}! 💪</Text>
            <Text style={styles.subtitle}>Let's crush your goals</Text>

            {todaysWorkoutComponent}

            <Text style={[styles.sectionTitle, todaysWorkoutComponent ? { marginTop: Theme.spacing.xl } : undefined]}>Browse Plans</Text>
        </View>
    );
});

const styles = StyleSheet.create({
    header: {
        paddingTop: Theme.spacing.m,
    },
    title: {
        color: Theme.colors.white,
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    subtitle: {
        color: Theme.colors.gray[400],
        fontSize: 14,
        marginBottom: Theme.spacing.l,
    },
    sectionTitle: {
        ...Theme.textVariants.subheader,
        fontSize: 18,
        color: Theme.colors.white,
        marginBottom: Theme.spacing.m,
    },
});
