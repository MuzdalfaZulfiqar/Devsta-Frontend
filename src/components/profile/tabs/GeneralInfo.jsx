import { useRoleMap } from "../../../hooks/useRoleMap";

export default function GeneralInfo({ user }) {
  const { formatRole } = useRoleMap();

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
          <p className="text-gray-900 dark:text-white font-semibold">{user.experienceLevel}</p>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-primary p-4 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Role</p>
          <p className="text-gray-900 dark:text-white font-semibold">{formatRole(user.primaryRole)}</p>
        </div>

        {/* BIO */}
        <div className="bg-white dark:bg-gray-900 border border-primary p-4 rounded-lg col-span-1 md:col-span-2">
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Bio</p>
          <p className="text-gray-900 dark:text-white mt-1 whitespace-pre-line">
            {user.bio || "No bio added yet"}
          </p>
        </div>

      </div>
    </div>
  );
}
