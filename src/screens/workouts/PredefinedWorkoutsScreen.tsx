import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { Theme } from '../../theme';
import { WORKOUT_PLANS } from '../../data/workoutPlans';
import { useWorkoutStore } from '../../store/workoutStore';
import { PlanCard } from '../../components/workouts/PlanCard';
import { CreateCustomCard } from '../../components/workouts/CreateCustomCard';
import { ScreenContainer } from '../../components/common/Screen';

type Props = NativeStackScreenProps<RootStackParamList>;

export const PredefinedWorkoutsScreen: React.FC<Props> = ({ navigation }) => {
  const customPlans = useWorkoutStore((state) => state.customPlans);

  // Merge predefined and custom plans
  const allPlans = [...WORKOUT_PLANS, ...customPlans];

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Workout Plans</Text>
          <Text style={styles.subtitle}>Choose your fitness journey</Text>
        </View>

        <FlatList
          data={allPlans}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PlanCard
              plan={item}
              onPress={() => navigation.navigate('WorkoutDetails', { planId: item.id })}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            <CreateCustomCard onPress={() => navigation.navigate('CreateCustomPlan')} />
          }
        />
      </View>
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
