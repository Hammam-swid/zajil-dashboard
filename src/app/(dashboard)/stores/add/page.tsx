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
import { format } from "date-fns";
import { useStoreForm } from "@/hooks/use-store-form";
import StoreForm from "@/components/templates/StoreForm";

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
  formData.append(
    "date_of_birth",
    format(values.date_of_birth as Date, "yyyy-MM-dd")
  );
  console.log(format(values.date_of_birth as Date, "yyyy-MM-dd"));
  console.log(values.date_of_birth);

  const res = await api.post("/dashboards/sellers", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  console.log(res);
  return res.data;
};

const Page = () => {
  // const { data: cities } = useQuery({
  //   queryKey: ["cities"],
  //   queryFn: getCities,
  // });
  // const [selectedCity, setSelectedCity] = useState<{
  //   value: number;
  //   label: string;
  // } | null>(null);
  // const { data: regions } = useQuery({
  //   queryKey: ["regions", { cityId: selectedCity?.value }],
  //   queryFn: () => getRegions(selectedCity?.value),
  // });
  // const { toast } = useToast();
  // const mutation = useMutation({
  //   mutationKey: ["addStore"],
  //   mutationFn: createStore,
  //   onSuccess: () => {
  //     const t = toast({
  //       title: "تمت العملية بنجاح",
  //       description: "تمت إضافة متجر بنجاح",
  //     });
  //     setTimeout(t.dismiss, 3000);
  //   },
  //   onError: (error) => {
  //     console.log(error);
  //     const t = toast({
  //       type: "background",
  //       title: "حدث خطأ",
  //       description: "حدث خطأ أثناء إضافة المتجر، يرجى المحاولة مرة أخرى",
  //       variant: "destructive",
  //     });
  //     setTimeout(() => t.dismiss(), 3000);
  //   },
  // });
  // const formik = useFormik<FormValues>({
  //   initialValues: {
  //     store_name: "",
  //     store_description: "",
  //     commercial_register: "",
  //     trade_license: "",
  //     passport: null,
  //     region: null,
  //     name: "",
  //     // phone: "",
  //     email: "",
  //     nationality: "",
  //     password: "",
  //     confirmPassword: "",
  //     date_of_birth: new Date("2000-01-01"),
  //   },
  //   // validationSchema,
  //   onSubmit: (values) => {
  //     console.log(values);
  //     mutation.mutate(values);
  //   },
  // });

  // const { formik, isPending, cities, regions, selectedCity, setSelectedCity } =
  //   useStoreForm({ type: "add" });
  return <StoreForm type="add" />;
};

export default Page;
