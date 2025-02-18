"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { name: "المدن والمناطق", href: "/entries" },
  { name: "أنواع المركبات", href: "/entries/vehicle-types" },
];
export default function EntriesLinks() {
  const pathname = usePathname();
  return (
    <nav>
      <ul className="flex gap-4 bg-white p-4">
        {links.map((link) => (
          <li key={link.name}>
            <Link
              href={link.href}
              className={`rounded-md p-2 transition-colors hover:bg-primary-main/10 hover:text-primary-main ${
                pathname === link.href
                  ? "bg-primary-main/10 font-bold text-primary-main"
                  : ""
              }`}
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
