// src/components/ResumeEditModal.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../config";
import { useAuth } from "../context/AuthContext";

const emptyExperience = () => ({
  position: "",
  company: "",
  start_date: "",
  end_date: "",
  description: "",
});

const emptyEducation = () => ({
  degree: "",
  field: "",
  institution: "",
  start_year: "",
  end_year: "",
});

const emptyProject = () => ({
  name: "",
  description: "",
  tech_stack: [],
  github_url: "",
  live_url: "",
});

const emptyCustomSection = () => ({
  title: "Custom Section",
  items: [{ title: "", subtitle: "", date: "", description: "", url: "" }],
});

export default function ResumeEditModal({ isOpen, onClose, onSuccess }) {
  const { user, token } = useAuth();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [resumeJson, setResumeJson] = useState(null);

  const scanMessages = [
    "Saving your changes...",
    "Rebuilding PDF with latest data...",
    "Applying typography & spacing...",
    "Updating your resume...",
  ];
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (!saving) return;
    const interval = setInterval(() => {
      setMessageIndex((p) => (p + 1) % scanMessages.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [saving]);

  useEffect(() => {
    if (!isOpen || !user?._id || !token) return;

    const run = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(`${BACKEND_URL}/api/resume/json/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data?.resumeJson;
        setResumeJson({
          name: data?.name || "",
          email: data?.email || "",
          phone: data?.phone || "",
          github_url: data?.github_url || "",
          summary: data?.summary || "",
          skills: Array.isArray(data?.skills) ? data.skills : [],
          experience: Array.isArray(data?.experience) ? data.experience : [],
          education: Array.isArray(data?.education) ? data.education : [],
          projects: Array.isArray(data?.projects) ? data.projects : [],
          additional_sections: Array.isArray(data?.additional_sections) ? data.additional_sections : [],
        });
      } catch (e) {
        console.error(e);
        setError(e.response?.data?.error || "Failed to load resume. Generate it first.");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [isOpen, user?._id, token]);

  useEffect(() => {
    if (!isOpen) {
      setResumeJson(null);
      setError("");
      setLoading(false);
      setSaving(false);
      setMessageIndex(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const update = (key, value) => setResumeJson((p) => ({ ...p, [key]: value }));

  const updateArrItem = (key, idx, field, value) => {
    setResumeJson((p) => ({
      ...p,
      [key]: p[key].map((it, i) => (i === idx ? { ...it, [field]: value } : it)),
    }));
  };

  const addItem = (key, factory) => {
    setResumeJson((p) => ({
      ...p,
      [key]: [...(p[key] || []), factory()],
    }));
  };

  const removeItem = (key, idx) => {
    setResumeJson((p) => ({
      ...p,
      [key]: p[key].filter((_, i) => i !== idx),
    }));
  };

  const addCustomSection = () => {
    setResumeJson((p) => ({
      ...p,
      additional_sections: [...(p.additional_sections || []), emptyCustomSection()],
    }));
  };

  const addCustomSectionItem = (secIdx) => {
    setResumeJson((p) => ({
      ...p,
      additional_sections: p.additional_sections.map((sec, i) =>
        i === secIdx
          ? { ...sec, items: [...(sec.items || []), { title: "", subtitle: "", date: "", description: "", url: "" }] }
          : sec
      ),
    }));
  };

  const updateCustomSection = (secIdx, field, value) => {
    setResumeJson((p) => ({
      ...p,
      additional_sections: p.additional_sections.map((sec, i) =>
        i === secIdx ? { ...sec, [field]: value } : sec
      ),
    }));
  };

  const updateCustomSectionItem = (secIdx, itemIdx, field, value) => {
    setResumeJson((p) => ({
      ...p,
      additional_sections: p.additional_sections.map((sec, i) => {
        if (i !== secIdx) return sec;
        return {
          ...sec,
          items: (sec.items || []).map((it, j) => (j === itemIdx ? { ...it, [field]: value } : it)),
        };
      }),
    }));
  };

  const handleSave = async () => {
    if (!resumeJson || saving) return;

    setSaving(true);
    setError("");
    setMessageIndex(0);

    try {
      await axios.put(
        `${BACKEND_URL}/api/resume/json`,
        { resumeJson },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      onSuccess?.();
      onClose();
    } catch (e) {
      console.error(e);
      setError(e.response?.data?.error || "Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-start justify-center overflow-y-auto pt-8 pb-16">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl mx-4">
        <div className="px-6 py-5 border-b flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Edit Resume</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-xl">
            ✕
          </button>
        </div>

        {loading ? (
          <div className="p-10 text-center text-gray-500">Loading resume...</div>
        ) : saving ? (
          <div className="p-0">
            <div className="relative h-[380px] bg-gray-50 overflow-hidden rounded-b-2xl">
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-8 text-center">
                <p className="text-xl font-medium text-gray-800 mb-4">
                  {scanMessages[messageIndex]}
                </p>
                <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-1000 ease-linear"
                    style={{ width: `${((messageIndex + 1) / scanMessages.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-600">{error}</div>
        ) : (
          resumeJson && (
            <div className="p-6 space-y-10 max-h-[75vh] overflow-y-auto">
              {/* Basic */}
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-800">Basic Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {[
                    { key: "name", label: "Full Name", placeholder: "John Doe" },
                    { key: "email", label: "Email", placeholder: "john@example.com" },
                    { key: "phone", label: "Phone", placeholder: "+92 300 1234567" },
                    { key: "github_url", label: "GitHub URL", placeholder: "https://github.com/username" },
                  ].map(({ key, label, placeholder }) => (
                    <div key={key} className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">{label}</label>
                      <input
                        type="text"
                        value={resumeJson[key] || ""}
                        onChange={(e) => update(key, e.target.value)}
                        placeholder={placeholder}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  ))}

                  <div className="md:col-span-2 space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Professional Summary</label>
                    <textarea
                      value={resumeJson.summary || ""}
                      onChange={(e) => update("summary", e.target.value)}
                      placeholder="3–5 lines summary..."
                      rows={4}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
              </section>

              {/* Skills */}
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-800">Skills</h3>
                </div>
                <input
                  type="text"
                  value={(resumeJson.skills || []).join(", ")}
                  onChange={(e) =>
                    update(
                      "skills",
                      e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean)
                    )
                  }
                  placeholder="React, Node.js, MongoDB..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </section>

              {/* Experience */}
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-800">Experience</h3>
                  <button
                    type="button"
                    onClick={() => addItem("experience", emptyExperience)}
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                  >
                    + Add Experience
                  </button>
                </div>

                <div className="space-y-4">
                  {(resumeJson.experience || []).map((exp, idx) => (
                    <div key={idx} className="p-5 border rounded-xl bg-gray-50/40">
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => removeItem("experience", idx)}
                          className="text-sm text-red-600 hover:underline"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Position</label>
                          <input
                            value={exp.position || ""}
                            onChange={(e) => updateArrItem("experience", idx, "position", e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Company</label>
                          <input
                            value={exp.company || ""}
                            onChange={(e) => updateArrItem("experience", idx, "company", e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg"
                          />
                        </div>

                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Start (YYYY-MM)</label>
                          <input
                            type="month"
                            value={exp.start_date || ""}
                            onChange={(e) => updateArrItem("experience", idx, "start_date", e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">End (blank = present)</label>
                          <input
                            type="month"
                            value={exp.end_date || ""}
                            onChange={(e) => updateArrItem("experience", idx, "end_date", e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg"
                          />
                        </div>
                      </div>

                      <div className="mt-4">
                        <label className="block text-sm text-gray-600 mb-1">Description</label>
                        <textarea
                          rows={4}
                          value={exp.description || ""}
                          onChange={(e) => updateArrItem("experience", idx, "description", e.target.value)}
                          className="w-full px-4 py-2 border rounded-lg"
                          placeholder="• Achievement 1
• Achievement 2"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Projects */}
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-800">Projects</h3>
                  <button
                    type="button"
                    onClick={() => addItem("projects", emptyProject)}
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                  >
                    + Add Project
                  </button>
                </div>

                <div className="space-y-4">
                  {(resumeJson.projects || []).map((proj, idx) => (
                    <div key={idx} className="p-5 border rounded-xl bg-gray-50/40">
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => removeItem("projects", idx)}
                          className="text-sm text-red-600 hover:underline"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <div className="md:col-span-2">
                          <label className="block text-sm text-gray-600 mb-1">Project Name</label>
                          <input
                            value={proj.name || ""}
                            onChange={(e) => updateArrItem("projects", idx, "name", e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg"
                          />
                        </div>

                        <div>
                          <label className="block text-sm text-gray-600 mb-1">GitHub URL</label>
                          <input
                            value={proj.github_url || ""}
                            onChange={(e) => updateArrItem("projects", idx, "github_url", e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg"
                          />
                        </div>

                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Live URL</label>
                          <input
                            value={proj.live_url || ""}
                            onChange={(e) => updateArrItem("projects", idx, "live_url", e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm text-gray-600 mb-1">Tech Stack</label>
                          <input
                            value={(proj.tech_stack || []).join(", ")}
                            onChange={(e) =>
                              updateArrItem(
                                "projects",
                                idx,
                                "tech_stack",
                                e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                              )
                            }
                            className="w-full px-4 py-2 border rounded-lg"
                            placeholder="React, Node.js, MongoDB..."
                          />
                        </div>
                      </div>

                      <div className="mt-4">
                        <label className="block text-sm text-gray-600 mb-1">Description</label>
                        <textarea
                          rows={4}
                          value={proj.description || ""}
                          onChange={(e) => updateArrItem("projects", idx, "description", e.target.value)}
                          className="w-full px-4 py-2 border rounded-lg"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Education */}
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-800">Education</h3>
                  <button
                    type="button"
                    onClick={() => addItem("education", emptyEducation)}
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                  >
                    + Add Education
                  </button>
                </div>

                <div className="space-y-4">
                  {(resumeJson.education || []).map((edu, idx) => (
                    <div key={idx} className="p-5 border rounded-xl bg-gray-50/40">
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => removeItem("education", idx)}
                          className="text-sm text-red-600 hover:underline"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Degree</label>
                          <input
                            value={edu.degree || ""}
                            onChange={(e) => updateArrItem("education", idx, "degree", e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Field</label>
                          <input
                            value={edu.field || ""}
                            onChange={(e) => updateArrItem("education", idx, "field", e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm text-gray-600 mb-1">Institution</label>
                          <input
                            value={edu.institution || ""}
                            onChange={(e) => updateArrItem("education", idx, "institution", e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Start Year</label>
                          <input
                            value={edu.start_year || ""}
                            onChange={(e) => updateArrItem("education", idx, "start_year", e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">End Year</label>
                          <input
                            value={edu.end_year || ""}
                            onChange={(e) => updateArrItem("education", idx, "end_year", e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Custom Sections */}
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-800">Custom Sections</h3>
                  <button
                    type="button"
                    onClick={addCustomSection}
                    className="px-4 py-2 rounded-lg bg-black text-white hover:bg-black/90"
                  >
                    + Add Section
                  </button>
                </div>

                <div className="space-y-4">
                  {(resumeJson.additional_sections || []).map((sec, secIdx) => (
                    <div key={secIdx} className="p-5 border rounded-xl bg-gray-50/40">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-sm text-gray-600 mb-1">Section Title</label>
                          <input
                            value={sec.title || ""}
                            onChange={(e) => updateCustomSection(secIdx, "title", e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg"
                          />
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-4">
                        <div className="text-sm font-medium text-gray-700">Items</div>
                        <button
                          type="button"
                          onClick={() => addCustomSectionItem(secIdx)}
                          className="px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm"
                        >
                          + Add Item
                        </button>
                      </div>

                      <div className="mt-3 space-y-3">
                        {(sec.items || []).map((it, itemIdx) => (
                          <div key={itemIdx} className="p-4 bg-white border rounded-xl">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <input
                                value={it.title || ""}
                                onChange={(e) => updateCustomSectionItem(secIdx, itemIdx, "title", e.target.value)}
                                placeholder="Title"
                                className="w-full px-3 py-2 border rounded-lg"
                              />
                              <input
                                value={it.subtitle || ""}
                                onChange={(e) =>
                                  updateCustomSectionItem(secIdx, itemIdx, "subtitle", e.target.value)
                                }
                                placeholder="Subtitle"
                                className="w-full px-3 py-2 border rounded-lg"
                              />
                              <input
                                value={it.date || ""}
                                onChange={(e) => updateCustomSectionItem(secIdx, itemIdx, "date", e.target.value)}
                                placeholder="Date (e.g. 2025)"
                                className="w-full px-3 py-2 border rounded-lg"
                              />
                              <input
                                value={it.url || ""}
                                onChange={(e) => updateCustomSectionItem(secIdx, itemIdx, "url", e.target.value)}
                                placeholder="URL (optional)"
                                className="w-full px-3 py-2 border rounded-lg"
                              />
                              <textarea
                                value={it.description || ""}
                                onChange={(e) =>
                                  updateCustomSectionItem(secIdx, itemIdx, "description", e.target.value)
                                }
                                placeholder="Description"
                                rows={3}
                                className="w-full px-3 py-2 border rounded-lg md:col-span-2"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )
        )}

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
            disabled={saving || loading || !resumeJson}
            className={`px-8 py-2.5 rounded-lg font-medium text-white min-w-[180px] transition ${
              saving || loading || !resumeJson ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Save & Update PDF
          </button>
        </div>
      </div>
    </div>
  );
}