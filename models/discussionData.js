import mongoose from "mongoose";

const discussionSchema = new mongoose.Schema({
  p_id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  query: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
  comments: [
    {
      commenterName: String,
      comment: String,
      likes: {
        type: Number,
        default: 0,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  timestamp: {
    type: Date,
    default: Date.now,
  },
  });
  

export default mongoose.model('discussion', discussionSchema);