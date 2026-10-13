import { useState } from "react";

export default function FormField({
  id, label, type = "text", value, onChange, error, hint, ...rest
}) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={id}
          type={isPassword && show ? "text" : type}
          value={value}
          onChange={onChange}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={`h-12 w-full rounded-lg border bg-white px-3.5 text-base text-ink outline-none transition
            placeholder:text-ink/35 focus:ring-4
            ${isPassword ? "pr-16" : ""}
            ${error
              ? "border-danger focus:border-danger focus:ring-danger/15"
              : "border-ink/20 focus:border-forest focus:ring-forest/15"}`}
          {...rest}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? "Hide password" : "Show password"}
            className="absolute inset-y-0 right-0 rounded-r-lg px-4 text-sm font-medium text-forest hover:text-forest-deep focus-visible:outline-2 focus-visible:outline-forest"
          >
            {show ? "Hide" : "Show"}
          </button>
        )}
      </div>
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-sm text-danger">{error}</p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-sm text-ink/60">{hint}</p>
      ) : null}
    </div>
  );
}
