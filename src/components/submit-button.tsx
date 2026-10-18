"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({ disabled = false }: { disabled?: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      className="button button-secondary"
      type="submit"
      disabled={disabled || pending}
      aria-live="polite"
    >
      {pending ? "جارٍ تسجيل الدخول..." : "تسجيل الدخول"}
    </button>
  );
}
