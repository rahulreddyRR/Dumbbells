export interface PlanExercise {
  id: string;
  name: string;
  sets: string; // e.g. "12 + 12 + 12"
  weight: string; // e.g. "8 kg"
  image?: any; // Placeholder for exercise image
}

export interface DayPlan {
  day: number;
  title: string;
  stats?: {
    calories: number;
    weight: number;
    minutes: number;
  };
  exercises: PlanExercise[];
}

export interface WorkoutPlan {
  id: string;
  title: string;
  subtitle: string;
  frequency: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  image?: any;
  stats: {
    calories: number;
    weight: number;
    minutes: number;
  };
  schedule: DayPlan[];
}

export const WORKOUT_PLANS: WorkoutPlan[] = [
  {
    id: '1',
    title: 'Beginner',
    subtitle: 'Start your journey',
    frequency: 'Daily',
    difficulty: 'Beginner',
    image: require('../assets/plans/beginner.png'),
    stats: {
      calories: 72,
      weight: 876,
      minutes: 15,
    },
    schedule: [
      {
        day: 1,
        title: 'Full Body',
        exercises: [
          { id: '1', name: 'French Press', sets: '12', weight: '6 kg' },
          { id: '2', name: 'Overhead Press', sets: '12', weight: '6 kg' },
          { id: '3', name: 'Lateral Raise', sets: '12', weight: '6 kg' },
          { id: '4', name: 'Alternate Bicep Curl', sets: '12', weight: '6 kg' },
          { id: '5', name: 'Squats', sets: '10', weight: '6 kg' },
          { id: '6', name: 'Calf Raise', sets: '15', weight: '6 kg' },
        ],
      },
    ],
  },
  {
    id: '2',
    title: 'Weight Loss',
    subtitle: 'High intensity cardio',
    frequency: 'Daily',
    difficulty: 'Intermediate',
    image: require('../assets/plans/weight_loss.png'),
    stats: {
        calories: 264,
        weight: 2760,
        minutes: 20
    },
    schedule: [
        {
            day: 1,
            title: 'Cardio Blast',
            exercises: [
                { id: '1', name: 'Lunges', sets: '12 + 12', weight: '5 kg' },
                { id: '2', name: 'Squats', sets: '10 + 10', weight: '5 kg' },
                { id: '3', name: 'Reverse Fly', sets: '15 + 15', weight: '5 kg' },
                { id: '4', name: 'Bench Fly', sets: '15 + 15', weight: '5 kg' },
                { id: '5', name: 'Bench Press', sets: '15 + 15', weight: '5 kg' },
                { id: '6', name: 'Lateral Raise', sets: '12 + 12', weight: '5 kg' },
                { id: '7', name: 'Overhead Press', sets: '15 + 15', weight: '5 kg' },
                { id: '8', name: 'Bicep Curl', sets: '12 + 12', weight: '5 kg' },
                { id: '9', name: 'French Press', sets: '12 + 12', weight: '5 kg' },
                { id: '10', name: 'Calf Raise', sets: '20 + 20', weight: '5 kg' },
            ]
        }
    ]
  },
  {
    id: '3',
    title: 'Full Body',
    subtitle: 'Compound movements',
    frequency: '3 days/week',
    difficulty: 'Intermediate',
    image: require('../assets/plans/full_body.png'),
    stats: {
        calories: 277,
        weight: 3696,
        minutes: 50
    },
    schedule: [
        {
            day: 1,
            title: 'Day 1',
            exercises: [
                { id: '1', name: 'Bench Press', sets: '12 + 12 + 12', weight: '8 kg' },
                { id: '2', name: 'Lying French Press', sets: '12 + 12 + 12', weight: '8 kg' },
                { id: '3', name: 'Squats', sets: '10 + 10 + 10', weight: '8 kg' },
                { id: '4', name: 'Triceps Kickback', sets: '12 + 12 + 12 + 12', weight: '8 kg' },
                { id: '5', name: 'Alternate Bicep Curl', sets: '12 + 12 + 12', weight: '8 kg' },
                { id: '6', name: 'One Arm Triceps Extension', sets: '12 + 12 + 12 + 12', weight: '8 kg' },
                { id: '7', name: 'Calf Raise', sets: '15 + 15 + 15', weight: '8 kg' },
            ]
        },
        {
            day: 2,
            title: 'Day 2',
            exercises: []
        },
        {
            day: 3,
            title: 'Day 3',
            exercises: [
                { id: '1', name: 'Bench Press', sets: '12 + 12 + 12', weight: '8 kg' },
                { id: '2', name: 'Lying French Press', sets: '12 + 12 + 12', weight: '8 kg' },
                { id: '3', name: 'Squats', sets: '10 + 10 + 10', weight: '8 kg' },
                { id: '4', name: 'Triceps Kickback', sets: '12 + 12 + 12 + 12', weight: '8 kg' },
                { id: '5', name: 'Alternate Bicep Curl', sets: '12 + 12 + 12', weight: '8 kg' },
                { id: '6', name: 'One Arm Triceps Extension', sets: '12 + 12 + 12 + 12', weight: '8 kg' },
                { id: '7', name: 'Calf Raise', sets: '15 + 15 + 15', weight: '8 kg' },
            ]
        }
    ]
  },
  {
    id: '4',
    title: 'Total Split',
    subtitle: 'Focused muscle isolation',
    frequency: '5 days/week',
    difficulty: 'Advanced',
    // Fallback or placeholder since generation limit reached
    image: null,
    stats: {
        calories: 186,
        weight: 3460,
        minutes: 30
    },
    schedule: [
        {
            day: 5,
            title: 'Leg Day',
            exercises: [
                { id: '1', name: 'Deadlift', sets: '12 + 10 + 10 + 8', weight: '10 kg' },
                { id: '2', name: 'Lunges', sets: '12 + 12 + 10 + 10', weight: '10 kg' },
                { id: '3', name: 'Squats', sets: '12 + 10 + 10 + 8', weight: '10 kg' },
                { id: '4', name: 'Calf Raise', sets: '15 + 12 + 12 + 10', weight: '10 kg' },
            ]
        }
    ] 
  },
  {
    id: '5',
    title: 'Get Shredded',
    subtitle: 'Maximum definition',
    frequency: '6 days/week',
    difficulty: 'Advanced',
    // Fallback or placeholder since generation limit reached
    image: null,
    stats: {
        calories: 507,
        weight: 7184,
        minutes: 40
    },
    schedule: [
        {
            day: 1,
            title: 'Push',
            stats: { calories: 404, weight: 5520, minutes: 35 },
            exercises: [
                { id: '1', name: 'Incline Bench Press', sets: '15 + 15 + 15 + 15', weight: '8 kg' },
                { id: '2', name: 'Bench Press', sets: '12 + 12 + 12', weight: '8 kg' },
                { id: '3', name: 'Incline Bench Fly', sets: '12 + 12 + 12', weight: '8 kg' },
                { id: '4', name: 'Bench Fly', sets: '12 + 12 + 12', weight: '8 kg' },
                { id: '5', name: 'Lying French Press', sets: '15 + 15 + 15 + 15', weight: '8 kg' },
                { id: '6', name: 'French Press', sets: '12 + 12 + 12', weight: '8 kg' },
                { id: '7', name: 'Hang Leg Raises', sets: '10 + 10 + 10 + 10', weight: '-' },
                { id: '8', name: 'Crunches', sets: '25 + 25 + 25 + 25', weight: '-' },
            ]
        },
        {
            day: 2,
            title: 'Pull',
            stats: { calories: 447, weight: 5472, minutes: 35 },
            exercises: [
                { id: '1', name: 'Pull-Ups', sets: '10 + 10 + 10 + 10', weight: '-' },
                { id: '2', name: 'Bent-Over', sets: '15 + 15 + 15 + 15', weight: '8 kg' },
                { id: '3', name: 'Wide Row', sets: '15 + 15 + 15 + 15', weight: '8 kg' },
                { id: '4', name: 'Bicep Curl', sets: '12 + 12 + 12 + 12', weight: '8 kg' },
                { id: '5', name: 'Hammer Curl', sets: '12 + 12 + 12 + 12', weight: '8 kg' },
                { id: '6', name: 'Lying Leg Raises', sets: '25 + 25 + 25 + 25', weight: '-' },
                { id: '7', name: 'Bicycle', sets: '25 + 25 + 25 + 25', weight: '-' },
            ]
        },
        {
            day: 3,
            title: 'Legs & Shoulders',
            stats: { calories: 507, weight: 7184, minutes: 40 },
            exercises: [
                { id: '1', name: 'Squats', sets: '15 + 15 + 15 + 15', weight: '8 kg' },
                { id: '2', name: 'Lunges', sets: '15 + 15 + 15 + 15', weight: '8 kg' },
                { id: '3', name: 'Deadlift', sets: '12 + 12 + 12 + 12', weight: '8 kg' },
                { id: '4', name: 'Calf Raise', sets: '20 + 20 + 20 + 20', weight: '8 kg' },
                { id: '5', name: 'Arnold Press', sets: '15 + 15 + 15 + 15', weight: '8 kg' },
                { id: '6', name: 'Lateral Raise', sets: '12 + 12 + 12 + 12', weight: '8 kg' },
                { id: '7', name: 'Front Raise', sets: '12 + 12 + 12 + 12', weight: '8 kg' },
                { id: '8', name: 'Crunches', sets: '25 + 25 + 25 + 25', weight: '-' },
            ]
        },
        {
            day: 4,
            title: 'Push',
            stats: { calories: 398, weight: 5040, minutes: 35 },
            exercises: [
                { id: '1', name: 'Decline Bench Press', sets: '15 + 15 + 15 + 15', weight: '8 kg' },
                { id: '2', name: 'Bench Press', sets: '12 + 12 + 12', weight: '8 kg' },
                { id: '3', name: 'Decline Bench Fly', sets: '12 + 12 + 12', weight: '8 kg' },
                { id: '4', name: 'Bench Fly', sets: '12 + 12 + 12', weight: '8 kg' },
                { id: '5', name: 'Triceps Kickback', sets: '15 + 15 + 15 + 15', weight: '8 kg' },
                { id: '6', name: 'French Press', sets: '12 + 12 + 12', weight: '8 kg' },
                { id: '7', name: 'Hang Leg Raises', sets: '10 + 10 + 10 + 10', weight: '-' },
                { id: '8', name: 'Crunches', sets: '25 + 25 + 25 + 25', weight: '-' },
            ]
        },
        {
            day: 5,
            title: 'Pull',
            stats: { calories: 491, weight: 5760, minutes: 40 },
            exercises: [
                { id: '1', name: 'Pull-Ups', sets: '10 + 10 + 10 + 10', weight: '-' },
                { id: '2', name: 'Bench Bent-Over', sets: '15 + 15 + 15 + 15', weight: '8 kg' },
                { id: '3', name: 'Reverse Fly', sets: '12 + 12 + 12 + 12', weight: '8 kg' },
                { id: '4', name: 'Shrugs', sets: '15 + 15 + 15 + 15', weight: '8 kg' },
                { id: '5', name: 'Alternate Bicep Curl', sets: '12 + 12 + 12 + 12', weight: '8 kg' },
                { id: '6', name: 'Alternate Hammer Curl', sets: '12 + 12 + 12 + 12', weight: '8 kg' },
                { id: '7', name: 'Lying Leg Raises', sets: '25 + 25 + 25 + 25', weight: '-' },
                { id: '8', name: 'Bicycle', sets: '25 + 25 + 25 + 25', weight: '-' },
            ]
        },
        {
            day: 6,
            title: 'Legs & Shoulders',
            stats: { calories: 507, weight: 7184, minutes: 40 },
            exercises: [
                { id: '1', name: 'Squats', sets: '15 + 15 + 15 + 15', weight: '8 kg' },
                { id: '2', name: 'Lunges', sets: '15 + 15 + 15 + 15', weight: '8 kg' },
                { id: '3', name: 'Deadlift', sets: '12 + 12 + 12 + 12', weight: '8 kg' },
                { id: '4', name: 'Calf Raise', sets: '20 + 20 + 20 + 20', weight: '8 kg' },
                { id: '5', name: 'Arnold Press', sets: '15 + 15 + 15 + 15', weight: '8 kg' },
                { id: '6', name: 'Lateral Raise', sets: '12 + 12 + 12 + 12', weight: '8 kg' },
                { id: '7', name: 'Front Raise', sets: '12 + 12 + 12 + 12', weight: '8 kg' },
                { id: '8', name: 'Crunches', sets: '25 + 25 + 25 + 25', weight: '-' },
            ]
        }
    ]
  },
];
