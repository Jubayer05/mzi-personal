import mongoose, { Document, Schema } from "mongoose";

export interface ISocial extends Document {
  github: string;
  linkedin: string;
  researchgate: string;
  email: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
}

const SocialSchema: Schema = new Schema(
  {
    github: {
      type: String,
      default: "",
    },
    linkedin: {
      type: String,
      default: "",
    },
    researchgate: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "zohurul.islam@just.edu.bd",
    },
    phone: {
      type: String,
      default: "+880 1712 345 678",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Social ||
  mongoose.model<ISocial>("Social", SocialSchema);
