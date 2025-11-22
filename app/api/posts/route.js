import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Post from "@/model/Post";
import User from "@/model/Users";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    await dbConnect();

    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let decodedUser;
    try {
      decodedUser = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { title, content, tags } = await req.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    const user = await User.findById(decodedUser.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const post = await Post.create({
      title,
      content,
      tags,
      author: user._id,
    });

    return NextResponse.json(
      { message: "Post created successfully", post },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await dbConnect();

    const posts = await Post.find({})
      .populate("author", "username email")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, posts }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
