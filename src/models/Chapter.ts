import mongoose, { Document, Schema } from "mongoose";

export interface IPdfFile {
  fileName: string;
  fileUrl: string;
  fileSize?: number;
  uploadedAt: Date;
}

export interface IChapter extends Document {
  chapterName: string;
  courseCode: string;
  semester: string;
  pdfFiles: IPdfFile[];
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const ChapterSchema: Schema = new Schema(
  {
    chapterName: {
      type: String,
      required: [true, "Chapter name is required"],
      trim: true,
      maxlength: [200, "Chapter name cannot be more than 200 characters"],
    },
    courseCode: {
      type: String,
      required: [true, "Course code is required"],
      trim: true,
    },
    semester: {
      type: String,
      required: [true, "Semester is required"],
      trim: true,
    },
    pdfFiles: [
      {
        fileName: { type: String, required: true },
        fileUrl: { type: String, required: true },
        fileSize: { type: Number },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
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
ChapterSchema.index({ courseCode: 1, semester: 1 });
ChapterSchema.index({ order: 1 });

export default mongoose.models.Chapter ||
  mongoose.model<IChapter>("Chapter", ChapterSchema);
