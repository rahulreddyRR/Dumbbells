import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Theme } from '../../theme';
import Ionicons from 'react-native-vector-icons/Ionicons';

export const CreateCustomCard = () => {
  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.8}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="add" size={32} color={Theme.colors.black} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Create Custom Plan</Text>
          <Text style={styles.subtitle}>Design your own routine from scratch</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color={Theme.colors.gray[500]} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.l,
    padding: Theme.spacing.m,
    marginBottom: Theme.spacing.l, // Extra margin at bottom
    borderWidth: 1,
    borderColor: Theme.colors.gray[200],
    borderStyle: 'dashed',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Theme.spacing.m,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: Theme.colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  subtitle: {
    color: Theme.colors.gray[400],
    fontSize: 12,
  },
});
