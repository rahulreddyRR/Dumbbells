import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { Screen } from '../components/common/Screen';
import { Theme } from '../theme';
import { useWorkoutStore, CompletedWorkout } from '../store/workoutStore';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Calendar, DateData } from 'react-native-calendars';

const { width } = Dimensions.get('window');

const CHART_HEIGHT = 150;
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export const ProgressScreen = () => {
  const completedWorkouts = useWorkoutStore((state) => state.completedWorkouts);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [chartPeriod, setChartPeriod] = useState<'week' | 'month'>('week');

  // Lifetime Stats
  const lifetimeStats = useMemo(() => {
    const totalWorkouts = completedWorkouts.length;
    const totalCalories = completedWorkouts.reduce((acc, w) => acc + w.caloriesBurned, 0);
    const totalMinutes = completedWorkouts.reduce((acc, w) => acc + w.durationMinutes, 0);
    const totalWeight = completedWorkouts.reduce((acc, w) => acc + (w.weightLifted || 0), 0);

    return { totalWorkouts, totalCalories, totalMinutes, totalWeight };
  }, [completedWorkouts]);

  // Streak Calculation
  const streaks = useMemo(() => {
    const uniqueDates = Array.from(new Set(
      completedWorkouts.map(w => w.date.split('T')[0])
    )).sort((a, b) => new Date(b).getTime() - new Date(a).getTime()); // Descending

    if (uniqueDates.length === 0) return { current: 0, best: 0 };

    // Check if today or yesterday has a workout for current streak
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    let current = 0;
    const lastWorkout = uniqueDates[0];
    let streakActive = (lastWorkout === today || lastWorkout === yesterday);

    if (streakActive) {
      current = 1;
      let checkDate = new Date(uniqueDates[0]);

      for (let i = 1; i < uniqueDates.length; i++) {
        const prevDate = new Date(checkDate);
        prevDate.setDate(prevDate.getDate() - 1);
        const expectedStr = prevDate.toISOString().split('T')[0];

        if (uniqueDates[i] === expectedStr) {
          current++;
          checkDate = prevDate;
        } else {
          break;
        }
      }
    }

    // Best Streak (iterate all dates)
    let best = 0;
    let tempCurrent = 0;
    // We need ascending for easier single-pass max calc
    const sortedAsc = [...uniqueDates].sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    if (sortedAsc.length > 0) {
      tempCurrent = 1;
      best = 1;
      for (let i = 1; i < sortedAsc.length; i++) {
        const curr = new Date(sortedAsc[i]);
        const prev = new Date(sortedAsc[i - 1]);
        const diffTime = Math.abs(curr.getTime() - prev.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          tempCurrent++;
        } else {
          tempCurrent = 1;
        }
        if (tempCurrent > best) best = tempCurrent;
      }
    }

    return { current, best };
  }, [completedWorkouts]);

  // Achievements Calculation
  const achievements: Achievement[] = useMemo(() => {
    const { totalWorkouts, totalWeight, totalCalories } = lifetimeStats;
    const { best: bestStreak } = streaks;

    const list = [
      { id: 'start', title: 'Getting Started', description: 'Complete your first workout', icon: 'footsteps', threshold: 1, val: totalWorkouts },
      { id: 'w10', title: 'Decathlete', description: 'Complete 10 workouts', icon: 'medal', threshold: 10, val: totalWorkouts },
      { id: 'w50', title: 'Consistent', description: 'Complete 50 workouts', icon: 'calendar', threshold: 50, val: totalWorkouts },
      { id: 'k100', title: 'Warm Up', description: 'Lift 100kg total volume', icon: 'barbell', threshold: 100, val: totalWeight },
      { id: 'k1000', title: 'Heavy Lifter', description: 'Lift 1,000kg total volume', icon: 'trophy', threshold: 1000, val: totalWeight },
      { id: 's3', title: 'On Fire', description: '3 Day Streak', icon: 'flame', threshold: 3, val: bestStreak },
      { id: 's7', title: 'Unstoppable', description: '7 Day Streak', icon: 'flash', threshold: 7, val: bestStreak },
    ];

    return list.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      icon: item.icon,
      unlocked: item.val >= item.threshold,
    }));
  }, [lifetimeStats, streaks]);


  // Daily Stats (Filtered by selected date)
  const dailyData = useMemo(() => {
    const dateStr = selectedDate.toISOString().split('T')[0];
    const filtered = completedWorkouts.filter(w => w.date.startsWith(dateStr));

    return {
      workouts: filtered,
      calories: filtered.reduce((acc, w) => acc + w.caloriesBurned, 0),
      duration: filtered.reduce((acc, w) => acc + w.durationMinutes, 0),
      weight: filtered.reduce((acc, w) => acc + (w.weightLifted || 0), 0)
    };
  }, [completedWorkouts, selectedDate]);

  // Chart Data Calculation
  const chartData = useMemo(() => {
    const today = new Date();
    const daysToShow = chartPeriod === 'week' ? 7 : 30; // 7 days or 30 days
    const dateList = [];

    // Generate last N days
    for (let i = daysToShow - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      dateList.push(d);
    }

    // Aggregate
    let realMax = 0;

    const bars = dateList.map(day => {
      const dateStr = day.toISOString().split('T')[0];
      const dayWorkouts = completedWorkouts.filter(w => w.date.startsWith(dateStr));
      const duration = dayWorkouts.reduce((acc, w) => acc + w.durationMinutes, 0);
      if (duration > realMax) realMax = duration;

      let label = '';
      if (chartPeriod === 'week') {
        label = DAYS[day.getDay()];
      } else {
        // For monthly view, show label every 5 days
        const dayNum = day.getDate();
        if (dayNum === 1 || dayNum % 5 === 0) {
          label = `${dayNum}`;
        }
      }

      return {
        label,
        value: duration,
        fullDate: dateStr,
        dateObj: day
      };
    });

    return { bars, max: Math.max(realMax, 10) }; // Minimum scale of 10 mins
  }, [completedWorkouts, chartPeriod]);

  // Calendar Marked Dates
  const markedDates = useMemo(() => {
    const marks: any = {};
    const selectedStr = selectedDate.toISOString().split('T')[0];

    // Mark days with workouts
    completedWorkouts.forEach(w => {
      const dateStr = w.date.split('T')[0];
      if (!marks[dateStr]) {
        marks[dateStr] = { marked: true, dotColor: Theme.colors.primary };
      }
    });

    // Mark selected day
    if (marks[selectedStr]) {
      marks[selectedStr] = { ...marks[selectedStr], selected: true, selectedColor: Theme.colors.primary, selectedTextColor: 'black' };
    } else {
      marks[selectedStr] = { selected: true, selectedColor: Theme.colors.primary, selectedTextColor: 'black' };
    }

    return marks;
  }, [completedWorkouts, selectedDate]);


  const renderHistoryItem = ({ item }: { item: CompletedWorkout }) => (
    <View style={styles.historyItem}>
      <View style={styles.historyIcon}>
        <Ionicons name="barbell-outline" size={20} color={Theme.colors.primary} />
      </View>
      <View style={styles.historyContent}>
        <Text style={styles.historyName}>{item.planName}</Text>
        <Text style={styles.historyDate}>
          {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
      <View style={styles.historyStats}>
        <Text style={styles.historyStatMain}>{item.durationMinutes} min</Text>
        <Text style={styles.historyStatSub}>{item.caloriesBurned} kcal</Text>
      </View>
    </View>
  );

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Your Progress</Text>

        {/* Streaks Header */}
        <View style={styles.streakContainer}>
          <View style={styles.streakCard}>
            <Ionicons name="flame" size={24} color={Theme.colors.primary} />
            <View>
              <Text style={styles.streakValue}>{streaks.current}</Text>
              <Text style={styles.streakLabel}>Current Streak</Text>
            </View>
          </View>
          <View style={styles.streakCard}>
            <Ionicons name="trophy-outline" size={24} color="#FFD700" />
            <View>
              <Text style={styles.streakValue}>{streaks.best}</Text>
              <Text style={styles.streakLabel}>Best Streak</Text>
            </View>
          </View>
        </View>

        {/* Activity Chart */}
        <View style={styles.chartCard}>
          <View style={styles.chartHeaderRow}>
            <Text style={styles.sectionHeader}>Activity (Minutes)</Text>
            <View style={styles.segmentControl}>
              <TouchableOpacity
                style={[styles.segmentBtn, chartPeriod === 'week' && styles.segmentBtnActive]}
                onPress={() => setChartPeriod('week')}
              >
                <Text style={[styles.segmentText, chartPeriod === 'week' && styles.segmentTextActive]}>Week</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.segmentBtn, chartPeriod === 'month' && styles.segmentBtnActive]}
                onPress={() => setChartPeriod('month')}
              >
                <Text style={[styles.segmentText, chartPeriod === 'month' && styles.segmentTextActive]}>Month</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.chartContainer}>
            {chartData.bars.map((bar, index) => {
              const isBarSelected = bar.fullDate === selectedDate.toISOString().split('T')[0];
              // In monthly view, bars are thinner
              const barWidth = chartPeriod === 'week' ? 12 : 6;
              const barMargin = chartPeriod === 'week' ? 0 : 2; // Add little spacing for monthly density if needed, or rely on flex

              return (
                <TouchableOpacity
                  key={index}
                  style={[styles.barColumn, { marginHorizontal: barMargin }]}
                  onPress={() => setSelectedDate(bar.dateObj)}
                >
                  <View style={[styles.barTrack, { width: barWidth }]}>
                    <View
                      style={[
                        styles.barFill,
                        {
                          height: `${Math.min((bar.value / chartData.max) * 100, 100)}%`,
                          backgroundColor: isBarSelected ? Theme.colors.primary : Theme.colors.primary + '80'
                        }
                      ]}
                    />
                  </View>
                  <Text style={[styles.barLabel, isBarSelected && { color: Theme.colors.white }]}>{bar.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Lifetime Stats Small */}
        <View style={styles.miniStatsRow}>
          <View style={styles.miniStat}>
            <Text style={styles.miniStatValue}>{lifetimeStats.totalWorkouts}</Text>
            <Text style={styles.miniStatLabel}>Workouts</Text>
          </View>
          <View style={[styles.miniStat, styles.miniStatBorder]}>
            <Text style={styles.miniStatValue}>{Math.round(lifetimeStats.totalWeight)}kg</Text>
            <Text style={styles.miniStatLabel}>Lifted</Text>
          </View>
          <View style={styles.miniStat}>
            <Text style={styles.miniStatValue}>{lifetimeStats.totalCalories}</Text>
            <Text style={styles.miniStatLabel}>Kcal</Text>
          </View>
        </View>

        {/* Achievements Scroller */}
        <Text style={styles.sectionTitle}>Achievements</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.achievementsScroll}>
          {achievements.map((achievement) => (
            <View key={achievement.id} style={[styles.achievementCard, !achievement.unlocked && styles.achievementLocked]}>
              <View style={[styles.achievementIcon, achievement.unlocked ? styles.achievementIconUnlocked : styles.achievementIconLocked]}>
                <Ionicons name={achievement.icon} size={20} color={achievement.unlocked ? Theme.colors.background : Theme.colors.gray[500]} />
              </View>
              <View>
                <Text style={styles.achievementTitle}>{achievement.title}</Text>
                <Text style={styles.achievementDesc}>{achievement.description}</Text>
              </View>
              {!achievement.unlocked && (
                <View style={styles.lockOverlay}>
                  <Ionicons name="lock-closed" size={16} color={Theme.colors.gray[500]} />
                </View>
              )}
            </View>
          ))}
        </ScrollView>

        {/* Calendar View */}
        <View style={styles.calendarContainer}>
          <Calendar
            current={selectedDate.toISOString().split('T')[0]}
            onDayPress={(day: DateData) => {
              setSelectedDate(new Date(day.timestamp));
            }}
            markedDates={markedDates}
            theme={{
              backgroundColor: Theme.colors.surface,
              calendarBackground: Theme.colors.surface,
              textSectionTitleColor: Theme.colors.gray[500],
              selectedDayBackgroundColor: Theme.colors.primary,
              selectedDayTextColor: Theme.colors.surface,
              todayTextColor: Theme.colors.primary,
              dayTextColor: Theme.colors.white,
              textDisabledColor: Theme.colors.gray[700],
              dotColor: Theme.colors.primary,
              selectedDotColor: Theme.colors.surface,
              arrowColor: Theme.colors.primary,
              monthTextColor: Theme.colors.white,
              indicatorColor: Theme.colors.primary,
              textDayFontWeight: '300',
              textMonthFontWeight: 'bold',
              textDayHeaderFontWeight: '300',
              textDayFontSize: 16,
              textMonthFontSize: 16,
              textDayHeaderFontSize: 14
            }}
            style={{ borderRadius: Theme.borderRadius.m }}
          />
        </View>

        {/* Daily Summary */}
        <Text style={styles.historyTitle}>
          Activity for {selectedDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
        </Text>
        <View style={styles.dailySummaryCard}>
          <View style={styles.dailyStatsRow}>
            <View style={styles.dailyStat}>
              <Ionicons name="time-outline" size={18} color={Theme.colors.primary} />
              <Text style={styles.dailyStatText}>{dailyData.duration} min</Text>
            </View>
            <View style={styles.dailyStat}>
              <Ionicons name="flame-outline" size={18} color={Theme.colors.primary} />
              <Text style={styles.dailyStatText}>{dailyData.calories} kcal</Text>
            </View>
            <View style={styles.dailyStat}>
              <Ionicons name="barbell-outline" size={18} color={Theme.colors.primary} />
              <Text style={styles.dailyStatText}>{dailyData.workouts.length} workouts</Text>
            </View>
          </View>
        </View>

        {/* History List Filtered */}
        {dailyData.workouts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No activity on this day.</Text>
          </View>
        ) : (
          <View>
            {[...dailyData.workouts].reverse().map((item) => (
              <View key={item.id}>
                {renderHistoryItem({ item })}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Theme.spacing.m,
    paddingBottom: 80,
  },
  title: {
    ...Theme.textVariants.header,
    marginBottom: Theme.spacing.l,
    color: Theme.colors.white,
  },
  sectionTitle: {
    ...Theme.textVariants.subheader,
    color: Theme.colors.white,
    marginBottom: Theme.spacing.m,
    marginTop: Theme.spacing.s,
  },
  sectionHeader: {
    ...Theme.textVariants.subheader,
    fontSize: 14,
    color: Theme.colors.gray[300],
  },

  // Streak Styles
  streakContainer: {
    flexDirection: 'row',
    gap: Theme.spacing.m,
    marginBottom: Theme.spacing.l,
  },
  streakCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.surface,
    padding: Theme.spacing.m,
    borderRadius: Theme.borderRadius.m,
    gap: 12,
  },
  streakValue: {
    color: Theme.colors.white,
    fontWeight: 'bold',
    fontSize: 20,
  },
  streakLabel: {
    color: Theme.colors.gray[400],
    fontSize: 12,
  },

  // Chart Styles
  chartCard: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.l,
    padding: Theme.spacing.m,
    marginBottom: Theme.spacing.l,
  },
  chartHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.m,
  },
  segmentControl: {
    flexDirection: 'row',
    backgroundColor: Theme.colors.background,
    borderRadius: 8,
    padding: 2,
  },
  segmentBtn: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  segmentBtnActive: {
    backgroundColor: Theme.colors.gray[700],
  },
  segmentText: {
    color: Theme.colors.gray[500],
    fontSize: 12,
    fontWeight: '600',
  },
  segmentTextActive: {
    color: Theme.colors.white,
  },

  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: CHART_HEIGHT,
    alignItems: 'flex-end',
    paddingTop: 10,
  },
  barColumn: {
    alignItems: 'center',
    flex: 1,
  },
  barTrack: {
    height: '85%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 6,
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  barFill: {
    width: '100%',
    backgroundColor: Theme.colors.primary,
    borderRadius: 6,
    minHeight: 4,
  },
  barLabel: {
    color: Theme.colors.gray[400],
    fontSize: 10,
  },

  // Stats Grid
  miniStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: Theme.spacing.l,
    paddingVertical: Theme.spacing.m,
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.m,
  },
  miniStat: {
    alignItems: 'center',
    flex: 1,
  },
  miniStatBorder: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: Theme.colors.border
  },
  miniStatValue: {
    color: Theme.colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  miniStatLabel: {
    color: Theme.colors.gray[500],
    fontSize: 10,
    marginTop: 2,
  },

  // Achievements
  achievementsScroll: {
    marginBottom: Theme.spacing.xl,
  },
  achievementCard: {
    backgroundColor: Theme.colors.surface,
    padding: 12,
    borderRadius: Theme.borderRadius.m,
    marginRight: 10,
    width: 200,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  achievementLocked: {
    opacity: 0.6,
    borderColor: Theme.colors.border,
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  achievementIconUnlocked: {
    backgroundColor: Theme.colors.primary,
  },
  achievementIconLocked: {
    backgroundColor: Theme.colors.gray[800],
  },
  achievementTitle: {
    color: Theme.colors.white,
    fontWeight: 'bold',
    fontSize: 14,
  },
  achievementDesc: {
    color: Theme.colors.gray[400],
    fontSize: 10,
    maxWidth: 130,
  },
  lockOverlay: {
    position: 'absolute',
    top: 5,
    right: 5,
  },

  // Calendar & History
  calendarContainer: {
    marginBottom: Theme.spacing.l,
    borderRadius: Theme.borderRadius.m,
    overflow: 'hidden',
  },
  dailySummaryCard: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.m,
    padding: Theme.spacing.m,
    marginBottom: Theme.spacing.l,
    borderLeftWidth: 4,
    borderLeftColor: Theme.colors.primary,
  },
  dailyStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dailyStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dailyStatText: {
    color: Theme.colors.gray[300],
    fontSize: 14,
  },
  historyTitle: {
    ...Theme.textVariants.subheader,
    color: Theme.colors.white,
    marginBottom: Theme.spacing.m,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: Theme.spacing.xl,
    opacity: 0.5,
  },
  emptyText: {
    color: Theme.colors.gray[500],
    textAlign: 'center',
    marginTop: Theme.spacing.m,
    fontSize: 16,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.surface,
    padding: Theme.spacing.m,
    borderRadius: Theme.borderRadius.m,
    marginBottom: Theme.spacing.s,
  },
  historyIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(212, 255, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.spacing.m,
  },
  historyContent: {
    flex: 1,
  },
  historyName: {
    color: Theme.colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  historyDate: {
    color: Theme.colors.gray[500],
    fontSize: 12,
  },
  historyStats: {
    alignItems: 'flex-end',
  },
  historyStatMain: {
    color: Theme.colors.primary,
    fontWeight: 'bold',
    fontSize: 14,
  },
  historyStatSub: {
    color: Theme.colors.gray[500],
    fontSize: 11,
    marginTop: 2,
  }
});
