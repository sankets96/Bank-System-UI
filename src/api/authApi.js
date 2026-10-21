import { post } from "./http";

// POST /api/auth/register  -> 201 { message, userId, firstName, lastName, email, mobileNumber }
export const registerCustomer = (payload) => post("/api/auth/register", payload);

// POST /api/auth/login  -> 200 { message, userId, email, role, token }
export const loginCustomer = (payload) => post("/api/auth/login", payload);

// POST /api/auth/forgot-password  -> 200 { message }
export const requestPasswordReset = (payload) => post("/api/auth/forgot-password", payload);

// --- session helpers ---
const KEY = "bank_session";
export const saveSession = ({ token, userId, email, role }) =>
  localStorage.setItem(KEY, JSON.stringify({ token, userId, email, role }));
export const getSession = () => {
  try { return JSON.parse(localStorage.getItem(KEY)); } catch { return null; }
};
export const clearSession = () => localStorage.removeItem(KEY);
