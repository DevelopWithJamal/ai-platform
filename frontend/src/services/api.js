const BASE = import.meta.env.VITE_API_BASE_URL;

function authHeader() {
  return {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json"
  };
}

export const getClients = async () =>
  fetch(`${BASE}/admin/clients`, { headers: authHeader() }).then(r => r.json());

export const getModels = async () =>
  fetch(`${BASE}/admin/clients/models`, { headers: authHeader() }).then(r => r.json());

export const createClient = async (data) =>
  fetch(`${BASE}/admin/clients`, {
    method: "POST",
    headers: authHeader(),
    body: JSON.stringify(data)
  }).then(r => r.json());

export const updateClient = async (key, data) =>
  fetch(`${BASE}/admin/clients/${key}`, {
    method: "PUT",
    headers: authHeader(),
    body: JSON.stringify(data)
  }).then(r => r.json());

export const regenerateKey = async (key) =>
  fetch(`${BASE}/admin/clients/${key}/regenerate`, {
    method: "PUT",
    headers: authHeader()
  }).then(r => r.json());

export const deleteClient = async (key) =>
  fetch(`${BASE}/admin/clients/${key}`, {
    method: "DELETE",
    headers: authHeader()
  }).then(r => r.json());
