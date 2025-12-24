import { useEffect, useState } from "react";
import {
  getClients,
  getModels,
  createClient,
  updateClient,
  regenerateKey,
  deleteClient
} from "../services/api";

export default function ApiKeys() {
  const [clients, setClients] = useState([]);
  const [models, setModels] = useState([]);
  const [form, setForm] = useState({
    name: "",
    model: "",
    rateLimit: 5,
    maxLength: 300
  });

  useEffect(() => {
    getClients().then(setClients);
    getModels().then(setModels);
  }, []);

  const create = async () => {
    const res = await createClient(form);
    setClients([...clients, res.client]);
    setForm({ name: "", model: models[0], rateLimit: 5, maxLength: 300 });
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">API Key Manager</h1>

      {/* CREATE */}
      <div className="bg-white p-6 rounded shadow mb-8 grid grid-cols-5 gap-4">
        <input placeholder="App Name" className="border p-2"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })} />

        <select className="border p-2"
          value={form.model}
          onChange={e => setForm({ ...form, model: e.target.value })}>
          <option value="">Select Model</option>
          {models.map(m => <option key={m}>{m}</option>)}
        </select>

        <input type="number" className="border p-2" placeholder="Rate"
          value={form.rateLimit}
          onChange={e => setForm({ ...form, rateLimit: +e.target.value })} />

        <input type="number" className="border p-2" placeholder="Max Length"
          value={form.maxLength}
          onChange={e => setForm({ ...form, maxLength: +e.target.value })} />

        <button onClick={create} className="bg-slate-800 text-white rounded">
          Create
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white shadow rounded overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-3">Name</th>
              <th>Model</th>
              <th>Status</th>
              <th>Key</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map(c => (
              <tr key={c.apiKey} className="border-t">
                <td className="p-3">{c.name}</td>
                <td>{c.model}</td>
                <td>{c.enabled ? "Enabled" : "Disabled"}</td>
                <td className="text-xs truncate max-w-xs">{c.apiKey}</td>
                <td className="flex gap-2 p-2">
                  <button onClick={() => updateClient(c.apiKey, { enabled: !c.enabled })}
                    className="px-2 bg-slate-700 text-white rounded">
                    Toggle
                  </button>

                  <button onClick={async () => {
                    const r = await regenerateKey(c.apiKey);
                    alert("New Key: " + r.apiKey);
                  }} className="px-2 bg-blue-600 text-white rounded">
                    Regen
                  </button>

                  <button onClick={async () => {
                    if (confirm("Delete this key?")) {
                      await deleteClient(c.apiKey);
                      setClients(clients.filter(x => x.apiKey !== c.apiKey));
                    }
                  }} className="px-2 bg-red-600 text-white rounded">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
