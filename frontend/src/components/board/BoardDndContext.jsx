import { createContext, useContext, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  rectIntersection,
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

    if (activeId === overId) return;

    const activeIssue = issues.find((i) => i.id === activeId);
    if (!activeIssue) return;

    const overIssue = issues.find((i) => i.id === overId);

    if (overIssue) {
      // Dropped over another issue
      if (activeIssue.status === overIssue.status) {
        // Same column: reorder within column
        const columnIssues = issues.filter(
          (i) => i.status === activeIssue.status
        );
        const oldIndex = columnIssues.findIndex((i) => i.id === activeId);
        const newIndex = columnIssues.findIndex((i) => i.id === overId);

        if (oldIndex !== newIndex) {
          reorderIssues(activeIssue.status, oldIndex, newIndex);
        }
      } else {
        // Different column: move and insert at specific position
        const targetColumnIssues = issues.filter(
          (i) => i.status === overIssue.status
        );
        const targetIndex = targetColumnIssues.findIndex(
          (i) => i.id === overId
        );

        moveIssue(activeId, overIssue.status, targetIndex);
      }
    } else {
      // Dropped over empty column area (overId is column id)
      const isColumnId = [
        'backlog',
        'in_progress',
        'reviewed',
        'done',
        'todo',
        'in_review',
      ].includes(overId);
      if (isColumnId && activeIssue.status !== overId) {
        moveIssue(activeId, overId);
      }
    }
  };

  return (
    <BoardDndContext.Provider value={{ activeIssue }}>
      <DndContext
        sensors={sensors}
        collisionDetection={rectIntersection}
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
