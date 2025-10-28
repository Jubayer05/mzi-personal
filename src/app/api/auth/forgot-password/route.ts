import { sendPasswordResetEmail } from "@/lib/email";
import connectDB from "@/lib/mongodb";
import PasswordResetToken from "@/models/PasswordResetToken";
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

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      // For security, don't reveal if email exists or not
      return NextResponse.json(
        {
          message: "If the email exists, a password reset link has been sent.",
        },
        { status: 200 }
      );
    }

    // Generate reset token
    const resetToken = jwt.sign(
      { email, userId: user._id.toString() },
      process.env.JWT_SECRET || "fallback-secret",
      { expiresIn: "1h" }
    );

    // Store reset token
    const passwordResetToken = new PasswordResetToken({
      token: resetToken,
      email,
      userId: user._id,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    });

    await passwordResetToken.save();

    // Send password reset email
    const emailResult = await sendPasswordResetEmail(
      email,
      resetToken,
      user.firstName
    );

    if (!emailResult.success) {
      console.error("Failed to send password reset email:", emailResult.error);
      return NextResponse.json(
        {
          error: "Failed to send password reset email. Please try again later.",
        },
        { status: 500 }
      );
    }

    console.log(`Password reset email sent to: ${email}`);

    return NextResponse.json(
      { message: "If the email exists, a password reset link has been sent." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
