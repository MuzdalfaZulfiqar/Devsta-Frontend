// src/components/company/ApplicationStatusBadge.jsx
export default function ApplicationStatusBadge({ status }) {
  const base = `
    inline-flex items-center justify-center
    px-3.5 py-1.5
    text-xs font-semibold tracking-wide
    rounded-full
    border
    shadow-sm
    whitespace-nowrap
    transition-all duration-200
  `;

  const variants = {
    pending: `
      bg-amber-100/80 text-amber-800
      border-amber-300/60
      ring-1 ring-amber-200/50
      hover:bg-amber-100 hover:ring-amber-300/70
    `,
    shortlisted: `
      bg-blue-100/80 text-blue-800
      border-blue-300/60
      ring-1 ring-blue-200/50
      hover:bg-blue-100 hover:ring-blue-300/70
    `,
    interviewing: `
      bg-purple-100/80 text-purple-800
      border-purple-300/60
      ring-1 ring-purple-200/50
      hover:bg-purple-100 hover:ring-purple-300/70
    `,
    rejected: `
      bg-rose-100/80 text-rose-800
      border-rose-300/60
      ring-1 ring-rose-200/50
      hover:bg-rose-100 hover:ring-rose-300/70
    `,
    hired: `
      bg-emerald-100/80 text-emerald-800
      border-emerald-300/60
      ring-1 ring-emerald-200/50
      hover:bg-emerald-100 hover:ring-emerald-300/70
    `,
    withdrawn: `
      bg-gray-200/70 text-gray-700
      border-gray-300/70
      hover:bg-gray-200/90
    `,
  };

  const defaultStyle = `
    bg-gray-100/80 text-gray-700
    border-gray-300/60
    ring-1 ring-gray-200/50
  `;

  const style = variants[status?.toLowerCase()] || defaultStyle;

  return (
    <span className={`${base} ${style}`}>
      {status
        ? status.charAt(0).toUpperCase() + status.slice(1)
        : 'Unknown'}
    </span>
  );
}