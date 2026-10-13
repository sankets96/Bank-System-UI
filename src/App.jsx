import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import { clearSession, getSession } from "./api/authApi";

// Replace with your real dashboard later
function Dashboard() {
  const navigate = useNavigate();
  const session = getSession();
  if (!session?.token) return <Navigate to="/login" replace />;
  return (
    <div className="grid min-h-screen place-items-center bg-paper p-6 text-center">
      <div>
        <h1 className="font-display text-3xl font-bold text-ink">Signed in as {session.email}</h1>
        <p className="mt-2 text-ink/65">Role: {session.role}</p>
        <button
          onClick={() => { clearSession(); navigate("/login"); }}
          className="mt-6 h-11 rounded-lg bg-forest px-6 font-semibold text-white hover:bg-forest-deep"
        >
          Log out
        </button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
