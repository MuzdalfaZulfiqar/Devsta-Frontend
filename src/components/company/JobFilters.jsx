import { useState } from "react";
import Select from "react-select";

/* Shared Select Styles */
const selectStyles = {
    control: (base, state) => ({
        ...base,
        backgroundColor: "transparent",
        borderColor: state.isFocused ? "#086972" : "#d1d5db",
        borderRadius: "0.5rem",
        boxShadow: "none",
        "&:hover": { borderColor: "#086972" },
        minHeight: "42px",
    }),
    menu: (base) => ({
        ...base,
        backgroundColor: "#fff",
        color: "#000",
        zIndex: 50,
    }),
};

/* 🔹 Options */
const jobModeOptions = [
    { value: "remote", label: "Remote" },
    { value: "hybrid", label: "Hybrid" },
    { value: "onsite", label: "Onsite" },
];

const experienceOptions = [
    { value: "junior", label: "Junior" },
    { value: "mid", label: "Mid" },
    { value: "senior", label: "Senior" },
];

const employmentOptions = [
    { value: "full-time", label: "Full-time" },
    { value: "part-time", label: "Part-time" },
    { value: "internship", label: "Internship" },
    { value: "contract", label: "Contract" },
];

export default function JobFilters({ filters, setFilters }) {
    // Helper to reset dropdowns properly
    const clearFilters = () => {
        setFilters({
            search: "",
            jobMode: null,
            employmentType: null,
            experienceLevel: null,
            location: "",
        });
    };

    return (
        <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-4">

            {/* 🔍 First Row: Search + Job Mode */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                    type="text"
                    placeholder="Search jobs, skills, keywords…"
                    value={filters.search}
                    onChange={(e) =>
                        setFilters((f) => ({ ...f, search: e.target.value }))
                    }
                    className="border rounded-lg px-4 py-2 w-full"
                />

                <Select
                    placeholder="Job Mode"
                    isClearable
                    styles={selectStyles}
                    options={jobModeOptions}
                    value={jobModeOptions.find(o => o.value === filters.jobMode) || null}
                    onChange={(o) =>
                        setFilters((f) => ({
                            ...f,
                            jobMode: o?.value || null,
                            location: o?.value === "remote" ? "" : f.location, // auto-clear location for remote
                        }))
                    }
                />

            </div>

            {/* 🔹 Second Row: Experience + Employment Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Select
                    placeholder="Experience"
                    isClearable
                    styles={selectStyles}
                    options={experienceOptions}
                    value={experienceOptions.find(o => o.value === filters.experienceLevel) || null}
                    onChange={(o) =>
                        setFilters((f) => ({ ...f, experienceLevel: o?.value || null }))
                    }
                />

                <Select
                    placeholder="Employment Type"
                    isClearable
                    styles={selectStyles}
                    options={employmentOptions}
                    value={employmentOptions.find(o => o.value === filters.employmentType) || null}
                    onChange={(o) =>
                        setFilters((f) => ({ ...f, employmentType: o?.value || null }))
                    }
                />
            </div>

            {/* 📍 Location (only for hybrid/onsite) */}
            {(filters.jobMode === "hybrid" || filters.jobMode === "onsite") && (
                <input
                    type="text"
                    placeholder="Location (e.g. Lahore)"
                    value={filters.location}
                    onChange={(e) =>
                        setFilters((f) => ({ ...f, location: e.target.value }))
                    }
                    className="border rounded-lg px-4 py-2 w-full"
                />
            )}

            {/* 🧹 Clear All */}
            <div className="flex justify-end">
                <button
                    onClick={clearFilters}
                    className="text-sm text-primary hover:underline"
                >
                    Clear all filters
                </button>
            </div>
        </div>
    );
}

