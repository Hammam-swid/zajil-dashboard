"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { Dropzone, Modal, PageAction } from "@/components/moleculs";
import { Button, Input, Selectbox, Title } from "@/components/atomics";
import {
  RepeatIcon,
  SelectionPlusIcon,
  UploadSimpleIcon,
} from "@/assets/icons";
import Image from "next/image";
import { DropzoneIll } from "@/assets/illustration";
import { useMutation, useQuery } from "@tanstack/react-query";
import { City, Driver } from "@/types";
import api from "@/lib/api";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ChevronDown, ChevronDownCircle, Save, X } from "lucide-react";
import { Listbox } from "@headlessui/react";

const vehicleTypes = [
  {
    name: "اختر نوع المركبة",
    disabled: true,
  },
  { name: "سيارة" },
  { name: "شاحنة" },
  { name: "باص" },
  { name: "دراجة نارية" },
];

interface FormValues {
  name: string;
  phone: string;
  email: string;
  nationality: string;
  driving_license: File | null;
  region_id: number | null;
  plate_no: string;
  passport: File | null;
  date_of_birth: Date;
  document: File | null;
  vehicle_name: string;
  model: string;
  vin: string;
  vehicle_type_id: number | null;
  year: string;
}

const createDriver = async (values: FormValues) => {
  const formData = new FormData();
  formData.append("name", values.name);
  formData.append("phone", values.phone);
  formData.append("email", values.email);
  formData.append("nationality", values.nationality);
  if (values.region_id)
    formData.append("region_id", values.region_id.toString());
  formData.append("plate_no", values.plate_no);
  formData.append("date_of_birth", values.date_of_birth.toISOString());
  if (values.vehicle_type_id)
    formData.append("vehicle_type_id", values.vehicle_type_id.toString());
  formData.append("vehicle_name", values.vehicle_name);
  formData.append("model", values.model);
  formData.append("vin", values.vin);
  formData.append("year", values.year);
  if (values.passport) formData.append("passport", values.passport);
  // if (values.clearance_form)
  //   formData.append("clearance_form", values.clearance_form);
  if (values.driving_license)
    formData.append("driving_license", values.driving_license);
  if (values.document) formData.append("document", values.document);

  const res = await api.post("/dashboards/drivers", formData);
  return res.data;
};

const getCities = async () => {
  const res = await api.get<{ data: City[] }>(`/dashboards/cities`);
  return res.data.data;
};

const validationSchema = Yup.object<FormValues>({
  name: Yup.string().required("الاسم مطلوب"),
  phone: Yup.string()
    .required("رقم الهاتف مطلوب")
    .matches(/9[1-5]/),
  email: Yup.string()
    .email("البريد الإلكتروني غير صالح")
    .required("البريد الإلكتروني مطلوب"),
  nationality: Yup.string().required("الجنسية مطلوبة"),
  region_id: Yup.number().required("المنطقة مطلوبة"),
  plate_no: Yup.string().required("رقم اللوحة مطلوب"),
  date_of_birth: Yup.date().required("تاريخ الميلاد مطلوب"),
  vehicle_name: Yup.string().required("اسم المركبة مطلوب"),
  model: Yup.string().required("الموديل مطلوب"),
  vin: Yup.string().required("رقم الهيكل مطلوب"),
  year: Yup.string().required("سنة الصنع مطلوبة"),
  vehicle_type_id: Yup.number().required("نوع المركبة مطلوب"),
  passport: Yup.mixed().required("جواز السفر مطلوب"),
  driving_license: Yup.mixed().required("رخصة القيادة مطلوبة"),
  document: Yup.mixed().required("كتيب السيارة مطلوب"),
});

const Page = () => {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const { data: cities } = useQuery({
    queryKey: ["cities"],
    queryFn: getCities,
  });
  const driverMutation = useMutation({ mutationKey: ["create-driver"] });
  const formik = useFormik<FormValues>({
    initialValues: {
      name: "",
      phone: "",
      email: "",
      nationality: "",
      driving_license: null,
      region_id: null,
      plate_no: "",
      passport: null,
      date_of_birth: new Date(),
      // clearance_form: null,
      vehicle_name: "",
      model: "",
      vin: "",
      vehicle_type_id: null,
      year: "",
      document: null,
    },
    validationSchema,
    onSubmit: (values) => {
      console.log(values);
      // driverMutation.mutate(values, {
      //   onSuccess: () => {
      //     router.push("/drivers");
      //   },
      // });
    },
  });

  const regions = [
    { name: "اختر المنطقة", disabled: true },
    { name: "عين زارة" },
    { name: "غوط الشعال" },
    { name: "النجيلة" },
    { name: "حي الأندلس" },
  ];

  return (
    <div className="relative space-y-6 p-6">
      <h1 className="text-heading-sm font-semibold">إضافة سائق</h1>

      <section className="relative w-full space-y-7 rounded-lg-10 bg-white p-6">
        <Title variant="default" size="lg">
          معلومات السائق
        </Title>

        <form onSubmit={formik.handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div className="w-full border-b border-netral-20 py-7 first:border-y">
              <h5 className="space-y-2 text-body-base font-semibold">
                الاسم
                {validationSchema.fields?.name.required ? (
                  <span className="text-error-main">*</span>
                ) : (
                  ""
                )}
              </h5>
              <Input
                type="text"
                id="name"
                variant="default"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="أدخل اسم السائق"
              />
            </div>

            <div className="w-full border-b border-netral-20 py-7 first:border-y">
              <h5 className="space-y-2 text-body-base font-semibold">
                رقم الهاتف
                {validationSchema.fields.phone?.required ? (
                  <span className="text-error-main">*</span>
                ) : (
                  ""
                )}
              </h5>

              <Input
                id="phone"
                type="text"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="رقم الهاتف"
              />
            </div>

            <div className="w-full border-b border-netral-20 py-7 first:border-y">
              <h5 className="space-y-2 text-body-base font-semibold">
                البريد الالكتروني
                {validationSchema.fields.email?.required ? (
                  <span className="text-error-main">*</span>
                ) : (
                  ""
                )}
              </h5>

              <Input
                id="email"
                type="text"
                variant="default"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="البريد الالكتروني"
              />
            </div>
            <div className="w-full border-b border-netral-20 py-7 first:border-y">
              <h5 className="space-y-2 text-body-base font-semibold">
                الجنسية
                {validationSchema.fields.nationality?.required ? (
                  <span className="text-error-main">*</span>
                ) : (
                  ""
                )}
              </h5>

              <Input
                id="nationality"
                type="text"
                variant="default"
                value={formik.values.nationality}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="الجنسية"
              />
            </div>
          </div>
          {/* photos section */}
          <div className="flex w-full items-start justify-between gap-8 border-b border-netral-20 py-7 first:border-y">
            <div className="w-full max-w-sm space-y-2">
              <h5 className="space-y-2 text-body-base font-semibold">
                صور مطلوبة
                <span className="text-error-main">*</span>
              </h5>
              <p className="w-64 text-body-sm text-netral-50">
                Recommended minimum width 1080px X 1080px, with a max size of
                5MB, only *.png, *.jpg and *.jpeg image files are accepted
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Dropzone
                fieldName="document"
                arabicName="كتيب السيارة"
                setField={formik.setFieldValue}
              />
              <Dropzone
                fieldName="driving_license"
                arabicName="رخصة القيادة"
                setField={formik.setFieldValue}
              />
              <Dropzone
                fieldName="passport"
                arabicName="جواز السفر"
                setField={formik.setFieldValue}
              />
            </div>
          </div>

          <div className="flex w-full items-start gap-8 border-b border-netral-20 py-7 first:border-y">
            <div className="w-full space-y-2">
              <h5 className="space-y-2 text-body-base font-semibold">
                المدينة
              </h5>

              <Listbox onChange={(v) => setSelectedCity(v)}>
                <Listbox.Button className="w-full rounded-md p-3 text-start outline outline-1 outline-netral-30 focus:outline-primary-main">
                  <div className="relative">
                    <Listbox.Label>
                      <span className="block  text-netral-70">
                        {selectedCity
                          ? cities?.find((city) => city.id === +selectedCity)
                              ?.name
                          : "اختر المدينة"}
                      </span>
                    </Listbox.Label>
                    <span className="absolute end-0 top-1/2 -translate-y-1/2 text-netral-50">
                      <ChevronDown />
                    </span>
                  </div>
                </Listbox.Button>
                <Listbox.Options className="absolute z-10 mt-1 w-1/2 rounded-md bg-white p-2 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  {cities?.map((city) => (
                    <Listbox.Option
                      className={
                        "cursor-pointer rounded-md p-1 hover:bg-netral-20"
                      }
                      key={city.id}
                      value={city.id.toString()}
                    >
                      {city.name}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Listbox>
            </div>

            {selectedCity && (
              <div className="w-full  space-y-2">
                <h5 className="space-y-2 text-body-base font-semibold">
                  المنطقة
                </h5>

                <Listbox
                  value={formik.values.region_id?.toString()}
                  onChange={(v) => formik.setFieldValue("region_id", +v)}
                >
                  <Listbox.Button className="w-full rounded-md p-3 text-start outline outline-1 outline-netral-30 focus:outline-primary-main">
                    <div className="relative">
                      <Listbox.Label>
                        <span className="block  text-netral-70">
                          {formik.values.region_id
                            ? cities
                                ?.find((city) => city.id === +selectedCity)
                                ?.regions?.find(
                                  (region) =>
                                    region.id === formik.values.region_id
                                )?.name
                            : "اختر المنطقة"}
                        </span>
                      </Listbox.Label>
                      <span className="absolute end-0 top-1/2 -translate-y-1/2 text-netral-50">
                        <ChevronDown />
                      </span>
                    </div>
                  </Listbox.Button>
                  <Listbox.Options className="absolute z-10 mt-1 w-1/2 rounded-md bg-white p-2 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    {cities
                      ?.find((city) => city.id === +selectedCity)
                      ?.regions?.map((region) => (
                        <Listbox.Option
                          className={
                            "cursor-pointer rounded-md p-1 hover:bg-netral-20"
                          }
                          key={region.id}
                          value={region.id.toString()}
                        >
                          {region.name}
                        </Listbox.Option>
                      ))}
                  </Listbox.Options>
                </Listbox>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="w-full border-b border-netral-20 py-7 first:border-y">
              <h5 className="space-y-2 text-body-base font-semibold">
                اسم المركبة
              </h5>
              <Input
                type="text"
                id="vehicle_name"
                value={formik.values.vehicle_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                variant="default"
                placeholder="Toyota"
              />
            </div>

            <div className="w-full border-b border-netral-20 py-7 first:border-y">
              <h5 className="space-y-2 text-body-base font-semibold">
                رقم الهيكل
              </h5>

              <Input
                id="vin"
                type="text"
                value={formik.values.vin}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                variant="default"
                placeholder="أدخل رقم الهيكل الخاص بالسيارة"
              />
            </div>

            <div className="w-full border-b border-netral-20 py-7 first:border-y">
              <h5 className="space-y-2 text-body-base font-semibold">
                موديل المركبة
              </h5>

              <Input
                id="model"
                type="text"
                value={formik.values.model}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                variant="default"
                placeholder="أدخل موديل المركبة"
              />
            </div>
            <div className="w-full border-b border-netral-20 py-7 first:border-y">
              <h5 className="space-y-2 text-body-base font-semibold">
                رقم لوحة المركبة
              </h5>

              <Input
                id="plate_no"
                type="text"
                variant="default"
                value={formik.values.plate_no}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="أدخل رقم لوحة المركبة"
              />
            </div>
            <div className="w-full border-b border-netral-20 py-7 first:border-y">
              <h5 className="space-y-2 text-body-base font-semibold">
                سنة الصنع
              </h5>

              <Input
                id="year"
                type="text"
                variant="default"
                value={formik.values.year}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="أدخل سنة الصنع الخاص بالسيارة"
              />
            </div>
            <div className="w-full border-b border-netral-20 py-7 first:border-y">
              <h5 className="space-y-2 text-body-base font-semibold">
                نوع المركبة
              </h5>

              <Selectbox datas={vehicleTypes} selectedNow={false} />
            </div>
          </div>
          <div className="mt-8 flex flex-row-reverse gap-4 rounded-lg p-3 shadow-lg outline outline-1 outline-primary-main">
            <Button variant="primary-bg" type="submit">
              حفظ السائق
              <Save className="h-5 w-5" />
            </Button>
            <Button variant="primary-outline" type="button">
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
