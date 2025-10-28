import connectDB from "@/lib/mongodb";
import Chapter from "@/models/Chapter";
import { NextRequest, NextResponse } from "next/server";

// GET - Fetch all chapters or filter by semester and courseCode
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const semester = searchParams.get("semester");
    const courseCode = searchParams.get("courseCode");

    const query: Record<string, string | undefined> = {};
    if (semester) query.semester = semester;
    if (courseCode) query.courseCode = courseCode;

    const chapters = await Chapter.find(query).sort({
      order: 1,
      createdAt: -1,
    });

    return NextResponse.json({
      success: true,
      data: chapters,
    });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch chapters" },
      { status: 500 }
    );
  }
}

// POST - Create new chapter
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { chapterName, courseCode, semester, pdfFiles, order } = body;

    if (!chapterName || !courseCode || !semester) {
      return NextResponse.json(
        { error: "Chapter name, course code, and semester are required" },
        { status: 400 }
      );
    }

    const chapter = await Chapter.create({
      chapterName,
      courseCode,
      semester,
      pdfFiles: pdfFiles || [],
      order: order || 0,
    });

    return NextResponse.json(
      {
        success: true,
        data: chapter,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("POST Error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to create chapter",
      },
      { status: 500 }
    );
  }
}
