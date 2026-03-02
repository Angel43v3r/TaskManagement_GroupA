import { Box, Typography, Paper, IconButton, Tooltip } from '@mui/material';
import {
  EditOutlined as EditIcon,
  Circle as CircleIcon,
  Pentagon as PentagonIcon,
  AccountTreeOutlined as NestingIcon,
} from '@mui/icons-material';
import StoryPoints from './StoryPoints.jsx';
import Assignee from './Assignee.jsx';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Issue type constants
const ISSUE_TYPES = {
  EPIC: 'epic',
  STORY: 'story',
  SUBISSUE: 'subissue',
};

// Custom rhombus icon for subissues
function RhombusIcon({ sx }) {
  return (
    <Box
      sx={{
        width: 8,
        height: 8,
        bgcolor: '#F5A623',
        transform: 'rotate(45deg)',
        ...sx,
      }}
    />
  );
}

// Get icon and color based on issue type
function getIssueTypeIcon(type) {
  switch (type) {
    case ISSUE_TYPES.EPIC:
      return (
        <Tooltip title="Epic" arrow>
          <CircleIcon sx={{ fontSize: 14, color: '#E91E8C' }} />
        </Tooltip>
      );
    case ISSUE_TYPES.STORY:
      return (
        <Tooltip title="Story" arrow>
          <PentagonIcon sx={{ fontSize: 14, color: '#00B8D9' }} />
        </Tooltip>
      );
    case ISSUE_TYPES.SUBISSUE:
      return (
        <Tooltip title="Sub-issue" arrow>
          <Box component="span" sx={{ display: 'inline-flex' }}>
            <RhombusIcon />
          </Box>
        </Tooltip>
      );
    default:
      return <CircleIcon sx={{ fontSize: 14, color: '#999' }} />;
  }
}

export default function IssueCard({ issue, isDragging = false }) {
  // Sets up sortable w/ issue id for reordering support
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: issue.id,
  });

  // Applies transform and transition styles during drag
  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.5 : 1,
  };

  return (
    <Paper
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      elevation={0}
      sx={{
        p: 2,
        mb: 1.5,
        bgcolor: 'white',
        border: '1px solid #e0e0e0',
        borderRadius: 1,
        cursor: 'grab',
        opacity: isDragging ? 0.9 : 1,
        boxShadow: isDragging ? '0 8px 16px rgba(0,0,0,0.15)' : 'none',
        '&:hover': {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
        '&:active': {
          cursor: 'grabbing',
        },
      }}
    >
      {/* Title and Edit Icon */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          mb: 1,
        }}
      >
        <Typography
          variant="body1"
          sx={{ fontWeight: 500, color: '#333', pr: 1 }}
        >
          {issue.title}
        </Typography>
        <IconButton size="small" sx={{ color: '#ccc', p: 0.25 }}>
          <EditIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Box>

      {/* Description */}
      <Typography
        variant="body2"
        component="p"
        sx={{
          color: '#666',
          fontSize: '0.8rem',
          lineHeight: 1.4,
          mb: 1.5,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          paddingLeft: '0 !important',
          marginLeft: '0 !important',
          textIndent: '0 !important',
          textAlign: 'left',
        }}
      >
        {issue.description}
      </Typography>

      {/* Footer: Issue ID, Story Points, Assignee */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {/* Issue Type Icon and ID */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          {getIssueTypeIcon(issue.type)}
          <Typography variant="caption" sx={{ color: '#888' }}>
            {issue.id}
          </Typography>
        </Box>

        {/* Story Points, Nesting Icon, and Assignee */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <StoryPoints points={issue.storyPoints} issueId={issue.id} />
          {(issue.type === ISSUE_TYPES.EPIC ||
            issue.type === ISSUE_TYPES.STORY) && (
            <NestingIcon sx={{ fontSize: 16, color: '#ccc' }} />
          )}
          <Assignee name={issue.assignee} />
        </Box>
      </Box>
    </Paper>
  );
}
