"use client";

import { useState } from "react";

export function RequestForm({ slotId }: { slotId: string | null }) {
  const [agreed, setAgreed] = useState(false);
  const disabled = !slotId && !agreed;

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <p className="slot">{slotId ? "Thursday · 16:00 · 50 min" : "No slot selected"}</p>
      <label className="check">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(event) => setAgreed(event.target.checked)}
        />
        I agree to the scheduling policy
      </label>
      <button type="submit" disabled={disabled}>
        Request lesson
      </button>
    </form>
  );
}
