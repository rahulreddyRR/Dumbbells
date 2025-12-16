import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { WORKOUT_PLANS, PlanExercise } from '../../data/workoutPlans';
import { Theme } from '../../theme';
import { useWorkoutStore, ActiveSession } from '../../store/workoutStore';
import { useAppSettingsStore } from '../../store/appSettingsStore';
import { ttsService } from '../../services/ttsService';
import { Screen } from '../../components/common/Screen';
import { RestTimer } from '../../components/workouts/RestTimer';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';

// Components
import { TrackingScreenHeader } from '../../components/workouts/TrackingScreenHeader';
import { ActiveExerciseView } from '../../components/workouts/ActiveExerciseView';
import { CurrentStats } from '../../components/workouts/CurrentStats';
import { TrackingControls } from '../../components/workouts/TrackingControls';
import { NextUpPreview } from '../../components/workouts/NextUpPreview';

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

    const {
        activeSession,
        startSession,
        updateSession,
        clearSession,
        addCompletedWorkout
    } = useWorkoutStore();

    // Rest Timer State
    const [isResting, setIsResting] = useState(false);

    // Modal State
    const [modalVisible, setModalVisible] = useState(false);
    const [modalConfig, setModalConfig] = useState<{
        title: string;
        message: string;
        buttons: { text: string; onPress: () => void; style?: 'default' | 'cancel' | 'destructive' }[];
    }>({
        title: '',
        message: '',
        buttons: []
    });

    useEffect(() => {
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
    }, [activeSession?.restEndTime, updateSession]);

    // Resume or Start Session
    useEffect(() => {
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
    }, [planId, day, startSession]); // Intentionally omitting activeSession to avoid loop if possible, but logic seems fine as is if stable.
    // Actually, dependency on activeSession is tricky. Better to check once on mount or when planId/day changes.
    // The current logic seems to handle "resume" vs "start fresh" correctly based on route params match.

    // TTS: Announce Exercise
    useEffect(() => {
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

    const saveAndFinish = useCallback(() => {
        // Need to refetch activeSession from store if not using prop, but here we can assume activeSession is fresh enough via hook
        // However, useWorkoutStore returns the current state.
        const currentSession = useWorkoutStore.getState().activeSession;
        if (!currentSession) return;

        // Calculate duration based on start time
        const startTime = new Date(currentSession.startTime).getTime();
        const durationMinutes = Math.max(1, Math.round((Date.now() - startTime) / 60000));

        if (!plan) return;

        addCompletedWorkout({
            id: Date.now().toString(),
            date: new Date().toISOString(),
            planId: plan.id,
            planName: plan.title,
            durationMinutes: durationMinutes,
            caloriesBurned: currentSession.accumulatedCalories,
            weightLifted: currentSession.completedWeight,
        });

        clearSession();
        navigation.navigate('Main');
    }, [activeSession, plan, addCompletedWorkout, clearSession, navigation]);

    const handleFinishPress = useCallback(() => {
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
    }, [currentIndex, workoutSequence.length, saveAndFinish]);

    const handleStepCompletion = useCallback((skipped: boolean) => {
        const currentSession = useWorkoutStore.getState().activeSession;
        if (!currentSession) return;
        if (!plan) return;

        const currentStep = workoutSequence[currentIndex];
        const isLastStep = currentIndex === workoutSequence.length - 1;

        // Calculate stats
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
            completedWeight: currentSession.completedWeight + stepWeight,
            accumulatedCalories: currentSession.accumulatedCalories + stepCalories,
            restEndTime: restDuration > 0
                ? new Date(Date.now() + restDuration * 1000).toISOString()
                : null
        };

        // TTS: Announce Rest
        if (restDuration > 0 && !isLastStep) {
            ttsService.announceRest(restDuration, restTimerSound);
        }

        if (isLastStep) {
            const startTime = new Date(currentSession.startTime).getTime();
            const durationMinutes = Math.max(1, Math.round((Date.now() - startTime) / 60000));

            // TTS: Announce Workout Complete
            ttsService.announceWorkoutComplete(soundEffects);

            addCompletedWorkout({
                id: Date.now().toString(),
                date: new Date().toISOString(),
                planId: plan.id,
                planName: plan.title,
                durationMinutes: durationMinutes,
                caloriesBurned: currentSession.accumulatedCalories + stepCalories,
                weightLifted: currentSession.completedWeight + stepWeight,
            });
            clearSession();
            navigation.navigate('Main');
        } else {
            updateSession(updates);
            setCurrentIndex(nextIndex);
        }
    }, [activeSession, currentIndex, dayPlan?.stats?.calories, plan, workoutSequence, restTimerSound, soundEffects, addCompletedWorkout, clearSession, navigation, updateSession]);

    // Timer Handlers
    const handleTimerComplete = useCallback(() => {
        setIsResting(false);
        updateSession({ restEndTime: null });
        ttsService.announceRestComplete(restTimerSound);
    }, [updateSession, restTimerSound]);

    const handleTimerAdjust = useCallback((seconds: number) => {
        const currentSession = useWorkoutStore.getState().activeSession;
        if (currentSession?.restEndTime) {
            const newEnd = new Date(new Date(currentSession.restEndTime).getTime() + seconds * 1000).toISOString();
            updateSession({ restEndTime: newEnd });
        }
    }, [updateSession]);

    const handleTimerSkip = useCallback(() => {
        handleTimerComplete();
    }, [handleTimerComplete]);

    const handleNext = useCallback(() => handleStepCompletion(false), [handleStepCompletion]);
    const handleSkip = useCallback(() => handleStepCompletion(true), [handleStepCompletion]);

    const handleQuit = useCallback(() => {
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
    }, [navigation, saveAndFinish, clearSession]);

    if (!plan || !dayPlan || workoutSequence.length === 0) {
        return (
            <View style={styles.container}>
                <Text style={{ color: 'white' }}>Plan or Day not found</Text>
            </View>
        );
    }

    const isLastStep = currentIndex === workoutSequence.length - 1;
    const currentStep = workoutSequence[currentIndex];

    // Safely get next step details
    const nextStep = !isLastStep ? workoutSequence[currentIndex + 1] : undefined;
    const nextStepDetail = nextStep ? {
        setIndex: nextStep.setIndex,
        reps: nextStep.reps
    } : undefined;


    return (
        <Screen style={styles.container}>
            <RestTimer
                isVisible={isResting}
                targetTime={activeSession?.restEndTime || ''}
                onComplete={handleTimerComplete}
                onAdd={handleTimerAdjust}
                onSkip={handleTimerSkip}
            />

            <TrackingScreenHeader
                title={plan.title}
                day={day}
                onQuit={handleQuit}
                onFinish={handleFinishPress}
            />

            {/* Main Content */}
            <View style={styles.contentContainer}>
                <ActiveExerciseView
                    exercise={currentStep.exercise}
                    currentSetIndex={currentStep.setIndex}
                    totalSets={currentStep.totalSets}
                />

                <CurrentStats
                    weight={currentStep.exercise.weight}
                    reps={currentStep.reps}
                />

                <TrackingControls
                    onSkip={handleSkip}
                    onDone={handleNext}
                />
            </View>

            {/* Footer / Next Up */}
            <NextUpPreview
                nextExercise={nextStep?.exercise}
                nextStepDetail={nextStepDetail}
                isLastStep={isLastStep}
            />

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
        backgroundColor: Theme.colors.background,
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: Theme.spacing.m,
    },
});
