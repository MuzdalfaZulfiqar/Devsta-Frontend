import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/User/Login";
import Signup from "./pages/User/Signup";
import Dashboard from "./pages/User/Dashboard";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-black text-white">
        <Routes>
          {/* <Route path="/" element={<Login />} /> */}
          <Route path="/" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Catch-all route for OAuth callbacks */}
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
