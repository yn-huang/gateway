// comment related actions

const Post = require("../models/post");
const Comment = require("../models/comment");

// create a new comment
module.exports.createComment = async (req, res) => {
  // find the corresponding post
  const post = await Post.findById(req.params.id);

  // create the new comment
  const comment = new Comment(req.body);
  comment.author = req.user._id;
  comment.post = post;
  await comment.save();

  // redirect to post
  req.flash("success", "Successfully made a comment in the post!");
  res.redirect(`/forum/${post._id}`);
};

// delete a comment
module.exports.deleteComment = async (req, res) => {
  // delete the corresponding comment
  const { id, commentId } = req.params;
  await Comment.findByIdAndDelete(commentId);

  // redirect to post
  req.flash("success", "Successfully deleted your comment!");
  res.redirect(`/forum/${id}`);
};

// reply to a comment
module.exports.replyComment = async (req, res) => {
  // find the corresponding post
  const { id, commentId } = req.params;
  const post = await Post.findById(id);

  // create the new comment
  const comment = new Comment(req.body);

  // associate the new comment to the comment it's replying to
  const reply = await Comment.findById(commentId);
  comment.replyTo = reply.comment;
  comment.author = req.user._id;
  comment.post = post;
  await comment.save();

  // redirect to post
  req.flash("success", "Successfully replied to the comment!");
  res.redirect(`/forum/${post._id}`);
};
