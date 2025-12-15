import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
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

type Props = NativeStackScreenProps<RootStackParamList>;

export const PredefinedWorkoutsScreen: React.FC<Props> = ({ navigation }) => {
  const customPlans = useWorkoutStore((state) => state.customPlans);
  const deleteCustomPlan = useWorkoutStore((state) => state.deleteCustomPlan);
  const userName = useUserProfileStore((state) => state.profile.name);

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<{ id: string; title: string } | null>(null);

  // Merge predefined and custom plans
  const allPlans = [...WORKOUT_PLANS, ...customPlans];

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

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Hey {userName || 'there'}! 💪</Text>
          <Text style={styles.subtitle}>Choose your fitness journey</Text>
        </View>

        <FlatList
          data={allPlans}
          keyExtractor={(item) => item.id}
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
    paddingHorizontal: Theme.spacing.m,
    paddingTop: Theme.spacing.m,
    paddingBottom: Theme.spacing.s,
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
  },
  listContent: {
    padding: Theme.spacing.m,
    paddingBottom: Theme.spacing.xl,
  },
  headerTitle: {
    ...Theme.textVariants.header,
    marginBottom: Theme.spacing.m,
  },
});
