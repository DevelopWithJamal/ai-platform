const BASE = "http://localhost:7000";

function authHeader() {
  return {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json"
  };
}
export async function createClient(data) {
  const res = await fetch(`${BASE}/admin/clients`, {
    method: "POST",
    headers: authHeader(),
    body: JSON.stringify(data)
  });

  if (!res.ok) throw new Error("Create failed");
  return res.json();
}

export async function getClients() {
  const res = await fetch(`${BASE}/admin/clients`, {
    headers: authHeader()
  });
  if (!res.ok) throw new Error("Failed to load clients");
  return res.json();
}

export async function updateClient(apiKey, data) {
  const res = await fetch(`${BASE}/admin/clients/${apiKey}`, {
    method: "PUT",
    headers: authHeader(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Update failed");
  return res.json();
}
