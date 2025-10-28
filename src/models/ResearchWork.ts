import mongoose, { Document, Schema } from "mongoose";

export interface IResearchWork extends Document {
  title: string;
  description: string;
  image: string;
  year: string;
  category: string;
  status: "Ongoing" | "Published";
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const ResearchWorkSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot be more than 200 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [1000, "Description cannot be more than 1000 characters"],
    },
    image: {
      type: String,
      required: [true, "Image is required"],
    },
    year: {
      type: String,
      required: [true, "Year is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["Ongoing", "Published"],
      default: "Published",
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
ResearchWorkSchema.index({ order: 1 });
ResearchWorkSchema.index({ year: -1 });

export default mongoose.models.ResearchWork ||
  mongoose.model<IResearchWork>("ResearchWork", ResearchWorkSchema);
