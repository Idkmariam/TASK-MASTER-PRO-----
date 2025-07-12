 
export type RootStackParamList = {
  Home: undefined;
  TaskDetails: {
    id: string;
    title: string;
    completed: boolean;
    startDate?: string;
    endDate?: string;
    description?: string;
    subtasks?: { id: string; text: string; done: boolean }[];
  };
  Calendar: undefined;
};
