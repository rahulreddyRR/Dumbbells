export interface Exercise {
  id: string;
  name: string;
  muscle: string;
  image: any; // Will use require() or uri
}

export const EXERCISES: Exercise[] = [
  { id: '1', name: 'Alternate Bicep Curl', muscle: 'Biceps', image: require('../assets/workouts/alt_bicep_curl.webp') },
  { id: '2', name: 'Alternate Hammer Curl', muscle: 'Biceps', image: require('../assets/workouts/alt_hammer_curl.webp') },
  { id: '3', name: 'Bicep Curl', muscle: 'Biceps', image: require('../assets/workouts/bicep_curl.webp') },
  { id: '4', name: 'Hammer Curl', muscle: 'Biceps', image: require('../assets/workouts/hammer_curl.webp') },
  { id: '5', name: 'Concentration Bicep Curl', muscle: 'Biceps', image: require('../assets/workouts/concentration_bicep_curl.webp') },
  { id: '6', name: 'Lying Bicep Curl', muscle: 'Biceps', image: require('../assets/workouts/lying_bicep_curl.webp') },

  { id: '7', name: 'One Arm Triceps Extension', muscle: 'Triceps', image: require('../assets/workouts/one_arm_triceps_extension.webp') },
  { id: '8', name: 'French Press', muscle: 'Triceps', image: require('../assets/workouts/french_press.webp') },
  { id: '9', name: 'Lying French Press', muscle: 'Triceps', image: require('../assets/workouts/lying_french_press.webp') },
  { id: '10', name: 'Triceps Kickback', muscle: 'Triceps', image: require('../assets/workouts/tricep_kickback.webp') },
  { id: '11', name: 'Push-Ups', muscle: 'Triceps', image: require('../assets/workouts/bw_push_ups.webp') },
  { id: '12', name: 'Dips', muscle: 'Triceps', image: require('../assets/workouts/bw_dips.webp') },
  
  { id: '13', name: 'Overhead Press', muscle: 'Shoulders', image: require('../assets/workouts/overhead_press.webp') },
  { id: '14', name: 'Lateral Raise', muscle: 'Shoulders', image: require('../assets/workouts/lateral_raise.webp') },
  { id: '15', name: 'Arnold Press', muscle: 'Shoulders', image: require('../assets/workouts/arnold_press.webp') },
  { id: '16', name: 'Front Raise', muscle: 'Shoulders', image: require('../assets/workouts/front_raise.webp') },
  { id: '17', name: 'Overhead Press', muscle: 'Shoulders', image: require('../assets/workouts/overhead_press.webp') },
  
  { id: '18', name: 'Bench Press', muscle: 'Chest', image: require('../assets/workouts/bench_press.webp') },
  { id: '19', name: 'Incline Bench Press', muscle: 'Chest', image: require('../assets/workouts/incline_bench_press.webp') },
  { id: '20', name: 'Decline Bench Press', muscle: 'Chest', image: require('../assets/workouts/decline_bench_press.webp') },
  { id: '21', name: 'Squeeze Press', muscle: 'Chest', image: require('../assets/workouts/squeeze_press.webp') },
  { id: '22', name: 'Bench Fly', muscle: 'Chest', image: require('../assets/workouts/bench_flyes.webp') },
  { id: '23', name: 'Incline Bench Fly', muscle: 'Chest', image: require('../assets/workouts/incline_bench_flyes.webp') },
  { id: '24', name: 'Decline Bench Fly', muscle: 'Chest', image: require('../assets/workouts/decline_bench_fly.webp') },
  { id: '25', name: 'Pullover', muscle: 'Chest', image: require('../assets/workouts/pullover.webp') },
  
  { id: '26', name: 'Bent-Over', muscle: 'Back', image: require('../assets/workouts/bent_over.webp') },
  { id: '27', name: 'Bench Bent-Over', muscle: 'Back', image: require('../assets/workouts/bench_bent_over.webp') },
  { id: '28', name: 'Wide Row', muscle: 'Back', image: require('../assets/workouts/wide_row.webp') },
  { id: '29', name: 'Reverse Fly', muscle: 'Back', image: require('../assets/workouts/reverse_fly.webp') },
  { id: '30', name: 'Shrugs', muscle: 'Back', image: require('../assets/workouts/shrug.webp') },
  { id: '31', name: 'Pull-Ups', muscle: 'Back', image: require('../assets/workouts/bw_pull_ups.webp') },

  { id: '32', name: 'Squats', muscle: 'Legs', image: require('../assets/workouts/squat.webp') },
  { id: '33', name: 'Lunges', muscle: 'Legs', image: require('../assets/workouts/lunges.webp') },
  { id: '34', name: 'Calf Raise', muscle: 'Legs', image: require('../assets/workouts/calf_raise.webp') },
  { id: '35', name: 'Deadlift', muscle: 'Legs', image: require('../assets/workouts/deadlift.webp') },

  
  { id: '36', name: 'Lying leg Raises', muscle: 'Abs', image: require('../assets/workouts/bw_lying_leg_rises.webp') },
  { id: '37', name: 'Crunches', muscle: 'Abs', image: require('../assets/workouts/crunches.webp') },
  { id: '38', name: 'Mountain Climbers', muscle: 'Abs', image: require('../assets/workouts/mountain_climber.webp') },
  { id: '39', name: 'Bicycle', muscle: 'Abs', image: require('../assets/workouts/bw_bicycle.webp') },
  { id: '40', name: 'Hang Leg Raises', muscle: 'Abs', image: require('../assets/workouts/hang_leg_raises.webp') },
];

export const CATEGORIES = ['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Biceps', 'Triceps', 'Abs'];
