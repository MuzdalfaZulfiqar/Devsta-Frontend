// // src/components/DashboardCard.jsx
// export default function DashboardCard({ title, description, actionLabel, onAction }) {
//   return (
//     <div className="border border-white/20 rounded-xl p-5 flex items-center justify-between bg-transparent hover:border-white/40 transition-colors">
//       {/* Left side: title + description */}
//       <div>
//         <h3 className="text-lg font-semibold text-white">{title}</h3>
//         <p className="text-gray-400 text-sm">{description}</p>
//       </div>

//       {/* Right side: action button */}
//       {actionLabel && (
//         <button
//           onClick={onAction}
//           className="ml-4 px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90"
//         >
//           {actionLabel}
//         </button>
//       )}
//     </div>
//   );
// }


// File: src/components/DashboardCard.jsx
export default function DashboardCard({ title, description, actionLabel, onAction }) {
  return (
    <div className="border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-[#0a0a0a] 
      rounded-2xl p-5 flex items-center justify-between hover:border-primary/60 transition-colors duration-300 shadow-sm dark:shadow-none">
      
      {/* Left Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white tracking-wide">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{description}</p>
      </div>

      {/* Right Action Button */}
      {actionLabel && (
        <button
          onClick={onAction}
          className="ml-4 px-4 py-2 bg-primary text-white rounded-xl font-semibold 
            hover:bg-primary/80 transition-colors duration-200"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
