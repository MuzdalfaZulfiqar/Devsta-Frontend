import { useEffect, useState, useMemo } from "react";
import AdminDashboardLayout from "../../components/admin/AdminDashboardLayout";
import DevstaAvatar from "../../components/dashboard/DevstaAvatar";
import { fetchAllUsers, blockUser, unblockUser, deleteUser } from "../../api/admin";
import { Search, Shield, ShieldOff, Trash2, AlertCircle, UserX, UserCheck, Users } from "lucide-react";
import { showToast } from "../../utils/toast";
import ConfirmModal from "../../components/ConfirmModal";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalData, setModalData] = useState({ action: null, userId: null, userName: "" });
  const token = localStorage.getItem("adminToken");

  const loadUsers = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const data = await fetchAllUsers(token);
      setUsers(data || []);
    } catch (err) {
      showToast("Failed to load users", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [token]);

  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;
    const term = searchTerm.toLowerCase();
    return users.filter(
      (u) =>
        u.name?.toLowerCase().includes(term) ||
        u.username?.toLowerCase().includes(term) ||
        u.email?.toLowerCase().includes(term)
    );
  }, [users, searchTerm]);

  const openConfirmModal = (action, userId, userName = "this user") => {
    setModalData({ action, userId, userName });
  };

  const closeConfirmModal = () => setModalData({ action: null, userId: null, userName: "" });

  const handleConfirm = async () => {
    const { action, userId, userName } = modalData;
    try {
      if (action === "block") {
        await blockUser(userId, token);
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, isBlocked: true } : u))
        );
        showToast(`"${userName}" has been blocked`, "success");
      } else if (action === "unblock") {
        await unblockUser(userId, token);
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, isBlocked: false } : u))
        );
        showToast(`"${userName}" has been unblocked`, "success");
      } else if (action === "delete") {
        await deleteUser(userId, token);
        setUsers((prev) => prev.filter((u) => u._id !== userId));
        showToast(`"${userName}" deleted permanently`, "success");
      }
    } catch (err) {
      showToast("Action failed", "error");
      loadUsers();
    } finally {
      closeConfirmModal();
    }
  };

  return (
    <AdminDashboardLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header with Total Users */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Users Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage and moderate all platform users
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium">
            <Users className="w-5 h-5 text-primary" />
            <span className="text-gray-600 dark:text-gray-400">
              Total Users:
            </span>
            <span className="text-2xl font-bold text-primary">
              {users.length}
            </span>
            {searchTerm && filteredUsers.length !== users.length && (
              <span className="text-gray-500 dark:text-gray-400">
                → Showing {filteredUsers.length}
              </span>
            )}
          </div>
        </div>

        {/* Enhanced Search Bar */}
        <div className="max-w-2xl mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, username, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-12 py-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition shadow-sm"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ×
              </button>
            )}
            {searchTerm && (
              <div className="absolute -top-3 left-4 px-2 bg-white dark:bg-black text-xs font-medium text-primary">
                {filteredUsers.length} result{filteredUsers.length !== 1 ? "s" : ""}
              </div>
            )}
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white dark:bg-black rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {loading ? (
                  Array(6)
                    .fill()
                    .map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="px-6 py-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800" />
                            <div>
                              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-40" />
                              <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-24 mt-2" />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-6">
                          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-48" />
                        </td>
                        <td className="px-6 py-6">
                          <div className="h-7 w-20 bg-gray-200 dark:bg-gray-800 rounded-full" />
                        </td>
                        <td className="px-6 py-6">
                          <div className="flex gap-2">
                            <div className="h-9 w-9 bg-gray-200 dark:bg-gray-800 rounded-lg" />
                            <div className="h-9 w-9 bg-gray-200 dark:bg-gray-800 rounded-lg" />
                          </div>
                        </td>
                      </tr>
                    ))
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-20">
                      <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg text-gray-500 dark:text-gray-400">
                        {searchTerm ? "No users match your search" : "No users found"}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr
                      key={user._id}
                      className={`hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-all ${
                        user.isBlocked ? "bg-red-50/40 dark:bg-red-900/10" : ""
                      }`}
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <DevstaAvatar user={user} size={40} />
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {user.name || "Unnamed User"}
                            </div>
                            {user.username && (
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                @{user.username}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5 text-gray-600 dark:text-gray-400">
                        {user.email || "—"}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${
                            user.isBlocked
                              ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                              : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                          }`}
                        >
                          {user.isBlocked ? <ShieldOff size={14} /> : <Shield size={14} />}
                          {user.isBlocked ? "BLOCKED" : "ACTIVE"}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          {user.isBlocked ? (
                            <button
                              onClick={() =>
                                openConfirmModal("unblock", user._id, user.name || user.email)
                              }
                              className="p-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg transition shadow-sm"
                              title="Unblock user"
                            >
                              <UserCheck size={16} />
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                openConfirmModal("block", user._id, user.name || user.email)
                              }
                              className="p-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg transition shadow-sm"
                              title="Block user"
                            >
                              <UserX size={16} />
                            </button>
                          )}

                          <button
                            onClick={() =>
                              openConfirmModal("delete", user._id, user.name || user.email)
                            }
                            className="p-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition shadow-sm"
                            title="Delete user"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Confirm Modal - Fixed HTML rendering */}
        {modalData.action && (
          <ConfirmModal
            open={true}
            title={`Confirm ${modalData.action} user?`}
            message={
              <div className="space-y-2 text-gray-700 dark:text-gray-300">
                {modalData.action === "block" && (
                  <>
                    This will block <strong className="text-primary font-semibold">{modalData.userName}</strong> from accessing the platform.
                    <br />
                    <span className="text-sm text-gray-500">They will be logged out and unable to sign in.</span>
                  </>
                )}
                {modalData.action === "unblock" && (
                  <>
                    This will unblock <strong className="text-emerald-600 font-semibold">{modalData.userName}</strong> and restore full access.
                  </>
                )}
                {modalData.action === "delete" && (
                  <>
                    This will <strong className="text-red-600">permanently delete</strong>{" "}
                    <strong className="text-red-600 font-semibold">{modalData.userName}</strong>.
                    <br />
                    <span className="text-sm text-red-600 font-medium">This action cannot be undone.</span>
                  </>
                )}
              </div>
            }
            confirmLabel={modalData.action === "delete" ? "Delete Forever" : "Confirm"}
            cancelLabel="Cancel"
            onConfirm={handleConfirm}
            onCancel={closeConfirmModal}
            destructive={modalData.action === "delete"}
            confirmButtonClass={
              modalData.action === "delete"
                ? "bg-red-600 hover:bg-red-700"
                : "bg-primary hover:bg-primary/90"
            }
          />
        )}
      </div>
    </AdminDashboardLayout>
  );
}