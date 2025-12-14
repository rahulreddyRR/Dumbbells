import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { WORKOUT_PLANS, PlanExercise } from '../../data/workoutPlans';
import { Theme } from '../../theme';
import { useWorkoutStore } from '../../store/workoutStore';
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

    const {
        activeSession,
        startSession,
        updateSession,
        clearSession,
        addCompletedWorkout
    } = useWorkoutStore();

    // Resume or Start Session
    React.useEffect(() => {
        if (activeSession && activeSession.planId === planId && activeSession.day === day) {
            setCurrentIndex(activeSession.currentStepIndex);
        } else {
            startSession({
                planId,
                day,
                currentStepIndex: 0,
                completedWeight: 0,
                accumulatedCalories: 0,
                startTime: new Date().toISOString()
            });
            setCurrentIndex(0);
        }
    }, [planId, day]);

    const saveAndFinish = () => {
        if (!activeSession) return;

        // Calculate duration based on start time
        const startTime = new Date(activeSession.startTime).getTime();
        const durationMinutes = Math.max(1, Math.round((Date.now() - startTime) / 60000));

        addCompletedWorkout({
            id: Date.now().toString(),
            date: new Date().toISOString(),
            planId: plan.id,
            planName: plan.title,
            durationMinutes: durationMinutes,
            caloriesBurned: activeSession.accumulatedCalories,
            weightLifted: activeSession.completedWeight,
        });

        clearSession();
        navigation.navigate('Main');
    };

    const handleFinishPress = () => {
        if (currentIndex < workoutSequence.length - 1) {
            Alert.alert(
                "Finish Workout?",
                `You have ${workoutSequence.length - currentIndex} sets remaining. Finish anyway?`,
                [
                    { text: "Cancel", style: "cancel" },
                    { text: "Finish", onPress: saveAndFinish }
                ]
            );
        } else {
            saveAndFinish();
        }
    };

    const handleStepCompletion = (skipped: boolean) => {
        if (!activeSession) return;

        const step = workoutSequence[currentIndex];

        // Calculate stats for this specific step
        const weightNum = parseFloat(step.exercise.weight) || 0;
        const stepWeight = skipped ? 0 : (weightNum * step.reps);
        // Estimate calories per step (simplified logic: total calories / total steps)
        const totalSteps = workoutSequence.length;
        const totalCalories = dayPlan?.stats?.calories || plan.stats?.calories || 200;
        const stepCalories = skipped ? 0 : Math.round(totalCalories / totalSteps);

        const newUpdates = {
            currentStepIndex: currentIndex + 1,
            completedWeight: activeSession.completedWeight + stepWeight,
            accumulatedCalories: activeSession.accumulatedCalories + stepCalories
        };

        if (isLastStep) {
            // Update final stats before saving
            useWorkoutStore.setState(state => ({
                activeSession: state.activeSession ? { ...state.activeSession, ...newUpdates } : null
            }));
            // Immediate save with updated values (hacky access to latest state or just reuse values)
            // Better: update store then save. For now, pass values directly to save if needed, 
            // but saveAndFinish pulls from store. 
            // To ensure consistency, we'll manually construct the final object for saveAndFinish here
            // or just update store and wait? 
            // Safest: Use values directly.

            const startTime = new Date(activeSession.startTime).getTime();
            const durationMinutes = Math.max(1, Math.round((Date.now() - startTime) / 60000));

            addCompletedWorkout({
                id: Date.now().toString(),
                date: new Date().toISOString(),
                planId: plan.id,
                planName: plan.title,
                durationMinutes: durationMinutes,
                caloriesBurned: activeSession.accumulatedCalories + stepCalories,
                weightLifted: activeSession.completedWeight + stepWeight,
            });
            clearSession();
            navigation.navigate('Main');

        } else {
            updateSession(newUpdates);
            setCurrentIndex(prev => prev + 1);
        }
    };

    const isLastStep = currentIndex === workoutSequence.length - 1;
    const currentStep = workoutSequence[currentIndex];

    const handleNext = () => handleStepCompletion(false);
    const handleSkip = () => handleStepCompletion(true);

    const handleQuit = () => {
        Alert.alert(
            "Quit Workout?",
            "Your progress is saved. You can resume later or finish now.",
            [
                { text: "Resume Later", onPress: () => navigation.goBack() }, // Just go back, session stays in store
                { text: "Complete Day", onPress: saveAndFinish }, // Save partial and finish
                { text: "Discard", style: 'destructive', onPress: () => { clearSession(); navigation.goBack(); } }
            ]
        );
    };

    return (
        <Screen>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleQuit}>
                    <Ionicons name="arrow-back" size={24} color={Theme.colors.white} />
                </TouchableOpacity>
                <View style={styles.headerTitles}>
                    <Text style={styles.headerTitle}>Workout</Text>
                    <Text style={styles.headerSubtitle}>{plan.title}</Text>
                </View>
                <TouchableOpacity onPress={handleFinishPress}>
                    <Text style={styles.finishText}>Finish</Text>
                </TouchableOpacity>
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
                    <View style={styles.actionButtons}>
                        <Button title="Skip" onPress={handleSkip} variant="secondary" style={{ flex: 1 }} />
                        <View style={{ width: 10 }} />
                        <Button title="Done" onPress={handleNext} style={{ flex: 2 }} />
                    </View>
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
    },
    actionButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    finishText: {
        color: Theme.colors.primary,
        fontWeight: 'bold',
        fontSize: 16,
    }
});
