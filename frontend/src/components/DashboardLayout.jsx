import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Key, 
  Settings, 
  LogOut, 
  Bell,
  UserCircle
} from "lucide-react";

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { label: "Overview", path: "/", icon: LayoutDashboard },
    { label: "API Keys", path: "/api-keys", icon: Key },
    { label: "Settings", path: "/settings", icon: Settings },
  ];

  const isActive = (path) => location.pathname === path;

  const handleSignOut = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col fixed h-full inset-y-0 left-0 z-10 transition-transform">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold tracking-wider text-blue-400">ADMIN<span className="text-white">PANEL</span></h1>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                isActive(item.path)
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-900/50"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleSignOut}
            className="flex items-center gap-3 px-4 py-3 w-full text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg text-sm font-medium transition-colors"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 ml-64 flex flex-col">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <h2 className="text-lg font-semibold text-slate-800">
            {navItems.find(i => isActive(i.path))?.label || "Dashboard"}
          </h2>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-full relative transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <div className="flex items-center gap-2 pl-4 border-l border-slate-200">
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium text-slate-700">Admin User</p>
                <p className="text-xs text-slate-500">Super Admin</p>
              </div>
              <UserCircle size={32} className="text-slate-300" />
            </div>
          </div>
        </header>

        <main className="p-8">
          <Outlet /> 
        </main>
      </div>
    </div>
  );
}