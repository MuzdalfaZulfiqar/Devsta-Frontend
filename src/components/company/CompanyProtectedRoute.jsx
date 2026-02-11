import { Navigate } from "react-router-dom";
import { useCompanyAuth } from "../../context/CompanyAuthContext";

export default function CompanyProtectedRoute({ children }) {
  const { token } = useCompanyAuth();

  if (!token) {
    return <Navigate to="/company/login" replace />;
  }

  return children;
}
