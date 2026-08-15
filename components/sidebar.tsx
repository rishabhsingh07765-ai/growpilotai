'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import {
  LayoutDashboard,
  PenSquare,
  CalendarDays,
  BarChart3,
  Camera,
  Settings,
  Lightbulb,
  CreditCard,
  UserCircle,
  LogOut,
  Sparkles,
  Bot,
} from 'lucide-react';

const groups = [
  {
    title: 'Workspace',
    items: [
      {
        href: '/dashboard',
        label: 'Dashboard',
        icon: LayoutDashboard,
      },
      {
        href: '/studio',
        label: 'Content Studio',
        icon: PenSquare,
      },
      {
        href: '/calendar',
        label: 'Calendar',
        icon: CalendarDays,
      },
      {
        href: '/strategy',
        label: 'AI Strategy',
        icon: Lightbulb,
      },
      {
        href: '/analytics',
        label: 'Analytics',
        icon: BarChart3,
      },
      {
        href: '/automation',
        label: 'Automation',
        icon: Bot,
      },
    ],
  },
  {
    title: 'Account',
    items: [
      {
        href: '/instagram',
        label: 'Instagram',
        icon: Camera,
      },
      {
        href: '/profile',
        label: 'Profile',
        icon: UserCircle,
      },
      {
        href: '/billing',
        label: 'Billing',
        icon: CreditCard,
      },
      {
        href: '/settings',
        label: 'Settings',
        icon: Settings,
      },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      router.push('/login');
      router.refresh();
    }
  };

  return (
    <aside className="hidden lg:flex w-64 shrink-0 min-h-screen flex-col border-r border-white/10 bg-[#070a10] p-4">
      {/* Logo */}
      <Link
        href="/dashboard"
        className="flex items-center gap-2 px-3 py-4 text-lg font-bold text-white"
      >
        <Sparkles
          size={22}
          className="text-fuchsia-400"
        />

        <span>GrowPilot AI</span>
      </Link>

      {/* Navigation */}
      <nav className="mt-5 flex-1 space-y-6">
        {groups.map((group) => (
          <div key={group.title}>
            <div className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
              {group.title}
            </div>

            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;

                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200 ${
                      isActive
                        ? 'bg-white/10 text-white'
                        : 'text-slate-500 hover:bg-white/[0.04] hover:text-white'
                    }`}
                  >
                    <Icon
                      size={17}
                      strokeWidth={1.8}
                    />

                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Sign Out */}
      <button
        type="button"
        onClick={handleLogout}
        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-500 transition-colors hover:bg-white/[0.04] hover:text-white"
      >
        <LogOut
          size={17}
          strokeWidth={1.8}
        />

        <span>Sign out</span>
      </button>
    </aside>
  );
}
