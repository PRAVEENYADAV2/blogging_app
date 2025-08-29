import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";
import CreatePostForm from "@/components/CreatePostForm";
export default async function AdminPage() {
  // 🔹 Get cookies
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  let user = null;

  if (token) {
    try {
      user = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      console.error("Invalid token:", error);
    }
  }

  // 🔹 If user is not logged in or not admin, redirect
  if (!user || user.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="max-w-[1300px] m-auto p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">Admin Dashboard</h1>
      <p className="text-lg">
        Welcome, {user.email}! {user.id} You have full admin access.
      </p>
      <CreatePostForm></CreatePostForm>
      <div className="mt-6 grid grid-cols-3 gap-6">
        <div className="p-4 border rounded-lg shadow bg-white">
          <h2 className="text-xl font-semibold">Manage Users</h2>
          <p>View and manage all registered users.</p>
        </div>
        <div className="p-4 border rounded-lg shadow bg-white">
          <h2 className="text-xl font-semibold">Manage Posts</h2>
          <p>Edit or delete blog posts.</p>
        </div>
        <div className="p-4 border rounded-lg shadow bg-white">
          <h2 className="text-xl font-semibold">Site Settings</h2>
          <p>Configure your blog platform.</p>
        </div>
      </div>
    </div>
  );
}
