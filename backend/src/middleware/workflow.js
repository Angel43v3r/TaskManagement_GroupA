import IssueService from '../services/IssueService.js';
import WorkflowService from '../services/WorkflowService.js';

const requireWorkflowCompliance = async (req, res, next) => {
  try {
    const issueId = req.params.id;
    const { status: newStatus } = req.body;

    if (!newStatus) {
      return res.status(400).json({
        message: 'New status is required',
      });
    }

    const issue = await IssueService.getById(issueId);

    if (!issue) {
      return res.status(404).json({
        message: 'Ticket not found',
      });
    }

    const currentStatus = issue.status;

    const isValid = WorkflowService.validateTransition(
      currentStatus,
      newStatus
    );

    if (!isValid) {
      return res.status(400).json({
        message: `Invalid status transition from ${currentStatus} to ${newStatus}`,
      });
    }

    // Enforce that 'done' requires an assignee
    if (newStatus === 'done' && issue.assignees.length === 0) {
      return res.status(400).json({
        message: 'Cannot move ticket to DONE without an assignee',
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

export { requireWorkflowCompliance };
