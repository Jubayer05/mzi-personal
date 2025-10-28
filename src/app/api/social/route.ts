import connectDB from "@/lib/mongodb";
import Social from "@/models/Social";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    let social = await Social.findOne();

    if (!social) {
      social = await Social.create({
        github: "",
        linkedin: "",
        researchgate: "",
        email: "zohurul.islam@just.edu.bd",
        phone: "+880 1712 345 678",
      });
    }

    return NextResponse.json({ success: true, data: social });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch social links" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    let social = await Social.findOne();

    if (!social) {
      social = await Social.create(body);
    } else {
      Object.assign(social, body);
      await social.save();
    }

    return NextResponse.json({ success: true, data: social });
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json(
      { error: "Failed to update social links" },
      { status: 500 }
    );
  }
}
