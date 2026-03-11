import { createContext, useCallback, useEffect, useState } from 'react';
import { issuesApi } from '../api/issuesApi';
import { useProject } from './ProjectContext';
import { useBoard } from './BoardContext';
import { useContext } from 'react';
import { arrayMove } from '@dnd-kit/sortable';

const IssuesContext = createContext(null);

export function IssuesProvider({ children }) {
  const { currentProject } = useProject();
  const { currentBoard } = useBoard();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updatingIds, setUpdatingIds] = useState(new Set());

  const fetchIssues = useCallback(async () => {
    if (!currentProject?.id || !currentBoard?.id) {
      setIssues([]);
      return;
    }

    setLoading(true);
    try {
      const { data } = await issuesApi.getAll(currentBoard.id);
      setIssues(data.issues);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [currentProject?.id, currentBoard?.id]);

  const updateIssue = useCallback(
    async (issueId, changes) => {
      if (!currentProject?.id || !currentBoard?.id) return;

      setUpdatingIds((prev) => new Set([...prev, issueId]));
      try {
        const { data } = await issuesApi.update(issueId, changes);

        if (data && data.issue) {
          setIssues((prev) =>
            prev.map((t) => (t.id === issueId ? data.issue : t))
          );
        } else {
          await fetchIssues();
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setUpdatingIds(
          (prev) => new Set([...prev].filter((id) => id !== issueId))
        );
      }
    },
    [currentProject?.id, currentBoard?.id, fetchIssues]
  );

  // For drag-n-drop status changes w/ optimistic update
  const moveIssue = useCallback(
    async (issueId, newStatus) => {
      const previousIssues = [...issues];

      // Optimistic update. Immediately updates UI
      setIssues((prev) =>
        prev.map((issue) =>
          issue.id === issueId ? { ...issue, status: newStatus } : issue
        )
      );

      // Skips API call if using mock data
      if (!currentProject?.id || !currentBoard?.id) {
        return;
      }

      // Persist to backend
      setUpdatingIds((prev) => new Set([...prev, issueId]));
      try {
        await issuesApi.update(issueId, { status: newStatus });
      } catch (err) {
        // Rollback on error
        setIssues(previousIssues);
        setError(err.message);
      } finally {
        setUpdatingIds(
          (prev) => new Set([...prev].filter((id) => id !== issueId))
        );
      }
    },
    [issues, currentProject?.id, currentBoard?.id]
  );

  // For within-column reordering
  const reorderIssues = useCallback(
    async (columnId, oldIndex, newIndex) => {
      // Gets issues in this column
      const columnIssues = issues.filter((t) => t.status === columnId);
      const otherIssues = issues.filter((t) => t.status !== columnId);
      // Reorders the column issues
      const reorderedColumnIssues = arrayMove(columnIssues, oldIndex, newIndex);
      // Combines them back together
      const newIssues = [...otherIssues, ...reorderedColumnIssues];
      // Stores previous state for rollback
      const previousIssues = [...issues];
      // Optimistic update
      setIssues(newIssues);

      // Skips API call if using mock data
      if (!currentProject?.id || !currentBoard?.id) {
        return;
      }
      // Persist to backend (would need API endpoint for bulk order update)
      try {
        // ...
      } catch (err) {
        setIssues(previousIssues);
        setError(err.message);
      }
    },
    [issues, currentProject?.id, currentBoard?.id]
  );

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  return (
    <IssuesContext.Provider
      value={{
        issues,
        loading,
        error,
        fetchIssues,
        updateIssue,
        updatingIds,
        moveIssue,
        reorderIssues,
      }}
    >
      {children}
    </IssuesContext.Provider>
  );
}

export const useIssues = () => useContext(IssuesContext);
