const Post = require('../models/post');
const Comment = require('../models/comment');
const { s3 } = require('../aws');

module.exports.index = async (req, res) => {
    const posts = await Post.find({});
    res.render('forums/index', { posts });
}

module.exports.createPost = async (req, res) => {
    const post = new Post(req.body);
    post.images = req.files.map(f => ({ url: f.location, filename: f.key }));
    post.author = req.user._id;
    await post.save();
    req.flash('success', 'Successfully made a post in the forum!')
    res.redirect(`/forum/${post._id}`)
}

module.exports.newPostForm = (req, res) => {
    res.render('forums/new')
}

module.exports.showPost = async (req, res) => {
    const post = await Post.findById(req.params.id).populate('author');
    if (!post) {
        req.flash('error', 'Post does not exist!');
        return res.redirect('/forum');
    }
    const comments = await Comment.find({ post: post._id }).populate('author');
    res.render('forums/show', { post, comments });
}

module.exports.editPost = async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post) {
        req.flash('error', 'Post does not exist!');
        return res.redirect('/forum');
    }
    res.render('forums/edit', { post });
}

module.exports.updatePost = async (req, res) => {
    const { id } = req.params;
    const post = await Post.findByIdAndUpdate(id, { ...req.body });
    const img = req.files.map(f => ({ url: f.location, filename: f.key }))
    post.images.push(...img);
    await post.save();
    const deleteImages = req.body.deleteImages;
    if (deleteImages) {
        const obj = deleteImages.map(key => ({ Key: key }));
        await s3.deleteObjects({ Bucket: process.env.BUCKET_NAME, Delete: { Objects: obj } }, function (err, data) {
            if (err) console.log(err, err.stack);
            else console.log(data)
        }).promise();
        await post.updateOne({ $pull: { images: { filename: { $in: deleteImages } } } });
    }
    req.flash('success', 'Successfully update your post!');
    res.redirect(`/forum/${post._id}`);
}

module.exports.deletePost = async (req, res) => {
    const { id } = req.params
    const post = await Post.findById(id);
    const obj = post.images.map(img => ({ Key: img.filename }));
    await s3.deleteObjects({ Bucket: process.env.BUCKET_NAME, Delete: { Objects: obj } }, function (err, data) {
        if (err) console.log(err, err.stack);
        else console.log(data)
    }).promise();
    await Post.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted your post!')
    res.redirect('/forum');
}