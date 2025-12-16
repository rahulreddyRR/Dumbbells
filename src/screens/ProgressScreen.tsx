import React, { useState, useCallback } from 'react';
import { Text, StyleSheet, ScrollView } from 'react-native';
import { ScreenContainer } from '../components/common/Screen';
import { Theme } from '../theme';
import { useProgressStats } from '../hooks/useProgressStats';
import { StreakCard } from '../components/progress/StreakCard';
import { ActivityChart } from '../components/progress/ActivityChart';
import { LifetimeStatsCard } from '../components/progress/LifetimeStatsCard';
import { AchievementsSection } from '../components/progress/AchievementsSection';
import { CalendarSection } from '../components/progress/CalendarSection';
import { DailySummary } from '../components/progress/DailySummary';
import { HistoryList } from '../components/progress/HistoryList';

export const ProgressScreen = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [chartPeriod, setChartPeriod] = useState<'week' | 'month'>('week');

  const {
    lifetimeStats,
    streaks,
    achievements,
    dailyData,
    chartData,
    markedDates
  } = useProgressStats(selectedDate, chartPeriod);

  const handleDateSelect = useCallback((date: Date) => {
    setSelectedDate(date);
  }, []);

  const handlePeriodChange = useCallback((period: 'week' | 'month') => {
    setChartPeriod(period);
  }, []);

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Your Progress</Text>

        <StreakCard
          currentStreak={streaks.current}
          bestStreak={streaks.best}
        />

        <ActivityChart
          data={chartData}
          period={chartPeriod}
          onPeriodChange={handlePeriodChange}
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
        />

        <LifetimeStatsCard
          totalWorkouts={lifetimeStats.totalWorkouts}
          totalWeight={lifetimeStats.totalWeight}
          totalCalories={lifetimeStats.totalCalories}
        />

        <AchievementsSection achievements={achievements} />

        <CalendarSection
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
          markedDates={markedDates}
        />

        <DailySummary
          date={selectedDate}
          stats={dailyData}
        />

        <HistoryList workouts={dailyData.workouts} />

      </ScrollView>
    </ScreenContainer>
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
});

