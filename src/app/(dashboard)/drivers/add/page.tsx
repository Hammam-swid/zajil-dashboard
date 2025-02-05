"use client"
import React from "react"
import { useRouter } from "next/navigation"

import { Modal, PageAction } from "@/components/moleculs"
import { Button, Input, Selectbox, Title, Toggle } from "@/components/atomics"
import {
  PencilSimpleIcon,
  RepeatIcon,
  SelectionPlusIcon,
  TrashIcon,
  UploadSimpleIcon
} from "@/assets/icons"
import Image from "next/image"
import { DropzoneIll } from "@/assets/illustration"

const vehicleTypes = [
  {
    name: "اختر نوع المركبة",
    disabled: true
  },
  { name: "سيارة" },
  { name: "شاحنة" },
  { name: "باص" },
  { name: "دراجة نارية" }
]

const AddDriverPage = () => {
  const router = useRouter()
  // -------------------------------------------------------------------------
  const regions = [
    { name: "اختر المنطقة", disabled: true },
    { name: "عين زارة" },
    { name: "غوط الشعال" },
    { name: "النجيلة" },
    { name: "حي الأندلس" }
  ]

  // -------------------------------------------------------------------------
  const genders = [
    { name: "Select Gender", disabled: true },
    { name: "Male" },
    { name: "Female" }
  ]
  // -------------------------------------------------------------------------
  const discountType = [
    { name: "Select Discount Type", disabled: true },
    { name: "Fixed" },
    { name: "Price" }
  ]
  // -------------------------------------------------------------------------
  const [toggle, setToggle] = React.useState(false)
  const [dropzone, setDropzone] = React.useState(true)
  const [activeState, setActiveState] = React.useState(1)
  const [openModalDropzone, setOpenModalDropzone] = React.useState(false)
  // -------------------------------------------------------------------------
  const nextState = () => {
    if (activeState > 1) {
      setOpenModalDropzone(false)
      setActiveState(1)
      setDropzone(false)
    } else {
      setActiveState(activeState + 1)
    }
  }
  // -------------------------------------------------------------------------

  return (
    <div className='relative space-y-6 p-6'>
      <h1 className='text-heading-sm font-semibold'>إضافة سائق</h1>

      <section className='relative w-full space-y-7 rounded-lg-10 bg-white p-6'>
        <Title variant='default' size='lg'>
          معلومات السائق
        </Title>

        <form>
          <div className='grid grid-cols-2 gap-4'>
            <div className='w-full border-b border-netral-20 py-7 first:border-y'>
              <h5 className='space-y-2 text-body-base font-semibold'>الاسم</h5>
              <Input
                type='text'
                id='name'
                variant='default'
                placeholder='أدخل اسم السائق'
              />
            </div>

            <div className='w-full border-b border-netral-20 py-7 first:border-y'>
              <h5 className='space-y-2 text-body-base font-semibold'>
                رقم الهاتف
              </h5>

              <Input
                id='phone'
                type='text'
                variant='phone'
                placeholder='رقم الهاتف'
              />
            </div>

            <div className='w-full border-b border-netral-20 py-7 first:border-y'>
              <h5 className='space-y-2 text-body-base font-semibold'>
                البريد الالكتروني
              </h5>

              <Input
                id='email'
                type='text'
                variant='default'
                placeholder='البريد الالكتروني'
              />
            </div>
            <div className='w-full border-b border-netral-20 py-7 first:border-y'>
              <h5 className='space-y-2 text-body-base font-semibold'>
                الجنسية
              </h5>

              <Input
                id='nationality'
                type='text'
                variant='default'
                placeholder='الجنسية'
              />
            </div>
          </div>

          <div className='flex w-full items-start gap-8 border-b border-netral-20 py-7 first:border-y'>
            <div className='w-full max-w-sm space-y-2'>
              <h5 className='space-y-2 text-body-base font-semibold'>
                المنطقة
              </h5>
              <p className='w-64 text-body-sm text-netral-50'>
                اختيار المنطقة التي سيعمل في نطاقها السائق
              </p>
            </div>

            <Selectbox datas={regions} selectedNow={false}></Selectbox>
          </div>

          <div className='flex w-full items-start gap-32 border-b border-netral-20 py-7 first:border-y'>
            <div className='w-full max-w-sm space-y-2'>
              <h5 className='space-y-2 text-body-base font-semibold'>Gender</h5>
              <p className='w-64 text-body-sm text-netral-50'>
                Set the gender for this product
              </p>
            </div>

            <Selectbox datas={genders} selectedNow={false}></Selectbox>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div className='w-full border-b border-netral-20 py-7 first:border-y'>
              <h5 className='space-y-2 text-body-base font-semibold'>
                نوع المركبة
              </h5>
              <Input
                type='text'
                id='vehicle_type'
                variant='default'
                placeholder='Toyota'
              />
            </div>

            <div className='w-full border-b border-netral-20 py-7 first:border-y'>
              <h5 className='space-y-2 text-body-base font-semibold'>
                رقم الهيكل
              </h5>

              <Input
                id='vehicle_number'
                type='text'
                variant='default'
                placeholder='أدخل رقم الهيكل الخاص بالسيارة'
              />
            </div>

            <div className='w-full border-b border-netral-20 py-7 first:border-y'>
              <h5 className='space-y-2 text-body-base font-semibold'>
                موديل المركبة
              </h5>

              <Input
                id='vehicle_model'
                type='text'
                variant='default'
                placeholder='أدخل موديل المركبة'
              />
            </div>
            <div className='w-full border-b border-netral-20 py-7 first:border-y'>
              <h5 className='space-y-2 text-body-base font-semibold'>
                رقم لوحة المركبة
              </h5>

              <Input
                id='vehicle_targa'
                type='text'
                variant='default'
                placeholder='أدخل رقم لوحة المركبة'
              />
            </div>
            <div className='w-full border-b border-netral-20 py-7 first:border-y'>
              <h5 className='space-y-2 text-body-base font-semibold'>
                نوع المركبة
              </h5>

              <Selectbox datas={vehicleTypes} selectedNow={false} />
            </div>
          </div>

          {/* <div className='flex w-full items-start gap-32 border-b border-netral-20 py-7 first:border-y'>
            <div className='w-full max-w-sm space-y-2'>
              <h5 className='space-y-2 text-body-base font-semibold'>Weight</h5>
            </div>

            <Input variant='default' id='weight' placeholder='000' />
          </div>

          <div className='flex w-full items-start gap-32 border-b border-netral-20 py-7 first:border-y'>
            <div className='w-full max-w-sm space-y-2'>
              <h5 className='space-y-2 text-body-base font-semibold'>Status</h5>
              <p className='w-64 text-body-sm text-netral-50'>
                Set a status for your product to determine whether your product
                is displayed or not{" "}
              </p>
            </div>

            <Toggle enabled={toggle} setEnabled={setToggle} />
          </div>

          <div className='flex w-full items-start gap-32 border-b border-netral-20 py-7 first:border-y'>
            <div className='w-full max-w-sm space-y-2'>
              <h5 className='space-y-2 text-body-base font-semibold'>
                Photo Product
              </h5>

              <p className='w-64 text-body-sm text-netral-50'>
                Set the product thumbnail image. Only *.png, *.jpg and *.jpeg
                image files are accepted. Recommended minimum width 1080px X
                1080px, with a max size of 5MB
              </p>
            </div>
            <section className='flex flex-row flex-wrap gap-6'>
              <div
                className={`group relative flex h-48 w-48 flex-col items-center justify-center overflow-hidden rounded-xl ${
                  dropzone
                    ? "border-2 border-dashed border-netral-30 bg-netral-15"
                    : ""
                }`}
              >
                {dropzone ? (
                  <>
                    <UploadSimpleIcon className='h-8 w-8 text-netral-50' />

                    <Button
                      type='button'
                      size='sm'
                      variant='primary-bg'
                      className='mb-2 mt-5'
                      onClick={() => setOpenModalDropzone(true)}
                    >
                      Add Image
                    </Button>

                    <p className='w-10/12 text-center text-body-sm font-medium text-netral-50'>
                      or drop image to upload
                    </p>
                  </>
                ) : (
                  <>
                    <div className='absolute left-1/2 top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 flex-row gap-1.5 opacity-0 transition-all duration-300 ease-out group-hover:opacity-100'>
                      <Button type='button' size='sm' variant='primary-bg'>
                        Edit
                        <PencilSimpleIcon className='h-4 w-4' />
                      </Button>

                      <Button type='button' size='sm' variant='error-bg'>
                        <TrashIcon className='h-4 w-4' />
                      </Button>
                    </div>

                    <div className='relative aspect-square h-40 w-40'>
                      <Image
                        src={"/category-upload.png"}
                        alt='Category Upload'
                        fill
                      />
                    </div>
                  </>
                )}
              </div>

              {!dropzone && (
                <div
                  className={`group relative flex h-48 w-48 flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-netral-30 bg-netral-15`}
                >
                  <UploadSimpleIcon className='h-8 w-8 text-netral-50' />

                  <Button
                    type='button'
                    size='sm'
                    variant='primary-bg'
                    className='mb-2 mt-5'
                    onClick={() => setOpenModalDropzone(true)}
                  >
                    Add Image
                  </Button>

                  <p className='text-center text-body-sm font-medium text-netral-50'>
                    or drop image to upload
                  </p>
                </div>
              )}
            </section>
          </div> */}
        </form>
      </section>

      {/* <section className='relative w-full space-y-7 rounded-lg-10 bg-white p-6'>
        <Title variant='default' size='lg'>
          Price
        </Title>

        <div className='flex w-full items-start gap-32 border-y border-netral-20 py-7 first:border-y'>
          <div className='w-full max-w-sm space-y-2'>
            <h5 className='space-y-2 text-body-base font-semibold'>Price</h5>
          </div>

          <Input
            type='text'
            id='set-discount'
            variant='currency'
            placeholder='0000000'
          />
        </div>

        <div className='flex w-full items-start gap-32 border-b border-netral-20 py-7 first:border-y'>
          <div className='w-full max-w-sm space-y-2'>
            <h5 className='space-y-2 text-body-base font-semibold'>
              Discount Type
            </h5>
            <p className='w-64 text-body-sm text-netral-50'>
              Set your discount type. You can choose the type of discount with a
              percent or cash discount.
            </p>
          </div>

          <Selectbox datas={discountType} selectedNow={false}></Selectbox>
        </div>

        <div className='flex w-full items-start gap-32 py-7 first:border-y'>
          <div className='w-full max-w-sm space-y-2'>
            <h5 className='space-y-2 text-body-base font-semibold'>
              Set Discount
            </h5>
            <p className='w-64 text-body-sm text-netral-50'>
              Please fill in how many discounts you will give for this products.
            </p>
          </div>

          <Input
            variant='default'
            id='set-discount'
            placeholder='Enter nominal discount'
          />
        </div>
      </section> */}

      <PageAction
        actionLabel='Last saved'
        actionDesc='Nov 9, 2022-17.09'
        btnPrimaryLabel='Next'
        btnPrimaryVariant='primary-bg'
        btnPrimaryFun={() => router.push("/products/variants")}
        btnSecondaryLabel='Discard'
        btnsecondaryVariant='primary-nude'
        btnSecondaryFun={() => router.back()}
      />

      <Modal
        variant='default'
        title='Add Image'
        open={openModalDropzone}
        setOpen={setOpenModalDropzone}
        className='max-w-4xl'
      >
        {activeState === 1 && (
          <main className='my-10 flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-netral-30 bg-netral-15 py-20'>
            <DropzoneIll className='h-32 w-32' />

            <h5 className='mb-1 mt-6 text-body-lg font-semibold'>
              Click to upload, or drag and drop
            </h5>

            <p className='text-body-sm text-netral-50'>
              {"SVG, PNG, JPEG (MAX 800X400px)"}
            </p>
          </main>
        )}

        {activeState === 2 && (
          <main className='relative my-10 flex h-96 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-netral-30 bg-netral-15'>
            <div className='relative aspect-square w-96'>
              <Image
                className='h-full w-full object-cover'
                src={"/category-upload.png"}
                alt='Category Upload'
                fill
              />
            </div>

            <div className='absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2'>
              <Button type='button' size='md' variant='default-bg'>
                <RepeatIcon className='h-6 w-6' />
                Replace
              </Button>
            </div>

            <div className='absolute bottom-4 right-4 z-10'>
              <Button type='button' size='md' variant='default-bg'>
                <SelectionPlusIcon className='h-6 w-6' />
                Crop
              </Button>
            </div>
          </main>
        )}

        <footer className='flex flex-row justify-end gap-3'>
          <Button type='button' size='md' variant='default-nude'>
            Discard
          </Button>

          <Button
            type='submit'
            size='md'
            variant='primary-bg'
            onClick={nextState}
          >
            Save
          </Button>
        </footer>
      </Modal>
    </div>
  )
}

export default AddDriverPage
