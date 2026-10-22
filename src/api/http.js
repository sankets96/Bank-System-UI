// Global HTTP helpers — use these from any API module instead of calling fetch.
// Base URL is always read from the .env file (VITE_API_BASE_URL). No static fallback.
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!BASE_URL) {
  throw new Error("VITE_API_BASE_URL is missing. Add it to your .env file.");
}

export class ApiError extends Error {
  constructor(status, message, fieldErrors = {}) {
    super(message);
    this.status = status;
    this.fieldErrors = fieldErrors; // matches the "errors" object in the 400 response
  }
}

async function request(method, path, body) {
  const options = { method, headers: {} };
  if (body !== undefined) {
    options.headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(body);
  }

  let res;
  try {
    res = await fetch(`${BASE_URL.replace(/\/$/, "")}${path}`, options);
  } catch {
    throw new ApiError(0, "Can't reach the server. Check your connection and try again.");
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError(res.status, data.message ?? "Something went wrong. Please try again.", data.errors ?? {});
  }
  return data;
}

export const get = (path) => request("GET", path);
export const post = (path, body) => request("POST", path, body);
export const put = (path, body) => request("PUT", path, body);
export const patch = (path, body) => request("PATCH", path, body);
export const del = (path) => request("DELETE", path);
