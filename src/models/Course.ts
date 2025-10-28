import mongoose, { Document, Schema } from "mongoose";

export interface ICourse extends Document {
  courseName: string;
  courseCode: string;
  semester: string; // e.g., "1-1", "1-2", "2-1", etc.
  createdAt: Date;
  updatedAt: Date;
}

const CourseSchema: Schema = new Schema(
  {
    courseName: {
      type: String,
      required: [true, "Course name is required"],
      trim: true,
      maxlength: [200, "Course name cannot be more than 200 characters"],
    },
    courseCode: {
      type: String,
      required: [true, "Course code is required"],
      trim: true,
      maxlength: [50, "Course code cannot be more than 50 characters"],
    },
    semester: {
      type: String,
      required: [true, "Semester is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
CourseSchema.index({ semester: 1 });
CourseSchema.index({ courseCode: 1 });

export default mongoose.models.Course ||
  mongoose.model<ICourse>("Course", CourseSchema);
