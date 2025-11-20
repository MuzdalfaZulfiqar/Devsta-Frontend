import GeneralInfo from "./GeneralInfo";
import Skills from "./Skills";
import Resume from "./Resume";
import GitHub from "./GitHub";
import { useNavigate } from "react-router-dom";
import { FiUser } from "react-icons/fi"; 

export default function Overview({ user }) {
  const navigate = useNavigate();


    const handleViewPublicProfile = () => {
    // Navigate to the public profile route with user ID
    navigate(`/dashboard/community/profile/${user._id}`);
  };
  return (
    <div className="flex flex-col gap-8 w-full">
<div className="flex justify-end">
  <button
    onClick={handleViewPublicProfile}
    className="
      flex items-center gap-2 px-5 py-2 rounded-full 
      bg-primary text-white font-semibold 
      shadow-md hover:shadow-lg 
      hover:bg-primary/90 transition 
      duration-300 ease-in-out
    "
  >
    <FiUser size={20} />
    View Public Profile
  </button>
</div>
      <GeneralInfo user={user} />
      <Skills user={user} />
      <Resume user={user} />
      <GitHub user={user} />

        
    </div>
  );
}
