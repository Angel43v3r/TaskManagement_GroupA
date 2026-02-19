import { createContext, useContext, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import { useTasks } from '../../context/TasksContext';
import TaskCard from '../task-card/TaskCard';

const BoardDndContext = createContext(null);

export function BoardDndProvider({ children }) {
  const { tasks, moveTask } = useTasks();
  const [activeTask, setActiveTask] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event) => {
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const taskId = active.id;
    const newStatus = over.id;

    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    if (task.status !== newStatus) {
      moveTask(taskId, newStatus);
    }
  };

  const handleDragOver = (event) => {
    // Currently not needed, but available for future enhancements
  };

  return (
    <BoardDndContext.Provider value={{ activeTask }}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
      >
        {children}
        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} isDragging /> : null}
        </DragOverlay>
      </DndContext>
    </BoardDndContext.Provider>
  );
}

export const useBoardDnd = () => useContext(BoardDndContext);