"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as LucideIcons from "lucide-react";

const { Users, BarChart3, LayoutGrid, ArrowLeft } = LucideIcons;

interface PathologyNavProps {
  pathology: string;
  pathologyName: string;
}

export default function PathologyNav({ pathology, pathologyName }: PathologyNavProps) {
  const pathname = usePathname();

  const navItems = [
    {
      href: `/professional/${pathology}`,
      label: "Dashboard",
      icon: LayoutGrid,
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
    <aside className="w-64 bg-[#F8F7F5] border-r border-slate-200 text-slate-600 flex flex-col z-20">
      <div className="p-6">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Application
        </p>
        <p className="text-sm font-medium text-slate-700 mt-1">
          {pathologyName}
        </p>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        <Link
          href="/professional"
          className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-slate-200 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-5 h-5 text-slate-400" />
          Back to Pathologies
        </Link>

        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href, item.exact);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition ${
                active
                  ? "bg-brand text-white shadow-md shadow-brand/20"
                  : "text-slate-700 hover:bg-slate-200 hover:text-slate-900"
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

