// src/pages/admin/AdminDashboardPage.jsx
import { useEffect, useState } from "react";
import AdminDashboardLayout from "../../components/admin/AdminDashboardLayout";
import { fetchAnalytics } from "../../api/admin";
import { Users, FileText, ShieldOff, TrendingUp, Activity } from "lucide-react";
import { showToast } from "../../utils/toast";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPosts: 0,
    blockedUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    const loadAnalytics = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await fetchAnalytics(token);
        setStats(data || { totalUsers: 0, totalPosts: 0, blockedUsers: 0 });
      } catch (err) {
        showToast("Failed to load dashboard data", "error");
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, [token]);

  const StatCard = ({ title, value, icon: Icon, trend }) => (
    <div className="group relative bg-white dark:bg-black border border-primary/20 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-primary/40">
      {/* Subtle background glow on hover */}
      <div className="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="relative flex items-center justify-between">
        <div>
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium tracking-wider uppercase">
            {title}
          </p>
          <p className="text-4xl font-bold text-gray-900 dark:text-white mt-3 tracking-tight">
            {loading ? "—" : value.toLocaleString()}
          </p>
          {trend && (
            <div className="flex items-center gap-2 mt-3 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <TrendingUp size={14} />
              <span>Growing</span>
            </div>
          )}
        </div>
        <div className="p-4 rounded-xl bg-primary/10 text-primary">
          <Icon size={28} />
        </div>
      </div>
    </div>
  );

  return (
    <AdminDashboardLayout>
      <div className="max-w-7xl mx-auto px-4 py-8 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
            Dashboard
          </h1>
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
            Welcome back! Here's what's happening on your platform today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard title="Total Users" value={stats.totalUsers} icon={Users} trend />
          <StatCard title="Total Posts" value={stats.totalPosts} icon={FileText} trend />
          <StatCard title="Blocked Users" value={stats.blockedUsers} icon={ShieldOff} />
        </div>

        {/* Hero Section – Clean & Brand-Aligned */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 p-10 lg:p-14">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 opacity-10">
            <Activity size={300} className="text-primary" />
          </div>

          <div className="relative max-w-4xl">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Your community is thriving
            </h2>
            <p className="text-lg lg:text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-10">
              With <span className="font-bold text-primary">{stats.totalUsers.toLocaleString()} registered users</span> and{" "}
              <span className="font-bold text-primary">{stats.totalPosts.toLocaleString()} posts</span>, your platform is growing stronger every day.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="/admin/users"
                className="inline-flex items-center gap-3 px-7 py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-md hover:shadow-lg"
              >
                <Users size={20} />
                Manage Users
              </a>
              <a
                href="/admin/posts"
                className="inline-flex items-center gap-3 px-7 py-4 bg-white dark:bg-gray-900 text-primary font-semibold rounded-xl border border-primary/30 hover:bg-primary/5 dark:hover:bg-primary/10 transition-all shadow-md"
              >
                <FileText size={20} />
                Moderate Posts
              </a>
            </div>
          </div>
        </div>

        {/* Activity Indicator */}
        <div className="mt-12 flex items-center justify-center gap-3 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span>Platform is healthy</span>
          </div>
          <span className="hidden sm:inline">•</span>
          <span>
            Last updated: {new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}