import { useAuth } from "../../context/AuthContext";
import ProfileLayout from "../../components/profile/ProfileLayout";

import GeneralInfo from "../../components/profile/tabs/GeneralInfo";
import Skills from "../../components/profile/tabs/Skills";
import Resume from "../../components/profile/tabs/Resume";
import GitHub from "../../components/profile/tabs/GitHub";

export default function ProfilePage() {
  const { user } = useAuth();

  const renderTabContent = (activeTab) => {
    switch (activeTab) {
      case "general":
        return <GeneralInfo user={user} />;
      case "skills":
        return <Skills user={user} />;
      case "resume":
        return <Resume user={user} />;
      case "github":
        return <GitHub user={user} />;
      default:
        return null;
    }
  };

  return <ProfileLayout user={user}>{renderTabContent}</ProfileLayout>;
}
