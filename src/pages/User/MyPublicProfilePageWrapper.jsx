import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import MyPublicProfile from "./MyPublicProfile";

export default function MyPublicProfilePageWrapper() {
  const { user } = useAuth();

  return (
    <DashboardLayout user={user}>
      <MyPublicProfile />
    </DashboardLayout>
  );
}
