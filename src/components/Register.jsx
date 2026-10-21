import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import FormField from "./FormField";
import { ApiError } from "../api/http";
import { registerCustomer } from "../api/authApi";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MOBILE_RE = /^[6-9]\d{9}$/; // 10-digit Indian mobile number

const PASSWORD_RULES = [
  { id: "len", label: "At least 8 characters", test: (p) => p.length >= 8 },
  { id: "upper", label: "One uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { id: "lower", label: "One lowercase letter", test: (p) => /[a-z]/.test(p) },
  { id: "num", label: "One number", test: (p) => /\d/.test(p) },
  { id: "sym", label: "One symbol (e.g. @ # $ !)", test: (p) => /[^A-Za-z0-9]/.test(p) },
];

function Spinner() {
  return <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />;
}

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", mobileNumber: "", password: "",
  });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (field) => (e) => {
    let value = e.target.value;
    if (field === "mobileNumber") value = value.replace(/\D/g, "").slice(0, 10);
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((er) => ({ ...er, [field]: undefined }));
    setFormError("");
  };

  const validate = () => {
    const er = {};
    if (!form.firstName.trim()) er.firstName = "First name is required";
    if (!form.lastName.trim()) er.lastName = "Last name is required";
    if (!form.email.trim()) er.email = "Email is required";
    else if (!EMAIL_RE.test(form.email.trim())) er.email = "Invalid email format";
    if (!form.mobileNumber) er.mobileNumber = "Mobile number is required";
    else if (!MOBILE_RE.test(form.mobileNumber)) er.mobileNumber = "Enter a valid 10-digit mobile number";
    if (!form.password) er.password = "Password is required";
    else if (!PASSWORD_RULES.every((r) => r.test(form.password))) er.password = "Password doesn't meet all the requirements below";
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
      await registerCustomer({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        mobileNumber: form.mobileNumber,
        password: form.password,
      });
      navigate("/login", { state: { registered: true, email: form.email.trim() } });
    } catch (err) {
      if (err instanceof ApiError && err.status === 400) {
        setErrors(err.fieldErrors);
      } else if (err instanceof ApiError && err.status === 409) {
        // "Email already registered" / "Mobile number already registered"
        if (/mobile/i.test(err.message)) setErrors({ mobileNumber: err.message });
        else setErrors({ email: err.message });
      } else {
        setFormError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Open your account"
      subtitle="It takes about a minute. You'll need your email and mobile number."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-forest underline underline-offset-4 hover:text-forest-deep">
            Log in
          </Link>
        </>
      }
    >
      {formError && (
        <div role="alert" className="mb-6 rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          {formError}
        </div>
      )}

      <form onSubmit={onSubmit} noValidate className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField id="firstName" label="First name" autoComplete="given-name"
            value={form.firstName} onChange={update("firstName")} error={errors.firstName} />
          <FormField id="lastName" label="Last name" autoComplete="family-name"
            value={form.lastName} onChange={update("lastName")} error={errors.lastName} />
        </div>

        <FormField id="email" label="Email" type="email" autoComplete="email" inputMode="email"
          placeholder="you@example.com" value={form.email} onChange={update("email")} error={errors.email} />

        <FormField id="mobileNumber" label="Mobile number" type="tel" autoComplete="tel-national" inputMode="numeric"
          placeholder="9876543210" value={form.mobileNumber} onChange={update("mobileNumber")} error={errors.mobileNumber} />

        <div>
          <FormField id="password" label="Password" type="password" autoComplete="new-password"
            placeholder="Create a password" value={form.password} onChange={update("password")} error={errors.password} />
          <ul className="mt-3 grid gap-x-4 gap-y-1.5 text-sm sm:grid-cols-2" aria-label="Password requirements">
            {PASSWORD_RULES.map((r) => {
              const ok = r.test(form.password);
              return (
                <li key={r.id} className={`flex items-center gap-2 ${ok ? "text-forest" : "text-ink/55"}`}>
                  <span
                    aria-hidden="true"
                    className={`grid h-4 w-4 place-items-center rounded-full text-[10px] leading-none ${
                      ok ? "bg-forest text-white" : "border border-ink/30"
                    }`}
                  >
                    {ok ? "✓" : ""}
                  </span>
                  <span>{r.label}<span className="sr-only">{ok ? " – met" : " – not met"}</span></span>
                </li>
              );
            })}
          </ul>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex h-12 w-full items-center justify-center gap-2.5 rounded-lg bg-forest font-semibold text-white transition hover:bg-forest-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading && <Spinner />}
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>
    </AuthLayout>
  );
}
