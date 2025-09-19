// src/components/DashboardCard.jsx
export default function DashboardCard({ title, description, actionLabel, onAction }) {
  return (
    <div className="border border-white/20 rounded-xl p-5 flex items-center justify-between bg-transparent hover:border-white/40 transition-colors">
      {/* Left side: title + description */}
      <div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="text-gray-400 text-sm">{description}</p>
      </div>

      {/* Right side: action button */}
      {actionLabel && (
        <button
          onClick={onAction}
          className="ml-4 px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
