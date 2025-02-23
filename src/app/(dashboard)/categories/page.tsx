"use client";
import React, { Suspense, useState } from "react";
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
import { useAppSelector } from "@/store/hooks";
import CategoryForm from "@/components/templates/CategoryForm";
import { Loader2 } from "lucide-react";
const getCategories = async (): Promise<ProductCategory[]> => {
  const res = await api.get("/product-categories");
  console.log(res.data.data);
  return res.data.data as ProductCategory[];
};

const DBCategories = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["categories"],
    staleTime: 1000 * 60 * 5,
    queryFn: getCategories,
  });
  // ------------------------------------------------------------------------------ //
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

  const isSelecting = React.useMemo(
    () => listCategoriesData.filter((item) => item.checked).length > 0,
    [listCategoriesData]
  );
  // ------------------------------------------------------------------------------ //
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [openModalDraft, setOpenModalDraft] = useState(false);
  // ------------------------------------------------------------------------------ //
  const [openAlertsDelete, setOpenAlertsDelete] = useState(false);
  const [openAlertsDraft, setOpenAlertsDraft] = useState(false);
  // ------------------------------------------------------------------------------ //
  const [openAddModal, setOpenAddModal] = useState(false);
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
              <Button
                onClick={() => setOpenAddModal(true)}
                size="md"
                variant="primary-bg"
              >
                <PlusIcon className="h-4 w-4 fill-white stroke-white stroke-[4px]" />
                إضافة فئة أساسية
              </Button>
              <Modal
                open={openAddModal}
                setOpen={setOpenAddModal}
                variant="default"
                className="w-11/12 max-w-lg"
                title="إضافة فئة"
              >
                <CategoryForm parent={null} />
              </Modal>
            </div>
          </div>
        </nav>

        <Suspense fallback={<p>Loading...</p>}>
          {isLoading ? (
            <p>
              <Loader2 className="mx-auto mt-8 h-20 w-20 animate-spin text-primary-main" />
            </p>
          ) : data ? (
            <CategoriesList categories={data as ProductCategory[]} />
          ) : isError ? (
            <p>{error.message}</p>
          ) : (
            ""
          )}
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
