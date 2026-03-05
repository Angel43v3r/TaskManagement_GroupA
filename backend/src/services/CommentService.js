import { Comment, Issue } from '../models/model.js';

const addComment = async (issueId, body, currentUser) => {
    const issue = await Issue.findByPk(issueId);
    if(!issue) throw new NotFoundError("Issue not found");

    if (!body || !body.trim()) {
        throw new BadRequestError("Comment body is required");
    }

    const comment = await Comment.create({
        body,
        issueId,
        authorId: currentUser.id,
    })

    return comment;
};

const editComment = () => {};

const deleteComment = () => {};

const listByIssue = () => {};

export { addComment, editComment, deleteComment, listByIssue };