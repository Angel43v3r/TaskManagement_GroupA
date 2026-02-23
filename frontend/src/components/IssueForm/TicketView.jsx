import { useState } from 'react';
import {
  Box, Paper, Typography, Button
} from '@mui/material';
import CreateTicketForm from './CreateTicketForm'; 
import DeleteTicketButton from './DeleteTicketButton';

function TicketView({ ticket, onClose }) {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <CreateTicketForm
        ticketId={ticket.id}
        mode="edit"  // Add mode="edit" prop
        onSuccess={() => {
          setIsEditing(false);
          // Optionally refresh ticket data
        }}
      />
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      {/* Header with actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">{ticket.title}</Typography>
        <Box>
          <Button onClick={onClose}>Close</Button>
          <Button variant="contained" onClick={() => setIsEditing(true)} sx={{ ml: 1 }}>
            Edit
          </Button>
          <DeleteTicketButton 
            ticketId={ticket.id}
            onDelete={onClose}
          />
        </Box>
      </Box>

      {/* Ticket Display Content */}
      <Typography>Project: {ticket.project?.name}</Typography>
      <Typography>Description: {ticket.description}</Typography>
    </Paper>
  );
}

export default TicketView;