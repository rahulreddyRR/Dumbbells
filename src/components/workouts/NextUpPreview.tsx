import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Theme } from '../../theme';
import { PlanExercise } from '../../data/workoutPlans';
import FastImage from 'react-native-fast-image';

interface Props {
    nextExercise?: PlanExercise;
    nextStepDetail?: {
        setIndex: number;
        reps: number;
    };
    isLastStep: boolean;
}

export const NextUpPreview = memo(({ nextExercise, nextStepDetail, isLastStep }: Props) => {
    return (
        <View style={styles.footer}>
            {!isLastStep && nextExercise && nextStepDetail ? (
                <>
                    <View style={styles.footerHeader}>
                        <Text style={styles.footerLabel}>UP NEXT</Text>
                    </View>
                    <View style={styles.nextExerciseRow}>
                        {nextExercise.image ? (
                            <FastImage
                                source={nextExercise.image}
                                style={styles.nextThumb}
                                resizeMode={FastImage.resizeMode.contain}
                            />
                        ) : (
                            <View style={[styles.nextThumb, { backgroundColor: Theme.colors.gray[800] }]} />
                        )}
                        <View style={styles.nextInfoContainer}>
                            <Text style={styles.nextTitle} numberOfLines={1}>
                                {nextExercise.name}
                            </Text>
                            <Text style={styles.nextDetails}>
                                Set {nextStepDetail.setIndex} • {nextStepDetail.reps} Reps
                            </Text>
                        </View>
                    </View>
                </>
            ) : (
                <View style={styles.finishFooter}>
                    <Ionicons name="trophy" size={24} color={Theme.colors.primary} />
                    <Text style={styles.finishFooterText}>Last Set!</Text>
                </View>
            )}
        </View>
    );
});

const styles = StyleSheet.create({
    footer: {
        backgroundColor: Theme.colors.surface,
        paddingTop: Theme.spacing.m,
        paddingBottom: Theme.spacing.xl, // Safe area padding
        paddingHorizontal: Theme.spacing.m,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
    },
    footerHeader: {
        marginBottom: 12,
    },
    footerLabel: {
        color: Theme.colors.gray[500],
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    nextExerciseRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    nextThumb: {
        width: 48,
        height: 48,
        borderRadius: 8,
        backgroundColor: Theme.colors.background,
        marginRight: 12,
    },
    nextInfoContainer: {
        flex: 1,
    },
    nextTitle: {
        color: Theme.colors.white,
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    nextDetails: {
        color: Theme.colors.gray[400],
        fontSize: 14,
    },
    finishFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 12,
    },
    finishFooterText: {
        color: Theme.colors.primary,
        fontSize: 18,
        fontWeight: 'bold',
    },
});
