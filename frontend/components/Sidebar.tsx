"use client";

import { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Item = {
  label: string;
  href: string;
  icon: JSX.Element;
  badge?: string;
};

const icons = {
  dashboard: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="#1e3b5f" strokeWidth="1.8" />
      <path d="M12 7v5l3 3" stroke="#1e3b5f" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  calendar: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="4" y="6" width="16" height="14" rx="2" stroke="#1e3b5f" strokeWidth="1.8" />
      <path d="M4 10h16" stroke="#1e3b5f" strokeWidth="1.8" />
      <path d="M9 4v4M15 4v4" stroke="#1e3b5f" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  tasks: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M6 6h9" stroke="#1e3b5f" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M6 12h12" stroke="#1e3b5f" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M6 18h9" stroke="#1e3b5f" strokeWidth="1.8" strokeLinecap="round" />
      <rect x="4" y="4" width="16" height="16" rx="3" stroke="#1e3b5f" strokeWidth="1.8" />
    </svg>
  ),
  patients: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="9" r="3" stroke="#1e3b5f" strokeWidth="1.8" />
      <path d="M4 19c0-2.8 2.2-5 5-5" stroke="#1e3b5f" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="17" cy="10" r="2.5" stroke="#1e3b5f" strokeWidth="1.6" />
      <path d="M13.5 19c.2-2.2 1.9-3.9 4-3.9" stroke="#1e3b5f" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  orgs: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="5" y="5" width="14" height="14" rx="2" stroke="#1e3b5f" strokeWidth="1.8" />
      <path d="M5 11h14M11 5v14" stroke="#1e3b5f" strokeWidth="1.8" />
    </svg>
  ),
  analytics: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M6 16V9" stroke="#1e3b5f" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 16V5" stroke="#1e3b5f" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M18 16v-7" stroke="#1e3b5f" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M4 18h16" stroke="#1e3b5f" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  growth: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M5 13c2.5-2.5 5-2.5 7.5 0S17.5 16 20 13" stroke="#1e3b5f" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 11c1-1.5 2-1.5 3 0s2 1.5 3 0" stroke="#1e3b5f" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M4 18h16" stroke="#1e3b5f" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  settings: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M12 9.5A2.5 2.5 0 1 1 12 14a2.5 2.5 0 0 1 0-4.5Z" stroke="#1e3b5f" strokeWidth="1.8" />
      <path
        d="M9.2 4.5h5.6l.6 2.3 2 .8 1.9-1.2 2.8 4.8-2 1.3.1 2.1 1.9 1.1-2.8 4.9-2-.7-1.6 1.5H9.2l-.6-2.3-2-.8-1.9 1.2-2.8-4.8 2-1.3-.1-2.1-1.9-1.1 2.8-4.9 2 .7 1.6-1.5Z"
        stroke="#1e3b5f"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  )
};

const items: Item[] = [
  { label: "Panel principal", href: "/dashboard", icon: icons.dashboard },
  { label: "Horarios", href: "/schedules", icon: icons.calendar },
  { label: "Tareas", href: "/tasks", icon: icons.tasks, badge: "1" },
  { label: "Pacientes", href: "/patients", icon: icons.patients },
  { label: "Organizaciones", href: "/organizations", icon: icons.orgs },
  { label: "Analítica", href: "/analytics", icon: icons.analytics },
  { label: "Crecimiento", href: "/growth", icon: icons.growth },
  { label: "Configuraciones", href: "/settings", icon: icons.settings }
];

export default function Sidebar() {
  const pathname = usePathname();

  const activeHref = useMemo(() => {
    if (pathname.startsWith("/patients")) return "/patients";
    const match = items.find((i) => pathname === i.href);
    return match?.href;
  }, [pathname]);

  return (
    <aside
      style={{
        width: 240,
        padding: "18px 12px 18px 18px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        position: "sticky",
        top: 12,
        alignSelf: "flex-start"
      }}
    >
      {items.map((item) => {
        const active = activeHref === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "14px 12px",
              borderRadius: 14,
              background: active ? "#e7edf6" : "#fff",
              color: "#1e3b5f",
              fontWeight: 700,
              boxShadow: "0 10px 30px rgba(15,23,42,0.06)",
              border: "1px solid rgba(15,23,42,0.05)"
            }}
            className="fade-in"
          >
            {item.icon}
            <span style={{ flex: 1 }}>{item.label}</span>
            {item.badge ? (
              <span
                style={{
                  background: "#d14b4b",
                  color: "#fff",
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  display: "grid",
                  placeItems: "center",
                  fontSize: 13,
                  fontWeight: 800
                }}
              >
                {item.badge}
              </span>
            ) : null}
          </Link>
        );
      })}
    </aside>
  );
}
