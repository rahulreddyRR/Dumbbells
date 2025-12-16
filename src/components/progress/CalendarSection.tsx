import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { Theme } from '../../theme';

interface CalendarSectionProps {
    selectedDate: Date;
    onDateSelect: (date: Date) => void;
    markedDates: any;
}

export const CalendarSection = memo(({ selectedDate, onDateSelect, markedDates }: CalendarSectionProps) => {
    const selectedStr = selectedDate.toISOString().split('T')[0];

    // Merge selection with marks
    const finalMarked = { ...markedDates };
    if (finalMarked[selectedStr]) {
        finalMarked[selectedStr] = {
            ...finalMarked[selectedStr],
            selected: true,
            selectedColor: Theme.colors.primary,
            selectedTextColor: 'black'
        };
    } else {
        finalMarked[selectedStr] = {
            selected: true,
            selectedColor: Theme.colors.primary,
            selectedTextColor: 'black'
        };
    }

    // Ensure other marks have dot color if untoched
    Object.keys(finalMarked).forEach(key => {
        if (finalMarked[key].marked && !finalMarked[key].dotColor) {
            finalMarked[key].dotColor = Theme.colors.primary;
        }
    });

    return (
        <View style={styles.calendarContainer}>
            <Calendar
                current={selectedStr}
                onDayPress={(day: DateData) => {
                    onDateSelect(new Date(day.timestamp));
                }}
                markedDates={finalMarked}
                theme={{
                    backgroundColor: Theme.colors.surface,
                    calendarBackground: Theme.colors.surface,
                    textSectionTitleColor: Theme.colors.gray[500],
                    selectedDayBackgroundColor: Theme.colors.primary,
                    selectedDayTextColor: Theme.colors.surface,
                    todayTextColor: Theme.colors.primary,
                    dayTextColor: Theme.colors.white,
                    textDisabledColor: Theme.colors.gray[700],
                    dotColor: Theme.colors.primary,
                    selectedDotColor: Theme.colors.surface,
                    arrowColor: Theme.colors.primary,
                    monthTextColor: Theme.colors.white,
                    indicatorColor: Theme.colors.primary,
                    textDayFontWeight: '300',
                    textMonthFontWeight: 'bold',
                    textDayHeaderFontWeight: '300',
                    textDayFontSize: 16,
                    textMonthFontSize: 16,
                    textDayHeaderFontSize: 14
                }}
                style={{ borderRadius: Theme.borderRadius.m }}
            />
        </View>
    );
});

const styles = StyleSheet.create({
    calendarContainer: {
        marginBottom: Theme.spacing.l,
        borderRadius: Theme.borderRadius.m,
        overflow: 'hidden',
    },
});
