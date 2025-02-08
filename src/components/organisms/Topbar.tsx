"use client";

import React from "react";
import Image from "next/image";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";

import {
  BagIcon,
  BellSimpleIcon,
  CaretDownIcon,
  GearSixIcon,
  PackageIcon,
  SignOutIcon,
  TshirtIcon
} from "@/assets/icons";
import Link from "next/link";

const Topbar: React.FC = () => {
  return (
    <header
      className={`relative flex w-full items-center justify-end border-b border-netral-20 bg-white px-8 py-4 shadow-sm`}
    >
      <div className="flex items-center gap-5">
        <span className="h-10 w-px bg-netral-20"></span>

        <Menu as="div" className="relative inline-block text-left">
          <Menu.Button className="flex items-center gap-7">
            <section className="flex items-start gap-2">
              <div className="relative h-10 w-10 overflow-hidden rounded-full">
                <Image
                  className="h-full w-full object-cover"
                  src="/avatar-1.png"
                  sizes="40"
                  alt="Avatar People 1"
                  width={40}
                  height={40}
                />
              </div>

              <div className="space-y-1 text-right">
                <h5 className="text-body-sm font-semibold text-netral-100">
                  Hammam Swaid
                </h5>
                <p className="text-body-xs text-netral-50">Super Admin</p>
              </div>
            </section>

            <CaretDownIcon className="h-6 w-6 text-netral-50" />
          </Menu.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items
              as="div"
              className="absolute right-0 top-16 mt-2 w-64 origin-top-right divide-y divide-gray-100 rounded-lg-10 bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
            >
              <div className="p-3">
                <Menu.Item>
                  <Link
                    href={"/settings"}
                    className={
                      "flex items-center gap-2 rounded-lg-10 px-2 py-3 hover:bg-netral-20"
                    }
                  >
                    <GearSixIcon className="h-6 w-6 text-netral-60" />
                    <h5 className="text-body-base text-netral-90">Settings</h5>
                  </Link>
                </Menu.Item>

                <Menu.Item>
                  <Link
                    href={"/auth/login"}
                    className={
                      "flex items-center gap-2 rounded-lg-10 px-2 py-3 hover:bg-netral-20"
                    }
                  >
                    <SignOutIcon className="h-6 w-6 text-netral-60" />
                    <h5 className="text-body-base text-netral-90">Logout</h5>
                  </Link>
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </header>
  );
};

export default Topbar;
