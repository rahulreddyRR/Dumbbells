import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native';
import { Theme } from '../../theme';
import { Exercise } from '../../data/exercises';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - Theme.spacing.m * 3) / 2; // 2 columns with padding

interface ExerciseCardProps {
  exercise: Exercise;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise }) => {
  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.imageContainer}>
          {/* Placeholder or actual image */}
          {exercise.image ? (
            <Image source={exercise.image} style={styles.image} resizeMode="cover"/>
          ) : (
            <View style={[styles.image, styles.placeholder]}>
               <Text style={styles.placeholderText}>{exercise.name[0]}</Text>
            </View>
          )}
      </View>
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>{exercise.name}</Text>
        <Text style={styles.muscle}>{exercise.muscle}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    marginBottom: Theme.spacing.m,
    backgroundColor: 'transparent',
  },
  imageContainer: {
    height: 120,
    borderRadius: Theme.borderRadius.l,
    overflow: 'hidden',
    backgroundColor: Theme.colors.gray[200], // Placeholder color
    marginBottom: Theme.spacing.s,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: Theme.colors.white,
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    paddingHorizontal: 4,
  },
  name: {
    color: Theme.colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  muscle: {
    color: Theme.colors.gray[500],
    fontSize: 14,
  },
});
