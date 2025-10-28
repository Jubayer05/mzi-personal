import { mkdir, stat, writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export const runtime = "nodejs";

async function ensureDir(dirPath: string) {
  try {
    const s = await stat(dirPath);
    if (!s.isDirectory()) {
      throw new Error(`${dirPath} exists and is not a directory`);
    }
  } catch (e) {
    await mkdir(dirPath, { recursive: true });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Validate file type - now includes PDFs
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "application/pdf", // Added PDF support
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            "Invalid file type. Only JPEG, PNG, WebP, and PDF are allowed.",
        },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB for PDFs, 5MB for images)
    const maxImageSize = 5 * 1024 * 1024; // 5MB for images
    const maxPdfSize = 20 * 1024 * 1024; // 10MB for PDFs
    const maxSize = file.type === "application/pdf" ? maxPdfSize : maxImageSize;

    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File size exceeds ${maxSize / (1024 * 1024)}MB limit` },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename with date
    const date = new Date();
    const dateStr = `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${date.getFullYear()}`;
    const originalName = file.name.replace(/[^\w.\-]/g, "_");
    const filename = `${dateStr}_${originalName}`;

    // Upload to public/uploads - files in public/ are accessible via /uploads/filename
    const uploadDir =
      process.env.UPLOAD_DIR || path.join(process.cwd(), "public", "uploads");

    // Create directory if it doesn't exist
    await ensureDir(uploadDir);

    const filepath = path.join(uploadDir, filename);

    // Save file
    await writeFile(filepath, buffer);

    // Return the URL path accessible from public folder
    const fileUrl = `/uploads/${filename}`;

    return NextResponse.json({
      success: true,
      url: fileUrl,
      filename: filename,
      fileType: file.type, // Return file type for client to handle accordingly
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
