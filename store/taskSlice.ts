import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Task = {
  id: string;
  title: string;
  completed: boolean;
  startDate?: string;
  endDate?: string;
  description?: string;
  dueDate?: string;  
  subtasks?: { id: string; text: string; done: boolean }[];
};


interface TaskState {
  tasks: Task[];
}

const initialState: TaskState = {
  tasks: [],
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<string>) => {
      state.tasks.push({
        id: Date.now().toString(),
        title: action.payload,
        completed: false,
        subtasks: [], // default value
      });
    },

    toggleTask: (state, action: PayloadAction<string>) => {
      const task = state.tasks.find((t) => t.id === action.payload);
      if (task) task.completed = !task.completed;
    },

    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter((t) => t.id !== action.payload);
    },

    updateTaskDetails: (
      state,
      action: PayloadAction<{
        id: string;
        startDate?: string;
        endDate?: string;
        description?: string;
      }>
    ) => {
      const task = state.tasks.find((t) => t.id === action.payload.id);
      if (task) {
        task.startDate = action.payload.startDate ?? task.startDate;
        task.endDate = action.payload.endDate ?? task.endDate;
        task.description = action.payload.description ?? task.description;
      }
    },

    addSubtask: (
      state,
      action: PayloadAction<{
        taskId: string;
        subtask: { id: string; text: string; done: boolean };
      }>
    ) => {
      const task = state.tasks.find((t) => t.id === action.payload.taskId);
      if (task) {
        task.subtasks = task.subtasks || [];
        task.subtasks.push(action.payload.subtask);
      }
    },

    toggleSubtask: (
      state,
      action: PayloadAction<{ taskId: string; subtaskId: string }>
    ) => {
      const task = state.tasks.find((t) => t.id === action.payload.taskId);
      if (task?.subtasks) {
        const sub = task.subtasks.find((s) => s.id === action.payload.subtaskId);
        if (sub) sub.done = !sub.done;
      }
    },

    deleteSubtask: (
      state,
      action: PayloadAction<{ taskId: string; subtaskId: string }>
    ) => {
      const { taskId, subtaskId } = action.payload;
      const task = state.tasks.find((t) => t.id === taskId);
      if (task?.subtasks) {
        task.subtasks = task.subtasks.filter((sub) => sub.id !== subtaskId);
      }
    },
  },
});

export const {
  addTask,
  deleteTask,
  toggleTask,
  updateTaskDetails,
  addSubtask,
  toggleSubtask,
  deleteSubtask,
} = taskSlice.actions;

export default taskSlice.reducer;
