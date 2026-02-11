// src/context/CompanyAuthContext.jsx
import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const CompanyAuthContext = createContext();

export function useCompanyAuth() {
  return useContext(CompanyAuthContext);
}

export default function CompanyAuthProvider({ children }) {
  const navigate = useNavigate();

  const [token, setToken] = useState(
    localStorage.getItem("companyToken")
  );

  const login = (token, company) => {
    localStorage.setItem("companyToken", token);
    localStorage.setItem("companyInfo", JSON.stringify(company));
    setToken(token);
    navigate("/company/dashboard");
  };

  const logout = () => {
    localStorage.removeItem("companyToken");
    localStorage.removeItem("companyInfo");
    setToken(null);
    navigate("/company/login");
  };

  return (
    <CompanyAuthContext.Provider value={{ token, login, logout }}>
      {children}
    </CompanyAuthContext.Provider>
  );
}
