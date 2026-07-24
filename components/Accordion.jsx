"use client";
import { useState } from "react";

export default function Accordion({ items }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="acc">
      {items.map((it, i) => (
        <div key={i} className={"acc-item" + (open === i ? " open" : "")}>
          <button className="acc-head" onClick={() => setOpen(open === i ? -1 : i)}>
            {it.q}
            <span className="acc-icon">+</span>
          </button>
          <div className="acc-body">
            <p>{it.a}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
