import mongoose, { Document, Schema } from "mongoose";

export interface IPublication extends Document {
  title: string;
  authors: string;
  journal: string;
  year: string;
  citations: number;
  doi: string;
  image: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const PublicationSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot be more than 200 characters"],
    },
    authors: {
      type: String,
      required: [true, "Authors is required"],
      trim: true,
    },
    journal: {
      type: String,
      required: [true, "Journal is required"],
      trim: true,
    },
    year: {
      type: String,
      required: [true, "Year is required"],
    },
    citations: {
      type: Number,
      default: 0,
    },
    doi: {
      type: String,
      required: [true, "DOI is required"],
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Image is required"],
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
PublicationSchema.index({ order: 1 });
PublicationSchema.index({ year: -1 });

export default mongoose.models.Publication ||
  mongoose.model<IPublication>("Publication", PublicationSchema);
