import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TextInput, Modal, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { ScreenContainer } from '../components/common/Screen';
import { Theme } from '../theme';
import { useWorkoutStore } from '../store/workoutStore';
import { useUserProfileStore } from '../store/userProfileStore';
import { useAppSettingsStore } from '../store/appSettingsStore';
import { SettingSection } from '../components/settings/SettingSection';
import { SettingRow } from '../components/settings/SettingRow';
import Ionicons from 'react-native-vector-icons/Ionicons';

export const SettingsScreen = () => {
  // Workout data management
  const clearWorkoutHistory = useWorkoutStore((state) => state.clearWorkoutHistory);
  const deleteCustomPlans = useWorkoutStore((state) => state.deleteCustomPlans);

  // User profile
  const userProfile = useUserProfileStore((state) => state.profile);
  const updateUserProfile = useUserProfileStore((state) => state.updateProfile);
  const resetUserProfile = useUserProfileStore((state) => state.resetProfile);

  // App settings
  const appSettings = useAppSettingsStore((state) => state.settings);
  const updateAppSettings = useAppSettingsStore((state) => state.updateSettings);
  const resetAppSettings = useAppSettingsStore((state) => state.resetSettings);

  const [showNameModal, setShowNameModal] = useState(false);
  const [tempName, setTempName] = useState(userProfile.name);

  const [showGoalModal, setShowGoalModal] = useState(false);
  const [tempGoal, setTempGoal] = useState<typeof userProfile.fitnessGoal>(userProfile.fitnessGoal);

  const fitnessGoalLabels = {
    weight_loss: 'Weight Loss',
    muscle_gain: 'Muscle Gain',
    maintenance: 'Maintenance',
    general_fitness: 'General Fitness',
  };

  const handleClearHistory = () => {
    Alert.alert(
      'Clear Workout History',
      'Are you sure you want to delete all completed workout data? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            clearWorkoutHistory();
            Alert.alert('Success', 'Workout history cleared');
          },
        },
      ]
    );
  };

  const handleDeleteCustomPlans = () => {
    Alert.alert(
      'Delete Custom Plans',
      'Are you sure you want to delete all custom workout plans? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteCustomPlans();
            Alert.alert('Success', 'Custom plans deleted');
          },
        },
      ]
    );
  };

  const handleResetAll = () => {
    Alert.alert(
      'Reset All Data',
      'This will delete ALL app data including workouts, custom plans, and settings. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset Everything',
          style: 'destructive',
          onPress: () => {
            clearWorkoutHistory();
            deleteCustomPlans();
            resetUserProfile();
            resetAppSettings();
            Alert.alert('Success', 'All data has been reset');
          },
        },
      ]
    );
  };

  const saveName = () => {
    updateUserProfile({ name: tempName });
    setShowNameModal(false);
  };

  const saveGoal = () => {
    updateUserProfile({ fitnessGoal: tempGoal });
    setShowGoalModal(false);
  };

  return (
    <ScreenContainer>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Customize your experience</Text>
        </View>

        {/* User Profile */}
        <SettingSection title="User Profile">
          <SettingRow
            icon="person-outline"
            label="Name"
            value={userProfile.name || 'Not set'}
            onPress={() => {
              setTempName(userProfile.name);
              setShowNameModal(true);
            }}
          />
          <SettingRow
            icon="fitness-outline"
            label="Weight"
            value={`${userProfile.weight} kg`}
            onPress={() => Alert.alert('Coming Soon', 'Weight editing will be available soon')}
          />
          <SettingRow
            icon="resize-outline"
            label="Height"
            value={`${userProfile.height} cm`}
            onPress={() => Alert.alert('Coming Soon', 'Height editing will be available soon')}
          />
          <SettingRow
            icon="calendar-outline"
            label="Age"
            value={`${userProfile.age} years`}
            onPress={() => Alert.alert('Coming Soon', 'Age editing will be available soon')}
          />
          <SettingRow
            icon="trophy-outline"
            label="Fitness Goal"
            value={fitnessGoalLabels[userProfile.fitnessGoal]}
            onPress={() => {
              setTempGoal(userProfile.fitnessGoal);
              setShowGoalModal(true);
            }}
            isLast
          />
        </SettingSection>

        {/* App Settings */}
        <SettingSection title="App Settings">
          <SettingRow
            icon="volume-high-outline"
            label="Sound Effects"
            isSwitch
            switchValue={appSettings.soundEffects}
            onSwitchChange={(value) => updateAppSettings({ soundEffects: value })}
          />
          <SettingRow
            icon="alarm-outline"
            label="Rest Timer Sound"
            isSwitch
            switchValue={appSettings.restTimerSound}
            onSwitchChange={(value) => updateAppSettings({ restTimerSound: value })}
            isLast
          />
        </SettingSection>

        {/* Data Management */}
        <SettingSection title="Data Management">
          <SettingRow
            icon="trash-outline"
            label="Clear Workout History"
            onPress={handleClearHistory}
            showChevron={false}
          />
          <SettingRow
            icon="close-circle-outline"
            label="Delete Custom Plans"
            onPress={handleDeleteCustomPlans}
            showChevron={false}
          />
          <SettingRow
            icon="refresh-outline"
            label="Reset All Data"
            onPress={handleResetAll}
            showChevron={false}
            isLast
          />
        </SettingSection>

        {/* About */}
        <SettingSection title="About">
          <SettingRow
            icon="information-circle-outline"
            label="App Version"
            value="1.0.0"
            showChevron={false}
          />
          <SettingRow
            icon="star-outline"
            label="Rate App"
            onPress={() => Alert.alert('Thank you!', 'Rating feature coming soon')}
          />
          <SettingRow
            icon="mail-outline"
            label="Contact Support"
            value="Temporarily Unavailable"
            showChevron={false}
            isLast
          />
        </SettingSection>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Made with 💪 for fitness enthusiasts</Text>
        </View>
      </ScrollView>

      {/* Name Edit Modal */}
      <Modal visible={showNameModal} transparent animationType="fade">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Name</Text>
            <TextInput
              style={styles.modalInput}
              value={tempName}
              onChangeText={setTempName}
              placeholder="Enter your name"
              placeholderTextColor={Theme.colors.gray[500]}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowNameModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={saveName}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Goal Edit Modal */}
      <Modal visible={showGoalModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Fitness Goal</Text>

            <View style={{ marginVertical: 16 }}>
              {(Object.keys(fitnessGoalLabels) as Array<keyof typeof fitnessGoalLabels>).map((goal) => (
                <TouchableOpacity
                  key={goal}
                  style={[
                    styles.goalOption,
                    tempGoal === goal && styles.goalOptionActive
                  ]}
                  onPress={() => setTempGoal(goal)}
                >
                  <Ionicons
                    name={tempGoal === goal ? 'radio-button-on' : 'radio-button-off'}
                    size={20}
                    color={tempGoal === goal ? Theme.colors.primary : Theme.colors.gray[500]}
                  />
                  <Text style={[
                    styles.goalLabel,
                    tempGoal === goal && styles.goalLabelActive
                  ]}>
                    {fitnessGoalLabels[goal]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowGoalModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={saveGoal}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  header: {
    padding: Theme.spacing.m,
    paddingTop: Theme.spacing.l,
  },
  title: {
    color: Theme.colors.white,
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    color: Theme.colors.gray[400],
    fontSize: 16,
  },
  footer: {
    padding: Theme.spacing.xl,
    alignItems: 'center',
  },
  footerText: {
    color: Theme.colors.gray[600],
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Theme.spacing.m,
  },
  modalContent: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.l,
    padding: Theme.spacing.l,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    color: Theme.colors.white,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: Theme.spacing.m,
  },
  goalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Theme.spacing.m,
    borderRadius: Theme.borderRadius.m,
    borderWidth: 1,
    borderColor: Theme.colors.gray[700], // Updated to use specific gray
    marginBottom: Theme.spacing.s,
    gap: Theme.spacing.m,
  },
  goalOptionActive: {
    borderColor: Theme.colors.primary,
    backgroundColor: 'rgba(212, 255, 0, 0.05)',
  },
  goalLabel: {
    color: Theme.colors.gray[300],
    fontSize: 16,
    flex: 1,
  },
  goalLabelActive: {
    color: Theme.colors.white,
    fontWeight: '600',
  },

  modalInput: {
    backgroundColor: Theme.colors.background,
    borderRadius: Theme.borderRadius.m,
    padding: Theme.spacing.m,
    color: Theme.colors.white,
    fontSize: 16,
    marginBottom: Theme.spacing.m,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: Theme.spacing.s,
  },
  modalButton: {
    flex: 1,
    padding: Theme.spacing.m,
    borderRadius: Theme.borderRadius.m,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: Theme.colors.gray[700],
  },
  saveButton: {
    backgroundColor: Theme.colors.primary,
  },
  cancelButtonText: {
    color: Theme.colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonText: {
    color: Theme.colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
