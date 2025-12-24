import { Server, Bot, MessageSquare, Activity } from "lucide-react";

export default function Dashboard({ status }) {
  // Fallback for demo purposes if props aren't loaded yet
  const data = status || { status: "Online", ai: "Active", message: "System operating normally." };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Overview</h1>
            <p className="text-slate-500 text-sm mt-1">Real-time performance metrics.</p>
          </div>
          <span className="flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-600 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Live Updates
          </span>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Server Status */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Server Status</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-2">{data.status}</h3>
              </div>
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100 transition-colors">
                <Server size={20} />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
               <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                 99.9% Uptime
               </span>
            </div>
          </div>

          {/* Card 2: AI Engine */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">AI Engine</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-2">{data.ai}</h3>
              </div>
              <div className="p-2 bg-purple-50 text-purple-600 rounded-lg group-hover:bg-purple-100 transition-colors">
                <Bot size={20} />
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div className="bg-purple-500 h-1.5 rounded-full w-[85%]"></div>
              </div>
              <p className="text-[10px] text-slate-400 mt-1 text-right">Load: 85%</p>
            </div>
          </div>

          {/* Card 3: System Message */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group md:col-span-1">
            <div className="flex items-start justify-between mb-2">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Latest Log</p>
              <Activity size={16} className="text-slate-400" />
            </div>
            <div className="flex gap-3 mt-3">
              <div className="mt-1 min-w-[3px] rounded-full bg-slate-300 h-10"></div>
              <div>
                <p className="text-sm text-slate-700 font-medium leading-relaxed">
                  "{data.message}"
                </p>
                <p className="text-xs text-slate-400 mt-2">Just now</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}