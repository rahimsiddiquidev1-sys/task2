// backend base url
const BASE_URL = "http://localhost:5000/api";

export async function apiRequest(path, method = "GET", body = null) {
  const token = localStorage.getItem("token");

  const options = {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (token) {
    options.headers.Authorization = "Bearer " + token;
  }

  if (body) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(BASE_URL + path, options);
  const data = await res.json();

  return { ok: res.ok, status: res.status, data };
}


export function loginUser(email, password) {
  return apiRequest("/auth/login", "POST", { email, password });
}

export function registerUser(name, email, password) {
  return apiRequest("/auth/register", "POST", { name, email, password });
}

export function getProfile() {
  return apiRequest("/profile");
}

export function getAdminDashboard() {
  return apiRequest("/admin/dashboard");
}


export function createTask(taskData) {
  return apiRequest("/tasks", "POST", taskData);
}

export function getMyTasks() {
  return apiRequest("/tasks");
}

export function getTaskById(id) {
  return apiRequest("/tasks/" + id);
}

export function updateTask(id, taskData) {
  return apiRequest("/tasks/" + id, "PUT", taskData);
}

export function deleteTask(id) {
  return apiRequest("/tasks/" + id, "DELETE");
}