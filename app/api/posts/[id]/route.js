// app/api/posts/[id]/route.js
import dbConnect from "@/lib/dbConnect";
import Post from "@/model/Post";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
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
export async function DELETE(req, { params }) {
  await dbConnect();

  // 🔑 Check JWT
  const token = cookies().get("token")?.value;
  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }

  let user;
  try {
    user = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return new Response("Invalid token", { status: 403 });
  }

  // 🔐 Enforce Admin Access
  if (user.role !== "admin") {
    return new Response("Forbidden: Admin only", { status: 403 });
  }

  // 🚮 Delete Post
  const deletedPost = await Post.findByIdAndDelete(params.id);

  if (!deletedPost) {
    return new Response("Post not found", { status: 404 });
  }

  return Response.json({ message: "Deleted" });
}

export async function PUT(req, { params }) {
  await dbConnect();

  // 🔑 Verify Admin Token
  const token = cookies().get("token")?.value;
  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }

  let user;
  try {
    user = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return new Response("Invalid token", { status: 403 });
  }

  if (user.role !== "admin") {
    return new Response("Forbidden: Admin access required", { status: 403 });
  }

  // 🔄 Update Post
  const body = await req.json();

  const updatedPost = await Post.findByIdAndUpdate(
    params.id,
    {
      title: body.title,
      content: body.content,
      tags: body.tags?.map((t) => t.trim()) || [],
    },
    { new: true }
  );

  if (!updatedPost) {
    return new Response("Post not found", { status: 404 });
  }

  return Response.json(updatedPost);
}