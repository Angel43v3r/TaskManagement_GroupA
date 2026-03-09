import express from 'express';
import {
  createComment,
  updateComment,
  removeComment,
  getCommentByIssue,
} from '../controllers/commentsController';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

export default router;
