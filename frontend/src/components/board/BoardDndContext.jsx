import { createContext, useContext, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import { useIssues } from '../../context/IssuesContext.jsx';
import IssueCard from '../issue-card/IssueCard.jsx';

const BoardDndContext = createContext(null);

// Provider component that wraps the board w/ drag-n-drop functionality
export function BoardDndProvider({ children }) {
  const { issues, moveIssue, reorderIssues } = useIssues();
  const [activeIssue, setActiveIssue] = useState(null);

  // Configures sensors w/ activation constraint to prevent accidental drags
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Handler when drag starts, stores active issue for overlay
  const handleDragStart = (event) => {
    const { active } = event;
    const issue = issues.find((t) => t.id === active.id);
    setActiveIssue(issue || null);
  };

  // Handler when drag ends, updates issue status or reorders within column
  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveIssue(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // Finds the dragged issue
    const activeIssue = issues.find((t) => t.id === activeId);
    if (!activeIssue) return;

    // Checks if dropped over a column or another issue
    const overIssue = issues.find((t) => t.id === overId);

    if (overIssue) {
      // Dropped over another issue
      if (activeIssue.status === overIssue.status) {
        // Same column: reorder
        const columnIssues = issues.filter(
          (t) => t.status === activeIssue.status
        );
        const oldIndex = columnIssues.findIndex((t) => t.id === activeId);
        const newIndex = columnIssues.findIndex((t) => t.id === overId);

        if (oldIndex !== newIndex) {
          reorderIssues(activeIssue.status, oldIndex, newIndex);
        }
      } else {
        // Different column: move to new status
        moveIssue(activeId, overIssue.status);
      }
    } else {
      // Dropped over a column (empty area)
      const newStatus = overId;
      if (activeIssue.status !== newStatus) {
        moveIssue(activeId, newStatus);
      }
    }
  };

  return (
    <BoardDndContext.Provider value={{ activeIssue }}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {children}
        {/* Renders the dragged card outside normal flow */}
        <DragOverlay>
          {activeIssue ? <IssueCard issue={activeIssue} isDragging /> : null}
        </DragOverlay>
      </DndContext>
    </BoardDndContext.Provider>
  );
}

// Hood to access DnD context state
export const useBoardDnd = () => useContext(BoardDndContext);
