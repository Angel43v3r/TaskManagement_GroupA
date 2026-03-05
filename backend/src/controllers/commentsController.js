export const addComment = async (req, res) => {
    try {
          const issueId = req.params.id;
          const { body } = req.body;
          const user = req.user;
          const comment = await CommentService.addComment(issueId, body, user);

  res.status(201).json({
    success: true,
     comment,
    });
    } catch (err) {
        console.error('Error leaving comment', err);
        res.status(500).json({
            success: false,
            error: err.message,
        })
    }
};
