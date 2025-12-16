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
  restBetweenSets?: number; // Configurable rest in seconds
  restBetweenExercises?: number; // Configurable rest in seconds
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
    title: 'Foundation Start',
    subtitle: 'Start your journey',
    frequency: 'Daily',
    difficulty: 'Beginner',
    image: require('../assets/workouts/foundation_start_cover.png'),
    restBetweenSets: 60,
    restBetweenExercises: 90,
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
          { id: '1', name: 'French Press', sets: '12', weight: '6 kg', image: require('../assets/workouts/french_press.webp') },
          { id: '2', name: 'Overhead Press', sets: '12', weight: '6 kg', image: require('../assets/workouts/overhead_press.webp') },
          { id: '3', name: 'Lateral Raise', sets: '12', weight: '6 kg', image: require('../assets/workouts/lateral_raise.webp') },
          { id: '4', name: 'Alternate Bicep Curl', sets: '12', weight: '6 kg', image: require('../assets/workouts/alt_bicep_curl.webp') },
          { id: '5', name: 'Squats', sets: '10', weight: '6 kg', image: require('../assets/workouts/squat.webp') },
          { id: '6', name: 'Calf Raise', sets: '15', weight: '6 kg', image: require('../assets/workouts/calf_raise.webp') },
        ],
      },
    ],
  },
  {
    id: '2',
    title: 'Fat Burner',
    subtitle: 'High intensity cardio',
    frequency: 'Daily',
    difficulty: 'Intermediate',
    image: require('../assets/workouts/fat_burner_cover.png'),
    restBetweenSets: 45,
    restBetweenExercises: 60,
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
                { id: '1', name: 'Lunges', sets: '12 + 12', weight: '5 kg', image: require('../assets/workouts/lunges.webp') },
                { id: '2', name: 'Squats', sets: '10 + 10', weight: '5 kg', image: require('../assets/workouts/squat.webp') },
                { id: '3', name: 'Reverse Fly', sets: '15 + 15', weight: '5 kg', image: require('../assets/workouts/reverse_fly.webp') },
                { id: '4', name: 'Bench Fly', sets: '15 + 15', weight: '5 kg', image: require('../assets/workouts/bench_flyes.webp') },
                { id: '5', name: 'Bench Press', sets: '15 + 15', weight: '5 kg', image: require('../assets/workouts/bench_press.webp') },
                { id: '6', name: 'Lateral Raise', sets: '12 + 12', weight: '5 kg', image: require('../assets/workouts/lateral_raise.webp') },
                { id: '7', name: 'Overhead Press', sets: '15 + 15', weight: '5 kg', image: require('../assets/workouts/overhead_press.webp') },
                { id: '8', name: 'Bicep Curl', sets: '12 + 12', weight: '5 kg', image: require('../assets/workouts/bicep_curl.webp') },
                { id: '9', name: 'French Press', sets: '12 + 12', weight: '5 kg', image: require('../assets/workouts/french_press.webp') },
                { id: '10', name: 'Calf Raise', sets: '20 + 20', weight: '5 kg', image: require('../assets/workouts/calf_raise.webp') },
            ]
        }
    ]
  },
  {
    id: '3',
    title: 'Total Strength',
    subtitle: 'Compound movements',
    frequency: '3 days/week',
    difficulty: 'Intermediate',
    image: require('../assets/workouts/total_strength_cover.png'),
    restBetweenSets: 60,
    restBetweenExercises: 120,
    stats: {
        calories: 277,
        weight: 3696,
        minutes: 50
    },
    schedule: [
        {
            day: 1,
            title: 'Day 1',
            stats: { calories: 265, weight: 4128, minutes: 45 },
            exercises: [
                { id: '1', name: 'Bench Press', sets: '12 + 12 + 12', weight: '8 kg', image: require('../assets/workouts/bench_press.webp') },
                { id: '2', name: 'Bench Fly', sets: '12 + 12 + 12', weight: '8 kg', image: require('../assets/workouts/bench_flyes.webp') },
                { id: '3', name: 'Lunges', sets: '12 + 12 + 12 + 12', weight: '8 kg', image: require('../assets/workouts/lunges.webp') },
                { id: '4', name: 'Bicep Curl', sets: '12 + 12 + 12', weight: '8 kg', image: require('../assets/workouts/bicep_curl.webp') },
                { id: '5', name: 'Hammer Curl', sets: '12 + 12 + 12', weight: '8 kg', image: require('../assets/workouts/hammer_curl.webp') },
                { id: '6', name: 'Squats', sets: '10 + 10 + 10', weight: '8 kg', image: require('../assets/workouts/squat.webp') },
                { id: '7', name: 'French Press', sets: '12 + 12 + 12', weight: '8 kg', image: require('../assets/workouts/french_press.webp') },
            ]
        },
        {
            day: 2,
            title: 'Day 2',
            stats: { calories: 251, weight: 3600, minutes: 45 },
            exercises: [
                { id: '1', name: 'Overhead Press', sets: '12 + 12 + 12', weight: '8 kg', image: require('../assets/workouts/overhead_press.webp') },
                { id: '2', name: 'Bent-Over', sets: '12 + 12 + 12', weight: '8 kg', image: require('../assets/workouts/bent_over.webp') },
                { id: '3', name: 'Lateral Raise', sets: '10 + 10 + 10', weight: '8 kg', image: require('../assets/workouts/lateral_raise.webp') },
                { id: '4', name: 'Arnold Press', sets: '12 + 12', weight: '8 kg', image: require('../assets/workouts/arnold_press.webp') },
                { id: '5', name: 'Bench Bent-Over', sets: '12 + 12 + 12 + 12', weight: '8 kg', image: require('../assets/workouts/bench_bent_over.webp') },
                { id: '6', name: 'Front Raise', sets: '10 + 10 + 10', weight: '8 kg', image: require('../assets/workouts/front_raise.webp') },
                { id: '7', name: 'Shrugs', sets: '15 + 15 + 15', weight: '8 kg', image: require('../assets/workouts/shrug.webp') },
            ]
        },
        {
            day: 3,
            title: 'Day 3',
            stats: { calories: 277, weight: 3696, minutes: 50 },
            exercises: [
                { id: '1', name: 'Bench Press', sets: '12 + 12 + 12', weight: '8 kg', image: require('../assets/workouts/bench_press.webp') },
                { id: '2', name: 'Lying French Press', sets: '12 + 12 + 12', weight: '8 kg', image: require('../assets/workouts/lying_french_press.webp') },
                { id: '3', name: 'Squats', sets: '10 + 10 + 10', weight: '8 kg', image: require('../assets/workouts/squat.webp') },
                { id: '4', name: 'Triceps Kickback', sets: '12 + 12 + 12 + 12', weight: '8 kg', image: require('../assets/workouts/tricep_kickback.webp') },
                { id: '5', name: 'Alternate Bicep Curl', sets: '12 + 12 + 12', weight: '8 kg', image: require('../assets/workouts/alt_bicep_curl.webp') },
                { id: '6', name: 'One Arm Triceps Extension', sets: '12 + 12 + 12 + 12', weight: '8 kg', image: require('../assets/workouts/one_arm_triceps_extension.webp') },
                { id: '7', name: 'Calf Raise', sets: '15 + 15 + 15', weight: '8 kg', image: require('../assets/workouts/calf_raise.webp') },
            ]
        }
    ]
  },
  {
    id: '4',
    title: 'Muscle Split',
    subtitle: 'Focused muscle isolation',
    frequency: '5 days/week',
    difficulty: 'Advanced',
    image: require('../assets/workouts/muscle_split_cover.png'),
    restBetweenSets: 75,
    restBetweenExercises: 120,
    stats: {
        calories: 186,
        weight: 3460,
        minutes: 30
    },
    schedule: [
        {
            day: 1,
            title: 'Chest',
            stats: { calories: 172, weight: 3200, minutes: 30 },
            exercises: [
                { id: '1', name: 'Bench Press', sets: '12 + 10 + 10 + 8', weight: '10 kg', image: require('../assets/workouts/bench_press.webp') },
                { id: '2', name: 'Bench Fly', sets: '12 + 10 + 10 + 8', weight: '10 kg', image: require('../assets/workouts/bench_flyes.webp') },
                { id: '3', name: 'Pullover', sets: '12 + 10 + 10 + 8', weight: '10 kg', image: require('../assets/workouts/pullover.webp') },
                { id: '4', name: 'Squeeze Press', sets: '12 + 10 + 10 + 8', weight: '10 kg', image: require('../assets/workouts/squeeze_press.webp') },
            ]
        },
        {
            day: 2,
            title: 'Back',
            stats: { calories: 181, weight: 3380, minutes: 30 },
            exercises: [
                { id: '1', name: 'Reverse Fly', sets: '12 + 10 + 10 + 8', weight: '10 kg', image: require('../assets/workouts/reverse_fly.webp') },
                { id: '2', name: 'Bent-Over', sets: '12 + 10 + 10 + 8', weight: '10 kg', image: require('../assets/workouts/bent_over.webp') },
                { id: '3', name: 'Wide Row', sets: '12 + 10 + 10 + 8', weight: '10 kg', image: require('../assets/workouts/wide_row.webp') },
                { id: '4', name: 'Shrugs', sets: '15 + 12 + 12 + 10', weight: '10 kg', image: require('../assets/workouts/shrug.webp') },
            ]
        },
        {
            day: 3,
            title: 'Arms',
            stats: { calories: 203, weight: 3440, minutes: 40 },
            exercises: [
                { id: '1', name: 'Bicep Curl', sets: '12 + 10 + 8', weight: '10 kg', image: require('../assets/workouts/bicep_curl.webp') },
                { id: '2', name: 'Hammer Curl', sets: '12 + 10 + 8', weight: '10 kg', image: require('../assets/workouts/hammer_curl.webp') },
                { id: '3', name: 'Lying Bicep Curl', sets: '12 + 10 + 8', weight: '10 kg', image: require('../assets/workouts/lying_bicep_curl.webp') },
                { id: '4', name: 'Triceps Kickback', sets: '12 + 12 + 10 + 10', weight: '10 kg', image: require('../assets/workouts/tricep_kickback.webp') },
                { id: '5', name: 'Lying French Press', sets: '12 + 10 + 8', weight: '10 kg', image: require('../assets/workouts/lying_french_press.webp') },
                { id: '6', name: 'French Press', sets: '12 + 10 + 8', weight: '10 kg', image: require('../assets/workouts/french_press.webp') },
            ]
        },
        {
            day: 4,
            title: 'Shoulders',
            stats: { calories: 172, weight: 3200, minutes: 30 },
            exercises: [
                { id: '1', name: 'Overhead Press', sets: '12 + 10 + 10 + 8', weight: '10 kg', image: require('../assets/workouts/overhead_press.webp') },
                { id: '2', name: 'Lateral Raise', sets: '12 + 10 + 10 + 8', weight: '10 kg', image: require('../assets/workouts/lateral_raise.webp') },
                { id: '3', name: 'Arnold Press', sets: '12 + 10 + 10 + 8', weight: '10 kg', image: require('../assets/workouts/arnold_press.webp') },
                { id: '4', name: 'Front Raise', sets: '12 + 10 + 10 + 8', weight: '10 kg', image: require('../assets/workouts/front_raise.webp') },
            ]
        },
        {
            day: 5,
            title: 'Legs',
            stats: { calories: 186, weight: 3460, minutes: 30 },
            exercises: [
                { id: '1', name: 'Deadlift', sets: '12 + 10 + 10 + 8', weight: '10 kg', image: require('../assets/workouts/deadlift.webp') },
                { id: '2', name: 'Lunges', sets: '12 + 12 + 10 + 10', weight: '10 kg', image: require('../assets/workouts/lunges.webp') },
                { id: '3', name: 'Squats', sets: '12 + 10 + 10 + 8', weight: '10 kg', image: require('../assets/workouts/squat.webp') },
                { id: '4', name: 'Calf Raise', sets: '15 + 12 + 12 + 10', weight: '10 kg', image: require('../assets/workouts/calf_raise.webp') },
            ]
        }
    ] 
  },
  {
    id: '5',
    title: 'Ultimate Shred',
    subtitle: 'Maximum definition',
    frequency: '6 days/week',
    difficulty: 'Advanced',
    image: require('../assets/workouts/ultimate_shred_cover.png'),
    restBetweenSets: 45,
    restBetweenExercises: 90,
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
                { id: '1', name: 'Incline Bench Press', sets: '15 + 15 + 15 + 15', weight: '8 kg', image: require('../assets/workouts/incline_bench_press.webp') },
                { id: '2', name: 'Bench Press', sets: '12 + 12 + 12', weight: '8 kg', image: require('../assets/workouts/bench_press.webp') },
                { id: '3', name: 'Incline Bench Fly', sets: '12 + 12 + 12', weight: '8 kg', image: require('../assets/workouts/incline_bench_flyes.webp') },
                { id: '4', name: 'Bench Fly', sets: '12 + 12 + 12', weight: '8 kg', image: require('../assets/workouts/bench_flyes.webp') },
                { id: '5', name: 'Lying French Press', sets: '15 + 15 + 15 + 15', weight: '8 kg', image: require('../assets/workouts/french_press.webp') },
                { id: '6', name: 'French Press', sets: '12 + 12 + 12', weight: '8 kg', image: require('../assets/workouts/french_press.webp') },
                { id: '7', name: 'Hang Leg Raises', sets: '10 + 10 + 10 + 10', weight: '-', image: require('../assets/workouts/hang_leg_raises.webp') },
                { id: '8', name: 'Crunches', sets: '25 + 25 + 25 + 25', weight: '-', image: require('../assets/workouts/crunches.webp') },
            ]
        },
        {
            day: 2,
            title: 'Pull',
            stats: { calories: 447, weight: 5472, minutes: 35 },
            exercises: [
                { id: '1', name: 'Pull-Ups', sets: '10 + 10 + 10 + 10', weight: '-', image: require('../assets/workouts/bw_pull_ups.webp') },
                { id: '2', name: 'Bent-Over', sets: '15 + 15 + 15 + 15', weight: '8 kg', image: require('../assets/workouts/bent_over.webp') },
                { id: '3', name: 'Wide Row', sets: '15 + 15 + 15 + 15', weight: '8 kg', image: require('../assets/workouts/wide_row.webp') },
                { id: '4', name: 'Bicep Curl', sets: '12 + 12 + 12 + 12', weight: '8 kg', image: require('../assets/workouts/bicep_curl.webp') },
                { id: '5', name: 'Hammer Curl', sets: '12 + 12 + 12 + 12', weight: '8 kg', image: require('../assets/workouts/hammer_curl.webp') },
                { id: '6', name: 'Lying Leg Raises', sets: '25 + 25 + 25 + 25', weight: '-', image: require('../assets/workouts/bw_lying_leg_rises.webp') },
                { id: '7', name: 'Bicycle', sets: '25 + 25 + 25 + 25', weight: '-', image: require('../assets/workouts/bw_bicycle.webp') },
            ]
        },
        {
            day: 3,
            title: 'Legs & Shoulders',
            stats: { calories: 507, weight: 7184, minutes: 40 },
            exercises: [
                { id: '1', name: 'Squats', sets: '15 + 15 + 15 + 15', weight: '8 kg', image: require('../assets/workouts/squat.webp') },
                { id: '2', name: 'Lunges', sets: '15 + 15 + 15 + 15', weight: '8 kg', image: require('../assets/workouts/lunges.webp') },
                { id: '3', name: 'Deadlift', sets: '12 + 12 + 12 + 12', weight: '8 kg', image: require('../assets/workouts/deadlift.webp') },
                { id: '4', name: 'Calf Raise', sets: '20 + 20 + 20 + 20', weight: '8 kg', image: require('../assets/workouts/calf_raise.webp') },
                { id: '5', name: 'Arnold Press', sets: '15 + 15 + 15 + 15', weight: '8 kg', image: require('../assets/workouts/arnold_press.webp') },
                { id: '6', name: 'Lateral Raise', sets: '12 + 12 + 12 + 12', weight: '8 kg', image: require('../assets/workouts/lateral_raise.webp') },
                { id: '7', name: 'Front Raise', sets: '12 + 12 + 12 + 12', weight: '8 kg', image: require('../assets/workouts/front_raise.webp') },
                { id: '8', name: 'Crunches', sets: '25 + 25 + 25 + 25', weight: '-', image: require('../assets/workouts/crunches.webp') },
            ]
        },
        {
            day: 4,
            title: 'Push',
            stats: { calories: 398, weight: 5040, minutes: 35 },
            exercises: [
                { id: '1', name: 'Decline Bench Press', sets: '15 + 15 + 15 + 15', weight: '8 kg', image: require('../assets/workouts/decline_bench_press.webp') },
                { id: '2', name: 'Bench Press', sets: '12 + 12 + 12', weight: '8 kg', image: require('../assets/workouts/bench_press.webp') },
                { id: '3', name: 'Decline Bench Fly', sets: '12 + 12 + 12', weight: '8 kg', image: require('../assets/workouts/decline_bench_fly.webp') },
                { id: '4', name: 'Bench Fly', sets: '12 + 12 + 12', weight: '8 kg', image: require('../assets/workouts/bench_flyes.webp') },
                { id: '5', name: 'Triceps Kickback', sets: '15 + 15 + 15 + 15', weight: '8 kg', image: require('../assets/workouts/tricep_kickback.webp') },
                { id: '6', name: 'French Press', sets: '12 + 12 + 12', weight: '8 kg', image: require('../assets/workouts/french_press.webp') },
                { id: '7', name: 'Hang Leg Raises', sets: '10 + 10 + 10 + 10', weight: '-', image: require('../assets/workouts/hang_leg_raises.webp') },
                { id: '8', name: 'Crunches', sets: '25 + 25 + 25 + 25', weight: '-', image: require('../assets/workouts/crunches.webp') },
            ]
        },
        {
            day: 5,
            title: 'Pull',
            stats: { calories: 491, weight: 5760, minutes: 40 },
            exercises: [
                { id: '1', name: 'Pull-Ups', sets: '10 + 10 + 10 + 10', weight: '-', image: require('../assets/workouts/bw_pull_ups.webp') },
                { id: '2', name: 'Bench Bent-Over', sets: '15 + 15 + 15 + 15', weight: '8 kg', image: require('../assets/workouts/bent_over.webp') },
                { id: '3', name: 'Reverse Fly', sets: '12 + 12 + 12 + 12', weight: '8 kg', image: require('../assets/workouts/reverse_fly.webp') },
                { id: '4', name: 'Shrugs', sets: '15 + 15 + 15 + 15', weight: '8 kg', image: require('../assets/workouts/shrug.webp') },
                { id: '5', name: 'Alternate Bicep Curl', sets: '12 + 12 + 12 + 12', weight: '8 kg', image: require('../assets/workouts/alt_bicep_curl.webp') },
                { id: '6', name: 'Alternate Hammer Curl', sets: '12 + 12 + 12 + 12', weight: '8 kg', image: require('../assets/workouts/alt_hammer_curl.webp') },
                { id: '7', name: 'Lying Leg Raises', sets: '25 + 25 + 25 + 25', weight: '-', image: require('../assets/workouts/bw_lying_leg_rises.webp') },
                { id: '8', name: 'Bicycle', sets: '25 + 25 + 25 + 25', weight: '-', image: require('../assets/workouts/bw_bicycle.webp') },
            ]
        },
        {
            day: 6,
            title: 'Legs & Shoulders',
            stats: { calories: 507, weight: 7184, minutes: 40 },
            exercises: [
                { id: '1', name: 'Squats', sets: '15 + 15 + 15 + 15', weight: '8 kg', image: require('../assets/workouts/squat.webp') },
                { id: '2', name: 'Lunges', sets: '15 + 15 + 15 + 15', weight: '8 kg', image: require('../assets/workouts/lunges.webp') },
                { id: '3', name: 'Deadlift', sets: '12 + 12 + 12 + 12', weight: '8 kg', image: require('../assets/workouts/deadlift.webp') },
                { id: '4', name: 'Calf Raise', sets: '20 + 20 + 20 + 20', weight: '8 kg', image: require('../assets/workouts/calf_raise.webp') },
                { id: '5', name: 'Arnold Press', sets: '15 + 15 + 15 + 15', weight: '8 kg', image: require('../assets/workouts/arnold_press.webp') },
                { id: '6', name: 'Lateral Raise', sets: '12 + 12 + 12 + 12', weight: '8 kg', image: require('../assets/workouts/lateral_raise.webp') },
                { id: '7', name: 'Front Raise', sets: '12 + 12 + 12 + 12', weight: '8 kg', image: require('../assets/workouts/front_raise.webp') },
                { id: '8', name: 'Crunches', sets: '25 + 25 + 25 + 25', weight: '-', image: require('../assets/workouts/crunches.webp') },
            ]
        }
    ]
  },
];
