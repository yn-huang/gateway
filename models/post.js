const mongoose = require('mongoose');
const Comment = require('./comment');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    title: {
        type: String,
        required: [true, 'title cannot be empty']
    },
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    description: {
        type: String,
        required: [true, 'description cannot be empty']
    },
    images: [
        {
            filename: String,
            url: String
        }
    ]
}, { timestamps: { createdAt: 'created_at' } });

postSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Comment.deleteMany({
            post: doc._id
        })
    }
})

module.exports = mongoose.model('Post', postSchema);