import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { colors } from '../theme/colors';

export default function CalendarScreen() {
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const [selectedDate, setSelectedDate] = useState('');

  const markedDates = tasks.reduce((acc, task) => {
    if (task.endDate) {
      const date = task.endDate.split('T')[0];
      acc[date] = {
        marked: true,
        dotColor: task.completed ? 'green' : colors.accent,
      };
    }
    return acc;
  }, {} as Record<string, any>);

  const selectedTasks = tasks.filter(
    (task) => task.endDate?.startsWith(selectedDate)
  );

  return (
    <View style={styles.container}>
      <Calendar
        markedDates={{
          ...markedDates,
          ...(selectedDate && {
            [selectedDate]: {
              ...(markedDates[selectedDate] || {}),
              selected: true,
              selectedColor: colors.secondary,
            },
          }),
        }}
        onDayPress={(day) => setSelectedDate(day.dateString)}
        theme={{
          selectedDayBackgroundColor: colors.primary,
          todayTextColor: colors.primary,
          arrowColor: colors.primary,
        }}
      />

      <Text style={styles.heading}>
        {selectedDate ? `Tasks on ${selectedDate}` : 'Select a date'}
      </Text>

      <FlatList
        data={selectedTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text style={styles.taskItem}>• {item.title}</Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.background,
  },
  heading: {
    fontWeight: 'bold',
    fontSize: 18,
    marginVertical: 10,
    color: colors.text,
  },
  taskItem: {
    fontSize: 16,
    paddingVertical: 6,
    color: colors.text,
  },
});
