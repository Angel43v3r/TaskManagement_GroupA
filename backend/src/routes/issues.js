import express from 'express';
import {
  createIssue,
  getAllIssues,
  getIssueByID,
  updateIssue,
  deleteIssue,
} from '../controllers/issuesController.js';
import {
  checkIssueView,
  checkIssueModify,
  checkIssueDelete,
} from '../middleware/permissions.js';
import { requireWorkflowCompliance } from '../middleware/workflow.js';

const router = express.Router();

// post
router.post('/', checkIssueModify, createIssue);

// get all issues (with filtering)
router.get('/', checkIssueView, getAllIssues);

// get by ID
router.get('/:id', checkIssueView, getIssueByID);

// patch
router.patch('/:id', requireWorkflowCompliance, checkIssueModify, updateIssue);

// delete
router.delete('/:id', checkIssueDelete, deleteIssue);

export default router;
