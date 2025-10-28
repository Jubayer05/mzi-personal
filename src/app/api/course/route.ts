import connectDB from "@/lib/mongodb";
import Course from "@/models/Course";
import { NextRequest, NextResponse } from "next/server";

// GET - Fetch all courses or filter by semester
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const semester = searchParams.get("semester");

    const query = semester ? { semester } : {};

    const courses = await Course.find(query).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: courses,
    });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}

// POST - Create new course
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { courseName, courseCode, semester } = body;

    if (!courseName || !courseCode || !semester) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Check if course already exists with same code and semester
    const existingCourse = await Course.findOne({ courseCode, semester });
    if (existingCourse) {
      return NextResponse.json(
        { error: "Course with this code already exists in this semester" },
        { status: 400 }
      );
    }

    const course = await Course.create({
      courseName,
      courseCode,
      semester,
    });

    return NextResponse.json(
      {
        success: true,
        data: course,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("POST Error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to create course",
      },
      { status: 500 }
    );
  }
}
