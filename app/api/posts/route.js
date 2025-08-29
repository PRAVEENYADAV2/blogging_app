import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Post from "@/model/Post";
import User from "@/model/Users"; 

export async function POST(req) {
  try {
    await dbConnect();

    const { title, content, author, tags } = await req.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    const post = await Post.create({
      title,
      content,
      author,
      tags,
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
    await dbConnect(); // ✅ Connect to MongoDB

    // Fetch all posts, sorted by newest first, and populate author details
    const posts = await Post.find({})
      .populate("author", "username _id email") 
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, posts }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}