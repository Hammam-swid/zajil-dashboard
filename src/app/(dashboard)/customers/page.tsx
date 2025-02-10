"use client";
import React, { useState } from "react";

import { Modal, PageAction } from "@/components/moleculs";
import {
  Alerts,
  Button,
  Checkbox,
  Pagination,
  Title,
} from "@/components/atomics";

import { FunnelIcon, SortAscendingIcon } from "@/assets/icons";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { User } from "@/types";
import api from "@/lib/api";
import { useSearchParams } from "next/navigation";

const getCustomers = async (page: number) => {
  const res = await api.get(`/dashboards/users?per_page=10&page=${page}`);
  console.log(res.data);
  return res.data as { data: User[]; meta: { last_page: number } };
};

const DBCustomersUsers = () => {
  //----------------------------------------------------------------------------------//

  const [page, setPage] = React.useState(1);
  const { data, isLoading } = useQuery({
    queryKey: ["costumers-users", { page }],
    queryFn: () => getCustomers(page),
  });

  const [openModalDelete, setOpenModalDelete] = React.useState(false);
  const [openAlertsDelete, setOpenAlertsDelete] = React.useState(false);
  //----------------------------------------------------------------------------------//

  return (
    <div className="relative space-y-6 p-6">
      <h1 className="text-heading-sm font-semibold">العملاء</h1>

      <section className="relative rounded-lg-10 bg-white p-6">
        <nav className="mb-8 flex items-center justify-between">
          <Title size="lg" variant="default">
            المستخدمين
          </Title>

          <div className="flex flex-row gap-3">
            <Button size="md" variant="default-bg">
              ترتيب
              <SortAscendingIcon className="h-4 w-4 stroke-netral-100 stroke-[4px]" />
            </Button>

            <Button size="md" variant="default-bg">
              تصفية
              <FunnelIcon className="h-4 w-4 stroke-netral-100 stroke-[4px]" />
            </Button>
          </div>
        </nav>

        <div className="mb-6 overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="bg-netral-15 text-body-sm font-semibold uppercase">
              <tr>
                {/* <th className="w-px whitespace-nowrap px-3 py-4 first:pl-5 last:pr-5">
                  <Checkbox active={isSelectAll} setActive={setIsSelectAll} />
                </th> */}

                <th className="whitespace-nowrap px-3 py-4 text-center text-netral-50 first:pl-5 last:pr-5">
                  <span className="text-body-sm font-semibold">الاسم</span>
                </th>

                <th className="whitespace-nowrap px-3 py-4 text-center text-netral-50 first:pl-5 last:pr-5">
                  <span className="text-body-sm font-semibold">
                    عنوان البريد الالكتروني
                  </span>
                </th>

                <th className="w-56 whitespace-nowrap px-3 py-4 text-center text-netral-50 first:pl-5 last:pr-5">
                  <span className="text-body-sm font-semibold">الحالة</span>
                </th>

                <th className="whitespace-nowrap px-3 py-4 text-center text-netral-50 first:pl-5 last:pr-5">
                  <span className="text-body-sm font-semibold">نوع الحساب</span>
                </th>

                <th className="whitespace-nowrap px-3 py-4 text-center text-netral-50 first:pl-5 last:pr-5">
                  <span className="text-body-sm font-semibold">الجنسية</span>
                </th>

                <th className="whitespace-nowrap px-3 py-4 text-center text-netral-50 first:pl-5 last:pr-5">
                  <span className="text-body-sm font-semibold">الإجراءات</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-netral-20 pt-4 text-sm">
              {isLoading ? (
                <p>جار التحميل...</p>
              ) : (
                data?.data?.map((user, index) => (
                  <tr key={user.id}>
                    {/* <td className="w-px whitespace-nowrap px-3 py-5 first:pl-5 last:pr-5">
                    <Checkbox
                      active={user.checked}
                      setActive={(value: boolean) => checkItem(index, value)}
                    />
                  </td> */}
                    <td className="whitespace-nowrap px-3 py-5 text-center first:pl-5 last:pr-5">
                      <span className="text-body-base font-medium text-netral-80">
                        {user.name}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-3 py-5 text-center first:pl-5 last:pr-5">
                      <span className="text-body-base font-medium text-netral-80">
                        {user.email}
                      </span>
                    </td>

                    <td className="w-56 whitespace-pre-wrap px-3 py-5 text-center first:pl-5 last:pr-5">
                      <span
                        className={`whitespace-pre-wrap break-words rounded-full px-3 py-1 text-body-base font-medium ${
                          user.status === "active"
                            ? "bg-success-main/20 text-success-main"
                            : "bg-error-main/20 text-error-main"
                        }`}
                      >
                        {user.status === "active"
                          ? "مفعل"
                          : user.status === "inactive"
                          ? "غير مفعل"
                          : ""}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-3 py-5 text-center first:pl-5 last:pr-5">
                      <span className="text-body-base font-medium text-netral-80">
                        {user.role}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-3 py-5 text-center first:pl-5 last:pr-5">
                      <span className="text-body-base font-medium text-netral-80">
                        {user.nationality}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-3 py-5 text-center first:pl-5 last:pr-5">
                      <Link href={`/customers/${user.id}/details?from=${page}`}>
                        <Button size="md" variant="primary-nude" type="button">
                          التفاصيل
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          page={page}
          setPage={setPage}
          lastPage={data?.meta?.last_page as number}
        />
      </section>

      {/* Page Action */}
      {/* {isSelecting && (
        <PageAction
          variant="sticky"
          actionLabel="2 Product Selected"
          btnPrimaryLabel="Delete"
          btnPrimaryVariant="error-bg"
          btnPrimaryFun={() => setOpenModalDelete(true)}
        />
      )} */}

      <Modal
        variant="error"
        open={openModalDelete}
        title="حذف مستخدم"
        className="max-w-lg"
        setOpen={setOpenModalDelete}
      >
        <main className="mb-10 mt-4">
          <p className="text-body-base text-netral-80">
            هل أنت متأكد من أنك تريد حذف هذا المستخدم؟ لا يمكن استرداد المستخدم
            الذي تم حذفه بالفعل.
          </p>
        </main>

        <footer className="flex w-full justify-end gap-3">
          <Button
            size="md"
            variant="default-nude"
            onClick={() => setOpenModalDelete(false)}
          >
            إلغاء
          </Button>
          <Button
            size="md"
            variant="error-bg"
            onClick={() => {
              setOpenModalDelete(false);
              setOpenAlertsDelete(true);
            }}
          >
            حذف
          </Button>
        </footer>
      </Modal>

      <Alerts
        variant="error"
        open={openAlertsDelete}
        setOpen={setOpenAlertsDelete}
        title="تم حذف المستخدمين"
        desc="لا يمكن استرداد المستخدم الذي تم حذفه بالفعل."
      />
    </div>
  );
};

export default DBCustomersUsers;
