"use client";

import React, { useState } from "react";
import Image from "next/image";

import { Modal } from "@/components/moleculs";
import {
  Alerts,
  Button,
  Checkbox,
  Input,
  Pagination,
  Title,
} from "@/components/atomics";

import {
  CheckIcon,
  FunnelIcon,
  PlusIcon,
  SortAscendingIcon,
} from "@/assets/icons";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Store } from "@/types";
import Link from "next/link";

const getStores = async (page: number, search: string) => {
  const searchQuery = search ? `&search=${search}` : "";
  const res = await api.get<{ data: Store[] }>(
    `/stores?per_page=10&page=${page}${searchQuery}`
  );
  return res.data as { data: Store[]; meta: { last_page: number } };
};

const Page = () => {
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["stores", { page }, { search }],
    queryFn: () => getStores(page, search),
    staleTime: 1000 * 60 * 5,
  });
  //----------------------------------------------------------------------------------------//

  const [openModalDraft, setOpenModalDraft] = React.useState(false);
  const [openModalDelete, setOpenModalDelete] = React.useState(false);
  const [openAlertsDraft, setOpenAlertsDraft] = React.useState(false);
  const [openAlertsDelete, setOpenAlertsDelete] = React.useState(false);
  //----------------------------------------------------------------------------------------//

  return (
    <div className="relative space-y-6 p-6">
      <h1 className="text-heading-sm font-semibold">المتاجر</h1>

      <section className="relative rounded-lg-10 bg-white p-6">
        <nav className="mb-8 flex items-center justify-between">
          <form
            className="w-64"
            onSubmit={(e) => {
              e.preventDefault();
              setSearch(searchText);
              if (page !== 1) setPage(1);
            }}
          >
            <Input
              id="search"
              type="text"
              placeholder="البحث عن متجر"
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                if (e.target.value === "") setSearch("");
              }}
            />
          </form>

          <div className="flex flex-row gap-3">
            <Button size="md" variant="default-bg">
              Sort
              <SortAscendingIcon className="h-4 w-4 stroke-netral-100 stroke-[4px]" />
            </Button>

            <Button size="md" variant="default-bg">
              Filter
              <FunnelIcon className="h-4 w-4 stroke-netral-100 stroke-[4px]" />
            </Button>

            <Link href="/stores/add">
              <Button size="md" variant="primary-bg">
                إضافة متجر جديد
                <PlusIcon className="h-4 w-4 stroke-white stroke-[4px]" />
              </Button>
            </Link>
          </div>
        </nav>

        {/* Table */}
        <div className="mb-6 overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="bg-netral-15 text-body-sm font-semibold uppercase">
              <tr>
                <th className="whitespace-nowrap px-3 py-4 text-center text-netral-50 first:pl-5 last:pr-5">
                  <span className="text-body-sm font-semibold">المتجر</span>
                </th>

                <th className="whitespace-nowrap px-3 py-4 text-center text-netral-50 first:pl-5 last:pr-5">
                  <span className="text-body-sm font-semibold">التصنيفات</span>
                </th>

                <th className="w-56 whitespace-nowrap px-3 py-4 text-center text-netral-50 first:pl-5 last:pr-5">
                  <span className="text-body-sm font-semibold">
                    متوسط التقييمات
                  </span>
                </th>

                <th className="whitespace-nowrap px-3 py-4 text-center text-netral-50 first:pl-5 last:pr-5">
                  <span className="text-body-sm font-semibold">
                    عدد المتابعين
                  </span>
                </th>

                <th className="whitespace-nowrap px-3 py-4 text-center text-netral-50 first:pl-5 last:pr-5">
                  <span className="text-body-sm font-semibold">الموقع</span>
                </th>

                <th className="whitespace-nowrap px-3 py-4 text-center text-netral-50 first:pl-5 last:pr-5">
                  <span className="text-body-sm font-semibold">الإجراءات</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-netral-20 pt-4 text-sm">
              {!isLoading
                ? data?.data?.map((store) => (
                    <tr key={store.id}>
                      <td className="whitespace-nowrap px-3 py-5 text-start first:pl-5 last:pr-5">
                        <div className="flex items-center gap-3">
                          <div className="relative h-20 w-20 overflow-hidden rounded-lg-10">
                            <Image
                              src={store.image}
                              className="h-full w-full object-cover"
                              alt={"شعار " + store.name}
                              width={80}
                              height={80}
                            />
                          </div>

                          <span className="w-48 whitespace-pre-wrap break-words text-body-base font-medium text-netral-80">
                            <p className="font-bold">{store.name}</p>
                            <p className="text-body-sm text-netral-50">
                              {store.description}
                            </p>
                          </span>
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-3 py-5 text-center first:pl-5 last:pr-5">
                        <span className="text-body-base font-medium capitalize text-netral-80">
                          {store.categories_string}
                        </span>
                      </td>

                      <td className="w-56 whitespace-pre-wrap px-3 py-5 text-center capitalize first:pl-5 last:pr-5">
                        {Number(store.average_rating).toFixed(2)}
                      </td>

                      <td className="whitespace-nowrap px-3 py-5 text-center first:pl-5 last:pr-5">
                        <span className="text-body-base font-medium text-netral-80">
                          {store.number_of_followers}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-3 py-5 text-center first:pl-5 last:pr-5">
                        <span className="text-body-base font-medium capitalize text-netral-80">
                          {store.location?.address}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-3 py-5 text-center first:pl-5 last:pr-5">
                        <Link href={`/stores/${store.id}/details`}>
                          <Button size="md" variant="primary-nude">
                            التفاصيل
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                : [1, 2, 3, 4].map((e) => {
                    const random = Math.floor(Math.random() * 200);
                    return <Skeleton key={e} width={random} />;
                  })}
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
          btnSecondaryLabel="Draft"
          btnsecondaryVariant="warning-outline"
          btnSecondaryFun={() => setOpenModalDraft(true)}
        />
      )} */}

      <Modal
        variant="error"
        open={openModalDelete}
        title="Delete User"
        className="max-w-lg"
        setOpen={setOpenModalDelete}
      >
        <main className="mb-10 mt-4">
          <p className="text-body-base text-netral-80">
            Are you sure want to delete this user? User which already deleted
            can not be recovered.
          </p>
        </main>

        <footer className="flex w-full justify-end gap-3">
          <Button
            size="md"
            variant="default-nude"
            onClick={() => setOpenModalDelete(false)}
          >
            Cancel
          </Button>
          <Button
            size="md"
            variant="error-bg"
            onClick={() => {
              setOpenModalDelete(false);
              setOpenAlertsDelete(true);
            }}
          >
            Submit
          </Button>
        </footer>
      </Modal>

      <Alerts
        variant="error"
        open={openAlertsDelete}
        setOpen={setOpenAlertsDelete}
        title="Product has been deleted"
        desc="Product which already deleted can not be recovered."
      />

      <Modal
        variant="warning"
        open={openModalDraft}
        title="Draft Product"
        className="max-w-lg"
        setOpen={setOpenModalDraft}
      >
        <main className="mb-10 mt-4">
          <p className="text-body-base text-netral-80">
            Are you sure want to draft this product?
          </p>
        </main>

        <footer className="flex w-full justify-end gap-3">
          <Button
            size="md"
            variant="default-nude"
            onClick={() => setOpenModalDraft(false)}
          >
            Cancel
          </Button>
          <Button
            size="md"
            variant="warning-bg"
            onClick={() => {
              setOpenModalDraft(false);
              setOpenAlertsDraft(true);
            }}
          >
            Draft
          </Button>
        </footer>
      </Modal>

      <Alerts
        variant="warning"
        open={openAlertsDraft}
        setOpen={setOpenAlertsDraft}
        title="Product drafted"
        desc="Product which already drafted can be recovered."
      />
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
