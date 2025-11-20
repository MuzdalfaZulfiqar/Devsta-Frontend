// src/components/common/BackButton.jsx
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function BackButton({ onClick }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(-1);
    }
  };

  return (
   // Instead of fixed, just keep it relative inside the container
<button
   onClick={handleClick}
   className="
     flex items-center gap-2 
     bg-white bg-opacity-80 backdrop-blur-md 
     border border-gray-200 rounded-full 
     px-4 py-2 shadow-md
     hover:bg-primary hover:text-white transition-colors
     hover:scale-105
     focus:outline-none
   "
>
   <FiArrowLeft size={20} />
   <span className="font-medium">Back</span>
</button>

  );
}
