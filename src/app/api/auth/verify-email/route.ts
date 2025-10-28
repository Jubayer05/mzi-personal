import connectDB from "@/lib/mongodb";
import EmailVerificationToken from "@/models/EmailVerificationToken";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

interface JWTPayload {
  email: string;
  userId: string;
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: "Verification token is required" },
        { status: 400 }
      );
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback-secret"
    ) as JWTPayload;

    // Find and validate token in database
    const verificationToken = await EmailVerificationToken.findOne({ token });
    if (!verificationToken) {
      return NextResponse.json(
        { error: "Invalid verification token" },
        { status: 400 }
      );
    }

    // Check if token is expired
    if (verificationToken.expiresAt < new Date()) {
      await EmailVerificationToken.deleteOne({ token });
      return NextResponse.json(
        { error: "Verification token has expired" },
        { status: 400 }
      );
    }

    // Update user verification status
    await User.findByIdAndUpdate(decoded.userId, { isVerified: true });

    // Remove verification token
    await EmailVerificationToken.deleteOne({ token });

    return NextResponse.json(
      { message: "Email verified successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      { error: "Invalid or expired verification token" },
      { status: 400 }
    );
  }
}
