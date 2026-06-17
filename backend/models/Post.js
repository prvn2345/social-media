import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a post title'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Please add post content'],
    },
    imageUrl: {
      type: String,
      default: '',
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    commentCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual property to calculate like count dynamically if needed
postSchema.virtual('likeCount').get(function () {
  return this.likes.length;
});

const Post = mongoose.model('Post', postSchema);

export default Post;
