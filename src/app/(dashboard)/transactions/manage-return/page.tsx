"use client";
import React from "react";

import { Badge, Button, Pagination, Title } from "@/components/atomics";

import { ExportIcon, FunnelIcon, SortAscendingIcon } from "@/assets/icons";

/**
 * Dummy data - Manage Returns
 */
const manageReturnsData = [
  {
    transactionNumber: "430906237494",
    customerName: "Jane Cooper",
    purchasedProduct: "Women's Clothing Azure",
    date: "20 Oct 2022",
    phoneNumber: "+62878981239",
    paymentAmount: "$123",
    status: "warning",
  },
  {
    transactionNumber: "387492287349",
    customerName: "Wade Warren",
    purchasedProduct: "Women's Clothing Azure",
    date: "20 Oct 2022",
    phoneNumber: "+62878981239",
    paymentAmount: "$236",
    status: "success",
  },
  {
    transactionNumber: "093420239402",
    customerName: "Williamson",
    purchasedProduct: "Women's Clothing Azure",
    date: "20 Oct 2022",
    phoneNumber: "+62878981239",
    paymentAmount: "$726",
    status: "success",
  },
  {
    transactionNumber: "934850829349",
    customerName: "Jenny Wilson",
    purchasedProduct: "Women's Clothing Azure",
    date: "20 Oct 2022",
    phoneNumber: "+62878981239",
    paymentAmount: "$124",
    status: "reject",
  },
  {
    transactionNumber: "293840029340",
    customerName: "Williamson",
    purchasedProduct: "Women's Clothing Azure",
    date: "20 Oct 2022",
    phoneNumber: "+62878981239",
    paymentAmount: "$149",
    status: "success",
  },
  {
    transactionNumber: "394024029340",
    customerName: "Robert Fox",
    purchasedProduct: "Women's Clothing Azure",
    date: "20 Oct 2022",
    phoneNumber: "+62878981239",
    paymentAmount: "$152",
    status: "success",
  },
  {
    transactionNumber: "340394023940",
    customerName: "Robert Fox",
    purchasedProduct: "Women's Clothing Azure",
    date: "20 Oct 2022",
    phoneNumber: "+62878981239",
    paymentAmount: "$214",
    status: "reject",
  },
];

const DBTransactionManageRefund = () => {
  return (
    <div className="relative space-y-6 p-6">
      <h1 className="text-heading-sm font-semibold">Returns</h1>

      <section className="relative space-y-6 rounded-lg-10 bg-white p-6">
        <nav className="flex items-center justify-between">
          <Title size="lg" variant="default">
            Return List
          </Title>

          <div className="flex flex-row gap-3">
            <Button size="md" variant="primary-outline">
              Export
              <ExportIcon className="h-4 w-4 stroke-[4px]" />
            </Button>

            <Button size="md" variant="default-bg">
              Sort
              <SortAscendingIcon className="h-4 w-4 stroke-netral-100 stroke-[4px]" />
            </Button>

            <Button size="md" variant="default-bg">
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
                  <span className="text-body-sm font-semibold">Date</span>
                </th>

                <th className="whitespace-nowrap px-3 py-4 text-left text-netral-50 first:rounded-l-lg first:pl-5 last:rounded-r-lg last:pr-5">
                  <span className="text-body-sm font-semibold">
                    Phone Number
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
                      {item.date}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-3 py-5 text-left first:pl-5 last:pr-5">
                    <span className="text-body-base font-medium text-netral-80">
                      {item.phoneNumber}
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
                      href="/transactions/manage-return/detail"
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
      </section>
    </div>
  );
};

export default DBTransactionManageRefund;
