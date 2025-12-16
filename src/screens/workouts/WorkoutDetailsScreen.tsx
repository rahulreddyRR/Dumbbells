import React, { useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { WORKOUT_PLANS } from '../../data/workoutPlans';
import { useWorkoutStore } from '../../store/workoutStore';
import { Theme } from '../../theme';
import { Screen } from '../../components/common/Screen';

import { WorkoutHeader } from '../../components/workouts/WorkoutHeader';
import { StatsOverview } from '../../components/workouts/StatsOverview';
import { DayNavigation } from '../../components/workouts/DayNavigation';
import { ExerciseList } from '../../components/workouts/ExerciseList';
import { ExerciseImageModal } from '../../components/workouts/ExerciseImageModal';
import { StartWorkoutButton } from '../../components/workouts/StartWorkoutButton';

type Props = NativeStackScreenProps<RootStackParamList, 'WorkoutDetails'>;

export const WorkoutDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { planId } = route.params;
  const customPlans = useWorkoutStore((state) => state.customPlans);
  const setActivePlan = useWorkoutStore((state) => state.setActivePlan);
  const activePlanId = useWorkoutStore((state) => state.activePlanId);

  const isActivePlan = activePlanId === planId;

  // Check both predefined and custom plans
  const plan = useMemo(() => {
    const allPlans = [...WORKOUT_PLANS, ...customPlans];
    return allPlans.find(p => p.id === planId);
  }, [planId, customPlans]);

  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedExerciseImage, setSelectedExerciseImage] = useState<any>(null);

  const currentDayPlan = useMemo(() => {
    if (!plan) return null;
    return plan.schedule.find(d => d.day === selectedDay) || plan.schedule[0];
  }, [plan, selectedDay]);

  const handleNextDay = useCallback(() => {
    if (!plan) return;
    const nextDay = selectedDay + 1;
    if (plan.schedule.some(d => d.day === nextDay)) {
      setSelectedDay(nextDay);
    }
  }, [selectedDay, plan]);

  const handlePrevDay = useCallback(() => {
    if (!plan) return;
    const prevDay = selectedDay - 1;
    if (plan.schedule.some(d => d.day === prevDay)) {
      setSelectedDay(prevDay);
    }
  }, [selectedDay, plan]);

  const handleToggleActivePlan = useCallback(() => {
    if (plan && !isActivePlan) {
      setActivePlan(plan.id);
    }
  }, [plan, isActivePlan, setActivePlan]);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleStartWorkout = useCallback(() => {
    if (plan && currentDayPlan) {
      navigation.navigate('WorkoutTracking', { planId: plan.id, day: currentDayPlan.day });
    }
  }, [navigation, plan, currentDayPlan]);

  if (!plan || !currentDayPlan) return null;

  return (
    <Screen>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <WorkoutHeader
          plan={plan}
          isActivePlan={isActivePlan}
          onBack={handleBack}
          onToggleActivePlan={handleToggleActivePlan}
        />

        <StatsOverview
          calories={currentDayPlan.stats?.calories || plan.stats?.calories || 0}
          weight={currentDayPlan.stats?.weight || plan.stats?.weight || 0}
          minutes={currentDayPlan.stats?.minutes || plan.stats?.minutes || 0}
        />

        <DayNavigation
          selectedDay={selectedDay}
          maxDays={plan.schedule.length}
          currentDayTitle={currentDayPlan.title}
          onNext={handleNextDay}
          onPrev={handlePrevDay}
        />

        <ExerciseList
          exercises={currentDayPlan.exercises}
          onImagePress={setSelectedExerciseImage}
        />

        {/* Bottom Padding */}
        <View style={{ height: 100 }} />
      </ScrollView>

      <StartWorkoutButton onPress={handleStartWorkout} />

      <ExerciseImageModal
        image={selectedExerciseImage}
        onClose={() => setSelectedExerciseImage(null)}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
});
