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

// Provider component that wraps the board w/ drag-n-drop functionality
export function BoardDndProvider({ children }) {
  const { tasks, moveTask } = useTasks();
  const [activeTask, setActiveTask] = useState(null);

  // Configures sensors w/ activation constraint to prevent accidental drags
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Handler when drag starts, stores active task for overlay
  const handleDragStart = (event) => {
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id);
    setActiveTask(task || null);
  };

  // Handler when drag ends, updates task status if dropped in valid column
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

  // Handler during drag (could be used for hover effects)
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
        {/* Renders the dragged card outside normal flow */}
        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} isDragging /> : null}
        </DragOverlay>
      </DndContext>
    </BoardDndContext.Provider>
  );
}

export const useBoardDnd = () => useContext(BoardDndContext);
