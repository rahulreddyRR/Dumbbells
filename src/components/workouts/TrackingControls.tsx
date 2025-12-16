import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Theme } from '../../theme';
import { Button } from '../common/Button';

interface Props {
    onSkip: () => void;
    onDone: () => void;
}

export const TrackingControls = memo(({ onSkip, onDone }: Props) => {
    return (
        <View style={styles.actionButtons}>
            <Button
                title="Skip"
                onPress={onSkip}
                variant="secondary"
                style={styles.skipButton}
            />
            <Button
                title="Done"
                onPress={onDone}
                style={styles.doneButton}
            />
        </View>
    );
});

const styles = StyleSheet.create({
    actionButtons: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: Theme.spacing.m,
    },
    skipButton: {
        flex: 1,
    },
    doneButton: {
        flex: 2,
    },
});
