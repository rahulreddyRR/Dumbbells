import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Theme } from '../../theme';

interface SettingSectionProps {
    title: string;
    children: React.ReactNode;
}

export const SettingSection: React.FC<SettingSectionProps> = ({ title, children }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.content}>{children}</View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: Theme.spacing.l,
    },
    title: {
        color: Theme.colors.white,
        fontSize: 14,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: Theme.spacing.s,
        paddingHorizontal: Theme.spacing.m,
    },
    content: {
        backgroundColor: Theme.colors.surface,
        borderRadius: Theme.borderRadius.l,
        overflow: 'hidden',
    },
});
