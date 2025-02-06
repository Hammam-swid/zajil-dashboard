"use client"
import React from "react"
import Link from "next/link"
import Image from "next/image"
import { Tab } from "@headlessui/react"

import { Modal, PageAction } from "@/components/moleculs"
import { Alerts, Badge, Button, Checkbox, Title } from "@/components/atomics"

import {
  ArrowRightIcon,
  FunnelIcon,
  ListIcon,
  PlusIcon,
  SortAscendingIcon,
  SquaresFourIcon
} from "@/assets/icons"

const DBCategories = () => {
  // ------------------------------------------------------------------------------ //
  const [isEmpty, setIsEmpty] = React.useState(true)
  // ------------------------------------------------------------------------------ //
  const [listCategoriesData, setListCategoriesData] = React.useState([
    {
      categoryImage: "/categories/categories-1.png",
      checked: false
    },
    {
      categoryImage: "/categories/categories-2.png",
      checked: false
    },
    {
      categoryImage: "/categories/categories-3.png",
      checked: false
    },
    {
      categoryImage: "/categories/categories-4.png",
      checked: false
    },
    {
      categoryImage: "/categories/categories-5.png",
      checked: false
    }
  ])
  // ------------------------------------------------------------------------------ //
  const checkItem = (index: number, checked: boolean) => {
    const newListCategoriesData = [...listCategoriesData]
    newListCategoriesData[index].checked = checked
    setListCategoriesData(newListCategoriesData)
  }
  const isSelectAll = React.useMemo(
    () => listCategoriesData.filter((item) => !item.checked).length === 0,
    [listCategoriesData]
  )
  const setIsSelectAll = (newIsSelectAll: boolean) => {
    setListCategoriesData(
      listCategoriesData.map((item) => ({ ...item, checked: newIsSelectAll }))
    )
  }
  const isSelecting = React.useMemo(
    () => listCategoriesData.filter((item) => item.checked).length > 0,
    [listCategoriesData]
  )
  // ------------------------------------------------------------------------------ //
  const [openModalDelete, setOpenModalDelete] = React.useState(false)
  const [openModalDraft, setOpenModalDraft] = React.useState(false)
  // ------------------------------------------------------------------------------ //
  const [openAlertsDelete, setOpenAlertsDelete] = React.useState(false)
  const [openAlertsDraft, setOpenAlertsDraft] = React.useState(false)
  // ------------------------------------------------------------------------------ //
  return (
    <div className='relative min-h-screen space-y-6 p-6'>
      <h1 className='text-heading-sm font-semibold'>الأقسام</h1>

      <section className='relative space-y-6 rounded-lg-10 bg-white p-6'>
        {/* Navigation */}
        <nav className='space-y-6'>
          <div className='flex items-center justify-between'>
            <Title size='lg' variant='default'>
              قائمة الأقسام
            </Title>

            <div className='flex flex-row gap-3'>
              <Link href={"/categories/add"}>
                <Button size='md' variant='primary-bg'>
                  <PlusIcon className='h-4 w-4 fill-white stroke-white stroke-[4px]' />
                  إضافة فئة
                </Button>
              </Link>
              <Button size='md' variant='default-bg'>
                ترتيب
                <SortAscendingIcon className='h-4 w-4 stroke-netral-100 stroke-[4px]' />
              </Button>

              <Button size='md' variant='default-bg'>
                تصفية
                <FunnelIcon className='h-4 w-4 stroke-netral-100 stroke-[4px]' />
              </Button>
            </div>
          </div>
        </nav>

        <div className='grid grid-cols-4 gap-5'>
          {listCategoriesData.map((item, index) => (
            <figure
              key={item.categoryImage}
              className='relative w-full space-y-3'
            >
              <div className='absolute left-3 top-6 z-20'>
                <Checkbox
                  active={item.checked}
                  setActive={(value: boolean) => checkItem(index, value)}
                />
              </div>

              <div className='relative flex h-40 w-full items-center justify-center overflow-hidden rounded-lg-10 bg-netral-15'>
                <Link
                  href={"/products/categories/detail"}
                  className='absolute z-10 flex h-full w-full items-center justify-center bg-black/25 opacity-0 transition-all duration-500 ease-out hover:opacity-100'
                >
                  <button className='flex items-center gap-2 rounded-lg border-2 border-white p-2 px-4 font-semibold text-white transition-all duration-300 ease-out hover:bg-white/25'>
                    Detail
                    <ArrowRightIcon className='h-5 w-5 stroke-2 text-white' />
                  </button>
                </Link>

                <div className='relative aspect-square h-32 2xl:h-40'>
                  <Image
                    src={item.categoryImage}
                    alt='Categories 1'
                    sizes='responsive'
                    fill
                  />
                </div>
              </div>

              <figcaption className='space-y-1.5'>
                <h5 className='text-body-xl font-semibold'>الملابس</h5>
                <p className='line-clamp-2 text-body-sm text-netral-50'>
                  الحقائب
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Page Action */}
      {isSelecting && (
        <PageAction
          variant='sticky'
          actionLabel='2 Product Selected'
          btnPrimaryLabel='Delete'
          btnPrimaryVariant='error-bg'
          btnPrimaryFun={() => setOpenModalDelete(true)}
          btnSecondaryLabel='Draft'
          btnsecondaryVariant='warning-outline'
          btnSecondaryFun={() => setOpenModalDraft(true)}
        />
      )}

      <Modal
        variant='error'
        open={openModalDelete}
        title='Delete Category'
        className='max-w-lg'
        setOpen={setOpenModalDelete}
      >
        <main className='mb-10 mt-4'>
          <p className='text-body-base text-netral-80'>
            Are you sure want to delete this category? Category which already
            deleted can not be recovered.
          </p>
        </main>

        <footer className='flex w-full justify-end gap-3'>
          <Button
            size='md'
            variant='default-nude'
            onClick={() => setOpenModalDelete(false)}
          >
            Cancel
          </Button>
          <Button
            size='md'
            variant='error-bg'
            onClick={() => {
              setOpenModalDelete(false)
              setOpenAlertsDelete(true)
            }}
          >
            Submit
          </Button>
        </footer>
      </Modal>

      <Alerts
        variant='error'
        open={openAlertsDelete}
        setOpen={setOpenAlertsDelete}
        title='Category has been deleted'
        desc='Category which already deleted can not be recovered.'
      />

      <Modal
        variant='warning'
        open={openModalDraft}
        title='Draft Category'
        className='max-w-lg'
        setOpen={setOpenModalDraft}
      >
        <main className='mb-10 mt-4'>
          <p className='text-body-base text-netral-80'>
            Are you sure want to draft this category?{" "}
          </p>
        </main>

        <footer className='flex w-full justify-end gap-3'>
          <Button
            size='md'
            variant='default-nude'
            onClick={() => setOpenModalDraft(false)}
          >
            Cancel
          </Button>
          <Button
            size='md'
            variant='warning-bg'
            onClick={() => {
              setOpenModalDraft(false)
              setOpenAlertsDraft(true)
            }}
          >
            Draft
          </Button>
        </footer>
      </Modal>

      <Alerts
        variant='warning'
        open={openAlertsDraft}
        setOpen={setOpenAlertsDraft}
        title='Category has been drafted'
        desc="Don't worry, you can access drafted categories. "
      />
    </div>
  )
}

export default DBCategories
