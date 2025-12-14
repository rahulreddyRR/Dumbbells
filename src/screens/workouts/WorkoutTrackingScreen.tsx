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
                <TouchableOpacity onPress={handleQuit} style={styles.iconButton}>
                    <Ionicons name="close" size={24} color={Theme.colors.white} />
                </TouchableOpacity>
                <View style={styles.headerTitles}>
                    <Text style={styles.headerSubtitle}>{plan.title} • Day {day}</Text>
                </View>
                <TouchableOpacity onPress={handleFinishPress}>
                    <Text style={styles.finishText}>Finish</Text>
                </TouchableOpacity>
            </View>

            {/* Main Content */}
            <View style={styles.contentContainer}>
                {/* Exercise Image */}
                <View style={styles.imageSection}>
                    {currentStep.exercise.image && (
                        <Image
                            source={currentStep.exercise.image}
                            style={styles.exerciseImage}
                            resizeMode="contain"
                        />
                    )}
                </View>

                {/* Exercise Info */}
                <View style={styles.infoSection}>
                    <Text style={styles.exerciseTitle} numberOfLines={2}>{currentStep.exercise.name}</Text>
                    <View style={styles.setBadge}>
                        <Ionicons name="repeat" size={12} color={Theme.colors.primary} style={{ marginRight: 4 }} />
                        <Text style={styles.setText}>Set {currentStep.setIndex} of {currentStep.totalSets}</Text>
                    </View>
                </View>

                {/* Stats Cards */}
                <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel}>WEIGHT</Text>
                        <Text style={styles.statValue}>{currentStep.exercise.weight}</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel}>REPS</Text>
                        <Text style={styles.statValue}>{currentStep.reps}</Text>
                    </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                    <Button
                        title="Skip"
                        onPress={handleSkip}
                        variant="secondary"
                        style={styles.skipButton}
                    />
                    <Button
                        title="Done"
                        onPress={handleNext}
                        style={styles.doneButton}
                    />
                </View>
            </View>

            {/* Footer / Next Up */}
            <View style={styles.footer}>
                {!isLastStep ? (
                    <>
                        <View style={styles.footerHeader}>
                            <Text style={styles.footerLabel}>UP NEXT</Text>
                        </View>
                        <View style={styles.nextExerciseRow}>
                            {workoutSequence[currentIndex + 1].exercise.image ? (
                                <Image
                                    source={workoutSequence[currentIndex + 1].exercise.image}
                                    style={styles.nextThumb}
                                    resizeMode="contain"
                                />
                            ) : (
                                <View style={[styles.nextThumb, { backgroundColor: Theme.colors.gray[800] }]} />
                            )}
                            <View style={styles.nextInfoContainer}>
                                <Text style={styles.nextTitle} numberOfLines={1}>
                                    {workoutSequence[currentIndex + 1].exercise.name}
                                </Text>
                                <Text style={styles.nextDetails}>
                                    Set {workoutSequence[currentIndex + 1].setIndex} • {workoutSequence[currentIndex + 1].reps} Reps
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
    contentContainer: {
        flex: 1,
        paddingHorizontal: Theme.spacing.m,
    },
    imageSection: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: Theme.spacing.s,
    },
    exerciseImage: {
        width: '100%',
        height: '100%',
        maxHeight: 300,
    },
    infoSection: {
        alignItems: 'center',
        marginBottom: Theme.spacing.l,
    },
    exerciseTitle: {
        color: Theme.colors.white,
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
    },
    setBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(212, 255, 0, 0.1)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    setText: {
        color: Theme.colors.primary,
        fontSize: 14,
        fontWeight: 'bold',
    },
    statsContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: Theme.spacing.l,
    },
    statCard: {
        flex: 1,
        backgroundColor: Theme.colors.surface,
        borderRadius: Theme.borderRadius.m,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statLabel: {
        color: Theme.colors.gray[500],
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 4,
        letterSpacing: 0.5,
    },
    statValue: {
        color: Theme.colors.white,
        fontSize: 24,
        fontWeight: 'bold',
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: Theme.spacing.m,
    },
    skipButton: {
        flex: 1,
    },
    doneButton: {
        flex: 2,
    },
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
