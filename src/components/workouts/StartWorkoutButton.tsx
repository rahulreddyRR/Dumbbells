import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Theme } from '../../theme';

interface Props {
    onPress: () => void;
}

export const StartWorkoutButton = memo(({ onPress }: Props) => {
    return (
        <View style={styles.floatingButtonContainer}>
            <TouchableOpacity
                style={styles.startButton}
                onPress={onPress}
            >
                <Ionicons name="play" size={24} color={Theme.colors.background} />
                <Text style={styles.startButtonText}>START WORKOUT</Text>
            </TouchableOpacity>
        </View>
    );
});

const styles = StyleSheet.create({
    floatingButtonContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: Theme.spacing.m,
        paddingVertical: Theme.spacing.m,
        backgroundColor: Theme.colors.background,
        borderTopWidth: 1,
        borderTopColor: Theme.colors.surface,
    },
    startButton: {
        backgroundColor: Theme.colors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: Theme.borderRadius.l,
        gap: 8,
    },
    startButtonText: {
        color: Theme.colors.background,
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
});
