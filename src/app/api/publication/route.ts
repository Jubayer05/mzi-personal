import connectDB from "@/lib/mongodb";
import Publication from "@/models/Publication";
import { NextRequest, NextResponse } from "next/server";

// GET - Fetch all publications
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "100");
    const skip = (page - 1) * limit;

    const publications = await Publication.find()
      .sort({ order: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Publication.countDocuments();

    return NextResponse.json({
      success: true,
      data: publications,
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
      { error: "Failed to fetch publications" },
      { status: 500 }
    );
  }
}

// POST - Create new publication
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { title, authors, journal, year, citations, doi, image, order } =
      body;

    // Validation
    if (!title || !authors || !journal || !year || !doi || !image) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const publication = await Publication.create({
      title,
      authors,
      journal,
      year,
      citations: citations || 0,
      doi,
      image,
      order: order || 0,
    });

    return NextResponse.json(
      {
        success: true,
        data: publication,
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
            : "Failed to create publication",
      },
      { status: 500 }
    );
  }
}
