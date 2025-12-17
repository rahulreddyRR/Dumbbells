import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Alert, Platform, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { Screen } from '../../components/common/Screen';
import { Theme } from '../../theme';
import { Button } from '../../components/common/Button';
import { useUserProfileStore } from '../../store/userProfileStore';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';
import analytics from '@react-native-firebase/analytics';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

export const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
    const { updateProfile, completeOnboarding } = useUserProfileStore();

    // Form State
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');


    // Modal State
    const [modalVisible, setModalVisible] = React.useState(false);
    const [modalConfig, setModalConfig] = React.useState<{
        title: string;
        message: string;
        buttons: { text: string; onPress: () => void; style?: 'default' | 'cancel' | 'destructive' }[];
    }>({
        title: '',
        message: '',
        buttons: []
    });

    const handleContinue = async () => {
        if (!name.trim() || !age || !weight || !height) {
            setModalConfig({
                title: 'Missing Details',
                message: 'Please fill in all fields to customize your plan.',
                buttons: [{ text: 'OK', onPress: () => setModalVisible(false), style: 'default' }]
            });
            setModalVisible(true);
            return;
        }

        const ageNum = parseInt(age);
        const weightNum = parseFloat(weight);
        const heightNum = parseFloat(height);

        if (isNaN(ageNum) || isNaN(weightNum) || isNaN(heightNum)) {
            setModalConfig({
                title: 'Invalid Input',
                message: 'Please enter valid numbers for age, weight, and height.',
                buttons: [{ text: 'OK', onPress: () => setModalVisible(false), style: 'default' }]
            });
            setModalVisible(true);
            return;
        }

        // Save Profile
        updateProfile({
            name: name.trim(),
            age: ageNum,
            weight: weightNum,
            height: heightNum,
        });

        // Firebase Analytics
        try {
            await analytics().setUserProperties({
                age: age,
                weight: weight,
                height: height,
            });
            await analytics().logEvent('onboarding_complete', {
                name: name.trim(),
                age: ageNum,
                weight: weightNum,
                height: heightNum,
            });
        } catch (error) {
            console.error('Analytics error:', error);
        }

        // Complete Onboarding
        completeOnboarding();
        navigation.replace('Main');
    };

    const renderInput = (label: string, value: string, setValue: (val: string) => void, placeholder: string, keyboardType: 'default' | 'numeric' = 'default', suffix?: string) => (
        <View style={styles.inputContainer}>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.inputWrapper}>
                <TextInput
                    style={styles.input}
                    value={value}
                    onChangeText={setValue}
                    placeholder={placeholder}
                    placeholderTextColor={Theme.colors.gray[600]}
                    keyboardType={keyboardType}
                />
                {suffix && <Text style={styles.suffix}>{suffix}</Text>}
            </View>
        </View>
    );



    return (
        <Screen>
            <KeyboardAvoidingView
                style={styles.keyboardAvoidingView}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>

                    <View style={styles.header}>
                        <View style={styles.iconContainer}>
                            <Ionicons name="barbell" size={40} color={Theme.colors.primary} />
                        </View>
                        <Text style={styles.title}>Welcome to Dumbbells</Text>
                        <Text style={styles.subtitle}>Let's get to know you better to personalize your workout experience.</Text>
                    </View>

                    <View style={styles.form}>
                        {renderInput("Name", name, setName, "Your Name")}

                        <View style={styles.row}>
                            <View style={{ flex: 1, marginRight: 8 }}>
                                {renderInput("Age", age, setAge, "25", "numeric")}
                            </View>
                            <View style={{ flex: 1, marginLeft: 8 }}>
                                {/* Placeholder purely for spacing if needed, but row splits fine */}
                            </View>
                        </View>

                        <View style={styles.row}>
                            <View style={{ flex: 1, marginRight: 8 }}>
                                {renderInput("Weight", weight, setWeight, "70", "numeric", "kg")}
                            </View>
                            <View style={{ flex: 1, marginLeft: 8 }}>
                                {renderInput("Height", height, setHeight, "170", "numeric", "cm")}
                            </View>
                        </View>
                    </View>

                    <View style={styles.footer}>
                        <Button title="Get Started" onPress={handleContinue} />
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>

            <ConfirmationModal
                visible={modalVisible}
                title={modalConfig.title}
                message={modalConfig.message}
                buttons={modalConfig.buttons}
                onCancel={() => setModalVisible(false)}
            />
        </Screen>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    contentContainer: {
        padding: Theme.spacing.l,
        paddingBottom: 100, // Space for button
    },
    header: {
        alignItems: 'center',
        marginVertical: Theme.spacing.xl,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(212, 255, 0, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Theme.spacing.l,
        borderWidth: 1,
        borderColor: Theme.colors.primary,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Theme.colors.white,
        textAlign: 'center',
        marginBottom: Theme.spacing.m,
    },
    subtitle: {
        fontSize: 16,
        color: Theme.colors.gray[400],
        textAlign: 'center',
        lineHeight: 24,
    },
    form: {
        marginTop: Theme.spacing.l,
    },
    row: {
        flexDirection: 'row',
    },
    inputContainer: {
        marginBottom: Theme.spacing.l,
    },
    label: {
        color: Theme.colors.gray[300],
        fontSize: 14,
        fontWeight: '600',
        marginBottom: Theme.spacing.s,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Theme.colors.surface,
        borderRadius: Theme.borderRadius.m,
        borderWidth: 1,
        borderColor: Theme.colors.gray[700],
    },
    input: {
        flex: 1,
        color: Theme.colors.white,
        padding: Theme.spacing.m,
        fontSize: 16,
    },
    suffix: {
        color: Theme.colors.gray[500],
        paddingRight: Theme.spacing.m,
        fontWeight: '600',
    },
    goalsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Theme.spacing.m,
    },
    goalCard: {
        width: '47%',
        backgroundColor: Theme.colors.surface,
        borderRadius: Theme.borderRadius.m,
        padding: Theme.spacing.m,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: Theme.colors.gray[700],
        gap: Theme.spacing.s,
    },
    goalCardActive: {
        borderColor: Theme.colors.primary,
        backgroundColor: 'rgba(212, 255, 0, 0.05)',
    },
    goalLabel: {
        color: Theme.colors.gray[400],
        fontSize: 14,
        fontWeight: '600',
    },
    goalLabelActive: {
        color: Theme.colors.white,
    },
    footer: {
        marginTop: Theme.spacing.xl * 2,
    },
});
