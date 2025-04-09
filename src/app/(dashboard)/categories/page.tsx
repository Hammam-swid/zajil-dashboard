"use client";
import React, { Suspense, useState } from "react";

import { Modal } from "@/components/moleculs";
import { Button, Title } from "@/components/atomics";

import { PlusIcon } from "@/assets/icons";
import { CategoriesList } from "@/components/moleculs/CategoriesList";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { ProductCategory } from "@/types";
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
  const [openAddModal, setOpenAddModal] = useState(false);
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
    </div>
  );
};

export default DBCategories;
