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
  const { tasks, moveTask, reorderTasks } = useTasks();
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

  // Handler when drag ends, updates task status or reorders within column
  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // Finds the dragged task
    const activeTask = tasks.find((t) => t.id === activeId);
    if (!activeTask) return;

    // Checks if dropped over a column or another task
    const overTask = tasks.find((t) => t.id === overId);

    if (overTask) {
      // Dropped over another task
      if (activeTask.status === overTask.status) {
        // Same column: reorder
        const columnTasks = tasks.filter((t) => t.status === activeTask.status);
        const oldIndex = columnTasks.findIndex((t) => t.id === activeId);
        const newIndex = columnTasks.findIndex((t) => t.id === overId);

        if (oldIndex !== newIndex) {
          reorderTasks(activeTask.status, oldIndex, newIndex);
        }
      } else {
        // Different column: move to new status
        moveTask(activeId, overTask.status);
      }
    } else {
      // Dropped over a column (empty area)
      const newStatus = overId;
      if (activeTask.status !== newStatus) {
        moveTask(activeId, newStatus);
      }
    }
  };

  return (
    <BoardDndContext.Provider value={{ activeTask }}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
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

// Hood to access DnD context state
export const useBoardDnd = () => useContext(BoardDndContext);
