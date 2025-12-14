import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { Screen } from '../components/common/Screen';
import { Theme } from '../theme';
import { useWorkoutStore, CompletedWorkout } from '../store/workoutStore';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Calendar, DateData } from 'react-native-calendars';

const { width } = Dimensions.get('window');

const CHART_HEIGHT = 150;
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const ProgressScreen = () => {
  const completedWorkouts = useWorkoutStore((state) => state.completedWorkouts);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Lifetime Stats
  const lifetimeStats = useMemo(() => {
    const totalWorkouts = completedWorkouts.length;
    const totalCalories = completedWorkouts.reduce((acc, w) => acc + w.caloriesBurned, 0);
    const totalMinutes = completedWorkouts.reduce((acc, w) => acc + w.durationMinutes, 0);
    const totalWeight = completedWorkouts.reduce((acc, w) => acc + (w.weightLifted || 0), 0);

    return { totalWorkouts, totalCalories, totalMinutes, totalWeight };
  }, [completedWorkouts]);

  // Daily Stats (Filtered)
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

  // Chart Data Calculation (Last 7 Days)
  const chartData = useMemo(() => {
    const today = new Date();
    const data = [];
    const last7Days = [];

    // Generate last 7 days keys
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      last7Days.push(d);
    }

    // Aggregate
    const maxVal = 1; // Avoid divide by zero
    let realMax = 0;

    const bars = last7Days.map(day => {
      const dateStr = day.toISOString().split('T')[0];
      const dayWorkouts = completedWorkouts.filter(w => w.date.startsWith(dateStr));
      const duration = dayWorkouts.reduce((acc, w) => acc + w.durationMinutes, 0);
      if (duration > realMax) realMax = duration;
      return {
        label: DAYS[day.getDay()],
        value: duration,
        fullDate: dateStr,
        dateObj: day
      };
    });

    return { bars, max: Math.max(realMax, 10) }; // Minimum scale of 10 mins
  }, [completedWorkouts]);

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

        {/* Weekly Chart */}
        <View style={styles.chartCard}>
          <Text style={styles.sectionHeader}>Weekly Activity (Minutes)</Text>
          <View style={styles.chartContainer}>
            {chartData.bars.map((bar, index) => {
              const isBarSelected = bar.fullDate === selectedDate.toISOString().split('T')[0];
              return (
                <TouchableOpacity
                  key={index}
                  style={styles.barColumn}
                  onPress={() => setSelectedDate(bar.dateObj)}
                >
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.barFill,
                        {
                          height: `${(bar.value / chartData.max) * 100}%`,
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
            <Text style={styles.miniStatLabel}>Total Workouts</Text>
          </View>
          <View style={[styles.miniStat, { borderLeftWidth: 1, borderRightWidth: 1, borderColor: Theme.colors.border }]}>
            <Text style={styles.miniStatValue}>{Math.round(lifetimeStats.totalWeight)}kg</Text>
            <Text style={styles.miniStatLabel}>Total Lifted</Text>
          </View>
          <View style={styles.miniStat}>
            <Text style={styles.miniStatValue}>{lifetimeStats.totalCalories}</Text>
            <Text style={styles.miniStatLabel}>Total Kcal</Text>
          </View>
        </View>

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
              selectedDayTextColor: Theme.colors.surface, // Black text on neon green
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
            style={{
              borderRadius: Theme.borderRadius.m,
            }}
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
    paddingBottom: 40,
  },
  title: {
    ...Theme.textVariants.header,
    marginBottom: Theme.spacing.l,
    color: Theme.colors.white,
  },
  sectionHeader: {
    ...Theme.textVariants.subheader,
    fontSize: 14,
    color: Theme.colors.gray[300],
    marginBottom: Theme.spacing.m,
  },
  chartCard: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.l,
    padding: Theme.spacing.m,
    marginBottom: Theme.spacing.l,
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
    width: 12, // Slender bars
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
    minHeight: 4, // Ensure visibility even for small values
  },
  barLabel: {
    color: Theme.colors.gray[400],
    fontSize: 10,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Theme.spacing.l,
  },
  miniStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: Theme.spacing.xl,
    paddingVertical: Theme.spacing.m,
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.m,
  },
  miniStat: {
    alignItems: 'center',
    flex: 1,
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
  // Existing styles...
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
