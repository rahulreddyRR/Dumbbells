import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Theme } from '../../theme';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {categories.map((category) => {
        const isSelected = selectedCategory === category;
        return (
          <TouchableOpacity
            key={category}
            style={[
              styles.chip,
              isSelected && styles.selectedChip,
            ]}
            onPress={() => onSelectCategory(category)}
          >
            <Text
              style={[
                styles.text,
                isSelected && styles.selectedText,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Theme.spacing.m,
    gap: Theme.spacing.s,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#1C1C1E', // Default dark bg
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  selectedChip: {
    backgroundColor: Theme.colors.success, // Greenish color like in the image
    borderColor: Theme.colors.success,
  },
  text: {
    color: Theme.colors.gray[400],
    fontWeight: '600',
    fontSize: 14,
  },
  selectedText: {
    color: Theme.colors.black,
  },
});
