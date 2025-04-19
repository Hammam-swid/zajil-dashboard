"use client";

import React from "react";
import Link from "next/link";
import { Transition } from "@headlessui/react";
import {
  AppWindowIcon,
  HouseSimpleIcon,
  ImagesIcon,
  LockSimpleIcon,
  PackageIcon,
  ReceiptIcon,
  StoreFrontIcon,
  TagIcon,
  UserCircleIcon,
  UsersIcon,
} from "@/assets/icons";
import { SidebarMenu } from "@/components/moleculs";
import Image from "next/image";
import {
  ArrowLeftRight,
  ChartNoAxesCombinedIcon,
  TruckIcon,
} from "lucide-react";
import { useAppSelector } from "@/store/hooks";
// ... باقي الاستيرادات ...

const SidebarExpand: React.FC<{
  children?: React.ReactNode;
  show?: boolean;
}> = ({ children, show }) => {
  return (
    <Transition
      show={show}
      enter="transition-opacity duration-500"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-500"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
      className={"w-full"}
    >
      <section className="relative flex w-full items-start gap-4">
        <div className="absolute left-6 h-full w-px bg-netral-30" />
        <div className="flex w-full flex-col items-start justify-end gap-2 pl-9">
          {children}
        </div>
      </section>
    </Transition>
  );
};

const SidebarClient: React.FC = () => {
  const [mounted, setMounted] = React.useState(false);
  const [showProductsMenu, setShowProductsMenu] = React.useState(false);
  const user = useAppSelector((state) => state.user);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <aside className="Sidebar h-screen w-64 overflow-y-auto overflow-x-hidden border border-netral-20 bg-white px-6 py-4 pt-8 shadow-sm 2xl:w-72 2xl:pt-10" />
    );
  }

  return (
    <aside
      id="sidebar"
      className="Sidebar h-screen w-64 overflow-y-auto overflow-x-hidden border border-netral-20 bg-white px-6 py-4 pt-8 shadow-sm 2xl:w-72 2xl:pt-10"
    >
      <Link
        href="/"
        className="mb-8 flex w-fit rounded-md  bg-primary-main p-2 2xl:mb-10"
      >
        <Image
          src="/zajil-logo.png"
          alt="Zajil Logo"
          width={100}
          height={100}
          priority
        />
      </Link>

      <nav className="mt-10 flex w-full flex-col items-start gap-3">
        <SidebarMenu
          icon={<HouseSimpleIcon />}
          name="الصفحة الرئيسية"
          variant="default"
          href="/"
          exact
        />

        <SidebarMenu
          active={showProductsMenu}
          onClick={() => setShowProductsMenu(!showProductsMenu)}
          icon={<StoreFrontIcon />}
          name="المتاجر"
          variant="sub-menu"
        />

        <SidebarExpand show={showProductsMenu}>
          <SidebarMenu name="قائمة المتاجر" variant="expand" href="/stores" />
          <SidebarMenu
            name="قائمة الفئات"
            variant="expand"
            href="/categories"
          />
        </SidebarExpand>

        <SidebarMenu
          icon={<UsersIcon />}
          name="العملاء"
          variant="default"
          href="/customers"
        />

        <SidebarMenu
          icon={<TruckIcon width={24} height={24} />}
          name="السائقين"
          variant="default"
          href="/drivers"
        />

        <SidebarMenu
          icon={<AppWindowIcon />}
          name="البيانات"
          variant="default"
          href="/entries"
        />

        <SidebarMenu
          icon={<PackageIcon />}
          name="الطلبيات"
          variant="default"
          href="/orders"
        />

        {user?.role === "super_admin" && (
          <SidebarMenu
            icon={<ChartNoAxesCombinedIcon />}
            name="المالية"
            variant="default"
            href="/finance"
          />
        )}

        {user?.role === "super_admin" && (
          <SidebarMenu
            icon={<UserCircleIcon />}
            name="المسؤولين"
            variant="default"
            href="/moderators"
          />
        )}
      </nav>
    </aside>
  );
};

export default SidebarClient;
