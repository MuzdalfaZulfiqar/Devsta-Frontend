import { useState, useEffect } from "react";
import AdminDashboardLayout from "../../components/admin/AdminDashboardLayout";
import { Megaphone, Trash2, PlusCircle, Send } from "lucide-react";
import { showToast } from "../../utils/toast";
import ConfirmModal from "../../components/ConfirmModal";
import {
    fetchAnnouncements,
    createAnnouncement,
    deleteAnnouncement,
    postAnnouncement,
} from "../../api/admin";

import Select from "react-select";

// Category options
const categoryOptions = [
    { value: "General", label: "General" },
    { value: "Maintenance", label: "Maintenance" },
    { value: "News", label: "News" },
    { value: "Other", label: "Other" },
];


export default function AdminAnnouncementsPage() {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalData, setModalData] = useState({ id: null });

    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [category, setCategory] = useState("General");

    const token = localStorage.getItem("adminToken");

    // Load announcements
    const loadAnnouncements = async () => {
        try {
            setLoading(true);
            const data = await fetchAnnouncements(token);
            setAnnouncements(data || []);
        } catch (err) {
            showToast("Failed to load announcements", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAnnouncements();
    }, [token]);

    // Create new announcement (draft by default)
    const handleCreate = async (e) => {
        e.preventDefault();
        if (!title.trim() || !message.trim()) {
            showToast("Title and message are required", "error");
            return;
        }
        try {
            await createAnnouncement({ title, message, category }, token);
            showToast("Announcement created", "success");
            setTitle("");
            setMessage("");
            setCategory("General");
            loadAnnouncements();
        } catch (err) {
            showToast("Failed to create announcement", "error");
        }
    };

    // Post announcement to platform (status = live)
    const handlePost = async (id) => {
        try {
            await postAnnouncement(id, token);
            showToast("Announcement posted to platform", "success");
            loadAnnouncements();
        } catch (err) {
            showToast("Failed to post announcement", "error");
        }
    };

    // Delete announcement
    const handleDelete = async () => {
        try {
            await deleteAnnouncement(modalData.id, token);
            showToast("Announcement deleted", "success");
            setModalData({ id: null });
            loadAnnouncements();
        } catch (err) {
            showToast("Delete failed", "error");
        }
    };

    const selectStyles = {
        control: (base, state) => ({
            ...base,
            backgroundColor: "transparent",
            borderColor: state.isFocused ? "#086972" : "#d1d5db",
            borderRadius: "0.5rem",
            boxShadow: "none",
            "&:hover": { borderColor: "#086972" },
            minHeight: "42px",
            transition: "border-color 0.2s ease",
        }),
        menu: (base) => ({ ...base, backgroundColor: "#ffffff", color: "#000000", zIndex: 50 }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected ? "#086972" : state.isFocused ? "#e6f4f1" : "#ffffff",
            color: state.isSelected ? "#ffffff" : "#000000",
            cursor: "pointer",
        }),
        singleValue: (base) => ({ ...base, color: "#111827" }),
        placeholder: (base) => ({ ...base, color: "#9ca3af" }),
    };

    return (
        <AdminDashboardLayout>
            <div className="max-w-6xl mx-auto px-4 py-8">

                {/* HEADER */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Announcement Management
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Create and manage platform-wide updates.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Megaphone className="w-6 h-6 text-primary" />
                        <span className="text-gray-600 dark:text-gray-300 font-medium">Total:</span>
                        <span className="text-2xl font-bold text-primary">{announcements.length}</span>
                    </div>
                </div>

                {/* CREATE FORM */}
                <form
                    onSubmit={handleCreate}
                    className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-lg mb-10"
                >
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                        <PlusCircle className="w-5 h-5 text-primary" />
                        Create Announcement
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-gray-600 dark:text-gray-400 font-medium">Title</label>
                            <input
                                className="w-full mt-1 p-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Platform update..."
                            />
                        </div>


                        <div>
                            <label className="text-gray-600 dark:text-gray-400 font-medium">Category</label>
                            <Select
                                options={categoryOptions}
                                value={categoryOptions.find((c) => c.value === category)}
                                onChange={(sel) => setCategory(sel?.value || "General")}
                                placeholder="Select category"
                                styles={selectStyles}
                                isSearchable={false} // optional: disable search for categories
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="text-gray-600 dark:text-gray-400 font-medium">Message</label>
                            <textarea
                                className="w-full mt-1 p-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 h-32"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Write the announcement message..."
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="mt-6 px-6 py-3 bg-primary text-white rounded-xl shadow-md hover:bg-primary/90"
                    >
                        Create Announcement
                    </button>
                </form>

                {/* ANNOUNCEMENTS LIST */}
                <div className="bg-white dark:bg-black rounded-2xl border border-gray-200 dark:border-gray-800 shadow-lg">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                            <Megaphone className="w-5 h-5 text-primary" /> All Announcements
                        </h2>
                    </div>

                    <div>
                        {loading ? (
                            <div className="p-6 text-gray-500">Loading...</div>
                        ) : announcements.length === 0 ? (
                            <div className="p-10 text-center text-gray-500 dark:text-gray-400">No announcements yet.</div>
                        ) : (
                            announcements.map((a) => (
                                <div
                                    key={a._id}
                                    className="p-6 border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/40 transition"
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{a.title}</h3>
                                            <p className="text-gray-700 dark:text-gray-300 mt-1">{a.message}</p>
                                            {a.category && (
                                                <span className="mt-2 text-sm text-primary font-medium">{a.category}</span>
                                            )}
                                            <div className="text-xs text-gray-400 mt-2">
                                                Status: {a.status === "live" ? "Posted" : "Draft"} | Sent: {new Date(a.createdAt).toLocaleString()}
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            {a.status === "draft" && (
                                                <button
                                                    onClick={() => handlePost(a._id)}
                                                    className="p-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow"
                                                    title="Post on Platform"
                                                >
                                                    <Send size={16} />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => setModalData({ id: a._id })}
                                                className="p-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow"
                                                title="Delete Announcement"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* DELETE CONFIRM MODAL */}
                {modalData.id && (
                    <ConfirmModal
                        open={true}
                        title="Delete Announcement?"
                        message="This action cannot be undone."
                        confirmLabel="Delete"
                        cancelLabel="Cancel"
                        onConfirm={handleDelete}
                        onCancel={() => setModalData({ id: null })}
                    />
                )}

            </div>
        </AdminDashboardLayout>
    );
}
