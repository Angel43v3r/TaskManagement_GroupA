import express from 'express';
import {
  createComment,
  updateComment,
  removeComment,
  getCommentByIssue,
} from '../controllers/commentsController';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * @openapi
 * /api/issues/{id}/comments:
 *   post:
 *     summary: Create a comment on an issue
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Issue ID
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - body
 *             properties:
 *               body:
 *                 type: string
 *                 example: "This issue occurs when clicking submit."
 *     responses:
 *       201:
 *         description: Comment created successfully
 *       400:
 *         description: Comment body is required
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Issue not found
 *       500:
 *         description: Server error
 */

router.post('/issues/:id/comments', verifyToken, createComment);

/**
 * @openapi
 * /api/issues/{id}/comments:
 *   get:
 *     summary: List comments for an issue
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Issue ID
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: List of comments
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Issue not found
 *       500:
 *         description: Server error
 */
router.get('/issues/:id/comments', verifyToken, getCommentByIssue);

/**
 * @openapi
 * /api/comments/{id}:
 *   patch:
 *     summary: Edit a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Comment ID
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               body:
 *                 type: string
 *                 example: "Updated comment text"
 *     responses:
 *       200:
 *         description: Comment updated
 *       400:
 *         description: Comment body is required
 *       401:
 *         description: Not allowed to edit this comment
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Server error
 */
router.patch('/comments/:id', verifyToken, updateComment);

/**
 * @openapi
 * /api/comments/{id}:
 *   delete:
 *     summary: Delete a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Comment ID
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Comment deleted
 *       401:
 *         description: Not allowed to delete this comment
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Server error
 */

router.delete('/comments/:id', verifyToken, removeComment);

export default router;
