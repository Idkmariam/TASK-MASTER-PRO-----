 
import React, { useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  FlatList,
  Platform,
  Switch,
} from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { RootStackParamList } from '../navigation/types';
import {
  addSubtask,
  deleteSubtask,
  toggleSubtask,
  updateTaskDetails,
} from '../store/taskSlice';
import uuid from 'react-native-uuid';
import { RootState } from '../store';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import DateTimePicker from '@react-native-community/datetimepicker';
import { scheduleNotification } from '../utils/notifications';


// Define the route prop type
type TaskDetailsRouteProp = RouteProp<RootStackParamList, 'TaskDetails'>;

// Props from navigation
type Props = {
  route: TaskDetailsRouteProp;
};

export default function TaskDetailsScreen({ route }: Props) {
  const { id } = route.params;
  const task = useSelector((state: RootState) =>
    state.tasks.tasks.find((t) => t.id === id)
  );

  const dispatch = useDispatch();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    if (task?.title) {
      navigation.setOptions({ title: task.title });
    }
  }, [navigation, task?.title]);

  const [newSubtask, setNewSubtask] = useState('');
  const [dueDate, setDueDate] = useState<Date | undefined>(
    task?.endDate ? new Date(task.endDate) : undefined
  );
  const [showPicker, setShowPicker] = useState(false);
  const [remindMe, setRemindMe] = useState(true);

  if (!task) return <Text>Task not found</Text>;

  const { subtasks } = task;

  const handleAddSubtask = () => {
    if (newSubtask.trim()) {
      dispatch(
        addSubtask({
          taskId: id,
          subtask: {
            id: uuid.v4() as string,
            text: newSubtask,
            done: false,
          },
        })
      );
      setNewSubtask('');
    }
  };

  const handleDeleteSubtask = (subtaskId: string) => {
    dispatch(deleteSubtask({ taskId: id, subtaskId }));
  };

  const handleDateChange = (_: any, selectedDate?: Date) => {
    setShowPicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDueDate(selectedDate);

      dispatch(
        updateTaskDetails({
          id,
          endDate: selectedDate.toISOString(),
        })
      );

      if (remindMe) {
       scheduleNotification(
  selectedDate,                   // Date (first argument)
  `Reminder for "${task.title}"`, // string (title)
  'Your task is due soon!'        // string (body)
);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.subtaskHeader}>Due Date</Text>
      <Pressable style={styles.dateRow} onPress={() => setShowPicker(true)}>
        <Ionicons name="calendar-outline" size={20} color={colors.text} style={{ marginRight: 8 }} />
        <Text style={styles.dateText}>{dueDate ? dueDate.toDateString() : 'Pick a due date'}</Text>
      </Pressable>
      {showPicker && (
        <DateTimePicker
          value={dueDate || new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      <View style={styles.switchRow}>
        <Text style={styles.dateText}>Remind Me</Text>
        <Switch value={remindMe} onValueChange={setRemindMe} />
      </View>

      <Text style={styles.subtaskHeader}>Subtasks</Text>
      <FlatList
        data={subtasks || []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.subtaskRow}>
              <Pressable
                onPress={() =>
                  dispatch(toggleSubtask({ taskId: id, subtaskId: item.id }))
                }
                style={styles.iconButton}
              >
                <Ionicons
                  name={item.done ? 'checkmark-circle' : 'ellipse-outline'}
                  size={24}
                  color={item.done ? colors.accent : 'gray'}
                />
              </Pressable>
              <Text style={[styles.subtask, item.done && styles.subtaskDone]}>
                {item.text}
              </Text>
              <Pressable
                onPress={() => handleDeleteSubtask(item.id)}
                style={styles.iconButton}
              >
                <Ionicons name="trash-outline" size={22} color={colors.danger} />
              </Pressable>
            </View>
          </View>
        )}
      />

      <View style={[styles.card, { marginTop: 20 }]}>
        <TextInput
          placeholder="Add subtask"
          value={newSubtask}
          onChangeText={setNewSubtask}
          style={[styles.input, { backgroundColor: '#fff' }]}
        />
        <Pressable style={styles.addBtn} onPress={handleAddSubtask}>
          <Text style={styles.addBtnText}> Add Subtask</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: colors.background,
  },
  card: {
    backgroundColor: '#f3e5f5',
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 15,
  },
  subtaskHeader: {
    fontWeight: 'bold',
    fontSize: 20,
    color: colors.text,
    marginBottom: 10,
  },
  subtaskRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subtask: {
    flex: 1,
    fontSize: 18,
    color: colors.text,
    marginHorizontal: 8,
  },
  subtaskDone: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  iconButton: {
    padding: 5,
  },
  addBtn: {
    backgroundColor: colors.secondary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 6,
  },
  addBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  input: {
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  dateText: {
    fontSize: 16,
    color: colors.text,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
});
