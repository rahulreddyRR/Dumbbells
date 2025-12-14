import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, FlatList } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { WORKOUT_PLANS } from '../../data/workoutPlans';
import { Theme } from '../../theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ScreenWithStatusBarAndSafeArea } from '../../components/common/Screen';

type Props = NativeStackScreenProps<RootStackParamList, 'WorkoutDetails'>;

export const WorkoutDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { planId } = route.params;
  const plan = WORKOUT_PLANS.find(p => p.id === planId);
  const [selectedDay, setSelectedDay] = useState(1);

  if (!plan) return null;

  const currentDayPlan = plan.schedule.find(d => d.day === selectedDay) || plan.schedule[0];

  const handleNextDay = () => {
    const nextDay = selectedDay + 1;
    // Assuming consecutive days for simplicity or checking existence
    if (plan.schedule.some(d => d.day === nextDay)) {
      setSelectedDay(nextDay);
    }
  };

  const handlePrevDay = () => {
    const prevDay = selectedDay - 1;
    if (plan.schedule.some(d => d.day === prevDay)) {
      setSelectedDay(prevDay);
    }
  };

  return (
    <ScreenWithStatusBarAndSafeArea>
      <View style={styles.container}>
        <ImageBackground
          source={plan.image || { uri: 'https://via.placeholder.com/400' }}
          style={styles.headerImage}
        >
          <View style={styles.headerOverlay} />
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={Theme.colors.white} />
            </TouchableOpacity>
            <View style={styles.headerTitles}>
              <Text style={styles.planTitle}>Dumbbells</Text>
              <Text style={styles.subTitle}>{plan.title}</Text>
            </View>
            <TouchableOpacity style={styles.editButton}>
              <Ionicons name="pencil" size={20} color={Theme.colors.white} />
            </TouchableOpacity>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Ionicons name="flame" size={16} color={Theme.colors.white} />
              <Text style={styles.statText}>{currentDayPlan?.stats?.calories || plan.stats?.calories || 0} Cal</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="barbell" size={16} color={Theme.colors.white} />
              <Text style={styles.statText}>{(currentDayPlan?.stats?.weight || plan.stats?.weight || 0).toLocaleString()} kg</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="time" size={16} color={Theme.colors.white} />
              <Text style={styles.statText}>{currentDayPlan?.stats?.minutes || plan.stats?.minutes || 0} minutes</Text>
            </View>
          </View>
        </ImageBackground>

        <View style={styles.content}>
          <View style={styles.daySelector}>
            <TouchableOpacity onPress={() => navigation.navigate('WorkoutTracking', { planId: plan.id, day: currentDayPlan.day })}>
              <Text style={styles.startWorkoutText}>START WORKOUT</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.dayControl}>
            <TouchableOpacity onPress={handlePrevDay}>
              <Ionicons name="chevron-back" size={24} color={Theme.colors.white} />
            </TouchableOpacity>
            <Text style={styles.dayTitle}>Day {currentDayPlan?.day} {currentDayPlan?.title ? `- ${currentDayPlan.title}` : ''}</Text>
            <TouchableOpacity onPress={handleNextDay}>
              <Ionicons name="chevron-forward" size={24} color={Theme.colors.white} />
            </TouchableOpacity>
          </View>

          <FlatList
            data={currentDayPlan?.exercises || []}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.exerciseRow}>
                <View style={styles.exerciseImagePlaceholder}>
                  {/* Using functionality-less placeholder image logic for now */}
                  <Ionicons name="accessibility" size={40} color={Theme.colors.gray[500]} />
                </View>
                <View style={styles.exerciseInfo}>
                  <Text style={styles.exerciseName}>{item.name}</Text>
                  <Text style={styles.exerciseSets}>{item.sets}</Text>
                </View>
                <Text style={styles.exerciseWeight}>{item.weight}</Text>
              </View>
            )}
            contentContainerStyle={styles.listContent}
          />
        </View>
      </View>
    </ScreenWithStatusBarAndSafeArea>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.black,
  },
  headerImage: {
    height: 200,
    width: '100%',
    justifyContent: 'space-between',
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 20,
    paddingHorizontal: Theme.spacing.m,
  },
  backButton: {
    padding: 8,
  },
  editButton: {
    padding: 8,
  },
  headerTitles: {
    alignItems: 'center',
  },
  planTitle: {
    color: Theme.colors.white,
    fontSize: 24,
    fontWeight: 'bold',
  },
  subTitle: {
    color: Theme.colors.gray[300],
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: Theme.spacing.m,
    paddingHorizontal: Theme.spacing.m,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    color: Theme.colors.white,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    backgroundColor: Theme.colors.black,
  },
  daySelector: {
    backgroundColor: Theme.colors.white,
    paddingVertical: Theme.spacing.m,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startWorkoutText: {
    color: Theme.colors.black,
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  dayControl: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Theme.spacing.m,
    gap: Theme.spacing.l,
  },
  dayTitle: {
    color: Theme.colors.white,
    fontSize: 18,
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: Theme.spacing.m,
  },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.l,
  },
  exerciseImagePlaceholder: {
    width: 40,
    height: 60,
    marginRight: Theme.spacing.m,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    color: Theme.colors.white,
    fontSize: 16,
    marginBottom: 4,
  },
  exerciseSets: {
    color: Theme.colors.gray[500],
    fontSize: 14,
  },
  exerciseWeight: {
    color: Theme.colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
