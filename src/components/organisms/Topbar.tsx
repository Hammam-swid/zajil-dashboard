"use client";

import Image from "next/image";
import { Menu, Transition } from "@headlessui/react";
import { Fragment, Suspense, useState } from "react";

import { CaretDownIcon, SignOutIcon } from "@/assets/icons";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/authSlice";
import { Modal } from "../moleculs";
import { Button } from "../atomics";
import { useRouter } from "next/navigation";
import { User } from "@/types";

const Topbar: React.FC = () => {
  const [modal, setModal] = useState(false);
  const router = useRouter();
  let user: Partial<User> | null = { name: "اسم المستخدم" };
  user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const logoutHandler = () => {
    setModal(true);
  };
  const logoutConfirm = () => {
    dispatch(logout());
    setModal(false);
    setTimeout(() => router.push("/auth/login"), 2000);
  };

  return (
    <header
      className={`relative flex w-full items-center justify-end border-b border-netral-20 bg-white px-8 py-4 shadow-sm`}
    >
      <div className="flex items-center gap-5">
        <span className="h-10 w-px bg-netral-20"></span>

        <Menu as="div" className="relative inline-block text-left">
          <Suspense fallback={<div>Loading...</div>}>
            <Menu.Button className="flex items-center gap-7">
              <section className="flex items-start gap-2">
                <div className="relative h-10 w-10 overflow-hidden rounded-full">
                  <Image
                    className="h-full w-full object-cover"
                    src={user?.profile_photo_url || "/avatar-default.png"}
                    sizes="40"
                    alt="Avatar People 1"
                    width={40}
                    height={40}
                  />
                </div>

                <div className="space-y-1 text-right">
                  <h5 className="text-body-sm font-bold text-netral-100">
                    {user?.name || "اسم المستخدم"}
                  </h5>
                  <p className="text-body-xs text-netral-50">{user?.role}</p>
                </div>
              </section>

              <CaretDownIcon className="h-6 w-6 text-netral-50" />
            </Menu.Button>
          </Suspense>
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
              className="absolute end-0 top-16 mt-2 w-64 origin-top-left divide-y divide-gray-100 rounded-lg-10 bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
            >
              <div className="p-3">
                {/* <Menu.Item>
                  <Link
                    href={"/settings"}
                    className={
                      "flex items-center gap-2 rounded-lg-10 px-2 py-3 hover:bg-netral-20"
                    }
                  >
                    <GearSixIcon className="h-6 w-6 text-netral-60" />
                    <h5 className="text-body-base text-netral-90">Settings</h5>
                  </Link>
                </Menu.Item> */}

                <Menu.Item>
                  <span
                    // href={"/auth/login"}
                    onClick={logoutHandler}
                    className={
                      "flex cursor-pointer items-center gap-2 rounded-lg-10 px-2 py-3 hover:bg-netral-20"
                    }
                  >
                    <SignOutIcon className="h-6 w-6 text-netral-60" />
                    <h5 className="text-body-base text-netral-90">
                      تسجيل الخروج
                    </h5>
                  </span>
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
        <Modal
          open={modal}
          setOpen={setModal}
          title="تسجيل الخروج"
          variant="error"
          className="w-full max-w-sm"
        >
          هل أنت متأكد من تسجيل الخروج؟
          <div className="mt-6 flex items-center justify-end gap-4">
            <Button
              type="button"
              size="md"
              variant="default-bg"
              onClick={() => setModal(false)}
            >
              إلغاء
            </Button>
            <Button
              type="button"
              size="md"
              variant="error-bg"
              onClick={logoutConfirm}
            >
              تأكيد
            </Button>
          </div>
        </Modal>
      </div>
    </header>
  );
};

export default Topbar;
