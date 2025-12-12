import React from 'react';
import { View, StyleSheet, ViewStyle, SafeAreaView, StatusBar } from 'react-native';
import { Theme } from '../../theme';

interface ScreenProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const Screen: React.FC<ScreenProps> = ({ children, style }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Theme.colors.background} />
      <View style={[styles.container, style]}>
        {children}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
});
