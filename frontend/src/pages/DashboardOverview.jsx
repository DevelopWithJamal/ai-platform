import { useEffect, useState } from "react";
import { Server, Cpu, Activity, AlertCircle } from "lucide-react";

// Helper to get ENV variable safely
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:7000";

export default function DashboardOverview() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/admin/status`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!res.ok) throw new Error("Unauthorized access or server error");
        const result = await res.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, []);

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-center gap-4 text-red-700">
        <AlertCircle size={24} />
        <div>
          <h3 className="font-bold">Failed to load dashboard</h3>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  // SKELETON LOADING STATE
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-slate-200 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Card 1: System Status */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">System Status</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-2">{data?.status || "Unknown"}</h3>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 mt-2 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Operational
            </span>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <Server size={24} />
          </div>
        </div>

        {/* Card 2: AI Status */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">AI Engine</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-2">{data?.ai || "Inactive"}</h3>
            <p className="text-xs text-slate-400 mt-2">Model v2.5-turbo</p>
          </div>
          <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
            <Cpu size={24} />
          </div>
        </div>

        {/* Card 3: Health / Message */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">System Message</p>
            <p className="text-sm font-medium text-slate-700 mt-2 leading-relaxed">
              "{data?.message || "No system messages at this time."}"
            </p>
          </div>
          <div className="p-3 bg-orange-50 text-orange-600 rounded-lg">
            <Activity size={24} />
          </div>
        </div>
      </div>
    </div>
  );
}