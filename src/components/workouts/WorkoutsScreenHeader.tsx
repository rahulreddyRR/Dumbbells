import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Theme } from '../../theme';

interface Props {
    userName: string;
    todaysWorkoutComponent?: React.ReactNode;
}

export const WorkoutsScreenHeader = memo(({ userName, todaysWorkoutComponent }: Props) => {
    return (
        <View style={styles.container}>
            <View style={styles.headerContent}>
                <Text style={styles.greeting}>Hey {userName || 'there'}! 💪</Text>
                <Text style={styles.subtitle}>Let's crush your goals</Text>
            </View>
            {todaysWorkoutComponent}
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        paddingBottom: Theme.spacing.m,
    },
    headerContent: {
        marginBottom: Theme.spacing.l,
        marginTop: Theme.spacing.s,
    },
    greeting: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Theme.colors.white,
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 16,
        color: Theme.colors.gray[400],
    },
});
