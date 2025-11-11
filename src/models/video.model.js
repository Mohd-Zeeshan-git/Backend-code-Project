import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const videoSchema = new Schema({
    videofile: { type: String, required: true // URL or path to the video file
    },
    title: { type: String, required: true, trim: true, index: true },
    description: { type: String, trim: true },
    thumbnail: { type: String // URL to the video's thumbnail image
    },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    tags: {
        type: [String], default: [] // Array of tags associated with the video
    },
    duration: { type: Number, required: true // Duration of the video in seconds
    },
    comments: { type: [Schema.Types.ObjectId], ref: "Comment", default: [] // Array of comment IDs
    },
    isPublished: { type: Boolean, default: true  // Video visibility status
    },
    owner:{type: Schema.Types.ObjectId, ref: "User", required: true }
},{ timestamps: true });
const Video = mongoose.model("Video", videoSchema);
videoSchema.plugin(mongooseAggregatePaginate);
export default Video;