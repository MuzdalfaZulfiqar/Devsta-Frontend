import { Bell } from "lucide-react";
import { useState } from "react";

export default function AdminTopbar({ analytics }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white dark:bg-black border-b border-primary/20 px-6 h-16 flex justify-end items-center font-fragment text-gray-800 dark:text-white">
      <button
        onClick={() => setOpen((p) => !p)}
        className="relative focus:outline-none"
      >
        <Bell className="w-6 h-6 text-gray-600 dark:text-gray-300 hover:text-primary" />
        {analytics.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-primary text-xs rounded-full px-1 text-white">
            {analytics.length}
          </span>
        )}
      </button>
      {/* Dropdown for notifications */}
      {/* {open && (
        <div className="absolute right-0 top-12 w-72 bg-white dark:bg-gray-900 border border-primary/20 rounded-lg shadow-lg z-50">
          {analytics.length === 0 ? (
            <p className="p-4 text-sm text-gray-500 dark:text-gray-400">No alerts</p>
          ) : (
            <ul className="max-h-60 overflow-y-auto">
              {analytics.map((a, idx) => (
                <li key={idx} className="p-3 border-b border-gray-200 dark:border-gray-800 text-sm">
                  {a.message || JSON.stringify(a)}
                </li>
              ))}
            </ul>
          )}
        </div>
      )} */}
    </div>
  );
}
