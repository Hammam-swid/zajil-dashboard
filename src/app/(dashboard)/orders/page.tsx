"use client";

import React, { useState } from "react";

import { Badge, Button, Input, Pagination, Title } from "@/components/atomics";

import { MagnifyingGlassIcon, StoreFrontIcon } from "@/assets/icons";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Order } from "@/types";
import Link from "next/link";
import { PackageIcon, UserIcon } from "lucide-react";
const getOrders = async (
  page: number,
  search: string,
  searchType: "order" | "user" = "order"
) => {
  const searchQuery = search
    ? `&${searchType === "order" ? "code" : "user"}=${search}`
    : "";
  const res = await api.get<{ data: Order[]; meta: { last_page: number } }>(
    `/dashboards/orders?per_page=10&page=${page}${searchQuery}`
  );
  return res.data;
};

const Page = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchType, setSearchType] = useState<"order" | "user">("order");
  const { data, isLoading } = useQuery({
    queryKey: ["orders", { page }, { search }],
    queryFn: () => getOrders(page, search, searchType),
    staleTime: 1000 * 30,
  });
  // ------------------------------------------------------------------------------//

  // ------------------------------------------------------------------------------//
  return (
    <div className="relative space-y-6 p-6">
      <h1 className="text-heading-sm font-semibold">الطلبيات</h1>

      <section className="relative space-y-6 rounded-lg-10 bg-white p-6">
        <nav className="space-y-6">
          <div className="flex items-center gap-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSearch(searchText);
                if (page !== 1) setPage(1);
              }}
              className="relative w-72 2xl:w-96"
            >
              <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-netral-50" />
              <input
                value={searchText}
                onChange={(e) => {
                  setSearchText(e.target.value);
                  if (e.target.value === "") {
                    setSearch("");
                  }
                }}
                className="w-full rounded-lg border border-transparent bg-netral-20 px-3.5 py-2 pl-11 outline-0 ring-2 ring-transparent transition-all duration-300 ease-out focus-within:ring-primary-surface focus:border-primary-main 2xl:py-2.5"
                placeholder={`البحث عن طريق ${
                  searchType === "order" ? "الكود" : "المستخدم"
                }`}
              />
            </form>
            <Button
              variant={searchType === "order" ? "primary-bg" : "primary-nude"}
              type="button"
              size="sm"
              onClick={() => setSearchType("order")}
            >
              <PackageIcon width={5} height={5} className="h-5 w-5" />
            </Button>
            <Button
              variant={searchType === "user" ? "primary-bg" : "primary-nude"}
              type="button"
              size="sm"
              onClick={() => setSearchType("user")}
            >
              <UserIcon className="h-5 w-5" />
            </Button>
          </div>
        </nav>

        {/* Table */}
        <div className="mb-6 overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="bg-netral-15 text-body-sm font-semibold uppercase">
              <tr>
                <th className="whitespace-nowrap px-3 py-4 text-center text-netral-50 first:rounded-l-lg first:pl-5 last:rounded-r-lg last:pr-5">
                  <span className="text-body-sm font-semibold">الكود</span>
                </th>

                <th className="whitespace-nowrap px-3 py-4 text-center text-netral-50 first:rounded-l-lg first:pl-5 last:rounded-r-lg last:pr-5">
                  <span className="text-body-sm font-semibold">المتجر</span>
                </th>

                <th className="whitespace-nowrap px-3 py-4 text-center text-netral-50 first:rounded-l-lg first:pl-5 last:rounded-r-lg last:pr-5">
                  <span className="text-body-sm font-semibold">العميل</span>
                </th>

                <th className="whitespace-nowrap px-3 py-4 text-center text-netral-50 first:rounded-l-lg first:pl-5 last:rounded-r-lg last:pr-5">
                  <span className="text-body-sm font-semibold">الحالة</span>
                </th>

                <th className="whitespace-nowrap px-3 py-4 text-center text-netral-50 first:rounded-l-lg first:pl-5 last:rounded-r-lg last:pr-5">
                  <span className="text-body-sm font-semibold">الاجمالي</span>
                </th>

                <th className="whitespace-nowrap px-3 py-4 text-center text-netral-50 first:rounded-l-lg first:pl-5 last:rounded-r-lg last:pr-5">
                  <span className="text-body-sm font-semibold">الإجراءات</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-netral-20 pt-4 text-sm">
              {!isLoading
                ? data?.data?.map((order) => (
                    <tr key={order.id}>
                      <td className="whitespace-nowrap px-3 py-5 text-center first:pl-5 last:pr-5">
                        <span className="text-body-base font-medium text-netral-80">
                          {order.code}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-3 py-5 text-center first:pl-5 last:pr-5">
                        <span className="text-body-base font-medium text-netral-80">
                          {order.store.name}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-3 py-5 text-center first:pl-5 last:pr-5">
                        <span className="text-body-base font-medium text-netral-80">
                          {order.user.name}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-3 py-5 text-center first:pl-5 last:pr-5">
                        <Badge
                          variant={
                            order.status === "in-transit"
                              ? "info"
                              : order.status === "canceled"
                              ? "error"
                              : order.status === "success"
                              ? "success"
                              : "error"
                          }
                        >
                          {order.status === "in-transit"
                            ? "جار التوصيل"
                            : order.status === "canceled"
                            ? "ملغية"
                            : order.status === "success"
                            ? "تم التوصيل"
                            : order.status}
                        </Badge>
                      </td>

                      <td className="whitespace-nowrap px-3 py-5 text-center first:pl-5 last:pr-5">
                        <span className="text-body-base font-medium text-netral-80">
                          {order.total}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-3 py-5 text-center first:pl-5 last:pr-5">
                        <Link href={`/orders/${order.id}/details`}>
                          <Button size="md" variant="primary-nude">
                            التفاصيل
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                : [...Array(5)].map((_, index) => (
                    <Skeleton key={index} width={100} />
                  ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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

function Skeleton({ width }: { width: number }) {
  return (
    <tr>
      <td className="whitespace-nowrap px-3 py-5">
        <span
          className={`w- mx-auto block h-8 w-[${
            width * 0.5
          }px] animate-pulse rounded-md bg-netral-40`}
        ></span>
      </td>
      <td className="whitespace-nowrap px-3 py-5 text-center">
        <span
          className={`mx-auto block h-8 w-[${
            width * 0.9
          }px] animate-pulse rounded-md bg-netral-40`}
        ></span>
      </td>
      <td className="whitespace-nowrap px-3 py-5 text-center">
        <span
          className={`mx-auto block h-8 w-[${
            width * 0.3
          }px] animate-pulse rounded-md bg-netral-40`}
        ></span>
      </td>
      <td className="whitespace-nowrap px-3 py-5 text-center">
        <span
          className={`mx-auto block h-8 w-[${
            width * 0.4
          }px] animate-pulse rounded-md bg-netral-40`}
        ></span>
      </td>
      <td className="whitespace-nowrap px-3 py-5 text-center">
        <span
          className={`mx-auto block h-8 w-[${
            width * 0.7
          }px] animate-pulse rounded-md bg-netral-40`}
        ></span>
      </td>
      <td className="whitespace-nowrap px-3 py-5 text-center">
        <span
          className={`mx-auto block h-8 w-[${
            width * 0.4
          }px] animate-pulse rounded-md bg-netral-40`}
        ></span>
      </td>
    </tr>
  );
}

export default Page;
