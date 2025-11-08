// src/pages/User/CommunityExplore.jsx
import React from "react";
import DevstaAvatar from "../../components/dashboard/DevstaAvatar";

export default function CommunityExplore() {
  // Sample developers
  const developers = [
    { id: 1, name: "Alice Johnson", role: "Frontend Developer", avatar: "", skills: ["React", "Tailwind"] },
    { id: 2, name: "Bob Smith", role: "Backend Developer", avatar: "", skills: ["Node.js", "MongoDB"] },
    { id: 3, name: "Charlie Lee", role: "Fullstack Developer", avatar: "", skills: ["React", "Node.js"] },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {developers.map((dev) => (
        <div
          key={dev.id}
          className="flex items-start gap-3 p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow bg-white"
        >
          <DevstaAvatar user={dev} size={60} />
          <div>
            <h4 className="font-semibold text-lg">{dev.name}</h4>
            <p className="text-gray-500">{dev.role}</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {dev.skills.map((skill, i) => (
                <span
                  key={i}
                  className="px-2 py-1 rounded-full text-sm font-medium"
                  style={{ backgroundColor: "#e6f4f1" }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

