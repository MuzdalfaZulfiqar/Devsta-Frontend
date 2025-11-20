import Select from "react-select";
import { useState, useEffect, useMemo } from "react";
import { Pencil, Check, Plus, X, Trash2 } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { updateUserProfile } from "../../../api/profile";
import SuccessModal from "../../SuccessModal";
import ErrorModal from "../../ErrorModal";
import { BACKEND_URL } from "../../../../config";
import Resume from "../../profile/tabs/Resume";

/* ---------- styles & helpers ---------- */
const selectStyles = {
  control: (base, state) => ({
    ...base,
    backgroundColor: "transparent",
    borderColor: state.isFocused ? "#086972" : "#d1d5db",
    borderRadius: "0.5rem",
    boxShadow: "none",
    "&:hover": { borderColor: "#086972" },
    minHeight: 42,
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "#ffffff",
    color: "#000000",
    zIndex: 50,
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#086972"
      : state.isFocused
      ? "#e6f4f1"
      : "#ffffff",
    color: state.isSelected ? "#ffffff" : "#000000",
    cursor: "pointer",
  }),
  singleValue: (base) => ({ ...base, color: "#111827" }),
  placeholder: (base) => ({ ...base, color: "#6b7280" }),
};

const slugify = (str) =>
  String(str)
    .toLowerCase()
    .replace(/[^a-z0-9+.# ]/g, "")
    .trim()
    .replace(/\s+/g, "-");

const unslug = (slug) =>
  String(slug)
    .replace(/[-+.#]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

const prettyLabel = (val) =>
  String(val)
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

const isOther = (opt) => {
  const v = String(opt?.value ?? "").toLowerCase();
  const l = String(opt?.label ?? "").toLowerCase();
  return v === "other" || l === "other";
};

const dedupeByValue = (arr) => {
  const seen = new Set();
  return arr.filter((o) => {
    const key = String(o.value).toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

/** Normalize any meta item into a {value, label} option */
const toOption = (item) => {
  if (typeof item === "string") {
    return { value: item, label: prettyLabel(item) };
  }
  if (item && typeof item === "object") {
    const rawVal =
      item.value ??
      item.key ??
      item.code ??
      item.slug ??
      item.id ??
      item.name ??
      item.title;

    const val = rawVal != null ? String(rawVal) : "";
    const lab =
      item.label ??
      item.name ??
      item.title ??
      (val ? prettyLabel(val) : "");

    return { value: val, label: String(lab) };
  }
  return { value: "", label: "" };
};

/* ---------- static options for profile sections ---------- */
const EDUCATION_LEVEL_OPTIONS = [
  { value: "o-level", label: "O Level" },
  { value: "a-level", label: "A Level" },
  { value: "bachelor", label: "Bachelor" },
  { value: "master", label: "Master" },
  { value: "phd", label: "PhD" },
  { value: "other", label: "Other" },
];

const JOB_TYPE_OPTIONS = [
  { value: "full-time", label: "Full-time" },
  { value: "part-time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
  { value: "freelance", label: "Freelance" },
];

const emptyEduForm = {
  level: "",
  institution: "",
  degreeTitle: "",
  fieldOfStudy: "",
  marksPercent: "",
  startYear: "",
  endYear: "",
};

const emptyExpForm = {
  position: "",
  company: "",
  jobType: "",
  startDate: "",
  endDate: "",
  description: "",
};

export default function EditProfile({ user }) {
  const { token, setUser } = useAuth();

  /* ---------- core user fields (existing) ---------- */
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    experienceLevel: user?.experienceLevel || "",
    primaryRole: user?.primaryRole || "",
    topSkills: Array.isArray(user?.topSkills)
      ? user.topSkills
          .map((s) =>
            typeof s === "string" ? s : s?.value ?? s?.key ?? s?.name ?? ""
          )
          .filter(Boolean)
      : [],
  });

  const [expOptions, setExpOptions] = useState([]); // fetched experience levels
  const [roleOptions, setRoleOptions] = useState([]); // fetched roles (+ maybe Other)
  const [allSkills, setAllSkills] = useState([]); // fetched skills

  const [editField, setEditField] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [message, setMessage] = useState("");

  // role “Other” input
  const [customRoleLabel, setCustomRoleLabel] = useState("");

  // skills “Other” input
  const [showCustomSkillInput, setShowCustomSkillInput] = useState(false);
  const [customSkillLabel, setCustomSkillLabel] = useState("");
  const [skillError, setSkillError] = useState("");

  /* ---------- profile model state (bio, interests, edu, exp) ---------- */
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);

  // About section
  const [aboutBio, setAboutBio] = useState("");
  const [aboutInterests, setAboutInterests] = useState([]);
  const [interestInput, setInterestInput] = useState("");

  // Education
  const [eduForm, setEduForm] = useState(emptyEduForm);
  const [editingEduId, setEditingEduId] = useState(null);

  // Experience
  const [expForm, setExpForm] = useState(emptyExpForm);
  const [editingExpId, setEditingExpId] = useState(null);

  const inputBoxClass =
    "mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:outline-none bg-transparent text-gray-900 dark:text-white";
  const boxContainer =
    "bg-white dark:bg-gray-900 border border-primary/30 p-4 rounded-lg";

  /* ---------- load meta lists (same endpoints as onboarding) ---------- */
  useEffect(() => {
    let cancelled = false;

    const headers = { "Content-Type": "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;

    const fetchJson = async (url) => {
      const res = await fetch(url, { headers, credentials: "include" });
      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(`${res.status} ${res.statusText} – ${t || url}`);
      }
      return res.json();
    };

    (async () => {
      try {
        const [expData, roleData, skillsData] = await Promise.all([
          fetchJson(`${BACKEND_URL}/api/experience/levels`),
          fetchJson(`${BACKEND_URL}/api/experience/roles`),
          fetchJson(`${BACKEND_URL}/api/skills`),
        ]);

        if (cancelled) return;

        // Normalize to {value,label}
        const expOpts = (Array.isArray(expData) ? expData : [])
          .map(toOption)
          .filter((o) => o.value);

        const baseRoleOpts = (Array.isArray(roleData) ? roleData : [])
          .map(toOption)
          .filter((o) => o.value);

        const backendHasOther = baseRoleOpts.some(isOther);
        const rolesWithOther = backendHasOther
          ? baseRoleOpts
          : [...baseRoleOpts, { value: "other", label: "Other" }];

        // skills kept as raw keys/strings (buttons), but normalize shape if objects
        const skills = (Array.isArray(skillsData) ? skillsData : [])
          .map((s) =>
            typeof s === "string" ? s : s?.key ?? s?.value ?? s?.name ?? ""
          )
          .filter(Boolean);

        setExpOptions(expOpts);
        setRoleOptions(dedupeByValue(rolesWithOther));
        setAllSkills(skills);
      } catch (e) {
        console.error("Meta fetch failed:", e);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token]);

  /* ---------- load Profile (bio, interests, education, experience) ---------- */
  useEffect(() => {
    if (!token) return;
    let cancelled = false;

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    const loadProfile = async () => {
      setProfileLoading(true);
      try {
        const res = await fetch(`${BACKEND_URL}/api/profile/me`, {
          headers,
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.msg || "Failed to fetch profile");
        if (cancelled) return;
        setProfile(data);
        setAboutBio(data.bio || "");
        setAboutInterests(
          Array.isArray(data.interests) ? data.interests : []
        );
      } catch (err) {
        console.error("Profile fetch failed:", err);
      } finally {
        if (!cancelled) setProfileLoading(false);
      }
    };

    loadProfile();
    return () => {
      cancelled = true;
    };
  }, [token]);

  /* ---------- know the exact backend "Other" value ---------- */
  const otherRoleValue = useMemo(() => {
    const found = roleOptions.find(isOther);
    return found?.value || "other";
  }, [roleOptions]);

  /* ---------- prefill custom role if existing value is custom:<slug> ---------- */
  useEffect(() => {
    if (user?.primaryRole && String(user.primaryRole).startsWith("custom:")) {
      const raw = String(user.primaryRole).slice(7);
      setCustomRoleLabel(unslug(raw));
      setForm((prev) => ({ ...prev, primaryRole: otherRoleValue }));
    }
  }, [user?.primaryRole, otherRoleValue]);

  /* ---------- Select values ---------- */
  const experienceSelectValue = useMemo(() => {
    return expOptions.find((o) => o.value === form.experienceLevel) || null;
  }, [expOptions, form.experienceLevel]);

  const roleSelectValue = useMemo(() => {
    if (!form.primaryRole) return null;

    const isOtherSelected =
      form.primaryRole === otherRoleValue ||
      String(form.primaryRole).startsWith("custom:");

    if (isOtherSelected) {
      return (
        roleOptions.find(isOther) || { value: otherRoleValue, label: "Other" }
      );
    }
    return roleOptions.find((o) => o.value === form.primaryRole) || null;
  }, [roleOptions, form.primaryRole, otherRoleValue]);

  /* ---------- Read-mode pretty role ---------- */
  const prettyRole = useMemo(() => {
    const val = form.primaryRole;
    if (!val) return "-";
    if (String(val).startsWith("custom:"))
      return `Custom: ${unslug(val.slice(7))}`;
    if (val === otherRoleValue)
      return customRoleLabel ? `Custom: ${customRoleLabel}` : "Other";
    const found = roleOptions.find((r) => r.value === val);
    return found?.label || prettyLabel(val);
  }, [form.primaryRole, customRoleLabel, roleOptions, otherRoleValue]);

  /* ---------- Skills: know if backend provided "Other" ---------- */
  const backendHasSkillOther = useMemo(
    () => allSkills.some((s) => slugify(s) === "other"),
    [allSkills]
  );

  /* ---------- handlers: core user fields ---------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleSkill = (skill) => {
    setSkillError("");
    setForm((prev) => ({
      ...prev,
      topSkills: prev.topSkills.includes(skill)
        ? prev.topSkills.filter((s) => s !== skill)
        : [...prev.topSkills, skill],
    }));
  };

  const addCustomSkill = () => {
    const raw = customSkillLabel.trim();
    if (!raw) {
      setSkillError("Please enter a skill name.");
      return;
    }
    const key = `custom:${slugify(raw)}`;
    if (form.topSkills.includes(key)) {
      setSkillError("This skill is already added.");
      return;
    }
    setForm((prev) => ({ ...prev, topSkills: [...prev.topSkills, key] }));
    setCustomSkillLabel("");
    setShowCustomSkillInput(false);
    setSkillError("");
  };

  const handleSaveCore = async () => {
    try {
      setLoading(true);
      const payload = { ...form };

      // If “Other” is selected, send the custom role label to backend.
      if (form.primaryRole === otherRoleValue) {
        payload.customRoleLabel = customRoleLabel.trim();
      } else {
        delete payload.customRoleLabel;
      }

      const updatedUser = await updateUserProfile(payload, token);
      setUser(updatedUser);
      setMessage("Profile updated successfully!");
      setSuccessOpen(true);
      setEditField(null);
    } catch (err) {
      setMessage(err?.message || "Failed to update profile");
      setErrorOpen(true);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- handlers: About (bio + interests) ---------- */
  const handleAddInterest = () => {
    const raw = interestInput.trim();
    if (!raw) return;
    const val = raw.toLowerCase();
    if (!aboutInterests.includes(val)) {
      setAboutInterests((prev) => [...prev, val]);
    }
    setInterestInput("");
  };

  const handleSaveBasics = async () => {
    try {
      setLoading(true);
      const headers = {
        "Content-Type": "application/json",
      };
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch(`${BACKEND_URL}/api/profile`, {
        method: "PUT",
        headers,
        credentials: "include",
        body: JSON.stringify({
          bio: aboutBio,
          interests: aboutInterests,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Failed to update profile");

      setProfile((prev) =>
        prev ? { ...prev, ...data.profile } : data.profile
      );
      setMessage("About section updated");
      setSuccessOpen(true);
      setEditField(null);
    } catch (err) {
      setMessage(err.message || "Failed to update about section");
      setErrorOpen(true);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- handlers: Education ---------- */
  const startAddEducation = () => {
    setEditingEduId(null);
    setEduForm(emptyEduForm);
    setEditField("education");
  };

  const startEditEducation = (edu) => {
    setEditingEduId(edu._id);
    setEduForm({
      level: edu.level || "",
      institution: edu.institution || "",
      degreeTitle: edu.degreeTitle || "",
      fieldOfStudy: edu.fieldOfStudy || "",
      marksPercent:
        typeof edu.marksPercent === "number" ? String(edu.marksPercent) : "",
      startYear: edu.startYear ? String(edu.startYear) : "",
      endYear: edu.endYear ? String(edu.endYear) : "",
    });
    setEditField("education");
  };

  const handleSaveEducation = async () => {
    try {
      setLoading(true);
      const headers = {
        "Content-Type": "application/json",
      };
      if (token) headers.Authorization = `Bearer ${token}`;

      const body = {
        ...eduForm,
        marksPercent:
          eduForm.marksPercent === ""
            ? undefined
            : Number(eduForm.marksPercent),
        startYear:
          eduForm.startYear === "" ? undefined : Number(eduForm.startYear),
        endYear: eduForm.endYear === "" ? undefined : Number(eduForm.endYear),
      };

      const url = editingEduId
        ? `${BACKEND_URL}/api/profile/education/${editingEduId}`
        : `${BACKEND_URL}/api/profile/education`;
      const method = editingEduId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers,
        credentials: "include",
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Failed to save education");

      // controller returns { msg, education: profile.education }
      setProfile((prev) =>
        prev ? { ...prev, education: data.education } : prev
      );
      setMessage(
        editingEduId ? "Education updated successfully" : "Education added"
      );
      setSuccessOpen(true);

      setEduForm(emptyEduForm);
      setEditingEduId(null);
      setEditField(null);
    } catch (err) {
      setMessage(err.message || "Failed to save education");
      setErrorOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEducation = async (eduId) => {
    // simple confirm; you can replace with nicer modal if you want
    if (!window.confirm("Remove this education entry?")) return;

    try {
      setLoading(true);
      const headers = {
        "Content-Type": "application/json",
      };
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch(
        `${BACKEND_URL}/api/profile/education/${eduId}`,
        {
          method: "DELETE",
          headers,
          credentials: "include",
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Failed to remove education");

      setProfile((prev) =>
        prev ? { ...prev, education: data.education } : prev
      );
      setMessage("Education removed");
      setSuccessOpen(true);
    } catch (err) {
      setMessage(err.message || "Failed to remove education");
      setErrorOpen(true);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- handlers: Experience (work history) ---------- */
  const startAddExperience = () => {
    setEditingExpId(null);
    setExpForm(emptyExpForm);
    setEditField("work");
  };

  const startEditExperience = (exp) => {
    setEditingExpId(exp._id);
    setExpForm({
      position: exp.position || "",
      company: exp.company || "",
      jobType: exp.jobType || "",
      startDate: exp.startDate ? exp.startDate.slice(0, 10) : "",
      endDate: exp.endDate ? exp.endDate.slice(0, 10) : "",
      description: exp.description || "",
    });
    setEditField("work");
  };

  const handleSaveExperience = async () => {
    try {
      setLoading(true);
      const headers = {
        "Content-Type": "application/json",
      };
      if (token) headers.Authorization = `Bearer ${token}`;

      const body = {
        ...expForm,
        startDate: expForm.startDate || undefined,
        endDate: expForm.endDate || undefined,
      };

      const url = editingExpId
        ? `${BACKEND_URL}/api/profile/experience/${editingExpId}`
        : `${BACKEND_URL}/api/profile/experience`;
      const method = editingExpId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers,
        credentials: "include",
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Failed to save experience");

      setProfile((prev) =>
        prev ? { ...prev, experience: data.experience } : prev
      );
      setMessage(
        editingExpId ? "Experience updated successfully" : "Experience added"
      );
      setSuccessOpen(true);

      setExpForm(emptyExpForm);
      setEditingExpId(null);
      setEditField(null);
    } catch (err) {
      setMessage(err.message || "Failed to save experience");
      setErrorOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExperience = async (expId) => {
    if (!window.confirm("Remove this experience entry?")) return;

    try {
      setLoading(true);
      const headers = {
        "Content-Type": "application/json",
      };
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch(
        `${BACKEND_URL}/api/profile/experience/${expId}`,
        {
          method: "DELETE",
          headers,
          credentials: "include",
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Failed to remove experience");

      setProfile((prev) =>
        prev ? { ...prev, experience: data.experience } : prev
      );
      setMessage("Experience removed");
      setSuccessOpen(true);
    } catch (err) {
      setMessage(err.message || "Failed to remove experience");
      setErrorOpen(true);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- UI ---------- */
  return (
    <div className="flex flex-col gap-10 w-full">
      {/* GENERAL INFO */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            General Info
          </h2>
          <button
            onClick={() =>
              setEditField(editField === "general" ? null : "general")
            }
            className="text-gray-600 dark:text-gray-300 hover:text-primary transition"
          >
            {editField === "general" ? <Check size={18} /> : <Pencil size={18} />}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["name", "phone"].map((field) => (
            <div key={field} className={boxContainer}>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium capitalize">
                {field}
              </p>
              {editField === "general" ? (
                <input
                  type="text"
                  name={field}
                  value={form[field]}
                  onChange={handleChange}
                  className={inputBoxClass}
                />
              ) : (
                <p className="text-gray-900 dark:text-white font-semibold mt-1">
                  {form[field] || "-"}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ABOUT / BASICS (bio + interests) */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            About
          </h2>
          <button
            onClick={() =>
              setEditField(editField === "about" ? null : "about")
            }
            className="text-gray-600 dark:text-gray-300 hover:text-primary transition"
          >
            {editField === "about" ? <Check size={18} /> : <Pencil size={18} />}
          </button>
        </div>

        {profileLoading && !profile ? (
          <p className="text-sm text-gray-500 animate-pulse">
            Loading profile...
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Bio */}
            <div className={boxContainer}>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                Bio
              </p>
              {editField === "about" ? (
                <textarea
                  className={`${inputBoxClass} min-h-[120px] resize-vertical`}
                  value={aboutBio}
                  onChange={(e) => setAboutBio(e.target.value)}
                  placeholder="Tell others a little about yourself..."
                />
              ) : (
                <p className="text-gray-900 dark:text-white font-semibold mt-1 whitespace-pre-line">
                  {profile?.bio || "No bio added yet"}
                </p>
              )}
            </div>

            {/* Interests */}
            <div className={boxContainer}>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                Interests
              </p>
              {editField === "about" ? (
                <>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {aboutInterests.length > 0 ? (
                      aboutInterests.map((i, idx) => (
                        <button
                          key={`${i}-${idx}`}
                          type="button"
                          onClick={() =>
                            setAboutInterests((prev) =>
                              prev.filter((_, j) => j !== idx)
                            )
                          }
                          className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-primary bg-primary text-white text-xs font-medium"
                        >
                          <X size={12} />
                          {i}
                        </button>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">
                        No interests yet. Add a few keywords.
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <input
                      type="text"
                      value={interestInput}
                      onChange={(e) => setInterestInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddInterest();
                        }
                      }}
                      placeholder="e.g., backend, UI design"
                      className="flex-1 border rounded-lg px-3 py-2 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={handleAddInterest}
                      className="px-3 py-2 rounded-lg bg-primary text-white text-sm hover:bg-primary/90"
                    >
                      Add
                    </button>
                  </div>
                </>
              ) : profile?.interests?.length ? (
                <div className="flex flex-wrap gap-2 mt-2">
                  {profile.interests.map((i, idx) => (
                    <span
                      key={`${i}-${idx}`}
                      className="px-3 py-1.5 rounded-full border border-primary text-primary text-xs font-medium"
                    >
                      {i}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
                  No interests added
                </p>
              )}
            </div>
          </div>
        )}

        {editField === "about" && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSaveBasics}
              disabled={loading}
              className="mt-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80 text-sm disabled:opacity-60"
            >
              {loading ? "Saving..." : "Save About"}
            </button>
          </div>
        )}
      </div>

      {/* EXPERIENCE LEVEL & ROLE */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Experience & Role
          </h2>
          <button
            onClick={() =>
              setEditField(editField === "experience" ? null : "experience")
            }
            className="text-gray-600 dark:text-gray-300 hover:text-primary transition"
          >
            {editField === "experience" ? (
              <Check size={18} />
            ) : (
              <Pencil size={18} />
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Experience */}
          <div className={boxContainer}>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              Experience Level
            </p>
            {editField === "experience" ? (
              <Select
                options={expOptions}
                value={experienceSelectValue}
                onChange={(selected) =>
                  setForm({ ...form, experienceLevel: selected?.value || "" })
                }
                placeholder="Select experience level"
                styles={selectStyles}
              />
            ) : (
              <div className="mt-1 text-gray-900 dark:text-white font-semibold">
                {experienceSelectValue?.label ||
                  prettyLabel(form.experienceLevel) ||
                  "-"}
              </div>
            )}
          </div>

          {/* Role + Other input */}
          <div className={boxContainer}>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              Primary Role
            </p>
            {editField === "experience" ? (
              <>
                <Select
                  options={roleOptions}
                  value={roleSelectValue}
                  onChange={(selected) => {
                    const val = selected?.value || "";
                    setForm((prev) => ({ ...prev, primaryRole: val }));
                    if (val !== otherRoleValue) setCustomRoleLabel("");
                  }}
                  placeholder="Select your role"
                  styles={selectStyles}
                />
                {form.primaryRole === otherRoleValue && (
                  <div className="mt-3">
                    <label className="text-sm text-gray-600 dark:text-gray-300">
                      Enter your role
                    </label>
                    <input
                      type="text"
                      value={customRoleLabel}
                      onChange={(e) => setCustomRoleLabel(e.target.value)}
                      placeholder="e.g., Data Analyst"
                      className={inputBoxClass}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Will be saved as{" "}
                      <code>custom:{slugify(customRoleLabel || "")}</code>.
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="mt-1 text-gray-900 dark:text-white font-semibold">
                {prettyRole}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ⚡ SKILLS SECTION */}
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Top Skills
          </h2>
          <button
            onClick={() =>
              setEditField(editField === "skills" ? null : "skills")
            }
            className="text-gray-600 dark:text-gray-300 hover:text-primary transition"
          >
            {editField === "skills" ? <Check size={18} /> : <Pencil size={18} />}
          </button>
        </div>

        {/* Edit Mode */}
        {editField === "skills" ? (
          <>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Click a skill to select or remove. Add a new one using{" "}
              <b>Other</b> at the end.
            </p>

            {/* Skills Grid */}
            <div className="flex flex-wrap gap-2">
              {allSkills.length > 0 ? (
                <>
                  {/* Regular Skills Sorted: selected first, then unselected */}
                  {[...allSkills]
                    .filter((s) => slugify(s) !== "other")
                    .sort((a, b) => {
                      const aSel = form.topSkills.includes(a);
                      const bSel = form.topSkills.includes(b);
                      return aSel === bSel ? 0 : aSel ? -1 : 1;
                    })
                    .map((skill) => {
                      const isSelected = form.topSkills.includes(skill);
                      return (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => toggleSkill(skill)}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-full border text-sm font-medium transition-all duration-150 ${
                            isSelected
                              ? "bg-primary text-white border-primary shadow-md scale-[1.02]"
                              : "bg-gray-100 dark:bg-gray-800 border-gray-400 text-gray-700 dark:text-gray-300 hover:border-primary hover:text-primary"
                          }`}
                        >
                          {isSelected ? <X size={14} /> : <Plus size={14} />}
                          {skill}
                        </button>
                      );
                    })}

                  {/* Custom-added Skills (same style as selected) */}
                  {form.topSkills
                    .filter((s) => s.startsWith("custom:"))
                    .map((s) => {
                      const label = unslug(s.slice(7));
                      return (
                        <button
                          key={s}
                          type="button"
                          onClick={() => toggleSkill(s)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-primary bg-primary text-white text-sm font-medium shadow-md hover:bg-primary/90 transition"
                        >
                          <X size={14} />
                          {label}
                        </button>
                      );
                    })}

                  {/* Other button (always at the end) */}
                  <button
                    type="button"
                    onClick={() => {
                      setShowCustomSkillInput((s) => !s);
                      setSkillError("");
                    }}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-sm font-medium shadow-sm transition-all duration-200 ${
                      showCustomSkillInput
                        ? "bg-gradient-to-r from-primary to-primary/70 text-white border-primary scale-105"
                        : "bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 border-gray-400 text-gray-700 dark:text-gray-300 hover:from-primary hover:to-primary/80 hover:text-white hover:border-primary"
                    }`}
                  >
                    <Plus
                      size={15}
                      className={`transition-transform ${
                        showCustomSkillInput ? "rotate-45" : ""
                      }`}
                    />
                    Other
                  </button>
                </>
              ) : (
                <p className="text-gray-500 text-sm animate-pulse">
                  Loading skills...
                </p>
              )}
            </div>

            {/* Custom Skill Input */}
            {showCustomSkillInput && (
              <div className="flex items-center gap-2 mt-3 animate-fadeIn">
                <input
                  type="text"
                  value={customSkillLabel}
                  onChange={(e) => {
                    setCustomSkillLabel(e.target.value);
                    if (skillError) setSkillError("");
                  }}
                  placeholder="Enter a custom skill (e.g., System Design)"
                  className="flex-1 border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 dark:bg-gray-900 dark:text-white transition"
                />
                <button
                  type="button"
                  onClick={addCustomSkill}
                  className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 text-sm font-medium transition"
                >
                  Add
                </button>
              </div>
            )}

            {skillError && (
              <p className="text-red-500 text-xs mt-1">{skillError}</p>
            )}

            {/* Skill Count */}
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              {form.topSkills.length} skill
              {form.topSkills.length !== 1 && "s"} selected
            </p>
          </>
        ) : form.topSkills.length > 0 ? (
          /* Read-only view */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {form.topSkills.map((skill) => {
              const label = skill.startsWith("custom:")
                ? unslug(skill.slice(7))
                : skill;
              return (
                <div
                  key={skill}
                  className="bg-white dark:bg-gray-900 border border-primary px-3 py-2 rounded-full text-center text-sm font-medium text-primary"
                >
                  {label}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No skills added</p>
        )}
      </div>

      {/* EDUCATION SECTION */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Education
          </h2>
          <button
            type="button"
            onClick={() => {
              if (editField === "education") {
                setEditField(null);
                setEditingEduId(null);
                setEduForm(emptyEduForm);
              } else {
                startAddEducation();
              }
            }}
            className="flex items-center gap-1 px-3 py-1.5 text-sm border border-primary rounded-md text-primary hover:bg-primary hover:text-white transition"
          >
            {editField === "education" ? (
              <>
                <X size={14} />
                Cancel
              </>
            ) : (
              <>
                <Plus size={14} />
                Add
              </>
            )}
          </button>
        </div>

        {profileLoading && !profile ? (
          <p className="text-sm text-gray-500 animate-pulse">
            Loading education...
          </p>
        ) : (
          <>
            {profile?.education?.length ? (
              <div className="flex flex-col gap-3">
                {profile.education.map((edu) => (
                  <div
                    key={edu._id}
                    className={`${boxContainer} flex flex-col gap-1`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {edu.degreeTitle || prettyLabel(edu.level)}{" "}
                          {edu.fieldOfStudy && (
                            <span className="text-gray-700 dark:text-gray-300">
                              • {edu.fieldOfStudy}
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {edu.institution}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {edu.startYear || "—"} –{" "}
                          {edu.endYear || "Present"}
                          {typeof edu.marksPercent === "number" &&
                            ` • ${edu.marksPercent}%`}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => startEditEducation(edu)}
                          className="text-xs px-2 py-1 rounded-md border border-gray-300 text-gray-700 dark:text-gray-200 hover:border-primary hover:text-primary"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteEducation(edu._id)}
                          className="text-xs px-2 py-1 rounded-md border border-red-500 text-red-500 hover:bg-red-500 hover:text-white flex items-center gap-1"
                        >
                          <Trash2 size={12} />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                No education added yet. Use <b>Add</b> to create your first
                entry.
              </p>
            )}

            {editField === "education" && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSaveEducation();
                }}
                className={`${boxContainer} flex flex-col gap-3`}
              >
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {editingEduId ? "Edit Education" : "Add Education"}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-300">
                      Level *
                    </label>
                    <select
                      className={inputBoxClass}
                      value={eduForm.level}
                      onChange={(e) =>
                        setEduForm((prev) => ({
                          ...prev,
                          level: e.target.value,
                        }))
                      }
                      required
                    >
                      <option value="">Select level</option>
                      {EDUCATION_LEVEL_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-300">
                      Institution *
                    </label>
                    <input
                      className={inputBoxClass}
                      value={eduForm.institution}
                      onChange={(e) =>
                        setEduForm((prev) => ({
                          ...prev,
                          institution: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-300">
                      Degree / Program
                    </label>
                    <input
                      className={inputBoxClass}
                      value={eduForm.degreeTitle}
                      onChange={(e) =>
                        setEduForm((prev) => ({
                          ...prev,
                          degreeTitle: e.target.value,
                        }))
                      }
                      placeholder="e.g., BS Computer Science"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-300">
                      Field of Study
                    </label>
                    <input
                      className={inputBoxClass}
                      value={eduForm.fieldOfStudy}
                      onChange={(e) =>
                        setEduForm((prev) => ({
                          ...prev,
                          fieldOfStudy: e.target.value,
                        }))
                      }
                      placeholder="e.g., Computer Science"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-300">
                      Marks / Percentage
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      className={inputBoxClass}
                      value={eduForm.marksPercent}
                      onChange={(e) =>
                        setEduForm((prev) => ({
                          ...prev,
                          marksPercent: e.target.value,
                        }))
                      }
                      placeholder="e.g., 85"
                    />
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="text-sm text-gray-600 dark:text-gray-300">
                        Start Year
                      </label>
                      <input
                        type="number"
                        className={inputBoxClass}
                        value={eduForm.startYear}
                        onChange={(e) =>
                          setEduForm((prev) => ({
                            ...prev,
                            startYear: e.target.value,
                          }))
                        }
                        placeholder="e.g., 2019"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-sm text-gray-600 dark:text-gray-300">
                        End Year
                      </label>
                      <input
                        type="number"
                        className={inputBoxClass}
                        value={eduForm.endYear}
                        onChange={(e) =>
                          setEduForm((prev) => ({
                            ...prev,
                            endYear: e.target.value,
                          }))
                        }
                        placeholder="e.g., 2023"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditField(null);
                      setEditingEduId(null);
                      setEduForm(emptyEduForm);
                    }}
                    className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 dark:text-gray-200 hover:border-gray-500 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/80 text-sm disabled:opacity-60"
                  >
                    {loading ? "Saving..." : "Save Education"}
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </div>

      {/* EXPERIENCE (WORK HISTORY) SECTION */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Experience
          </h2>
          <button
            type="button"
            onClick={() => {
              if (editField === "work") {
                setEditField(null);
                setEditingExpId(null);
                setExpForm(emptyExpForm);
              } else {
                startAddExperience();
              }
            }}
            className="flex items-center gap-1 px-3 py-1.5 text-sm border border-primary rounded-md text-primary hover:bg-primary hover:text-white transition"
          >
            {editField === "work" ? (
              <>
                <X size={14} />
                Cancel
              </>
            ) : (
              <>
                <Plus size={14} />
                Add
              </>
            )}
          </button>
        </div>

        {profileLoading && !profile ? (
          <p className="text-sm text-gray-500 animate-pulse">
            Loading experience...
          </p>
        ) : (
          <>
            {profile?.experience?.length ? (
              <div className="flex flex-col gap-3">
                {profile.experience.map((exp) => (
                  <div
                    key={exp._id}
                    className={`${boxContainer} flex flex-col gap-1`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {exp.position}{" "}
                          <span className="text-gray-700 dark:text-gray-300">
                            • {exp.company}
                          </span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {prettyLabel(exp.jobType)} •{" "}
                          {exp.startDate
                            ? exp.startDate.slice(0, 10)
                            : "—"}{" "}
                          –{" "}
                          {exp.endDate
                            ? exp.endDate.slice(0, 10)
                            : "Present"}
                        </p>
                        {exp.description && (
                          <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 whitespace-pre-line">
                            {exp.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => startEditExperience(exp)}
                          className="text-xs px-2 py-1 rounded-md border border-gray-300 text-gray-700 dark:text-gray-200 hover:border-primary hover:text-primary"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteExperience(exp._id)}
                          className="text-xs px-2 py-1 rounded-md border border-red-500 text-red-500 hover:bg-red-500 hover:text-white flex items-center gap-1"
                        >
                          <Trash2 size={12} />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                No experience added yet. Use <b>Add</b> to document your work
                history.
              </p>
            )}

            {editField === "work" && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSaveExperience();
                }}
                className={`${boxContainer} flex flex-col gap-3`}
              >
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {editingExpId ? "Edit Experience" : "Add Experience"}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-300">
                      Position *
                    </label>
                    <input
                      className={inputBoxClass}
                      value={expForm.position}
                      onChange={(e) =>
                        setExpForm((prev) => ({
                          ...prev,
                          position: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-300">
                      Company *
                    </label>
                    <input
                      className={inputBoxClass}
                      value={expForm.company}
                      onChange={(e) =>
                        setExpForm((prev) => ({
                          ...prev,
                          company: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-300">
                      Job Type *
                    </label>
                    <select
                      className={inputBoxClass}
                      value={expForm.jobType}
                      onChange={(e) =>
                        setExpForm((prev) => ({
                          ...prev,
                          jobType: e.target.value,
                        }))
                      }
                      required
                    >
                      <option value="">Select job type</option>
                      {JOB_TYPE_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="text-sm text-gray-600 dark:text-gray-300">
                        Start Date *
                      </label>
                      <input
                        type="date"
                        className={inputBoxClass}
                        value={expForm.startDate}
                        onChange={(e) =>
                          setExpForm((prev) => ({
                            ...prev,
                            startDate: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-sm text-gray-600 dark:text-gray-300">
                        End Date
                      </label>
                      <input
                        type="date"
                        className={inputBoxClass}
                        value={expForm.endDate}
                        onChange={(e) =>
                          setExpForm((prev) => ({
                            ...prev,
                            endDate: e.target.value,
                          }))
                        }
                      />
                      <p className="text-[10px] text-gray-500 mt-1">
                        Leave empty if this is your current role.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-300">
                    Description
                  </label>
                  <textarea
                    className={`${inputBoxClass} min-h-[80px] resize-vertical`}
                    value={expForm.description}
                    onChange={(e) =>
                      setExpForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="What did you work on, what impact did you create?"
                  />
                </div>

                <div className="flex justify-end gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditField(null);
                      setEditingExpId(null);
                      setExpForm(emptyExpForm);
                    }}
                    className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 dark:text-gray-200 hover:border-gray-500 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/80 text-sm disabled:opacity-60"
                  >
                    {loading ? "Saving..." : "Save Experience"}
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </div>

      {/* RESUME SECTION */}
      <div className="flex flex-col gap-6">
        <Resume user={user} editable />
      </div>

      {/* SAVE BUTTON FOR CORE USER FIELDS */}
      <div>
        <button
          onClick={handleSaveCore}
          disabled={loading}
          className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/80 transition disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <SuccessModal
        open={successOpen}
        message={message}
        onClose={() => setSuccessOpen(false)}
      />
      <ErrorModal
        open={errorOpen}
        message={message}
        onClose={() => setErrorOpen(false)}
      />
    </div>
  );
}
