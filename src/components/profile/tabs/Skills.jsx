export default function Skills({ user }) {
  return (
    <div className="flex flex-col gap-6 w-full">
      {/* <h2 className="text-lg font-semibold text-white">Skills</h2>

      {user.topSkills.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {user.topSkills.map((skill) => (
            <div
              key={skill}
              className="bg-black border border-primary px-3 py-2 rounded-full text-center text-sm font-medium text-primary"
            >
              {skill}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400">No skills added</p>
      )} */}


      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Skills</h2>

{user.topSkills.length > 0 ? (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
    {user.topSkills.map((skill) => (
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
  );
}
