// same arrays you already have
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

export default function GeneralInfo({ user }) {


  const experienceLabel =
    EXPERIENCE_LEVELS.find((item) => item.value === user.experienceLevel)?.label || "-";
  const roleLabel =
    ROLES.find((item) => item.value === user.primaryRole)?.label || "-";
  return (
    <div className="flex flex-col gap-6 w-full">

      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">General Info</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-900 border border-primary p-4 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Email</p>
          <p className="text-gray-900 dark:text-white font-semibold">{user.email}</p>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-primary p-4 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Phone</p>
          <p className="text-gray-900 dark:text-white font-semibold">{user.phone || "-"}</p>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-primary p-4 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Experience</p>
          <p className="text-gray-900 dark:text-white font-semibold">{experienceLabel}</p>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-primary p-4 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Role</p>
          <p className="text-gray-900 dark:text-white font-semibold">{roleLabel}</p>
        </div>
      </div>

    </div>
  );
}
