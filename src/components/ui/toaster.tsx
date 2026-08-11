"use client";

import { Toaster as HotToaster } from "react-hot-toast";

export function Toaster() {
  return (
    <HotToaster
      position="bottom-center"
      toastOptions={{
        style: {
          background: "var(--surface)",
          color: "var(--foreground)",
          border: "1px solid var(--border-color)",
          borderRadius: "12px",
        },
      }}
    />
  );
}
