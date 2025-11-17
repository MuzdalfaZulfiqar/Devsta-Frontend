import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import AuthProvider, { useAuth } from "./context/AuthContext"; 
import { NotificationProvider } from "./context/NotificationContext.jsx";
import { ConnectionProvider } from "./context/ConnectionContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ConnectionProvider>
        <NotificationProvider>
          <App />
        </NotificationProvider>
        </ConnectionProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
