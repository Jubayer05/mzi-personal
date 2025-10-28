import { sendVerificationEmail } from "@/lib/email";
import connectDB from "@/lib/mongodb";
import EmailVerificationToken from "@/models/EmailVerificationToken";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

interface JWTPayload {
  email: string;
  userId: string;
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { firstName, lastName, email, password } = await request.json();

    // Validation
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists with this email" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      isVerified: false,
    });

    await user.save();

    // Generate verification token
    const verificationToken = jwt.sign(
      { email, userId: user._id.toString() },
      process.env.JWT_SECRET || "fallback-secret",
      { expiresIn: "24h" }
    );

    // Store verification token
    const emailVerificationToken = new EmailVerificationToken({
      token: verificationToken,
      email,
      userId: user._id,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    });

    await emailVerificationToken.save();

    // Send verification email
    const emailResult = await sendVerificationEmail(
      email,
      verificationToken,
      firstName
    );

    if (!emailResult.success) {
      console.error("Failed to send verification email:", emailResult.error);
      return NextResponse.json(
        {
          error:
            "Registration successful but failed to send verification email. Please contact support.",
        },
        { status: 500 }
      );
    }

    console.log(`Verification email sent to: ${email}`);

    return NextResponse.json(
      {
        message:
          "User registered successfully. Please check your email to verify your account.",
        userId: user._id.toString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
