// forum / post related actions

const Post = require("../models/post");
const Comment = require("../models/comment");
const { s3 } = require("../aws");

// visit forum
module.exports.index = async (req, res) => {
  // show a list of all posts in forum
  const posts = await Post.find({});
  res.render("forums/index", { posts });
};

// create a new post
module.exports.createPost = async (req, res) => {
  // create the post
  const post = new Post(req.body);
  post.images = req.files.map((f) => ({ url: f.location, filename: f.key }));
  post.author = req.user._id;
  await post.save();

  // redirect to the newly created post
  req.flash("success", "Successfully made a post in the forum!");
  res.redirect(`/forum/${post._id}`);
};

// visit the page for creating a new post
module.exports.newPostForm = (req, res) => {
  res.render("forums/new");
};

// visit a post
module.exports.showPost = async (req, res) => {
  // find the corresponding post
  const post = await Post.findById(req.params.id).populate("author");

  // return to forum if the post does not exist in the database
  if (!post) {
    req.flash("error", "Post does not exist!");
    return res.redirect("/forum");
  }

  // populate corresponding comments related to the post
  const comments = await Comment.find({ post: post._id }).populate("author");

  // show the post
  res.render("forums/show", { post, comments });
};

// visit page for editing a post
module.exports.editPost = async (req, res) => {
  // find the corresponding post
  const post = await Post.findById(req.params.id);

  // return to forum if the post does not exist in the database
  if (!post) {
    req.flash("error", "Post does not exist!");
    return res.redirect("/forum");
  }

  // show the edit page
  res.render("forums/edit", { post });
};

// update a post
module.exports.updatePost = async (req, res) => {
  // find the corresponding post and update text fields
  const { id } = req.params;
  const post = await Post.findByIdAndUpdate(id, { ...req.body });

  // add new images
  const img = req.files.map((f) => ({ url: f.location, filename: f.key }));
  post.images.push(...img);
  await post.save();

  // get the images that are selected by the author for deletion
  const deleteImages = req.body.deleteImages;

  // delete the selected images from AWS S3 and Mongo
  if (deleteImages) {
    const obj = deleteImages.map((key) => ({ Key: key }));
    await s3
      .deleteObjects(
        { Bucket: process.env.BUCKET_NAME, Delete: { Objects: obj } },
        function (err, data) {
          if (err) console.log(err, err.stack);
          else console.log(data);
        }
      )
      .promise();
    await post.updateOne({
      $pull: { images: { filename: { $in: deleteImages } } },
    });
  }

  // redirect to the post
  req.flash("success", "Successfully update your post!");
  res.redirect(`/forum/${post._id}`);
};

// delete a post
module.exports.deletePost = async (req, res) => {
  // find the corresponding post
  const { id } = req.params;
  const post = await Post.findById(id);

  // delete images from AWS S3
  const obj = post.images.map((img) => ({ Key: img.filename }));
  await s3
    .deleteObjects(
      { Bucket: process.env.BUCKET_NAME, Delete: { Objects: obj } },
      function (err, data) {
        if (err) console.log(err, err.stack);
        else console.log(data);
      }
    )
    .promise();

  // delete data from Mongo
  await Post.findByIdAndDelete(id);

  // redirect to the forum
  req.flash("success", "Successfully deleted your post!");
  res.redirect("/forum");
};
