import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { WORKOUT_PLANS } from '../../data/workoutPlans';
import { Theme } from '../../theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Screen } from '../../components/common/Screen';

type Props = NativeStackScreenProps<RootStackParamList, 'WorkoutDetails'>;

export const WorkoutDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { planId } = route.params;
  const plan = WORKOUT_PLANS.find(p => p.id === planId);
  const [selectedDay, setSelectedDay] = useState(1);

  if (!plan) return null;

  const currentDayPlan = plan.schedule.find(d => d.day === selectedDay) || plan.schedule[0];

  const handleNextDay = () => {
    const nextDay = selectedDay + 1;
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
    <Screen>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Hero Header */}
        <ImageBackground
          source={plan.image || { uri: 'https://via.placeholder.com/400' }}
          style={styles.headerImage}
          imageStyle={styles.headerImageStyle}
        >
          <View style={styles.headerGradient} />

          {/* Top Bar */}
          <View style={styles.topBar}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
              <Ionicons name="arrow-back" size={24} color={Theme.colors.white} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="heart-outline" size={24} color={Theme.colors.white} />
            </TouchableOpacity>
          </View>

          {/* Header Content */}
          <View style={styles.headerBottom}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{plan.difficulty}</Text>
            </View>
            <Text style={styles.planTitle}>{plan.title}</Text>
            <Text style={styles.planSubtitle}>{plan.subtitle}</Text>
            <Text style={styles.frequency}>{plan.frequency}</Text>
          </View>
        </ImageBackground>

        {/* Stats Cards */}
        <View style={styles.statsSection}>
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Ionicons name="flame" size={24} color={Theme.colors.primary} />
            </View>
            <Text style={styles.statValue}>{currentDayPlan?.stats?.calories || plan.stats?.calories || 0}</Text>
            <Text style={styles.statLabel}>Calories</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Ionicons name="barbell" size={24} color={Theme.colors.primary} />
            </View>
            <Text style={styles.statValue}>{(currentDayPlan?.stats?.weight || plan.stats?.weight || 0).toLocaleString()}</Text>
            <Text style={styles.statLabel}>Kg Lifted</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Ionicons name="time" size={24} color={Theme.colors.primary} />
            </View>
            <Text style={styles.statValue}>{currentDayPlan?.stats?.minutes || plan.stats?.minutes || 0}</Text>
            <Text style={styles.statLabel}>Minutes</Text>
          </View>
        </View>

        {/* Day Navigation */}
        <View style={styles.dayNavigationContainer}>
          <TouchableOpacity
            onPress={handlePrevDay}
            style={[styles.navButton, selectedDay === 1 && styles.navButtonDisabled]}
            disabled={selectedDay === 1}
          >
            <Ionicons name="chevron-back" size={20} color={selectedDay === 1 ? Theme.colors.gray[700] : Theme.colors.white} />
          </TouchableOpacity>

          <View style={styles.dayInfo}>
            <Text style={styles.dayNumber}>Day {currentDayPlan?.day}</Text>
            {currentDayPlan?.title && <Text style={styles.dayName}>{currentDayPlan.title}</Text>}
          </View>

          <TouchableOpacity
            onPress={handleNextDay}
            style={[styles.navButton, selectedDay === plan.schedule.length && styles.navButtonDisabled]}
            disabled={selectedDay === plan.schedule.length}
          >
            <Ionicons name="chevron-forward" size={20} color={selectedDay === plan.schedule.length ? Theme.colors.gray[700] : Theme.colors.white} />
          </TouchableOpacity>
        </View>

        {/* Exercises Section */}
        <View style={styles.exercisesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Exercises</Text>
            <Text style={styles.exerciseCount}>{currentDayPlan?.exercises?.length || 0} exercises</Text>
          </View>

          {currentDayPlan?.exercises?.map((item, index) => (
            <View key={item.id} style={styles.exerciseCard}>
              <View style={styles.exerciseNumber}>
                <Text style={styles.exerciseNumberText}>{index + 1}</Text>
              </View>

              <View style={styles.exerciseContent}>
                <Text style={styles.exerciseName}>{item.name}</Text>
                <View style={styles.exerciseDetails}>
                  <View style={styles.detailItem}>
                    <Ionicons name="repeat" size={14} color={Theme.colors.gray[500]} />
                    <Text style={styles.detailText}>{item.sets} sets</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Ionicons name="barbell-outline" size={14} color={Theme.colors.gray[500]} />
                    <Text style={styles.detailText}>{item.weight}</Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity style={styles.exerciseAction}>
                <Ionicons name="information-circle-outline" size={20} color={Theme.colors.gray[500]} />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Bottom Padding */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Start Button */}
      <View style={styles.floatingButtonContainer}>
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => navigation.navigate('WorkoutTracking', { planId: plan.id, day: currentDayPlan.day })}
        >
          <Ionicons name="play" size={24} color={Theme.colors.background} />
          <Text style={styles.startButtonText}>START WORKOUT</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  headerImage: {
    height: 300,
    width: '100%',
  },
  headerImageStyle: {
    resizeMode: 'cover',
  },
  headerGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 20,
    paddingHorizontal: Theme.spacing.m,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBottom: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: Theme.spacing.m,
    paddingBottom: Theme.spacing.l,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: Theme.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: Theme.spacing.s,
  },
  badgeText: {
    color: Theme.colors.background,
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  planTitle: {
    color: Theme.colors.white,
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  planSubtitle: {
    color: Theme.colors.gray[300],
    fontSize: 16,
    marginBottom: 8,
  },
  frequency: {
    color: Theme.colors.gray[400],
    fontSize: 14,
  },
  statsSection: {
    flexDirection: 'row',
    paddingHorizontal: Theme.spacing.m,
    paddingTop: Theme.spacing.l,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.m,
    padding: Theme.spacing.m,
    alignItems: 'center',
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(212, 255, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    color: Theme.colors.white,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    color: Theme.colors.gray[500],
    fontSize: 12,
  },
  dayNavigationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Theme.spacing.l,
    paddingHorizontal: Theme.spacing.m,
    gap: Theme.spacing.l,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonDisabled: {
    opacity: 0.3,
  },
  dayInfo: {
    alignItems: 'center',
    minWidth: 120,
  },
  dayNumber: {
    color: Theme.colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  dayName: {
    color: Theme.colors.gray[400],
    fontSize: 14,
    marginTop: 2,
  },
  exercisesSection: {
    paddingHorizontal: Theme.spacing.m,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.m,
  },
  sectionTitle: {
    color: Theme.colors.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  exerciseCount: {
    color: Theme.colors.gray[500],
    fontSize: 14,
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
    marginBottom: 6,
  },
  exerciseDetails: {
    flexDirection: 'row',
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    color: Theme.colors.gray[500],
    fontSize: 13,
  },
  exerciseAction: {
    padding: 8,
  },
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Theme.spacing.m,
    paddingVertical: Theme.spacing.m,
    backgroundColor: Theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.surface,
  },
  startButton: {
    backgroundColor: Theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: Theme.borderRadius.l,
    gap: 8,
  },
  startButtonText: {
    color: Theme.colors.background,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
