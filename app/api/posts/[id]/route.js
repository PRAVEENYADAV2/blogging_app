// app/api/posts/[id]/route.js
import dbConnect from "@/lib/dbConnect";
import Post from "@/model/Post";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  await dbConnect();
  const para = await params;
  const post = await Post.findById(para.id);
  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }
  return NextResponse.json(post);
}
