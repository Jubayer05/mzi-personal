import connectDB from "@/lib/mongodb";
import ResearchWork from "@/models/ResearchWork";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

// GET - Fetch single research work
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    const researchWork = await ResearchWork.findById(id);

    if (!researchWork) {
      return NextResponse.json(
        { error: "Research work not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: researchWork,
    });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch research work" },
      { status: 500 }
    );
  }
}

// PUT - Update research work
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    const body = await request.json();
    const { title, description, image, year, category, status, order } = body;

    const researchWork = await ResearchWork.findByIdAndUpdate(
      id,
      {
        title,
        description,
        image,
        year,
        category,
        status,
        order,
      },
      { new: true, runValidators: true }
    );

    if (!researchWork) {
      return NextResponse.json(
        { error: "Research work not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: researchWork,
    });
  } catch (error: unknown) {
    console.error("PUT Error:", error);
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

// DELETE - Delete research work
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    const researchWork = await ResearchWork.findByIdAndDelete(id);

    if (!researchWork) {
      return NextResponse.json(
        { error: "Research work not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Research work deleted successfully",
    });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json(
      { error: "Failed to delete research work" },
      { status: 500 }
    );
  }
}
