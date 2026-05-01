import React from "react";
import { BookOpen, Crown, Layers3, Plus, Target } from "lucide-react";
import { EmptyState, MetricCard, SectionCard } from "./SkillPageLayout";
import GraphCanvas from "./GraphCanvas";
import {
  getGoalRoleFromRoadmap,
  getGoalTitleFromRoadmap,
  getRoadmapCompletion,
  getRoadmapDotClass,
  getRoadmapStatus,
} from "./skillPageUtils";

function GraphLegend() {
  const items = [
    { label: "Owned", color: "bg-emerald-500" },
    { label: "Learning", color: "bg-amber-500" },
    { label: "Gap", color: "bg-rose-500" },
    { label: "Milestone", color: "bg-blue-500" },
    { label: "Target", color: "bg-indigo-500" },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <div
          key={item.label}
          className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200"
        >
          <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
          {item.label}
        </div>
      ))}
    </div>
  );
}

function RoadmapSelectionGrid({ roadmaps, selectedRoadmapId, progress, onSelect }) {
  if (!roadmaps.length) {
    return (
      <EmptyState
        title="No roadmaps yet"
        subtitle="Generate a target journey first. All generated roadmaps will appear here."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      {roadmaps.map((roadmap) => {
        const selected = String(roadmap._id) === String(selectedRoadmapId);
        const completion = getRoadmapCompletion(roadmap, selected ? progress : null);
        const status = getRoadmapStatus(roadmap, selected ? progress : null);

        return (
          <button
            key={roadmap._id}
            type="button"
            onClick={() => onSelect(roadmap)}
            className={`rounded-[24px] border p-5 text-left transition ${
              selected ? "border-primary bg-primary/5" : "border-slate-200 bg-white hover:bg-slate-50"
            }`}
          >
            <div className="flex items-start gap-3">
              <span
                className={`mt-1 h-3 w-3 shrink-0 rounded-full ring-4 ${getRoadmapDotClass(
                  roadmap,
                  selected ? progress : null,
                  selected
                )}`}
              />

              <div className="min-w-0 flex-1">
                <h3 className="line-clamp-2 text-base font-semibold text-slate-900">{roadmap.title}</h3>
                <p className="mt-1 text-sm text-slate-500">
                  {getGoalTitleFromRoadmap(roadmap)} • {getGoalRoleFromRoadmap(roadmap)}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold capitalize text-slate-500 ring-1 ring-slate-200">
                    {status === "completed" ? "Completed" : "Active"}
                  </span>
                  <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-500 ring-1 ring-slate-200">
                    {completion}% complete
                  </span>
                  <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-500 ring-1 ring-slate-200">
                    {roadmap.estimatedHours || 0} hrs
                  </span>
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default function JourneyTab({
  roadmaps,
  selectedRoadmapId,
  selectedRoadmapProgress,
  selectedRoadmap,
  graph,
  graphGroups,
  selectedGraphNode,
  onSelectRoadmap,
  onCreateTarget,
  onSelectGraphNode,
}) {
  return (
    <div className="space-y-6">
      <SectionCard
        title="Journey targets"
        subtitle="All generated roadmaps are shown here. Select any roadmap to view its journey map."
        rightNode={
          <button
            type="button"
            onClick={onCreateTarget}
            className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            <Plus size={16} />
            Create target
          </button>
        }
      >
        <RoadmapSelectionGrid
          roadmaps={roadmaps}
          selectedRoadmapId={selectedRoadmapId}
          progress={selectedRoadmapProgress}
          onSelect={onSelectRoadmap}
        />
      </SectionCard>

      <SectionCard
        title="Journey map"
        subtitle={selectedRoadmap ? `Visual map for ${selectedRoadmap.title}` : "Select a roadmap to explore its skill journey."}
        rightNode={<GraphLegend />}
      >
        {!selectedRoadmap ? (
          <EmptyState title="No roadmap selected" subtitle="Select a roadmap above to view its graph." />
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <MetricCard label="Total Nodes" value={graph?.summary?.totalNodes || 0} helper="Target, milestones, and skills" icon={Layers3} />
              <MetricCard label="Owned" value={graph?.summary?.ownedCount || 0} helper="Skills already available" icon={Crown} />
              <MetricCard label="Learning" value={graph?.summary?.learningCount || 0} helper="Skills currently in progress" icon={BookOpen} />
              <MetricCard label="Gap" value={graph?.summary?.gapCount || 0} helper="Skills still missing" icon={Target} />
            </div>

            <GraphCanvas
              graph={graph}
              selectedNodeId={selectedGraphNode?.nodeId || ""}
              onSelectNode={onSelectGraphNode}
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {[
                { label: "Owned skills", list: graphGroups.owned, bg: "bg-emerald-50", text: "text-emerald-800" },
                { label: "Learning skills", list: graphGroups.learning, bg: "bg-amber-50", text: "text-amber-800" },
                { label: "Missing skills", list: graphGroups.gap, bg: "bg-rose-50", text: "text-rose-800" },
              ].map((group) => (
                <div key={group.label} className={`rounded-[24px] ${group.bg} p-4`}>
                  <h3 className={`text-sm font-semibold ${group.text}`}>{group.label}</h3>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {group.list.length ? (
                      group.list.map((item) => (
                        <button
                          key={item.nodeId}
                          type="button"
                          onClick={() => onSelectGraphNode(item)}
                          className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50"
                        >
                          {item.label}
                        </button>
                      ))
                    ) : (
                      <p className="text-sm text-slate-500">Nothing here yet.</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </SectionCard>
    </div>
  );
}
