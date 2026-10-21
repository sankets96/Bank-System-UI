import { useEffect, useRef, useState } from "react";
import FormField from "./FormField";
import { ApiError } from "../api/http";
import { requestPasswordReset } from "../api/authApi";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function Spinner() {
  return <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />;
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-7 w-7" aria-hidden="true">
      <path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" aria-hidden="true">
      <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
    </svg>
  );
}

export default function ForgotPasswordModal({ onClose, initialEmail = "" }) {
  const [email, setEmail] = useState(initialEmail);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const panelRef = useRef(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeRef.current();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const items = Array.from(panelRef.current.querySelectorAll(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null
      );
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKeyDown);
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
    };
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    const value = email.trim();
    if (!value) {
      setError("Email is required");
      return;
    }
    if (!EMAIL_RE.test(value)) {
      setError("Enter a valid email address");
      return;
    }

    setError("");
    setFormError("");
    setLoading(true);
    try {
      await requestPasswordReset({ email: value });
      setEmail(value);
      setSent(true);
    } catch (err) {
      if (err instanceof ApiError && err.status === 400) {
        setError(err.fieldErrors.email ?? err.message);
      } else {
        setFormError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/50 p-3 backdrop-blur-sm sm:items-center sm:p-6"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) closeRef.current();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="forgot-title"
        aria-describedby={sent ? "forgot-sent" : "forgot-desc"}
        className="relative max-h-[calc(100dvh-1.5rem)] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:max-h-[calc(100dvh-3rem)] sm:p-8"
      >
        <button
          type="button"
          onClick={() => closeRef.current()}
          aria-label="Close dialog"
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-lg text-ink/60 transition hover:bg-ink/5 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest sm:right-4 sm:top-4"
        >
          <CloseIcon />
        </button>

        {sent ? (
          <div className="text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-forest/10 text-forest">
              <CheckIcon />
            </span>
            <h2 id="forgot-title" className="mt-4 font-display text-xl font-bold text-ink sm:text-2xl">
              Check your inbox
            </h2>
            <p id="forgot-sent" className="mt-2 text-sm text-ink/65 sm:text-base">
              If an account exists for{" "}
              <span className="break-all font-semibold text-ink">{email}</span>, we&apos;ve sent a password
              reset link. It may take a minute to arrive.
            </p>
            <div className="mt-6 space-y-3">
              <button
                type="button"
                onClick={() => closeRef.current()}
                className="h-12 w-full rounded-lg bg-forest font-semibold text-white transition hover:bg-forest-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
              >
                Back to log in
              </button>
              <button
                type="button"
                onClick={() => {
                  setSent(false);
                  setError("");
                  setFormError("");
                }}
                className="w-full text-sm font-semibold text-forest underline underline-offset-4 hover:text-forest-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
              >
                Use a different email
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="pr-10">
              <h2 id="forgot-title" className="font-display text-xl font-bold text-ink sm:text-2xl">
                Forgot password?
              </h2>
              <p id="forgot-desc" className="mt-2 text-sm text-ink/65 sm:text-base">
                Enter the email linked to your account and we&apos;ll send you a password reset link.
              </p>
            </div>

            {formError && (
              <div
                role="alert"
                className="mt-5 rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger"
              >
                {formError}
              </div>
            )}

            <form onSubmit={onSubmit} noValidate className="mt-6 space-y-5">
              <FormField
                id="forgot-email"
                label="Email address"
                type="email"
                autoComplete="email"
                inputMode="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                  setFormError("");
                }}
                error={error}
                autoFocus
              />

              <button
                type="submit"
                disabled={loading}
                className="flex h-12 w-full items-center justify-center gap-2.5 rounded-lg bg-forest font-semibold text-white transition hover:bg-forest-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading && <Spinner />}
                {loading ? "Sending…" : "Send reset link"}
              </button>

              <button
                type="button"
                onClick={() => closeRef.current()}
                className="w-full text-sm font-semibold text-ink/60 transition hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
              >
                Back to log in
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
