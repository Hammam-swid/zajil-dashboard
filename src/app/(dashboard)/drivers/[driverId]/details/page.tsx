"use client"

import { Badge, Button, Title } from "@/components/atomics"

import {
  CheckIcon,
  FunnelIcon,
  PencilSimpleIcon,
  SortAscendingIcon
} from "@/assets/icons"
import Image from "next/image"
import Link from "next/link"
import { Switch } from "@headlessui/react"
import { useState } from "react"

const Page = () => {
  const [isActive, setIsActive] = useState(false)
  return (
    <div className='relative space-y-6 p-6'>
      <section className='relative rounded-lg-10 bg-white p-6'>
        <nav className='mb-8 flex items-center justify-between'>
          <Title size='lg' variant='default'>
            معلومات السائق
          </Title>

          <Link href={"edit"}>
            <Button size='md' variant='primary-bg' type='button'>
              <PencilSimpleIcon className='h-4 w-4 stroke-[4px]' />
              تعديل
            </Button>
          </Link>
        </nav>

        <section className='relative flex flex-row items-center gap-5'>
          <div className='relative aspect-square h-[8.25rem] w-[8.25rem]  rounded-full'>
            <Image
              src={"/avatar-default.png"}
              className='h-full w-full object-cover'
              alt='Avatar'
              fill
            />
          </div>

          <div className='space-y-7'>
            <h3 className='text-heading-sm font-semibold'>همام سويد</h3>

            <section className='flex flex-row items-start gap-2.5'>
              <div className='w-72 space-y-1.5'>
                <h5 className='text-body-sm uppercase text-netral-50'>
                  البريد الالكتروني
                </h5>

                <p dir='ltr' className='text-right text-body-base font-medium'>
                  182159@cctt.edu.ly
                </p>
              </div>

              <div className='w-72 space-y-1.5'>
                <h5 className='text-body-sm uppercase text-netral-50'>
                  رقم الهاتف
                </h5>

                <p dir='ltr' className='text-right text-body-base font-medium'>
                  (+218) 91-0064106
                </p>
              </div>

              <div className='w-72 space-y-1.5'>
                <h5 className='text-body-sm uppercase text-netral-50'>
                  المنطقة
                </h5>

                <p className='text-body-base font-medium'>النجيلة</p>
              </div>
              <Switch
                checked={isActive}
                onChange={setIsActive}
                className={`group absolute end-0 inline-flex h-7 w-14 items-center rounded-full p-1  transition ${
                  !isActive ? "justify-end bg-gray-200" : "bg-primary-main"
                }`}
              >
                <span className={`h-4 w-4 rounded-full bg-white transition`} />
              </Switch>
            </section>
          </div>
          <section>
            {/*
             */}
          </section>
        </section>
      </section>

      <section className='relative rounded-lg-10 bg-white p-6'>
        <nav className='mb-8 flex items-center justify-between'>
          <Title size='lg' variant='default'>
            سجل الطلبات
          </Title>

          <div className='flex flex-row gap-3'>
            <Button size='md' variant='default-bg'>
              ترتيب
              <SortAscendingIcon className='h-4 w-4 stroke-2' />
            </Button>
            <Button size='md' variant='default-bg'>
              تصفية
              <FunnelIcon className='h-4 w-4 stroke-2' />
            </Button>
          </div>
        </nav>

        {/* Table */}
        <div className='mb-6 overflow-x-auto'>
          <table className='w-full table-auto'>
            <thead className='bg-netral-15 text-body-sm font-semibold uppercase'>
              <tr>
                <th className='whitespace-nowrap px-3 py-4 text-center text-netral-50 first:pl-5 last:pr-5'>
                  <span className='text-body-sm font-semibold'>order_id</span>
                </th>

                <th className='w-56 whitespace-nowrap px-3 py-4 text-center text-netral-50 first:pl-5 last:pr-5'>
                  <span className='text-body-sm font-semibold'>اسم المتجر</span>
                </th>

                <th className='whitespace-nowrap px-3 py-4 text-center text-netral-50 first:pl-5 last:pr-5'>
                  <span className='text-body-sm font-semibold'>الكمية</span>
                </th>

                <th className='whitespace-nowrap px-3 py-4 text-center text-netral-50 first:pl-5 last:pr-5'>
                  <span className='text-body-sm font-semibold'>الحالة</span>
                </th>

                <th className='whitespace-nowrap px-3 py-4 text-center text-netral-50 first:pl-5 last:pr-5'>
                  <span className='text-body-sm font-semibold'>
                    سعر التوصيل
                  </span>
                </th>

                <th className='whitespace-nowrap px-3 py-4 text-center text-netral-50 first:pl-5 last:pr-5'>
                  <span className='text-body-sm font-semibold'>
                    السعر الاجمالي
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-netral-20 pt-4 text-sm'>
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <tr key={item}>
                  <td className='whitespace-nowrap px-3 py-5 text-center first:pl-5 last:pr-5'>
                    <span className='text-body-base font-medium text-netral-80'>
                      653518
                    </span>
                  </td>

                  <td className='w-56 whitespace-pre-wrap px-3 py-5 text-center first:pl-5 last:pr-5'>
                    <span className='whitespace-pre-wrap break-words text-body-base font-medium text-netral-80'>
                      {"Heimer Miller Sofa (Mint Condition)"}
                    </span>
                  </td>

                  <td className='whitespace-nowrap px-3 py-5 text-center first:pl-5 last:pr-5'>
                    <span className='text-body-base font-medium text-netral-80'>
                      3
                    </span>
                  </td>

                  <td className='whitespace-nowrap px-3 py-5 text-center first:pl-5 last:pr-5'>
                    <span className=' text-body-base font-medium text-netral-80'>
                      <Badge variant={item % 2 === 0 ? "success" : "error"}>
                        {item % 2 === 0 ? "تم التوصيل" : "تم الإلغاء"}
                      </Badge>
                    </span>
                  </td>

                  <td className='whitespace-nowrap px-3 py-5 text-center first:pl-5 last:pr-5'>
                    <span className='text-body-base font-medium text-netral-80'>
                      $739.65
                    </span>
                  </td>

                  <td className='whitespace-nowrap px-3 py-5 text-center first:pl-5 last:pr-5'>
                    <span className='text-body-base font-medium text-netral-80'>
                      ${782.01}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default Page
