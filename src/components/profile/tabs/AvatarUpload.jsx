import { useRef, useState } from "react";
import { Camera, Trash2, Loader } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { BACKEND_URL } from "../../../../config";
import DevstaAvatar from "../../dashboard/DevstaAvatar";

export default function AvatarUpload({ user }) {
  const { token, setUser } = useAuth();
  const fileRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const initials = (user?.name || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 1)
    .toUpperCase();

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5MB.");
      return;
    }

    setError("");
    setPreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      setLoading(true);
      const res = await fetch(`${BACKEND_URL}/api/users/avatar`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Upload failed");
      setUser(data.user);
      setPreview(null);
    } catch (err) {
      setError(err.message);
      setPreview(null);
    } finally {
      setLoading(false);
      // reset so same file can be re-selected
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Remove your profile picture?")) return;
    try {
      setLoading(true);
      const res = await fetch(`${BACKEND_URL}/api/users/avatar`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Delete failed");
      setUser(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const avatarSrc = preview || user?.avatarUrl;

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Avatar circle */}

<div className="relative group cursor-pointer" onClick={() => !loading && fileRef.current?.click()}>
  <DevstaAvatar user={user} size={96} hoverEffect={false} />

  {!loading && (
    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
      <Camera size={20} className="text-white" />
      <span className="text-white text-[10px] mt-1">Change</span>
    </div>
  )}

  {loading && (
    <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-full">
      <Loader size={22} className="text-white animate-spin" />
    </div>
  )}

  {user?.avatarUrl && !loading && (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); handleDelete(); }}
      className="absolute -bottom-1 -right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-md transition"
    >
      <Trash2 size={12} />
    </button>
  )}
</div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        disabled={loading}
        className="text-xs text-primary hover:underline disabled:opacity-50"
      >
        {user?.avatarUrl ? "Change photo" : "Upload photo"}
      </button>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}