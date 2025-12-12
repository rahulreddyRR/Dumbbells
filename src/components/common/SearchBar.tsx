import React from 'react';
import { View, TextInput, StyleSheet, ViewStyle } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Theme } from '../../theme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  style?: ViewStyle;
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChangeText, style }) => {
  return (
    <View style={[styles.container, style]}>
      <Ionicons name="search" size={20} color={Theme.colors.gray[500]} style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder="Search exercises by name"
        placeholderTextColor={Theme.colors.gray[500]}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1E', // Darker background for input
    borderRadius: 8,
    paddingHorizontal: Theme.spacing.m,
    height: 48,
  },
  icon: {
    marginRight: Theme.spacing.s,
  },
  input: {
    flex: 1,
    color: Theme.colors.white,
    fontSize: 16,
    height: '100%',
  },
});
