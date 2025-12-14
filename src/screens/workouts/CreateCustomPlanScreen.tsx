import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { Theme } from '../../theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Screen } from '../../components/common/Screen';
import { PlanExercise, DayPlan, WorkoutPlan } from '../../data/workoutPlans';

type Props = NativeStackScreenProps<RootStackParamList, 'CreateCustomPlan'>;

interface CustomExercise extends PlanExercise {
    tempId: string;
}

interface CustomDay extends Omit<DayPlan, 'exercises'> {
    exercises: CustomExercise[];
    isRestDay?: boolean;
}

export const CreateCustomPlanScreen: React.FC<Props> = ({ navigation }) => {
    const [step, setStep] = useState(1);

    // Plan Details
    const [planName, setPlanName] = useState('');
    const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
    const [daysPerWeek, setDaysPerWeek] = useState('');

    // Days & Exercises
    const [days, setDays] = useState<CustomDay[]>([
        { day: 1, title: 'Day 1', exercises: [], isRestDay: false }
    ]);
    const [currentDayIndex, setCurrentDayIndex] = useState(0);

    // Exercise Form
    const [exerciseName, setExerciseName] = useState('');
    const [numSets, setNumSets] = useState('');
    const [reps, setReps] = useState('');
    const [weight, setWeight] = useState('');

    const addExercise = () => {
        if (!exerciseName || !numSets || !reps || !weight) {
            Alert.alert('Error', 'Please fill all exercise fields');
            return;
        }

        // Format sets as "12 x 3" (reps x sets)
        const setsDisplay = `${reps} x ${numSets}`;

        const newExercise: CustomExercise = {
            id: Date.now().toString(),
            tempId: Date.now().toString(),
            name: exerciseName,
            sets: setsDisplay,
            weight: weight,
        };

        const updatedDays = [...days];
        updatedDays[currentDayIndex].exercises.push(newExercise);
        setDays(updatedDays);

        // Clear form
        setExerciseName('');
        setNumSets('');
        setReps('');
        setWeight('');
    };

    const removeExercise = (tempId: string) => {
        const updatedDays = [...days];
        updatedDays[currentDayIndex].exercises = updatedDays[currentDayIndex].exercises.filter(
            e => e.tempId !== tempId
        );
        setDays(updatedDays);
    };

    const addDay = () => {
        if (days.length >= 7) {
            Alert.alert('Maximum Days Reached', 'You can add up to 7 days (one week) maximum');
            return;
        }
        setDays([...days, { day: days.length + 1, title: `Day ${days.length + 1}`, exercises: [], isRestDay: false }]);
    };

    const removeDay = (dayIndex: number) => {
        if (days.length === 1) {
            Alert.alert('Error', 'You must have at least one day');
            return;
        }
        const updatedDays = days.filter((_, i) => i !== dayIndex);
        // Renumber days
        const renumberedDays = updatedDays.map((day, index) => ({
            ...day,
            day: index + 1,
            title: `Day ${index + 1}`
        }));
        setDays(renumberedDays);
        if (currentDayIndex >= renumberedDays.length) {
            setCurrentDayIndex(renumberedDays.length - 1);
        }
    };

    const toggleRestDay = () => {
        const updatedDays = [...days];
        const currentDay = updatedDays[currentDayIndex];
        currentDay.isRestDay = !currentDay.isRestDay;

        // Clear exercises if marking as rest day
        if (currentDay.isRestDay) {
            currentDay.exercises = [];
        }

        setDays(updatedDays);
    };

    const savePlan = () => {
        // Validate plan details
        if (!planName.trim() || !daysPerWeek.trim()) {
            Alert.alert('Error', 'Please complete Step 1: Plan Details first');
            setStep(1);
            return;
        }

        // Validate at least one day exists
        if (days.length === 0) {
            Alert.alert('Error', 'Please add at least one day to your plan');
            return;
        }

        // Validate each non-rest day has at least one exercise
        const emptyWorkoutDays = days.filter(d => !d.isRestDay && d.exercises.length === 0);
        if (emptyWorkoutDays.length > 0) {
            Alert.alert(
                'Incomplete Days',
                `Day ${emptyWorkoutDays.map(d => d.day).join(', ')} ${emptyWorkoutDays.length === 1 ? 'has' : 'have'} no exercises. Please add exercises or mark as rest day.`
            );
            return;
        }

        // Validate at least one workout day exists
        const workoutDays = days.filter(d => !d.isRestDay);
        if (workoutDays.length === 0) {
            Alert.alert('Error', 'Your plan must have at least one workout day (not all rest days)');
            return;
        }

        // All validations passed
        const totalExercises = days.reduce((sum, day) => sum + day.exercises.length, 0);
        const restDayCount = days.filter(d => d.isRestDay).length;

        // TODO: Save to store
        Alert.alert(
            'Success',
            `Custom plan "${planName}" created with ${days.length} day(s) (${restDayCount} rest day${restDayCount !== 1 ? 's' : ''}) and ${totalExercises} exercise(s)!`,
            [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
    };
    const renderStepIndicator = () => (
        <View style={styles.stepIndicator}>
            <View style={[styles.stepDot, step >= 1 && styles.stepDotActive]}>
                <Text style={styles.stepNumber}>1</Text>
            </View>
            <View style={[styles.stepLine, step >= 2 && styles.stepLineActive]} />
            <View style={[styles.stepDot, step >= 2 && styles.stepDotActive]}>
                <Text style={styles.stepNumber}>2</Text>
            </View>
        </View>
    );

    const handleNextStep = () => {
        if (!planName.trim()) {
            Alert.alert('Required Field', 'Please enter a plan name');
            return;
        }
        if (!daysPerWeek.trim()) {
            Alert.alert('Required Field', 'Please enter days per week (1-7)');
            return;
        }
        const numDays = parseInt(daysPerWeek);
        if (isNaN(numDays) || numDays < 1 || numDays > 7) {
            Alert.alert('Invalid Input', 'Days per week must be a number between 1 and 7');
            return;
        }

        // Initialize days array based on daysPerWeek
        const initialDays: CustomDay[] = [];
        for (let i = 1; i <= numDays; i++) {
            initialDays.push({
                day: i,
                title: `Day ${i}`,
                exercises: [],
                isRestDay: false
            });
        }
        setDays(initialDays);
        setCurrentDayIndex(0);

        setStep(2);
    };

    const renderStep1 = () => (
        <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Plan Details</Text>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Plan Name *</Text>
                <TextInput
                    style={styles.input}
                    value={planName}
                    onChangeText={setPlanName}
                    placeholder="e.g., My Custom Plan"
                    placeholderTextColor={Theme.colors.gray[500]}
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Difficulty</Text>
                <View style={styles.difficultyButtons}>
                    {(['Beginner', 'Intermediate', 'Advanced'] as const).map((level) => (
                        <TouchableOpacity
                            key={level}
                            style={[styles.difficultyButton, difficulty === level && styles.difficultyButtonActive]}
                            onPress={() => setDifficulty(level)}
                        >
                            <Text style={[styles.difficultyText, difficulty === level && styles.difficultyTextActive]}>
                                {level}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Days Per Week *</Text>
                <TextInput
                    style={styles.input}
                    value={daysPerWeek}
                    onChangeText={(text) => {
                        // Only allow numbers
                        const numericValue = text.replace(/[^0-9]/g, '');
                        setDaysPerWeek(numericValue);
                    }}
                    placeholder="e.g., 3"
                    placeholderTextColor={Theme.colors.gray[500]}
                    keyboardType="number-pad"
                    maxLength={1}
                />
                <Text style={styles.helperText}>Enter a number between 1-7</Text>
            </View>

            <TouchableOpacity
                style={[
                    styles.primaryButton,
                    (!planName.trim() || !daysPerWeek.trim()) && styles.primaryButtonDisabled
                ]}
                onPress={handleNextStep}
                disabled={!planName.trim() || !daysPerWeek.trim()}
            >
                <Text style={styles.primaryButtonText}>Next: Add Exercises</Text>
                <Ionicons name="arrow-forward" size={20} color={Theme.colors.background} />
            </TouchableOpacity>
        </View>
    );

    const renderStep2 = () => {
        const currentDay = days[currentDayIndex];

        return (
            <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Add Exercises</Text>

                {/* Day Tabs */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dayTabs}>
                    {days.map((day, index) => (
                        <TouchableOpacity
                            key={day.day}
                            style={[
                                styles.dayTab,
                                currentDayIndex === index && styles.dayTabActive,
                                day.isRestDay && styles.dayTabRest
                            ]}
                            onPress={() => setCurrentDayIndex(index)}
                        >
                            <Text style={[
                                styles.dayTabText,
                                currentDayIndex === index && styles.dayTabTextActive,
                                day.isRestDay && styles.dayTabTextRest
                            ]}>
                                {day.isRestDay ? '😴 ' : ''}Day {day.day}
                            </Text>
                            {days.length > 1 && (
                                <TouchableOpacity onPress={() => removeDay(index)} style={styles.removeDayButton}>
                                    <Ionicons name="close-circle" size={16} color={Theme.colors.error} />
                                </TouchableOpacity>
                            )}
                        </TouchableOpacity>
                    ))}
                    <TouchableOpacity
                        style={[styles.addDayButton, days.length >= 7 && styles.addDayButtonDisabled]}
                        onPress={addDay}
                        disabled={days.length >= 7}
                    >
                        <Ionicons name="add" size={20} color={days.length >= 7 ? Theme.colors.gray[700] : Theme.colors.primary} />
                    </TouchableOpacity>
                </ScrollView>

                {/* Rest Day Toggle */}
                <TouchableOpacity style={styles.restDayToggle} onPress={toggleRestDay}>
                    <View style={styles.restDayToggleLeft}>
                        <Ionicons
                            name={currentDay.isRestDay ? "bed" : "bed-outline"}
                            size={20}
                            color={currentDay.isRestDay ? Theme.colors.primary : Theme.colors.gray[500]}
                        />
                        <Text style={styles.restDayToggleText}>Rest Day</Text>
                    </View>
                    <View style={[styles.toggleSwitch, currentDay.isRestDay && styles.toggleSwitchActive]}>
                        <View style={[styles.toggleThumb, currentDay.isRestDay && styles.toggleThumbActive]} />
                    </View>
                </TouchableOpacity>

                {!currentDay.isRestDay ? (
                    <>
                        {/* Exercise Form */}
                        <View style={styles.exerciseForm}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Exercise Name</Text>
                                <TextInput
                                    style={styles.input}
                                    value={exerciseName}
                                    onChangeText={setExerciseName}
                                    placeholder="e.g., Bench Press"
                                    placeholderTextColor={Theme.colors.gray[500]}
                                />
                            </View>

                            <View style={styles.row}>
                                <View style={[styles.inputGroup, { flex: 1, marginRight: 4 }]}>
                                    <Text style={styles.label}>Sets</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={numSets}
                                        onChangeText={(text) => setNumSets(text.replace(/[^0-9]/g, ''))}
                                        placeholder="3"
                                        placeholderTextColor={Theme.colors.gray[500]}
                                        keyboardType="number-pad"
                                        maxLength={2}
                                    />
                                </View>

                                <View style={[styles.inputGroup, { flex: 1, marginHorizontal: 4 }]}>
                                    <Text style={styles.label}>Reps</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={reps}
                                        onChangeText={(text) => setReps(text.replace(/[^0-9]/g, ''))}
                                        placeholder="12"
                                        placeholderTextColor={Theme.colors.gray[500]}
                                        keyboardType="number-pad"
                                        maxLength={3}
                                    />
                                </View>

                                <View style={[styles.inputGroup, { flex: 1, marginLeft: 4 }]}>
                                    <Text style={styles.label}>Weight (kg)</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={weight}
                                        onChangeText={setWeight}
                                        placeholder="8"
                                        placeholderTextColor={Theme.colors.gray[500]}
                                        keyboardType="numeric"
                                    />
                                </View>
                            </View>

                            <TouchableOpacity style={styles.secondaryButton} onPress={addExercise}>
                                <Ionicons name="add-circle-outline" size={20} color={Theme.colors.primary} />
                                <Text style={styles.secondaryButtonText}>Add Exercise</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Exercise List */}
                        <View style={styles.exerciseList}>
                            <Text style={styles.sectionTitle}>
                                Exercises ({currentDay.exercises.length})
                            </Text>
                            {currentDay.exercises.map((exercise, index) => (
                                <View key={exercise.tempId} style={styles.exerciseCard}>
                                    <View style={styles.exerciseNumber}>
                                        <Text style={styles.exerciseNumberText}>{index + 1}</Text>
                                    </View>
                                    <View style={styles.exerciseContent}>
                                        <Text style={styles.exerciseName}>{exercise.name}</Text>
                                        <Text style={styles.exerciseDetails}>
                                            {exercise.sets} • {exercise.weight}
                                        </Text>
                                    </View>
                                    <TouchableOpacity onPress={() => removeExercise(exercise.tempId)}>
                                        <Ionicons name="trash-outline" size={20} color={Theme.colors.error} />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    </>
                ) : (
                    <View style={styles.restDayMessage}>
                        <Ionicons name="bed" size={48} color={Theme.colors.gray[600]} />
                        <Text style={styles.restDayMessageText}>This is a rest day</Text>
                        <Text style={styles.restDayMessageSubtext}>No exercises needed. Your body needs recovery!</Text>
                    </View>
                )}

                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                    <TouchableOpacity style={styles.backButton} onPress={() => setStep(1)}>
                        <Ionicons name="arrow-back" size={20} color={Theme.colors.white} />
                        <Text style={styles.backButtonText}>Back</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.saveButton,
                            days.every(d => d.isRestDay || d.exercises.length === 0) && styles.saveButtonDisabled
                        ]}
                        onPress={savePlan}
                        disabled={days.every(d => d.isRestDay || d.exercises.length === 0)}
                    >
                        <Ionicons name="checkmark" size={20} color={Theme.colors.background} />
                        <Text style={styles.saveButtonText}>Save Plan</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <Screen>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
                        <Ionicons name="close" size={24} color={Theme.colors.white} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Create Custom Plan</Text>
                    <View style={{ width: 40 }} />
                </View>

                {/* Step Indicator */}
                {renderStepIndicator()}

                {/* Content */}
                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    {step === 1 ? renderStep1() : renderStep2()}
                </ScrollView>
            </View>
        </Screen>
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
        paddingVertical: Theme.spacing.m,
        borderBottomWidth: 1,
        borderBottomColor: Theme.colors.surface,
    },
    closeButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        color: Theme.colors.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
    stepIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Theme.spacing.l,
    },
    stepDot: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: Theme.colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
    },
    stepDotActive: {
        backgroundColor: Theme.colors.primary,
    },
    stepNumber: {
        color: Theme.colors.white,
        fontSize: 14,
        fontWeight: 'bold',
    },
    stepLine: {
        width: 60,
        height: 2,
        backgroundColor: Theme.colors.surface,
    },
    stepLineActive: {
        backgroundColor: Theme.colors.primary,
    },
    content: {
        flex: 1,
    },
    stepContent: {
        padding: Theme.spacing.m,
    },
    stepTitle: {
        color: Theme.colors.white,
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: Theme.spacing.l,
    },
    inputGroup: {
        marginBottom: Theme.spacing.m,
    },
    label: {
        color: Theme.colors.white,
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    helperText: {
        color: Theme.colors.gray[500],
        fontSize: 12,
        marginTop: 4,
    },
    input: {
        backgroundColor: Theme.colors.surface,
        borderRadius: Theme.borderRadius.m,
        padding: Theme.spacing.m,
        color: Theme.colors.white,
        fontSize: 16,
    },
    difficultyButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    difficultyButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: Theme.borderRadius.m,
        backgroundColor: Theme.colors.surface,
        alignItems: 'center',
    },
    difficultyButtonActive: {
        backgroundColor: Theme.colors.primary,
    },
    difficultyText: {
        color: Theme.colors.gray[400],
        fontSize: 14,
        fontWeight: '600',
    },
    difficultyTextActive: {
        color: Theme.colors.background,
    },
    primaryButton: {
        backgroundColor: Theme.colors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: Theme.borderRadius.l,
        marginTop: Theme.spacing.l,
        gap: 8,
    },
    primaryButtonDisabled: {
        backgroundColor: Theme.colors.gray[700],
        opacity: 0.5,
    },
    primaryButtonText: {
        color: Theme.colors.background,
        fontSize: 16,
        fontWeight: 'bold',
    },
    dayTabs: {
        marginBottom: Theme.spacing.m,
    },
    dayTab: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: Theme.borderRadius.m,
        backgroundColor: Theme.colors.surface,
        marginRight: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    dayTabActive: {
        backgroundColor: Theme.colors.primary,
    },
    dayTabRest: {
        backgroundColor: Theme.colors.gray[800],
        borderWidth: 1,
        borderColor: Theme.colors.gray[700],
    },
    dayTabText: {
        color: Theme.colors.gray[400],
        fontSize: 14,
        fontWeight: '600',
    },
    dayTabTextActive: {
        color: Theme.colors.background,
    },
    dayTabTextRest: {
        color: Theme.colors.gray[500],
    },
    removeDayButton: {
        marginLeft: 4,
    },
    addDayButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Theme.colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
    },
    addDayButtonDisabled: {
        opacity: 0.3,
    },
    restDayToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Theme.colors.surface,
        borderRadius: Theme.borderRadius.m,
        padding: Theme.spacing.m,
        marginBottom: Theme.spacing.m,
    },
    restDayToggleLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    restDayToggleText: {
        color: Theme.colors.white,
        fontSize: 16,
        fontWeight: '600',
    },
    toggleSwitch: {
        width: 50,
        height: 28,
        borderRadius: 14,
        backgroundColor: Theme.colors.gray[700],
        padding: 2,
        justifyContent: 'center',
    },
    toggleSwitchActive: {
        backgroundColor: Theme.colors.primary,
    },
    toggleThumb: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: Theme.colors.white,
    },
    toggleThumbActive: {
        alignSelf: 'flex-end',
    },
    restDayMessage: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Theme.spacing.xl * 2,
    },
    restDayMessageText: {
        color: Theme.colors.white,
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: Theme.spacing.m,
    },
    restDayMessageSubtext: {
        color: Theme.colors.gray[500],
        fontSize: 14,
        marginTop: 4,
        textAlign: 'center',
    },
    exerciseForm: {
        backgroundColor: Theme.colors.surface,
        borderRadius: Theme.borderRadius.l,
        padding: Theme.spacing.m,
        marginBottom: Theme.spacing.m,
    },
    row: {
        flexDirection: 'row',
    },
    secondaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: Theme.borderRadius.m,
        borderWidth: 1,
        borderColor: Theme.colors.primary,
        gap: 8,
        marginTop: 8,
    },
    secondaryButtonText: {
        color: Theme.colors.primary,
        fontSize: 14,
        fontWeight: '600',
    },
    exerciseList: {
        marginBottom: Theme.spacing.xl,
    },
    sectionTitle: {
        color: Theme.colors.white,
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: Theme.spacing.m,
    },
    exerciseCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Theme.colors.surface,
        borderRadius: Theme.borderRadius.m,
        padding: Theme.spacing.m,
        marginBottom: Theme.spacing.s,
    },
    exerciseNumber: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(212, 255, 0, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Theme.spacing.m,
    },
    exerciseNumberText: {
        color: Theme.colors.primary,
        fontSize: 14,
        fontWeight: 'bold',
    },
    exerciseContent: {
        flex: 1,
    },
    exerciseName: {
        color: Theme.colors.white,
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    exerciseDetails: {
        color: Theme.colors.gray[500],
        fontSize: 13,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: Theme.spacing.xl,
    },
    backButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: Theme.borderRadius.l,
        backgroundColor: Theme.colors.surface,
        gap: 8,
    },
    backButtonText: {
        color: Theme.colors.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
    saveButton: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: Theme.borderRadius.l,
        backgroundColor: Theme.colors.primary,
        gap: 8,
    },
    saveButtonDisabled: {
        backgroundColor: Theme.colors.gray[700],
        opacity: 0.5,
    },
    saveButtonText: {
        color: Theme.colors.background,
        fontSize: 16,
        fontWeight: 'bold',
    },
});
