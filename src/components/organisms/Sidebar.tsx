"use client";

import React from "react";
import Link from "next/link";
import { Transition } from "@headlessui/react";
import dynamic from "next/dynamic";
import { Suspense } from "react";

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
import { ArrowLeftRight, TruckIcon } from "lucide-react";
import { useAppSelector } from "@/store/hooks";

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

// Loading component
const LoadingSidebar = () => (
  <aside className="Sidebar h-screen w-64 overflow-y-auto overflow-x-hidden border border-netral-20 bg-white px-6 py-4 pt-8 shadow-sm 2xl:w-72 2xl:pt-10">
    <div className="animate-pulse">
      <div className="mb-8 h-10 w-32 rounded bg-gray-200" />
      <div className="space-y-4">
        <div className="h-8 w-full rounded bg-gray-200" />
        <div className="h-8 w-full rounded bg-gray-200" />
        <div className="h-8 w-full rounded bg-gray-200" />
      </div>
    </div>
  </aside>
);

const SidebarClient = dynamic(
  () => import("@/components/organisms/SidebarClient"),
  {
    ssr: false,
  }
);

const Sidebar = () => {
  return (
    <Suspense fallback={<LoadingSidebar />}>
      <SidebarClient />
    </Suspense>
  );
};

export default Sidebar;
