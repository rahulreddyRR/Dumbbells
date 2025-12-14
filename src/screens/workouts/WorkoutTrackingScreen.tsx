import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { WORKOUT_PLANS, PlanExercise } from '../../data/workoutPlans';
import { Theme } from '../../theme';
import { useWorkoutStore, ActiveSession } from '../../store/workoutStore';
import { useAppSettingsStore } from '../../store/appSettingsStore';
import { ttsService } from '../../services/ttsService';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Screen } from '../../components/common/Screen';
import { Button } from '../../components/common/Button';
import { RestTimer } from '../../components/workouts/RestTimer';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';

type Props = NativeStackScreenProps<RootStackParamList, 'WorkoutTracking'>;

// Helper to parse "12 + 12 + 10" string into array of numbers
const parseSets = (setsStr: string): number[] => {
    return setsStr.split('+').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
};



export const WorkoutTrackingScreen: React.FC<Props> = ({ route, navigation }) => {
    const { planId, day } = route.params;
    const customPlans = useWorkoutStore((state) => state.customPlans);

    // Check both predefined and custom plans
    const allPlans = [...WORKOUT_PLANS, ...customPlans];
    const plan = allPlans.find(p => p.id === planId);
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

    // Get sound effects setting
    const { soundEffects, restTimerSound } = useAppSettingsStore((state) => state.settings);

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

    // Rest Timer State
    const [isResting, setIsResting] = React.useState(false);

    // Modal State
    const [modalVisible, setModalVisible] = React.useState(false);
    const [modalConfig, setModalConfig] = React.useState<{
        title: string;
        message: string;
        buttons: { text: string; onPress: () => void; style?: 'default' | 'cancel' | 'destructive' }[];
    }>({
        title: '',
        message: '',
        buttons: []
    });

    React.useEffect(() => {
        if (activeSession?.restEndTime) {
            const now = new Date().toISOString();
            if (activeSession.restEndTime > now) {
                setIsResting(true);
            } else {
                // If loaded and time passed, clear rest
                updateSession({ restEndTime: null });
                setIsResting(false);
            }
        } else {
            setIsResting(false);
        }
    }, [activeSession?.restEndTime]);

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
                startTime: new Date().toISOString(),
                restEndTime: null
            });
            setCurrentIndex(0);
        }
    }, [planId, day]);

    // TTS: Announce Exercise
    React.useEffect(() => {
        if (!isResting && workoutSequence.length > 0 && currentIndex < workoutSequence.length) {
            const step = workoutSequence[currentIndex];
            ttsService.announceExercise(
                step.exercise.name,
                `${step.reps}`,
                step.exercise.weight,
                soundEffects
            );
        }
    }, [currentIndex, isResting, workoutSequence, soundEffects]);

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
            setModalConfig({
                title: 'Finish Workout?',
                message: `You have ${workoutSequence.length - currentIndex} sets remaining. Finish anyway?`,
                buttons: [
                    { text: 'Cancel', onPress: () => setModalVisible(false), style: 'cancel' },
                    { text: 'Finish', onPress: () => { setModalVisible(false); saveAndFinish(); }, style: 'default' }
                ]
            });
            setModalVisible(true);
        } else {
            saveAndFinish();
        }
    };

    const handleStepCompletion = (skipped: boolean) => {
        if (!activeSession) return;

        const currentStep = workoutSequence[currentIndex];
        const isLastStep = currentIndex === workoutSequence.length - 1;

        // Calculate stats (unchanged)
        const weightNum = parseFloat(currentStep.exercise.weight) || 0;
        const stepWeight = skipped ? 0 : (weightNum * currentStep.reps);
        const totalSteps = workoutSequence.length;
        const totalCalories = dayPlan?.stats?.calories || plan.stats?.calories || 200;
        const stepCalories = skipped ? 0 : Math.round(totalCalories / totalSteps);

        const nextIndex = currentIndex + 1;

        // Determine Rest Time
        let restDuration = 0;
        if (nextIndex < workoutSequence.length) {
            const nextStep = workoutSequence[nextIndex];
            if (nextStep.exercise.id === currentStep.exercise.id) {
                restDuration = plan.restBetweenSets || 60;
            } else {
                restDuration = plan.restBetweenExercises || 90;
            }
        }

        const updates: Partial<ActiveSession> = {
            currentStepIndex: nextIndex,
            completedWeight: activeSession.completedWeight + stepWeight,
            accumulatedCalories: activeSession.accumulatedCalories + stepCalories,
            restEndTime: restDuration > 0
                ? new Date(Date.now() + restDuration * 1000).toISOString()
                : null
        };

        // TTS: Announce Rest
        if (restDuration > 0 && !isLastStep) {
            ttsService.announceRest(restDuration, restTimerSound);
        }

        if (isLastStep) {
            // ... final save logic (unchanged essentially, just ensure no rest set if finishing)
            const startTime = new Date(activeSession.startTime).getTime();
            const durationMinutes = Math.max(1, Math.round((Date.now() - startTime) / 60000));

            // TTS: Announce Workout Complete
            ttsService.announceWorkoutComplete(soundEffects);

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
            updateSession(updates);
            setCurrentIndex(nextIndex);
            // Timer checks effect will trigger IsResting=true if restEndTime is set
        }
    };

    // Timer Handlers
    const handleTimerComplete = () => {
        setIsResting(false);
        updateSession({ restEndTime: null });
        ttsService.announceRestComplete(restTimerSound);
    };

    const handleTimerAdjust = (seconds: number) => {
        if (activeSession?.restEndTime) {
            const newEnd = new Date(new Date(activeSession.restEndTime).getTime() + seconds * 1000).toISOString();
            updateSession({ restEndTime: newEnd });
        }
    };

    const handleTimerSkip = () => {
        handleTimerComplete();
    };

    const isLastStep = currentIndex === workoutSequence.length - 1;
    const currentStep = workoutSequence[currentIndex];

    const handleNext = () => handleStepCompletion(false);
    const handleSkip = () => handleStepCompletion(true);

    const handleQuit = () => {
        setModalConfig({
            title: 'Quit Workout?',
            message: 'Your progress is saved. You can resume later or finish now.',
            buttons: [
                {
                    text: 'Resume Later',
                    onPress: () => { setModalVisible(false); navigation.goBack(); },
                    style: 'default'
                },
                {
                    text: 'Complete Day',
                    onPress: () => { setModalVisible(false); saveAndFinish(); },
                    style: 'default'
                },
                {
                    text: 'Discard',
                    onPress: () => { setModalVisible(false); clearSession(); navigation.goBack(); },
                    style: 'destructive'
                }
            ]
        });
        setModalVisible(true);
    };

    return (
        <Screen>
            <RestTimer
                isVisible={isResting}
                targetTime={activeSession?.restEndTime || ''}
                onComplete={handleTimerComplete}
                onAdd={handleTimerAdjust}
                onSkip={handleTimerSkip}
            />
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
                {currentStep.exercise.image && (
                    <View style={styles.imageContainer}>
                        <Image
                            source={currentStep.exercise.image}
                            style={styles.exerciseImage}
                            resizeMode="contain"
                        />
                    </View>
                )}
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

            <ConfirmationModal
                visible={modalVisible}
                title={modalConfig.title}
                message={modalConfig.message}
                buttons={modalConfig.buttons}
                onCancel={() => setModalVisible(false)}
            />
        </Screen >

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
    imageContainer: {
        width: '100%',
        height: 250,
        marginBottom: Theme.spacing.m,
        alignItems: 'center',
        justifyContent: 'center',
    },
    exerciseImage: {
        width: '100%',
        height: '100%',
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
