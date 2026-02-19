import {
  Add as AddIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { Link, useOutletContext } from 'react-router';
import TaskCard from '../components/task-card/TaskCard.jsx';
import { useBoard } from '../context/BoardContext.jsx';
import { useTasks } from '../context/TasksContext.jsx';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  SortableList,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { BoardDndProvider } from '../components/board/BoardDndContext.jsx';

// Column Component
function Column({ column, tasks }) {
  const columnTasks = tasks.filter((task) => task.status === column.id);
  const taskCount = columnTasks.length;
  const taskIds = columnTasks.map((task) => task.id);

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
            {taskCount}
          </Typography>
        </Box>
        <IconButton size="small" sx={{ color: '#999' }}>
          <AddIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>

      {/* Task Cards */}
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
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {columnTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </SortableContext>
      </Box>
    </Box>
  );
}

function BoardContent() {
  const { currentBoard } = useBoard();
  const { tasks } = useTasks();
  const { project } = useOutletContext();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = currentBoard?.columns || [
    { id: 'todo', title: 'To Do' },
    { id: 'in-progress', title: 'In Progress' },
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
    <Box sx={{ height: '100%', bgcolor: '#fafafa' }}>
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
              variant="h4"
              sx={{ fontWeight: 400, color: '#333', mb: 0.5 }}
            >
              {project?.name} / {currentBoard?.name}
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
              placeholder="Search tasks..."
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
            >
              Create Task
            </Button>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2 }}>
          {columns.map((column) => (
            <Column key={column.id} column={column} tasks={filteredTasks} />
          ))}
        </Box>
      </Box>
    </Box>
  );
}

// Main Board component wraps content w/ DnD provider
export default function Board() {
  return (
    <BoardDndProvider>
      <BoardContent />
    </BoardDndProvider>
  );
}
