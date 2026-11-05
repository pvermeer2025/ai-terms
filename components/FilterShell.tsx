"use client";

import { useState, type ReactNode } from "react";

export function FilterShell({ filters, children }: { filters: ReactNode; children: ReactNode }) {
  const [open, setOpen] = useState(true);

  return (
    <>
      <button
        type="button"
        className="at-filter-toggle"
        aria-expanded={open}
        aria-controls="filters"
        onClick={() => setOpen((value) => !value)}
      >
        <span>Filters</span>
        <span className="at-chev" aria-hidden="true" />
      </button>
      <div className="at-layout">
        <div className={open ? "at-filter-wrap is-open" : "at-filter-wrap"}>{filters}</div>
        <div className="at-results">{children}</div>
      </div>
    </>
  );
}
