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
import { NijaLogo } from "@/assets/brands";
import Image from "next/image";
import { TruckIcon } from "lucide-react";

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

const Sidebar: React.FC = () => {
  const [showUsersMenu, setShowUsersMenu] = React.useState(false);
  const [showProductsMenu, setShowProductsMenu] = React.useState(false);
  const [showTransactionsMenu, setShowTransactionsMenu] = React.useState(false);
  const [showAuthMenu, setShowAuthMenu] = React.useState(false);

  // const localStorageData = window.localStorage.getItem("Customers")

  return (
    <aside
      id="sidebar"
      className="Sidebar h-screen w-64 overflow-y-auto overflow-x-hidden border border-netral-20 bg-white px-6 py-4 pt-8 shadow-sm 2xl:w-72 2xl:pt-10"
    >
      <Link
        href="/"
        className="mb-8 flex items-center gap-3 rounded-md   bg-primary-main p-2 2xl:mb-10"
      >
        <Image
          src="/zajil-logo.png"
          alt="Zajil Logo"
          width={100}
          height={100}
        />
        {/* <h5 className='text-body-xl font-semibold uppercase'>Nija Kit</h5> */}
      </Link>

      <nav className="mt-10 flex w-full flex-col items-start gap-3">
        <SidebarMenu
          icon={<HouseSimpleIcon />}
          name="الصفحة الرئيسية"
          variant="default"
          href="/"
          exact
        />

        {/* <SidebarExpand show={showUsersMenu}>
          <SidebarMenu name='Users' variant='expand' href='/customers/users' />
          
          <SidebarMenu
            name='Buyers'
            variant='expand'
            href='/customers/buyers'
          />
        </SidebarExpand> */}

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
            name="Categories"
            variant="expand"
            href="/products/categories"
          />
        </SidebarExpand>

        <SidebarMenu
          icon={<UsersIcon />}
          name="العملاء"
          variant="default"
          href="/customers"
        />

        <SidebarMenu
          icon={<TruckIcon />}
          name="السائقين"
          variant="default"
          href="/drivers"
        />

        {/* <SidebarExpand show={showTransactionsMenu}>
          <SidebarMenu
            name='Manage Transactions'
            variant='expand'
            href='/transactions/manage-transaction'
          />
          <SidebarMenu
            name='Manage Returns'
            variant='expand'
            href='/transactions/manage-return'
          />
        </SidebarExpand> */}

        <SidebarMenu
          icon={<TagIcon />}
          name="العمليات"
          variant="default"
          href="/flash-sale"
        />

        <SidebarMenu
          icon={<AppWindowIcon />}
          name="البيانات"
          variant="default"
          href="/categories"
        />

        <SidebarMenu
          icon={<PackageIcon />}
          name="الطلبيات"
          variant="default"
          href="/orders"
        />

        <SidebarMenu
          icon={<UserCircleIcon />}
          name="Users Role"
          variant="default"
          href="/user-role"
        />
      </nav>
    </aside>
  );
};

export default Sidebar;
