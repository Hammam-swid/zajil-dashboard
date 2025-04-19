import { useStoreForm } from "@/hooks/use-store-form";
import { Button, Input, Title } from "../atomics";
import Select from "react-select";
import { Dropzone } from "../moleculs";
import DatePicker from "react-datepicker";
import { Save, X } from "lucide-react";
import { Store } from "@/types";

type AddStoreFormProps = {
  type: "add";
  store?: never;
};
type EditStoreProps = {
  type: "edit";
  store: Store;
};

type StoreFormProps = AddStoreFormProps | EditStoreProps;

export default function StoreForm({ type, store }: StoreFormProps) {
  const { formik, isPending, cities, regions, selectedCity, setSelectedCity } =
    useStoreForm({ type, store } as StoreFormProps);
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
          {/* passport image section */}
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

            <Dropzone
              path={store?.user.seller.passport as string}
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

            <div className="w-full border-b border-netral-20 py-7 first:border-y">
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
            </div>

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
              disabled={isPending}
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
}
