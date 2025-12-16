import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Theme } from '../../theme';

interface Props {
    selectedDay: number;
    maxDays: number;
    currentDayTitle?: string;
    onNext: () => void;
    onPrev: () => void;
}

export const DayNavigation = memo(({ selectedDay, maxDays, currentDayTitle, onNext, onPrev }: Props) => {
    return (
        <View style={styles.dayNavigationContainer}>
            <TouchableOpacity
                onPress={onPrev}
                style={[styles.navButton, selectedDay === 1 && styles.navButtonDisabled]}
                disabled={selectedDay === 1}
            >
                <Ionicons name="chevron-back" size={20} color={selectedDay === 1 ? Theme.colors.gray[700] : Theme.colors.white} />
            </TouchableOpacity>

            <View style={styles.dayInfo}>
                <Text style={styles.dayNumber}>Day {selectedDay}</Text>
                {currentDayTitle && <Text style={styles.dayName}>{currentDayTitle}</Text>}
            </View>

            <TouchableOpacity
                onPress={onNext}
                style={[styles.navButton, selectedDay === maxDays && styles.navButtonDisabled]}
                disabled={selectedDay === maxDays}
            >
                <Ionicons name="chevron-forward" size={20} color={selectedDay === maxDays ? Theme.colors.gray[700] : Theme.colors.white} />
            </TouchableOpacity>
        </View>
    );
});

const styles = StyleSheet.create({
    dayNavigationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Theme.spacing.l,
        paddingHorizontal: Theme.spacing.m,
        gap: Theme.spacing.l,
    },
    navButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Theme.colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
    },
    navButtonDisabled: {
        opacity: 0.3,
    },
    dayInfo: {
        alignItems: 'center',
        minWidth: 120,
    },
    dayNumber: {
        color: Theme.colors.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
    dayName: {
        color: Theme.colors.gray[400],
        fontSize: 14,
        marginTop: 2,
    },
});
