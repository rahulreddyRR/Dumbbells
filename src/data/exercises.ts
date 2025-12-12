export interface Exercise {
  id: string;
  name: string;
  muscle: string;
  image?: any; // Will use require() or uri
}

export const EXERCISES: Exercise[] = [
  { id: '1', name: 'Bicep Curl', muscle: 'Biceps', image: require('../assets/workouts/bicep_curl.png') },
  { id: '2', name: 'Dumbbell Press', muscle: 'Chest', image: require('../assets/workouts/dumbbell_press.png') },
  { id: '3', name: 'Goblet Squat', muscle: 'Legs', image: require('../assets/workouts/goblet_squat.png') },
  { id: '4', name: 'Lateral Raise', muscle: 'Shoulders' },
  { id: '5', name: 'Tricep Kickback', muscle: 'Triceps' },
  { id: '6', name: 'Dumbbell Lunge', muscle: 'Legs' },
  { id: '7', name: 'Bent-Over Row', muscle: 'Back' },
  { id: '8', name: 'Shoulder Press', muscle: 'Shoulders' },
];

export const CATEGORIES = ['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Biceps', 'Triceps'];
