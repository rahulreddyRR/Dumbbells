import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Theme } from '../../theme';
import { Exercise } from '../../data/exercises';
import FastImage from 'react-native-fast-image';

interface Props {
    exercise: Exercise;
    onPress: (image: any) => void;
}

export const IndividualExerciseCard = memo(({ exercise, onPress }: Props) => {
    return (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.7}
            onPress={() => onPress(exercise.image)}
        >
            <View style={styles.imageContainer}>
                {exercise.image && (
                    <FastImage
                        source={exercise.image}
                        style={styles.image}
                        resizeMode="contain"
                    />
                )}
            </View>
            <View style={styles.content}>
                <Text style={styles.name} numberOfLines={2}>{exercise.name}</Text>
            </View>
        </TouchableOpacity>
    );
});

const styles = StyleSheet.create({
    card: {
        flex: 1,
        backgroundColor: Theme.colors.surface,
        borderRadius: Theme.borderRadius.l,
        margin: Theme.spacing.s,
        overflow: 'hidden',
        height: 180, // Fixed height for consistent grid
    },
    imageContainer: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        alignItems: 'center',
        justifyContent: 'center',
        padding: Theme.spacing.s,
    },
    image: {
        width: '80%',
        height: '80%',
    },
    content: {
        padding: Theme.spacing.m,
        backgroundColor: Theme.colors.surface,
    },
    name: {
        color: Theme.colors.white,
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
    },
});
