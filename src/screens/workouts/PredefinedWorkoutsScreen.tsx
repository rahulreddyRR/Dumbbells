import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ImageBackground } from 'react-native';
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
import Ionicons from 'react-native-vector-icons/Ionicons';

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
  const allPlans = [...WORKOUT_PLANS, ...customPlans];

  // Logic for Today's Workout
  const activePlan = allPlans.find(p => p.id === activePlanId);

  // Calculate today's day number
  const todayDate = new Date();
  const todayDayNum = todayDate.getDay(); // 0 (Sun) - 6 (Sat)
  const currentDayNum = todayDayNum === 0 ? 7 : todayDayNum;

  const todaysWorkout = activePlan?.schedule.find(d => d.day === currentDayNum);

  // Check if today's workout is completed
  const isTodayCompleted = React.useMemo(() => {
    if (!activePlan || !todaysWorkout) return false;
    const todayStr = todayDate.toISOString().split('T')[0];

    // Check if we have a log for this plan on this date
    // Note: Ideally we should also check if it matches the specific 'day' or 'session', 
    // but simplified check by date and plan is good for now. 
    // If strict, we can check if any workout on this date matches planId and today's day schedule stats.
    return completedWorkouts.some(w =>
      w.planId === activePlan.id &&
      w.date.startsWith(todayStr)
    );
  }, [activePlan, todaysWorkout, completedWorkouts]);


  const handleDeletePlan = (planId: string, planTitle: string) => {
    setPlanToDelete({ id: planId, title: planTitle });
    setDeleteModalVisible(true);
  };

  const confirmDelete = () => {
    if (planToDelete) {
      deleteCustomPlan(planToDelete.id);
    }
    setDeleteModalVisible(false);
    setPlanToDelete(null);
  };

  const isCustomPlan = (planId: string) => {
    return customPlans.some(plan => plan.id === planId);
  };

  const renderTodaysWorkout = () => {
    if (!activePlan) return null;

    if (isTodayCompleted) {
      return (
        <View style={styles.todayContainer}>
          <Text style={styles.sectionTitle}>Today's Workout</Text>
          <View style={styles.completedCard}>
            <View style={styles.completedIconCallback}>
              <Ionicons name="checkmark" size={32} color={Theme.colors.background} />
            </View>
            <Text style={styles.completedTitle}>Workout Complete!</Text>
            <Text style={styles.completedSubtitle}>Great job crushing your goals today.</Text>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.todayContainer}>
        <Text style={styles.sectionTitle}>Today's Workout</Text>
        {todaysWorkout ? (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigation.navigate('WorkoutTracking', { planId: activePlan.id, day: todaysWorkout.day })}
          >
            <ImageBackground
              source={activePlan.image || { uri: 'https://via.placeholder.com/400' }}
              style={styles.todayCard}
              imageStyle={styles.todayCardImage}
            >
              <View style={styles.todayOverlay}>
                <View style={styles.todayBadge}>
                  <Text style={styles.todayBadgeText}>DAY {todaysWorkout.day}</Text>
                </View>
                <View>
                  <Text style={styles.todayTitle}>{todaysWorkout.title}</Text>
                  <Text style={styles.todayPlanName}>{activePlan.title}</Text>
                  <View style={styles.todayStats}>
                    <Ionicons name="time-outline" size={14} color={Theme.colors.gray[300]} />
                    <Text style={styles.todayStatText}>
                      {todaysWorkout.stats?.minutes || activePlan.stats.minutes} min
                    </Text>
                    <View style={styles.dot} />
                    <Ionicons name="barbell-outline" size={14} color={Theme.colors.gray[300]} />
                    <Text style={styles.todayStatText}>
                      {todaysWorkout.exercises.length} Exercises
                    </Text>
                  </View>
                </View>
                <View style={styles.playButton}>
                  <Ionicons name="play" size={20} color={Theme.colors.background} />
                </View>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        ) : (
          <View style={styles.restCard}>
            <Ionicons name="cafe-outline" size={32} color={Theme.colors.primary} />
            <Text style={styles.restTitle}>Rest Day</Text>
            <Text style={styles.restSubtitle}>Take it easy today! Recovery is key.</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <FlatList
          data={allPlans}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            <View style={styles.header}>
              <Text style={styles.title}>Hey {userName || 'there'}! 💪</Text>
              <Text style={styles.subtitle}>Let's crush your goals</Text>

              {renderTodaysWorkout()}

              <Text style={[styles.sectionTitle, { marginTop: Theme.spacing.xl }]}>Browse Plans</Text>
            </View>
          }
          renderItem={({ item }) => (
            <PlanCard
              plan={item}
              onPress={() => navigation.navigate('WorkoutDetails', { planId: item.id })}
              isCustom={isCustomPlan(item.id)}
              onDelete={isCustomPlan(item.id) ? () => handleDeletePlan(item.id, item.title) : undefined}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            <CreateCustomCard onPress={() => navigation.navigate('CreateCustomPlan')} />
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
  header: {
    paddingTop: Theme.spacing.m,
  },
  title: {
    color: Theme.colors.white,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    color: Theme.colors.gray[400],
    fontSize: 14,
    marginBottom: Theme.spacing.l,
  },
  listContent: {
    padding: Theme.spacing.m,
    paddingBottom: Theme.spacing.xl,
    paddingTop: 0,
  },
  sectionTitle: {
    ...Theme.textVariants.subheader,
    fontSize: 18,
    color: Theme.colors.white,
    marginBottom: Theme.spacing.m,
  },

  // Today's Workout Styles
  todayContainer: {
    marginBottom: Theme.spacing.s,
  },
  todayCard: {
    height: 140,
    width: '100%',
    borderRadius: Theme.borderRadius.l,
    overflow: 'hidden',
  },
  todayCardImage: {
    resizeMode: 'cover',
  },
  todayOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: Theme.spacing.m,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  todayBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: Theme.colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  todayBadgeText: {
    color: Theme.colors.background,
    fontSize: 10,
    fontWeight: 'bold',
  },
  todayTitle: {
    color: Theme.colors.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20, // Space for badge
  },
  todayPlanName: {
    color: Theme.colors.gray[300],
    fontSize: 12,
    marginBottom: 8,
  },
  todayStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  todayStatText: {
    color: Theme.colors.gray[300],
    fontSize: 12,
    marginLeft: 4,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: Theme.colors.gray[500],
    marginHorizontal: 6,
  },
  playButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Rest Day Styles
  restCard: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.l,
    padding: Theme.spacing.l,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Theme.colors.border,
    borderStyle: 'dashed',
  },
  restTitle: {
    color: Theme.colors.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: Theme.spacing.s,
  },
  restSubtitle: {
    color: Theme.colors.gray[500],
    fontSize: 12,
    marginTop: 4,
  },

  // Completed Card Styles
  completedCard: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.l,
    padding: Theme.spacing.l,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: Theme.colors.success,
    borderWidth: 1,
  },
  completedIconCallback: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Theme.colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Theme.spacing.m,
  },
  completedTitle: {
    color: Theme.colors.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  completedSubtitle: {
    color: Theme.colors.gray[400],
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
  },
});
