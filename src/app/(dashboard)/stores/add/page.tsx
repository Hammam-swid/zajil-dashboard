"use client";
import React, { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

import { Modal, PageAction } from "@/components/moleculs";
import { Button, Input, Title, Toggle } from "@/components/atomics";
import Select from "react-select";
import {
  PencilSimpleIcon,
  RepeatIcon,
  SelectionPlusIcon,
  TrashIcon,
  UploadSimpleIcon,
} from "@/assets/icons";
import Image from "next/image";
import { DropzoneIll } from "@/assets/illustration";
import { useDropzone } from "react-dropzone";
import { useFormik } from "formik";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { City } from "@/types";
import { Save, X } from "lucide-react";
import * as Yup from "yup";

interface FormValues {
  name: string;
  description: string;
  license_number: string;
  trading_license_number: string;
  passport: File | null;
  region: { label: string; value: number } | null;
  user_name: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
}
const validationSchema = Yup.object<FormValues>({
  name: Yup.string().required("الاسم مطلوب"),
  description: Yup.string().required("الوصف مطلوب"),
  license_number: Yup.string().required("رقم الرخصة مطلوب"),
  trading_license_number: Yup.string().required("رقم تجاري مطلوب"),
  passport: Yup.mixed().required("الصورة مطلوبة"),
  region: Yup.object().required("المنطقة مطلوبة"),
  user_name: Yup.string().required("اسم المستخدم مطلوب"),
  phone: Yup.string().required("رقم الهاتف مطلوب"),
  email: Yup.string()
    .email("البريد الإلكتروني غير صالح")
    .required("البريد الإلكتروني مطلوب"),
  password: Yup.string()
    .required("كلمة المرور مطلوبة")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
      "يجب أن يحتوي كلمة المرور على حرف ورقم ولا يقل عدد الأحرف عن 8"
    ),
  confirmPassword: Yup.string()
    .required("أدخل كلمة المرور مرة أخرى")
    .oneOf([Yup.ref("password")], "كلمات المرور غير متطابقة"),
});

const getCities = async () => {
  const res = await api.get<{ data: City[] }>("/dashboards/cities");
  console.log(res);
  return res.data.data;
};

const Page = () => {
  const { data: cities } = useQuery({
    queryKey: ["cities"],
    queryFn: getCities,
  });
  const [selectedCity, setSelectedCity] = useState<{
    value: number;
    label: string;
  } | null>(null);
  const formik = useFormik<FormValues>({
    initialValues: {
      name: "",
      description: "",
      license_number: "",
      trading_license_number: "",
      passport: null,
      region: null,
      user_name: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: (values, helpers) => {
      console.log(values);
    },
  });

  const regions = selectedCity
    ? cities?.find((city) => city.id === selectedCity.value)?.regions
    : [];

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // formik.setFieldValue("image", acceptedFiles[0]);
    console.log(acceptedFiles[0]);
  }, []);
  const {
    getInputProps,
    getRootProps,
    isDragActive,
    isDragAccept,
    acceptedFiles,
  } = useDropzone({ onDrop });

  const onProfileDrop = useCallback((acceptedFiles: File[]) => {
    // formik.setFieldValue("user.image", acceptedFiles[0]);
    console.log(acceptedFiles[0]);
  }, []);
  const {
    getInputProps: getInputPropsProfile,
    getRootProps: getRootPropsProfile,
    isDragActive: isDragActiveProfile,
    isDragAccept: isDragAcceptProfile,
    acceptedFiles: acceptedFilesProfile,
  } = useDropzone({ onDrop: onProfileDrop });

  const [activeState, setActiveState] = React.useState(1);
  const [openModalDropzone, setOpenModalDropzone] = React.useState(false);
  // -------------------------------------------------------------------------
  const nextState = () => {
    if (activeState > 1) {
      setOpenModalDropzone(false);
      setActiveState(1);
    } else {
      setActiveState(activeState + 1);
    }
  };
  // -------------------------------------------------------------------------

  return (
    <div className="relative space-y-6 p-6">
      <h1 className="text-heading-sm font-semibold">إضافة متجر</h1>

      <section className="relative w-full space-y-7 rounded-lg-10 bg-white p-6">
        <Title variant="default" size="lg">
          معلومات المتجر
        </Title>

        <form onSubmit={formik.handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div className="w-full border-b border-netral-20 py-7 first:border-y">
              <h5 className="space-y-2 text-body-base font-semibold">الاسم</h5>
              <Input
                type="text"
                id="name"
                variant="default"
                placeholder="أدخل اسم المتجر"
              />
            </div>

            <div className="w-full border-b border-netral-20 py-7 first:border-y">
              <h5 className="space-y-2 text-body-base font-semibold">
                رقم الرخصة التجارية
              </h5>

              <Input
                id="license-number"
                type="text"
                variant="default"
                placeholder="رقم الرخصة التجارية"
              />
            </div>

            <div className="w-full border-b border-netral-20 py-7 first:border-y">
              <label
                htmlFor="description"
                className="space-y-2 text-body-base font-semibold"
              >
                الوصف
              </label>

              <textarea
                id="description"
                className="w-full resize-none rounded-md p-3 outline outline-2 outline-netral-20 first:border-y focus:outline-2 focus:outline-primary-main"
                placeholder="أدخل وصف المتجر"
              />
            </div>

            <div className="w-full border-b border-netral-20 py-7 first:border-y">
              <h5 className="space-y-2 text-body-base font-semibold">
                رقم السجل التجاري
              </h5>

              <Input
                id="trading-license-number"
                type="text"
                variant="default"
                placeholder="رقم السجل التجاري"
              />
            </div>

            <div className="w-full border-b border-netral-20 py-7 first:border-y">
              <h5 className="space-y-2 text-body-base font-semibold">
                المدينة
              </h5>

              <Select
                options={cities?.map((city) => ({
                  value: city.id,
                  label: city.name,
                }))}
                value={selectedCity}
                onChange={(e) => {
                  setSelectedCity(e);
                  formik.setFieldValue("region", null);
                }}
                placeholder="اختر المدينة"
                noOptionsMessage={() => "لا يوجد مدن"}
              />
            </div>

            {selectedCity && (
              <div className="w-full border-b border-netral-20 py-7 first:border-y">
                <h5 className="space-y-2 text-body-base font-semibold">
                  المنطقة
                </h5>

                <Select
                  options={regions?.map((region) => ({
                    value: region.id,
                    label: region.name,
                  }))}
                  value={formik.values.region}
                  onChange={(e) => {
                    formik.setFieldValue("region", e);
                  }}
                  noOptionsMessage={() => "لا يوجد مناطق"}
                  placeholder="اختر المنطقة"
                  className=""
                />
              </div>
            )}
          </div>
          {/* photos section */}
          <div className="flex w-full items-start justify-between gap-8 border-b border-netral-20 py-7 first:border-y">
            <div className="w-full max-w-sm space-y-2">
              <h5 className="space-y-2 text-body-base font-semibold">
                صورة جواز السفر
              </h5>
              <p className="w-64 text-body-sm text-netral-50">
                Recommended minimum width 1080px X 1080px, with a max size of
                5MB, only *.png, *.jpg and *.jpeg image files are accepted
              </p>
            </div>

            <div
              {...getRootProps()}
              className={`group relative flex h-56 w-full max-w-[1000px] flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-netral-30 bg-netral-15`}
            >
              <input type="file" {...getInputProps()} accept="image/*" />
              <UploadSimpleIcon className="h-8 w-8 text-netral-50" />

              <Button
                type="button"
                size="sm"
                variant="primary-bg"
                className="mb-2 mt-5"
              >
                إضافة صورة
              </Button>

              <p className="text-center text-body-sm font-medium text-netral-50">
                أو قم بسحب الصورة هنا
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="w-full border-b border-netral-20 py-7 first:border-y">
              <h5 className="space-y-2 text-body-base font-semibold">
                اسم المستخدم
              </h5>
              <Input
                type="text"
                id="user_name"
                variant="default"
                placeholder="أدخل اسم المستخدم"
              />
            </div>

            <div className="w-full border-b border-netral-20 py-7 first:border-y">
              <h5 className="space-y-2 text-body-base font-semibold">
                البريد الإلكتروني
              </h5>

              <Input
                id="email"
                type="text"
                variant="default"
                placeholder="أدخل البريد الإلكتروني"
              />
            </div>

            <div className="w-full border-b border-netral-20 py-7 first:border-y">
              <h5 className="space-y-2 text-body-base font-semibold">
                رقم الهاتف
              </h5>

              <Input
                id="phone"
                type="text"
                variant="default"
                placeholder="أدخل رقم الهاتف"
              />
            </div>
            <div></div>

            <div className="w-full border-b border-netral-20 py-7 first:border-y">
              <h5 className="space-y-2 text-body-base font-semibold">
                كلمة المرور
              </h5>

              <Input
                id="password"
                type="password"
                variant="default"
                placeholder="أدخل كلمة المرور"
              />
            </div>
            <div className="w-full border-b border-netral-20 py-7 first:border-y">
              <h5 className="space-y-2 text-body-base font-semibold">
                تأكيد كلمة المرور
              </h5>

              <Input
                id="passwordConfirm"
                type="password"
                variant="default"
                placeholder="تأكيد كلمة المرور"
              />
            </div>
          </div>
          <div className="mt-8 flex flex-row-reverse gap-4 rounded-lg p-3 shadow-lg outline outline-1 outline-primary-main">
            <Button
              // disabled={driverMutation.isPending || formik.isSubmitting}
              variant="primary-bg"
              type="submit"
            >
              حفظ المتجر
              <Save className="h-5 w-5" />
            </Button>
            <Button
              // disabled={driverMutation.isPending}
              variant="primary-outline"
              type="button"
            >
              إلغاء
              <X className="h-5 w-5" />
            </Button>
          </div>
        </form>
      </section>

      {/* <PageAction
        actionLabel="Last saved"
        actionDesc="Nov 9, 2022-17.09"
        btnPrimaryLabel="Next"
        btnPrimaryVariant="primary-bg"
        btnPrimaryFun={() => router.push("/products/variants")}
        btnSecondaryLabel="Discard"
        btnsecondaryVariant="primary-nude"
        btnSecondaryFun={() => router.back()}
      /> */}
    </div>
  );
};

export default Page;
