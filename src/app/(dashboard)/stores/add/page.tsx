"use client";
import React, { useCallback, useState } from "react";

import { Button, Input, Title } from "@/components/atomics";
import Select from "react-select";
import { UploadSimpleIcon } from "@/assets/icons";

import { useDropzone } from "react-dropzone";
import { useFormik } from "formik";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { City, Region } from "@/types";
import { Save, X } from "lucide-react";
import * as Yup from "yup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Dropzone } from "@/components/moleculs";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";

interface FormValues {
  store_name: string;
  store_description: string;
  commercial_register: string;
  trade_license: string;
  passport: File | null;
  region: { label: string; value: number } | null;
  name: string;
  // phone: string;
  email: string;
  nationality: string;
  password: string;
  confirmPassword: string;
  date_of_birth: Date | null;
}
const validationSchema = Yup.object<FormValues>({
  store_name: Yup.string().required("الاسم مطلوب"),
  store_description: Yup.string().required("الوصف مطلوب"),
  trade_license: Yup.string().required("رقم الرخصة التجارية مطلوب"),
  commercial_register: Yup.string().required("رقم السجل التجاري مطلوب"),
  passport: Yup.mixed().required("جواز السفر مطلوبة"),
  region: Yup.object().required("المنطقة مطلوبة"),
  name: Yup.string().required("اسم البائع مطلوب"),
  // phone: Yup.string().required("رقم الهاتف مطلوب"),
  date_of_birth: Yup.date()
    .min(new Date("1920-01-01"), "تاريخ الميلاد غير صالح")
    .max(new Date(), "تاريخ الميلاد غير صالح"),
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

const getRegions = async (cityId?: number) => {
  if (!cityId) return [];
  const res = await api.get<{ data: { regions: Region[] } }>(
    `/dashboards/cities/getRegions/${cityId}`
  );
  return res.data.data.regions;
};

const createStore = async (values: FormValues) => {
  const formData = new FormData();
  formData.append("store_name", values.store_name);
  formData.append("store_description", values.store_description);
  formData.append("trade_license", values.trade_license);
  formData.append("commercial_register", values.commercial_register);
  formData.append("passport", values.passport as File);
  formData.append("nationality", values.nationality);
  formData.append("region_id", values.region?.value.toString() as string);
  formData.append("name", values.name);
  // formData.append("phone", values.phone);
  formData.append("email", values.email);
  formData.append("password", values.password);
  formData.append("date_of_birth", values?.date_of_birth?.toString() as string);
  console.log(formData.get("name"));

  const res = await api.post("/dashboards/sellers", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  console.log(res);
  return res.data;
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
  const { data: regions } = useQuery({
    queryKey: ["regions", { cityId: selectedCity?.value }],
    queryFn: () => getRegions(selectedCity?.value),
  });
  const { toast } = useToast();
  const mutation = useMutation({
    mutationKey: ["addStore"],
    mutationFn: createStore,
    onSuccess: () => {
      const t = toast({
        title: "تمت العملية بنجاح",
        description: "تمت إضافة متجر بنجاح",
      });
      setTimeout(t.dismiss, 3000);
    },
    onError: (error) => {
      console.log(error);
      const t = toast({
        type: "background",
        title: "حدث خطأ",
        description: "حدث خطأ أثناء إضافة المتجر، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
      setTimeout(() => t.dismiss(), 3000);
    },
  });
  const formik = useFormik<FormValues>({
    initialValues: {
      store_name: "",
      store_description: "",
      commercial_register: "",
      trade_license: "",
      passport: null,
      region: null,
      name: "",
      // phone: "",
      email: "",
      nationality: "",
      password: "",
      confirmPassword: "",
      date_of_birth: new Date("2000-01-01"),
    },
    // validationSchema,
    onSubmit: (values) => {
      console.log(values);
      mutation.mutate(values);
    },
  });

  console.log(formik.errors);

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
                id="store_name"
                variant={
                  formik.touched.store_name && formik.errors.store_name
                    ? "default-error"
                    : "default"
                }
                message={
                  formik.touched.store_name && formik.errors.store_name
                    ? formik.errors.store_name
                    : ""
                }
                placeholder="أدخل اسم المتجر"
                value={formik.values.store_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>

            <div className="w-full border-b border-netral-20 py-7 first:border-y">
              <h5 className="space-y-2 text-body-base font-semibold">
                رقم الرخصة التجارية
              </h5>

              <Input
                value={formik.values.trade_license}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                id="trade_license"
                type="text"
                variant={
                  formik.touched.trade_license && formik.errors.trade_license
                    ? "default-error"
                    : "default"
                }
                message={
                  formik.touched.trade_license && formik.errors.trade_license
                    ? formik.errors.trade_license
                    : ""
                }
                placeholder="رقم الرخصة التجارية"
              />
            </div>

            <div className="w-full border-b border-netral-20 py-7 first:border-y">
              <label
                htmlFor="store_description"
                className="space-y-2 text-body-base font-semibold"
              >
                الوصف
              </label>

              <textarea
                id="store_description"
                name="store_description"
                className="w-full resize-none rounded-md p-3 outline outline-2 outline-netral-20 first:border-y focus:outline-2 focus:outline-primary-main"
                placeholder="أدخل وصف المتجر"
                value={formik.values.store_description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.errors.store_description &&
                formik.touched.store_description && (
                  <p className="text-sm text-error-main">
                    {formik.errors.store_description}
                  </p>
                )}
            </div>

            <div className="w-full border-b border-netral-20 py-7 first:border-y">
              <h5 className="space-y-2 text-body-base font-semibold">
                رقم السجل التجاري
              </h5>

              <Input
                id="commercial_register"
                type="text"
                variant={
                  formik.touched.commercial_register &&
                  formik.errors.commercial_register
                    ? "default-error"
                    : "default"
                }
                message={
                  formik.touched.commercial_register &&
                  formik.errors.commercial_register
                    ? formik.errors.commercial_register
                    : ""
                }
                placeholder="رقم السجل التجاري"
                value={formik.values.commercial_register}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
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
                  onBlur={() => formik.setFieldTouched("region", true)}
                  noOptionsMessage={() => "لا يوجد مناطق"}
                  placeholder="اختر المنطقة"
                  className=""
                />
                {formik.errors.region && formik.touched.region && (
                  <p>{formik.errors.region}</p>
                )}
              </div>
            )}
          </div>
          {/* photos section */}
          <div className="flex w-full items-start justify-between gap-8 border-b border-netral-20 py-7 first:border-y">
            <div className="w-full max-w-sm space-y-2">
              <h5 className="space-y-2 text-body-base font-semibold">
                صورة جواز السفر
              </h5>
              {/* <p className="w-64 text-body-sm text-netral-50">
                Recommended minimum width 1080px X 1080px, with a max size of
                5MB, only *.png, *.jpg and *.jpeg image files are accepted
                </p> */}
              {formik.errors.passport && formik.touched.passport && (
                <p>{formik.errors.passport}</p>
              )}
            </div>

            {/* <div
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
            </div> */}
            <Dropzone
              fieldName="passport"
              className={`group relative flex h-56 w-full max-w-[1000px] flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-netral-30 bg-netral-15`}
              setField={formik.setFieldValue}
              setTouched={formik.setFieldTouched}
            />
          </div>

          <Title size="sm" variant="default">
            بيانات البائع
          </Title>
          <div className="grid grid-cols-2 items-center justify-center gap-4">
            <div className="w-full border-b border-netral-20 py-7 first:border-y">
              <h5 className="space-y-2 text-body-base font-semibold">
                اسم البائع
              </h5>
              <Input
                type="text"
                id="name"
                variant={
                  formik.touched.name && formik.errors.name
                    ? "default-error"
                    : "default"
                }
                message={
                  formik.touched.name && formik.errors.name
                    ? formik.errors.name
                    : ""
                }
                placeholder="أدخل اسم البائع"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>

            <div className="w-full border-b border-netral-20 py-7 first:border-y">
              <h5 className="space-y-2 text-body-base font-semibold">
                البريد الإلكتروني
              </h5>

              <Input
                id="email"
                type="text"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                variant={
                  formik.touched.email && formik.errors.email
                    ? "default-error"
                    : "default"
                }
                message={
                  formik.touched.email && formik.errors.email
                    ? formik.errors.email
                    : ""
                }
                placeholder="أدخل البريد الإلكتروني"
              />
            </div>

            {/* <div className="w-full border-b border-netral-20 py-7 first:border-y">
              <h5 className="space-y-2 text-body-base font-semibold">
                رقم الهاتف
              </h5>

              <Input
                id="phone"
                type="text"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                variant={
                  formik.touched.phone && formik.errors.phone
                    ? "default-error"
                    : "default"
                }
                message={
                  formik.touched.phone && formik.errors.phone
                    ? formik.errors.phone
                    : ""
                }
                placeholder="أدخل رقم الهاتف"
              />
            </div> */}

            <div className="w-full border-b border-netral-20 py-7 first:border-y">
              <h5 className="space-y-2 text-body-base font-semibold">
                الجنسية
              </h5>

              <Input
                id="nationality"
                type="text"
                value={formik.values.nationality}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                variant={
                  formik.touched.nationality && formik.errors.nationality
                    ? "default-error"
                    : "default"
                }
                message={
                  formik.touched.nationality && formik.errors.nationality
                    ? formik.errors.nationality
                    : ""
                }
                placeholder="أدخل جنسية البائع"
              />
            </div>
            <div>
              <h5 className="space-y-2 text-body-base font-semibold">
                تاريخ الميلاد
                <span className="text-error-main">*</span>
              </h5>

              <div className="w-full">
                <DatePicker
                  id="date_of_birth"
                  selected={formik.values.date_of_birth}
                  showYearDropdown
                  showMonthDropdown
                  yearDropdownItemNumber={10}
                  dateFormat={"dd/MM/yyyy"}
                  placeholderText="تاريخ الميلاد"
                  className="w-full grow rounded-lg-10 px-4 py-2 text-lg outline outline-1 outline-netral-50 focus:outline-primary-main"
                  onChange={(date) =>
                    formik.setFieldValue("date_of_birth", date)
                  }
                  onBlur={() => formik.setFieldTouched("date_of_birth", true)}
                />
              </div>
              {formik.errors.date_of_birth && formik.touched.date_of_birth && (
                <p>{formik.errors.date_of_birth}</p>
              )}
            </div>

            <div></div>
            <div className="w-full border-b border-netral-20 py-7 first:border-y">
              <h5 className="space-y-2 text-body-base font-semibold">
                كلمة المرور
              </h5>

              <Input
                id="password"
                type="password"
                variant={
                  formik.touched.password && formik.errors.password
                    ? "default-error"
                    : "default"
                }
                message={
                  formik.touched.password && formik.errors.password
                    ? formik.errors.password
                    : ""
                }
                placeholder="أدخل كلمة المرور"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            <div className="w-full border-b border-netral-20 py-7 first:border-y">
              <h5 className="space-y-2 text-body-base font-semibold">
                تأكيد كلمة المرور
              </h5>

              <Input
                id="confirmPassword"
                type="password"
                variant={
                  formik.touched.confirmPassword &&
                  formik.errors.confirmPassword
                    ? "default-error"
                    : "default"
                }
                message={
                  formik.touched.confirmPassword &&
                  formik.errors.confirmPassword
                    ? formik.errors.confirmPassword
                    : ""
                }
                placeholder="تأكيد كلمة المرور"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
          </div>
          <div className="mt-8 flex flex-row-reverse gap-4 rounded-lg p-3 shadow-lg outline outline-1 outline-primary-main">
            <Button
              // disabled={driverMutation.isPending || formik.isSubmitting}
              variant="primary-bg"
              type="submit"
              className="disabled:opacity-50"
              disabled={mutation.isPending}
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
    </div>
  );
};

export default Page;
