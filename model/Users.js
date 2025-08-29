import mongoose from "mongoose";
import UserSchema from "@/schema/UserSchema";

export default mongoose.models.User || mongoose.model("User", UserSchema);
