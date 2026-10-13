// Base URL comes from .env  ->  VITE_API_BASE_URL=http://localhost:8080
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

export class ApiError extends Error {
  constructor(status, message, fieldErrors = {}) {
    super(message);
    this.status = status;
    this.fieldErrors = fieldErrors; // matches the "errors" object in the 400 response
  }
}

async function post(path, body) {
  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new ApiError(0, "Can't reach the server. Check your connection and try again.");
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError(res.status, data.message ?? "Something went wrong. Please try again.", data.errors ?? {});
  }
  return data;
}

// POST /api/auth/register  -> 201 { message, userId, firstName, lastName, email, mobileNumber }
export const registerCustomer = (payload) => post("/api/auth/register", payload);

// POST /api/auth/login  -> 200 { message, userId, email, role, token }
export const loginCustomer = (payload) => post("/api/auth/login", payload);

// --- session helpers ---
const KEY = "bank_session";
export const saveSession = ({ token, userId, email, role }) =>
  localStorage.setItem(KEY, JSON.stringify({ token, userId, email, role }));
export const getSession = () => {
  try { return JSON.parse(localStorage.getItem(KEY)); } catch { return null; }
};
export const clearSession = () => localStorage.removeItem(KEY);
