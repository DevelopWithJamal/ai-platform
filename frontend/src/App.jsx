import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Layout & Middleware
import DashboardLayout from "./components/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Login from "./pages/Login";
import DashboardOverview from "./pages/Dashboard"; 
import ApiKeys from "./pages/ApiKeys";
import Docs from "./pages/Docs";  // ← Add Docs page

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ---------- PUBLIC ROUTES ---------- */}
        <Route path="/login" element={<Login />} />

        {/* ---------- PROTECTED ROUTES WITH DASHBOARD LAYOUT ---------- */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          <Route path="/dashboard" element={<DashboardOverview />} />
          <Route path="/api-keys" element={<ApiKeys />} />
          <Route path="/docs" element={<Docs />} /> {/* NEW */}
          <Route path="/settings" element={<div className="p-8 text-white">Settings Page</div>} />
        </Route>

        {/* ---------- CATCH ALL ROUTES ---------- */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />

      </Routes>
    </BrowserRouter>
  );
}
