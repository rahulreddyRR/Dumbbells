import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Theme } from '../../theme';
import { WorkoutPlan } from '../../data/workoutPlans';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

interface PlanCardProps {
  plan: WorkoutPlan;
}

export const PlanCard: React.FC<PlanCardProps> = ({ plan }) => {
  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.9}>
      <View style={styles.imageContainer}>
        {plan.image ? (
            <Image source={plan.image} style={styles.image} resizeMode="cover" />
        ) : (
            <View style={[styles.image, styles.placeholder]}>
                <Ionicons name="barbell" size={48} color={Theme.colors.gray[500]} />
            </View>
        )}
        <View style={styles.overlay} />
        <View style={styles.content}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{plan.difficulty.toUpperCase()}</Text>
          </View>
          <Text style={styles.title}>{plan.title}</Text>
          <Text style={styles.subtitle}>{plan.subtitle}</Text>
          <View style={styles.footer}>
            <Ionicons name="calendar-outline" size={16} color={Theme.colors.gray[300]} />
            <Text style={styles.frequency}>{plan.frequency}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Theme.spacing.m,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#1C1C1E',
  },
  imageContainer: {
    height: 200,
    width: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    backgroundColor: '#2C2C2E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  content: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Theme.spacing.m,
  },
  badge: {
    backgroundColor: Theme.colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  badgeText: {
    color: Theme.colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  title: {
    color: Theme.colors.white,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    color: Theme.colors.gray[300],
    fontSize: 14,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  frequency: {
    color: Theme.colors.gray[300],
    fontSize: 12,
    marginLeft: 6,
  },
});
