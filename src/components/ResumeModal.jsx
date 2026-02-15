// components/ResumeModal.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../config";
import { useAuth } from "../context/AuthContext";

export default function ResumeModal({ userId, isOpen, onClose, onSaveSuccess }) {
    const { token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [draft, setDraft] = useState(null);

    // ─── Scanner messages ───
    const scanMessages = [
        "Initializing resume generation...",
        "Analyzing your professional profile...",
        "Extracting skills & experience...",
        "Optimizing for ATS compatibility...",
        "Crafting powerful achievement bullets...",
        "Structuring modern resume layout...",
        "Applying typography & spacing rules...",
        "Generating final PDF document...",
        "Almost there — final validation...",
    ];

    const [messageIndex, setMessageIndex] = useState(0);


    // Cycle through messages while saving
    useEffect(() => {
        if (!saving) return;

        const interval = setInterval(() => {
            setMessageIndex((prev) => (prev + 1) % scanMessages.length);
        }, 1800); // realistic speed

        return () => clearInterval(interval);
    }, [saving]);

    useEffect(() => {
        if (!isOpen || !userId || draft) return;

        const fetchProfile = async () => {
            setLoading(true);
            setError("");
            try {
                const res = await axios.get(`${BACKEND_URL}/api/resume/profile/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const data = res.data;

                setDraft({
                    name: data?.name || "",
                    email: data?.email || "",
                    phone: data?.phone || "",
                    primaryRole: data?.primaryRole || "",
                    experienceLevel: data?.experienceLevel || "",
                    topSkills: data?.topSkills?.join(", ") || "",
                    bio: data?.bio || "",
                    interests: data?.interests?.join(", ") || "",
                    education: data?.education?.map(e => ({ ...e, include: true })) || [],
                    experience: data?.experience?.map(e => ({ ...e, include: true })) || [],
                    projects: data?.projects?.map(p => ({ ...p, include: true })) || [],
                    githubRepos: data?.githubRepos?.map(r => ({
                        ...r,
                        include: false,
                        tech_stack: r.language ? [r.language] : [],           // used for override
                        start_date: r.created_at ? r.created_at.slice(0, 7) : "",
                        end_date: r.updated_at ? r.updated_at.slice(0, 7) : "",
                    })) || [],
                });
            } catch (err) {
                console.error(err);
                setError(
                    err.response?.status === 401
                        ? "Session expired. Please log in again."
                        : "Failed to load your profile data."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [isOpen, userId, token, draft]);

    if (!isOpen) return null;

    const handleSave = async () => {
        if (saving) return;
        setSaving(true);
        setError("");
        setMessageIndex(0);

        const draftProfile = {
            name: draft.name.trim(),
            email: draft.email.trim(),
            phone: draft.phone.trim(),
            primaryRole: draft.primaryRole.trim(),
            experienceLevel: draft.experienceLevel.trim(),
            topSkills: draft.topSkills.split(",").map(s => s.trim()).filter(Boolean),
            bio: draft.bio.trim(),
            interests: draft.interests.split(",").map(s => s.trim()).filter(Boolean),

            education: draft.education
                .filter(e => e.include)
                .map(e => ({
                    degree: e.degreeTitle || e.level || "",
                    field: e.fieldOfStudy || "",
                    institution: e.institution || "",
                    marksPercent: e.marksPercent || null,
                    start_year: e.startYear || "",
                    end_year: e.endYear || "",
                })),
            experience: draft.experience
                .filter(e => e.include)
                .map(e => ({
                    position: e.position || "",
                    company: e.company || "",
                    jobType: e.jobType || "",
                    start_date: e.startDate || "",
                    end_date: e.endDate || "",
                    description: e.description || "",
                })),  // this one is already ok

            projects: [
                ...draft.projects
                    .filter(p => p.include)
                    .map(p => ({
                        name: p.title || "",
                        description: p.description || "",
                        tech_stack: p.techStack || [],
                        github_url: p.githubUrl || "",
                        live_url: p.liveUrl || "",
                        start_date: p.startDate ? new Date(p.startDate).toISOString().slice(0, 7) : "",
                        end_date: p.endDate ? new Date(p.endDate).toISOString().slice(0, 7) : "",
                    })),

                ...draft.githubRepos
                    .filter(r => r.include)
                    .map(r => ({
                        name: r.name || "Untitled Project",
                        description: r.description || "",
                        tech_stack: r.tech_stack || [],
                        github_url: r.html_url || "",
                        live_url: "",
                        start_date: r.start_date || "",
                        end_date: r.end_date || "",
                    })),
            ],
        };

        try {
            const res = await axios.post(
                `${BACKEND_URL}/api/resume/generate`,
                { userId, draftProfile },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            onSaveSuccess?.(res.data);
            onClose();
        } catch (err) {
            console.error(err);
            setError("Failed to generate resume. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const updateField = (field, value) => {
        setDraft(prev => ({ ...prev, [field]: value }));
    };

    const updateArrayItem = (key, idx, field, value) => {
        setDraft(prev => ({
            ...prev,
            [key]: prev[key].map((item, i) =>
                i === idx ? { ...item, [field]: value } : item
            ),
        }));
    };

    const toggleInclude = (key, idx) => {
        setDraft(prev => ({
            ...prev,
            [key]: prev[key].map((item, i) =>
                i === idx ? { ...item, include: !item.include } : item
            ),
        }));
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-start justify-center overflow-y-auto pt-8 pb-16">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 transform transition-all duration-300">
                {/* Header */}
                <div className="px-6 py-5 border-b flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">Customize Your Resume</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-800 text-xl"
                    >
                        ✕
                    </button>
                </div>

                {loading ? (
                    <div className="p-12 text-center text-gray-500">Loading your profile...</div>
                ) : error ? (
                    <div className="p-8 text-center text-red-600">{error}</div>
                ) : saving ? (
                    // ─── SCANNER ANIMATION ───
                    <div className="p-0">
                        <div className="relative h-[420px] bg-gray-50 overflow-hidden rounded-b-2xl">
                            {/* Paper texture background */}
                            <div
                                className="absolute inset-0 pointer-events-none opacity-40"
                                style={{
                                    backgroundImage: `
                                        linear-gradient(rgba(0,0,0,0.07) 1px, transparent 1px),
                                        linear-gradient(90deg, rgba(0,0,0,0.07) 1px, transparent 1px)
                                    `,
                                    backgroundSize: "20px 30px",
                                }}
                            />

                            {/* Moving scanner beam */}
                            <div className="absolute inset-x-12 top-0 bottom-0 flex items-center justify-center pointer-events-none">
                                <div className="w-full max-w-3xl h-2 bg-gradient-to-r from-transparent via-blue-500/70 to-transparent rounded-full shadow-2xl shadow-blue-400/40 animate-scan-beam" />
                            </div>

                            {/* Centered message */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-8 text-center">
                                <div className="w-16 h-16 mb-6 rounded-full bg-blue-100 flex items-center justify-center">
                                    <svg className="w-8 h-8 text-blue-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>

                                <p className="text-xl font-medium text-gray-800 mb-4 transition-opacity duration-500">
                                    {scanMessages[messageIndex]}
                                </p>

                                <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-600 rounded-full transition-all duration-1800 ease-linear"
                                        style={{ width: `${((messageIndex + 1) / scanMessages.length) * 100}%` }}
                                    />
                                </div>

                                <p className="mt-6 text-sm text-gray-500">
                                    This usually takes 8–15 seconds...
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    draft && (
                        <div className="p-6 space-y-10 max-h-[75vh] overflow-y-auto">

                            {/* BASIC INFO */}
                            <section>
                                <h3 className="text-lg font-semibold mb-4 text-gray-800">Basic Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {[
                                        { key: "name", label: "Full Name", placeholder: "John Doe" },
                                        { key: "email", label: "Email", placeholder: "john@example.com" },
                                        { key: "phone", label: "Phone", placeholder: "+92 300 1234567" },
                                        { key: "primaryRole", label: "Target Role", placeholder: "Frontend Developer" },
                                        { key: "experienceLevel", label: "Experience Level", placeholder: "Mid-Level / Senior" },
                                        { key: "topSkills", label: "Top Skills", placeholder: "React, TypeScript, Tailwind, Node.js" },
                                    ].map(({ key, label, placeholder }) => (
                                        <div key={key} className="space-y-1">
                                            <label className="block text-sm font-medium text-gray-700">{label}</label>
                                            <input
                                                type="text"
                                                value={draft[key] || ""}
                                                onChange={e => updateField(key, e.target.value)}
                                                placeholder={placeholder}
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                            />
                                        </div>
                                    ))}

                                    <div className="md:col-span-2 space-y-1">
                                        <label className="block text-sm font-medium text-gray-700">Professional Bio</label>
                                        <textarea
                                            value={draft.bio || ""}
                                            onChange={e => updateField("bio", e.target.value)}
                                            placeholder="Short summary about yourself, experience & goals..."
                                            rows={3}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                        />
                                    </div>

                                    <div className="md:col-span-2 space-y-1">
                                        <label className="block text-sm font-medium text-gray-700">Interests / Passions</label>
                                        <input
                                            type="text"
                                            value={draft.interests || ""}
                                            onChange={e => updateField("interests", e.target.value)}
                                            placeholder="AI, Open Source, UI/UX, Mentoring, Photography..."
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* EDUCATION */}
                            <section>
                                <h3 className="text-lg font-semibold mb-4 text-gray-800">Education</h3>
                                <div className="space-y-4">
                                    {draft.education.map((edu, idx) => (
                                        <div key={idx} className="p-5 border rounded-xl bg-gray-50/40 hover:bg-gray-50 transition">
                                            <div className="flex items-center gap-3 mb-4">
                                                <input
                                                    type="checkbox"
                                                    checked={edu.include}
                                                    onChange={() => toggleInclude("education", idx)}
                                                    className="h-5 w-5 text-blue-600 rounded border-gray-300"
                                                />
                                                <span className="font-medium text-gray-800">Include in resume</span>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm text-gray-600 mb-1">Degree / Program</label>
                                                    <input
                                                        value={edu.degreeTitle || ""}
                                                        onChange={e => updateArrayItem("education", idx, "degreeTitle", e.target.value)}
                                                        placeholder="BS Computer Science"
                                                        className="w-full px-4 py-2 border rounded-lg"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm text-gray-600 mb-1">Field of Study</label>
                                                    <input
                                                        value={edu.fieldOfStudy || ""}
                                                        onChange={e => updateArrayItem("education", idx, "fieldOfStudy", e.target.value)}
                                                        placeholder="Computer Science"
                                                        className="w-full px-4 py-2 border rounded-lg"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm text-gray-600 mb-1">Institution</label>
                                                    <input
                                                        value={edu.institution || ""}
                                                        onChange={e => updateArrayItem("education", idx, "institution", e.target.value)}
                                                        placeholder="National University of Sciences and Technology"
                                                        className="w-full px-4 py-2 border rounded-lg"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm text-gray-600 mb-1">Marks / CGPA (%)</label>
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        value={edu.marksPercent || ""}
                                                        onChange={e => updateArrayItem("education", idx, "marksPercent", Number(e.target.value) || null)}
                                                        placeholder="3.8 / 4.0 or 85.5%"
                                                        className="w-full px-4 py-2 border rounded-lg"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 mt-4">
                                                <div>
                                                    <label className="block text-sm text-gray-600 mb-1">Start Year</label>
                                                    <input
                                                        type="number"
                                                        min="1900"
                                                        max="2100"
                                                        value={edu.startYear || ""}
                                                        onChange={e => updateArrayItem("education", idx, "startYear", e.target.value ? Number(e.target.value) : "")}
                                                        placeholder="2018"
                                                        className="w-full px-4 py-2 border rounded-lg"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm text-gray-600 mb-1">End Year</label>
                                                    <input
                                                        type="number"
                                                        min="1900"
                                                        max="2100"
                                                        value={edu.endYear || ""}
                                                        onChange={e => updateArrayItem("education", idx, "endYear", e.target.value ? Number(e.target.value) : "")}
                                                        placeholder="2022"
                                                        className="w-full px-4 py-2 border rounded-lg"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* EXPERIENCE */}
                            <section>
                                <h3 className="text-lg font-semibold mb-4 text-gray-800">Work Experience</h3>
                                <div className="space-y-5">
                                    {draft.experience.map((exp, idx) => (
                                        <div key={idx} className="p-5 border rounded-xl bg-gray-50/40 hover:bg-gray-50 transition">
                                            <div className="flex items-center gap-3 mb-4">
                                                <input
                                                    type="checkbox"
                                                    checked={exp.include}
                                                    onChange={() => toggleInclude("experience", idx)}
                                                    className="h-5 w-5 text-blue-600 rounded border-gray-300"
                                                />
                                                <span className="font-medium text-gray-800">Include in resume</span>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm text-gray-600 mb-1">Position</label>
                                                    <input
                                                        value={exp.position || ""}
                                                        onChange={e => updateArrayItem("experience", idx, "position", e.target.value)}
                                                        placeholder="Frontend Developer"
                                                        className="w-full px-4 py-2 border rounded-lg"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm text-gray-600 mb-1">Company</label>
                                                    <input
                                                        value={exp.company || ""}
                                                        onChange={e => updateArrayItem("experience", idx, "company", e.target.value)}
                                                        placeholder="TechCorp Pvt Ltd"
                                                        className="w-full px-4 py-2 border rounded-lg"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm text-gray-600 mb-1">Job Type</label>
                                                    <select
                                                        value={exp.jobType || ""}
                                                        onChange={e => updateArrayItem("experience", idx, "jobType", e.target.value)}
                                                        className="w-full px-4 py-2 border rounded-lg bg-white"
                                                    >
                                                        <option value="">Select type</option>
                                                        <option value="full-time">Full-time</option>
                                                        <option value="part-time">Part-time</option>
                                                        <option value="contract">Contract</option>
                                                        <option value="internship">Internship</option>
                                                        <option value="freelance">Freelance</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 mt-4">
                                                <div>
                                                    <label className="block text-sm text-gray-600 mb-1">Start Date</label>
                                                    <input
                                                        type="month"
                                                        value={exp.startDate ? new Date(exp.startDate).toISOString().slice(0, 7) : ""}
                                                        onChange={e => updateArrayItem("experience", idx, "startDate", e.target.value || null)}
                                                        className="w-full px-4 py-2 border rounded-lg"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm text-gray-600 mb-1">End Date (blank = present)</label>
                                                    <input
                                                        type="month"
                                                        value={exp.endDate ? new Date(exp.endDate).toISOString().slice(0, 7) : ""}
                                                        onChange={e => updateArrayItem("experience", idx, "endDate", e.target.value || null)}
                                                        className="w-full px-4 py-2 border rounded-lg"
                                                    />
                                                </div>
                                            </div>

                                            <div className="mt-4">
                                                <label className="block text-sm text-gray-600 mb-1">Description / Responsibilities</label>
                                                <textarea
                                                    value={exp.description || ""}
                                                    onChange={e => updateArrayItem("experience", idx, "description", e.target.value)}
                                                    placeholder="• Built responsive web apps using React & Tailwind\n• Led team of 3 developers..."
                                                    rows={4}
                                                    className="w-full px-4 py-2 border rounded-lg"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* CUSTOM PROJECTS */}
                            {draft.projects?.length > 0 && (
                                <section>
                                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Custom Projects</h3>
                                    <div className="space-y-5">
                                        {draft.projects.map((proj, idx) => (
                                            <div key={idx} className="p-5 border rounded-xl bg-gray-50/40">
                                                <div className="flex items-start gap-3 mb-4">
                                                    <input
                                                        type="checkbox"
                                                        checked={proj.include}
                                                        onChange={() => toggleInclude("projects", idx)}
                                                        className="h-5 w-5 text-blue-600 mt-1"
                                                    />
                                                    <div className="flex-1 space-y-4">
                                                        <input
                                                            value={proj.title || ""}
                                                            onChange={e => updateArrayItem("projects", idx, "title", e.target.value)}
                                                            placeholder="Project Title"
                                                            className="w-full px-4 py-2.5 border rounded-lg font-medium focus:ring-2 focus:ring-blue-500"
                                                        />

                                                        <input
                                                            value={proj.techStack?.join(", ") || ""}
                                                            onChange={e =>
                                                                updateArrayItem(
                                                                    "projects",
                                                                    idx,
                                                                    "techStack",
                                                                    e.target.value.split(",").map(s => s.trim()).filter(Boolean)
                                                                )
                                                            }
                                                            placeholder="Tech stack (React, Node.js, MongoDB, Tailwind...)"
                                                            className="w-full px-4 py-2 border rounded-lg"
                                                        />

                                                        <textarea
                                                            value={proj.description || ""}
                                                            onChange={e => updateArrayItem("projects", idx, "description", e.target.value)}
                                                            placeholder="What problem did it solve? Key features? Your role? Technologies used? Impact?"
                                                            rows={4}
                                                            className="w-full px-4 py-2 border rounded-lg"
                                                        />

                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div>
                                                                <label className="block text-sm text-gray-600 mb-1">Start Date</label>
                                                                <input
                                                                    type="month"
                                                                    value={proj.startDate ? new Date(proj.startDate).toISOString().slice(0, 7) : ""}
                                                                    onChange={e => updateArrayItem("projects", idx, "startDate", e.target.value || null)}
                                                                    className="w-full px-4 py-2 border rounded-lg"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm text-gray-600 mb-1">End Date</label>
                                                                <input
                                                                    type="month"
                                                                    value={proj.endDate ? new Date(proj.endDate).toISOString().slice(0, 7) : ""}
                                                                    onChange={e => updateArrayItem("projects", idx, "endDate", e.target.value || null)}
                                                                    className="w-full px-4 py-2 border rounded-lg"
                                                                />
                                                            </div>
                                                        </div>

                                                        <input
                                                            value={proj.liveUrl || ""}
                                                            onChange={e => updateArrayItem("projects", idx, "liveUrl", e.target.value)}
                                                            placeholder="Live demo URL[](https://...)"
                                                            className="w-full px-4 py-2 border rounded-lg"
                                                        />

                                                        <input
                                                            value={proj.githubUrl || ""}
                                                            onChange={e => updateArrayItem("projects", idx, "githubUrl", e.target.value)}
                                                            placeholder="GitHub repo URL[](https://github.com/...)"
                                                            className="w-full px-4 py-2 border rounded-lg"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* GITHUB REPOS */}
                            {draft.githubRepos?.length > 0 && (
                                <section>
                                    <h3 className="text-lg font-semibold mb-4 text-gray-800">GitHub Projects to Include</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {draft.githubRepos.map((repo, idx) => (
                                            <div
                                                key={idx}
                                                className={`p-4 border rounded-xl transition ${repo.include ? "bg-blue-50 border-blue-300" : "hover:bg-gray-50"
                                                    }`}
                                            >
                                                <label className="flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={repo.include}
                                                        onChange={() => toggleInclude("githubRepos", idx)}
                                                        className="h-5 w-5 text-blue-600 rounded border-gray-300 mr-3 flex-shrink-0"
                                                    />
                                                    <div className="min-w-0 flex-1">
                                                        <div className="font-medium truncate">{repo.name}</div>
                                                        <div className="text-sm text-gray-500 mt-0.5">
                                                            {repo.language || "—"} • {repo.stargazers_count || 0} ★ • {repo.forks_count || 0} forks
                                                        </div>
                                                    </div>
                                                </label>

                                                {repo.include && (
                                                    <div className="mt-4 pl-8 space-y-3 text-sm">
                                                        <div>
                                                            <label className="block text-gray-600 mb-1">Tech Stack (override)</label>
                                                            <input
                                                                type="text"
                                                                value={repo.tech_stack?.join(", ") || ""}
                                                                onChange={e =>
                                                                    updateArrayItem(
                                                                        "githubRepos",
                                                                        idx,
                                                                        "tech_stack",
                                                                        e.target.value.split(",").map(s => s.trim()).filter(Boolean)
                                                                    )
                                                                }
                                                                placeholder="React, Next.js, Tailwind, Vercel"
                                                                className="w-full px-3 py-2 border rounded-lg bg-white"
                                                            />
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-3">
                                                            <div>
                                                                <label className="block text-gray-600 mb-1">Approx. Start</label>
                                                                <div className="px-3 py-2 bg-gray-100 rounded-lg text-gray-700">
                                                                    {repo.start_date || "—"}
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <label className="block text-gray-600 mb-1">Approx. Last Update</label>
                                                                <div className="px-3 py-2 bg-gray-100 rounded-lg text-gray-700">
                                                                    {repo.end_date || "—"}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>
                    )
                )}

                {/* Footer */}
                <div className="px-6 py-5 border-t bg-gray-50 flex items-center justify-end gap-4 rounded-b-2xl">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-100 transition font-medium"
                        disabled={saving}
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSave}
                        disabled={saving || loading || !draft}
                        className={`
              px-8 py-2.5 rounded-lg font-medium text-white min-w-[180px] transition
              ${saving || loading || !draft
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700 shadow-sm"
                            }
            `}
                    >
                        {saving ? "Generating Resume..." : "Save & Generate Resume"}
                    </button>
                </div>
            </div>
            {/* Add this keyframes in your global CSS or inside <style> tag */}
            <style jsx global>{`
                @keyframes scan-beam {
                    0% {
                        transform: translateY(-120%);
                        opacity: 0.4;
                    }
                    15% {
                        opacity: 0.95;
                    }
                    50% {
                        transform: translateY(120%);
                        opacity: 0.95;
                    }
                    65% {
                        opacity: 0.95;
                    }
                    98% {
                        opacity: 0.4;
                    }
                    100% {
                        transform: translateY(-120%);
                        opacity: 0.4;
                    }
                }
                .animate-scan-beam {
                    animation: scan-beam 5.2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
            `}</style>
        </div>

    );
}