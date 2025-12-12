export interface WorkoutPlan {
  id: string;
  title: string;
  subtitle: string;
  frequency: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  image?: any;
}

export const WORKOUT_PLANS: WorkoutPlan[] = [
  {
    id: '1',
    title: 'Beginner',
    subtitle: 'Start your journey',
    frequency: 'Daily',
    difficulty: 'Beginner',
    image: require('../assets/plans/beginner.png'),
  },
  {
    id: '2',
    title: 'Weight Loss',
    subtitle: 'High intensity cardio',
    frequency: 'Daily',
    difficulty: 'Intermediate',
    image: require('../assets/plans/weight_loss.png'),
  },
  {
    id: '3',
    title: 'Full Body',
    subtitle: 'Compound movements',
    frequency: '3 days/week',
    difficulty: 'Intermediate',
    image: require('../assets/plans/full_body.png'),
  },
  {
    id: '4',
    title: 'Total Split',
    subtitle: 'Focused muscle isolation',
    frequency: '5 days/week',
    difficulty: 'Advanced',
    // Fallback or placeholder since generation limit reached
    image: null, 
  },
  {
    id: '5',
    title: 'Get Shredded',
    subtitle: 'Maximum definition',
    frequency: '6 days/week',
    difficulty: 'Advanced',
    // Fallback or placeholder since generation limit reached
    image: null,
  },
];
