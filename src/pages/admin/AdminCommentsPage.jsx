// src/pages/admin/AdminCommentsPage.jsx
import { useEffect, useState } from "react";
import AdminDashboardLayout from "../../components/admin/AdminDashboardLayout";
import { fetchAllPosts, hideComment, unhideComment, deleteComment } from "../../api/admin";

// Optional: if you have a separate API to fetch comments
import { fetchAllComments } from "../../api/admin";

export default function AdminCommentsPage() {
  const [comments, setComments] = useState([]);
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    if (token) {
      fetchAllComments(token)
        .then(setComments)
        .catch(console.error);
    }
  }, [token]);

  const handleHide = async (id) => {
    await hideComment(id, token);
    setComments((c) => c.map((x) => x._id === id ? { ...x, hidden: true } : x));
  };

  const handleUnhide = async (id) => {
    await unhideComment(id, token);
    setComments((c) => c.map((x) => x._id === id ? { ...x, hidden: false } : x));
  };

  const handleDelete = async (id) => {
    await deleteComment(id, token);
    setComments((c) => c.filter((x) => x._id !== id));
  };

  return (
    <AdminDashboardLayout>
      <h2 className="text-xl font-bold mb-4">Comments Management</h2>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            <th className="border-b p-2">Comment</th>
            <th className="border-b p-2">Post / Author</th>
            <th className="border-b p-2">Status</th>
            <th className="border-b p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {comments.map((c) => (
            <tr key={c._id}>
              <td className="border-b p-2">{c.text?.slice(0, 50)}</td>
              <td className="border-b p-2">{c.postId} / {c.authorId}</td>
              <td className="border-b p-2">{c.hidden ? "Hidden" : "Visible"}</td>
              <td className="border-b p-2 flex gap-2">
                {c.hidden ? (
                  <button onClick={() => handleUnhide(c._id)} className="text-green-500">Unhide</button>
                ) : (
                  <button onClick={() => handleHide(c._id)} className="text-red-500">Hide</button>
                )}
                <button onClick={() => handleDelete(c._id)} className="text-gray-500">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminDashboardLayout>
  );
}
