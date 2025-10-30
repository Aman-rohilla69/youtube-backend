import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new mongoose.Schema(
  {
    videoFile: {
      type: String, //cloudinary URL for the video file
      required: [true, "Video file is required"],
    },
    thumbnail: {
      type: String, //cloudinary URL for the video thumbnail
      required: [true, "Thumbnail is required"],
    },
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    duration: {
      // Duration of the video cloudinary metadata
      type: Number, // duration in seconds
      required: [true, "Duration is required"],
    },
    views: {
      type: Number,
      default: 0,
    },
    isPublishd: {
      type: Boolean,
      default: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Video owner is required"],
    },
  },
  { timestamps: true },
);

// plugin use kyu hota hai..?
// Ye plugin aggregation queries ko paginate karne ke liye use hota hai.
// mongooseAggregatePaginate ka kya use hai..?
// Ye plugin large datasets ko efficiently handle karne ke liye pagination provide karta hai.
// pagination se kya fayda hai..?
// Pagination se data ko chhote-chhote parts mein divide karke retrieve kiya ja sakta hai, jisse performance improve hoti hai aur user experience better hota hai.
videoSchema.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model("Video", videoSchema);
