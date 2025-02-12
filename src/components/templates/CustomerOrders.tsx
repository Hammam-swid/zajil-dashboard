import React from "react";
import { Badge, Button, Title } from "../atomics";
import { FunnelIcon, SortAscendingIcon } from "@/assets/icons";
import { Order } from "@/types";
import Link from "next/link";

interface CustomerOrdersProps {
  isLoading: boolean;
  orders?: Order[];
}

export default function CustomerOrders({
  isLoading,
  orders,
}: CustomerOrdersProps) {
  console.log(orders);
  return (
    <section className="relative rounded-lg-10 bg-white p-6">
      <nav className="mb-8 flex items-center justify-between">
        <Title size="lg" variant="default">
          سجل الطلبات
        </Title>

        <div className="flex flex-row gap-3">
          <Button size="md" variant="default-bg">
            ترتيب
            <SortAscendingIcon className="h-4 w-4 stroke-2" />
          </Button>
          <Button size="md" variant="default-bg">
            تصفية
            <FunnelIcon className="h-4 w-4 stroke-2" />
          </Button>
        </div>
      </nav>

      {/* Table */}
      <div className="mb-6 overflow-x-auto">
        <table className="w-full table-auto">
          <thead className="bg-netral-15 text-body-sm font-semibold uppercase">
            <tr>
              <th className="whitespace-nowrap px-3 py-4 text-center text-netral-50 first:pl-5 last:pr-5">
                <span className="text-body-sm font-semibold">order_id</span>
              </th>

              <th className="w-56 whitespace-nowrap px-3 py-4 text-center text-netral-50 first:pl-5 last:pr-5">
                <span className="text-body-sm font-semibold">الكود</span>
              </th>

              <th className="whitespace-nowrap px-3 py-4 text-center text-netral-50 first:pl-5 last:pr-5">
                <span className="text-body-sm font-semibold">المتجر</span>
              </th>

              <th className="whitespace-nowrap px-3 py-4 text-center text-netral-50 first:pl-5 last:pr-5">
                <span className="text-body-sm font-semibold">الحالة</span>
              </th>

              <th className="whitespace-nowrap px-3 py-4 text-center text-netral-50 first:pl-5 last:pr-5">
                <span className="text-body-sm font-semibold">
                  السعر الاجمالي
                </span>
              </th>

              <th className="whitespace-nowrap px-3 py-4 text-center text-netral-50 first:pl-5 last:pr-5">
                <span className="text-body-sm font-semibold">
                  تاريخ المعاملة
                </span>
              </th>

              <th className="whitespace-nowrap px-3 py-4 text-center text-netral-50 first:pl-5 last:pr-5">
                <span className="text-body-sm font-semibold">الإجراءات</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-netral-20 pt-4 text-sm">
            {isLoading ? (
              <Skelton />
            ) : (
              orders?.map((order) => (
                <tr key={order.id}>
                  <td className="whitespace-nowrap px-3 py-5 text-center first:pl-5 last:pr-5">
                    <span className="text-body-base font-medium text-netral-80">
                      {order.id}
                    </span>
                  </td>

                  <td className="w-56 whitespace-pre-wrap px-3 py-5 text-center first:pl-5 last:pr-5">
                    <span className="whitespace-pre-wrap break-words text-body-base font-medium text-netral-80">
                      {order.code}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-3 py-5 text-center first:pl-5 last:pr-5">
                    <span className="text-body-base font-medium text-netral-80">
                      {order.store_id}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-3 py-5 text-center first:pl-5 last:pr-5">
                    <span className=" text-body-base font-medium text-netral-80">
                      <Badge
                        variant={
                          order.status === "canceled"
                            ? "error"
                            : order.status === "in-transit"
                            ? "warning"
                            : "success"
                        }
                      >
                        {order.status === "canceled"
                          ? "ملغية"
                          : order.status === "in-transit"
                          ? "جار توصيلها"
                          : order.status === "delivered"
                          ? "تم التوصيل"
                          : order.status}
                      </Badge>
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-3 py-5 text-center first:pl-5 last:pr-5">
                    <span className="text-body-base font-medium text-netral-80">
                      {order.total}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-3 py-5 text-center first:pl-5 last:pr-5">
                    <span className="text-body-base font-medium text-netral-80">
                      {order.created_at.toLocaleString()}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-3 py-5 text-center first:pl-5 last:pr-5">
                    <Link href={`/orders/${order.id}/details`}>
                      <Button type="button" variant="primary-outline">
                        تفاصيل الطلب
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Skelton() {
  return (
    <tr>
      <td className="whitespace-nowrap  text-center ">
        <span className="animate-pulse rounded-md bg-netral-40 px-8 text-body-base font-medium" />
      </td>
      <td className="whitespace-nowrap  text-center ">
        <span className="animate-pulse rounded-md bg-netral-40 px-8 text-body-base font-medium" />
      </td>
      <td className="whitespace-nowrap  text-center ">
        <span className="animate-pulse rounded-md bg-netral-40 px-8 text-body-base font-medium" />
      </td>
      <td className="whitespace-nowrap  text-center ">
        <span className="animate-pulse rounded-md bg-netral-40 px-8 text-body-base font-medium" />
      </td>
      <td className="whitespace-nowrap  text-center ">
        <span className="animate-pulse rounded-md bg-netral-40 px-8 text-body-base font-medium" />
      </td>
      <td className="whitespace-nowrap  text-center ">
        <span className="animate-pulse rounded-md bg-netral-40 px-8 text-body-base font-medium" />
      </td>
    </tr>
  );
}
