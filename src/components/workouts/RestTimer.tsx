import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Dimensions } from 'react-native';
import { Theme } from '../../theme';
import { Button } from '../common/Button';

interface RestTimerProps {
    isVisible: boolean;
    targetTime: string; // ISO string
    onComplete: () => void;
    onAdd: (seconds: number) => void;
    onSkip: () => void;
}

export const RestTimer: React.FC<RestTimerProps> = ({ isVisible, targetTime, onComplete, onAdd, onSkip }) => {
    const [secondsRemaining, setSecondsRemaining] = useState(0);

    useEffect(() => {
        if (!isVisible || !targetTime) return;

        const interval = setInterval(() => {
            const now = Date.now();
            const end = new Date(targetTime).getTime();
            const diff = Math.ceil((end - now) / 1000);

            if (diff <= 0) {
                clearInterval(interval);
                setSecondsRemaining(0);
                onComplete();
            } else {
                setSecondsRemaining(diff);
            }
        }, 1000);

        // Initial calculation
        const initialDiff = Math.ceil((new Date(targetTime).getTime() - Date.now()) / 1000);
        setSecondsRemaining(Math.max(0, initialDiff));

        return () => clearInterval(interval);
    }, [isVisible, targetTime, onComplete]);

    const formatTime = (totalSeconds: number) => {
        const m = Math.floor(totalSeconds / 60);
        const s = totalSeconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    if (!isVisible) return null;

    return (
        <Modal visible={isVisible} transparent animationType="fade">
            <View style={styles.container}>
                <View style={styles.card}>
                    <Text style={styles.title}>Rest</Text>

                    <View style={styles.timerContainer}>
                        <Text style={styles.timerText}>{formatTime(secondsRemaining)}</Text>
                    </View>

                    <View style={styles.controls}>
                        <TouchableOpacity style={styles.adjustButton} onPress={() => onAdd(-10)}>
                            <Text style={styles.adjustText}>-10s</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.adjustButton} onPress={() => onAdd(10)}>
                            <Text style={styles.adjustText}>+10s</Text>
                        </TouchableOpacity>
                    </View>

                    <Button
                        title="Skip Rest"
                        onPress={onSkip}
                        variant="secondary"
                        style={styles.skipButton}
                    />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    card: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: Theme.colors.surface,
        borderRadius: 20,
        padding: 30,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Theme.colors.border,
    },
    title: {
        color: Theme.colors.textSecondary,
        fontSize: 18,
        marginBottom: 20,
        letterSpacing: 2,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    timerContainer: {
        width: 180,
        height: 180,
        borderRadius: 90,
        borderWidth: 8,
        borderColor: Theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        backgroundColor: 'rgba(212, 255, 0, 0.05)',
    },
    timerText: {
        color: Theme.colors.white,
        fontSize: 48,
        fontWeight: 'bold',
        fontVariant: ['tabular-nums'],
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
        gap: 20,
    },
    adjustButton: {
        backgroundColor: Theme.colors.background,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: Theme.colors.border,
    },
    adjustText: {
        color: Theme.colors.white,
        fontWeight: '600',
        fontSize: 16,
    },
    skipButton: {
        width: '100%',
    }
});
