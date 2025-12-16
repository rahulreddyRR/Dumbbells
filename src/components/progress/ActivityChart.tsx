import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Theme } from '../../theme';

const CHART_HEIGHT = 150;

export interface ChartDataPoint {
    label: string;
    value: number;
    fullDate: string;
    dateObj: Date;
}

interface ActivityChartProps {
    data: { bars: ChartDataPoint[]; max: number };
    period: 'week' | 'month';
    onPeriodChange: (period: 'week' | 'month') => void;
    selectedDate: Date;
    onDateSelect: (date: Date) => void;
}

export const ActivityChart = memo(({ data, period, onPeriodChange, selectedDate, onDateSelect }: ActivityChartProps) => {
    return (
        <View style={styles.chartCard}>
            <View style={styles.chartHeaderRow}>
                <Text style={styles.sectionHeader}>Activity (Minutes)</Text>
                <View style={styles.segmentControl}>
                    <TouchableOpacity
                        style={[styles.segmentBtn, period === 'week' && styles.segmentBtnActive]}
                        onPress={() => onPeriodChange('week')}
                    >
                        <Text style={[styles.segmentText, period === 'week' && styles.segmentTextActive]}>Week</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.segmentBtn, period === 'month' && styles.segmentBtnActive]}
                        onPress={() => onPeriodChange('month')}
                    >
                        <Text style={[styles.segmentText, period === 'month' && styles.segmentTextActive]}>Month</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.chartContainer}>
                {data.bars.map((bar, index) => {
                    const isBarSelected = bar.fullDate === selectedDate.toISOString().split('T')[0];
                    // In monthly view, bars are thinner
                    const barWidth = period === 'week' ? 12 : 6;
                    const barMargin = period === 'week' ? 0 : 2;

                    return (
                        <TouchableOpacity
                            key={index}
                            style={[styles.barColumn, { marginHorizontal: barMargin }]}
                            onPress={() => onDateSelect(bar.dateObj)}
                        >
                            <View style={[styles.barTrack, { width: barWidth }]}>
                                <View
                                    style={[
                                        styles.barFill,
                                        {
                                            height: `${Math.min((bar.value / data.max) * 100, 100)}%`,
                                            backgroundColor: isBarSelected ? Theme.colors.primary : Theme.colors.primary + '80'
                                        }
                                    ]}
                                />
                            </View>
                            <Text style={[styles.barLabel, isBarSelected && { color: Theme.colors.white }]}>{bar.label}</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    chartCard: {
        backgroundColor: Theme.colors.surface,
        borderRadius: Theme.borderRadius.l,
        padding: Theme.spacing.m,
        marginBottom: Theme.spacing.l,
    },
    chartHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Theme.spacing.m,
    },
    sectionHeader: {
        ...Theme.textVariants.subheader,
        fontSize: 14,
        color: Theme.colors.gray[300],
    },
    segmentControl: {
        flexDirection: 'row',
        backgroundColor: Theme.colors.background,
        borderRadius: 8,
        padding: 2,
    },
    segmentBtn: {
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderRadius: 6,
    },
    segmentBtnActive: {
        backgroundColor: Theme.colors.gray[700],
    },
    segmentText: {
        color: Theme.colors.gray[500],
        fontSize: 12,
        fontWeight: '600',
    },
    segmentTextActive: {
        color: Theme.colors.white,
    },
    chartContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: CHART_HEIGHT,
        alignItems: 'flex-end',
        paddingTop: 10,
    },
    barColumn: {
        alignItems: 'center',
        flex: 1,
    },
    barTrack: {
        height: '85%',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 6,
        justifyContent: 'flex-end',
        marginBottom: 8,
    },
    barFill: {
        width: '100%',
        backgroundColor: Theme.colors.primary,
        borderRadius: 6,
        minHeight: 4,
    },
    barLabel: {
        color: Theme.colors.gray[400],
        fontSize: 10,
    },
});
