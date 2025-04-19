"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}
const links = [
  { label: "التحويلات", to: "/finance" },
  { label: "المحافظ", to: "/finance/wallets" },
];
export default function layout({ children }: LayoutProps) {
  const pathname = usePathname();
  console.log(pathname);
  return (
    <div>
      <nav>
        <ul className="mx-4 flex gap-4 rounded-full bg-white px-8 py-4 shadow-md">
          {links.map((link) => (
            <li key={link.label}>
              <Link
                href={link.to}
                className={`rounded-md p-2 transition-colors hover:bg-primary-main/10 hover:text-primary-main ${
                  pathname === link.to
                    ? "bg-primary-main/10 font-bold text-primary-main"
                    : ""
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      {children}
    </div>
  );
}
