export const BRAND = "Kosh Bank"; // change to your product name

function Passbook() {
  const rows = [
    ["Salary credit", "+ 62,400.00"],
    ["Rent", "− 18,000.00"],
    ["Electricity", "− 1,240.00"],
    ["Savings transfer", "− 10,000.00"],
  ];
  return (
    <div
      aria-hidden="true"
      className="w-full max-w-sm -rotate-2 rounded-2xl bg-paper p-6 text-ink shadow-2xl shadow-black/30"
    >
      <div className="flex items-baseline justify-between">
        <span className="font-display text-lg font-bold">Savings account</span>
        <span className="text-sm text-ink/55">•••• 4821</span>
      </div>
      <p className="mt-4 text-sm text-ink/60">Available balance</p>
      <p className="font-display text-4xl font-bold tracking-tight">₹ 33,160.00</p>
      <ul className="mt-5 divide-y divide-ink/10 border-t border-ink/15 text-sm">
        {rows.map(([name, amt]) => (
          <li key={name} className="flex justify-between py-2.5">
            <span>{name}</span>
            <span className={amt.startsWith("+") ? "font-semibold text-forest" : "text-ink/75"}>{amt}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="min-h-screen bg-paper lg:grid lg:grid-cols-[5fr_6fr]">
      {/* Brand panel (desktop) */}
      <aside
        className="relative hidden flex-col justify-between overflow-hidden bg-forest p-12 text-white lg:flex"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, transparent 0, transparent 39px, rgba(255,255,255,0.06) 39px, rgba(255,255,255,0.06) 40px)",
        }}
      >
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-brass font-display text-xl font-bold text-forest-deep">
            K
          </span>
          <span className="font-display text-xl font-bold">{BRAND}</span>
        </div>

        <div className="flex flex-col items-start gap-10">
          <h2 className="max-w-md font-display text-4xl font-bold leading-tight xl:text-5xl">
            Your money, in plain sight.
          </h2>
          <Passbook />
        </div>

        <p className="max-w-sm text-sm text-white/70">
          Passwords are encrypted before they are stored, and every session is protected with a signed token.
        </p>
      </aside>

      {/* Form panel */}
      <main className="flex min-h-screen flex-col px-5 py-8 sm:px-10 lg:min-h-0 lg:justify-center lg:px-16">
        <div className="mb-8 flex items-center gap-3 lg:hidden">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-forest font-display text-lg font-bold text-brass-soft">
            K
          </span>
          <span className="font-display text-lg font-bold text-ink">{BRAND}</span>
        </div>

        <div className="mx-auto w-full max-w-md">
          <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">{title}</h1>
          <p className="mt-2 text-ink/65">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <div className="mt-8 text-center text-sm text-ink/70">{footer}</div>
        </div>
      </main>
    </div>
  );
}
