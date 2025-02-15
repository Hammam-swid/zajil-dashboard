"use client";
import React, { useCallback } from "react";
import { useRouter } from "next/navigation";

import { Modal, PageAction } from "@/components/moleculs";
import { Button, Input, Selectbox, Title, Toggle } from "@/components/atomics";
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

const regions = [
  { name: "اختر المنطقة", disabled: true },
  { name: "عين زارة" },
  { name: "غوط الشعال" },
  { name: "النجيلة" },
  { name: "حي الأندلس" },
];

const cities = [
  { name: "اختر المدينة", disabled: true },
  { name: "طرابلس" },
  { name: "بنغازي" },
  { name: "سبها" },
  { name: "مصراتة" },
];

const Page = () => {
  const router = useRouter();

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

        <form>
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

              <Selectbox datas={cities} />
            </div>

            <div className="w-full border-b border-netral-20 py-7 first:border-y">
              <h5 className="space-y-2 text-body-base font-semibold">
                المنطقة
              </h5>

              <Selectbox datas={regions} />
            </div>
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
            <div className="w-full border-b border-netral-20 py-7 first:border-y">
              <h5 className="space-y-2 text-body-base font-semibold">
                الصورة الشخصية
              </h5>
              <p className="w-64 text-body-sm text-netral-50">
                Recommended minimum width 1080px X 1080px, with a max size of
                5MB, only *.png, *.jpg and *.jpeg image files are accepted
              </p>
            </div>
            <div
              {...getRootPropsProfile()}
              className={`group relative flex h-56 w-full max-w-[1000px] flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-netral-30 bg-netral-15`}
            >
              <input type="file" {...getInputPropsProfile()} accept="image/*" />
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
        </form>
      </section>

      <PageAction
        actionLabel="Last saved"
        actionDesc="Nov 9, 2022-17.09"
        btnPrimaryLabel="Next"
        btnPrimaryVariant="primary-bg"
        btnPrimaryFun={() => router.push("/products/variants")}
        btnSecondaryLabel="Discard"
        btnsecondaryVariant="primary-nude"
        btnSecondaryFun={() => router.back()}
      />

      <Modal
        variant="default"
        title="Add Image"
        open={openModalDropzone}
        setOpen={setOpenModalDropzone}
        className="max-w-4xl"
      >
        {activeState === 1 && (
          <main className="my-10 flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-netral-30 bg-netral-15 py-20">
            <DropzoneIll className="h-32 w-32" />

            <h5 className="mb-1 mt-6 text-body-lg font-semibold">
              Click to upload, or drag and drop
            </h5>

            <p className="text-body-sm text-netral-50">
              {"SVG, PNG, JPEG (MAX 800X400px)"}
            </p>
          </main>
        )}

        {activeState === 2 && (
          <main className="relative my-10 flex h-96 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-netral-30 bg-netral-15">
            <div className="relative aspect-square w-96">
              <Image
                className="h-full w-full object-cover"
                src={"/category-upload.png"}
                alt="Category Upload"
                fill
              />
            </div>

            <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
              <Button type="button" size="md" variant="default-bg">
                <RepeatIcon className="h-6 w-6" />
                Replace
              </Button>
            </div>

            <div className="absolute bottom-4 right-4 z-10">
              <Button type="button" size="md" variant="default-bg">
                <SelectionPlusIcon className="h-6 w-6" />
                Crop
              </Button>
            </div>
          </main>
        )}

        <footer className="flex flex-row justify-end gap-3">
          <Button type="button" size="md" variant="default-nude">
            Discard
          </Button>

          <Button
            type="submit"
            size="md"
            variant="primary-bg"
            onClick={nextState}
          >
            Save
          </Button>
        </footer>
      </Modal>
    </div>
  );
};

export default Page;
