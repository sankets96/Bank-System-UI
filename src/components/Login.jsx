import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import FormField from "./FormField";
import ForgotPasswordModal from "./ForgotPasswordModal";
import { ApiError } from "../api/http";
import { loginCustomer, saveSession } from "../api/authApi";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function Spinner() {
  return <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />;
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const justRegistered = location.state?.registered;

  const [form, setForm] = useState({ email: location.state?.email ?? "", password: "" });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);

  const update = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((er) => ({ ...er, [field]: undefined }));
    setFormError("");
  };

  const validate = () => {
    const er = {};
    if (!form.email.trim()) er.email = "Email is required";
    else if (!EMAIL_RE.test(form.email.trim())) er.email = "Invalid email format";
    if (!form.password) er.password = "Password is required";
    return er;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const er = validate();
    setErrors(er);
    if (Object.keys(er).length) return;

    setLoading(true);
    setFormError("");
    try {
      const data = await loginCustomer({ email: form.email.trim(), password: form.password });
      saveSession(data);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      if (err instanceof ApiError && err.status === 400) setErrors(err.fieldErrors);
      else setFormError(err.message); // 401 -> "Invalid email or password"
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AuthLayout
        title="Welcome back"
        subtitle="Log in to see your accounts and manage your money."
        footer={
          <div className="flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-x-6">
            <span>
              New here?{" "}
              <Link to="/register" className="font-semibold text-forest underline underline-offset-4 hover:text-forest-deep">
                Create an account
              </Link>
            </span>
            <button
              type="button"
              onClick={() => setForgotOpen(true)}
              className="font-semibold text-forest underline underline-offset-4 hover:text-forest-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
            >
              Forgot password?
            </button>
          </div>
        }
      >
        {justRegistered && (
          <div role="status" className="mb-6 rounded-lg border border-forest/25 bg-forest/10 px-4 py-3 text-sm text-forest-deep">
            Your account is ready. Log in to continue.
          </div>
        )}
        {formError && (
          <div role="alert" className="mb-6 rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
            {formError}
          </div>
        )}

        <form onSubmit={onSubmit} noValidate className="space-y-5">
          <FormField
            id="email" label="Email" type="email" autoComplete="email" inputMode="email"
            placeholder="you@example.com" value={form.email} onChange={update("email")} error={errors.email}
          />
          <FormField
            id="password" label="Password" type="password" autoComplete="current-password"
            placeholder="Enter your password" value={form.password} onChange={update("password")} error={errors.password}
          />

          <button
            type="submit"
            disabled={loading}
            className="flex h-12 w-full items-center justify-center gap-2.5 rounded-lg bg-forest font-semibold text-white transition hover:bg-forest-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading && <Spinner />}
            {loading ? "Logging in…" : "Log in"}
          </button>
        </form>
      </AuthLayout>

      {forgotOpen && (
        <ForgotPasswordModal onClose={() => setForgotOpen(false)} initialEmail={form.email} />
      )}
    </>
  );
}
