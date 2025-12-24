import { useEffect, useState } from "react";

export default function Dashboard() {
  const [status, setStatus] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:7000/admin/status", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then(data => setStatus(data))
      .catch(() => setError("Failed to load admin status"));
  }, []);

  if (error) {
    return <div className="p-8 text-red-500">{error}</div>;
  }

  if (!status) {
    return <div className="p-8">Loading dashboard...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      <div className="bg-white shadow rounded-lg p-6 max-w-md">
        <p className="mb-2">
          <strong>Status:</strong> {status.status}
        </p>
        <p className="mb-2">
          <strong>AI:</strong> {status.ai}
        </p>
        <p className="text-slate-600">{status.message}</p>
      </div>
    </div>
  );
}
