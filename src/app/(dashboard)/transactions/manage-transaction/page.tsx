"use client";
import React from "react";
import { Popover, RadioGroup, Transition } from "@headlessui/react";

import {
  Badge,
  Button,
  Pagination,
  Selectbox,
  Title,
} from "@/components/atomics";
import { Modal } from "@/components/moleculs";

import {
  ExportIcon,
  FilePDFIcon,
  FileTextIcon,
  FileXIcon,
  FunnelIcon,
  SortAscendingIcon,
} from "@/assets/icons";

/**
 * Dummy data - Manage Returns
 */
const manageReturnsData = [
  {
    transactionNumber: "430906237494",
    customerName: "Jane Cooper",
    purchasedProduct: "Women's Clothing Azure",
    date: "20 Oct 2022",
    totalProducts: 2,
    paymentAmount: "$123",
    status: "warning",
  },
  {
    transactionNumber: "387492287349",
    customerName: "Wade Warren",
    purchasedProduct: "Women's Clothing Azure",
    date: "20 Oct 2022",
    totalProducts: 3,
    paymentAmount: "$236",
    status: "success",
  },
  {
    transactionNumber: "093420239402",
    customerName: "Williamson",
    purchasedProduct: "Windproof Handbell Oversized Long Coat",
    date: "20 Oct 2022",
    totalProducts: 1,
    paymentAmount: "$726",
    status: "success",
  },
  {
    transactionNumber: "934850829349",
    customerName: "Jenny Wilson",
    purchasedProduct: "Women's Turtleneck Sweater",
    date: "20 Oct 2022",
    totalProducts: 5,
    paymentAmount: "$124",
    status: "reject",
  },
  {
    transactionNumber: "293840029340",
    customerName: "Williamson",
    purchasedProduct: "T-Men's UA Storm Armour Down Jacket",
    date: "20 Oct 2022",
    totalProducts: 2,
    paymentAmount: "$149",
    status: "success",
  },
  {
    transactionNumber: "394024029340",
    customerName: "Robert Fox",
    purchasedProduct: "Women's Clothing Azure",
    date: "20 Oct 2022",
    totalProducts: 4,
    paymentAmount: "$152",
    status: "success",
  },
  {
    transactionNumber: "340394023940",
    customerName: "Robert Fox",
    purchasedProduct: "One Set - Casual Hoodie with Buttons for Tooddler",
    date: "20 Oct 2022",
    totalProducts: 1,
    paymentAmount: "$214",
    status: "reject",
  },
];

const DBTransactionManageTransaction = () => {
  // --------------------------------------------------------------------
  const [openModalFilter, setOpenModalFilter] = React.useState(false);
  // --------------------------------------------------------------------
  return (
    <div className="relative space-y-6 p-6">
      <h1 className="text-heading-sm font-semibold">Transaction</h1>

      <section className="relative rounded-lg-10 bg-white p-6">
        <div className="space-y-6">
          {/* Navigation */}
          <nav className="flex items-center justify-between">
            <Title size="lg" variant="default">
              Transaction List
            </Title>

            <div className="relative flex flex-row gap-3">
              <Popover as="div" className={"relative"}>
                <Button
                  size="md"
                  variant="primary-outline"
                  onClick={() => {
                    return;
                  }}
                >
                  <Popover.Button
                    as="div"
                    className={"group absolute inset-0 h-full w-full outline-0"}
                  />
                  Export
                  <ExportIcon className="h-4 w-4 stroke-[4px]" />
                </Button>

                <Transition
                  as={React.Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0 translate-y-1"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 translate-y-1"
                >
                  <Popover.Panel className="absolute right-0 z-10 mt-3 w-64 transform bg-white p-3">
                    <div className="flex flex-col items-start overflow-hidden rounded-lg p-3 shadow-lg ring-1 ring-black ring-opacity-5">
                      <button className="flex w-full items-center gap-4 rounded-lg-10 p-3 text-body-base font-medium text-netral-80 transition-all duration-300 ease-out hover:bg-netral-20">
                        <FilePDFIcon className="h-6 w-6" />
                        Export as PDF
                      </button>

                      <button className="flex w-full items-center gap-4 rounded-lg-10 p-3 text-body-base font-medium text-netral-80 transition-all duration-300 ease-out hover:bg-netral-20">
                        <FileXIcon className="h-6 w-6" />
                        Export as Excel
                      </button>

                      <button className="flex w-full items-center gap-4 rounded-lg-10 p-3 text-body-base font-medium text-netral-80 transition-all duration-300 ease-out hover:bg-netral-20">
                        <FileTextIcon className="h-6 w-6" />
                        Export as CSV
                      </button>
                    </div>
                  </Popover.Panel>
                </Transition>
              </Popover>

              <Popover as="div" className={"relative"}>
                <Button
                  size="md"
                  variant="default-bg"
                  onClick={() => {
                    return;
                  }}
                >
                  <Popover.Button
                    as="div"
                    className={"group absolute inset-0 h-full w-full outline-0"}
                  />
                  Sort
                  <SortAscendingIcon className="h-4 w-4 stroke-netral-100 stroke-[4px]" />
                </Button>

                <Transition
                  as={React.Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0 translate-y-1"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 translate-y-1"
                >
                  <Popover.Panel className="absolute right-0 z-10 mt-3 w-64 transform bg-white p-3">
                    <div className="flex flex-col items-start overflow-hidden rounded-lg p-3 shadow-lg ring-1 ring-black ring-opacity-5">
                      <button className="flex w-full items-center gap-4 rounded-lg-10 p-3 text-body-base font-medium text-netral-80 transition-all duration-300 ease-out hover:bg-netral-20">
                        Most Recent
                      </button>

                      <button className="flex w-full items-center gap-4 rounded-lg-10 p-3 text-body-base font-medium text-netral-80 transition-all duration-300 ease-out hover:bg-netral-20">
                        Status
                      </button>

                      <button className="flex w-full items-center gap-4 rounded-lg-10 p-3 text-body-base font-medium text-netral-80 transition-all duration-300 ease-out hover:bg-netral-20">
                        Customer name A to Z
                      </button>

                      <button className="flex w-full items-center gap-4 rounded-lg-10 p-3 text-body-base font-medium text-netral-80 transition-all duration-300 ease-out hover:bg-netral-20">
                        Customer name Z to A
                      </button>

                      <button className="flex w-full items-center gap-4 rounded-lg-10 p-3 text-body-base font-medium text-netral-80 transition-all duration-300 ease-out hover:bg-netral-20">
                        Highest payment
                      </button>

                      <button className="flex w-full items-center gap-4 rounded-lg-10 p-3 text-body-base font-medium text-netral-80 transition-all duration-300 ease-out hover:bg-netral-20">
                        Lowest payment
                      </button>
                    </div>
                  </Popover.Panel>
                </Transition>
              </Popover>

              <Button
                size="md"
                variant="default-bg"
                onClick={() => setOpenModalFilter(true)}
              >
                Filter
                <FunnelIcon className="h-4 w-4 stroke-netral-100 stroke-[4px]" />
              </Button>
            </div>
          </nav>

          {/* Table */}
          <div className="mb-6 overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="bg-netral-15 text-body-sm font-semibold uppercase">
                <tr>
                  <th className="whitespace-nowrap px-3 py-4 text-left text-netral-50 first:rounded-l-lg first:pl-5 last:rounded-r-lg last:pr-5">
                    <span className="text-body-sm font-semibold">
                      Transaction Number
                    </span>
                  </th>

                  <th className="whitespace-nowrap px-3 py-4 text-left text-netral-50 first:rounded-l-lg first:pl-5 last:rounded-r-lg last:pr-5">
                    <span className="text-body-sm font-semibold">
                      Customer Name
                    </span>
                  </th>

                  <th className="w-56 whitespace-nowrap px-3 py-4 text-left text-netral-50 first:rounded-l-lg first:pl-5 last:rounded-r-lg last:pr-5">
                    <span className="text-body-sm font-semibold">
                      Purchased Product
                    </span>
                  </th>

                  <th className="whitespace-nowrap px-3 py-4 text-left text-netral-50 first:rounded-l-lg first:pl-5 last:rounded-r-lg last:pr-5">
                    <span className="text-body-sm font-semibold">
                      Total Product
                    </span>
                  </th>

                  <th className="whitespace-nowrap px-3 py-4 text-left text-netral-50 first:rounded-l-lg first:pl-5 last:rounded-r-lg last:pr-5">
                    <span className="text-body-sm font-semibold">Amount</span>
                  </th>

                  <th className="whitespace-nowrap px-3 py-4 text-left text-netral-50 first:rounded-l-lg first:pl-5 last:rounded-r-lg last:pr-5">
                    <span className="text-body-sm font-semibold">Status</span>
                  </th>

                  <th className="whitespace-nowrap px-3 py-4 text-left text-netral-50 first:rounded-l-lg first:pl-5 last:rounded-r-lg last:pr-5">
                    <span className="text-body-sm font-semibold">Action</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-netral-20 pt-4 text-sm">
                {manageReturnsData.map((item) => (
                  <tr key={item.customerName}>
                    <td className="whitespace-nowrap px-3 py-5 text-left first:pl-5 last:pr-5">
                      <span className="text-body-base font-medium text-netral-80">
                        {item.transactionNumber}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-3 py-5 text-left first:pl-5 last:pr-5">
                      <span className="text-body-base font-medium text-netral-80">
                        {item.customerName}
                      </span>
                    </td>

                    <td className="w-56 whitespace-pre-wrap px-3 py-5 text-left first:pl-5 last:pr-5">
                      <span className="w-56 whitespace-pre-wrap break-words text-body-base font-medium text-netral-80">
                        {item.purchasedProduct}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-3 py-5 text-left first:pl-5 last:pr-5">
                      <span className="text-body-base font-medium text-netral-80">
                        {item.totalProducts}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-3 py-5 text-left first:pl-5 last:pr-5">
                      <span className="text-body-base font-medium text-netral-80">
                        {item.paymentAmount}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-3 py-5 text-left capitalize first:pl-5 last:pr-5">
                      {item.status === "success" ? (
                        <Badge variant="success">{item.status}</Badge>
                      ) : item.status === "reject" ? (
                        <Badge variant="error">{item.status}</Badge>
                      ) : item.status === "warning" ? (
                        <Badge variant="warning">{item.status}</Badge>
                      ) : null}
                    </td>

                    <td className="whitespace-nowrap px-3 py-5 text-left first:pl-5 last:pr-5">
                      <Button
                        size="md"
                        variant="primary-nude"
                        href="/transactions/manage-transaction/detail"
                      >
                        Detail
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {/* <Pagination /> */}
        </div>
      </section>

      <Modal
        open={openModalFilter}
        setOpen={setOpenModalFilter}
        title="Filter"
        variant="default"
        className="max-w-lg"
      >
        <main className="my-6 space-y-6 border-y border-netral-30 py-6">
          <Selectbox
            label="Status"
            datas={[
              { name: "Select Status", disabled: true },
              { name: "Waiting" },
              { name: "Resolved" },
            ]}
          />

          <RadioGroup>
            <RadioGroup.Label className={"mb-2.5 text-body-sm font-semibold"}>
              Total Product
            </RadioGroup.Label>

            <section className="flex flex-row gap-3">
              <RadioGroup.Option
                value="startup"
                className={
                  "cursor-pointer rounded-lg bg-netral-15 px-6 py-3 ui-active:bg-primary-main ui-active:text-white"
                }
              >
                <span className="pointer-events-none text-body-base font-bold">
                  {"< 10"}
                </span>
              </RadioGroup.Option>

              <RadioGroup.Option
                value="startup"
                className={
                  "cursor-pointer rounded-lg bg-netral-15 px-6 py-3 ui-active:bg-primary-main ui-active:text-white"
                }
              >
                <span className="pointer-events-none text-body-base font-bold">
                  {"11-20"}
                </span>
              </RadioGroup.Option>

              <RadioGroup.Option
                value="startup"
                className={
                  "cursor-pointer rounded-lg bg-netral-15 px-6 py-3 ui-active:bg-primary-main ui-active:text-white"
                }
              >
                <span className="pointer-events-none cursor-pointer font-bold">
                  {"> 21"}
                </span>
              </RadioGroup.Option>
            </section>
          </RadioGroup>

          <RadioGroup>
            <RadioGroup.Label className={"mb-2.5 text-body-sm  font-semibold"}>
              Transaction Amount
            </RadioGroup.Label>

            <section className="flex flex-row gap-3">
              <RadioGroup.Option
                value="startup"
                className={
                  "cursor-pointer rounded-lg bg-netral-15 px-6 py-3 ui-active:bg-primary-main ui-active:text-white"
                }
              >
                <span className="pointer-events-none text-body-base font-bold">
                  {"≤ $500"}
                </span>
              </RadioGroup.Option>

              <RadioGroup.Option
                value="startup"
                className={
                  "cursor-pointer rounded-lg bg-netral-15 px-6 py-3 ui-active:bg-primary-main ui-active:text-white"
                }
              >
                <span className="pointer-events-none text-body-base font-bold">
                  {"$501 - $999"}
                </span>
              </RadioGroup.Option>

              <RadioGroup.Option
                value="startup"
                className={
                  "cursor-pointer rounded-lg bg-netral-15 px-6 py-3 ui-active:bg-primary-main ui-active:text-white"
                }
              >
                <span className="pointer-events-none cursor-pointer font-bold">
                  {"≥ $1,000"}
                </span>
              </RadioGroup.Option>
            </section>
          </RadioGroup>
        </main>

        <footer className="flex items-center justify-end gap-3">
          <Button
            size="lg"
            variant="primary-nude"
            onClick={() => setOpenModalFilter(false)}
          >
            Cancel
          </Button>

          <Button
            size="lg"
            variant="primary-bg"
            onClick={() => setOpenModalFilter(false)}
          >
            Add Outlet
          </Button>
        </footer>
      </Modal>
    </div>
  );
};

export default DBTransactionManageTransaction;
