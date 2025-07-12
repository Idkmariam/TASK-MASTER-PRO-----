import React, { useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addTask, deleteTask, toggleTask } from '../store/taskSlice';
import { RootState } from '../store';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const dispatch = useDispatch();
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const [input, setInput] = useState('');

  // Set screen title only (remove calendar button)
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'My Tasks',
      headerTitleAlign: 'center',
    });
  }, [navigation]);

  const handleAdd = () => {
    if (input.trim()) {
      dispatch(addTask(input));
      setInput('');
    }
  };

  return (
    <View style={styles.container}>
      {/* Task Input */}
      <View style={styles.inputCard}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Enter a new task"
          placeholderTextColor="#999"
        />
        <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
          <Text style={styles.addBtnText}>Add</Text>
        </TouchableOpacity>
      </View>

      {/* Task List */}
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <LinearGradient
            colors={['#d1c4e9', '#bbdefb']}
            style={styles.taskCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.taskRow}>
              <TouchableOpacity onPress={() => dispatch(toggleTask(item.id))}>
                <Ionicons
                  name={item.completed ? 'checkmark-circle' : 'ellipse-outline'}
                  size={24}
                  color={item.completed ? 'green' : 'gray'}
                  style={{ marginRight: 10 }}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.taskTextWrapper}
                onPress={() => navigation.navigate('TaskDetails', item)}
              >
                <Text style={[styles.taskText, item.completed && styles.completed]}>
                  {item.title}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => dispatch(deleteTask(item.id))}>
                <Ionicons name="trash" size={22} color="red" />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  inputCard: {
    backgroundColor: '#f3e5f5',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    elevation: Platform.OS === 'android' ? 3 : 0,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 10,
    color: '#333',
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  addBtn: {
    backgroundColor: '#6200EE',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 10,
  },
  addBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  taskCard: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: Platform.OS === 'android' ? 2 : 0,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskTextWrapper: {
    flex: 1,
    marginRight: 8,
  },
  taskText: {
    fontSize: 16,
    color: '#222',
  },
  completed: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
});
