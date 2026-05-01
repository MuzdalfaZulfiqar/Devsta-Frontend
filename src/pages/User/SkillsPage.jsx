// import React, { useEffect, useMemo, useRef, useState } from "react";
// import {
//   addMySkillTimeLog,
//   completeMySkillLesson,
//   generateMySkillInsights,
//   getMySkillGraph,
//   getMySkillGoal,
//   getMySkillGoals,
//   getMySkillRoadmaps,
//   getMySkillsDashboard,
//   getMySkillRoadmapProgress,
//   initMySkillRoadmapProgress,
//   saveMySkillGoal,
// } from "../../api/user/skillInsights";
// import DashboardLayout from "../../components/dashboard/DashboardLayout";
// import LessonCompleteModal from "../../components/skills/LessonCompleteModal";
// import { useAuth } from "../../context/AuthContext";
// import {
//   ArrowRight,
//   BookOpen,
//   Briefcase,
//   CheckCircle2,
//   Clock3,
//   Compass,
//   Crown,
//   ExternalLink,
//   Flame,
//   Layers3,
//   Move,
//   RotateCcw,
//   ZoomIn,
//   ZoomOut,
//   Plus,
//   Sparkles,
//   Target,
//   Trophy,
//   X,
// } from "lucide-react";

// const TABS = ["overview", "journey", "roadmap", "activity"];

// const DEFAULT_GOAL_FORM = {
//   targetTitle: "",
//   targetRole: "",
//   targetCompany: "",
//   experienceLevel: "other",
//   focusSkillsText: "",
//   timeline: "3 months",
//   weeklyAvailability: "5 hours",
//   preferredResourceType: "Mixed",
//   budgetPreference: "Free + paid",
//   preferredDifficulty: "Adaptive",
// };

// function MetricCard({ label, value, helper, icon: Icon }) {
//   return (
//     <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
//       <div className="flex items-center justify-between gap-3">
//         <p className="text-sm font-medium text-slate-500">{label}</p>
//         {Icon ? (
//           <div className="rounded-xl bg-slate-100 p-2 text-slate-600">
//             <Icon size={16} />
//           </div>
//         ) : null}
//       </div>
//       <p className="mt-4 text-3xl font-semibold text-slate-900">{value}</p>
//       <p className="mt-2 text-xs text-slate-400">{helper}</p>
//     </div>
//   );
// }

// function SectionCard({ title, subtitle, rightNode = null, children, className = "" }) {
//   return (
//     <div className={`rounded-[28px] border border-slate-200 bg-white shadow-sm ${className}`}>
//       <div className="flex flex-col gap-4 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-start sm:justify-between">
//         <div>
//           <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
//           {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
//         </div>
//         {rightNode}
//       </div>
//       <div className="p-6">{children}</div>
//     </div>
//   );
// }

// function EmptyState({ title, subtitle, actionLabel, onAction }) {
//   return (
//     <div className="rounded-[28px] border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
//       <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
//       <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
//       {actionLabel ? (
//         <button
//           type="button"
//           onClick={onAction}
//           className="mt-5 rounded-2xl bg-primary px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
//         >
//           {actionLabel}
//         </button>
//       ) : null}
//     </div>
//   );
// }

// function getFocusSkillsArray(text) {
//   return String(text || "")
//     .split(",")
//     .map((skill) => skill.trim())
//     .filter(Boolean);
// }

// function fillGoalFormFromGoal(goal) {
//   if (!goal) return DEFAULT_GOAL_FORM;

//   return {
//     ...DEFAULT_GOAL_FORM,
//     targetTitle: goal.targetTitle || "",
//     targetRole: goal.targetRole || "",
//     targetCompany: goal.targetCompany || "",
//     experienceLevel: goal.experienceLevel || "other",
//     focusSkillsText: Array.isArray(goal.focusSkills) ? goal.focusSkills.join(", ") : "",
//     timeline: goal.timeline || DEFAULT_GOAL_FORM.timeline,
//     weeklyAvailability: goal.weeklyAvailability || DEFAULT_GOAL_FORM.weeklyAvailability,
//     preferredResourceType: goal.preferredResourceType || DEFAULT_GOAL_FORM.preferredResourceType,
//     budgetPreference: goal.budgetPreference || DEFAULT_GOAL_FORM.budgetPreference,
//     preferredDifficulty: goal.preferredDifficulty || DEFAULT_GOAL_FORM.preferredDifficulty,
//   };
// }

// function getGoalIdFromRoadmap(roadmap) {
//   return String(roadmap?.goal?._id || roadmap?.goal || "");
// }

// function getGoalTitleFromRoadmap(roadmap) {
//   return roadmap?.goal?.targetTitle || roadmap?.goal?.title || "Target";
// }

// function getGoalRoleFromRoadmap(roadmap) {
//   return (
//     roadmap?.goal?.aiInterpretation?.inferredRole ||
//     roadmap?.goal?.targetRole ||
//     roadmap?.goal?.targetTitle ||
//     "Custom target"
//   );
// }

// function getGroupedGraphNodes(graph) {
//   const nodes = graph?.nodes || [];

//   return {
//     owned: nodes.filter((node) => node.type === "skill" && node.status === "owned"),
//     learning: nodes.filter((node) => node.type === "skill" && node.status === "learning"),
//     gap: nodes.filter((node) => node.type === "skill" && node.status === "gap"),
//   };
// }

// function getNodeStatusClasses(node) {
//   if (node.type === "target") {
//     return {
//       circleFill: "#e0e7ff",
//       circleStroke: "#6366f1",
//     };
//   }

//   if (node.type === "milestone") {
//     return {
//       circleFill: "#dbeafe",
//       circleStroke: "#2563eb",
//     };
//   }

//   if (node.status === "owned") {
//     return {
//       circleFill: "#d1fae5",
//       circleStroke: "#10b981",
//     };
//   }

//   if (node.status === "learning") {
//     return {
//       circleFill: "#fef3c7",
//       circleStroke: "#f59e0b",
//     };
//   }

//   return {
//     circleFill: "#ffe4e6",
//     circleStroke: "#f43f5e",
//   };
// }

// function getRoadmapCompletion(roadmap, progress) {
//   return Number(
//     progress?.metrics?.pathCompletionPercent ||
//       roadmap?.progressMetrics?.pathCompletionPercent ||
//       roadmap?.metrics?.pathCompletionPercent ||
//       roadmap?.pathCompletionPercent ||
//       0
//   );
// }

// function getRoadmapStatus(roadmap, progress) {
//   const completion = getRoadmapCompletion(roadmap, progress);
//   const status = String(
//     progress?.status ||
//       roadmap?.computedStatus ||
//       roadmap?.progressStatus ||
//       roadmap?.status ||
//       ""
//   ).toLowerCase();

//   if (status === "completed" || completion >= 100) return "completed";
//   return "active";
// }

// function getRoadmapDotClass(roadmap, progress, selected = false) {
//   const status = getRoadmapStatus(roadmap, progress);

//   if (status === "completed") return "bg-emerald-500 ring-emerald-100";
//   if (selected) return "bg-amber-400 ring-amber-100";
//   return "bg-slate-300 ring-slate-100";
// }

// const RESOURCE_PROVIDER_CONFIG = {
//   youtube: {
//     label: "YouTube",
//     tone: "bg-red-50 text-red-700 ring-red-200",
//   },
//   udemy: {
//     label: "Udemy",
//     tone: "bg-violet-50 text-violet-700 ring-violet-200",
//   },
//   coursera: {
//     label: "Coursera",
//     tone: "bg-blue-50 text-blue-700 ring-blue-200",
//   },
//   documentation: {
//     label: "MDN Docs",
//     tone: "bg-slate-100 text-slate-700 ring-slate-200",
//   },
//   mdn: {
//     label: "MDN Docs",
//     tone: "bg-slate-100 text-slate-700 ring-slate-200",
//   },
//   default: {
//     label: "Resource",
//     tone: "bg-slate-100 text-slate-700 ring-slate-200",
//   },
// };

// function normalizeResourceProvider(provider = "") {
//   const value = String(provider || "").trim().toLowerCase();

//   if (value.includes("youtube")) return "youtube";
//   if (value.includes("udemy")) return "udemy";
//   if (value.includes("coursera")) return "coursera";
//   if (value.includes("mdn")) return "mdn";
//   if (value.includes("documentation") || value.includes("docs")) return "documentation";

//   return "default";
// }

// function cleanMilestoneTitle(value = "") {
//   return String(value || "")
//     .replace(/^Milestone\s+\d+:\s*/i, "")
//     .trim();
// }

// function buildProviderUrl(provider, query) {
//   const encoded = encodeURIComponent(query);

//   if (provider === "youtube") {
//     return `https://www.youtube.com/results?search_query=${encoded}`;
//   }

//   if (provider === "udemy") {
//     return `https://www.udemy.com/courses/search/?q=${encoded}&sort=relevance`;
//   }

//   if (provider === "coursera") {
//     return `https://www.coursera.org/search?query=${encoded}`;
//   }

//   return `https://developer.mozilla.org/en-US/search?q=${encoded}`;
// }

// function getRoadmapTargetRole(roadmap) {
//   return (
//     roadmap?.goal?.aiInterpretation?.inferredRole ||
//     roadmap?.goal?.targetRole ||
//     roadmap?.goal?.targetTitle ||
//     roadmap?.title ||
//     "Developer"
//   );
// }

// function buildFallbackLessonResources({ lesson, milestone, roadmap }) {
//   const lessonTitle = lesson?.title || "Learning lesson";
//   const milestoneTitle = cleanMilestoneTitle(milestone?.title || "Roadmap milestone");
//   const targetRole = getRoadmapTargetRole(roadmap);

//   const lessonQuery = `${lessonTitle} in ${milestoneTitle}`;
//   const courseQuery = `${milestoneTitle} for ${targetRole}`;

//   return [
//     {
//       provider: "YouTube",
//       title: `YouTube tutorials for ${lessonQuery}`,
//       url: buildProviderUrl("youtube", lessonQuery),
//       type: "video",
//       rating: 4.5,
//       durationLabel: "Varies",
//       isPaid: false,
//     },
//     {
//       provider: "Udemy",
//       title: `${milestoneTitle} — Udemy courses`,
//       url: buildProviderUrl("udemy", courseQuery),
//       type: "course",
//       rating: 4.5,
//       durationLabel: "Varies",
//       isPaid: true,
//     },
//     {
//       provider: "Coursera",
//       title: `${milestoneTitle} — Coursera courses`,
//       url: buildProviderUrl("coursera", courseQuery),
//       type: "course",
//       rating: 4.5,
//       durationLabel: "Varies",
//       isPaid: false,
//     },
//     {
//       provider: "MDN Docs",
//       title: `${lessonTitle} — MDN documentation`,
//       url: buildProviderUrl("documentation", lessonQuery),
//       type: "documentation",
//       rating: 4.8,
//       durationLabel: "Self-paced",
//       isPaid: false,
//     },
//   ];
// }

// function getDisplayResources({ lesson, milestone, roadmap }) {
//   const fallbackResources = buildFallbackLessonResources({
//     lesson,
//     milestone,
//     roadmap,
//   });

//   const incomingResources = Array.isArray(lesson?.resources) ? lesson.resources : [];
//   const resourceMap = new Map();

//   for (const resource of incomingResources) {
//     const providerKey = normalizeResourceProvider(resource.provider);

//     if (!resourceMap.has(providerKey)) {
//       resourceMap.set(providerKey, resource);
//     }
//   }

//   for (const resource of fallbackResources) {
//     const providerKey = normalizeResourceProvider(resource.provider);

//     if (!resourceMap.has(providerKey)) {
//       resourceMap.set(providerKey, resource);
//     }
//   }

//   return ["youtube", "udemy", "coursera", "documentation", "mdn"]
//     .map((key) => resourceMap.get(key))
//     .filter(Boolean)
//     .slice(0, 4);
// }

// function ResourceCard({ resource }) {
//   const providerKey = normalizeResourceProvider(resource.provider);
//   const providerConfig =
//     RESOURCE_PROVIDER_CONFIG[providerKey] || RESOURCE_PROVIDER_CONFIG.default;

//   return (
//     <a
//       href={resource.url}
//       target="_blank"
//       rel="noreferrer"
//       className="group rounded-[20px] border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-sm"
//     >
//       <div className="flex items-start justify-between gap-3">
//         <div className="min-w-0">
//           <span
//             className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ring-1 ${providerConfig.tone}`}
//           >
//             {providerConfig.label}
//           </span>

//           <p className="mt-3 line-clamp-2 text-sm font-semibold text-slate-900">
//             {resource.title || "Open learning resource"}
//           </p>
//         </div>

//         <ExternalLink
//           size={16}
//           className="shrink-0 text-slate-400 transition group-hover:text-slate-700"
//         />
//       </div>

//       <p className="mt-3 text-xs text-slate-500">
//         {resource.durationLabel || "Open resource"} • ⭐ {resource.rating || "-"}
//         {resource.isPaid ? " • Paid" : " • Free"}
//       </p>
//     </a>
//   );
// }

// function GraphLegend() {
//   const items = [
//     { label: "Owned", color: "bg-emerald-500" },
//     { label: "Learning", color: "bg-amber-500" },
//     { label: "Gap", color: "bg-rose-500" },
//     { label: "Milestone", color: "bg-blue-500" },
//     { label: "Target", color: "bg-indigo-500" },
//   ];

//   return (
//     <div className="flex flex-wrap gap-2">
//       {items.map((item) => (
//         <div
//           key={item.label}
//           className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200"
//         >
//           <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
//           {item.label}
//         </div>
//       ))}
//     </div>
//   );
// }

// const TREE_NODE_BASE_WIDTH = 270;
// const TREE_NODE_MAX_WIDTH = 360;
// const TREE_TARGET_BASE_WIDTH = 320;
// const TREE_HORIZONTAL_PADDING = 32;
// const TREE_CARD_VERTICAL_GAP = 38;
// const TREE_LEVEL_GAP = 112;

// function clampNumber(value, min, max) {
//   return Math.max(min, Math.min(max, value));
// }

// function getTextLineCount(text, width) {
//   const safeText = String(text || "").trim();
//   if (!safeText) return 1;

//   const usableWidth = Math.max(140, width - TREE_HORIZONTAL_PADDING);
//   const estimatedCharsPerLine = Math.max(18, Math.floor(usableWidth / 7.2));

//   return Math.max(1, Math.ceil(safeText.length / estimatedCharsPerLine));
// }

// function getJourneyNodeSize(node) {
//   const label = String(node?.label || "").trim();
//   const isTarget = node?.type === "target";
//   const isMilestone = node?.type === "milestone";

//   const baseWidth = isTarget
//     ? TREE_TARGET_BASE_WIDTH
//     : isMilestone
//     ? TREE_NODE_BASE_WIDTH + 24
//     : TREE_NODE_BASE_WIDTH;

//   const extraWidth = label.length > 34 ? 34 : label.length > 24 ? 18 : 0;
//   const width = clampNumber(baseWidth + extraWidth, baseWidth, TREE_NODE_MAX_WIDTH);

//   const labelLines = getTextLineCount(label, width);
//   const hasMeta = Boolean(node?.importance || node?.type);
//   const metaHeight = hasMeta ? 18 : 0;
//   const minHeight = isTarget ? 104 : isMilestone ? 98 : 92;
//   const calculatedHeight = 58 + labelLines * 19 + metaHeight;

//   return {
//     width,
//     height: Math.max(minHeight, calculatedHeight),
//   };
// }

// function getJourneyNodeTheme(node) {
//   if (node.type === "target") {
//     return {
//       card: "border-indigo-200 bg-indigo-50",
//       dot: "bg-indigo-500",
//       label: "Target",
//       labelClass: "bg-indigo-100 text-indigo-700",
//       stroke: "#6366f1",
//     };
//   }

//   if (node.type === "milestone") {
//     return {
//       card: "border-blue-200 bg-blue-50",
//       dot: "bg-blue-500",
//       label: "Milestone",
//       labelClass: "bg-blue-100 text-blue-700",
//       stroke: "#2563eb",
//     };
//   }

//   if (node.status === "owned") {
//     return {
//       card: "border-emerald-200 bg-emerald-50",
//       dot: "bg-emerald-500",
//       label: "Owned",
//       labelClass: "bg-emerald-100 text-emerald-700",
//       stroke: "#10b981",
//     };
//   }

//   if (node.status === "learning") {
//     return {
//       card: "border-amber-200 bg-amber-50",
//       dot: "bg-amber-500",
//       label: "Learning",
//       labelClass: "bg-amber-100 text-amber-700",
//       stroke: "#f59e0b",
//     };
//   }

//   return {
//     card: "border-rose-200 bg-rose-50",
//     dot: "bg-rose-500",
//     label: "Gap",
//     labelClass: "bg-rose-100 text-rose-700",
//     stroke: "#f43f5e",
//   };
// }

// function createPositionedNode(node, layoutX, layoutY, depth) {
//   const size = getJourneyNodeSize(node);

//   return {
//     ...node,
//     layoutX,
//     layoutY,
//     layoutWidth: size.width,
//     layoutHeight: size.height,
//     depth,
//   };
// }

// function buildJourneyTreeLayout(graph) {
//   const rawNodes = graph?.nodes || [];
//   const rawEdges = graph?.edges || [];

//   if (!rawNodes.length) return null;

//   const targetNode = rawNodes.find((node) => node.type === "target") || rawNodes[0];
//   const milestoneNodes = rawNodes.filter((node) => node.type === "milestone");
//   const skillNodes = rawNodes.filter((node) => node.type === "skill");
//   const otherNodes = rawNodes.filter(
//     (node) => !["target", "milestone", "skill"].includes(node.type)
//   );

//   const nodeSizeMap = new Map(
//     rawNodes.map((node) => [node.nodeId, getJourneyNodeSize(node)])
//   );

//   const widestNode = Math.max(
//     TREE_NODE_BASE_WIDTH,
//     ...Array.from(nodeSizeMap.values()).map((size) => size.width)
//   );

//   const positionedMap = new Map();
//   const rawNodeMap = new Map(rawNodes.map((node) => [node.nodeId, node]));

//   const columnGap = Math.max(widestNode + 92, 340);
//   const canvasWidth = Math.max(
//     1100,
//     Math.max(milestoneNodes.length, 1) * columnGap + 180
//   );

//   const targetSize = nodeSizeMap.get(targetNode.nodeId) || getJourneyNodeSize(targetNode);
//   const targetTop = 58;
//   const targetCenterY = targetTop + targetSize.height / 2;

//   positionedMap.set(
//     targetNode.nodeId,
//     createPositionedNode(targetNode, canvasWidth / 2, targetCenterY, 0)
//   );

//   const generatedEdges = [];

//   function addEdge(from, to, relation = "related", weight = 1) {
//     if (!from || !to || from === to) return;
//     if (!positionedMap.has(from) || !positionedMap.has(to)) return;

//     const edgeKey = `${from}-${to}`;
//     if (generatedEdges.some((edge) => edge.key === edgeKey)) return;

//     generatedEdges.push({
//       key: edgeKey,
//       from,
//       to,
//       relation,
//       weight,
//     });
//   }

//   if (milestoneNodes.length) {
//     const milestoneTop = targetTop + targetSize.height + TREE_LEVEL_GAP;

//     milestoneNodes.forEach((node, index) => {
//       const nodeSize = nodeSizeMap.get(node.nodeId) || getJourneyNodeSize(node);
//       const layoutX =
//         canvasWidth / 2 - ((milestoneNodes.length - 1) * columnGap) / 2 + index * columnGap;
//       const layoutY = milestoneTop + nodeSize.height / 2;

//       positionedMap.set(node.nodeId, createPositionedNode(node, layoutX, layoutY, 1));
//     });

//     const milestoneIds = new Set(milestoneNodes.map((node) => node.nodeId));
//     const parentByChild = new Map();

//     rawEdges.forEach((edge) => {
//       if (milestoneIds.has(edge.from)) {
//         parentByChild.set(edge.to, edge.from);
//       }

//       if (milestoneIds.has(edge.to)) {
//         parentByChild.set(edge.from, edge.to);
//       }
//     });

//     const childBuckets = new Map(
//       milestoneNodes.map((node) => [node.nodeId, []])
//     );

//     [...skillNodes, ...otherNodes].forEach((node, index) => {
//       const parentId =
//         parentByChild.get(node.nodeId) ||
//         milestoneNodes[index % milestoneNodes.length]?.nodeId;

//       if (!parentId) return;

//       childBuckets.get(parentId)?.push(node);
//     });

//     const tallestMilestone = Math.max(
//       ...milestoneNodes.map(
//         (node) => nodeSizeMap.get(node.nodeId)?.height || getJourneyNodeSize(node).height
//       )
//     );

//     const childrenTop = milestoneTop + tallestMilestone + TREE_LEVEL_GAP;
//     let maxY = childrenTop;

//     milestoneNodes.forEach((milestone) => {
//       const milestonePosition = positionedMap.get(milestone.nodeId);
//       const children = childBuckets.get(milestone.nodeId) || [];
//       let cursorY = childrenTop;

//       children.forEach((child) => {
//         const childSize = nodeSizeMap.get(child.nodeId) || getJourneyNodeSize(child);
//         const layoutY = cursorY + childSize.height / 2;

//         positionedMap.set(
//           child.nodeId,
//           createPositionedNode(child, milestonePosition.layoutX, layoutY, 2)
//         );

//         cursorY += childSize.height + TREE_CARD_VERTICAL_GAP;
//         maxY = Math.max(maxY, cursorY + 60);
//       });
//     });

//     rawEdges.forEach((edge) => {
//       const fromNode = rawNodeMap.get(edge.from);
//       const toNode = rawNodeMap.get(edge.to);

//       if (!fromNode || !toNode) return;
//       if (!positionedMap.has(edge.from) || !positionedMap.has(edge.to)) return;

//       const fromDepth = positionedMap.get(edge.from)?.depth || 0;
//       const toDepth = positionedMap.get(edge.to)?.depth || 0;

//       const normalizedFrom = fromDepth <= toDepth ? edge.from : edge.to;
//       const normalizedTo = fromDepth <= toDepth ? edge.to : edge.from;

//       addEdge(normalizedFrom, normalizedTo, edge.relation, edge.weight);
//     });

//     milestoneNodes.forEach((milestone) => {
//       const hasRootEdge = generatedEdges.some(
//         (edge) => edge.from === targetNode.nodeId && edge.to === milestone.nodeId
//       );

//       if (!hasRootEdge) {
//         addEdge(targetNode.nodeId, milestone.nodeId, "contains", 1);
//       }

//       const children = childBuckets.get(milestone.nodeId) || [];

//       children.forEach((child) => {
//         const hasChildEdge = generatedEdges.some(
//           (edge) => edge.from === milestone.nodeId && edge.to === child.nodeId
//         );

//         if (!hasChildEdge) {
//           addEdge(milestone.nodeId, child.nodeId, "requires", 1);
//         }
//       });
//     });

//     return {
//       nodes: Array.from(positionedMap.values()),
//       edges: generatedEdges,
//       nodeMap: positionedMap,
//       width: canvasWidth,
//       height: Math.max(680, maxY),
//     };
//   }

//   const remainingNodes = rawNodes.filter((node) => node.nodeId !== targetNode.nodeId);
//   const columns = Math.min(3, Math.max(1, remainingNodes.length));
//   const cardGapX = Math.max(widestNode + 90, 340);
//   const gridWidth = columns * cardGapX;
//   const startX = canvasWidth / 2 - gridWidth / 2 + cardGapX / 2;
//   const gridTop = targetTop + targetSize.height + TREE_LEVEL_GAP;
//   const rowHeights = [];

//   remainingNodes.forEach((node, index) => {
//     const row = Math.floor(index / columns);
//     const nodeSize = nodeSizeMap.get(node.nodeId) || getJourneyNodeSize(node);
//     rowHeights[row] = Math.max(rowHeights[row] || 0, nodeSize.height);
//   });

//   remainingNodes.forEach((node, index) => {
//     const col = index % columns;
//     const row = Math.floor(index / columns);
//     const previousRowsHeight = rowHeights
//       .slice(0, row)
//       .reduce((sum, height) => sum + height + TREE_CARD_VERTICAL_GAP, 0);
//     const nodeSize = nodeSizeMap.get(node.nodeId) || getJourneyNodeSize(node);

//     positionedMap.set(
//       node.nodeId,
//       createPositionedNode(
//         node,
//         startX + col * cardGapX,
//         gridTop + previousRowsHeight + nodeSize.height / 2,
//         1
//       )
//     );
//   });

//   rawEdges.forEach((edge) => {
//     if (positionedMap.has(edge.from) && positionedMap.has(edge.to)) {
//       addEdge(edge.from, edge.to, edge.relation, edge.weight);
//     }
//   });

//   remainingNodes.forEach((node) => {
//     const alreadyConnected = generatedEdges.some(
//       (edge) => edge.from === targetNode.nodeId && edge.to === node.nodeId
//     );

//     if (!alreadyConnected) {
//       addEdge(targetNode.nodeId, node.nodeId, "contains", 1);
//     }
//   });

//   const gridHeight = rowHeights.reduce(
//     (sum, height) => sum + height + TREE_CARD_VERTICAL_GAP,
//     0
//   );

//   return {
//     nodes: Array.from(positionedMap.values()),
//     edges: generatedEdges,
//     nodeMap: positionedMap,
//     width: canvasWidth,
//     height: Math.max(680, gridTop + gridHeight + 80),
//   };
// }

// function JourneyNodeCard({ node, selectedNodeId, onSelectNode }) {
//   const theme = getJourneyNodeTheme(node);
//   const isSelected = selectedNodeId === node.nodeId;

//   function handleKeyDown(event) {
//     if (event.key === "Enter" || event.key === " ") {
//       event.preventDefault();
//       onSelectNode(node);
//     }
//   }

//   return (
//     <div
//       role="button"
//       tabIndex={0}
//       onMouseDown={(event) => event.stopPropagation()}
//       onClick={(event) => {
//         event.stopPropagation();
//         onSelectNode(node);
//       }}
//       onKeyDown={handleKeyDown}
//       className={`flex min-h-full w-full flex-col rounded-[22px] border px-4 py-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${theme.card} ${
//         isSelected ? "ring-2 ring-primary ring-offset-2" : ""
//       }`}
//     >
//       <div className="flex flex-wrap items-center justify-between gap-2">
//         <div className="flex min-w-0 flex-wrap items-center gap-2">
//           <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${theme.dot}`} />
//           <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${theme.labelClass}`}>
//             {theme.label}
//           </span>
//         </div>

//         <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
//           {node.confidence || 0}%
//         </span>
//       </div>

//       <p className="mt-2 whitespace-normal break-words text-sm font-semibold leading-snug text-slate-900">
//         {node.label}
//       </p>

//       <p className="mt-2 whitespace-normal break-words text-[11px] capitalize leading-snug text-slate-500">
//         {node.type === "target" ? "Growth target" : node.type}
//         {node.importance ? ` • ${node.importance}/100 priority` : ""}
//       </p>
//     </div>
//   );
// }

// function GraphCanvas({ graph, selectedNodeId, onSelectNode }) {
//   const svgRef = useRef(null);
//   const lastPanPointRef = useRef({ x: 0, y: 0 });

//   const [zoom, setZoom] = useState(1);
//   const [pan, setPan] = useState({ x: 0, y: 0 });
//   const [isPanning, setIsPanning] = useState(false);

//   const graphData = useMemo(() => buildJourneyTreeLayout(graph), [graph]);

//   useEffect(() => {
//     setZoom(1);
//     setPan({ x: 0, y: 0 });
//     setIsPanning(false);
//   }, [graph?._id, graph?.generatedAt, graph?.nodes?.length]);

//   if (!graphData) {
//     return (
//       <EmptyState
//         title="Journey map will appear here"
//         subtitle="Select a generated roadmap to view its related journey map."
//       />
//     );
//   }

//   function updateZoom(nextZoom) {
//     setZoom((previous) => {
//       const value =
//         typeof nextZoom === "function" ? nextZoom(previous) : nextZoom;

//       return clampNumber(Number(value.toFixed(2)), 0.6, 1.8);
//     });
//   }

//   function handleResetView() {
//     setZoom(1);
//     setPan({ x: 0, y: 0 });
//     setIsPanning(false);
//   }

//   function handleMouseDown(event) {
//     if (event.button !== 0) return;

//     setIsPanning(true);
//     lastPanPointRef.current = {
//       x: event.clientX,
//       y: event.clientY,
//     };
//   }

//   function handleMouseMove(event) {
//     if (!isPanning) return;

//     const rect = svgRef.current?.getBoundingClientRect();
//     const dx = event.clientX - lastPanPointRef.current.x;
//     const dy = event.clientY - lastPanPointRef.current.y;

//     const svgDx = rect ? (dx * graphData.width) / rect.width / zoom : dx / zoom;
//     const svgDy = rect ? (dy * graphData.height) / rect.height / zoom : dy / zoom;

//     setPan((previous) => ({
//       x: previous.x + svgDx,
//       y: previous.y + svgDy,
//     }));

//     lastPanPointRef.current = {
//       x: event.clientX,
//       y: event.clientY,
//     };
//   }

//   function handleMouseUp() {
//     setIsPanning(false);
//   }

//   return (
//     <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-slate-50">
//       <div className="flex flex-col gap-3 border-b border-slate-200 bg-white px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
//         <div>
//           <p className="text-sm font-semibold text-slate-800">
//             Interactive journey tree
//           </p>
//           <p className="mt-1 text-xs text-slate-500">
//             Drag the canvas to move. Use the buttons to zoom in, zoom out, or reset.
//           </p>
//         </div>

//         <div className="flex flex-wrap items-center gap-2">
//           <div className="inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600">
//             <Move size={14} />
//             {Math.round(zoom * 100)}%
//           </div>

//           <button
//             type="button"
//             onClick={() => updateZoom((value) => value - 0.15)}
//             className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
//           >
//             <ZoomOut size={14} />
//             Zoom out
//           </button>

//           <button
//             type="button"
//             onClick={() => updateZoom((value) => value + 0.15)}
//             className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
//           >
//             <ZoomIn size={14} />
//             Zoom in
//           </button>

//           <button
//             type="button"
//             onClick={handleResetView}
//             className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
//           >
//             <RotateCcw size={14} />
//             Reset
//           </button>
//         </div>
//       </div>

//       <div className="overflow-auto bg-slate-100 p-3 sm:p-4">
//         <div className="min-w-[760px] sm:min-w-[980px]">
//           <svg
//             ref={svgRef}
//             viewBox={`0 0 ${graphData.width} ${graphData.height}`}
//             className="h-[680px] w-full rounded-[24px] bg-white shadow-inner"
//             preserveAspectRatio="xMidYMid meet"
//             onMouseDown={handleMouseDown}
//             onMouseMove={handleMouseMove}
//             onMouseUp={handleMouseUp}
//             onMouseLeave={handleMouseUp}
//             style={{ cursor: isPanning ? "grabbing" : "grab" }}
//           >
//             <defs>
//               <pattern
//                 id="journey-grid"
//                 width="28"
//                 height="28"
//                 patternUnits="userSpaceOnUse"
//               >
//                 <path
//                   d="M 28 0 L 0 0 0 28"
//                   fill="none"
//                   stroke="#e2e8f0"
//                   strokeWidth="1"
//                 />
//               </pattern>

//               <filter id="node-shadow" x="-20%" y="-20%" width="140%" height="140%">
//                 <feDropShadow
//                   dx="0"
//                   dy="8"
//                   stdDeviation="8"
//                   floodColor="#0f172a"
//                   floodOpacity="0.08"
//                 />
//               </filter>
//             </defs>

//             <rect
//               x="0"
//               y="0"
//               width={graphData.width}
//               height={graphData.height}
//               fill="url(#journey-grid)"
//               rx="24"
//             />

//             <g transform={`translate(${pan.x} ${pan.y}) scale(${zoom})`}>
//               {graphData.edges.map((edge) => {
//                 const from = graphData.nodeMap.get(edge.from);
//                 const to = graphData.nodeMap.get(edge.to);

//                 if (!from || !to) return null;

//                 const fromTheme = getJourneyNodeTheme(from);
//                 const startX = from.layoutX;
//                 const startY = from.layoutY + from.layoutHeight / 2;
//                 const endX = to.layoutX;
//                 const endY = to.layoutY - to.layoutHeight / 2;
//                 const middleY = startY + Math.max(60, (endY - startY) / 2);

//                 const path = `
//                   M ${startX} ${startY}
//                   C ${startX} ${middleY}, ${endX} ${middleY}, ${endX} ${endY}
//                 `;

//                 return (
//                   <path
//                     key={edge.key}
//                     d={path}
//                     fill="none"
//                     stroke={fromTheme.stroke}
//                     strokeWidth={edge.relation === "related" ? 1.6 : 2.2}
//                     strokeLinecap="round"
//                     strokeDasharray={edge.relation === "related" ? "7 7" : "0"}
//                     opacity="0.55"
//                   />
//                 );
//               })}

//               {graphData.nodes.map((node) => {
//                 const width = node.layoutWidth || TREE_NODE_BASE_WIDTH;
//                 const height = node.layoutHeight || getJourneyNodeSize(node).height;

//                 return (
//                   <foreignObject
//                     key={node.nodeId}
//                     x={node.layoutX - width / 2}
//                     y={node.layoutY - height / 2}
//                     width={width}
//                     height={height}
//                     style={{ overflow: "visible" }}
//                   >
//                     <div xmlns="http://www.w3.org/1999/xhtml" className="h-full w-full">
//                       <JourneyNodeCard
//                         node={node}
//                         selectedNodeId={selectedNodeId}
//                         onSelectNode={onSelectNode}
//                       />
//                     </div>
//                   </foreignObject>
//                 );
//               })}
//             </g>
//           </svg>
//         </div>
//       </div>
//     </div>
//   );
// }

// function GoalModal({
//   open,
//   onClose,
//   goal,
//   goalForm,
//   setGoalForm,
//   onSubmit,
//   savingGoal,
//   generating,
//   onGenerate,
// }) {
//   if (!open) return null;

//   return (
//     <div className="fixed inset-0 z-[65] overflow-y-auto bg-slate-950/60 px-3 py-4 backdrop-blur-sm sm:px-4 sm:py-6">
//       <div className="flex min-h-full items-start justify-center sm:items-center">
//         <div className="flex max-h-[calc(100vh-2rem)] w-full max-w-4xl flex-col overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-2xl sm:max-h-[calc(100vh-3rem)] sm:rounded-[30px]">
//           <div className="relative shrink-0 overflow-hidden border-b border-slate-100 bg-gradient-to-r from-slate-900 via-slate-800 to-primary px-4 py-4 pr-14 text-white sm:px-6 sm:py-5">
//             <button
//               type="button"
//               onClick={onClose}
//               className="absolute right-4 top-4 rounded-full bg-white/10 p-2 transition hover:bg-white/20"
//             >
//               <X size={18} />
//             </button>

//             <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70 sm:text-xs sm:tracking-[0.24em]">
//               Set your next target
//             </p>

//             <h2 className="mt-2 text-xl font-semibold sm:text-2xl">
//               {goal?._id ? "Update your growth target" : "Create a new growth target"}
//             </h2>

//             <p className="mt-1 max-w-2xl text-xs leading-5 text-white/75 sm:text-sm">
//               Define the role, focus, and learning preferences so DevSta can generate a useful journey and roadmap.
//             </p>
//           </div>

//           <form className="flex min-h-0 flex-1 flex-col" onSubmit={onSubmit}>
//             <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-4 sm:space-y-6 sm:p-6">
//               <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//                 <div className="md:col-span-2">
//                   <label className="mb-2 block text-sm font-medium text-slate-700">
//                     Target name
//                   </label>
//                   <input
//                     type="text"
//                     value={goalForm.targetTitle}
//                     onChange={(event) =>
//                       setGoalForm((previous) => ({
//                         ...previous,
//                         targetTitle: event.target.value,
//                       }))
//                     }
//                     placeholder="Web Development"
//                     className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-primary"
//                   />
//                 </div>

//                 <div>
//                   <label className="mb-2 block text-sm font-medium text-slate-700">
//                     Target role
//                   </label>
//                   <input
//                     type="text"
//                     value={goalForm.targetRole}
//                     onChange={(event) =>
//                       setGoalForm((previous) => ({
//                         ...previous,
//                         targetRole: event.target.value,
//                       }))
//                     }
//                     placeholder="Frontend Developer"
//                     className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-primary"
//                   />
//                 </div>

//                 <div>
//                   <label className="mb-2 block text-sm font-medium text-slate-700">
//                     Target company
//                   </label>
//                   <input
//                     type="text"
//                     value={goalForm.targetCompany}
//                     onChange={(event) =>
//                       setGoalForm((previous) => ({
//                         ...previous,
//                         targetCompany: event.target.value,
//                       }))
//                     }
//                     placeholder="Meta"
//                     className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-primary"
//                   />
//                 </div>

//                 <div>
//                   <label className="mb-2 block text-sm font-medium text-slate-700">
//                     Experience level
//                   </label>
//                   <select
//                     value={goalForm.experienceLevel}
//                     onChange={(event) =>
//                       setGoalForm((previous) => ({
//                         ...previous,
//                         experienceLevel: event.target.value,
//                       }))
//                     }
//                     className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-primary"
//                   >
//                     {["intern", "junior", "mid", "senior", "lead", "other"].map((value) => (
//                       <option key={value} value={value}>
//                         {value.charAt(0).toUpperCase() + value.slice(1)}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <label className="mb-2 block text-sm font-medium text-slate-700">
//                     Timeline
//                   </label>
//                   <select
//                     value={goalForm.timeline}
//                     onChange={(event) =>
//                       setGoalForm((previous) => ({
//                         ...previous,
//                         timeline: event.target.value,
//                       }))
//                     }
//                     className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-primary"
//                   >
//                     {["1 month", "3 months", "6 months", "12 months"].map((value) => (
//                       <option key={value} value={value}>
//                         {value}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <label className="mb-2 block text-sm font-medium text-slate-700">
//                     Weekly availability
//                   </label>
//                   <select
//                     value={goalForm.weeklyAvailability}
//                     onChange={(event) =>
//                       setGoalForm((previous) => ({
//                         ...previous,
//                         weeklyAvailability: event.target.value,
//                       }))
//                     }
//                     className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-primary"
//                   >
//                     {["3 hours", "5 hours", "10 hours", "15+ hours"].map((value) => (
//                       <option key={value} value={value}>
//                         {value}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <label className="mb-2 block text-sm font-medium text-slate-700">
//                     Preferred resource type
//                   </label>
//                   <select
//                     value={goalForm.preferredResourceType}
//                     onChange={(event) =>
//                       setGoalForm((previous) => ({
//                         ...previous,
//                         preferredResourceType: event.target.value,
//                       }))
//                     }
//                     className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-primary"
//                   >
//                     {["Video", "Course", "Documentation", "Mixed"].map((value) => (
//                       <option key={value} value={value}>
//                         {value}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <label className="mb-2 block text-sm font-medium text-slate-700">
//                     Budget preference
//                   </label>
//                   <select
//                     value={goalForm.budgetPreference}
//                     onChange={(event) =>
//                       setGoalForm((previous) => ({
//                         ...previous,
//                         budgetPreference: event.target.value,
//                       }))
//                     }
//                     className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-primary"
//                   >
//                     {["Free only", "Free + paid"].map((value) => (
//                       <option key={value} value={value}>
//                         {value}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <label className="mb-2 block text-sm font-medium text-slate-700">
//                     Preferred difficulty
//                   </label>
//                   <select
//                     value={goalForm.preferredDifficulty}
//                     onChange={(event) =>
//                       setGoalForm((previous) => ({
//                         ...previous,
//                         preferredDifficulty: event.target.value,
//                       }))
//                     }
//                     className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-primary"
//                   >
//                     {["Beginner", "Intermediate", "Advanced", "Adaptive"].map((value) => (
//                       <option key={value} value={value}>
//                         {value}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div className="md:col-span-2">
//                   <label className="mb-2 block text-sm font-medium text-slate-700">
//                     Focus skills
//                   </label>
//                   <input
//                     type="text"
//                     value={goalForm.focusSkillsText}
//                     onChange={(event) =>
//                       setGoalForm((previous) => ({
//                         ...previous,
//                         focusSkillsText: event.target.value,
//                       }))
//                     }
//                     placeholder="react, angular, typescript, testing, performance"
//                     className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-primary"
//                   />
//                   <p className="mt-2 text-xs text-slate-400">
//                     Enter comma-separated skills.
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div className="shrink-0 border-t border-slate-100 bg-white/95 p-4 backdrop-blur sm:p-6">
//               <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
//                 <button
//                   type="button"
//                   onClick={onClose}
//                   className="w-full rounded-2xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 sm:w-auto"
//                 >
//                   Cancel
//                 </button>

//                 <button
//                   type="submit"
//                   disabled={savingGoal}
//                   className="w-full rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60 sm:w-auto"
//                 >
//                   {savingGoal ? "Saving..." : goal?._id ? "Update target" : "Save target"}
//                 </button>

//                 <button
//                   type="button"
//                   onClick={onGenerate}
//                   disabled={generating || !goal?._id}
//                   className="w-full rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60 sm:w-auto"
//                 >
//                   {generating ? "Generating..." : "Generate journey"}
//                 </button>
//               </div>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// function TargetCard({ goal, roadmaps, onViewRoadmaps, onEditGoal, onGenerate }) {
//   const relatedRoadmaps = roadmaps.filter(
//     (roadmap) => getGoalIdFromRoadmap(roadmap) === String(goal._id)
//   );

//   const averageCompletion = relatedRoadmaps.length
//     ? Math.round(
//         relatedRoadmaps.reduce(
//           (sum, roadmap) => sum + getRoadmapCompletion(roadmap),
//           0
//         ) / relatedRoadmaps.length
//       )
//     : 0;

//   const completedCount = relatedRoadmaps.filter(
//     (roadmap) => getRoadmapStatus(roadmap) === "completed"
//   ).length;

//   return (
//     <div className="rounded-[28px] border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6">
//       <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
//         <div className="min-w-0">
//           <h3 className="text-xl font-semibold text-slate-900">
//             {goal.targetTitle}
//           </h3>
//           <p className="mt-2 text-sm text-slate-500">
//             {goal.aiInterpretation?.inferredRole || goal.targetRole || "Custom target"}
//             {goal.targetCompany ? ` • ${goal.targetCompany}` : ""}
//           </p>

//           {Array.isArray(goal.focusSkills) && goal.focusSkills.length ? (
//             <div className="mt-4 flex flex-wrap gap-2">
//               {goal.focusSkills.slice(0, 8).map((skill) => (
//                 <span
//                   key={skill}
//                   className="rounded-full bg-white px-3 py-1.5 text-xs text-slate-600 ring-1 ring-slate-200"
//                 >
//                   {skill}
//                 </span>
//               ))}
//             </div>
//           ) : null}
//         </div>

//         <div className="flex flex-col gap-3 sm:flex-row xl:flex-col">
//           <button
//             type="button"
//             onClick={() => onViewRoadmaps(goal)}
//             className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
//           >
//             {relatedRoadmaps.length ? "View roadmap" : "Generate roadmap"}
//             <ArrowRight size={16} />
//           </button>

//           <button
//             type="button"
//             onClick={() => onEditGoal(goal)}
//             className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
//           >
//             Edit target
//           </button>
//         </div>
//       </div>

//       <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
//         <div className="rounded-2xl border border-primary/20 bg-white p-4">
//           <p className="text-xs uppercase tracking-wide text-primary/70">
//             Roadmaps
//           </p>
//           <p className="mt-2 text-2xl font-semibold text-primary">
//             {relatedRoadmaps.length}
//           </p>
//         </div>

//         <div className="rounded-2xl border border-emerald-200 bg-white p-4">
//           <p className="text-xs uppercase tracking-wide text-emerald-600">
//             Completed
//           </p>
//           <p className="mt-2 text-2xl font-semibold text-emerald-700">
//             {completedCount}
//           </p>
//         </div>

//         <div className="rounded-2xl border border-indigo-200 bg-white p-4">
//           <p className="text-xs uppercase tracking-wide text-indigo-600">
//             Avg completion
//           </p>
//           <p className="mt-2 text-2xl font-semibold text-indigo-700">
//             {averageCompletion}%
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// function RoadmapSelectionGrid({ roadmaps, selectedRoadmapId, progress, onSelect }) {
//   if (!roadmaps.length) {
//     return (
//       <EmptyState
//         title="No roadmaps yet"
//         subtitle="Generate a target journey first. All generated roadmaps will appear here."
//       />
//     );
//   }

//   return (
//     <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
//       {roadmaps.map((roadmap) => {
//         const selected = String(roadmap._id) === String(selectedRoadmapId);
//         const completion = getRoadmapCompletion(roadmap, selected ? progress : null);
//         const status = getRoadmapStatus(roadmap, selected ? progress : null);

//         return (
//           <button
//             key={roadmap._id}
//             type="button"
//             onClick={() => onSelect(roadmap)}
//             className={`rounded-[24px] border p-5 text-left transition ${
//               selected
//                 ? "border-primary bg-primary/5"
//                 : "border-slate-200 bg-white hover:bg-slate-50"
//             }`}
//           >
//             <div className="flex items-start gap-3">
//               <span
//                 className={`mt-1 h-3 w-3 shrink-0 rounded-full ring-4 ${getRoadmapDotClass(
//                   roadmap,
//                   selected ? progress : null,
//                   selected
//                 )}`}
//               />

//               <div className="min-w-0 flex-1">
//                 <h3 className="line-clamp-2 text-base font-semibold text-slate-900">
//                   {roadmap.title}
//                 </h3>
//                 <p className="mt-1 text-sm text-slate-500">
//                   {getGoalTitleFromRoadmap(roadmap)} • {getGoalRoleFromRoadmap(roadmap)}
//                 </p>

//                 <div className="mt-4 flex flex-wrap gap-2">
//                   <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold capitalize text-slate-500 ring-1 ring-slate-200">
//                     {status === "completed" ? "Completed" : "Active"}
//                   </span>
//                   <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-500 ring-1 ring-slate-200">
//                     {completion}% complete
//                   </span>
//                   <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-500 ring-1 ring-slate-200">
//                     {roadmap.estimatedHours || 0} hrs
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </button>
//         );
//       })}
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
//       <div className="rounded-[28px] border border-slate-200 bg-white p-6">
//         <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
//           <div className="max-w-2xl">
//             <div className="flex flex-wrap items-center gap-2">
//               <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-600">
//                 {roadmap.difficulty || "Intermediate"}
//               </span>

//               <span className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary">
//                 {getGoalTitleFromRoadmap(roadmap)}
//               </span>
//             </div>

//             <h3 className="mt-4 text-2xl font-semibold text-slate-900">
//               {roadmap.title}
//             </h3>

//             <p className="mt-2 text-sm leading-6 text-slate-500">
//               {roadmap.summary}
//             </p>

//             {selectedRoadmapSkills.length ? (
//               <div className="mt-5">
//                 <p className="text-sm font-semibold text-slate-900">
//                   Skills & prerequisites
//                 </p>
//                 <div className="mt-3 flex flex-wrap gap-2">
//                   {selectedRoadmapSkills.map((item) => (
//                     <span
//                       key={item}
//                       className="rounded-full bg-slate-100 px-3 py-1.5 text-xs text-slate-600"
//                     >
//                       {item}
//                     </span>
//                   ))}
//                 </div>
//               </div>
//             ) : null}
//           </div>

//           <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-2">
//             <div className="rounded-2xl bg-slate-50 p-4">
//               <p className="text-xs uppercase tracking-wide text-slate-400">
//                 Total hours
//               </p>
//               <p className="mt-2 text-lg font-semibold text-slate-900">
//                 {roadmap.estimatedHours || 0}
//               </p>
//             </div>

//             <div className="rounded-2xl bg-slate-50 p-4">
//               <p className="text-xs uppercase tracking-wide text-slate-400">
//                 ETA
//               </p>
//               <p className="mt-2 text-lg font-semibold text-slate-900">
//                 {roadmap.etaWeeks || 0} wks
//               </p>
//             </div>

//             <div className="rounded-2xl bg-slate-50 p-4">
//               <p className="text-xs uppercase tracking-wide text-slate-400">
//                 Score lift
//               </p>
//               <p className="mt-2 text-lg font-semibold text-slate-900">
//                 +{roadmap.projectedSkillScoreLift || 0}
//               </p>
//             </div>

//             <div className="rounded-2xl bg-slate-50 p-4">
//               <p className="text-xs uppercase tracking-wide text-slate-400">
//                 Progress
//               </p>
//               <p className="mt-2 text-lg font-semibold text-slate-900">
//                 {progress?.metrics?.pathCompletionPercent || metrics.pathCompletionPercent || 0}%
//               </p>
//             </div>
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
//               milestoneLessons.every((lesson) =>
//                 completedLessonIds.has(String(lesson._id))
//               );

//             const milestoneKey = String(
//               milestone._id || `${roadmap._id}-${milestoneIndex}`
//             );

//             const milestoneExpanded = expandedMilestoneIds.includes(milestoneKey);

//             return (
//               <div
//                 key={milestoneKey}
//                 className="rounded-[24px] border border-slate-200 bg-slate-50 p-5"
//               >
//                 <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
//                   <div className="min-w-0 flex-1">
//                     <div className="flex flex-wrap items-center gap-2">
//                       <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-500 ring-1 ring-slate-200">
//                         Milestone {milestoneIndex + 1}
//                       </span>

//                       <span
//                         className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
//                           milestoneDone
//                             ? "bg-emerald-100 text-emerald-700"
//                             : "bg-amber-100 text-amber-700"
//                         }`}
//                       >
//                         {milestoneDone ? "Completed" : "In progress"}
//                       </span>
//                     </div>

//                     <h4 className="mt-3 text-lg font-semibold text-slate-900">
//                       {milestone.title}
//                     </h4>
//                   </div>

//                   <button
//                     type="button"
//                     onClick={() => onToggleMilestone(milestoneKey)}
//                     className="shrink-0 px-1 text-2xl font-bold leading-none text-primary transition hover:scale-110"
//                     aria-label={
//                       milestoneExpanded
//                         ? "Hide milestone details"
//                         : "Show milestone details"
//                     }
//                   >
//                     {milestoneExpanded ? "<" : ">"}
//                   </button>
//                 </div>

//                 {milestoneExpanded ? (
//                   <div className="mt-5 space-y-4">
//                     {milestone.summary ? (
//                       <p className="text-sm text-slate-500">{milestone.summary}</p>
//                     ) : null}

//                     {milestoneLessons.map((lesson) => {
//                       const lessonDone = completedLessonIds.has(String(lesson._id));
//                       const isLoading = roadmapActionLoading === `lesson-${lesson._id}`;
//                       const displayResources = getDisplayResources({
//                         lesson,
//                         milestone,
//                         roadmap,
//                       });

//                       return (
//                         <div
//                           key={lesson._id}
//                           className="rounded-[24px] border border-slate-200 bg-white p-5"
//                         >
//                           <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
//                             <div className="flex-1">
//                               <div className="flex flex-wrap items-center gap-2">
//                                 <h5 className="text-base font-semibold text-slate-900">
//                                   {lesson.title}
//                                 </h5>

//                                 <span
//                                   className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
//                                     lessonDone
//                                       ? "bg-emerald-100 text-emerald-700"
//                                       : "bg-slate-100 text-slate-600"
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

//                               {lesson.goal ? (
//                                 <p className="mt-2 text-sm text-slate-500">
//                                   {lesson.goal}
//                                 </p>
//                               ) : null}

//                               <div className="mt-4 flex flex-wrap gap-2">
//                                 {(lesson.topics || []).map((topic) => (
//                                   <span
//                                     key={topic}
//                                     className="rounded-full bg-slate-100 px-3 py-1.5 text-xs text-slate-600"
//                                   >
//                                     {topic}
//                                   </span>
//                                 ))}
//                               </div>

//                               {lesson.practice ? (
//                                 <p className="mt-4 text-xs text-slate-500">
//                                   <span className="font-semibold text-slate-700">
//                                     Practice:
//                                   </span>{" "}
//                                   {lesson.practice}
//                                 </p>
//                               ) : null}

//                               {lesson.miniProject ? (
//                                 <p className="mt-1 text-xs text-slate-500">
//                                   <span className="font-semibold text-slate-700">
//                                     Mini project:
//                                   </span>{" "}
//                                   {lesson.miniProject}
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
//                                 {lessonDone
//                                   ? "Completed"
//                                   : isLoading
//                                   ? "Saving..."
//                                   : progress
//                                   ? "Log learning"
//                                   : "Start roadmap first"}
//                               </button>
//                             </div>
//                           </div>

//                           {displayResources.length ? (
//                             <div className="mt-5">
//                               <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
//                                 <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
//                                   Recommended resources
//                                 </p>

//                                 <div className="flex flex-wrap gap-2 text-[11px] font-medium text-slate-500">
//                                   <span>YouTube</span>
//                                   <span>•</span>
//                                   <span>Udemy</span>
//                                   <span>•</span>
//                                   <span>Coursera</span>
//                                   <span>•</span>
//                                   <span>MDN Docs</span>
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

// export default function SkillsPage() {
//   const { user } = useAuth();

//   const [activeTab, setActiveTab] = useState("overview");
//   const [loading, setLoading] = useState(true);
//   const [savingGoal, setSavingGoal] = useState(false);
//   const [generating, setGenerating] = useState(false);
//   const [roadmapActionLoading, setRoadmapActionLoading] = useState("");
//   const [statusMessage, setStatusMessage] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");

//   const [dashboard, setDashboard] = useState(null);
//   const [goals, setGoals] = useState([]);
//   const [goal, setGoal] = useState(null);
//   const [graph, setGraph] = useState(null);
//   const [roadmaps, setRoadmaps] = useState([]);
//   const [selectedRoadmapId, setSelectedRoadmapId] = useState("");
//   const [selectedRoadmapProgress, setSelectedRoadmapProgress] = useState(null);
//   const [selectedGraphNode, setSelectedGraphNode] = useState(null);
//   const [goalForm, setGoalForm] = useState(DEFAULT_GOAL_FORM);
//   const [pendingLesson, setPendingLesson] = useState(null);
//   const [showGoalModal, setShowGoalModal] = useState(false);
//   const [expandedRoadmapIds, setExpandedRoadmapIds] = useState([]);
//   const [expandedMilestoneIds, setExpandedMilestoneIds] = useState([]);

//   const graphGroups = useMemo(() => getGroupedGraphNodes(graph), [graph]);

//   const metrics = dashboard?.metrics || {
//     skillScore: 0,
//     hoursInvested30d: 0,
//     skillsClosedThisMonth: 0,
//     pathCompletionPercent: 0,
//   };

//   const recentAchievements = dashboard?.recentAchievements || [];

//   const selectedRoadmap =
//     roadmaps.find((roadmap) => String(roadmap._id) === String(selectedRoadmapId)) ||
//     null;

//   const completedLessonIds = new Set(
//     (selectedRoadmapProgress?.completedLessonIds || []).map((id) => String(id))
//   );

//   async function loadDashboardOnly() {
//     const response = await getMySkillsDashboard();
//     setDashboard(response?.dashboard || null);
//   }

//   async function loadRoadmapContext(roadmap) {
//     if (!roadmap?._id) {
//       setSelectedRoadmapId("");
//       setSelectedRoadmapProgress(null);
//       setGraph(null);
//       setSelectedGraphNode(null);
//       return;
//     }

//     setSelectedRoadmapId(roadmap._id);

//     const goalId = getGoalIdFromRoadmap(roadmap);

//     const [progressResponse, graphResponse] = await Promise.all([
//       getMySkillRoadmapProgress(roadmap._id).catch(() => ({ progress: null })),
//       goalId ? getMySkillGraph(goalId).catch(() => ({ graph: null })) : Promise.resolve({ graph: null }),
//     ]);

//     const graphData = graphResponse?.graph || null;

//     setSelectedRoadmapProgress(progressResponse?.progress || null);
//     setGraph(graphData);

//     if (graphData?.nodes?.length) {
//       const targetNode =
//         graphData.nodes.find((node) => node.type === "target") ||
//         graphData.nodes[0];
//       setSelectedGraphNode(targetNode || null);
//     } else {
//       setSelectedGraphNode(null);
//     }
//   }

//   async function loadSkillsPageData() {
//     try {
//       setLoading(true);
//       setErrorMessage("");

//       const [dashboardResponse, goalsResponse, activeGoalResponse, roadmapsResponse] =
//         await Promise.all([
//           getMySkillsDashboard(),
//           getMySkillGoals(),
//           getMySkillGoal(),
//           getMySkillRoadmaps("", { scope: "all" }),
//         ]);

//       const goalsData = goalsResponse?.goals || [];
//       const activeGoalData = activeGoalResponse?.goal || null;
//       const allRoadmaps = roadmapsResponse?.roadmaps || [];

//       setDashboard(dashboardResponse?.dashboard || null);
//       setGoals(goalsData);
//       setGoal(activeGoalData || null);
//       setGoalForm(fillGoalFormFromGoal(activeGoalData || null));
//       setRoadmaps(allRoadmaps);

//       if (allRoadmaps.length) {
//         await loadRoadmapContext(allRoadmaps[0]);
//       } else {
//         setSelectedRoadmapId("");
//         setSelectedRoadmapProgress(null);
//         setGraph(null);
//         setSelectedGraphNode(null);
//       }
//     } catch (error) {
//       console.error("loadSkillsPageData error:", error);
//       setErrorMessage(error.message || "Failed to load skills page");
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     loadSkillsPageData();
//   }, []);

//   useEffect(() => {
//     if (!statusMessage) return undefined;

//     const timer = setTimeout(() => {
//       setStatusMessage("");
//     }, 10000);

//     return () => clearTimeout(timer);
//   }, [statusMessage]);

//   async function reloadRoadmapsAndKeepSelection(preferredRoadmapId = selectedRoadmapId) {
//     const roadmapsResponse = await getMySkillRoadmaps("", { scope: "all" });
//     const allRoadmaps = roadmapsResponse?.roadmaps || [];
//     setRoadmaps(allRoadmaps);

//     const roadmapToSelect =
//       allRoadmaps.find((roadmap) => String(roadmap._id) === String(preferredRoadmapId)) ||
//       allRoadmaps[0] ||
//       null;

//     if (roadmapToSelect) {
//       await loadRoadmapContext(roadmapToSelect);
//     } else {
//       await loadRoadmapContext(null);
//     }
//   }

//   async function handleSaveGoal(event) {
//     event.preventDefault();

//     try {
//       setSavingGoal(true);
//       setStatusMessage("");
//       setErrorMessage("");

//       const payload = {
//         goalId: goal?._id || undefined,
//         targetTitle: goalForm.targetTitle.trim(),
//         targetRole: goalForm.targetRole.trim(),
//         targetCompany: goalForm.targetCompany.trim(),
//         experienceLevel: goalForm.experienceLevel || "other",
//         focusSkills: getFocusSkillsArray(goalForm.focusSkillsText),
//         timeline: goalForm.timeline,
//         weeklyAvailability: goalForm.weeklyAvailability,
//         preferredResourceType: goalForm.preferredResourceType,
//         budgetPreference: goalForm.budgetPreference,
//         preferredDifficulty: goalForm.preferredDifficulty,
//         setAsActive: true,
//       };

//       const response = await saveMySkillGoal(payload);
//       const savedGoal = response?.goal || null;

//       setGoal(savedGoal);
//       setGoalForm(fillGoalFormFromGoal(savedGoal));

//       const goalsResponse = await getMySkillGoals();
//       setGoals(goalsResponse?.goals || []);

//       await loadDashboardOnly();
//       setStatusMessage(goal?._id ? "Target updated successfully." : "Target saved successfully.");
//     } catch (error) {
//       setErrorMessage(error.message || "Failed to save target");
//     } finally {
//       setSavingGoal(false);
//     }
//   }

//   async function handleGenerateInsights(goalId = goal?._id) {
//     if (!goalId) {
//       setErrorMessage("Please save a target first.");
//       return;
//     }

//     try {
//       setGenerating(true);
//       setStatusMessage("");
//       setErrorMessage("");

//       const response = await generateMySkillInsights(goalId);
//       const generatedRoadmap = response?.roadmaps?.[0] || null;

//       await loadDashboardOnly();
//       await reloadRoadmapsAndKeepSelection(generatedRoadmap?._id || selectedRoadmapId);

//       setActiveTab("roadmap");
//       setShowGoalModal(false);
//       setStatusMessage("Journey and roadmap generated successfully.");
//     } catch (error) {
//       setErrorMessage(error.message || "Failed to generate insights");
//     } finally {
//       setGenerating(false);
//     }
//   }

//   function handleCreateNewTarget() {
//     setGoal(null);
//     setGoalForm(DEFAULT_GOAL_FORM);
//     setShowGoalModal(true);
//     setStatusMessage("");
//     setErrorMessage("");
//   }

//   function handleEditGoal(selectedGoal) {
//     setGoal(selectedGoal);
//     setGoalForm(fillGoalFormFromGoal(selectedGoal));
//     setShowGoalModal(true);
//     setStatusMessage("");
//     setErrorMessage("");
//   }

//   async function handleViewGoalRoadmaps(selectedGoal) {
//     const firstRoadmap = roadmaps.find(
//       (roadmap) => getGoalIdFromRoadmap(roadmap) === String(selectedGoal._id)
//     );

//     if (firstRoadmap) {
//       await loadRoadmapContext(firstRoadmap);
//       setActiveTab("roadmap");
//       return;
//     }

//     setGoal(selectedGoal);
//     setGoalForm(fillGoalFormFromGoal(selectedGoal));
//     await handleGenerateInsights(selectedGoal._id);
//   }

//   async function handleSelectRoadmap(roadmap) {
//     try {
//       setStatusMessage("");
//       setErrorMessage("");
//       await loadRoadmapContext(roadmap);
//     } catch (error) {
//       setErrorMessage(error.message || "Failed to load roadmap details");
//     }
//   }

//   async function handleInitializeProgress(roadmapId) {
//     try {
//       setRoadmapActionLoading(`init-${roadmapId}`);
//       await initMySkillRoadmapProgress(roadmapId);
//       await loadRoadmapContext(selectedRoadmap);
//       await loadDashboardOnly();
//       await reloadRoadmapsAndKeepSelection(roadmapId);
//       setStatusMessage("Roadmap progress initialized successfully.");
//     } catch (error) {
//       setErrorMessage(error.message || "Failed to initialize roadmap progress");
//     } finally {
//       setRoadmapActionLoading("");
//     }
//   }

//   function handleCompleteLesson(roadmapId, lesson) {
//     setPendingLesson({ ...lesson, roadmapId });
//   }

//   async function handleLessonConfirm({ lessonId, minutes, understanding, note }) {
//     if (!pendingLesson?.roadmapId) return;

//     const roadmapId = pendingLesson.roadmapId;

//     try {
//       setRoadmapActionLoading(`lesson-${lessonId}`);
//       setStatusMessage("");
//       setErrorMessage("");

//       await completeMySkillLesson(roadmapId, lessonId, {
//         minutes,
//         understanding,
//         note,
//       });

//       await loadRoadmapContext(selectedRoadmap);
//       await loadDashboardOnly();
//       await reloadRoadmapsAndKeepSelection(roadmapId);

//       setStatusMessage("Learning log saved successfully.");
//     } catch (error) {
//       setErrorMessage(error.message || "Failed to save learning log");
//     } finally {
//       setRoadmapActionLoading("");
//       setPendingLesson(null);
//     }
//   }

//   async function handleAddQuickTimeLog(roadmapId) {
//     try {
//       setRoadmapActionLoading(`timelog-${roadmapId}`);

//       await addMySkillTimeLog(roadmapId, {
//         minutes: 60,
//         note: "Quick 1 hour study log",
//         source: "manual",
//       });

//       await loadRoadmapContext(selectedRoadmap);
//       await loadDashboardOnly();
//       await reloadRoadmapsAndKeepSelection(roadmapId);

//       setStatusMessage("1 hour time log added successfully.");
//     } catch (error) {
//       setErrorMessage(error.message || "Failed to add time log");
//     } finally {
//       setRoadmapActionLoading("");
//     }
//   }

//   function toggleExpandedRoadmap(roadmapId) {
//     const id = String(roadmapId);

//     setExpandedRoadmapIds((previous) =>
//       previous.includes(id)
//         ? previous.filter((item) => item !== id)
//         : [...previous, id]
//     );
//   }

//   function toggleExpandedMilestone(milestoneId) {
//     const id = String(milestoneId);

//     setExpandedMilestoneIds((previous) =>
//       previous.includes(id)
//         ? previous.filter((item) => item !== id)
//         : [...previous, id]
//     );
//   }

//   const activityItems = [
//     ...(selectedRoadmapProgress?.achievements || []).map((item) => ({
//       type: "achievement",
//       date: item.awardedAt || new Date().toISOString(),
//       title: item.title,
//       subtitle: item.linkedSkill || "Achievement unlocked",
//       impact: item.impactScore || 0,
//     })),
//     ...(selectedRoadmapProgress?.timeLogs || []).map((item, index) => ({
//       type: "timelog",
//       date: item.date || new Date().toISOString(),
//       title: `${item.minutes || 0} minutes logged`,
//       subtitle: item.note || item.source || `Study session ${index + 1}`,
//       impact: item.minutes || 0,
//     })),
//   ].sort((a, b) => new Date(b.date) - new Date(a.date));

//   return (
//     <DashboardLayout user={user}>
//       <LessonCompleteModal
//         lesson={pendingLesson}
//         onConfirm={handleLessonConfirm}
//         onClose={() => setPendingLesson(null)}
//       />

//       <GoalModal
//         open={showGoalModal}
//         onClose={() => setShowGoalModal(false)}
//         goal={goal}
//         goalForm={goalForm}
//         setGoalForm={setGoalForm}
//         onSubmit={handleSaveGoal}
//         savingGoal={savingGoal}
//         generating={generating}
//         onGenerate={() => handleGenerateInsights(goal?._id)}
//       />

//       <div className="flex h-full w-full flex-col">
//         <div className="flex items-center justify-between gap-4 px-4 py-2">
//           <div className="flex gap-4 overflow-x-auto">
//             {TABS.map((tab) => {
//               const label =
//                 tab === "overview"
//                   ? "Overview"
//                   : tab === "journey"
//                   ? "Journey"
//                   : tab === "roadmap"
//                   ? "Roadmap"
//                   : "Activity";

//               return (
//                 <button
//                   key={tab}
//                   type="button"
//                   onClick={() => setActiveTab(tab)}
//                   className={`whitespace-nowrap px-2 py-1 text-sm font-bold transition-colors duration-200 ${
//                     activeTab === tab
//                       ? "border-b-2 border-primary text-primary"
//                       : "text-gray-500 hover:text-primary dark:text-gray-400"
//                   }`}
//                 >
//                   {label}
//                 </button>
//               );
//             })}
//           </div>

//           <button
//             type="button"
//             onClick={handleCreateNewTarget}
//             className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
//           >
//             <Target size={16} />
//             Set your goal
//           </button>
//         </div>

//         <main className="flex-1 overflow-auto bg-slate-50 px-4 py-5">
//           {loading ? (
//             <div className="flex h-full items-center justify-center">
//               <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
//             </div>
//           ) : (
//             <div
//               className={
//                 activeTab === "roadmap"
//                   ? "w-full space-y-8"
//                   : "mx-auto max-w-7xl space-y-8"
//               }
//             >
//               {activeTab === "overview" ? (
//                 <div className="relative overflow-hidden rounded-[32px] border border-primary/25 bg-gradient-to-br from-black via-slate-950 to-primary px-6 py-6 text-white shadow-none">
//                   <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-primary/40 blur-3xl" />
//                   <div className="pointer-events-none absolute right-10 -bottom-28 h-72 w-72 rounded-full bg-primary/25 blur-3xl" />
//                   <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_35%,rgba(255,255,255,0.16),transparent_32%)]" />
//                   <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.96)_0%,rgba(0,0,0,0.80)_44%,rgba(0,0,0,0.18)_100%)]" />

//                   <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
//                     <div className="max-w-2xl">
//                       <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-white ring-1 ring-white/15 backdrop-blur">
//                         <Sparkles size={14} />
//                         Growth Hub
//                       </div>
//                       <h1 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
//                         Build your next role with more clarity
//                       </h1>
//                       <p className="mt-3 max-w-xl text-sm leading-6 text-white/70 sm:text-base">
//                         View all targets, explore every generated roadmap, and log your learning progress.
//                       </p>

//                       <div className="mt-5 flex flex-wrap items-center gap-3">
//                         <div className="rounded-2xl border border-white/12 bg-white/10 px-4 py-3 shadow-sm ring-1 ring-white/10 backdrop-blur">
//                           <p className="text-xs uppercase tracking-wide text-white/55">
//                             Total targets
//                           </p>
//                           <p className="mt-1 text-sm font-semibold text-white">
//                             {goals.length}
//                           </p>
//                         </div>

//                         <div className="rounded-2xl border border-white/12 bg-white/10 px-4 py-3 shadow-sm ring-1 ring-white/10 backdrop-blur">
//                           <p className="text-xs uppercase tracking-wide text-white/55">
//                             Total roadmaps
//                           </p>
//                           <p className="mt-1 text-sm font-semibold text-white">
//                             {roadmaps.length}
//                           </p>
//                         </div>

//                         <div className="rounded-2xl border border-white/12 bg-white/10 px-4 py-3 shadow-sm ring-1 ring-white/10 backdrop-blur">
//                           <p className="text-xs uppercase tracking-wide text-white/55">
//                             Overall completion
//                           </p>
//                           <p className="mt-1 text-sm font-semibold text-white">
//                             {metrics.pathCompletionPercent || 0}%
//                           </p>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="flex flex-wrap gap-3">
//                       <button
//                         type="button"
//                         onClick={handleCreateNewTarget}
//                         className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-primary shadow-[0_12px_30px_rgba(0,0,0,0.24)] ring-1 ring-white/20 transition hover:bg-white/90"
//                       >
//                         <Plus size={16} />
//                         New target
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ) : null}

//               {statusMessage ? (
//                 <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 shadow-sm">
//                   <style>
//                     {`@keyframes skillStatusCountdown {
//                       from { width: 100%; }
//                       to { width: 0%; }
//                     }`}
//                   </style>

//                   <div className="flex items-center gap-3">
//                     <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
//                       <CheckCircle2 size={16} />
//                     </div>
//                     <p>{statusMessage}</p>
//                   </div>

//                   <div
//                     className="absolute bottom-0 left-0 h-1 bg-primary"
//                     style={{ animation: "skillStatusCountdown 10s linear forwards" }}
//                   />
//                 </div>
//               ) : null}

//               {errorMessage ? (
//                 <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
//                   {errorMessage}
//                 </div>
//               ) : null}

//               {activeTab === "overview" ? (
//                 <div className="space-y-6">
//                   <SectionCard
//                     title="All Targets"
//                     subtitle="Every target is shown here. Roadmaps stay active until they are completed."
//                   >
//                     {!goals.length ? (
//                       <EmptyState
//                         title="Start by setting a target"
//                         subtitle="Once your target is saved, DevSta can generate its journey map and roadmap."
//                         actionLabel="Create target"
//                         onAction={handleCreateNewTarget}
//                       />
//                     ) : (
//                       <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
//                         {goals.map((item) => (
//                           <TargetCard
//                             key={item._id}
//                             goal={item}
//                             roadmaps={roadmaps}
//                             onViewRoadmaps={handleViewGoalRoadmaps}
//                             onEditGoal={handleEditGoal}
//                             onGenerate={handleGenerateInsights}
//                           />
//                         ))}
//                       </div>
//                     )}
//                   </SectionCard>

//                   <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
//                     <MetricCard
//                       label="Skill score"
//                       value={metrics.skillScore || 0}
//                       helper="Combined score from learning progress"
//                       icon={Sparkles}
//                     />
//                     <MetricCard
//                       label="Hours invested"
//                       value={metrics.hoursInvested30d || 0}
//                       helper="Hours invested in the last 30 days"
//                       icon={Clock3}
//                     />
//                     <MetricCard
//                       label="Skills closed"
//                       value={metrics.skillsClosedThisMonth || 0}
//                       helper="Skills completed this month"
//                       icon={CheckCircle2}
//                     />
//                     <MetricCard
//                       label="Path completion"
//                       value={`${metrics.pathCompletionPercent || 0}%`}
//                       helper="Average progress across active roadmaps"
//                       icon={Compass}
//                     />
//                   </div>

//                   <SectionCard
//                     title="Recent achievements"
//                     subtitle="The latest wins from all your learning roadmaps."
//                   >
//                     {!recentAchievements.length ? (
//                       <EmptyState
//                         title="No achievements yet"
//                         subtitle="Complete lessons and milestones to build your achievement history."
//                       />
//                     ) : (
//                       <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
//                         {recentAchievements.map((item, index) => (
//                           <div
//                             key={`${item.title}-${index}`}
//                             className="rounded-[24px] border border-slate-200 bg-slate-50 p-5"
//                           >
//                             <div className="flex items-start justify-between gap-3">
//                               <div className="rounded-xl bg-amber-100 p-2 text-amber-700">
//                                 <Trophy size={18} />
//                               </div>
//                               <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-500 ring-1 ring-slate-200">
//                                 {item.awardedAt
//                                   ? new Date(item.awardedAt).toLocaleDateString()
//                                   : "-"}
//                               </span>
//                             </div>

//                             <h3 className="mt-4 text-base font-semibold text-slate-900">
//                               {item.title}
//                             </h3>

//                             <p className="mt-1 text-sm text-slate-500">
//                               {item.linkedSkill || "Achievement"}
//                             </p>

//                             <p className="mt-3 text-xs text-slate-400">
//                               Impact score: {item.impactScore || 0}
//                             </p>
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </SectionCard>
//                 </div>
//               ) : null}

//               {activeTab === "journey" ? (
//                 <div className="space-y-6">
//                   <SectionCard
//                     title="Journey targets"
//                     subtitle="All generated roadmaps are shown here. Select any roadmap to view its journey map."
//                     rightNode={
//                       <button
//                         type="button"
//                         onClick={handleCreateNewTarget}
//                         className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
//                       >
//                         <Plus size={16} />
//                         Create target
//                       </button>
//                     }
//                   >
//                     <RoadmapSelectionGrid
//                       roadmaps={roadmaps}
//                       selectedRoadmapId={selectedRoadmapId}
//                       progress={selectedRoadmapProgress}
//                       onSelect={handleSelectRoadmap}
//                     />
//                   </SectionCard>

//                   <SectionCard
//                     title="Journey map"
//                     subtitle={
//                       selectedRoadmap
//                         ? `Visual map for ${selectedRoadmap.title}`
//                         : "Select a roadmap to explore its skill journey."
//                     }
//                     rightNode={<GraphLegend />}
//                   >
//                     {!selectedRoadmap ? (
//                       <EmptyState
//                         title="No roadmap selected"
//                         subtitle="Select a roadmap above to view its graph."
//                       />
//                     ) : (
//                       <div className="space-y-6">
//                         <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
//                           <MetricCard
//                             label="Total Nodes"
//                             value={graph?.summary?.totalNodes || 0}
//                             helper="Target, milestones, and skills"
//                             icon={Layers3}
//                           />
//                           <MetricCard
//                             label="Owned"
//                             value={graph?.summary?.ownedCount || 0}
//                             helper="Skills already available"
//                             icon={Crown}
//                           />
//                           <MetricCard
//                             label="Learning"
//                             value={graph?.summary?.learningCount || 0}
//                             helper="Skills currently in progress"
//                             icon={BookOpen}
//                           />
//                           <MetricCard
//                             label="Gap"
//                             value={graph?.summary?.gapCount || 0}
//                             helper="Skills still missing"
//                             icon={Target}
//                           />
//                         </div>

//                         <GraphCanvas
//                           graph={graph}
//                           selectedNodeId={selectedGraphNode?.nodeId || ""}
//                           onSelectNode={setSelectedGraphNode}
//                         />

//                         <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
//                           {[
//                             {
//                               label: "Owned skills",
//                               list: graphGroups.owned,
//                               bg: "bg-emerald-50",
//                               text: "text-emerald-800",
//                             },
//                             {
//                               label: "Learning skills",
//                               list: graphGroups.learning,
//                               bg: "bg-amber-50",
//                               text: "text-amber-800",
//                             },
//                             {
//                               label: "Missing skills",
//                               list: graphGroups.gap,
//                               bg: "bg-rose-50",
//                               text: "text-rose-800",
//                             },
//                           ].map((group) => (
//                             <div
//                               key={group.label}
//                               className={`rounded-[24px] ${group.bg} p-4`}
//                             >
//                               <h3 className={`text-sm font-semibold ${group.text}`}>
//                                 {group.label}
//                               </h3>

//                               <div className="mt-4 flex flex-wrap gap-2">
//                                 {group.list.length ? (
//                                   group.list.map((item) => (
//                                     <button
//                                       key={item.nodeId}
//                                       type="button"
//                                       onClick={() => setSelectedGraphNode(item)}
//                                       className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50"
//                                     >
//                                       {item.label}
//                                     </button>
//                                   ))
//                                 ) : (
//                                   <p className="text-sm text-slate-500">
//                                     Nothing here yet.
//                                   </p>
//                                 )}
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     )}
//                   </SectionCard>
//                 </div>
//               ) : null}

//               {activeTab === "roadmap" ? (
//                 <div className="w-full space-y-6">
//                   <SectionCard
//                     title="Roadmap"
//                     subtitle="All roadmaps appear on the left. Select one to view details on the right."
//                     className="w-full"
//                   >
//                     {!roadmaps.length ? (
//                       <EmptyState
//                         title="No roadmap generated yet"
//                         subtitle="Generate your journey after saving a target to unlock roadmap plans."
//                         actionLabel="Create target"
//                         onAction={handleCreateNewTarget}
//                       />
//                     ) : (
//                       <div className="grid w-full grid-cols-1 items-start gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
//                         <div className="w-full space-y-3">
//                           <div className="flex flex-col gap-3 px-1 sm:flex-row sm:items-center sm:justify-between">
//                             <p className="text-sm font-semibold text-slate-900">
//                               All roadmaps
//                             </p>

//                             <div className="flex flex-wrap gap-2 text-[11px] font-medium text-slate-500">
//                               <span className="inline-flex items-center gap-1.5">
//                                 <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
//                                 Selected
//                               </span>
//                               <span className="inline-flex items-center gap-1.5">
//                                 <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
//                                 Active
//                               </span>
//                               <span className="inline-flex items-center gap-1.5">
//                                 <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
//                                 Completed
//                               </span>
//                             </div>
//                           </div>

//                           {roadmaps.map((roadmap) => {
//                             const selected =
//                               String(roadmap._id) === String(selectedRoadmapId);
//                             const roadmapExpanded = expandedRoadmapIds.includes(
//                               String(roadmap._id)
//                             );
//                             const roadmapStatus = getRoadmapStatus(
//                               roadmap,
//                               selected ? selectedRoadmapProgress : null
//                             );
//                             const completion = getRoadmapCompletion(
//                               roadmap,
//                               selected ? selectedRoadmapProgress : null
//                             );

//                             const cardClass =
//                               roadmapStatus === "completed"
//                                 ? "border-emerald-200 bg-emerald-50 hover:bg-emerald-100/70"
//                                 : selected
//                                 ? "border-amber-200 bg-white hover:bg-slate-50"
//                                 : "border-slate-200 bg-slate-50 hover:bg-slate-100";

//                             return (
//                               <div
//                                 key={roadmap._id}
//                                 className={`w-full rounded-[22px] border p-4 text-left transition ${cardClass}`}
//                               >
//                                 <div className="flex items-start gap-3">
//                                   <span
//                                     className={`mt-1 h-3 w-3 shrink-0 rounded-full ring-4 ${getRoadmapDotClass(
//                                       roadmap,
//                                       selected ? selectedRoadmapProgress : null,
//                                       selected
//                                     )}`}
//                                   />

//                                   <button
//                                     type="button"
//                                     onClick={() => handleSelectRoadmap(roadmap)}
//                                     className="min-w-0 flex-1 text-left"
//                                   >
//                                     <h3 className="line-clamp-2 text-sm font-semibold text-slate-900">
//                                       {roadmap.title}
//                                     </h3>

//                                     <p className="mt-1 line-clamp-1 text-xs text-slate-500">
//                                       {getGoalTitleFromRoadmap(roadmap)} • {completion}% complete
//                                     </p>
//                                   </button>

//                                   <button
//                                     type="button"
//                                     onClick={() => toggleExpandedRoadmap(roadmap._id)}
//                                     className="shrink-0 px-1 text-2xl font-bold leading-none text-primary transition hover:scale-110"
//                                     aria-label={
//                                       roadmapExpanded
//                                         ? "Hide roadmap details"
//                                         : "Show roadmap details"
//                                     }
//                                   >
//                                     {roadmapExpanded ? "<" : ">"}
//                                   </button>
//                                 </div>

//                                 {roadmapExpanded ? (
//                                   <div className="mt-3 pl-6">
//                                     <p className="line-clamp-3 text-xs leading-5 text-slate-500">
//                                       {roadmap.summary ||
//                                         "No roadmap description available yet."}
//                                     </p>

//                                     <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-medium text-slate-500">
//                                       <span className="rounded-full bg-white px-2.5 py-1 ring-1 ring-current/10">
//                                         {roadmap.difficulty || "Roadmap"}
//                                       </span>
//                                       <span className="rounded-full bg-white px-2.5 py-1 ring-1 ring-current/10">
//                                         {roadmap.estimatedHours || 0} hrs
//                                       </span>
//                                       <span className="rounded-full bg-white px-2.5 py-1 ring-1 ring-current/10">
//                                         {roadmap.etaWeeks || 0} wks
//                                       </span>
//                                     </div>
//                                   </div>
//                                 ) : null}
//                               </div>
//                             );
//                           })}
//                         </div>

//                         <div className="min-w-0">
//                           <RoadmapDetails
//                             roadmap={selectedRoadmap}
//                             progress={selectedRoadmapProgress}
//                             metrics={metrics}
//                             completedLessonIds={completedLessonIds}
//                             roadmapActionLoading={roadmapActionLoading}
//                             expandedMilestoneIds={expandedMilestoneIds}
//                             onToggleMilestone={toggleExpandedMilestone}
//                             onStartRoadmap={handleInitializeProgress}
//                             onAddQuickLog={handleAddQuickTimeLog}
//                             onCompleteLesson={handleCompleteLesson}
//                           />
//                         </div>
//                       </div>
//                     )}
//                   </SectionCard>
//                 </div>
//               ) : null}

//               {activeTab === "activity" ? (
//                 <div className="space-y-6">
//                   <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
//                     <MetricCard
//                       label="Recent wins"
//                       value={recentAchievements.length}
//                       helper="Latest achievements from all roadmaps"
//                       icon={Trophy}
//                     />
//                     <MetricCard
//                       label="Current streak"
//                       value={selectedRoadmapProgress?.timeLogs?.length || 0}
//                       helper="Logged learning sessions"
//                       icon={Flame}
//                     />
//                     <MetricCard
//                       label="Hours tracked"
//                       value={metrics.hoursInvested30d || 0}
//                       helper="Hours invested in the last 30 days"
//                       icon={Clock3}
//                     />
//                     <MetricCard
//                       label="Selected roadmap"
//                       value={
//                         selectedRoadmapProgress?.status
//                           ? String(selectedRoadmapProgress.status).replace(/^\w/, (m) =>
//                               m.toUpperCase()
//                             )
//                           : "Not started"
//                       }
//                       helper="Status of the selected roadmap"
//                       icon={Briefcase}
//                     />
//                   </div>

//                   <SectionCard
//                     title="Learning activity"
//                     subtitle="A combined view of your logged time and earned achievements for the selected roadmap."
//                   >
//                     {!activityItems.length ? (
//                       <EmptyState
//                         title="No activity yet"
//                         subtitle="Once you start logging learning and completing lessons, your activity will appear here."
//                       />
//                     ) : (
//                       <div className="space-y-4">
//                         {activityItems.map((item, index) => (
//                           <div
//                             key={`${item.type}-${index}-${item.date}`}
//                             className="rounded-[24px] border border-slate-200 bg-slate-50 p-5"
//                           >
//                             <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
//                               <div className="flex items-start gap-4">
//                                 <div
//                                   className={`rounded-2xl p-3 ${
//                                     item.type === "achievement"
//                                       ? "bg-amber-100 text-amber-700"
//                                       : "bg-sky-100 text-sky-700"
//                                   }`}
//                                 >
//                                   {item.type === "achievement" ? (
//                                     <Trophy size={18} />
//                                   ) : (
//                                     <Clock3 size={18} />
//                                   )}
//                                 </div>

//                                 <div>
//                                   <p className="text-base font-semibold text-slate-900">
//                                     {item.title}
//                                   </p>
//                                   <p className="mt-1 text-sm text-slate-500">
//                                     {item.subtitle}
//                                   </p>
//                                 </div>
//                               </div>

//                               <div className="flex flex-col items-start gap-2 sm:items-end">
//                                 <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-500 ring-1 ring-slate-200">
//                                   {item.type === "achievement" ? "Achievement" : "Time log"}
//                                 </span>
//                                 <p className="text-xs text-slate-400">
//                                   {item.date ? new Date(item.date).toLocaleString() : "-"}
//                                 </p>
//                               </div>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </SectionCard>

//                   <SectionCard
//                     title="Achievement history"
//                     subtitle="A cleaner summary of recently unlocked achievements."
//                   >
//                     {!recentAchievements.length ? (
//                       <p className="text-sm text-slate-500">
//                         No achievements yet. Complete lessons and milestones to build your activity history.
//                       </p>
//                     ) : (
//                       <div className="overflow-x-auto">
//                         <table className="min-w-full text-left text-sm">
//                           <thead className="border-b border-slate-200 text-slate-500">
//                             <tr>
//                               <th className="px-3 py-3 font-medium">Date</th>
//                               <th className="px-3 py-3 font-medium">Item</th>
//                               <th className="px-3 py-3 font-medium">Impact</th>
//                               <th className="px-3 py-3 font-medium">Linked Skill</th>
//                             </tr>
//                           </thead>

//                           <tbody>
//                             {recentAchievements.map((item, index) => (
//                               <tr
//                                 key={`${item.title}-${index}`}
//                                 className="border-b border-slate-100"
//                               >
//                                 <td className="px-3 py-3 text-slate-600">
//                                   {item.awardedAt
//                                     ? new Date(item.awardedAt).toLocaleDateString()
//                                     : "-"}
//                                 </td>
//                                 <td className="px-3 py-3 font-medium text-slate-900">
//                                   {item.title}
//                                 </td>
//                                 <td className="px-3 py-3 text-slate-600">
//                                   {item.impactScore || 0}
//                                 </td>
//                                 <td className="px-3 py-3 text-slate-600">
//                                   {item.linkedSkill || "-"}
//                                 </td>
//                               </tr>
//                             ))}
//                           </tbody>
//                         </table>
//                       </div>
//                     )}
//                   </SectionCard>
//                 </div>
//               ) : null}
//             </div>
//           )}
//         </main>
//       </div>
//     </DashboardLayout>
//   );
// }


import React, { useEffect, useMemo, useState } from "react";
import {
  addMySkillTimeLog,
  completeMySkillLesson,
  generateMySkillInsights,
  getMySkillGraph,
  getMySkillGoal,
  getMySkillGoals,
  getMySkillRoadmaps,
  getMySkillsDashboard,
  getMySkillRoadmapProgress,
  initMySkillRoadmapProgress,
  saveMySkillGoal,
} from "../../api/user/skillInsights";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import LessonCompleteModal from "../../components/skills/LessonCompleteModal";
import { useAuth } from "../../context/AuthContext";
import { CheckCircle2, Target } from "lucide-react";

import ActivityTab from "../../components/skills/skillsPage/ActivityTab";
import GoalModal from "../../components/skills/skillsPage/GoalModal";
import JourneyTab from "../../components/skills/skillsPage/JourneyTab";
import OverviewTab from "../../components/skills/skillsPage/OverviewTab";
import RoadmapTab from "../../components/skills/skillsPage/RoadmapTab";
import { DEFAULT_GOAL_FORM, TABS } from "../../components/skills/skillsPage/constants";
import {
  fillGoalFormFromGoal,
  getFocusSkillsArray,
  getGoalIdFromRoadmap,
  getGroupedGraphNodes,
} from "../../components/skills/skillsPage/skillPageUtils";

export default function SkillsPage() {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [savingGoal, setSavingGoal] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [roadmapActionLoading, setRoadmapActionLoading] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [dashboard, setDashboard] = useState(null);
  const [goals, setGoals] = useState([]);
  const [goal, setGoal] = useState(null);
  const [graph, setGraph] = useState(null);
  const [roadmaps, setRoadmaps] = useState([]);
  const [selectedRoadmapId, setSelectedRoadmapId] = useState("");
  const [selectedRoadmapProgress, setSelectedRoadmapProgress] = useState(null);
  const [selectedGraphNode, setSelectedGraphNode] = useState(null);
  const [goalForm, setGoalForm] = useState(DEFAULT_GOAL_FORM);
  const [pendingLesson, setPendingLesson] = useState(null);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [expandedRoadmapIds, setExpandedRoadmapIds] = useState([]);
  const [expandedMilestoneIds, setExpandedMilestoneIds] = useState([]);

  const graphGroups = useMemo(() => getGroupedGraphNodes(graph), [graph]);

  const metrics = dashboard?.metrics || {
    skillScore: 0,
    hoursInvested30d: 0,
    skillsClosedThisMonth: 0,
    pathCompletionPercent: 0,
  };

  const recentAchievements = dashboard?.recentAchievements || [];

  const selectedRoadmap =
    roadmaps.find((roadmap) => String(roadmap._id) === String(selectedRoadmapId)) || null;

  const completedLessonIds = new Set(
    (selectedRoadmapProgress?.completedLessonIds || []).map((id) => String(id))
  );

  async function loadDashboardOnly() {
    const response = await getMySkillsDashboard();
    setDashboard(response?.dashboard || null);
  }

  async function loadRoadmapContext(roadmap) {
    if (!roadmap?._id) {
      setSelectedRoadmapId("");
      setSelectedRoadmapProgress(null);
      setGraph(null);
      setSelectedGraphNode(null);
      return;
    }

    setSelectedRoadmapId(roadmap._id);

    const goalId = getGoalIdFromRoadmap(roadmap);

    const [progressResponse, graphResponse] = await Promise.all([
      getMySkillRoadmapProgress(roadmap._id).catch(() => ({ progress: null })),
      goalId ? getMySkillGraph(goalId).catch(() => ({ graph: null })) : Promise.resolve({ graph: null }),
    ]);

    const graphData = graphResponse?.graph || null;

    setSelectedRoadmapProgress(progressResponse?.progress || null);
    setGraph(graphData);

    if (graphData?.nodes?.length) {
      const targetNode = graphData.nodes.find((node) => node.type === "target") || graphData.nodes[0];
      setSelectedGraphNode(targetNode || null);
    } else {
      setSelectedGraphNode(null);
    }
  }

  async function loadSkillsPageData() {
    try {
      setLoading(true);
      setErrorMessage("");

      const [dashboardResponse, goalsResponse, activeGoalResponse, roadmapsResponse] = await Promise.all([
        getMySkillsDashboard(),
        getMySkillGoals(),
        getMySkillGoal(),
        getMySkillRoadmaps("", { scope: "all" }),
      ]);

      const goalsData = goalsResponse?.goals || [];
      const activeGoalData = activeGoalResponse?.goal || null;
      const allRoadmaps = roadmapsResponse?.roadmaps || [];

      setDashboard(dashboardResponse?.dashboard || null);
      setGoals(goalsData);
      setGoal(activeGoalData || null);
      setGoalForm(fillGoalFormFromGoal(activeGoalData || null, DEFAULT_GOAL_FORM));
      setRoadmaps(allRoadmaps);

      if (allRoadmaps.length) {
        await loadRoadmapContext(allRoadmaps[0]);
      } else {
        setSelectedRoadmapId("");
        setSelectedRoadmapProgress(null);
        setGraph(null);
        setSelectedGraphNode(null);
      }
    } catch (error) {
      console.error("loadSkillsPageData error:", error);
      setErrorMessage(error.message || "Failed to load skills page");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSkillsPageData();
  }, []);

  useEffect(() => {
    if (!statusMessage) return undefined;

    const timer = setTimeout(() => {
      setStatusMessage("");
    }, 10000);

    return () => clearTimeout(timer);
  }, [statusMessage]);

  async function reloadRoadmapsAndKeepSelection(preferredRoadmapId = selectedRoadmapId) {
    const roadmapsResponse = await getMySkillRoadmaps("", { scope: "all" });
    const allRoadmaps = roadmapsResponse?.roadmaps || [];
    setRoadmaps(allRoadmaps);

    const roadmapToSelect =
      allRoadmaps.find((roadmap) => String(roadmap._id) === String(preferredRoadmapId)) ||
      allRoadmaps[0] ||
      null;

    if (roadmapToSelect) {
      await loadRoadmapContext(roadmapToSelect);
    } else {
      await loadRoadmapContext(null);
    }
  }

  async function handleSaveGoal(event) {
    event.preventDefault();

    try {
      setSavingGoal(true);
      setStatusMessage("");
      setErrorMessage("");

      const payload = {
        goalId: goal?._id || undefined,
        targetTitle: goalForm.targetTitle.trim(),
        targetRole: goalForm.targetRole.trim(),
        targetCompany: goalForm.targetCompany.trim(),
        experienceLevel: goalForm.experienceLevel || "other",
        focusSkills: getFocusSkillsArray(goalForm.focusSkillsText),
        timeline: goalForm.timeline,
        weeklyAvailability: goalForm.weeklyAvailability,
        preferredResourceType: goalForm.preferredResourceType,
        budgetPreference: goalForm.budgetPreference,
        preferredDifficulty: goalForm.preferredDifficulty,
        setAsActive: true,
      };

      const response = await saveMySkillGoal(payload);
      const savedGoal = response?.goal || null;

      setGoal(savedGoal);
      setGoalForm(fillGoalFormFromGoal(savedGoal, DEFAULT_GOAL_FORM));

      const goalsResponse = await getMySkillGoals();
      setGoals(goalsResponse?.goals || []);

      await loadDashboardOnly();
      setStatusMessage(goal?._id ? "Target updated successfully." : "Target saved successfully.");
    } catch (error) {
      setErrorMessage(error.message || "Failed to save target");
    } finally {
      setSavingGoal(false);
    }
  }

  async function handleGenerateInsights(goalId = goal?._id) {
    if (!goalId) {
      setErrorMessage("Please save a target first.");
      return;
    }

    try {
      setGenerating(true);
      setStatusMessage("");
      setErrorMessage("");

      const response = await generateMySkillInsights(goalId);
      const generatedRoadmap = response?.roadmaps?.[0] || null;

      await loadDashboardOnly();
      await reloadRoadmapsAndKeepSelection(generatedRoadmap?._id || selectedRoadmapId);

      setActiveTab("roadmap");
      setShowGoalModal(false);
      setStatusMessage("Journey and roadmap generated successfully.");
    } catch (error) {
      setErrorMessage(error.message || "Failed to generate insights");
    } finally {
      setGenerating(false);
    }
  }

  function handleCreateNewTarget() {
    setGoal(null);
    setGoalForm(DEFAULT_GOAL_FORM);
    setShowGoalModal(true);
    setStatusMessage("");
    setErrorMessage("");
  }

  function handleEditGoal(selectedGoal) {
    setGoal(selectedGoal);
    setGoalForm(fillGoalFormFromGoal(selectedGoal, DEFAULT_GOAL_FORM));
    setShowGoalModal(true);
    setStatusMessage("");
    setErrorMessage("");
  }

  async function handleViewGoalRoadmaps(selectedGoal) {
    const firstRoadmap = roadmaps.find(
      (roadmap) => getGoalIdFromRoadmap(roadmap) === String(selectedGoal._id)
    );

    if (firstRoadmap) {
      await loadRoadmapContext(firstRoadmap);
      setActiveTab("roadmap");
      return;
    }

    setGoal(selectedGoal);
    setGoalForm(fillGoalFormFromGoal(selectedGoal, DEFAULT_GOAL_FORM));
    await handleGenerateInsights(selectedGoal._id);
  }

  async function handleSelectRoadmap(roadmap) {
    try {
      setStatusMessage("");
      setErrorMessage("");
      await loadRoadmapContext(roadmap);
    } catch (error) {
      setErrorMessage(error.message || "Failed to load roadmap details");
    }
  }

  async function handleInitializeProgress(roadmapId) {
    try {
      setRoadmapActionLoading(`init-${roadmapId}`);
      await initMySkillRoadmapProgress(roadmapId);
      await loadRoadmapContext(selectedRoadmap);
      await loadDashboardOnly();
      await reloadRoadmapsAndKeepSelection(roadmapId);
      setStatusMessage("Roadmap progress initialized successfully.");
    } catch (error) {
      setErrorMessage(error.message || "Failed to initialize roadmap progress");
    } finally {
      setRoadmapActionLoading("");
    }
  }

  function handleCompleteLesson(roadmapId, lesson) {
    setPendingLesson({ ...lesson, roadmapId });
  }

  async function handleLessonConfirm({ lessonId, minutes, understanding, note }) {
    if (!pendingLesson?.roadmapId) return;

    const roadmapId = pendingLesson.roadmapId;

    try {
      setRoadmapActionLoading(`lesson-${lessonId}`);
      setStatusMessage("");
      setErrorMessage("");

      await completeMySkillLesson(roadmapId, lessonId, { minutes, understanding, note });

      await loadRoadmapContext(selectedRoadmap);
      await loadDashboardOnly();
      await reloadRoadmapsAndKeepSelection(roadmapId);

      setStatusMessage("Learning log saved successfully.");
    } catch (error) {
      setErrorMessage(error.message || "Failed to save learning log");
    } finally {
      setRoadmapActionLoading("");
      setPendingLesson(null);
    }
  }

  async function handleAddQuickTimeLog(roadmapId) {
    try {
      setRoadmapActionLoading(`timelog-${roadmapId}`);

      await addMySkillTimeLog(roadmapId, {
        minutes: 60,
        note: "Quick 1 hour study log",
        source: "manual",
      });

      await loadRoadmapContext(selectedRoadmap);
      await loadDashboardOnly();
      await reloadRoadmapsAndKeepSelection(roadmapId);

      setStatusMessage("1 hour time log added successfully.");
    } catch (error) {
      setErrorMessage(error.message || "Failed to add time log");
    } finally {
      setRoadmapActionLoading("");
    }
  }

  function toggleExpandedRoadmap(roadmapId) {
    const id = String(roadmapId);

    setExpandedRoadmapIds((previous) =>
      previous.includes(id) ? previous.filter((item) => item !== id) : [...previous, id]
    );
  }

  function toggleExpandedMilestone(milestoneId) {
    const id = String(milestoneId);

    setExpandedMilestoneIds((previous) =>
      previous.includes(id) ? previous.filter((item) => item !== id) : [...previous, id]
    );
  }

  const activityItems = [
    ...(selectedRoadmapProgress?.achievements || []).map((item) => ({
      type: "achievement",
      date: item.awardedAt || new Date().toISOString(),
      title: item.title,
      subtitle: item.linkedSkill || "Achievement unlocked",
      impact: item.impactScore || 0,
    })),
    ...(selectedRoadmapProgress?.timeLogs || []).map((item, index) => ({
      type: "timelog",
      date: item.date || new Date().toISOString(),
      title: `${item.minutes || 0} minutes logged`,
      subtitle: item.note || item.source || `Study session ${index + 1}`,
      impact: item.minutes || 0,
    })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <DashboardLayout user={user}>
      <LessonCompleteModal
        lesson={pendingLesson}
        onConfirm={handleLessonConfirm}
        onClose={() => setPendingLesson(null)}
      />

      <GoalModal
        open={showGoalModal}
        onClose={() => setShowGoalModal(false)}
        goal={goal}
        goalForm={goalForm}
        setGoalForm={setGoalForm}
        onSubmit={handleSaveGoal}
        savingGoal={savingGoal}
        generating={generating}
        onGenerate={() => handleGenerateInsights(goal?._id)}
      />

      <div className="flex h-full w-full flex-col">
        <div className="flex items-center justify-between gap-4 px-4 py-2">
          <div className="flex gap-4 overflow-x-auto">
            {TABS.map((tab) => {
              const label =
                tab === "overview" ? "Overview" : tab === "journey" ? "Journey" : tab === "roadmap" ? "Roadmap" : "Activity";

              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`whitespace-nowrap px-2 py-1 text-sm font-bold transition-colors duration-200 ${
                    activeTab === tab
                      ? "border-b-2 border-primary text-primary"
                      : "text-gray-500 hover:text-primary dark:text-gray-400"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleCreateNewTarget}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          >
            <Target size={16} />
            Set your goal
          </button>
        </div>

        <main className="flex-1 overflow-auto bg-slate-50 px-4 py-5">
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
            </div>
          ) : (
            <div className={activeTab === "roadmap" ? "w-full space-y-8" : "mx-auto max-w-7xl space-y-8"}>
              {statusMessage ? (
                <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 shadow-sm">
                  <style>{`@keyframes skillStatusCountdown { from { width: 100%; } to { width: 0%; } }`}</style>

                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <CheckCircle2 size={16} />
                    </div>
                    <p>{statusMessage}</p>
                  </div>

                  <div className="absolute bottom-0 left-0 h-1 bg-primary" style={{ animation: "skillStatusCountdown 10s linear forwards" }} />
                </div>
              ) : null}

              {errorMessage ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {errorMessage}
                </div>
              ) : null}

              {activeTab === "overview" ? (
                <OverviewTab
                  goals={goals}
                  roadmaps={roadmaps}
                  metrics={metrics}
                  recentAchievements={recentAchievements}
                  onCreateTarget={handleCreateNewTarget}
                  onViewRoadmaps={handleViewGoalRoadmaps}
                  onEditGoal={handleEditGoal}
                />
              ) : null}

              {activeTab === "journey" ? (
                <JourneyTab
                  roadmaps={roadmaps}
                  selectedRoadmapId={selectedRoadmapId}
                  selectedRoadmapProgress={selectedRoadmapProgress}
                  selectedRoadmap={selectedRoadmap}
                  graph={graph}
                  graphGroups={graphGroups}
                  selectedGraphNode={selectedGraphNode}
                  onSelectRoadmap={handleSelectRoadmap}
                  onCreateTarget={handleCreateNewTarget}
                  onSelectGraphNode={setSelectedGraphNode}
                />
              ) : null}

              {activeTab === "roadmap" ? (
                <RoadmapTab
                  roadmaps={roadmaps}
                  selectedRoadmapId={selectedRoadmapId}
                  selectedRoadmapProgress={selectedRoadmapProgress}
                  selectedRoadmap={selectedRoadmap}
                  metrics={metrics}
                  completedLessonIds={completedLessonIds}
                  expandedRoadmapIds={expandedRoadmapIds}
                  expandedMilestoneIds={expandedMilestoneIds}
                  roadmapActionLoading={roadmapActionLoading}
                  onCreateTarget={handleCreateNewTarget}
                  onSelectRoadmap={handleSelectRoadmap}
                  onToggleRoadmap={toggleExpandedRoadmap}
                  onToggleMilestone={toggleExpandedMilestone}
                  onStartRoadmap={handleInitializeProgress}
                  onAddQuickLog={handleAddQuickTimeLog}
                  onCompleteLesson={handleCompleteLesson}
                />
              ) : null}

              {activeTab === "activity" ? (
                <ActivityTab
                  metrics={metrics}
                  recentAchievements={recentAchievements}
                  selectedRoadmapProgress={selectedRoadmapProgress}
                  activityItems={activityItems}
                />
              ) : null}
            </div>
          )}
        </main>
      </div>
    </DashboardLayout>
  );
}
