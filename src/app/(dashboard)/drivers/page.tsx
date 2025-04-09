"use client";
import React, { useState } from "react";
import { Modal, PageAction } from "@/components/moleculs";
import {
  Alerts,
  Badge,
  Button,
  Checkbox,
  Input,
  Pagination,
  Title,
} from "@/components/atomics";
import { FunnelIcon, PlusIcon, SortAscendingIcon } from "@/assets/icons";
import Link from "next/link";
import { Driver, User } from "@/types";
import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Loader, Loader2, TriangleAlert } from "lucide-react";
import { AxiosError } from "axios";

const getDrivers = async (page: number, search: string) => {
  const searchQuery = search ? `&search=${search}` : "";
  const res = await api.get<{ data: Driver[]; meta: { last_page: number } }>(
    `/dashboards/drivers?perPage=10&page=${page}${searchQuery}`
  );
  console.log(res);
  return res.data;
};

const DBDriversUsers = () => {
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState("");
  const { data, isLoading, isError, error } = useQuery<
    { data: Driver[]; meta: { last_page: number } },
    AxiosError<{ message: string }>
  >({
    queryKey: ["drivers", { page }, { search }],
    queryFn: () => getDrivers(page, search),
  });
  const drivers = data?.data || [];
  const lastPage = data?.meta.last_page || 1;

  return (
    <div className="relative space-y-6 p-6">
      <section className="relative rounded-lg-10 bg-white p-6">
        <Title size="lg" variant="default">
          السائقين
        </Title>
        <nav className="mb-8 mt-3 flex items-center justify-between">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (searchText) setSearch(searchText);
            }}
          >
            <Input
              placeholder="ابحث عن سائق"
              id="searchText"
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                if (!e.target.value) {
                  setSearch("");
                }
              }}
            />
          </form>
          <div className="flex flex-row gap-3">
            <Link href="/drivers/add">
              <Button type="button" size="md" variant="primary-bg">
                <span>أضف سائق</span>
                <PlusIcon className="h-4 w-4 text-neutral-50" />
              </Button>
            </Link>
            <Button type="button" size="md" variant="default-bg">
              ترتيب
              <SortAscendingIcon className="h-4 w-4 stroke-netral-100 stroke-[4px]" />
            </Button>

            <Button type="button" size="md" variant="default-bg">
              تصفية
              <FunnelIcon className="h-4 w-4 stroke-netral-100 stroke-[4px]" />
            </Button>
          </div>
        </nav>

        <div className="mb-6 overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="bg-netral-15 text-body-sm font-semibold uppercase">
              <tr>
                <th className="whitespace-nowrap px-3 py-4 text-center text-netral-50 first:pl-5 last:pr-5">
                  <span className="text-body-sm font-semibold">الاسم</span>
                </th>

                <th className="whitespace-nowrap px-3 py-4 text-center text-netral-50 first:pl-5 last:pr-5">
                  <span className="text-body-sm font-semibold">رقم الهاتف</span>
                </th>

                <th className="w-56 whitespace-nowrap px-3 py-4 text-center text-netral-50 first:pl-5 last:pr-5">
                  <span className="text-body-sm font-semibold">المنطقة</span>
                </th>

                <th className="whitespace-nowrap px-3 py-4 text-center text-netral-50 first:pl-5 last:pr-5">
                  <span className="text-body-sm font-semibold">الحالة</span>
                </th>

                <th className="whitespace-nowrap px-3 py-4 text-center text-netral-50 first:pl-5 last:pr-5">
                  <span className="text-body-sm font-semibold">
                    حالة الاتصال
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
                  <td className="whitespace-nowrap px-3 py-5 text-center first:pl-5 last:pr-5">
                    <span className="text-body-base font-medium text-netral-80">
                      {error?.response?.data?.message || (
                        <>
                          حدث خطأ ما <TriangleAlert />
                        </>
                      )}
                    </span>
                  </td>
                </tr>
              ) : !isLoading ? (
                drivers && drivers?.length > 0 ? (
                  drivers?.map((item) => (
                    <tr key={item.id}>
                      <td className="whitespace-nowrap px-3 py-5 text-center first:pl-5 last:pr-5">
                        <span className="text-body-base font-medium text-netral-80">
                          {item.user?.name}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-3 py-5 text-center first:pl-5 last:pr-5">
                        <span className="text-body-base font-medium text-netral-80">
                          {item.user?.phones && item.user?.phones[0]?.phone}
                        </span>
                      </td>

                      <td className="w-56 whitespace-pre-wrap px-3 py-5 text-center first:pl-5 last:pr-5">
                        <span className="whitespace-pre-wrap break-words text-body-base font-medium text-netral-80">
                          {item.region?.name}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-3 py-5 text-center first:pl-5 last:pr-5">
                        <span className="text-body-base font-medium text-netral-80">
                          {item.isAvailable ? "متاح" : "غير متاح"}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-3 py-5 text-center first:pl-5 last:pr-5">
                        <Badge variant={item.isOnline ? "success" : "error"}>
                          {item.isOnline ? "متصل" : "غير متصل"}
                        </Badge>
                      </td>

                      <td className="whitespace-nowrap px-3 py-5 text-center first:pl-5 last:pr-5">
                        <Link
                          className="mx-auto block w-fit text-center "
                          href={`/drivers/${item.id}/details`}
                        >
                          <Button size="md" variant="primary-nude">
                            التفاصيل
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-10 text-center">
                      <span className="text-body-base font-medium text-netral-80">
                        لا يوجد أي سائق
                      </span>
                    </td>
                  </tr>
                )
              ) : (
                <tr>
                  <td colSpan={6} className="py-10 text-center">
                    <Loader2 className="mx-auto h-16 w-16 animate-spin text-primary-main" />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination  required from the backend first*/}
        {lastPage > 1 && (
          <Pagination page={page} setPage={setPage} lastPage={lastPage} />
        )}
      </section>
    </div>
  );
};

export default DBDriversUsers;
