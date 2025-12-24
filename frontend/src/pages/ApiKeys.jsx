import { useEffect, useState } from "react";
import { getClients, updateClient } from "../services/api";
import { createClient } from "../services/api";
export default function ApiKeys() {
  const [clients, setClients] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getClients()
      .then(setClients)
      .catch(() => setError("Failed to load API clients"));
  }, []);

  const toggleEnabled = async (client) => {
    const updated = await updateClient(client.apiKey, {
      enabled: !client.enabled
    });

    setClients(clients.map(c =>
      c.apiKey === client.apiKey ? updated.client : c
    ));
  };

  if (error) return <div className="p-6 text-red-500">{error}</div>;
      const [form, setForm] = useState({
  name: "",
  model: "mistral:7b",
  rateLimit: 5,
  maxLength: 300
});

const createNew = async () => {
  const res = await createClient(form);
  setClients([...clients, res.client]);
  setForm({ name: "", model: "mistral:7b", rateLimit: 5, maxLength: 300 });
};

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">API Manager</h1>
  <div className="mb-8 bg-white p-6 rounded-lg shadow">
  <h2 className="text-lg font-bold mb-4">Create API Key</h2>

  <div className="grid grid-cols-4 gap-4">
    <input
      placeholder="App Name"
      className="border p-2 rounded"
      value={form.name}
      onChange={e => setForm({ ...form, name: e.target.value })}
    />

    <input
      placeholder="Model"
      className="border p-2 rounded"
      value={form.model}
      onChange={e => setForm({ ...form, model: e.target.value })}
    />

    <input
      type="number"
      placeholder="Rate Limit"
      className="border p-2 rounded"
      value={form.rateLimit}
      onChange={e => setForm({ ...form, rateLimit: +e.target.value })}
    />

    <input
      type="number"
      placeholder="Max Length"
      className="border p-2 rounded"
      value={form.maxLength}
      onChange={e => setForm({ ...form, maxLength: +e.target.value })}
    />
  </div>

  <button
    onClick={createNew}
    className="mt-4 bg-slate-800 text-white px-4 py-2 rounded"
  >
    Create API Key
  </button>
</div>

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="w-full text-left">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Model</th>
              <th className="p-3">Rate</th>
              <th className="p-3">Max Length</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {clients.map(client => (
              <tr key={client.apiKey} className="border-t">
                <td className="p-3">{client.name}</td>
                <td className="p-3">{client.model}</td>
                <td className="p-3">{client.rateLimit}/min</td>
                <td className="p-3">{client.maxLength}</td>
                <td className="p-3">
                  {client.enabled ? "Enabled" : "Disabled"}
                </td>
                <td className="p-3">
                  <button
                    onClick={() => toggleEnabled(client)}
                    className="px-3 py-1 rounded bg-slate-800 text-white"
                  >
                    {client.enabled ? "Disable" : "Enable"}
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
