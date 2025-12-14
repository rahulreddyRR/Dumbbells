import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { WORKOUT_PLANS, PlanExercise } from '../../data/workoutPlans';
import { Theme } from '../../theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Screen } from '../../components/common/Screen';
import { Button } from '../../components/common/Button';

type Props = NativeStackScreenProps<RootStackParamList, 'WorkoutTracking'>;

// Helper to parse "12 + 12 + 10" string into array of numbers
const parseSets = (setsStr: string): number[] => {
    return setsStr.split('+').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
};


export const WorkoutTrackingScreen: React.FC<Props> = ({ route, navigation }) => {
    const { planId, day } = route.params;
    const plan = WORKOUT_PLANS.find(p => p.id === planId);
    const dayPlan = plan?.schedule.find(d => d.day === day);

    // Flatten exercises into a linear list of "SetItems" for easier tracking
    // Each item represents one specific set of an exercise
    const workoutSequence = useMemo(() => {
        if (!dayPlan) return [];
        const sequence: { exercise: PlanExercise; setIndex: number; totalSets: number; reps: number }[] = [];

        dayPlan.exercises.forEach(ex => {
            const repsArray = parseSets(ex.sets);
            repsArray.forEach((reps, index) => {
                sequence.push({
                    exercise: ex,
                    setIndex: index + 1,
                    totalSets: repsArray.length,
                    reps: reps
                });
            });
        });
        return sequence;
    }, [dayPlan]);

    const [currentIndex, setCurrentIndex] = useState(0);

    if (!plan || !dayPlan || workoutSequence.length === 0) {
        return (
            <View style={styles.container}>
                <Text style={{ color: 'white' }}>Plan or Day not found</Text>
            </View>
        );
    }

    const currentStep = workoutSequence[currentIndex];
    const isLastStep = currentIndex === workoutSequence.length - 1;

    const handleNext = () => {
        if (isLastStep) {
            navigation.goBack();
        } else {
            setCurrentIndex(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    return (
        <Screen>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={Theme.colors.white} />
                </TouchableOpacity>
                <View style={styles.headerTitles}>
                    <Text style={styles.headerTitle}>Workout</Text>
                    <Text style={styles.headerSubtitle}>{plan.title}</Text>
                </View>
                <View style={{ width: 24 }} />
            </View>

            {/* Main Content */}
            <View style={styles.mainContent}>
                <Text style={styles.exerciseTitle}>{currentStep.exercise.name}</Text>
                <Text style={styles.setInfo}>Set {currentStep.setIndex} of {currentStep.totalSets}</Text>
            </View>

            {/* Bottom Progress Strip */}
            <View style={styles.bottomStrip}>
                <View style={styles.bottomStripContent}>
                    <View style={styles.weightRepsView}>
                        <View style={styles.weightView}>
                            <Text style={styles.viewText}>Weight: {currentStep.exercise.weight}</Text>
                        </View>
                        <View style={styles.repsView}>
                            <Text style={styles.viewText}>Reps: {currentStep.reps}</Text>
                        </View>
                    </View>
                    <Button title="Done" onPress={handleNext} />
                </View>
                <View style={{ alignItems: 'center', }}>
                    <Text style={styles.nextInfo}>Next Exercise:</Text>
                    <Text style={styles.nextSet}>
                        {currentIndex < workoutSequence.length - 1
                            ? `Set ${workoutSequence[currentIndex + 1].setIndex}`
                            : "Finish"}
                    </Text>
                    <View style={styles.iconsRow}>
                        {dayPlan.exercises.map((ex, idx) => (
                            <View key={ex.id} style={[styles.iconWrapper, { opacity: currentStep.exercise.id === ex.id ? 1 : 0.4 }]}>
                                <Ionicons name="fitness" size={20} color={Theme.colors.white} />
                            </View>
                        ))}
                    </View>
                </View>
            </View>
        </Screen>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.colors.black,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Theme.spacing.m,
        paddingVertical: Theme.spacing.s,
    },
    headerTitles: {
        alignItems: 'center',
    },
    headerTitle: {
        color: Theme.colors.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
    headerSubtitle: {
        color: Theme.colors.gray[500],
        fontSize: 14,
    },
    mainContent: {
        flex: 1,
        alignItems: 'center',
        paddingTop: Theme.spacing.xl,
    },
    exerciseTitle: {
        color: Theme.colors.white,
        fontSize: 28,
        fontWeight: '300',
        marginBottom: Theme.spacing.xs,
    },
    setInfo: {
        color: Theme.colors.gray[500],
        fontSize: 16,
        marginBottom: Theme.spacing.xs,
    },
    repInstruction: {
        color: Theme.colors.gray[300],
        fontSize: 20,
        marginBottom: Theme.spacing.xl,
    },
    weightRepsView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
    viewText: {
        color: Theme.colors.text,
        fontSize: 18,
    },
    weightView: {
        flex: 3,
        marginRight: Theme.spacing.xs,
        color: Theme.colors.gray[500],
        borderColor: Theme.colors.gray[500],
        borderWidth: 1,
        borderRadius: 5,
        padding: Theme.spacing.xs,
        alignItems: 'center',
        justifyContent: 'center',
    },
    repsView: {
        flex: 3,
        marginLeft: Theme.spacing.xs,
        color: Theme.colors.gray[500],
        borderColor: Theme.colors.gray[500],
        borderWidth: 1,
        borderRadius: 5,
        padding: Theme.spacing.xs,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottomStrip: {
        padding: Theme.spacing.m,
        alignItems: 'center',
        gap: Theme.spacing.m
    },
    bottomStripContent: {
        width: '100%',
        gap: Theme.spacing.s,
    },
    nextInfo: {
        color: Theme.colors.text,
        fontSize: 14,
    },
    nextSet: {
        color: Theme.colors.white,
        fontSize: 18,
        fontWeight: '500',
    },
    iconsRow: {
        flexDirection: 'row',
        gap: Theme.spacing.s,
    },
    iconWrapper: {
        alignItems: 'center',
    }
});
