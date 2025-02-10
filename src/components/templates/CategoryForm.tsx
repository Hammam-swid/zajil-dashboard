"use client";
import { ProductCategory } from "@/types";
import { useFormik } from "formik";
import React, { useCallback } from "react";
import { Button, Input } from "../atomics";
import { HexColorInput, HexColorPicker } from "react-colorful";
import { useDropzone } from "react-dropzone";
import { Upload, UploadCloud } from "lucide-react";
import NextImage from "next/image";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { headers } from "next/headers";

interface CategoryFormProps {
  parent: ProductCategory | null;
  category?: ProductCategory;
  hideForm?: () => void;
}

interface CategoryFormValues {
  name: string;
  description: string;
  image: File | string;
  background_color: string;
  text_color: string;
  parent_id: number | null;
}

export default function CategoryForm({ parent, category }: CategoryFormProps) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationKey: [category ? "update-category" : "create-category"],
    mutationFn: async (values: CategoryFormValues) => {
      console.log(values);
      if (category) {
        return await updateCategory(values);
      } else {
        return await addCategory(values);
      }
    },
    // category ? await updateCategory(values) : await addCategory(values),
    onSuccess: () => {
      formik.resetForm();
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (e) => {
      console.log(e);
    },
  });
  const formik = useFormik<CategoryFormValues>({
    initialValues: {
      name: category?.name || "",
      description: category?.description || "",
      parent_id: parent?.id || null,
      image: category?.image || "",
      background_color: category?.background_color || "FFFFFF",
      text_color: category?.text_color || "000000",
    },
    onSubmit: (values) => {
      values.image =
        "https://static.vecteezy.com/system/resources/previews/041/290/593/non_2x/ai-generated-short-sleeves-black-tshirt-isolated-on-a-transparent-background-free-png.png";
      mutation.mutate(values);
    },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    formik.setFieldValue("image", acceptedFiles[0]);
    console.log(acceptedFiles[0]);
  }, []);
  const {
    getInputProps,
    getRootProps,
    isDragActive,
    isDragAccept,
    acceptedFiles,
  } = useDropzone({ onDrop });
  return (
    <form onSubmit={formik.handleSubmit}>
      <h4>
        {parent ? (
          <>
            <span>إضافة فئة فرعية لـ</span> <span>{parent?.name}</span>
          </>
        ) : (
          <span>إضافة فئة أساسية</span>
        )}
      </h4>
      <div className="mt-4 flex flex-col gap-3">
        <Input
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          message={formik.errors.name}
          variant={
            formik.touched.name && formik.errors.name
              ? "default-error"
              : "default"
          }
          label="اسم الفئة"
          id="name"
          placeholder="أدخل اسم الفئة هنا"
        />
        <div>
          <label className="text-body-base" htmlFor="description">
            وصف الفئة
          </label>
          <textarea
            id="description"
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="أدخل وصف الفئة هنا"
            className="h-20 w-full rounded-lg-10 border border-netral-30 p-3.5 text-body-base shadow-1 outline-none ring-[2.5px] ring-transparent transition-all duration-300 ease-out focus:border-primary-border focus:ring-primary-surface disabled:bg-netral-20"
          />
        </div>
        <div
          {...getRootProps()}
          className="h-40 rounded-md bg-primary-surface p-6"
        >
          <input type="file" {...getInputProps()} />
          {acceptedFiles.length > 0 ? (
            <NextImage
              src={URL.createObjectURL(acceptedFiles[0])}
              width={100}
              height={100}
              alt="image"
            />
          ) : (
            <UploadCloud className="h-full w-full" />
          )}
          {isDragAccept && (
            <p className="text-green-500">Drop the files here ...</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="background_color">اللون الخلفي للفئة</label>
            <HexColorPicker
              id="background_color"
              color={formik.values.background_color}
              onChange={(newColor) =>
                formik.setFieldValue("background_color", newColor)
              }
            />
            <HexColorInput
              className="mt-2 block rounded-lg-10 border border-netral-30 p-3.5 text-body-base shadow-1 outline-none ring-[2.5px] ring-transparent transition-all duration-300 ease-out focus:border-primary-border focus:ring-primary-surface disabled:bg-netral-20"
              color={formik.values.background_color}
              onChange={(newColor) =>
                formik.setFieldValue("background_color", newColor)
              }
            />
          </div>
          <div>
            <label htmlFor="text_color">لون نص الفئة</label>
            <HexColorPicker
              id="text_color"
              color={formik.values.text_color}
              onChange={(newColor) =>
                formik.setFieldValue("text_color", newColor)
              }
            />
            <HexColorInput
              className="mt-2 block rounded-lg-10 border border-netral-30 p-3.5 text-body-base shadow-1 outline-none ring-[2.5px] ring-transparent transition-all duration-300 ease-out focus:border-primary-border focus:ring-primary-surface disabled:bg-netral-20"
              color={formik.values.text_color}
              onChange={(newColor) =>
                formik.setFieldValue("text_color", newColor)
              }
            />
          </div>
        </div>
        <Button variant="primary-bg" type="submit">
          إضافة الفئة
        </Button>
      </div>
    </form>
  );
}

const addCategory = async (values: CategoryFormValues) => {
  console.log(values);
  const formData = new FormData();
  formData.append("name", values.name);
  formData.append("description", values.description);
  formData.append("image", values.image);
  formData.append("background_color", values.background_color.slice(1));
  formData.append("text_color", values.text_color.slice(1));
  if (values.parent_id)
    formData.append("parent_id", values.parent_id?.toString() || "null");
  const res = await api.post("/product-categories", formData);
  const { data } = res;
  return data;
};

const updateCategory = async (values: CategoryFormValues) => {
  const formData = new FormData();
  formData.append("name", values.name);
  formData.append("description", values.description);
  formData.append("image", values.image);
  formData.append("background_color", values.background_color);
  formData.append("text_color", values.text_color);
  formData.append("parent_id", values.parent_id?.toString() || "null");
  const res = await api.patch("/api/product-categories", {
    formData,
  });
  const { data } = res;
  return data;
};
