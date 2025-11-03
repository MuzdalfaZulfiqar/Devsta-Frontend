import Select from "react-select";
import { useState, useEffect } from "react";
import { Pencil, Check, Plus, X } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { updateUserProfile } from "../../../api/profile";
import SuccessModal from "../../SuccessModal";
import ErrorModal from "../../ErrorModal";
import { BACKEND_URL } from "../../../../config";
import Resume from "../../profile/tabs/Resume"; // adjust the relative path if needed


const EXPERIENCE_LEVELS = [
    { value: "student", label: "Student" },
    { value: "intern", label: "Intern" },
    { value: "junior", label: "Junior" },
    { value: "mid", label: "Mid-Level" },
    { value: "senior", label: "Senior" },
    { value: "lead", label: "Lead" },
];

const ROLES = [
    { value: "frontend", label: "Frontend Developer" },
    { value: "backend", label: "Backend Developer" },
    { value: "fullstack", label: "Fullstack Developer" },
    { value: "data-science", label: "Data Science" },
    { value: "ml", label: "Machine Learning" },
    { value: "devops", label: "DevOps Engineer" },
    { value: "mobile", label: "Mobile Developer" },
    { value: "ui-ux", label: "UI/UX Designer" },
    { value: "product", label: "Product Manager" },
    { value: "qa", label: "QA Engineer" },
    { value: "other", label: "Other" },
];

// --- BRAND STYLE for Select ---
const selectStyles = {
    control: (base, state) => ({
        ...base,
        backgroundColor: "transparent",
        borderColor: state.isFocused ? "#086972" : "#d1d5db",
        borderRadius: "0.5rem",
        boxShadow: "none",
        "&:hover": { borderColor: "#086972" },
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
    singleValue: (base) => ({
        ...base,
        color: "#111827",
    }),
    placeholder: (base) => ({
        ...base,
        color: "#6b7280",
    }),
};

export default function EditProfile({ user }) {
    const { token, setUser } = useAuth();

    const [form, setForm] = useState({
        name: user?.name || "",
        phone: user?.phone || "",
        experienceLevel: user?.experienceLevel || "",
        primaryRole: user?.primaryRole || "",
        topSkills: user?.topSkills || [],
    });

    const [allSkills, setAllSkills] = useState([]);
    const [editField, setEditField] = useState(null);
    const [loading, setLoading] = useState(false);
    const [successOpen, setSuccessOpen] = useState(false);
    const [errorOpen, setErrorOpen] = useState(false);
    const [message, setMessage] = useState("");

    const inputBoxClass =
        "mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:outline-none bg-transparent text-gray-900 dark:text-white";

    const boxContainer =
        "bg-white dark:bg-gray-900 border border-primary p-4 rounded-lg";

    useEffect(() => {
        fetch(`${BACKEND_URL}/api/skills`)
            .then((res) => res.json())
            .then((data) => {
                const normalized = data.map((s) => (typeof s === "string" ? s : s.key || s.label));
                setAllSkills(normalized);
            })
            .catch(() => { });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            const updatedUser = await updateUserProfile(form, token);
            setUser(updatedUser);
            setMessage("Profile updated successfully!");
            setSuccessOpen(true);
            setEditField(null);
        } catch (err) {
            setMessage(err.message);
            setErrorOpen(true);
        } finally {
            setLoading(false);
        }
    };

    const toggleSkill = (skill) => {
        setForm((prev) => ({
            ...prev,
            topSkills: prev.topSkills.includes(skill)
                ? prev.topSkills.filter((s) => s !== skill)
                : [...prev.topSkills, skill],
        }));
    };

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

            {/* EXPERIENCE & ROLE */}
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
                        {editField === "experience" ? <Check size={18} /> : <Pencil size={18} />}
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className={boxContainer}>
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                            Experience Level
                        </p>
                        {editField === "experience" ? (
                            <Select
                                options={EXPERIENCE_LEVELS}
                                value={
                                    EXPERIENCE_LEVELS.find((opt) => opt.value === form.experienceLevel) || null
                                }
                                onChange={(selected) =>
                                    setForm({ ...form, experienceLevel: selected?.value || "" })
                                }
                                placeholder="Select experience level"
                                styles={selectStyles}
                            />
                        ) : (
                            <div className="mt-1 text-gray-900 dark:text-white font-semibold">
                                {
                                    EXPERIENCE_LEVELS.find((opt) => opt.value === form.experienceLevel)
                                        ?.label || form.experienceLevel || "-"
                                }
                            </div>
                        )}
                    </div>

                    <div className={boxContainer}>
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                            Primary Role
                        </p>
                        {editField === "experience" ? (
                            <Select
                                options={ROLES}
                                value={ROLES.find((opt) => opt.value === form.primaryRole) || null}
                                onChange={(selected) =>
                                    setForm({ ...form, primaryRole: selected?.value || "" })
                                }
                                placeholder="Select your role"
                                styles={selectStyles}
                            />
                        ) : (
                            <div className="mt-1 text-gray-900 dark:text-white font-semibold">
                                {ROLES.find((opt) => opt.value === form.primaryRole)?.label ||
                                    form.primaryRole ||
                                    "-"}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* SKILLS */}
            <div className="flex flex-col gap-6">
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

                {editField === "skills" ? (
                    <>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                            Selected skills are highlighted.
                            Click + to add or x again to remove.
                        </p>

                        <div className="flex flex-wrap gap-2">
                            {allSkills.length > 0 ? (
                                allSkills.map((skill) => {
                                    const isSelected = form.topSkills.includes(skill);
                                    return (
                                        <button
                                            key={skill}
                                            type="button"
                                            onClick={() => toggleSkill(skill)}
                                            className={`flex items-center gap-1 px-3 py-1.5 rounded-full border text-sm font-medium transition ${isSelected
                                                ? "bg-primary text-white border-primary shadow-sm"
                                                : "bg-gray-100 dark:bg-gray-800 border-gray-400 text-gray-600 dark:text-gray-300 hover:border-primary"
                                                }`}
                                        >
                                            {isSelected ? <X size={14} /> : <Plus size={14} />}
                                            {skill}
                                        </button>
                                    );
                                })
                            ) : (
                                <p className="text-gray-500 text-sm">Loading skills...</p>
                            )}
                        </div>
                    </>
                ) : form.topSkills.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {form.topSkills.map((skill) => (
                            <div
                                key={skill}
                                className="bg-white dark:bg-gray-900 border border-primary px-3 py-2 rounded-full text-center text-sm font-medium text-primary"
                            >
                                {skill}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 dark:text-gray-400">No skills added</p>
                )}
            </div>
            
{/* RESUME SECTION */}
<div className="flex flex-col gap-6">
 <Resume user={user} editable />

</div>

            {/* SAVE BUTTON */}
            {editField && (
                <div>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/80 transition disabled:opacity-60"
                    >
                        {loading ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            )}

            <SuccessModal open={successOpen} message={message} onClose={() => setSuccessOpen(false)} />
            <ErrorModal open={errorOpen} message={message} onClose={() => setErrorOpen(false)} />
        </div>
    );
}
