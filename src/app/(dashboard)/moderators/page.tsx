"use client";
import React, { useState } from "react";

import { Button, Input, Pagination } from "@/components/atomics";

import { FunnelIcon, SortAscendingIcon } from "@/assets/icons";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { User } from "@/types";
import api from "@/lib/api";
import { Loader2 } from "lucide-react";
import dateFormat from "dateformat";
import Select, { Options } from "react-select";

const getAdmins = async (page: number, search?: string, status?: string) => {
  const searchQuery = search ? `&search=${search}` : "";
  const statusQuery = status && status !== "all" ? `&status=${status}` : "";
  const res = await api.get(
    `/dashboards/admins?per_page=10&page=${page}${searchQuery}${statusQuery}`
  );
  console.log(res.data.data);
  res.data.data = res.data.data.map((user: User) => ({
    ...user,
    createdAt: user.createdAt ? new Date(user.createdAt) : undefined,
    updatedAt: user.updatedAt ? new Date(user.updatedAt) : undefined,
  }));
  return res.data as { data: User[]; meta: { last_page: number } };
};

const statusOptions: Options<{ value: string; label: string }> = [
  { value: "all", label: "الكل" },
  { value: "active", label: "مفعل" },
  { value: "inactive", label: "غير مفعل" },
];

const DBAdminsUsers = () => {
  const [search, setSearch] = useState("");
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = React.useState(1);
  const [selectedStatus, setSelectedStatus] = useState<{
    value: string;
    label: string;
  }>({
    value: "all",
    label: "الكل",
  });
  const { data, isLoading, isError } = useQuery({
    queryKey: [
      "admins-users",
      { page },
      { search },
      { status: selectedStatus.value },
    ],
    queryFn: () => getAdmins(page, search, selectedStatus.value),
  });

  //----------------------------------------------------------------------------------//

  return (
    <div className="relative space-y-6 p-6">
      <h1 className="text-heading-sm font-semibold">المسؤولين</h1>

      <section className="relative rounded-lg-10 bg-white p-6">
        <nav className="mb-8 flex items-center justify-between">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSearch(searchText);
              if (page !== 1) setPage(1);
            }}
            className="w-64"
          >
            <Input
              id="search"
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                if (e.target.value === "") setSearch("");
              }}
              type="text"
              placeholder="ابحث عن مسؤول"
            />
          </form>

          <div className="flex flex-row items-center gap-3">
            <Button size="md" variant="default-bg">
              ترتيب
              <SortAscendingIcon className="h-4 w-4 stroke-netral-100 stroke-[4px]" />
            </Button>

            <Select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e as any)}
              options={statusOptions}
              placeholder="الحالة"
              isSearchable={false}
              noOptionsMessage={() => "لا يوجد خيارات"}
              className="w-44"
            />
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
                  <span className="text-body-sm font-semibold">الدور</span>
                </th>

                <th className="whitespace-nowrap px-3 py-4 text-center text-netral-50 first:pl-5 last:pr-5">
                  <span className="text-body-sm font-semibold">
                    تاريخ الانضمام
                  </span>
                </th>

                <th className="whitespace-nowrap px-3 py-4 text-center text-netral-50 first:pl-5 last:pr-5">
                  <span className="text-body-sm font-semibold">الإجراءات</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-netral-20 pt-4 text-sm">
              {isError ? (
                <tr>
                  <td className="py-10 text-center text-error-main" colSpan={8}>
                    حدث خطأ أثناء تحميل البيانات
                  </td>
                </tr>
              ) : isLoading ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center">
                    <Loader2 className="mx-auto h-20 w-20 animate-spin text-primary-main" />
                  </td>
                </tr>
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
                        {user.role || "لا يوجد"}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-3 py-5 text-center first:pl-5 last:pr-5">
                      <span className="text-body-base font-medium text-netral-80">
                        {user.createdAt
                          ? dateFormat(user.createdAt, "dd/MM/yyyy")
                          : "لا يوجد"}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-3 py-5 text-center first:pl-5 last:pr-5">
                      <Link
                        href={`/moderators/${user.id}/details?from-page=${page}&status=${selectedStatus.value}&search${search}`}
                      >
                        <Button
                          size="md"
                          className="mx-auto"
                          variant="primary-nude"
                          type="button"
                        >
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

        {data?.meta?.last_page && data?.meta?.last_page > 1 && (
          <Pagination
            page={page}
            setPage={setPage}
            lastPage={data?.meta?.last_page as number}
          />
        )}
      </section>
    </div>
  );
};

export default DBAdminsUsers;
