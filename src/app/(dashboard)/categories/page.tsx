"use client";
import React, { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { Tab } from "@headlessui/react";

import { Modal, PageAction } from "@/components/moleculs";
import { Alerts, Badge, Button, Checkbox, Title } from "@/components/atomics";

import {
  ArrowRightIcon,
  FunnelIcon,
  ListIcon,
  PlusIcon,
  SortAscendingIcon,
  SquaresFourIcon,
} from "@/assets/icons";
import { CategoriesList } from "@/components/moleculs/CategoriesList";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { ProductCategory } from "@/types";
const getCategories = async (): Promise<ProductCategory[]> => {
  const res = await api.get("/product-categories");
  console.log(res);
  return res.data.data as ProductCategory[];
};

const DBCategories = () => {
  const { isLoading, data } = useQuery({
    queryKey: ["categories"],
    staleTime: 1000 * 60 * 5,
    queryFn: getCategories,
  });
  // ------------------------------------------------------------------------------ //
  const [isEmpty, setIsEmpty] = React.useState(true);
  // ------------------------------------------------------------------------------ //
  const [listCategoriesData, setListCategoriesData] = React.useState([
    {
      categoryImage: "/categories/categories-1.png",
      checked: false,
    },
    {
      categoryImage: "/categories/categories-2.png",
      checked: false,
    },
    {
      categoryImage: "/categories/categories-3.png",
      checked: false,
    },
    {
      categoryImage: "/categories/categories-4.png",
      checked: false,
    },
    {
      categoryImage: "/categories/categories-5.png",
      checked: false,
    },
  ]);
  // ------------------------------------------------------------------------------ //
  const checkItem = (index: number, checked: boolean) => {
    const newListCategoriesData = [...listCategoriesData];
    newListCategoriesData[index].checked = checked;
    setListCategoriesData(newListCategoriesData);
  };
  const isSelectAll = React.useMemo(
    () => listCategoriesData.filter((item) => !item.checked).length === 0,
    [listCategoriesData]
  );
  const setIsSelectAll = (newIsSelectAll: boolean) => {
    setListCategoriesData(
      listCategoriesData.map((item) => ({ ...item, checked: newIsSelectAll }))
    );
  };
  const isSelecting = React.useMemo(
    () => listCategoriesData.filter((item) => item.checked).length > 0,
    [listCategoriesData]
  );
  // ------------------------------------------------------------------------------ //
  const [openModalDelete, setOpenModalDelete] = React.useState(false);
  const [openModalDraft, setOpenModalDraft] = React.useState(false);
  // ------------------------------------------------------------------------------ //
  const [openAlertsDelete, setOpenAlertsDelete] = React.useState(false);
  const [openAlertsDraft, setOpenAlertsDraft] = React.useState(false);
  // ------------------------------------------------------------------------------ //
  return (
    <div className="relative min-h-screen space-y-6 p-6">
      <h1 className="text-heading-sm font-semibold">الأقسام</h1>

      <section className="relative space-y-6 rounded-lg-10 bg-white p-6">
        {/* Navigation */}
        <nav className="space-y-6">
          <div className="flex items-center justify-between">
            <Title size="lg" variant="default">
              قائمة الفئات
            </Title>

            <div className="flex flex-row gap-3">
              <Link href={"/categories/add"}>
                <Button size="md" variant="primary-bg">
                  <PlusIcon className="h-4 w-4 fill-white stroke-white stroke-[4px]" />
                  إضافة فئة
                </Button>
              </Link>
              <Button size="md" variant="default-bg">
                ترتيب
                <SortAscendingIcon className="h-4 w-4 stroke-netral-100 stroke-[4px]" />
              </Button>

              <Button size="md" variant="default-bg">
                تصفية
                <FunnelIcon className="h-4 w-4 stroke-netral-100 stroke-[4px]" />
              </Button>
            </div>
          </div>
        </nav>

        <Suspense fallback={<p>Loading...</p>}>
          <CategoriesList categories={data as ProductCategory[]} />
        </Suspense>
      </section>

      {/* Page Action */}
      {isSelecting && (
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
      )}

      <Modal
        variant="error"
        open={openModalDelete}
        title="Delete Category"
        className="max-w-lg"
        setOpen={setOpenModalDelete}
      >
        <main className="mb-10 mt-4">
          <p className="text-body-base text-netral-80">
            Are you sure want to delete this category? Category which already
            deleted can not be recovered.
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
        title="Category has been deleted"
        desc="Category which already deleted can not be recovered."
      />

      <Modal
        variant="warning"
        open={openModalDraft}
        title="Draft Category"
        className="max-w-lg"
        setOpen={setOpenModalDraft}
      >
        <main className="mb-10 mt-4">
          <p className="text-body-base text-netral-80">
            Are you sure want to draft this category?{" "}
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
        title="Category has been drafted"
        desc="Don't worry, you can access drafted categories. "
      />
    </div>
  );
};

export default DBCategories;
