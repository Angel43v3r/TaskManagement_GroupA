import { Comment, Issue } from '../models/model.js';

const addComment = async (issueId, body, currentUser) => {
  const issue = await Issue.findByPk(issueId);
  if (!issue) throw new Error('Issue not found');

  if (!body || !body.trim()) {
    throw new Error('Comment body is required');
  }

  const comment = await Comment.create({
    body,
    issueId,
    authorId: currentUser.sub,
  });

  return comment;
};

const editComment = async (commentId, body, currentUser) => {
  const comment = await Comment.findByPk(commentId);
  if (!comment) throw new Error('Comment not found');

  if (!body || !body.trim()) {
    throw new Error('Comment body is required');
  }

  if (
    comment.authorId !== currentUser.sub &&
    !currentUser.roles.includes('admin')
  ) {
    throw new Error('You are not allowed to edit this comment');
  }
  comment.body = body.trim();
  await comment.save();

  return comment;
};

const deleteComment = async (commentId, currentUser) => {
  const comment = await Comment.findByPk(commentId);

  if (!comment) throw new Error('Comment not found');
  if (
    comment.authorId !== currentUser.sub &&
    !currentUser.roles.includes('admin')
  ) {
    throw new Error('You are not allowed to edit this comment');
  }

  await comment.destroy();

  return { message: 'Comment successfully deleted.' };
};

const listByIssue = async (issueId) => {
  const issue = await Issue.findByPk(issueId);
  if (!issue) throw new Error('Issue not found');

  const comments = await Comment.findAll({
    where: { issueId },
    order: [['createdAt', 'ASC']],
  });

  return comments;
};

export { addComment, editComment, deleteComment, listByIssue };
