import mongoose, { Document, Schema } from "mongoose";

export interface IProfile extends Document {
  teacherName: string;
  title: string;
  department: string;
  university: string;
  universityFull: string;
  bio: string;
  detailedBio: string;
  education: Array<{
    degree: string;
    institution: string;
    field?: string;
  }>;
  specializations: Array<string>;
  createdAt: Date;
  updatedAt: Date;
}

const ProfileSchema: Schema = new Schema(
  {
    teacherName: {
      type: String,
      required: true,
      trim: true,
      default: "Dr. Md. Zohurul Islam",
    },
    title: {
      type: String,
      required: true,
      trim: true,
      default: "Associate Professor",
    },
    department: {
      type: String,
      required: true,
      trim: true,
      default: "Department of Mathematics",
    },
    university: {
      type: String,
      required: true,
      trim: true,
      default: "Jashore University of Science and Technology (JUST)",
    },
    universityFull: {
      type: String,
      required: true,
      trim: true,
      default:
        "Jashore University of Science and Technology (JUST), Bangladesh",
    },
    bio: {
      type: String,
      required: true,
      default:
        "Dr. Mr. Md. Zohurul Islam has been working as an Associate Professor in the Department of Mathematics at Jashore University of Science and Technology (JUST), Bangladesh since April 2023.",
    },
    detailedBio: {
      type: String,
      default: "",
    },
    education: [
      {
        degree: { type: String, required: true },
        institution: { type: String, required: true },
        field: { type: String },
      },
    ],
    specializations: [String],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Profile ||
  mongoose.model<IProfile>("Profile", ProfileSchema);
