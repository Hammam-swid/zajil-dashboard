"use client";

import useDriverForm from "@/hooks/use-driver-form";
import { Driver } from "@/types";
import { Button, Input, Title } from "../atomics";
import DatePicker from "react-datepicker";
import { Dropzone } from "../moleculs";
import Select from "react-select";
import { Listbox } from "@headlessui/react";
import { ChevronDown, Save, X } from "lucide-react";

interface DriverFormProps {
  driver?: Driver;
  formType: "add" | "edit";
}

const DriverForm = ({ driver, formType }: DriverFormProps) => {
  const {
    formik,
    isPending,
    isCitiesLoading,
    citiesOptions,
    vehicleTypes,
    regionsOptions,
    selectedCity,
    setSelectedCity,
    isRegionsLoading,
  } = useDriverForm(formType, driver);
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
                options={citiesOptions}
                placeholder="اختر المدينة"
                noOptionsMessage={() =>
                  isCitiesLoading ? "جاري التحميل…" : "لا يوجد مدن"
                }
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
                  noOptionsMessage={() =>
                    isRegionsLoading ? "جاري التحميل…" : "لا يوجد مناطق"
                  }
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
            <Button disabled={isPending} variant="primary-bg" type="submit">
              حفظ السائق
              <Save className="h-5 w-5" />
            </Button>
            <Button
              disabled={isPending}
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

export default DriverForm;
