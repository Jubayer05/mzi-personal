import connectDB from "@/lib/mongodb";
import Profile from "@/models/Profile";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    let profile = await Profile.findOne();

    // If no profile exists, create a default one
    if (!profile) {
      profile = await Profile.create({
        teacherName: "Dr. Md. Zohurul Islam",
        title: "Associate Professor",
        department: "Department of Mathematics",
        university: "Jashore University of Science and Technology (JUST)",
        universityFull:
          "Jashore University of Science and Technology (JUST), Bangladesh",
        bio: "Dr. Mr. Md. Zohurul Islam has been working as an Associate Professor in the Department of Mathematics at Jashore University of Science and Technology (JUST), Bangladesh since April 2023.",
        detailedBio: "",
        education: [
          {
            degree: "PhD in Computational Biophysics",
            institution: "University of Technology Sydney, Australia",
          },
          {
            degree: "M.Sc. in Mathematics",
            institution: "Khulna University, Bangladesh",
          },
          {
            degree: "B.Sc. in Mathematics",
            institution: "Khulna University, Bangladesh",
          },
        ],
        specializations: [
          "Fluid Dynamics",
          "Computational Mathematics",
          "CFD Analysis",
          "Numerical Simulations",
        ],
      });
    }

    return NextResponse.json({ success: true, data: profile });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    let profile = await Profile.findOne();

    if (!profile) {
      profile = await Profile.create(body);
    } else {
      Object.assign(profile, body);
      await profile.save();
    }

    return NextResponse.json({ success: true, data: profile });
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
