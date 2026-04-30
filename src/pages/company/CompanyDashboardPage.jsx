// src/pages/company/CompanyDashboardPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CompanyDashboardLayout from "../../components/company/CompanyDashboardLayout";
import { getJobStats } from "../../api/company/jobs";
import { Briefcase, PlusCircle, ArrowRight, TrendingUp, CheckCircle, XCircle } from "lucide-react";

export default function CompanyDashboardPage() {
  const company = JSON.parse(localStorage.getItem("companyInfo") || "{}");
  const [stats, setStats] = useState({ totalJobs: 0, activeJobs: 0, closedJobs: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchStats = async () => {
    setLoading(true);
    try {
      const data = await getJobStats();
      setStats(data);
    } catch (err) {
      console.error("Failed to load stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const statCards = [
    {
      label: "Total jobs posted",
      value: stats.totalJobs,
      icon: TrendingUp,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      valueColor: "text-gray-900",
      sub: "Since account created",
    },
    {
      label: "Active listings",
      value: stats.activeJobs,
      icon: CheckCircle,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      valueColor: "text-emerald-600",
      sub: "Currently accepting applications",
    },
    {
      label: "Closed jobs",
      value: stats.closedJobs,
      icon: XCircle,
      iconBg: "bg-gray-100",
      iconColor: "text-gray-400",
      valueColor: "text-gray-500",
      sub: "Filled or expired",
    },
  ];

  return (
    <CompanyDashboardLayout>
      <div className="max-w-6xl mx-auto px-2">

        {/* ── Page header ── */}
        <div className="mb-8">
          <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-1">
            Recruiter Dashboard
          </p>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {company?.companyName || "Company"}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Here's an overview of your recruitment activity.
          </p>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
          {statCards.map(({ label, value, icon: Icon, iconBg, iconColor, valueColor, sub }) => (
            <div
              key={label}
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col gap-4"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500">{label}</p>
                <span className={`w-9 h-9 rounded-lg ${iconBg} flex items-center justify-center`}>
                  <Icon size={16} className={iconColor} />
                </span>
              </div>
              <div>
                <p className={`text-4xl font-bold ${valueColor}`}>
                  {loading ? (
                    <span className="inline-block w-10 h-9 bg-gray-100 rounded animate-pulse" />
                  ) : (
                    value
                  )}
                </p>
                <p className="text-xs text-gray-400 mt-1.5">{sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Quick actions ── */}
        <div className="mb-10">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Quick actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => navigate("/company/jobs/new")}
              className="group flex items-center gap-4 bg-primary text-white rounded-xl p-5 hover:bg-primary/90 transition-colors shadow-sm text-left"
            >
              <span className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                <PlusCircle size={18} />
              </span>
              <div className="flex-1">
                <p className="font-semibold text-sm">Post new job</p>
                <p className="text-xs text-white/70 mt-0.5">Create a listing and start accepting applications</p>
              </div>
              <ArrowRight size={16} className="opacity-60 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => navigate("/company/jobs")}
              className="group flex items-center gap-4 bg-white border border-gray-200 rounded-xl p-5 hover:border-primary/40 hover:bg-gray-50/80 transition-colors shadow-sm text-left"
            >
              <span className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                <Briefcase size={18} className="text-gray-500" />
              </span>
              <div className="flex-1">
                <p className="font-semibold text-sm text-gray-800">View all jobs</p>
                <p className="text-xs text-gray-400 mt-0.5">Manage your active and closed listings</p>
              </div>
              <ArrowRight size={16} className="text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </button>
          </div>
        </div>

        {/* ── Tips / placeholder ── */}
        <div className="bg-gradient-to-br from-primary/5 to-emerald-50 border border-primary/20 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-primary mb-1">Pro tip</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            After posting a job, head to <span className="font-medium text-gray-800">Company Jobs</span> to
            configure coding challenges, send assessments to applicants, and manage your full recruitment pipeline
            from a single place.
          </p>
        </div>

      </div>
    </CompanyDashboardLayout>
  );
}
