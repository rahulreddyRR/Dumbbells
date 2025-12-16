import React, { memo } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Theme } from '../../theme';
import { AppConfig } from '../../config/AppConfig';
import { WorkoutPlan } from '../../data/workoutPlans';

interface Props {
    plan: WorkoutPlan;
    isActivePlan: boolean;
    onBack: () => void;
    onToggleActivePlan: () => void;
}

export const WorkoutHeader = memo(({ plan, isActivePlan, onBack, onToggleActivePlan }: Props) => {
    return (
        <ImageBackground
            source={plan.image || { uri: 'https://via.placeholder.com/400' }}
            style={styles.headerImage}
            imageStyle={styles.headerImageStyle}
        >
            <View style={styles.headerGradient} />

            {/* Top Bar */}
            <View style={styles.topBar}>
                <TouchableOpacity onPress={onBack} style={styles.iconButton}>
                    <Ionicons name="arrow-back" size={24} color={Theme.colors.white} />
                </TouchableOpacity>

                {AppConfig.features.enableMyPlan ? (
                    <TouchableOpacity
                        style={[
                            styles.activePlanButton,
                            isActivePlan && styles.activePlanButtonActive
                        ]}
                        onPress={onToggleActivePlan}
                    >
                        <Ionicons
                            name={isActivePlan ? "checkmark-circle" : "add-circle-outline"}
                            size={20}
                            color={Theme.colors.white}
                        />
                        <Text style={styles.activePlanText}>
                            {isActivePlan ? 'Active Plan' : 'Set as Active'}
                        </Text>
                    </TouchableOpacity>
                ) : null}
            </View>

            {/* Header Content */}
            <View style={styles.headerBottom}>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{plan.difficulty}</Text>
                </View>
                <Text style={styles.planTitle}>{plan.title}</Text>
                <Text style={styles.planSubtitle}>{plan.subtitle}</Text>
                <Text style={styles.frequency}>{plan.frequency}</Text>
            </View>
        </ImageBackground>
    );
});

const styles = StyleSheet.create({
    headerImage: {
        height: 300,
        width: '100%',
    },
    headerImageStyle: {
        resizeMode: 'cover',
    },
    headerGradient: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 20,
        paddingHorizontal: Theme.spacing.m,
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.3)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerBottom: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: Theme.spacing.m,
        paddingBottom: Theme.spacing.l,
    },
    badge: {
        alignSelf: 'flex-start',
        backgroundColor: Theme.colors.primary,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        marginBottom: Theme.spacing.s,
    },
    badgeText: {
        color: Theme.colors.background,
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    planTitle: {
        color: Theme.colors.white,
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    planSubtitle: {
        color: Theme.colors.white,
        fontSize: 16,
        marginBottom: 8,
        opacity: 0.9,
    },
    frequency: {
        color: Theme.colors.white,
        fontSize: 14,
        opacity: 0.8,
    },
    activePlanButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 6,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    activePlanButtonActive: {
        backgroundColor: Theme.colors.primary,
        borderColor: Theme.colors.primary,
    },
    activePlanText: {
        color: Theme.colors.white,
        fontWeight: '600',
        fontSize: 12,
    },
});
