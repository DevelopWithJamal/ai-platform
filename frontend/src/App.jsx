import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Layouts & Components
import DashboardLayout from "./components/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Login from "./pages/Login";
import DashboardOverview from "./pages/Dashboard"; // Renamed for clarity
import ApiKeys from "./pages/ApiKeys";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- PUBLIC ROUTES --- */}
        <Route path="/login" element={<Login />} />

        {/* --- PROTECTED ROUTES (WITH SIDEBAR) --- */}
        {/* 1. We wrap the Layout in ProtectedRoute.
            2. DashboardLayout contains the <Outlet /> where children render.
        */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* Redirect "/" to "/dashboard" */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* Dashboard Overview */}
          <Route path="dashboard" element={<DashboardOverview />} />

          {/* API Keys Management */}
          <Route path="api-keys" element={<ApiKeys />} />
          
          {/* Add more protected routes here (e.g., Settings) */}
          <Route path="settings" element={<div className="p-8">Settings Page</div>} />
        </Route>

        {/* --- FALLBACK --- */}
        {/* Catch all unknown routes and send to dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}