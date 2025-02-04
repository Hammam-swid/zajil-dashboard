"use client"
import React from "react"
import { Modal, PageAction } from "@/components/moleculs"
import {
  Alerts,
  Button,
  Checkbox,
  Pagination,
  Title
} from "@/components/atomics"
import { FunnelIcon, PlusIcon, SortAscendingIcon } from "@/assets/icons"
import Link from "next/link"

const DBDriversUsers = () => {
  const [usersData, setUsersData] = React.useState([
    {
      id: 1,
      name: "Samanta Legend",
      email: "0910091917",
      region: "حي الأندلس",
      createAt: "Orange",
      date: "May 6, 2012",
      checked: false
    },
    {
      id: 2,
      name: "Annette Black",
      email: "0910091917",
      region: "عين زارة",
      createAt: "Toledo",
      date: "April 28, 2016",
      checked: false
    },
    {
      id: 3,
      name: "Dianne Russell",
      email: "0910091917",
      region: "سوق الجمعة",
      createAt: "Naperville",
      date: "November 16, 2014",
      checked: false
    },
    {
      id: 4,
      name: "Devon Lane",
      email: "0910091917",
      region: "حي الأندلس",
      createAt: "Fairfield",
      date: "March 23, 2013",
      checked: false
    },
    {
      id: 5,
      name: "Marvin McKinney",
      email: "0910091917",
      region: "أبو سليم",
      createAt: "Austin",
      date: "November 16, 2014",
      checked: false
    },
    {
      id: 6,
      name: "Jerome Bell",
      email: "0910091917",
      region: "السراج",
      createAt: "Orange",
      date: "March 23, 2013",
      checked: false
    }
  ])
  //----------------------------------------------------------------------------------//
  const checkItem = (index: number, checked: boolean) => {
    const newUsersData = [...usersData]
    newUsersData[index].checked = checked
    setUsersData(newUsersData)
  }
  const isSelectAll = React.useMemo(
    () => usersData.filter((item) => !item.checked).length === 0,
    [usersData]
  )
  const setIsSelectAll = (newIsSelectAll: boolean) => {
    setUsersData(
      usersData.map((item) => ({ ...item, checked: newIsSelectAll }))
    )
  }
  const isSelecting = React.useMemo(
    () => usersData.filter((item) => item.checked).length > 0,
    [usersData]
  )
  const [openModalDelete, setOpenModalDelete] = React.useState(false)
  const [openAlertsDelete, setOpenAlertsDelete] = React.useState(false)
  //----------------------------------------------------------------------------------//

  const [page, setPage] = React.useState(1)

  return (
    <div className='relative space-y-6 p-6'>
      <section className='relative rounded-lg-10 bg-white p-6'>
        <nav className='mb-8 flex items-center justify-between'>
          <Title size='lg' variant='default'>
            السائقين
          </Title>

          <div className='flex flex-row gap-3'>
            <Link href='/drivers/add'>
              <Button type='button' size='md' variant='primary-bg'>
                <span>أضف سائق</span>
                <PlusIcon className='h-4 w-4 text-neutral-50' />
              </Button>
            </Link>
            <Button type='button' size='md' variant='default-bg'>
              ترتيب
              <SortAscendingIcon className='h-4 w-4 stroke-netral-100 stroke-[4px]' />
            </Button>

            <Button type='button' size='md' variant='default-bg'>
              تصفية
              <FunnelIcon className='h-4 w-4 stroke-netral-100 stroke-[4px]' />
            </Button>
          </div>
        </nav>

        <div className='mb-6 overflow-x-auto'>
          <table className='w-full table-auto'>
            <thead className='bg-netral-15 text-body-sm font-semibold uppercase'>
              <tr>
                <th className='w-px whitespace-nowrap px-3 py-4 first:pl-5 last:pr-5'>
                  <Checkbox active={isSelectAll} setActive={setIsSelectAll} />
                </th>

                <th className='whitespace-nowrap px-3 py-4 text-center text-netral-50 first:pl-5 last:pr-5'>
                  <span className='text-body-sm font-semibold'>الاسم</span>
                </th>

                <th className='whitespace-nowrap px-3 py-4 text-center text-netral-50 first:pl-5 last:pr-5'>
                  <span className='text-body-sm font-semibold'>رقم الهاتف</span>
                </th>

                <th className='w-56 whitespace-nowrap px-3 py-4 text-center text-netral-50 first:pl-5 last:pr-5'>
                  <span className='text-body-sm font-semibold'>المنطقة</span>
                </th>

                <th className='whitespace-nowrap px-3 py-4 text-center text-netral-50 first:pl-5 last:pr-5'>
                  <span className='text-body-sm font-semibold'>إنشاء في</span>
                </th>

                <th className='whitespace-nowrap px-3 py-4 text-center text-netral-50 first:pl-5 last:pr-5'>
                  <span className='text-body-sm font-semibold'>
                    النشاط الأخير
                  </span>
                </th>

                <th className='whitespace-nowrap px-3 py-4 text-center text-netral-50 first:pl-5 last:pr-5'>
                  <span className='text-body-sm font-semibold'>الإجراءات</span>
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-netral-20 pt-4 text-sm'>
              {usersData.map((item, index) => (
                <tr key={item.email}>
                  <td className='w-px whitespace-nowrap px-3 py-5 first:pl-5 last:pr-5'>
                    <Checkbox
                      active={item.checked}
                      setActive={(value: boolean) => checkItem(index, value)}
                    />
                  </td>
                  <td className='whitespace-nowrap px-3 py-5 text-center first:pl-5 last:pr-5'>
                    <span className='text-body-base font-medium text-netral-80'>
                      {item.name}
                    </span>
                  </td>

                  <td className='whitespace-nowrap px-3 py-5 text-center first:pl-5 last:pr-5'>
                    <span className='text-body-base font-medium text-netral-80'>
                      {item.email}
                    </span>
                  </td>

                  <td className='w-56 whitespace-pre-wrap px-3 py-5 text-center first:pl-5 last:pr-5'>
                    <span className='whitespace-pre-wrap break-words text-body-base font-medium text-netral-80'>
                      {item.region}
                    </span>
                  </td>

                  <td className='whitespace-nowrap px-3 py-5 text-center first:pl-5 last:pr-5'>
                    <span className='text-body-base font-medium text-netral-80'>
                      {item.createAt}
                    </span>
                  </td>

                  <td className='whitespace-nowrap px-3 py-5 text-center first:pl-5 last:pr-5'>
                    <span className='text-body-base font-medium text-netral-80'>
                      {item.date}
                    </span>
                  </td>

                  <td className='whitespace-nowrap px-3 py-5 text-center first:pl-5 last:pr-5'>
                    <Link href={`/drivers/${item.id}/details`}>
                      <Button size='md' variant='primary-nude'>
                        التفاصيل
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination page={page} setPage={setPage} />
      </section>

      {/* Page Action */}
      {isSelecting && (
        <PageAction
          variant='sticky'
          actionLabel='2 Product Selected'
          btnPrimaryLabel='Delete'
          btnPrimaryVariant='error-bg'
          btnPrimaryFun={() => setOpenModalDelete(true)}
        />
      )}

      <Modal
        variant='error'
        open={openModalDelete}
        title='حذف مستخدم'
        className='max-w-lg'
        setOpen={setOpenModalDelete}
      >
        <main className='mb-10 mt-4'>
          <p className='text-body-base text-netral-80'>
            هل أنت متأكد من أنك تريد حذف هذا المستخدم؟ لا يمكن استرداد المستخدم
            الذي تم حذفه بالفعل.
          </p>
        </main>

        <footer className='flex w-full justify-end gap-3'>
          <Button
            size='md'
            variant='default-nude'
            onClick={() => setOpenModalDelete(false)}
          >
            إلغاء
          </Button>
          <Button
            size='md'
            variant='error-bg'
            onClick={() => {
              setOpenModalDelete(false)
              setOpenAlertsDelete(true)
            }}
          >
            حذف
          </Button>
        </footer>
      </Modal>

      <Alerts
        variant='error'
        open={openAlertsDelete}
        setOpen={setOpenAlertsDelete}
        title='تم حذف المستخدمين'
        desc='لا يمكن استرداد المستخدم الذي تم حذفه بالفعل.'
      />
    </div>
  )
}

export default DBDriversUsers
