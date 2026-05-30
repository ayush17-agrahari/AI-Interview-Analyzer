import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation
} from "react-router-dom";

// ✅ IMPORTS (NO CURLY BRACES)
import Login from "./pages/Login";
import Register from "./pages/Register";
import Interview from "./pages/Interview";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload"; // ✅ IMPORTANT
import Navbar from "./components/Navbar";

// 🔐 Protected Route
function PrivateRoute({ children }) {
  const user = localStorage.getItem("user");
  return user ? children : <Navigate to="/" />;
}

// 🔥 Layout with Navbar control
function Layout() {
  const location = useLocation();
  const user = localStorage.getItem("user");

  const hideNavbarRoutes = ["/", "/register"];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {user && !shouldHideNavbar && <Navbar />}

      <Routes>
        {/* Login */}
        <Route path="/" element={<Login />} />

        {/* Register */}
        <Route path="/register" element={<Register />} />

        {/* Upload */}
        <Route
          path="/upload"
          element={
            <PrivateRoute>
              <Upload />
            </PrivateRoute>
          }
        />

        {/* Interview */}
        <Route
          path="/interview"
          element={
            <PrivateRoute>
              <Interview />
            </PrivateRoute>
          }
        />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

// 🚀 Main App
function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;