"use client"

import React, { createContext, useReducer, useContext, ReactNode } from 'react';

type Task = {
  id: number;
  name: string;
};

type State = {
  tasks: Task[];
  loading: boolean;
  error: string | null;
};




type Action =
  | { type: 'FETCH_TASKS_REQUEST' }
  | { type: 'FETCH_TASKS_SUCCESS'; payload: Task[] }
  | { type: 'FETCH_TASKS_FAILURE'; payload: string }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: number };




const initialState: State = {
  tasks: [],
  loading: false,
  error: null,
};

type TaskContextType = {
  state: State;
  fetchTasks: () => Promise<void>;
  addTask: (name:string) => Promise<void>;
  updateTask: (task: Task) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
};

const TaskContext = createContext<TaskContextType>({
  state: initialState,
  fetchTasks: async () => {},
  addTask: async () => {},
  deleteTask: async () => {},
  updateTask: async () => {},

});

const taskReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'FETCH_TASKS_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_TASKS_SUCCESS': 
      return { ...state, loading: false, tasks: action.payload };
    case 'FETCH_TASKS_FAILURE':
      return { ...state, loading: false, error: action.payload };
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
      };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? action.payload : task
        ),
      };
    default:
      return state;
  }
};

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  const fetchTasks = async () => {
    dispatch({ type: 'FETCH_TASKS_REQUEST' });
    try {
      const response = await fetch('api/tasks');
      const data = await response.json();
      dispatch({ type: 'FETCH_TASKS_SUCCESS', payload: data });
    } catch (error: any) {
      dispatch({ type: 'FETCH_TASKS_FAILURE', payload: error.message });
    }
  };

  const addTask = async (name:string) => {
    console.log(name);
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({name}),
    });
    const newTask = await response.json();
    dispatch({ type: 'ADD_TASK', payload: newTask });
  };

  const deleteTask = async (id: number) => {
    await fetch('api/tasks', {
      method: 'DELETE',
      headers:{'Content-Type': 'application/json'},
      body: JSON.stringify({ id }),
    });
    dispatch({ type: 'DELETE_TASK', payload: id });
  }

  const updateTask = async (task: Task) => {
    const response = await fetch('api/tasks', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    const updatedTask = await response.json();
    console.log(updatedTask);
    dispatch({ type: 'UPDATE_TASK', payload: updatedTask });
  };

  const contextValue = React.useMemo(() => ({
    state,
    fetchTasks,
    addTask,
    updateTask,
    deleteTask
  }), [state, fetchTasks, addTask, updateTask, deleteTask]);

  return (
    <TaskContext.Provider value={contextValue}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};