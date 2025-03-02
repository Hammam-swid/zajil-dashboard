"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { name: "المدن والمناطق", href: "/entries", include: "/entries/cities" },
  { name: "أنواع المركبات", href: "/entries/vehicle-types" },
  { name: "المتغيرات", href: "/entries/variants" },
  { name: "الأسئلة الشائعة", href: "/entries/faqs" },
];
export default function EntriesLinks() {
  const pathname = usePathname();
  return (
    <nav>
      <ul className="mx-4 flex gap-4 rounded-full bg-white px-8 py-4 shadow-md">
        {links.map((link) => (
          <li key={link.name}>
            <Link
              href={link.href}
              className={`rounded-md p-2 transition-colors hover:bg-primary-main/10 hover:text-primary-main ${
                pathname === link.href ||
                (link.include && pathname.includes(link.include))
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
