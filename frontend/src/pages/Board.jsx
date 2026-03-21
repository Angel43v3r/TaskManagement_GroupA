import {
  Add as AddIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { Link, useOutletContext } from 'react-router';
import IssueCard from '../components/issue-card/IssueCard.jsx';
import { useBoard } from '../context/BoardContext.jsx';
import { useIssues } from '../context/IssuesContext.jsx';
import CreateIssueForm from '../components/IssueForm/CreateIssueForm.jsx';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { BoardDndProvider } from '../context/BoardDndContext.jsx';

// Column Component
function Column({ column, issues }) {
  const columnIssues = issues.filter((issue) => issue.status === column.id);
  const issueCount = columnIssues.length;
  const issueIds = columnIssues.map((issue) => issue.id);

  // Sets up droppable w/ column id as the drop zone identifier
  const { isOver, setNodeRef } = useDroppable({
    id: column.id,
  });

  return (
    <Box
      sx={{
        flex: 1,
        minWidth: 280,
        maxWidth: 320,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Column Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
          px: 0.5,
          py: 0.5,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body1" sx={{ fontWeight: 500, color: '#333' }}>
            {column.title}
          </Typography>
          <Typography variant="caption" sx={{ color: '#888' }}>
            {issueCount}
          </Typography>
        </Box>
        <IconButton size="small" sx={{ color: '#999' }}>
          <AddIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>

      {/* Issue Cards */}
      <Box
        ref={setNodeRef}
        sx={{
          flex: 1,
          bgcolor: isOver ? '#e3f2fd' : '#f5f5f5',
          borderRadius: 1,
          p: 1.5,
          minHeight: 200,
          transition: 'background-color 0.2s ease',
          border: isOver ? '2px dashed #2196f3' : '2px dashed transparent',
        }}
      >
        <SortableContext
          items={issueIds}
          strategy={verticalListSortingStrategy}
        >
          {columnIssues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </SortableContext>
      </Box>
    </Box>
  );
}

export default function Board() {
  const { currentBoard } = useBoard();
  const { issues, fetchIssues } = useIssues();
  const [openCreateIssue, setOpenCreateIssue] = useState(false);
  const { project } = useOutletContext();
  const [searchQuery, setSearchQuery] = useState('');

  const handleIssueCreation = () => {
    setOpenCreateIssue(false);
    fetchIssues();
  };

  const filteredIssues = issues.filter((issue) =>
    issue.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = currentBoard?.columns || [
    { id: 'backlog', title: 'Backlog' },
    { id: 'in_progress', title: 'In Progress' },
    { id: 'reviewed', title: 'In Review' },
    { id: 'done', title: 'Done' },
  ];

  if (!currentBoard) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5" color="error" gutterBottom>
          Board Not Found
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          {"We couldn't find a board with that ID in the "}
          <strong>{project?.name}</strong> project.
        </Typography>
        <Button
          variant="contained"
          component={Link}
          to={`/projects/${project?.id}/board`}
        >
          Back to Boards List
        </Button>
      </Box>
    );
  }

  return (
    <BoardDndProvider>
      <Box sx={{ height: '100%' }}>
        <Box sx={{ maxWidth: 1400, mx: 'auto', px: 3, py: 3 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              mb: 3,
            }}
          >
            <Box>
              <Typography
                variant="h5"
                sx={{ fontWeight: 400, color: '#333', mb: 0.5 }}
              >
                <Link
                  to={`/projects/${project.id}`}
                  style={{ color: '#a3a3a3' }}
                >
                  {project?.name}
                </Link>{' '}
                / {currentBoard?.title}
              </Typography>
              <Typography variant="body2" sx={{ color: '#888' }}>
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <TextField
                placeholder="Search issues..."
                size="small"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: '#999' }} />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{
                  width: 220,
                  '& .MuiOutlinedInput-root': { bgcolor: 'white' },
                }}
              />
              <Button variant="outlined" startIcon={<FilterIcon />}>
                Filter
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                sx={{ bgcolor: '#333' }}
                onClick={() => setOpenCreateIssue(true)}
              >
                Create Issue
              </Button>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2 }}>
            {columns.map((column) => (
              <Column key={column.id} column={column} issues={filteredIssues} />
            ))}
          </Box>
        </Box>
        <Dialog
          open={openCreateIssue}
          onClose={() => setOpenCreateIssue(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Create Issue</DialogTitle>
          <DialogContent dividers>
            <CreateIssueForm onIssueCreation={handleIssueCreation} />
          </DialogContent>
        </Dialog>
      </Box>
    </BoardDndProvider>
  );
}
