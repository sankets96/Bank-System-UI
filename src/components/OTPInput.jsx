import React, { useRef, useState, useEffect } from "react";

/**
 * OTPInput Component
 * A 4-digit OTP input field that handles auto-focus and backspacing.
 */
export default function OTPInput({ value, onChange, error, autoFocus = false }) {
  const inputRefs = useRef([]);
  const [localValue, setLocalValue] = useState(value || ["", "", "", ""]);

  useEffect(() => {
    setLocalValue(value || ["", "", "", ""]);
  }, [value]);

  const handleChange = (index, digit) => {
    // Only allow numbers
    if (!/^\d*$/.test(digit)) return;

    const newValue = [...localValue];
    // Take only the last character if multiple are pasted/entered
    newValue[index] = digit.slice(-1);
    setLocalValue(newValue);

    // Propagate change to parent
    onChange(newValue.join(""));

    // Move focus forward
    if (digit && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !localValue[index] && index > 0) {
      // Move focus back on backspace if current field is empty
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").slice(0, 4).split("");
    if (!pasteData.every(char => /^\d$/.test(char))) return;

    const newValue = [...localValue];
    pasteData.forEach((char, i) => {
      if (i < 4) newValue[i] = char;
    });
    setLocalValue(newValue);
    onChange(newValue.join(""));

    // Focus the last filled input or the next empty one
    const nextIndex = Math.min(pasteData.length, 3);
    inputRefs.current[nextIndex]?.focus();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-3 sm:gap-4">
        {[0, 1, 2, 3].map((index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            autoFocus={autoFocus && index === 0}
            className={`h-12 w-12 rounded-lg border-2 text-center text-xl font-bold transition-all focus:outline-none focus:ring-2 focus:ring-forest
              ${error
                ? "border-danger focus:border-danger focus:ring-danger/20"
                : "border-ink/20 focus:border-forest"
              }`}
            value={localValue[index]}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            maxLength={1}
          />
        ))}
      </div>
      {error && (
        <p className="text-sm text-danger font-medium">{error}</p>
      )}
    </div>
  );
}
