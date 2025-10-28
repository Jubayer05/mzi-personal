import connectDB from "@/lib/mongodb";
import ResearchWork from "@/models/ResearchWork";
import { NextRequest, NextResponse } from "next/server";

// GET - Fetch all research work
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "100");
    const skip = (page - 1) * limit;

    const researchWorks = await ResearchWork.find()
      .sort({ order: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await ResearchWork.countDocuments();

    return NextResponse.json({
      success: true,
      data: researchWorks,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch research work" },
      { status: 500 }
    );
  }
}

// POST - Create new research work
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { title, description, image, year, category, status, order } = body;

    // Validation
    if (!title || !description || !image || !year || !category) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const researchWork = await ResearchWork.create({
      title,
      description,
      image,
      year,
      category,
      status: status || "Published",
      order: order || 0,
    });

    return NextResponse.json(
      {
        success: true,
        data: researchWork,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("POST Error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to create research work",
      },
      { status: 500 }
    );
  }
}
