import { createContext, useCallback, useEffect, useState } from 'react';
import { tasksApi } from '../api/tasksApi';
import { useProject } from './ProjectContext';
import { useBoard } from './BoardContext';
import { useContext } from 'react';
import { arrayMove } from '@dnd-kit/sortable'

const TasksContext = createContext(null);

export function TasksProvider({ children }) {
  const { currentProject } = useProject();
  const { currentBoard } = useBoard();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updatingIds, setUpdatingIds] = useState(new Set());

  const fetchTasks = useCallback(async () => {
    if (!currentProject?.id || !currentBoard?.id) {
      setTasks([]);
      return;
    }

    setLoading(true);
    try {
      const { data } = await tasksApi.getAll(
        currentProject.id,
        currentBoard.id
      );
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [currentProject?.id, currentBoard?.id]);

  const updateTask = useCallback(
    async (taskId, changes) => {
      if (!currentProject?.id || !currentBoard?.id) return;

      setUpdatingIds((prev) => new Set([...prev, taskId]));
      try {
        await tasksApi.update(
          currentProject.id,
          currentBoard.id,
          taskId,
          changes
        );
        await fetchTasks();
      } catch (err) {
        setError(err.message);
      } finally {
        setUpdatingIds(
          (prev) => new Set([...prev].filter((id) => id !== taskId))
        );
      }
    },
    [currentProject?.id, currentBoard?.id, fetchTasks]
  );

  // For drag-n-drop status changes w/ optimistic update
  const moveTask = useCallback(
    async (taskId, newStatus) => {
      const previousTasks = [...tasks];

      // Optimistic update. Immediately updates UI
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );

      // Skips API call if using mock data
      if (!currentProject?.id || !currentBoard?.id) {
        return;
      }

      // Persist to backend
      setUpdatingIds((prev) => new Set([...prev, taskId]));
      try {
        await tasksApi.update(currentProject.id, currentBoard.id, taskId, {
          status: newStatus,
        });
      } catch (err) {
        // Rollback on error
        setTasks(previousTasks);
        setError(err.message);
      } finally {
        setUpdatingIds(
          (prev) => new Set([...prev].filter((id) => id !== taskId))
        );
      }
    },
    [tasks, currentProject?.id, currentBoard?.id]
  );

  // For within-column reordering
  const reorderTasks = useCallback(
    async (columnId, oldIndex, newIndex) => {
      // Gets tasks in this column
      const columnTasks = tasks.filter((t) => t.status === columnId);
      const otherTasks = tasks.filter((t) => t.status !== columnId);
      // Reorders the column tasks
      const reorderedColumnTasks = arrayMove(columnTasks, oldIndex, newIndex);
      // Combines them back together
      const newTasks = [...otherTasks, ...reorderedColumnTasks];
      // Stores previous state for rollback
      const previousTasks = [...tasks];
      // Optimistic update
      setTasks(newTasks);

      // Skips API call if using mock data
      if (!currentProject?.id || !currentBoard?.id) {
        return;
      }
      // Persist to backend (would need API endpoint for bulk order update)
      try {
        // TODO : Implement API call to persist order
        // await tasksApi.updateOrder(currentProject.id, currentBoard.id, reorderedColumnTasks);
      } catch (err) {
        setTasks(previousTasks);
        setError(err.message);
      }
    },
    [tasks, currentProject?.id, currentBoard?.id]
  );

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <TasksContext.Provider
      value={{ tasks, loading, error, fetchTasks, updateTask, updatingIds, moveTask, reorderTasks }}
    >
      {children}
    </TasksContext.Provider>
  );
}

export const useTasks = () => useContext(TasksContext);
