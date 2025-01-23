"use client"


import React, { useEffect } from 'react';
import { useTasks } from '../context/TaskContext'

const TaskList: React.FC = () => {
  const { state, fetchTasks, addTask, updateTask,deleteTask } = useTasks();
  const { tasks, loading, error } = state;
  const newTaskRef = React.useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async () => {
    console.log(newTaskRef.current?.value);
    if (newTaskRef.current?.value)
    {
      await addTask(newTaskRef.current?.value);
    }

  };

  const handleUpdateTask = async (task: { id: number; name: string }) => {
    await updateTask({ name: task.name, id: task.id });
  };

  const handleDeleteTask = async (id: number) => {
      await deleteTask(id);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Task List</h1>
      <input
        type="text"
        ref={newTaskRef}
        placeholder="Enter new task"
      />
      <button onClick={handleAddTask}>Add Task</button>

      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {task.name}
            <button onClick={() => handleUpdateTask(task)}>Update</button>
            <button onClick={()=>handleDeleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
