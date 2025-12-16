import React, { useState, useMemo, useCallback } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { Theme } from '../../theme';
import { WORKOUT_PLANS } from '../../data/workoutPlans';
import { useWorkoutStore } from '../../store/workoutStore';
import { useUserProfileStore } from '../../store/userProfileStore';
import { PlanCard } from '../../components/workouts/PlanCard';
import { CreateCustomCard } from '../../components/workouts/CreateCustomCard';
import { ScreenContainer } from '../../components/common/Screen';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';
import { TodaysWorkoutCard } from '../../components/workouts/TodaysWorkoutCard';
import { WorkoutsScreenHeader } from '../../components/workouts/WorkoutsScreenHeader';

import { AppConfig } from '../../config/AppConfig';

type Props = NativeStackScreenProps<RootStackParamList>;

export const PredefinedWorkoutsScreen: React.FC<Props> = ({ navigation }) => {
  const customPlans = useWorkoutStore((state) => state.customPlans);
  const deleteCustomPlan = useWorkoutStore((state) => state.deleteCustomPlan);
  const activePlanId = useWorkoutStore((state) => state.activePlanId);
  const completedWorkouts = useWorkoutStore((state) => state.completedWorkouts);
  const userName = useUserProfileStore((state) => state.profile.name);

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<{ id: string; title: string } | null>(null);

  // Merge predefined and custom plans
  const allPlans = useMemo(() => [...WORKOUT_PLANS, ...customPlans], [customPlans]);

  // Logic for Today's Workout
  const activePlan = useMemo(() => allPlans.find(p => p.id === activePlanId), [allPlans, activePlanId]);

  // Calculate today's day number
  const todayDate = new Date();
  const todayDayNum = todayDate.getDay(); // 0 (Sun) - 6 (Sat)
  const currentDayNum = todayDayNum === 0 ? 7 : todayDayNum;

  const todaysWorkout = useMemo(() => activePlan?.schedule.find(d => d.day === currentDayNum), [activePlan, currentDayNum]);

  // Check if today's workout is completed
  const isTodayCompleted = useMemo(() => {
    if (!activePlan || !todaysWorkout) return false;
    const todayStr = todayDate.toISOString().split('T')[0];

    return completedWorkouts.some(w =>
      w.planId === activePlan.id &&
      w.date.startsWith(todayStr)
    );
  }, [activePlan, todaysWorkout, completedWorkouts]);


  const handleDeletePlan = useCallback((planId: string, planTitle: string) => {
    setPlanToDelete({ id: planId, title: planTitle });
    setDeleteModalVisible(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (planToDelete) {
      deleteCustomPlan(planToDelete.id);
    }
    setDeleteModalVisible(false);
    setPlanToDelete(null);
  }, [planToDelete, deleteCustomPlan]);

  const isCustomPlan = useCallback((planId: string) => {
    return customPlans.some(plan => plan.id === planId);
  }, [customPlans]);

  const handleNavigateToTracker = useCallback(() => {
    if (activePlan && todaysWorkout) {
      navigation.navigate('WorkoutTracking', { planId: activePlan.id, day: todaysWorkout.day });
    }
  }, [activePlan, todaysWorkout, navigation]);

  const handleNavigateToDetails = useCallback((planId: string) => {
    navigation.navigate('WorkoutDetails', { planId });
  }, [navigation]);

  const handleCreateCustomOpen = useCallback(() => {
    navigation.navigate('CreateCustomPlan');
  }, [navigation]);

  const renderItem = useCallback(({ item }: { item: typeof allPlans[0] }) => (
    <PlanCard
      plan={item}
      onPress={() => handleNavigateToDetails(item.id)}
      isCustom={isCustomPlan(item.id)}
      onDelete={isCustomPlan(item.id) ? () => handleDeletePlan(item.id, item.title) : undefined}
    />
  ), [handleNavigateToDetails, isCustomPlan, handleDeletePlan]);

  const headerComponent = useMemo(() => (
    <WorkoutsScreenHeader
      userName={userName}
      todaysWorkoutComponent={
        AppConfig.features.enableMyPlan ? (
          <TodaysWorkoutCard
            activePlan={activePlan}
            todaysWorkout={todaysWorkout}
            isTodayCompleted={isTodayCompleted}
            onPress={handleNavigateToTracker}
          />
        ) : null
      }
    />
  ), [userName, activePlan, todaysWorkout, isTodayCompleted, handleNavigateToTracker]);

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <FlatList
          data={allPlans}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={headerComponent}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            <CreateCustomCard onPress={handleCreateCustomOpen} />
          }
        />
      </View>

      <ConfirmationModal
        visible={deleteModalVisible}
        title="Delete Plan"
        message={`Are you sure you want to delete "${planToDelete?.title}"? This action cannot be undone.`}
        buttons={[
          {
            text: 'Cancel',
            onPress: () => {
              setDeleteModalVisible(false);
              setPlanToDelete(null);
            },
            style: 'cancel',
          },
          {
            text: 'Delete',
            onPress: confirmDelete,
            style: 'destructive',
          },
        ]}
        onCancel={() => {
          setDeleteModalVisible(false);
          setPlanToDelete(null);
        }}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  listContent: {
    padding: Theme.spacing.m,
    paddingBottom: Theme.spacing.xl,
    paddingTop: 0,
  },
});

