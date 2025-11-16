"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, Calendar, BarChart3, Home } from "lucide-react";

interface PathologyNavProps {
  pathology: string;
}

export default function PathologyNav({ pathology }: PathologyNavProps) {
  const pathname = usePathname();

  const navItems = [
    {
      href: `/professional/${pathology}`,
      label: "Dashboard",
      icon: Calendar,
      exact: true,
    },
    {
      href: `/professional/${pathology}/patients`,
      label: "Patients",
      icon: Users,
      exact: false,
    },
    {
      href: `/professional/${pathology}/statistics`,
      label: "Statistics",
      icon: BarChart3,
      exact: false,
    },
  ];

  const isActive = (href: string, exact: boolean) => {
    if (exact) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-64 flex-shrink-0">
      <div className="mb-4">
        <Link
          href="/professional"
          className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <Home className="h-4 w-4" />
          Back to Pathologies
        </Link>
      </div>
      <nav className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href, item.exact);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                active
                  ? "bg-slate-900 text-white"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

