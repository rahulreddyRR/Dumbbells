import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Theme } from '../../theme';

interface Props {
    title: string;
    day: number;
    onQuit: () => void;
    onFinish: () => void;
}

export const TrackingScreenHeader = memo(({ title, day, onQuit, onFinish }: Props) => {
    return (
        <View style={styles.header}>
            <TouchableOpacity onPress={onQuit} style={styles.iconButton}>
                <Ionicons name="close" size={24} color={Theme.colors.white} />
            </TouchableOpacity>
            <View style={styles.headerTitles}>
                <Text style={styles.headerSubtitle}>{title} • Day {day}</Text>
            </View>
            <TouchableOpacity onPress={onFinish}>
                <Text style={styles.finishText}>Finish</Text>
            </TouchableOpacity>
        </View>
    );
});

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Theme.spacing.m,
        paddingTop: Theme.spacing.m,
        paddingBottom: Theme.spacing.s,
    },
    iconButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Theme.colors.surface,
        borderRadius: 20,
    },
    headerTitles: {
        alignItems: 'center',
    },
    headerSubtitle: {
        color: Theme.colors.gray[400],
        fontSize: 14,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    finishText: {
        color: Theme.colors.error,
        fontWeight: '600',
        fontSize: 14,
    },
});
