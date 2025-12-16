import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Theme } from '../../theme';
import { WorkoutPlan } from '../../data/workoutPlans';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

interface PlanCardProps {
  plan: WorkoutPlan;
  onPress: () => void;
  onDelete?: () => void;
  isCustom?: boolean;
}

export const PlanCard: React.FC<PlanCardProps> = ({ plan, onPress, onDelete, isCustom }) => {
  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.9} onPress={onPress}>
      <View style={styles.imageContainer}>
        {plan.image ? (
          <Image source={plan.image} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={[styles.image, styles.placeholder]}>
            <Ionicons name="barbell" size={48} color={Theme.colors.gray[500]} />
          </View>
        )}

        {/* Dark overlay for readability */}
        <View style={styles.overlay} />

        {/* Top Row: Badge and potentially Delete Button */}
        <View style={styles.topRow}>
          <View style={[styles.badge, { backgroundColor: getDifficultyColor(plan.difficulty) }]}>
            <Text style={styles.badgeText}>{plan.difficulty.toUpperCase()}</Text>
          </View>

          {/* Delete button for custom plans */}
          {isCustom && onDelete && (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="trash-outline" size={18} color={Theme.colors.white} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={2}>{plan.title}</Text>
          <Text style={styles.subtitle} numberOfLines={1}>{plan.subtitle}</Text>

          <View style={styles.footer}>
            <View style={styles.footerItem}>
              <Ionicons name="calendar-outline" size={14} color={Theme.colors.white} />
              <Text style={styles.footerText}>{plan.frequency}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty.toLowerCase()) {
    case 'beginner': return Theme.colors.success || '#4CAF50';
    case 'intermediate': return Theme.colors.warning || '#FF9800';
    case 'advanced': return Theme.colors.error || '#F44336';
    default: return Theme.colors.primary;
  }
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Theme.spacing.m,
    borderRadius: 16,
    backgroundColor: Theme.colors.surface,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    overflow: 'hidden', // Ensure image doesn't bleed
  },
  imageContainer: {
    height: 220,
    width: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    backgroundColor: Theme.colors.gray[800],
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)', // Slight dim for whole image
  },
  topRow: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: Theme.colors.primary,
  },
  badgeText: {
    color: Theme.colors.white,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  content: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    // Simulate gentle gradient at bottom with a background color if needed, 
    // or just rely on the overlay. Let's add a gradient-like view behind text if practical? 
    // Since we can't use LinearGradient, we will just use a darker semi-transparent bg for the content area
    // to ensure readability.
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  title: {
    color: Theme.colors.white,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    marginBottom: 10,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerText: {
    color: Theme.colors.white,
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.9,
  },
  deleteButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    // No absolute positioning needed here as it's in topRow with space-between
  },
});
