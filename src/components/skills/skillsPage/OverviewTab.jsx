import React from "react";
import { ArrowRight, CheckCircle2, Clock3, Compass, Plus, Sparkles, Trophy } from "lucide-react";
import { EmptyState, MetricCard, SectionCard } from "./SkillPageLayout";
import { getGoalIdFromRoadmap } from "./skillPageUtils";

function TargetCard({ goal, roadmaps, onViewRoadmaps, onEditGoal }) {
  const relatedRoadmaps = roadmaps.filter(
    (roadmap) => getGoalIdFromRoadmap(roadmap) === String(goal._id)
  );

  return (
    <div className="rounded-[28px] border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0">
          <h3 className="text-xl font-semibold text-slate-900">{goal.targetTitle}</h3>
          <p className="mt-2 text-sm text-slate-500">
            {goal.aiInterpretation?.inferredRole || goal.targetRole || "Custom target"}
            {goal.targetCompany ? ` • ${goal.targetCompany}` : ""}
          </p>

          {Array.isArray(goal.focusSkills) && goal.focusSkills.length ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {goal.focusSkills.slice(0, 8).map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-white px-3 py-1.5 text-xs text-slate-600 ring-1 ring-slate-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row xl:flex-col">
          <button
            type="button"
            onClick={() => onViewRoadmaps(goal)}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            {relatedRoadmaps.length ? "View roadmap" : "Generate roadmap"}
            <ArrowRight size={16} />
          </button>

          <button
            type="button"
            onClick={() => onEditGoal(goal)}
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Edit target
          </button>
        </div>
      </div>


    </div>
  );
}

export default function OverviewTab({
  goals,
  roadmaps,
  metrics,
  recentAchievements,
  onCreateTarget,
  onViewRoadmaps,
  onEditGoal,
}) {
  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-[32px] border border-primary/25 bg-gradient-to-br from-black via-slate-950 to-primary px-6 py-6 text-white shadow-none">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-primary/40 blur-3xl" />
        <div className="pointer-events-none absolute right-10 -bottom-28 h-72 w-72 rounded-full bg-primary/25 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_35%,rgba(255,255,255,0.16),transparent_32%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.96)_0%,rgba(0,0,0,0.80)_44%,rgba(0,0,0,0.18)_100%)]" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-white ring-1 ring-white/15 backdrop-blur">
              <Sparkles size={14} />
              Growth Hub
            </div>
            <h1 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
              Build your next role with more clarity
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/70 sm:text-base">
              View all targets, explore every generated roadmap, and log your learning progress.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <div className="rounded-2xl border border-white/12 bg-white/10 px-4 py-3 shadow-sm ring-1 ring-white/10 backdrop-blur">
                <p className="text-xs uppercase tracking-wide text-white/55">Total targets</p>
                <p className="mt-1 text-sm font-semibold text-white">{goals.length}</p>
              </div>

              <div className="rounded-2xl border border-white/12 bg-white/10 px-4 py-3 shadow-sm ring-1 ring-white/10 backdrop-blur">
                <p className="text-xs uppercase tracking-wide text-white/55">Total roadmaps</p>
                <p className="mt-1 text-sm font-semibold text-white">{roadmaps.length}</p>
              </div>

              <div className="rounded-2xl border border-white/12 bg-white/10 px-4 py-3 shadow-sm ring-1 ring-white/10 backdrop-blur">
                <p className="text-xs uppercase tracking-wide text-white/55">Overall completion</p>
                <p className="mt-1 text-sm font-semibold text-white">{metrics.pathCompletionPercent || 0}%</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onCreateTarget}
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-primary shadow-[0_12px_30px_rgba(0,0,0,0.24)] ring-1 ring-white/20 transition hover:bg-white/90"
            >
              <Plus size={16} />
              New target
            </button>
          </div>
        </div>
      </div>

      <SectionCard
        title="All Targets"
        subtitle="Every target is shown here. Roadmaps stay active until they are completed."
      >
        {!goals.length ? (
          <EmptyState
            title="Start by setting a target"
            subtitle="Once your target is saved, DevSta can generate its journey map and roadmap."
            actionLabel="Create target"
            onAction={onCreateTarget}
          />
        ) : (
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            {goals.map((item) => (
              <TargetCard
                key={item._id}
                goal={item}
                roadmaps={roadmaps}
                onViewRoadmaps={onViewRoadmaps}
                onEditGoal={onEditGoal}
              />
            ))}
          </div>
        )}
      </SectionCard>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Skill score" value={metrics.skillScore || 0} helper="Combined score from learning progress" icon={Sparkles} />
        <MetricCard label="Hours invested" value={metrics.hoursInvested30d || 0} helper="Hours invested in the last 30 days" icon={Clock3} />
        <MetricCard label="Skills closed" value={metrics.skillsClosedThisMonth || 0} helper="Skills completed this month" icon={CheckCircle2} />
        <MetricCard label="Path completion" value={`${metrics.pathCompletionPercent || 0}%`} helper="Average progress across active roadmaps" icon={Compass} />
      </div>

      <SectionCard title="Recent achievements" subtitle="The latest wins from all your learning roadmaps.">
        {!recentAchievements.length ? (
          <EmptyState
            title="No achievements yet"
            subtitle="Complete lessons and milestones to build your achievement history."
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {recentAchievements.map((item, index) => (
              <div key={`${item.title}-${index}`} className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="rounded-xl bg-amber-100 p-2 text-amber-700">
                    <Trophy size={18} />
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-500 ring-1 ring-slate-200">
                    {item.awardedAt ? new Date(item.awardedAt).toLocaleDateString() : "-"}
                  </span>
                </div>

                <h3 className="mt-4 text-base font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-1 text-sm text-slate-500">{item.linkedSkill || "Achievement"}</p>
                <p className="mt-3 text-xs text-slate-400">Impact score: {item.impactScore || 0}</p>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
