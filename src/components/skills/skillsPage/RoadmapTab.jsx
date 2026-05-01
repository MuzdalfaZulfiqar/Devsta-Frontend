// import React, { useMemo } from "react";
// import { ExternalLink } from "lucide-react";
// import { EmptyState, SectionCard } from "./SkillPageLayout";
// import {
//   getDisplayResources,
//   getGoalTitleFromRoadmap,
//   getRoadmapCompletion,
//   getRoadmapDotClass,
//   getRoadmapStatus,
//   normalizeResourceProvider,
// } from "./skillPageUtils";

// const RESOURCE_LOGO_CONFIG = {
//   youtube: {
//     label: "YouTube",
//     logo: "▶",
//     className: "bg-red-50 text-red-600 ring-red-100",
//   },
//   udemy: {
//     label: "Udemy",
//     logo: "U",
//     className: "bg-violet-50 text-violet-700 ring-violet-100",
//   },
//   coursera: {
//     label: "Coursera",
//     logo: "C",
//     className: "bg-blue-50 text-blue-700 ring-blue-100",
//   },
//   documentation: {
//     label: "MDN Docs",
//     logo: "MDN",
//     className: "bg-slate-100 text-slate-700 ring-slate-200",
//   },
//   mdn: {
//     label: "MDN Docs",
//     logo: "MDN",
//     className: "bg-slate-100 text-slate-700 ring-slate-200",
//   },
//   default: {
//     label: "Resource",
//     logo: "R",
//     className: "bg-slate-100 text-slate-700 ring-slate-200",
//   },
// };

// function ResourceLogo({ providerKey }) {
//   const config = RESOURCE_LOGO_CONFIG[providerKey] || RESOURCE_LOGO_CONFIG.default;

//   return (
//     <span
//       className={`inline-flex h-9 min-w-9 items-center justify-center rounded-2xl px-2 text-xs font-black ring-1 ${config.className}`}
//       title={config.label}
//       aria-label={config.label}
//     >
//       {config.logo}
//     </span>
//   );
// }

// function ResourceCard({ resource }) {
//   const providerKey = normalizeResourceProvider(resource.provider);

//   return (
//     <a
//       href={resource.url}
//       target="_blank"
//       rel="noreferrer"
//       className="group flex min-h-[150px] flex-col rounded-[20px] border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-sm"
//     >
//       <div className="flex items-start justify-between gap-3">
//         <ResourceLogo providerKey={providerKey} />
//         <ExternalLink size={16} className="shrink-0 text-slate-400 transition group-hover:text-slate-700" />
//       </div>

//       <p className="mt-3 line-clamp-3 break-words text-sm font-semibold leading-5 text-slate-900">
//         {resource.title || "Open learning resource"}
//       </p>

//       <p className="mt-auto pt-3 text-xs leading-5 text-slate-500">
//         {resource.durationLabel || "Open resource"} • ⭐ {resource.rating || "-"}
//         {resource.isPaid ? " • Paid" : " • Free"}
//       </p>
//     </a>
//   );
// }

// function RoadmapKpiCard({ label, value }) {
//   return (
//     <div className="min-w-0 rounded-2xl bg-slate-50 p-4">
//       <p className="break-words text-[11px] font-semibold uppercase tracking-wide text-slate-400 sm:text-xs">
//         {label}
//       </p>
//       <p className="mt-2 break-words text-base font-semibold leading-tight text-slate-900 sm:text-lg">
//         {value}
//       </p>
//     </div>
//   );
// }

// function RoadmapDetails({
//   roadmap,
//   progress,
//   metrics,
//   completedLessonIds,
//   roadmapActionLoading,
//   expandedMilestoneIds,
//   onToggleMilestone,
//   onStartRoadmap,
//   onAddQuickLog,
//   onCompleteLesson,
// }) {
//   const selectedRoadmapSkills = useMemo(() => {
//     const skills = [...(roadmap?.targetSkills || []), ...(roadmap?.prerequisites || [])]
//       .map((item) => String(item || "").trim())
//       .filter(Boolean);

//     return Array.from(new Set(skills));
//   }, [roadmap]);

//   if (!roadmap) {
//     return (
//       <EmptyState
//         title="Select a roadmap"
//         subtitle="Choose any roadmap from the left side to display its details here."
//       />
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div className="rounded-[28px] border border-slate-200 bg-white p-4 sm:p-6">
//         <div className="grid grid-cols-1 gap-5 2xl:grid-cols-[minmax(0,1fr)_minmax(260px,420px)]">
//           <div className="min-w-0">
//             <div className="flex flex-wrap items-center gap-2">
//               <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-600">
//                 {roadmap.difficulty || "Intermediate"}
//               </span>

//               <span className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary">
//                 {getGoalTitleFromRoadmap(roadmap)}
//               </span>
//             </div>

//             <h3 className="mt-4 break-words text-xl font-semibold text-slate-900 sm:text-2xl">
//               {roadmap.title}
//             </h3>

//             <p className="mt-2 break-words text-sm leading-6 text-slate-500">
//               {roadmap.summary}
//             </p>

//             {selectedRoadmapSkills.length ? (
//               <div className="mt-5">
//                 <p className="text-sm font-semibold text-slate-900">Skills & prerequisites</p>
//                 <div className="mt-3 flex flex-wrap gap-2">
//                   {selectedRoadmapSkills.map((item) => (
//                     <span key={item} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs text-slate-600">
//                       {item}
//                     </span>
//                   ))}
//                 </div>
//               </div>
//             ) : null}
//           </div>

//           <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-2">
//             <RoadmapKpiCard label="Total hours" value={roadmap.estimatedHours || 0} />
//             <RoadmapKpiCard label="ETA" value={`${roadmap.etaWeeks || 0} wks`} />
//             <RoadmapKpiCard label="Score lift" value={`+${roadmap.projectedSkillScoreLift || 0}`} />
//             <RoadmapKpiCard
//               label="Progress"
//               value={`${progress?.metrics?.pathCompletionPercent || metrics.pathCompletionPercent || 0}%`}
//             />
//           </div>
//         </div>

//         <div className="mt-5 flex flex-wrap gap-3">
//           {!progress ? (
//             <button
//               type="button"
//               onClick={() => onStartRoadmap(roadmap._id)}
//               disabled={roadmapActionLoading === `init-${roadmap._id}`}
//               className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
//             >
//               {roadmapActionLoading === `init-${roadmap._id}` ? "Starting..." : "Start roadmap"}
//             </button>
//           ) : (
//             <button
//               type="button"
//               onClick={() => onAddQuickLog(roadmap._id)}
//               disabled={roadmapActionLoading === `timelog-${roadmap._id}`}
//               className="rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
//             >
//               {roadmapActionLoading === `timelog-${roadmap._id}` ? "Saving..." : "Add quick 1 hour log"}
//             </button>
//           )}
//         </div>
//       </div>

//       <SectionCard
//         title="Milestones and lessons"
//         subtitle="Press > on a milestone to view lessons, resources, and learning details."
//       >
//         <div className="space-y-5">
//           {(roadmap.milestones || []).map((milestone, milestoneIndex) => {
//             const milestoneLessons = milestone.lessons || [];
//             const milestoneDone =
//               milestoneLessons.length > 0 &&
//               milestoneLessons.every((lesson) => completedLessonIds.has(String(lesson._id)));

//             const milestoneKey = String(milestone._id || `${roadmap._id}-${milestoneIndex}`);
//             const milestoneExpanded = expandedMilestoneIds.includes(milestoneKey);

//             return (
//               <div key={milestoneKey} className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
//                 <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
//                   <div className="min-w-0 flex-1">
//                     <div className="flex flex-wrap items-center gap-2">
//                       <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-500 ring-1 ring-slate-200">
//                         Milestone {milestoneIndex + 1}
//                       </span>

//                       <span
//                         className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
//                           milestoneDone ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
//                         }`}
//                       >
//                         {milestoneDone ? "Completed" : "In progress"}
//                       </span>
//                     </div>

//                     <h4 className="mt-3 break-words text-lg font-semibold text-slate-900">{milestone.title}</h4>
//                   </div>

//                   <button
//                     type="button"
//                     onClick={() => onToggleMilestone(milestoneKey)}
//                     className="shrink-0 px-1 text-2xl font-bold leading-none text-primary transition hover:scale-110"
//                     aria-label={milestoneExpanded ? "Hide milestone details" : "Show milestone details"}
//                   >
//                     {milestoneExpanded ? "<" : ">"}
//                   </button>
//                 </div>

//                 {milestoneExpanded ? (
//                   <div className="mt-5 space-y-4">
//                     {milestone.summary ? <p className="break-words text-sm text-slate-500">{milestone.summary}</p> : null}

//                     {milestoneLessons.map((lesson) => {
//                       const lessonDone = completedLessonIds.has(String(lesson._id));
//                       const isLoading = roadmapActionLoading === `lesson-${lesson._id}`;
//                       const displayResources = getDisplayResources({ lesson, milestone, roadmap });

//                       return (
//                         <div key={lesson._id} className="rounded-[24px] border border-slate-200 bg-white p-5">
//                           <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
//                             <div className="min-w-0 flex-1">
//                               <div className="flex flex-wrap items-center gap-2">
//                                 <h5 className="break-words text-base font-semibold text-slate-900">{lesson.title}</h5>

//                                 <span
//                                   className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
//                                     lessonDone ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
//                                   }`}
//                                 >
//                                   {lessonDone ? "Completed" : "Not completed"}
//                                 </span>

//                                 {lesson.status ? (
//                                   <span className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold capitalize text-primary">
//                                     {lesson.status}
//                                   </span>
//                                 ) : null}
//                               </div>

//                               {lesson.goal ? <p className="mt-2 break-words text-sm text-slate-500">{lesson.goal}</p> : null}

//                               <div className="mt-4 flex flex-wrap gap-2">
//                                 {(lesson.topics || []).map((topic) => (
//                                   <span key={topic} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs text-slate-600">
//                                     {topic}
//                                   </span>
//                                 ))}
//                               </div>

//                               {lesson.practice ? (
//                                 <p className="mt-4 break-words text-xs leading-5 text-slate-500">
//                                   <span className="font-semibold text-slate-700">Practice:</span> {lesson.practice}
//                                 </p>
//                               ) : null}

//                               {lesson.miniProject ? (
//                                 <p className="mt-1 break-words text-xs leading-5 text-slate-500">
//                                   <span className="font-semibold text-slate-700">Mini project:</span> {lesson.miniProject}
//                                 </p>
//                               ) : null}
//                             </div>

//                             <div className="flex w-full flex-col gap-3 xl:w-[220px]">
//                               <button
//                                 type="button"
//                                 onClick={() => !lessonDone && onCompleteLesson(roadmap._id, lesson)}
//                                 disabled={lessonDone || isLoading || !progress}
//                                 className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
//                                   lessonDone
//                                     ? "cursor-not-allowed bg-emerald-100 text-emerald-700"
//                                     : "bg-primary text-white hover:opacity-90 disabled:opacity-60"
//                                 }`}
//                               >
//                                 {lessonDone ? "Completed" : isLoading ? "Saving..." : progress ? "Log learning" : "Start roadmap first"}
//                               </button>
//                             </div>
//                           </div>

//                           {displayResources.length ? (
//                             <div className="mt-5">
//                               <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
//                                 <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
//                                   Recommended resources
//                                 </p>

//                                 <div className="flex flex-wrap items-center gap-2">
//                                   {displayResources.map((resource, index) => (
//                                     <ResourceLogo
//                                       key={`${resource.provider}-${index}`}
//                                       providerKey={normalizeResourceProvider(resource.provider)}
//                                     />
//                                   ))}
//                                 </div>
//                               </div>

//                               <div className="grid grid-cols-1 gap-3 md:grid-cols-2 2xl:grid-cols-4">
//                                 {displayResources.map((resource, resourceIndex) => (
//                                   <ResourceCard
//                                     key={`${resource.provider}-${resource.title}-${resourceIndex}`}
//                                     resource={resource}
//                                   />
//                                 ))}
//                               </div>
//                             </div>
//                           ) : null}
//                         </div>
//                       );
//                     })}
//                   </div>
//                 ) : null}
//               </div>
//             );
//           })}
//         </div>
//       </SectionCard>
//     </div>
//   );
// }

// export default function RoadmapTab({
//   roadmaps,
//   selectedRoadmapId,
//   selectedRoadmapProgress,
//   selectedRoadmap,
//   metrics,
//   completedLessonIds,
//   expandedRoadmapIds,
//   expandedMilestoneIds,
//   roadmapActionLoading,
//   onCreateTarget,
//   onSelectRoadmap,
//   onToggleRoadmap,
//   onToggleMilestone,
//   onStartRoadmap,
//   onAddQuickLog,
//   onCompleteLesson,
// }) {
//   return (
//     <div className="w-full space-y-6">
//       <SectionCard
//         title="Roadmap"
//         subtitle="All roadmaps appear on the left. Select one to view details on the right."
//         className="w-full"
//       >
//         {!roadmaps.length ? (
//           <EmptyState
//             title="No roadmap generated yet"
//             subtitle="Generate your journey after saving a target to unlock roadmap plans."
//             actionLabel="Create target"
//             onAction={onCreateTarget}
//           />
//         ) : (
//           <div className="grid w-full grid-cols-1 items-start gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
//             <div className="w-full space-y-3">
//               <div className="flex flex-col gap-3 px-1 sm:flex-row sm:items-center sm:justify-between">
//                 <p className="text-sm font-semibold text-slate-900">All roadmaps</p>

//                 <div className="flex flex-wrap gap-2 text-[11px] font-medium text-slate-500">
//                   <span className="inline-flex items-center gap-1.5">
//                     <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
//                     Selected
//                   </span>
//                   <span className="inline-flex items-center gap-1.5">
//                     <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
//                     Active
//                   </span>
//                   <span className="inline-flex items-center gap-1.5">
//                     <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
//                     Completed
//                   </span>
//                 </div>
//               </div>

//               {roadmaps.map((roadmap) => {
//                 const selected = String(roadmap._id) === String(selectedRoadmapId);
//                 const roadmapExpanded = expandedRoadmapIds.includes(String(roadmap._id));
//                 const roadmapStatus = getRoadmapStatus(roadmap, selected ? selectedRoadmapProgress : null);
//                 const completion = getRoadmapCompletion(roadmap, selected ? selectedRoadmapProgress : null);

//                 const cardClass =
//                   roadmapStatus === "completed"
//                     ? "border-emerald-200 bg-emerald-50 hover:bg-emerald-100/70"
//                     : selected
//                     ? "border-amber-200 bg-white hover:bg-slate-50"
//                     : "border-slate-200 bg-slate-50 hover:bg-slate-100";

//                 return (
//                   <div key={roadmap._id} className={`w-full rounded-[22px] border p-4 text-left transition ${cardClass}`}>
//                     <div className="flex items-start gap-3">
//                       <span
//                         className={`mt-1 h-3 w-3 shrink-0 rounded-full ring-4 ${getRoadmapDotClass(
//                           roadmap,
//                           selected ? selectedRoadmapProgress : null,
//                           selected
//                         )}`}
//                       />

//                       <button type="button" onClick={() => onSelectRoadmap(roadmap)} className="min-w-0 flex-1 text-left">
//                         <h3 className="line-clamp-2 text-sm font-semibold text-slate-900">{roadmap.title}</h3>
//                         <p className="mt-1 line-clamp-1 text-xs text-slate-500">
//                           {getGoalTitleFromRoadmap(roadmap)} • {completion}% complete
//                         </p>
//                       </button>

//                       <button
//                         type="button"
//                         onClick={() => onToggleRoadmap(roadmap._id)}
//                         className="shrink-0 px-1 text-2xl font-bold leading-none text-primary transition hover:scale-110"
//                         aria-label={roadmapExpanded ? "Hide roadmap details" : "Show roadmap details"}
//                       >
//                         {roadmapExpanded ? "<" : ">"}
//                       </button>
//                     </div>

//                     {roadmapExpanded ? (
//                       <div className="mt-3 pl-6">
//                         <p className="line-clamp-3 text-xs leading-5 text-slate-500">
//                           {roadmap.summary || "No roadmap description available yet."}
//                         </p>

//                         <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-medium text-slate-500">
//                           <span className="rounded-full bg-white px-2.5 py-1 ring-1 ring-current/10">
//                             {roadmap.difficulty || "Roadmap"}
//                           </span>
//                           <span className="rounded-full bg-white px-2.5 py-1 ring-1 ring-current/10">
//                             {roadmap.estimatedHours || 0} hrs
//                           </span>
//                           <span className="rounded-full bg-white px-2.5 py-1 ring-1 ring-current/10">
//                             {roadmap.etaWeeks || 0} wks
//                           </span>
//                         </div>
//                       </div>
//                     ) : null}
//                   </div>
//                 );
//               })}
//             </div>

//             <div className="min-w-0">
//               <RoadmapDetails
//                 roadmap={selectedRoadmap}
//                 progress={selectedRoadmapProgress}
//                 metrics={metrics}
//                 completedLessonIds={completedLessonIds}
//                 roadmapActionLoading={roadmapActionLoading}
//                 expandedMilestoneIds={expandedMilestoneIds}
//                 onToggleMilestone={onToggleMilestone}
//                 onStartRoadmap={onStartRoadmap}
//                 onAddQuickLog={onAddQuickLog}
//                 onCompleteLesson={onCompleteLesson}
//               />
//             </div>
//           </div>
//         )}
//       </SectionCard>
//     </div>
//   );
// }

import React, { useMemo } from "react";
import { ExternalLink } from "lucide-react";
import { EmptyState, SectionCard } from "./SkillPageLayout";
import {
  getDisplayResources,
  getGoalTitleFromRoadmap,
  getRoadmapCompletion,
  getRoadmapDotClass,
  getRoadmapStatus,
  normalizeResourceProvider,
} from "./skillPageUtils";

const RESOURCE_PROVIDER_CONFIG = {
  youtube: {
    label: "YouTube",
    tone: "bg-red-50 text-red-700 ring-red-200",
  },
  udemy: {
    label: "Udemy",
    tone: "bg-violet-50 text-violet-700 ring-violet-200",
  },
  coursera: {
    label: "Coursera",
    tone: "bg-blue-50 text-blue-700 ring-blue-200",
  },
  documentation: {
    label: "MDN Docs",
    tone: "bg-slate-100 text-slate-700 ring-slate-200",
  },
  mdn: {
    label: "MDN Docs",
    tone: "bg-slate-100 text-slate-700 ring-slate-200",
  },
  default: {
    label: "Resource",
    tone: "bg-slate-100 text-slate-700 ring-slate-200",
  },
};

function ResourceCard({ resource }) {
  const providerKey = normalizeResourceProvider(resource.provider);
  const providerConfig =
    RESOURCE_PROVIDER_CONFIG[providerKey] || RESOURCE_PROVIDER_CONFIG.default;

  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noreferrer"
      className="group flex min-h-[132px] flex-col rounded-[20px] border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ring-1 ${providerConfig.tone}`}
          >
            {providerConfig.label}
          </span>

          <p className="mt-3 line-clamp-2 break-words text-sm font-semibold leading-5 text-slate-900">
            {resource.title || "Open learning resource"}
          </p>
        </div>

        <ExternalLink
          size={16}
          className="shrink-0 text-slate-400 transition group-hover:text-slate-700"
        />
      </div>

      <p className="mt-auto pt-3 text-xs leading-5 text-slate-500">
        {resource.durationLabel || "Open resource"} • ⭐ {resource.rating || "-"}
        {resource.isPaid ? " • Paid" : " • Free"}
      </p>
    </a>
  );
}

function RoadmapKpiCard({ label, value }) {
  return (
    <div className="min-w-0 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5">
      <p className="truncate text-[10px] font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-1 truncate text-sm font-semibold leading-tight text-slate-900 sm:text-base">
        {value}
      </p>
    </div>
  );
}

function RoadmapDetails({
  roadmap,
  progress,
  metrics,
  completedLessonIds,
  roadmapActionLoading,
  expandedMilestoneIds,
  onToggleMilestone,
  onStartRoadmap,
  onAddQuickLog,
  onCompleteLesson,
}) {
  const selectedRoadmapSkills = useMemo(() => {
    const skills = [...(roadmap?.targetSkills || []), ...(roadmap?.prerequisites || [])]
      .map((item) => String(item || "").trim())
      .filter(Boolean);

    return Array.from(new Set(skills));
  }, [roadmap]);

  if (!roadmap) {
    return (
      <EmptyState
        title="Select a roadmap"
        subtitle="Choose any roadmap from the left side to display its details here."
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-slate-200 bg-white p-4 sm:p-6">
        <div className="flex flex-col gap-5 2xl:flex-row 2xl:items-start 2xl:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-600">
                {roadmap.difficulty || "Intermediate"}
              </span>

              <span className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary">
                {getGoalTitleFromRoadmap(roadmap)}
              </span>
            </div>

            <h3 className="mt-4 break-words text-xl font-semibold text-slate-900 sm:text-2xl">
              {roadmap.title}
            </h3>

            <p className="mt-2 break-words text-sm leading-6 text-slate-500">
              {roadmap.summary}
            </p>

            {selectedRoadmapSkills.length ? (
              <div className="mt-5">
                <p className="text-sm font-semibold text-slate-900">Skills & prerequisites</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedRoadmapSkills.map((item) => (
                    <span key={item} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs text-slate-600">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <div className="grid w-full min-w-0 grid-cols-2 gap-2 sm:max-w-sm 2xl:shrink-0 2xl:self-start">
            <RoadmapKpiCard label="Total hours" value={roadmap.estimatedHours || 0} />
            <RoadmapKpiCard label="ETA" value={`${roadmap.etaWeeks || 0} wks`} />
            <RoadmapKpiCard label="Score lift" value={`+${roadmap.projectedSkillScoreLift || 0}`} />
            <RoadmapKpiCard
              label="Progress"
              value={`${progress?.metrics?.pathCompletionPercent || metrics.pathCompletionPercent || 0}%`}
            />
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          {!progress ? (
            <button
              type="button"
              onClick={() => onStartRoadmap(roadmap._id)}
              disabled={roadmapActionLoading === `init-${roadmap._id}`}
              className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
            >
              {roadmapActionLoading === `init-${roadmap._id}` ? "Starting..." : "Start roadmap"}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onAddQuickLog(roadmap._id)}
              disabled={roadmapActionLoading === `timelog-${roadmap._id}`}
              className="rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
            >
              {roadmapActionLoading === `timelog-${roadmap._id}` ? "Saving..." : "Add quick 1 hour log"}
            </button>
          )}
        </div>
      </div>

      <SectionCard
        title="Milestones and lessons"
        subtitle="Press > on a milestone to view lessons, resources, and learning details."
      >
        <div className="space-y-5">
          {(roadmap.milestones || []).map((milestone, milestoneIndex) => {
            const milestoneLessons = milestone.lessons || [];
            const milestoneDone =
              milestoneLessons.length > 0 &&
              milestoneLessons.every((lesson) => completedLessonIds.has(String(lesson._id)));

            const milestoneKey = String(milestone._id || `${roadmap._id}-${milestoneIndex}`);
            const milestoneExpanded = expandedMilestoneIds.includes(milestoneKey);

            return (
              <div key={milestoneKey} className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-500 ring-1 ring-slate-200">
                        Milestone {milestoneIndex + 1}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
                          milestoneDone ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {milestoneDone ? "Completed" : "In progress"}
                      </span>
                    </div>

                    <h4 className="mt-3 break-words text-lg font-semibold text-slate-900">{milestone.title}</h4>
                  </div>

                  <button
                    type="button"
                    onClick={() => onToggleMilestone(milestoneKey)}
                    className="shrink-0 px-1 text-2xl font-bold leading-none text-primary transition hover:scale-110"
                    aria-label={milestoneExpanded ? "Hide milestone details" : "Show milestone details"}
                  >
                    {milestoneExpanded ? "<" : ">"}
                  </button>
                </div>

                {milestoneExpanded ? (
                  <div className="mt-5 space-y-4">
                    {milestone.summary ? <p className="break-words text-sm text-slate-500">{milestone.summary}</p> : null}

                    {milestoneLessons.map((lesson) => {
                      const lessonDone = completedLessonIds.has(String(lesson._id));
                      const isLoading = roadmapActionLoading === `lesson-${lesson._id}`;
                      const displayResources = getDisplayResources({ lesson, milestone, roadmap });

                      return (
                        <div key={lesson._id} className="rounded-[24px] border border-slate-200 bg-white p-5">
                          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <h5 className="break-words text-base font-semibold text-slate-900">{lesson.title}</h5>

                                <span
                                  className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
                                    lessonDone ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
                                  }`}
                                >
                                  {lessonDone ? "Completed" : "Not completed"}
                                </span>

                                {lesson.status ? (
                                  <span className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold capitalize text-primary">
                                    {lesson.status}
                                  </span>
                                ) : null}
                              </div>

                              {lesson.goal ? <p className="mt-2 break-words text-sm text-slate-500">{lesson.goal}</p> : null}

                              <div className="mt-4 flex flex-wrap gap-2">
                                {(lesson.topics || []).map((topic) => (
                                  <span key={topic} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs text-slate-600">
                                    {topic}
                                  </span>
                                ))}
                              </div>

                              {lesson.practice ? (
                                <p className="mt-4 break-words text-xs leading-5 text-slate-500">
                                  <span className="font-semibold text-slate-700">Practice:</span> {lesson.practice}
                                </p>
                              ) : null}

                              {lesson.miniProject ? (
                                <p className="mt-1 break-words text-xs leading-5 text-slate-500">
                                  <span className="font-semibold text-slate-700">Mini project:</span> {lesson.miniProject}
                                </p>
                              ) : null}
                            </div>

                            <div className="flex w-full flex-col gap-3 xl:w-[220px]">
                              <button
                                type="button"
                                onClick={() => !lessonDone && onCompleteLesson(roadmap._id, lesson)}
                                disabled={lessonDone || isLoading || !progress}
                                className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                                  lessonDone
                                    ? "cursor-not-allowed bg-emerald-100 text-emerald-700"
                                    : "bg-primary text-white hover:opacity-90 disabled:opacity-60"
                                }`}
                              >
                                {lessonDone ? "Completed" : isLoading ? "Saving..." : progress ? "Log learning" : "Start roadmap first"}
                              </button>
                            </div>
                          </div>

                          {displayResources.length ? (
                            <div className="mt-5">
                              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                                  Recommended resources
                                </p>

                                <div className="flex flex-wrap gap-2 text-[11px] font-medium text-slate-500">
                                  <span>YouTube</span>
                                  <span>•</span>
                                  <span>Udemy</span>
                                  <span>•</span>
                                  <span>Coursera</span>
                                  <span>•</span>
                                  <span>MDN Docs</span>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 2xl:grid-cols-4">
                                {displayResources.map((resource, resourceIndex) => (
                                  <ResourceCard
                                    key={`${resource.provider}-${resource.title}-${resourceIndex}`}
                                    resource={resource}
                                  />
                                ))}
                              </div>
                            </div>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}

export default function RoadmapTab({
  roadmaps,
  selectedRoadmapId,
  selectedRoadmapProgress,
  selectedRoadmap,
  metrics,
  completedLessonIds,
  expandedRoadmapIds,
  expandedMilestoneIds,
  roadmapActionLoading,
  onCreateTarget,
  onSelectRoadmap,
  onToggleRoadmap,
  onToggleMilestone,
  onStartRoadmap,
  onAddQuickLog,
  onCompleteLesson,
}) {
  return (
    <div className="w-full space-y-6">
      <SectionCard
        title="Roadmap"
        subtitle="All roadmaps appear on the left. Select one to view details on the right."
        className="w-full"
      >
        {!roadmaps.length ? (
          <EmptyState
            title="No roadmap generated yet"
            subtitle="Generate your journey after saving a target to unlock roadmap plans."
            actionLabel="Create target"
            onAction={onCreateTarget}
          />
        ) : (
          <div className="grid w-full grid-cols-1 items-start gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
            <div className="w-full space-y-3">
              <div className="flex flex-col gap-3 px-1 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-semibold text-slate-900">All roadmaps</p>

                <div className="flex flex-wrap gap-2 text-[11px] font-medium text-slate-500">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                    Selected
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                    Active
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    Completed
                  </span>
                </div>
              </div>

              {roadmaps.map((roadmap) => {
                const selected = String(roadmap._id) === String(selectedRoadmapId);
                const roadmapExpanded = expandedRoadmapIds.includes(String(roadmap._id));
                const roadmapStatus = getRoadmapStatus(roadmap, selected ? selectedRoadmapProgress : null);
                const completion = getRoadmapCompletion(roadmap, selected ? selectedRoadmapProgress : null);

                const cardClass =
                  roadmapStatus === "completed"
                    ? "border-emerald-200 bg-emerald-50 hover:bg-emerald-100/70"
                    : selected
                    ? "border-amber-200 bg-white hover:bg-slate-50"
                    : "border-slate-200 bg-slate-50 hover:bg-slate-100";

                return (
                  <div key={roadmap._id} className={`w-full rounded-[22px] border p-4 text-left transition ${cardClass}`}>
                    <div className="flex items-start gap-3">
                      <span
                        className={`mt-1 h-3 w-3 shrink-0 rounded-full ring-4 ${getRoadmapDotClass(
                          roadmap,
                          selected ? selectedRoadmapProgress : null,
                          selected
                        )}`}
                      />

                      <button type="button" onClick={() => onSelectRoadmap(roadmap)} className="min-w-0 flex-1 text-left">
                        <h3 className="line-clamp-2 text-sm font-semibold text-slate-900">{roadmap.title}</h3>
                        <p className="mt-1 line-clamp-1 text-xs text-slate-500">
                          {getGoalTitleFromRoadmap(roadmap)} • {completion}% complete
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => onToggleRoadmap(roadmap._id)}
                        className="shrink-0 px-1 text-2xl font-bold leading-none text-primary transition hover:scale-110"
                        aria-label={roadmapExpanded ? "Hide roadmap details" : "Show roadmap details"}
                      >
                        {roadmapExpanded ? "<" : ">"}
                      </button>
                    </div>

                    {roadmapExpanded ? (
                      <div className="mt-3 pl-6">
                        <p className="line-clamp-3 text-xs leading-5 text-slate-500">
                          {roadmap.summary || "No roadmap description available yet."}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-medium text-slate-500">
                          <span className="rounded-full bg-white px-2.5 py-1 ring-1 ring-current/10">
                            {roadmap.difficulty || "Roadmap"}
                          </span>
                          <span className="rounded-full bg-white px-2.5 py-1 ring-1 ring-current/10">
                            {roadmap.estimatedHours || 0} hrs
                          </span>
                          <span className="rounded-full bg-white px-2.5 py-1 ring-1 ring-current/10">
                            {roadmap.etaWeeks || 0} wks
                          </span>
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>

            <div className="min-w-0">
              <RoadmapDetails
                roadmap={selectedRoadmap}
                progress={selectedRoadmapProgress}
                metrics={metrics}
                completedLessonIds={completedLessonIds}
                roadmapActionLoading={roadmapActionLoading}
                expandedMilestoneIds={expandedMilestoneIds}
                onToggleMilestone={onToggleMilestone}
                onStartRoadmap={onStartRoadmap}
                onAddQuickLog={onAddQuickLog}
                onCompleteLesson={onCompleteLesson}
              />
            </div>
          </div>
        )}
      </SectionCard>
    </div>
  );
}
