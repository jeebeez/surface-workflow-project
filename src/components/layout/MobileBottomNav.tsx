"use client";

import Link from "next/link";
import { mainNav } from "../../lib/navItems";
import { usePathname } from "next/navigation";
import { CircleLineIcon } from "~/components/icons/CircleLine";

export function MobileBottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed right-0 bottom-0 left-0 border-t bg-white md:hidden">
      <ul className="flex justify-around p-2">
        <li>
          <Link
            href="/onboarding"
            className={`flex flex-col items-center p-2 ${
              pathname === "/onboarding" ? "text-blue-600" : "text-gray-600"
            }`}
          >
            <CircleLineIcon className="h-5 w-5" />
            <span className="sr-only">Getting started</span>
          </Link>
        </li>
        {mainNav.map((item) => (
          <li key={item.title}>
            <Link
              href={item.href}
              className={`flex flex-col items-center p-2 ${
                pathname === item.href ? "text-blue-600" : "text-gray-600"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="sr-only">{item.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
