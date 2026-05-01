import React from "react";

export function MetricCard({ label, value, helper, icon: Icon }) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        {Icon ? (
          <div className="rounded-xl bg-slate-100 p-2 text-slate-600">
            <Icon size={16} />
          </div>
        ) : null}
      </div>
      <p className="mt-4 break-words text-3xl font-semibold text-slate-900">{value}</p>
      <p className="mt-2 text-xs leading-5 text-slate-400">{helper}</p>
    </div>
  );
}

export function SectionCard({ title, subtitle, rightNode = null, children, className = "" }) {
  return (
    <div className={`rounded-[28px] border border-slate-200 bg-white shadow-sm ${className}`}>
      <div className="flex flex-col gap-4 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
        </div>
        {rightNode}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

export function EmptyState({ title, subtitle, actionLabel, onAction }) {
  return (
    <div className="rounded-[28px] border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
      {actionLabel ? (
        <button
          type="button"
          onClick={onAction}
          className="mt-5 rounded-2xl bg-primary px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
