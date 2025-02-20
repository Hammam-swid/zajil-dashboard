"use client";
import { useFormik } from "formik";
import { Button, Input } from "../atomics";
import * as Yup from "yup";
import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const createDriver = async (values: { name: string }) => {
  const res = await api.post("/dashboards/cities", values);
  return res.data;
};

export default function AddCityForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (values: { name: string }) => createDriver(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cities"] });
    },
    onError: (e) => {
      console.log(e);
    },
  });
  const formik = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("الاسم مطلوب"),
    }),
    onSubmit: (values, helpers) => {
      mutation.mutate(values, {
        onSuccess: () => {
          helpers.resetForm();
          const t = toast({
            title: "تمت الاضافة بنجاح",
            description: "تمت الاضافة بنجاح",
          });
          setTimeout(() => t.dismiss(), 3000);
        },
        onError: (e) => {
          console.log(e);
          const t = toast({
            title: "حدث خطأ",
            description: "حدث خطأ أثناء الاضافة",
            variant: "destructive",
          });
          setTimeout(() => t.dismiss(), 3000);
        },
      });

      return;
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <h3 className="text-center text-lg font-bold">إضافة مدينة جديدة</h3>
      <Input
        value={formik.values.name}
        message={
          formik.touched.name && formik.errors.name ? formik.errors.name : ""
        }
        variant={
          formik.touched.name && formik.errors.name
            ? "default-error"
            : "default"
        }
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        id="name"
        label="الاسم"
        type="text"
        placeholder="اسم المدينة"
      />
      <Button
        variant="primary-bg"
        className="mt-8 w-full font-bold"
        type="submit"
      >
        {!formik.isSubmitting ? (
          "إضافة"
        ) : (
          <Loader2 className="h-8 w-8 animate-spin" />
        )}
      </Button>
    </form>
  );
}
