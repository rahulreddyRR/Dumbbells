import { useMemo } from 'react';
import { useWorkoutStore } from '../store/workoutStore';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export const useProgressStats = (selectedDate: Date, chartPeriod: 'week' | 'month') => {
  const completedWorkouts = useWorkoutStore((state) => state.completedWorkouts);

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
    const { totalWorkouts, totalWeight } = lifetimeStats;
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
    const daysToShow = chartPeriod === 'week' ? 7 : 30;
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
    const hoverDateStr = selectedDate.toISOString().split('T')[0];

    // Mark days with workouts
    completedWorkouts.forEach(w => {
      const dateStr = w.date.split('T')[0];
      // Reuse theme colors would be better if passed or imported, but for logic we keep structure
      // We'll trust the consumer to style, but here we construct the object structure
      // Actually, since styles are in component, we might just return the raw data or minimal structure
      // detailed styling is usually done in component, but react-native-calendars needs it in props.
      // We will perform minimal marking here and let component add colors if possible, 
      // or we just import Theme here if strictly necessary. 
      // Ideally hooks shouldn't depend on Theme if it's UI, but it's cleaner to return the object ready.
      // Let's import Theme to keep it consistent with original code behavior.
      marks[dateStr] = { marked: true };
    });

    return marks;
  }, [completedWorkouts, selectedDate]);

  return {
    lifetimeStats,
    streaks,
    achievements,
    dailyData,
    chartData,
    markedDates
  };
};
