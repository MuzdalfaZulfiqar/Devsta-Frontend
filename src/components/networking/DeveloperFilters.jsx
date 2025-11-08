// // components/networking/DeveloperFilters.jsx
// import React from "react";
// import Select from "react-select";

// export default function DeveloperFilters({ filters, setFilters, clearFilters }) {
//   const selectStyles = {
//     control: (base, state) => ({
//       ...base,
//       backgroundColor: "transparent",
//       borderColor: state.isFocused ? "#086972" : "#d1d5db",
//       borderRadius: "0.5rem",
//       boxShadow: "none",
//       "&:hover": { borderColor: "#086972" },
//       minHeight: "42px",
//     }),
//     menu: (base) => ({
//       ...base,
//       backgroundColor: "#fff",
//       color: "#000",
//       zIndex: 50
//     }),
//     option: (base, state) => ({
//       ...base,
//       backgroundColor: state.isSelected
//         ? "#086972"
//         : state.isFocused
//         ? "#e6f4f1"
//         : "#fff",
//       color: state.isSelected ? "#fff" : "#000",
//     }),
//     singleValue: (base) => ({ ...base, color: "#086972" }),
//   };

//   return (
//     <aside
//       className="
//         w-64 flex-shrink-0 p-4 rounded-xl bg-white dark:bg-[#0a0a0a]
//         border dark:border-gray-700 space-y-4 shadow-sm
//         sticky top-4 self-start
//       "
//     >
//       <div className="flex justify-between items-center">
//         <h3 className="font-semibold text-lg">Filters</h3>
//         <button
//           onClick={clearFilters}
//           className="text-red-500 text-sm hover:underline"
//         >
//           Clear All
//         </button>
//       </div>

//       <input
//         type="text"
//         placeholder="Name"
//         value={filters.name}
//         onChange={(e) => setFilters((p) => ({ ...p, name: e.target.value }))}
//         className="w-full px-3 py-2 rounded-lg border dark:border-gray-700 dark:bg-[#0a0a0a]"
//       />

//       <input
//         type="text"
//         placeholder="Role"
//         value={filters.role}
//         onChange={(e) => setFilters((p) => ({ ...p, role: e.target.value }))}
//         className="w-full px-3 py-2 rounded-lg border dark:border-gray-700 dark:bg-[#0a0a0a]"
//       />

//       <input
//         type="text"
//         placeholder="Skill"
//         value={filters.skill}
//         onChange={(e) => setFilters((p) => ({ ...p, skill: e.target.value }))}
//         className="w-full px-3 py-2 rounded-lg border dark:border-gray-700 dark:bg-[#0a0a0a]"
//       />

//       <Select
//         value={
//           filters.experience
//             ? {
//                 value: filters.experience,
//                 label: filters.experience.charAt(0).toUpperCase() + filters.experience.slice(1),
//               }
//             : null
//         }
//         onChange={(opt) =>
//           setFilters((p) => ({ ...p, experience: opt?.value || "" }))
//         }
//         options={[
//           { value: "student", label: "Student" },
//           { value: "intern", label: "Intern" },
//           { value: "junior", label: "Junior" },
//           { value: "mid", label: "Mid-Level" },
//           { value: "senior", label: "Senior" },
//           { value: "lead", label: "Lead" },
//         ]}
//         placeholder="Select Experience"
//         styles={selectStyles}
//       />

//       <Select
//         value={
//           filters.sort
//             ? {
//                 value: filters.sort,
//                 label: filters.sort.charAt(0).toUpperCase() + filters.sort.slice(1),
//               }
//             : null
//         }
//         onChange={(opt) =>
//           setFilters((p) => ({ ...p, sort: opt?.value || "recent" }))
//         }
//         options={[
//           { value: "recent", label: "Most Recent" },
//           { value: "name", label: "Name" },
//           { value: "role", label: "Role" },
//         ]}
//         placeholder="Sort By"
//         styles={selectStyles}
//       />
//     </aside>
//   );
// }


// components/networking/DeveloperFilters.jsx
import React from "react";
import Select from "react-select";

export default function DeveloperFilters({ filters, setFilters, clearFilters, compact = false }) {
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
    menu: (base) => ({ ...base, backgroundColor: "#fff", color: "#000", zIndex: 50 }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? "#086972" : state.isFocused ? "#e6f4f1" : "#fff",
      color: state.isSelected ? "#fff" : "#000",
    }),
    singleValue: (base) => ({ ...base, color: "#086972" }),
  };

  return (
    <aside className="w-[311px] flex-shrink-0 p-4 rounded-xl bg-white dark:bg-[#0a0a0a] border dark:border-gray-700 space-y-4 shadow-sm sticky top-4 self-start">
      <h3 className="font-semibold text-lg">Filters</h3>

      {/* Name search – always visible */}
      <input
        type="text"
        placeholder="Search Name"
        value={filters.name}
        onChange={(e) => setFilters((p) => ({ ...p, name: e.target.value }))}
        className="w-full px-3 py-2 rounded-lg border dark:border-gray-700 dark:bg-[#0a0a0a]"
      />

      {/* Full filters only if NOT compact */}
      {!compact && (
        <>
          <input
            type="text"
            placeholder="Role"
            value={filters.role}
            onChange={(e) => setFilters((p) => ({ ...p, role: e.target.value }))}
            className="w-full px-3 py-2 rounded-lg border dark:border-gray-700 dark:bg-[#0a0a0a]"
          />

          <input
            type="text"
            placeholder="Skill"
            value={filters.skill}
            onChange={(e) => setFilters((p) => ({ ...p, skill: e.target.value }))}
            className="w-full px-3 py-2 rounded-lg border dark:border-gray-700 dark:bg-[#0a0a0a]"
          />

          <Select
            value={
              filters.experience
                ? { value: filters.experience, label: filters.experience.charAt(0).toUpperCase() + filters.experience.slice(1) }
                : null
            }
            onChange={(opt) => setFilters((p) => ({ ...p, experience: opt?.value || "" }))}
            options={[
              { value: "student", label: "Student" },
              { value: "intern", label: "Intern" },
              { value: "junior", label: "Junior" },
              { value: "mid", label: "Mid-Level" },
              { value: "senior", label: "Senior" },
              { value: "lead", label: "Lead" },
            ]}
            placeholder="Select Experience"
            styles={selectStyles}
          />

          <Select
            value={
              filters.sort
                ? { value: filters.sort, label: filters.sort.charAt(0).toUpperCase() + filters.sort.slice(1) }
                : null
            }
            onChange={(opt) => setFilters((p) => ({ ...p, sort: opt?.value || "recent" }))}
            options={[
              { value: "recent", label: "Most Recent" },
              { value: "name", label: "Name" },
              { value: "role", label: "Role" },
            ]}
            placeholder="Sort By"
            styles={selectStyles}
          />

          <button
            onClick={clearFilters}
            className="text-red-500 text-sm hover:underline mt-1"
          >
            Clear All
          </button>
        </>
      )}
    </aside>
  );
}
