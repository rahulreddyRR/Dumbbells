import React from 'react';
import { StyleSheet, FlatList, Text } from 'react-native';
import { ScreenContainer } from '../../components/common/Screen';
import { Theme } from '../../theme';
import { PlanCard } from '../../components/workouts/PlanCard';
import { CreateCustomCard } from '../../components/workouts/CreateCustomCard';
import { WORKOUT_PLANS } from '../../data/workoutPlans';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

export const PredefinedWorkoutsScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <ScreenContainer>
      <FlatList
        data={WORKOUT_PLANS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PlanCard
            plan={item}
            onPress={() => navigation.navigate('WorkoutDetails', { planId: item.id })}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <Text style={styles.headerTitle}>Choose Your Plan</Text>
        }
        ListFooterComponent={<CreateCustomCard />}
        showsVerticalScrollIndicator={false}
      />
    </ScreenContainer>
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
