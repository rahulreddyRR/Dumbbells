import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Dimensions } from 'react-native';
import { Theme } from '../../theme';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

interface ActionButton {
    text: string;
    onPress: () => void;
    style?: 'default' | 'cancel' | 'destructive';
}

interface ConfirmationModalProps {
    visible: boolean;
    title: string;
    message: string;
    buttons: ActionButton[];
    onCancel?: () => void; // Optional simpler cancel handler
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    visible,
    title,
    message,
    buttons,
    onCancel
}) => {
    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={onCancel}
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    {/* Icon */}
                    <View style={styles.iconContainer}>
                        <Ionicons name="alert-circle" size={40} color={Theme.colors.primary} />
                    </View>

                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>

                    <View style={styles.buttonContainer}>
                        {buttons.map((btn, index) => {
                            const isDestructive = btn.style === 'destructive';
                            const isCancel = btn.style === 'cancel';

                            return (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.button,
                                        isDestructive && styles.destructiveButton,
                                        isCancel && styles.cancelButton,
                                        !isDestructive && !isCancel && styles.primaryButton
                                    ]}
                                    onPress={btn.onPress}
                                >
                                    <Text style={[
                                        styles.buttonText,
                                        isDestructive && styles.destructiveButtonText,
                                        isCancel && styles.cancelButtonText,
                                        !isDestructive && !isCancel && styles.primaryButtonText
                                    ]}>
                                        {btn.text.toUpperCase()}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.85)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: Theme.spacing.l,
    },
    container: {
        width: Math.min(width - 40, 340),
        backgroundColor: Theme.colors.surface,
        borderRadius: Theme.borderRadius.xl,
        padding: Theme.spacing.xl,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Theme.colors.gray[700],
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 10,
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'rgba(212, 255, 0, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Theme.spacing.l,
        borderWidth: 1,
        borderColor: 'rgba(212, 255, 0, 0.2)',
    },
    title: {
        color: Theme.colors.white,
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: Theme.spacing.s,
        textAlign: 'center',
    },
    message: {
        color: Theme.colors.gray[400],
        fontSize: 15,
        textAlign: 'center',
        marginBottom: Theme.spacing.xl,
        lineHeight: 22,
    },
    buttonContainer: {
        width: '100%',
        gap: Theme.spacing.m,
    },
    button: {
        width: '100%',
        paddingVertical: Theme.spacing.m,
        borderRadius: Theme.borderRadius.l,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 14,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    primaryButton: {
        backgroundColor: Theme.colors.primary,
    },
    primaryButtonText: {
        color: Theme.colors.background,
        fontWeight: 'bold',
        fontSize: 14,
        letterSpacing: 1,
    },
    destructiveButton: {
        backgroundColor: 'rgba(255, 69, 58, 0.15)',
        borderWidth: 1,
        borderColor: 'rgba(255, 69, 58, 0.3)',
    },
    destructiveButtonText: {
        color: Theme.colors.error || '#FF453A',
        fontWeight: 'bold',
        fontSize: 14,
        letterSpacing: 1,
    },
    cancelButton: {
        backgroundColor: 'transparent',
        paddingVertical: Theme.spacing.s,
    },
    cancelButtonText: {
        color: Theme.colors.gray[400],
        fontWeight: '600',
        fontSize: 14,
        letterSpacing: 1,
    },
});
