import { useEffect, useState, useCallback } from "react";
import {
  getClients,
  getModels,
  createClient,
  updateClient,
  regenerateKey,
  deleteClient
} from "../services/api";
import {
  Copy,
  RefreshCw,
  Trash2,
  Plus,
  Key,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  ChevronDown,
  Shield,
  Search,
  Terminal
} from "lucide-react";

// --- Sub-Components ---

const Badge = ({ active }) => (
  <span
    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
      active
        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
        : "bg-slate-100 text-slate-600 border-slate-200"
    }`}
  >
    <span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-emerald-500" : "bg-slate-400"}`} />
    {active ? "Active" : "Disabled"}
  </span>
);

const IconButton = ({ icon: Icon, onClick, className, disabled, loading, title }) => (
  <button
    onClick={onClick}
    disabled={disabled || loading}
    title={title}
    className={`p-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
  >
    {loading ? <Loader2 size={16} className="animate-spin" /> : <Icon size={16} />}
  </button>
);

// --- Main Component ---

export default function ApiKeys() {
  const [clients, setClients] = useState([]);
  const [models, setModels] = useState([]);
  
  // States
  const [globalLoading, setGlobalLoading] = useState(false);
  const [processingId, setProcessingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // UI States
  const [toasts, setToasts] = useState([]);
  const [deleteModal, setDeleteModal] = useState({ open: false, apiKey: null });
  const [keyModal, setKeyModal] = useState({ open: false, newKey: null });

  // Form State
  const [form, setForm] = useState({
    name: "",
    model: "",
    rateLimit: 5,
    maxLength: 300
  });

  // Fetch Initial Data
  useEffect(() => {
    const init = async () => {
      try {
        const [cData, mData] = await Promise.all([getClients(), getModels()]);
        setClients(cData || []);
        setModels(mData || []);
      } catch (err) {
        addToast("Failed to load initial data", "error");
      }
    };
    init();
  }, []);

  // Toast System
  const addToast = useCallback((msg, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  // --- Logic ---

  const create = async () => {
    if (!form.name || !form.model) {
      addToast("App Name and Model are required", "error");
      return;
    }
    setGlobalLoading(true);
    try {
      const res = await createClient(form);
      setClients([...clients, res.client]);
      setForm({ name: "", model: models[0] || "", rateLimit: 5, maxLength: 300 });
      addToast("API Key created successfully");
    } catch (error) {
      addToast("Failed to create key", "error");
    } finally {
      setGlobalLoading(false);
    }
  };

  const toggleStatus = async (apiKey, currentStatus) => {
    setClients((prev) =>
      prev.map((c) => (c.apiKey === apiKey ? { ...c, enabled: !currentStatus } : c))
    );

    try {
      await updateClient(apiKey, { enabled: !currentStatus });
      addToast(currentStatus ? "Key disabled" : "Key activated");
    } catch (error) {
      setClients((prev) =>
        prev.map((c) => (c.apiKey === apiKey ? { ...c, enabled: currentStatus } : c))
      );
      addToast("Failed to update status", "error");
    }
  };

  const changeModel = async (apiKey, newModel) => {
    const oldModel = clients.find((c) => c.apiKey === apiKey)?.model;
    setClients((prev) =>
      prev.map((c) => (c.apiKey === apiKey ? { ...c, model: newModel } : c))
    );

    try {
      await updateClient(apiKey, { model: newModel });
      addToast(`Model updated to ${newModel}`);
    } catch (error) {
      setClients((prev) =>
        prev.map((c) => (c.apiKey === apiKey ? { ...c, model: oldModel } : c))
      );
      addToast("Failed to update model", "error");
    }
  };

  const handleRegenerate = async (apiKey) => {
    setProcessingId(apiKey);
    try {
      const r = await regenerateKey(apiKey);
      setKeyModal({ open: true, newKey: r.apiKey });
      setClients((prev) =>
        prev.map((c) => (c.apiKey === apiKey ? { ...c, apiKey: r.apiKey } : c))
      );
    } catch (e) {
      addToast("Regeneration failed", "error");
    } finally {
      setProcessingId(null);
    }
  };

  const confirmDelete = async () => {
    if (!deleteModal.apiKey) return;
    try {
      await deleteClient(deleteModal.apiKey);
      setClients(clients.filter((x) => x.apiKey !== deleteModal.apiKey));
      addToast("API Key deleted");
    } catch (e) {
      addToast("Deletion failed", "error");
    } finally {
      setDeleteModal({ open: false, apiKey: null });
    }
  };

  const copyToClipboard = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    addToast("Copied to clipboard");
  };

  // Filtering
  const filteredClients = clients.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-20">
      
      {/* --- Navbar / Header --- */}
      <div className="bg-white border-b border-slate-200 px-8 py-6 mb-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <Terminal className="text-blue-600" size={24} />
              API Access
            </h1>
            <p className="text-slate-500 text-sm mt-1">Manage secure access keys for your integrations.</p>
          </div>
          <div className="flex gap-3">
             {/* Stats or Action Buttons could go here */}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        
        {/* --- Create Key Section --- */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm mb-8 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
            <Shield size={16} className="text-blue-600" />
            <h2 className="text-sm font-semibold text-slate-700">Generate New Key</h2>
          </div>
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
            <div className="md:col-span-4">
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 ml-1">APPLICATION NAME</label>
              <input
                placeholder="e.g. Production Mobile App"
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 p-2.5 outline-none transition-all"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 ml-1">MODEL</label>
              <div className="relative">
                <select
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 p-2.5 appearance-none outline-none cursor-pointer"
                  value={form.model}
                  onChange={(e) => setForm({ ...form, model: e.target.value })}
                >
                  <option value="">Select Model</option>
                  {models.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 ml-1">RATE LIMIT</label>
              <input
                type="number"
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 p-2.5 outline-none"
                value={form.rateLimit}
                onChange={(e) => setForm({ ...form, rateLimit: +e.target.value })}
              />
            </div>

            <div className="md:col-span-3">
              <button
                onClick={create}
                disabled={globalLoading}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg text-sm px-5 py-2.5 flex justify-center items-center gap-2 transition-all shadow-md shadow-slate-200 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {globalLoading ? <Loader2 className="animate-spin" size={16} /> : <><Plus size={16} /> Create Key</>}
              </button>
            </div>
          </div>
        </div>

        {/* --- List Section --- */}
        <div className="flex flex-col gap-4">
          
          {/* Search Bar */}
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200 w-full md:w-80 shadow-sm focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-400 transition-all">
            <Search size={16} className="text-slate-400" />
            <input 
              placeholder="Search applications..." 
              className="bg-transparent border-none outline-none text-sm w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-slate-600">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Application</th>
                    <th className="px-6 py-4 font-semibold">Model Config</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold">API Key</th>
                    <th className="px-6 py-4 font-semibold text-right">Controls</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredClients.map((c) => (
                    <tr key={c.apiKey} className="hover:bg-slate-50/80 transition-colors group">
                      
                      {/* Name */}
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900">{c.name}</div>
                        <div className="text-xs text-slate-400 mt-0.5">Limit: {c.rateLimit}/s</div>
                      </td>

                      {/* Model Selector */}
                      <td className="px-6 py-4">
                         <div className="relative inline-block w-40">
                           <select
                              value={c.model}
                              onChange={(e) => changeModel(c.apiKey, e.target.value)}
                              className="w-full appearance-none bg-white border border-slate-200 text-slate-700 py-1.5 pl-3 pr-8 rounded-md text-xs font-medium cursor-pointer hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                            >
                              {models.map((m) => <option key={m} value={m}>{m}</option>)}
                            </select>
                            <ChevronDown size={12} className="absolute right-2 top-2.5 text-slate-400 pointer-events-none" />
                         </div>
                      </td>

                      {/* Status Toggle */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Badge active={c.enabled} />
                          <button
                            onClick={() => toggleStatus(c.apiKey, c.enabled)}
                            className="text-xs text-slate-400 underline hover:text-slate-600"
                          >
                            {c.enabled ? "Disable" : "Enable"}
                          </button>
                        </div>
                      </td>

                      {/* Key Display */}
                      <td className="px-6 py-4">
                        <div 
                          onClick={() => copyToClipboard(c.apiKey)}
                          className="group/key flex items-center gap-2 cursor-pointer bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded px-3 py-1.5 w-fit transition-colors"
                        >
                          <Key size={12} className="text-slate-400" />
                          <code className="text-xs font-mono text-slate-600">
                            {c.apiKey.substring(0, 12)}••••••••
                          </code>
                          <Copy size={12} className="text-slate-400 opacity-0 group-hover/key:opacity-100 transition-opacity" />
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <IconButton 
                            icon={RefreshCw} 
                            onClick={() => handleRegenerate(c.apiKey)}
                            loading={processingId === c.apiKey}
                            className="hover:bg-blue-50 hover:text-blue-600 text-slate-400"
                            title="Regenerate Key"
                          />
                          <IconButton 
                            icon={Trash2} 
                            onClick={() => setDeleteModal({ open: true, apiKey: c.apiKey })}
                            className="hover:bg-red-50 hover:text-red-600 text-slate-400"
                            title="Revoke Key"
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredClients.length === 0 && !globalLoading && (
                <div className="p-16 text-center text-slate-400 flex flex-col items-center gap-3">
                  <div className="bg-slate-50 p-4 rounded-full mb-2">
                    <Key size={32} className="text-slate-300" />
                  </div>
                  <h3 className="text-slate-900 font-medium">No API keys found</h3>
                  <p className="text-sm">Create a new key above to get started.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --- Portals / Modals --- */}

      {/* Toast Notifications */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg shadow-xl border animate-slide-up bg-white min-w-[300px] ${
              t.type === "error" ? "border-red-100" : "border-slate-100"
            }`}
          >
            {t.type === "error" ? (
              <AlertCircle size={20} className="text-red-500" />
            ) : (
              <CheckCircle size={20} className="text-emerald-500" />
            )}
            <div className="flex-1">
              <h4 className={`text-sm font-semibold ${t.type === "error" ? "text-red-600" : "text-slate-800"}`}>
                {t.type === "error" ? "Error" : "Success"}
              </h4>
              <p className="text-xs text-slate-500">{t.msg}</p>
            </div>
            <button
              onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
              className="text-slate-400 hover:text-slate-600"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Delete Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 animate-scale-in border border-slate-100">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="bg-red-50 p-3 rounded-full mb-4 text-red-600">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Revoke API Key?</h3>
              <p className="text-slate-500 text-sm mt-2">
                This action is irreversible. Any applications using this key will immediately lose access.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setDeleteModal({ open: false, apiKey: null })}
                className="px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-colors"
              >
                Yes, Revoke
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Key Success Modal */}
      {keyModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-scale-in border border-slate-100">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle className="text-emerald-500" size={20} />
                  Key Regenerated
                </h3>
                <p className="text-slate-500 text-sm mt-1">
                  Your old key has been invalidated.
                </p>
              </div>
              <button onClick={() => setKeyModal({ open: false, newKey: null })} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <div 
              className="bg-slate-900 rounded-lg p-4 flex items-center justify-between mb-6 group cursor-pointer hover:ring-2 hover:ring-offset-2 hover:ring-slate-900 transition-all"
              onClick={() => copyToClipboard(keyModal.newKey)}
            >
              <div className="overflow-hidden">
                <p className="text-xs text-slate-400 mb-1 uppercase tracking-wider font-semibold">New API Key</p>
                <code className="text-sm font-mono text-emerald-400 break-all">{keyModal.newKey}</code>
              </div>
              <Copy size={18} className="text-slate-400 group-hover:text-white transition-colors" />
            </div>

            <button
              onClick={() => setKeyModal({ open: false, newKey: null })}
              className="w-full py-2.5 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-lg shadow-slate-200"
            >
              I have copied the key
            </button>
          </div>
        </div>
      )}

    </div>
  );
}