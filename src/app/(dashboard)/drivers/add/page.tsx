"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Dropzone } from "@/components/moleculs";
import { Button, Input, Selectbox, Title } from "@/components/atomics";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { City, Driver, Region, VehicleType } from "@/types";
import api from "@/lib/api";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ChevronDown, Save, X } from "lucide-react";
import { Listbox } from "@headlessui/react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface FormValues {
  name: string;
  phone: string;
  email: string;
  nationality: string;
  driving_license: File | null;
  region: {
    value: number | null;
    label: string | null;
  } | null;
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

const validationSchema = Yup.object<FormValues>({
  name: Yup.string().required("الاسم مطلوب"),
  phone: Yup.string()
    .required("رقم الهاتف مطلوب")
    .matches(/^(\+218|00218|0)?(9[1-5]\d{7})$/, "رقم الهاتف غير صالح"),
  email: Yup.string()
    .email("البريد الإلكتروني غير صالح")
    .required("البريد الإلكتروني مطلوب"),
  nationality: Yup.string().required("الجنسية مطلوبة"),
  region: Yup.object().shape({
    value: Yup.number().required("المنطقة مطلوبة"),
    label: Yup.string(),
  }),
  plate_no: Yup.string().required("رقم اللوحة مطلوب"),
  date_of_birth: Yup.date()
    .required("تاريخ الميلاد مطلوب")
    .max(new Date(), "تاريخ الميلاد يجب أن يكون في الماضي")
    .min(new Date("1900-01-01"), "تاريخ الميلاد يجب ألا يتخطى 1900"),
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
  const [selectedCity, setSelectedCity] = useState<{
    value: number;
    label: string;
  } | null>(null);
  const { data: cities, isLoading: isCityLoading } = useQuery({
    queryKey: ["cities"],
    queryFn: getCities,
  });
  const { data: regions } = useQuery({
    queryKey: ["regions", { cityId: selectedCity?.value }],
    queryFn: () => getRegions(selectedCity?.value),
  });
  const { data: vehicleTypes } = useQuery({
    queryKey: ["vehicle-types"],
    queryFn: getVehicleTypes,
  });

  const router = useRouter();
  const queryClient = useQueryClient();
  const driverMutation = useMutation({
    mutationKey: ["create-driver"],
    mutationFn: createDriver,
    onError: (error) => {
      console.log(error);
    },
  });

  const formik = useFormik<FormValues>({
    initialValues: {
      name: "",
      phone: "",
      email: "",
      nationality: "",
      driving_license: null,
      region: null,
      plate_no: "",
      passport: null,
      date_of_birth: new Date("2000-01-01"),
      vehicle_name: "",
      model: "",
      vin: "",
      vehicle_type_id: null,
      year: "",
      document: null,
    },
    // validationSchema,
    onSubmit: (values) => {
      driverMutation.mutate(values, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["drivers"] });
          setTimeout(() => {
            router.push("/drivers");
          }, 2000);
          // router.push("/drivers");
        },
      });
    },
  });

  const cityOptions = cities?.map((city) => ({
    value: city.id,
    label: city.name,
  }));
  const regionsOptions = regions?.map((region) => ({
    value: region.id,
    label: region.name,
  }));

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
                <span className="text-error-main">*</span>
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
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="أدخل اسم السائق"
              />
            </div>

            <div className="w-full border-b border-netral-20 py-7 first:border-y">
              <h5 className="space-y-2 text-body-base font-semibold">
                رقم الهاتف
                <span className="text-error-main">*</span>
              </h5>

              <Input
                id="phone"
                type="text"
                dir="ltr"
                className="text-right"
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
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="رقم الهاتف"
              />
            </div>

            <div className="w-full border-b border-netral-20 py-7 first:border-y">
              <h5 className="space-y-2 text-body-base font-semibold">
                البريد الالكتروني
                <span className="text-error-main">*</span>
              </h5>

              <Input
                id="email"
                type="text"
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
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="البريد الالكتروني"
              />
            </div>
            <div className="w-full border-b border-netral-20 py-7 first:border-y">
              <h5 className="space-y-2 text-body-base font-semibold">
                الجنسية
                <span className="text-error-main">*</span>
              </h5>

              <Input
                id="nationality"
                type="text"
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
                value={formik.values.nationality}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="الجنسية"
              />
            </div>
            <div className="flex w-full grow items-center gap-4 border-b border-netral-20 py-7 first:border-y">
              <h5 className="space-y-2 text-body-base font-semibold">
                تاريخ الميلاد
                <span className="text-error-main">*</span>
              </h5>

              <div>
                <DatePicker
                  id="date_of_birth"
                  selected={formik.values.date_of_birth}
                  showYearDropdown
                  showMonthDropdown
                  yearDropdownItemNumber={10}
                  dateFormat={"dd/MM/yyyy"}
                  placeholderText="تاريخ الميلاد"
                  className="w-96 grow rounded-lg-10 px-4 py-2 text-lg outline outline-1 outline-netral-50 focus:outline-primary-main"
                  onChange={(date) =>
                    formik.setFieldValue("date_of_birth", date)
                  }
                />
              </div>
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
              {formik.touched.document && formik.errors.document && (
                <p className="text-sm text-error-main">
                  {formik.errors.document}
                </p>
              )}
              {formik.touched.passport && formik.errors.passport && (
                <p className="text-sm text-error-main">
                  {formik.errors.passport}
                </p>
              )}
              {formik.touched.driving_license &&
                formik.errors.driving_license && (
                  <p className="text-sm text-error-main">
                    {formik.errors.driving_license}
                  </p>
                )}
            </div>

            <div className="flex flex-wrap gap-4">
              <Dropzone
                fieldName="document"
                arabicName="كتيب السيارة"
                setField={formik.setFieldValue}
                setTouched={formik.setFieldTouched}
              />
              <Dropzone
                fieldName="driving_license"
                arabicName="رخصة القيادة"
                setField={formik.setFieldValue}
                setTouched={formik.setFieldTouched}
              />
              <Dropzone
                fieldName="passport"
                arabicName="جواز السفر"
                setField={formik.setFieldValue}
                setTouched={formik.setFieldTouched}
              />
            </div>
          </div>

          <div className="grid w-full grid-cols-2 items-start gap-8 border-b border-netral-20 py-7 first:border-y">
            <div className="w-full space-y-2">
              <h5 className="space-y-2 text-body-base font-semibold">
                المدينة
                <span className="text-error-main">*</span>
              </h5>

              <Select
                value={selectedCity}
                options={cityOptions}
                placeholder="اختر المدينة"
                noOptionsMessage={() => "لا يوجد مدن"}
                onChange={(v) => {
                  setSelectedCity(v);
                  formik.setFieldValue("region", { value: null, label: null });
                }}
              />
            </div>

            {selectedCity && (
              <div className="w-full  space-y-2">
                <h5 className="space-y-2 text-body-base font-semibold">
                  المنطقة
                </h5>

                <Select
                  value={formik.values.region}
                  options={regionsOptions}
                  placeholder="اختر المنطقة"
                  noOptionsMessage={() => "لا يوجد مناطق"}
                  onChange={(v) => {
                    console.log("onChange", v);
                    formik.setFieldValue("region", v);
                  }}
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="w-full border-b border-netral-20 py-7 first:border-y">
              <h5 className="space-y-2 text-body-base font-semibold">
                الشركة المصنعة للمركبة
                <span className="text-error-main">*</span>
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
              {formik.touched.vehicle_name && formik.errors.vehicle_name && (
                <p className="ms-2 text-sm text-error-main">
                  {formik.errors.vehicle_name}
                </p>
              )}
            </div>

            <div className="w-full border-b border-netral-20 py-7 first:border-y">
              <h5 className="space-y-2 text-body-base font-semibold">
                رقم الهيكل
                <span className="text-error-main">*</span>
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
              {formik.touched.vin && formik.errors.vin && (
                <p className="ms-2 text-sm text-error-main">
                  {formik.errors.vin}
                </p>
              )}
            </div>

            <div className="w-full border-b border-netral-20 py-7 first:border-y">
              <h5 className="space-y-2 text-body-base font-semibold">
                موديل المركبة
                <span className="text-error-main">*</span>
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
              {formik.touched.model && formik.errors.model && (
                <p className="ms-2 text-sm text-error-main">
                  {formik.errors.model}
                </p>
              )}
            </div>
            <div className="w-full border-b border-netral-20 py-7 first:border-y">
              <h5 className="space-y-2 text-body-base font-semibold">
                رقم لوحة المركبة
                <span className="text-error-main">*</span>
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
              {formik.touched.plate_no && formik.errors.plate_no && (
                <p className="ms-2 text-sm text-error-main">
                  {formik.errors.plate_no}
                </p>
              )}
            </div>
            <div className="w-full border-b border-netral-20 py-7 first:border-y">
              <h5 className="space-y-2 text-body-base font-semibold">
                سنة الصنع
                <span className="text-error-main">*</span>
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
              {formik.touched.year && formik.errors.year && (
                <p className="ms-2 text-sm text-error-main">
                  {formik.errors.year}
                </p>
              )}
            </div>
            <div className="w-full border-b border-netral-20 py-7 first:border-y">
              <h5 className="space-y-2 text-body-base font-semibold">
                نوع المركبة
                <span className="text-error-main">*</span>
              </h5>

              <Listbox
                value={formik.values.vehicle_type_id?.toString()}
                onChange={(v) =>
                  formik.setFieldValue("vehicle_type_id", Number(v))
                }
              >
                <Listbox.Button className="w-full rounded-md p-3 text-start outline outline-1 outline-netral-30 focus:outline-primary-main">
                  <div className="relative">
                    <Listbox.Label>
                      <span className="block  text-netral-70">
                        {formik.values.vehicle_type_id
                          ? vehicleTypes?.find(
                              (vehicleType) =>
                                vehicleType.id === formik.values.vehicle_type_id
                            )?.name
                          : "اختر نوع المركبة"}
                      </span>
                    </Listbox.Label>
                    <span className="absolute end-0 top-1/2 -translate-y-1/2 text-netral-50">
                      <ChevronDown />
                    </span>
                  </div>
                </Listbox.Button>
                <Listbox.Options className="absolute z-10 mt-1 w-1/2 rounded-md bg-white p-2 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  {vehicleTypes && vehicleTypes?.length > 0 ? (
                    vehicleTypes?.map((vehicleType) => (
                      <Listbox.Option
                        className={
                          "cursor-pointer rounded-md p-1 hover:bg-netral-20"
                        }
                        key={vehicleType.id}
                        value={vehicleType.id.toString()}
                      >
                        {vehicleType.name}
                      </Listbox.Option>
                    ))
                  ) : (
                    <Listbox.Label>لا يوجد أنواع</Listbox.Label>
                  )}
                </Listbox.Options>
              </Listbox>
              {/* <Selectbox  datas={vehicleTypes} selectedNow={false} /> */}
            </div>
          </div>
          <div className="mt-8 flex flex-row-reverse gap-4 rounded-lg p-3 shadow-lg outline outline-1 outline-primary-main">
            <Button
              disabled={driverMutation.isPending || formik.isSubmitting}
              variant="primary-bg"
              type="submit"
            >
              حفظ السائق
              <Save className="h-5 w-5" />
            </Button>
            <Button
              disabled={driverMutation.isPending}
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

const getVehicleTypes = async () => {
  const res = await api.get<{ data: VehicleType[] }>(
    `/dashboards/vehicle-types`
  );
  return res.data.data;
};

const getCities = async () => {
  const res = await api.get<{ data: City[] }>(`/dashboards/cities`);
  return res.data.data;
};

const getRegions = async (cityId?: number) => {
  if (!cityId) return [];
  const res = await api.get<{ data: { regions: Region[] } }>(
    `/dashboards/cities/getRegions/${cityId}`
  );
  return res.data.data.regions;
};

const createDriver = async (values: FormValues) => {
  const fakeUrl =
    "https://static.vecteezy.com/system/resources/previews/041/290/593/non_2x/ai-generated-short-sleeves-black-tshirt-isolated-on-a-transparent-background-free-png.png";
  const formData = new FormData();
  formData.append("name", values.name);
  formData.append("phone", values.phone);
  formData.append("email", values.email);
  formData.append("nationality", values.nationality);
  if (values.region?.value)
    formData.append("region_id", values.region?.value?.toString());
  formData.append("plate_no", values.plate_no);
  formData.append("date_of_birth", values.date_of_birth.toISOString());
  if (values.vehicle_type_id)
    formData.append("vehicle_type_id", values.vehicle_type_id.toString());
  formData.append("vehicle_name", values.vehicle_name);
  formData.append("model", values.model);
  formData.append("vin", values.vin);
  formData.append("year", values.year);
  if (values.passport) formData.append("passport", fakeUrl);
  // if (values.clearance_form)
  //   formData.append("clearance_form", values.clearance_form);
  if (values.driving_license) formData.append("driving_license", fakeUrl);
  if (values.document) formData.append("document", fakeUrl);

  const res = await api.post("/dashboards/drivers", formData);
  return res.data;
};

export default Page;
