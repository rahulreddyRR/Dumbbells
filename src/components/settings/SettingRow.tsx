import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Theme } from '../../theme';

interface SettingRowProps {
    icon?: string;
    label: string;
    value?: string;
    onPress?: () => void;
    showChevron?: boolean;
    isSwitch?: boolean;
    switchValue?: boolean;
    onSwitchChange?: (value: boolean) => void;
    isLast?: boolean;
}

export const SettingRow: React.FC<SettingRowProps> = ({
    icon,
    label,
    value,
    onPress,
    showChevron = true,
    isSwitch = false,
    switchValue = false,
    onSwitchChange,
    isLast = false,
}) => {
    const content = (
        <View style={[styles.container, !isLast && styles.borderBottom]}>
            <View style={styles.left}>
                {icon && (
                    <Ionicons name={icon as any} size={22} color={Theme.colors.primary} style={styles.icon} />
                )}
                <Text style={styles.label}>{label}</Text>
            </View>
            <View style={styles.right}>
                {value && <Text style={styles.value}>{value}</Text>}
                {isSwitch && onSwitchChange && (
                    <Switch
                        value={switchValue}
                        onValueChange={onSwitchChange}
                        trackColor={{ false: Theme.colors.gray[700], true: Theme.colors.primary }}
                        thumbColor={Theme.colors.white}
                    />
                )}
                {!isSwitch && showChevron && (
                    <Ionicons name="chevron-forward" size={20} color={Theme.colors.gray[500]} />
                )}
            </View>
        </View>
    );

    if (onPress && !isSwitch) {
        return (
            <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
                {content}
            </TouchableOpacity>
        );
    }

    return content;
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: Theme.spacing.m,
        paddingHorizontal: Theme.spacing.m,
        minHeight: 56,
    },
    borderBottom: {
        borderBottomWidth: 1,
        borderBottomColor: Theme.colors.gray[800],
    },
    left: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    icon: {
        marginRight: Theme.spacing.m,
    },
    label: {
        color: Theme.colors.white,
        fontSize: 16,
        flex: 1,
    },
    right: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    value: {
        color: Theme.colors.gray[400],
        fontSize: 15,
    },
});
