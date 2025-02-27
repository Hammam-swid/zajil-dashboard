"use client";

import api from "@/lib/api";
import { ProductCategory, Variation } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import { Button } from "../atomics";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save } from "lucide-react";

interface CategoryVariationsProps {
  category: ProductCategory;
  hideForm: () => void;
}
interface FormValues {
  selected: number[];
  inSelected: number[];
}

const getVariations = async () => {
  const res = await api.get("/variations");
  return res.data.data as Variation[];
};
const getCategoryVariations = async (category: ProductCategory) => {
  const res = await api.get(`/product-categories/${category.id}/variations`);
  return res.data.data as Variation[];
};
export default function CategoryVariations({
  category,
  hideForm,
}: CategoryVariationsProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: allVariations, isLoading: isAllLoading } = useQuery({
    queryKey: ["variations"],
    queryFn: getVariations,
  });
  const { data: categoryVariations, isLoading: isThisLoading } = useQuery({
    queryKey: ["category-variations", category.id],
    queryFn: () => getCategoryVariations(category),
  });
  const mutation = useMutation({
    mutationKey: ["category-variations", category.id],
    mutationFn: (values: FormValues) => addVariations(values, category),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["category-variations", category.id],
      });
      formik.resetForm();
      hideForm();
      const t = toast({
        title: "إضافة متغيرات",
        description: "تمت إضافة المتغيرات بنجاح",
      });
      setTimeout(t.dismiss, 3000);
    },
    onError: (e) => {
      const t = toast({
        title: "حدث خطأ",
        description: "حدث خطأ أثناء إضافة المتغيرات",
        variant: "destructive",
      });
      setTimeout(t.dismiss, 3000);
    },
  });
  const formik = useFormik<FormValues>({
    initialValues: {
      selected: [],
      inSelected: [],
    },
    onSubmit: (v) => {
      mutation.mutate(v);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <h3>متغيرات لفئة {category.name}</h3>
      {isAllLoading || isThisLoading ? (
        <Loader2 className="mx-auto h-14 w-14 animate-spin text-primary-main" />
      ) : (
        <div className="mt-6 grid grid-cols-6 gap-3">
          {allVariations?.map((v) => {
            const isAlreadySelected = categoryVariations?.some(
              (cv) => cv.id === v.id
            );
            const isSelectedNow =
              (isAlreadySelected && !formik.values.inSelected.includes(v.id)) ||
              formik.values.selected.includes(v.id);
            return (
              <div
                className={`rounded-md ${
                  isSelectedNow
                    ? "bg-primary-main text-primary-surface"
                    : "text-primary-main"
                } cursor-pointer text-center`}
                key={v.id}
              >
                <label htmlFor={`variation-${v.id}`} className="cursor-pointer">
                  {v.name}
                </label>
                <input
                  value={v.id}
                  checked={isSelectedNow}
                  onChange={(e) => {
                    if (!isAlreadySelected) {
                      if (e.target.checked) {
                        formik.setFieldValue("selected", [
                          ...formik.values.selected,
                          v.id,
                        ]);
                      } else {
                        formik.setFieldValue(
                          "selected",
                          formik.values.selected.filter((s) => s !== v.id)
                        );
                      }
                    } else {
                      if (e.target.checked) {
                        formik.setFieldValue(
                          "inSelected",
                          formik.values.inSelected.filter((s) => s !== v.id)
                        );
                      } else {
                        formik.setFieldValue("inSelected", [
                          ...formik.values.inSelected,
                          v.id,
                        ]);
                      }
                    }
                  }}
                  name="selected"
                  id={`variation-${v.id}`}
                  type="checkbox"
                  className="hidden"
                />
              </div>
            );
          })}
        </div>
      )}
      <Button
        disabled={mutation.isPending || isAllLoading || isThisLoading}
        variant="primary-bg"
        className="mt-6 w-full disabled:opacity-50"
        type="submit"
      >
        {mutation.isPending ? (
          <Loader2 className="animate-spin" />
        ) : (
          <>
            حفظ
            <Save />
          </>
        )}
      </Button>
    </form>
  );
}

const addVariations = async (values: FormValues, category: ProductCategory) => {
  await api.post(`/product-categories/${category.id}/assign-variations`, {
    variations: values.selected,
  });
};
