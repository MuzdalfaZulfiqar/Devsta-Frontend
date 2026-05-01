// import React from "react";
// import { Briefcase, Clock3, Flame, Trophy } from "lucide-react";
// import { EmptyState, MetricCard, SectionCard } from "./SkillPageLayout";

// export default function ActivityTab({
//   metrics,
//   recentAchievements,
//   selectedRoadmapProgress,
//   activityItems,
// }) {
//   return (
//     <div className="space-y-6">
//       <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
//         <MetricCard
//           label="Recent wins"
//           value={recentAchievements.length}
//           helper="Latest achievements from all roadmaps"
//           icon={Trophy}
//         />
//         <MetricCard
//           label="Current streak"
//           value={selectedRoadmapProgress?.timeLogs?.length || 0}
//           helper="Logged learning sessions"
//           icon={Flame}
//         />
//         <MetricCard
//           label="Hours tracked"
//           value={metrics.hoursInvested30d || 0}
//           helper="Hours invested in the last 30 days"
//           icon={Clock3}
//         />
//         <MetricCard
//           label="Selected roadmap"
//           value={
//             selectedRoadmapProgress?.status
//               ? String(selectedRoadmapProgress.status).replace(/^\w/, (m) => m.toUpperCase())
//               : "Not started"
//           }
//           helper="Status of the selected roadmap"
//           icon={Briefcase}
//         />
//       </div>

//       <SectionCard
//         title="Learning activity"
//         subtitle="A combined view of your logged time and earned achievements for the selected roadmap."
//       >
//         {!activityItems.length ? (
//           <EmptyState
//             title="No activity yet"
//             subtitle="Once you start logging learning and completing lessons, your activity will appear here."
//           />
//         ) : (
//           <div className="space-y-4">
//             {activityItems.map((item, index) => (
//               <div
//                 key={`${item.type}-${index}-${item.date}`}
//                 className="rounded-[24px] border border-slate-200 bg-slate-50 p-5"
//               >
//                 <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
//                   <div className="flex items-start gap-4">
//                     <div
//                       className={`rounded-2xl p-3 ${
//                         item.type === "achievement" ? "bg-amber-100 text-amber-700" : "bg-sky-100 text-sky-700"
//                       }`}
//                     >
//                       {item.type === "achievement" ? <Trophy size={18} /> : <Clock3 size={18} />}
//                     </div>

//                     <div>
//                       <p className="text-base font-semibold text-slate-900">{item.title}</p>
//                       <p className="mt-1 text-sm text-slate-500">{item.subtitle}</p>
//                     </div>
//                   </div>

//                   <div className="flex flex-col items-start gap-2 sm:items-end">
//                     <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-500 ring-1 ring-slate-200">
//                       {item.type === "achievement" ? "Achievement" : "Time log"}
//                     </span>
//                     <p className="text-xs text-slate-400">
//                       {item.date ? new Date(item.date).toLocaleString() : "-"}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </SectionCard>

//       <SectionCard title="Achievement history" subtitle="A cleaner summary of recently unlocked achievements.">
//         {!recentAchievements.length ? (
//           <p className="text-sm text-slate-500">
//             No achievements yet. Complete lessons and milestones to build your activity history.
//           </p>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="min-w-full text-left text-sm">
//               <thead className="border-b border-slate-200 text-slate-500">
//                 <tr>
//                   <th className="px-3 py-3 font-medium">Date</th>
//                   <th className="px-3 py-3 font-medium">Item</th>
//                   <th className="px-3 py-3 font-medium">Impact</th>
//                   <th className="px-3 py-3 font-medium">Linked Skill</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {recentAchievements.map((item, index) => (
//                   <tr key={`${item.title}-${index}`} className="border-b border-slate-100">
//                     <td className="px-3 py-3 text-slate-600">
//                       {item.awardedAt ? new Date(item.awardedAt).toLocaleDateString() : "-"}
//                     </td>
//                     <td className="px-3 py-3 font-medium text-slate-900">{item.title}</td>
//                     <td className="px-3 py-3 text-slate-600">{item.impactScore || 0}</td>
//                     <td className="px-3 py-3 text-slate-600">{item.linkedSkill || "-"}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </SectionCard>
//     </div>
//   );
// }


import React from "react";
import { Briefcase, Clock3, Flame, Trophy } from "lucide-react";
import { EmptyState, SectionCard } from "./SkillPageLayout";

function ActivityMetricCard({ label, value, helper, icon: Icon, cardClass, iconClass, valueClass }) {
  return (
    <div className={`rounded-[24px] border p-4 shadow-sm sm:p-5 ${cardClass}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-700">{label}</p>
          <p className={`mt-3 break-words text-2xl font-bold leading-tight sm:text-3xl ${valueClass}`}>
            {value}
          </p>
        </div>

        {Icon ? (
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${iconClass}`}>
            <Icon size={18} />
          </div>
        ) : null}
      </div>

      <p className="mt-3 text-xs leading-5 text-slate-500">{helper}</p>
    </div>
  );
}

export default function ActivityTab({
  metrics,
  recentAchievements,
  selectedRoadmapProgress,
  activityItems,
}) {
  const selectedRoadmapStatus = selectedRoadmapProgress?.status
    ? String(selectedRoadmapProgress.status).replace(/^\w/, (m) => m.toUpperCase())
    : "Not started";

  const activityMetrics = [
    {
      label: "Recent wins",
      value: recentAchievements.length,
      helper: "Latest achievements from all roadmaps",
      icon: Trophy,
      cardClass: "border-amber-200 bg-amber-50",
      iconClass: "bg-amber-100 text-amber-700 ring-1 ring-amber-200",
      valueClass: "text-amber-700",
    },
    {
      label: "Current streak",
      value: selectedRoadmapProgress?.timeLogs?.length || 0,
      helper: "Logged learning sessions",
      icon: Flame,
      cardClass: "border-rose-200 bg-rose-50",
      iconClass: "bg-rose-100 text-rose-700 ring-1 ring-rose-200",
      valueClass: "text-rose-700",
    },
    {
      label: "Hours tracked",
      value: metrics.hoursInvested30d || 0,
      helper: "Hours invested in the last 30 days",
      icon: Clock3,
      cardClass: "border-sky-200 bg-sky-50",
      iconClass: "bg-sky-100 text-sky-700 ring-1 ring-sky-200",
      valueClass: "text-sky-700",
    },
    {
      label: "Selected roadmap",
      value: selectedRoadmapStatus,
      helper: "Status of the selected roadmap",
      icon: Briefcase,
      cardClass: "border-emerald-200 bg-emerald-50",
      iconClass: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200",
      valueClass: "text-emerald-700",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {activityMetrics.map((item) => (
          <ActivityMetricCard key={item.label} {...item} />
        ))}
      </div>

      <SectionCard
        title="Learning activity"
        subtitle="A combined view of your logged time and earned achievements for the selected roadmap."
      >
        {!activityItems.length ? (
          <EmptyState
            title="No activity yet"
            subtitle="Once you start logging learning and completing lessons, your activity will appear here."
          />
        ) : (
          <div className="space-y-4">
            {activityItems.map((item, index) => (
              <div
                key={`${item.type}-${index}-${item.date}`}
                className="rounded-[24px] border border-slate-200 bg-slate-50 p-5"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-4">
                    <div
                      className={`rounded-2xl p-3 ${
                        item.type === "achievement" ? "bg-amber-100 text-amber-700" : "bg-sky-100 text-sky-700"
                      }`}
                    >
                      {item.type === "achievement" ? <Trophy size={18} /> : <Clock3 size={18} />}
                    </div>

                    <div>
                      <p className="text-base font-semibold text-slate-900">{item.title}</p>
                      <p className="mt-1 text-sm text-slate-500">{item.subtitle}</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-start gap-2 sm:items-end">
                    <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-500 ring-1 ring-slate-200">
                      {item.type === "achievement" ? "Achievement" : "Time log"}
                    </span>
                    <p className="text-xs text-slate-400">
                      {item.date ? new Date(item.date).toLocaleString() : "-"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      <SectionCard title="Achievement history" subtitle="A cleaner summary of recently unlocked achievements.">
        {!recentAchievements.length ? (
          <p className="text-sm text-slate-500">
            No achievements yet. Complete lessons and milestones to build your activity history.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="px-3 py-3 font-medium">Date</th>
                  <th className="px-3 py-3 font-medium">Item</th>
                  <th className="px-3 py-3 font-medium">Impact</th>
                  <th className="px-3 py-3 font-medium">Linked Skill</th>
                </tr>
              </thead>

              <tbody>
                {recentAchievements.map((item, index) => (
                  <tr key={`${item.title}-${index}`} className="border-b border-slate-100">
                    <td className="px-3 py-3 text-slate-600">
                      {item.awardedAt ? new Date(item.awardedAt).toLocaleDateString() : "-"}
                    </td>
                    <td className="px-3 py-3 font-medium text-slate-900">{item.title}</td>
                    <td className="px-3 py-3 text-slate-600">{item.impactScore || 0}</td>
                    <td className="px-3 py-3 text-slate-600">{item.linkedSkill || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>
    </div>
  );
}
