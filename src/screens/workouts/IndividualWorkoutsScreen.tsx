import React, { useState, useMemo } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { ScreenContainer } from '../../components/common/Screen';
import { Theme } from '../../theme';
import { SearchBar } from '../../components/common/SearchBar';
import { CategoryFilter } from '../../components/workouts/CategoryFilter';
import { ExerciseCard } from '../../components/workouts/ExerciseCard';
import { EXERCISES, CATEGORIES } from '../../data/exercises';

export const IndividualWorkoutsScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredExercises = useMemo(() => {
    return EXERCISES.filter((exercise) => {
      const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || exercise.muscle === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <View style={styles.header}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchBar}
          />
          <View style={styles.filterContainer}>
            <CategoryFilter
              categories={CATEGORIES}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </View>
        </View>

        <FlatList
          data={filteredExercises}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ExerciseCard exercise={item} />}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingVertical: Theme.spacing.m,
    backgroundColor: Theme.colors.background,
  },
  searchBar: {
    marginHorizontal: Theme.spacing.m,
    marginBottom: Theme.spacing.m,
  },
  filterContainer: {
    marginBottom: Theme.spacing.s,
  },
  listContent: {
    paddingHorizontal: Theme.spacing.m,
    paddingBottom: Theme.spacing.xl,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
});
