import mongoose from "mongoose";
import PostSchema from "@/schema/PostSchema";

export default mongoose.models.Post || mongoose.model("Post", PostSchema);
