import React from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import { Screen } from '../../components/common/Screen';
import { Theme } from '../../theme';
import { PlanCard } from '../../components/workouts/PlanCard';
import { CreateCustomCard } from '../../components/workouts/CreateCustomCard';
import { WORKOUT_PLANS } from '../../data/workoutPlans';

export const PredefinedWorkoutsScreen = () => {
  return (
    <Screen>
      <FlatList
        data={WORKOUT_PLANS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PlanCard plan={item} />}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <Text style={styles.headerTitle}>Choose Your Plan</Text>
        }
        ListFooterComponent={<CreateCustomCard />}
        showsVerticalScrollIndicator={false}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  listContent: {
    padding: Theme.spacing.m,
    paddingBottom: Theme.spacing.xl,
  },
  headerTitle: {
    ...Theme.textVariants.header,
    marginBottom: Theme.spacing.m,
  },
});
