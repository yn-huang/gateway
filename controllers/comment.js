const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports.createComment = async (req, res) => {
    const post = await Post.findById(req.params.id);
    const comment = new Comment(req.body);
    comment.author = req.user._id;
    comment.post = post;
    await comment.save();
    req.flash('success', 'Successfully made a comment in the post!')
    res.redirect(`/forum/${post._id}`);
}

module.exports.deleteComment = async (req, res) => {
    const { id, commentId } = req.params;
    await Comment.findByIdAndDelete(commentId);
    req.flash('success', 'Successfully deleted your comment!')
    res.redirect(`/forum/${id}`);
}

module.exports.replyComment = async (req, res) => {
    const { id, commentId } = req.params;
    const post = await Post.findById(id);
    const comment = new Comment(req.body);
    const reply = await Comment.findById(commentId);
    comment.replyTo = reply.comment;
    comment.author = req.user._id;
    comment.post = post;
    await comment.save();
    req.flash('success', 'Successfully replied to the comment!');
    res.redirect(`/forum/${post._id}`);
}