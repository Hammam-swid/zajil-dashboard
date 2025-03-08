"use client";

import { Badge, Button, Title } from "@/components/atomics";
import dateFormat from "dateformat";

import { PencilSimpleIcon } from "@/assets/icons";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Order } from "@/types";
import { useParams } from "next/navigation";

const getOrder = async (id: string) => {
  const res = await api.get<{ data: Order }>(`/dashboards/orders/${id}`);
  return res.data.data;
};

const Page = () => {
  const { orderId } = useParams();
  const { data: order, isLoading } = useQuery({
    queryKey: ["order-details", orderId],
    queryFn: () => getOrder(orderId),
    staleTime: 1000 * 60 * 60,
  });

  return (
    <div className="relative space-y-6 p-6">
      <section className="relative rounded-lg-10 bg-white p-6">
        <nav className="mb-8 flex items-center justify-between">
          <Title size="lg" variant="default">
            معلومات الطلب
          </Title>

          <Link href={"#"}>
            <Button size="md" variant="primary-bg" type="button">
              <PencilSimpleIcon className="h-4 w-4 stroke-[4px]" />
              تعديل
            </Button>
          </Link>
        </nav>

        <section className="">
          <h5 className="font-bold">ملخص الطلب</h5>
          <div className="mt-4">
            <span className="font-bold">كود الطلب: </span>
            <span>{order?.code}</span>
          </div>
          <div className="mt-2">
            <span className="font-bold">تاريخ الطلب: </span>
            <span>
              {dateFormat(order?.created_at, "dd-mm-yyyy (HH:MM:ss)")}
            </span>
          </div>
          <div className="mt-2">
            <span className="font-bold">الحالة: </span>
            <Badge
              variant={
                order?.status === "success"
                  ? "success"
                  : order?.status === "in-transit"
                  ? "info"
                  : "error"
              }
            >
              {order?.status === "in-transit"
                ? "جار التوصيل"
                : order?.status === "canceled"
                ? "ملغية"
                : order?.status === "success"
                ? "تم التوصيل"
                : order?.status}
            </Badge>
          </div>
          <div className="mt-2">
            <span className="font-bold">الاجمالي: </span>
            <span>{order?.total} LYD</span>
          </div>
        </section>

        <section className="mt-8">
          <h5 className="font-bold">تفاصيل المنتجات</h5>
          <div className="flex flex-wrap gap-4">
            {order?.orderProducts?.map((product) => (
              <div key={order.id} className="mt-4 flex items-center gap-4">
                <Image
                  src={product.images[0].image}
                  alt="صورة المنتج"
                  width={100}
                  height={100}
                  className="rounded-md shadow-md"
                />
                <div>
                  <span className="font-bold">{product.name}</span>
                  <p className="text-body-sm text-netral-60">
                    <span>الكمية: </span> {product.quantity}
                  </p>
                  <span>LYD {product.price_at_purchase}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-8 grid grid-cols-2 gap-4">
          <section className="p-4">
            <h3 className="font-bold">معلومات المستخدم</h3>
            <div className="mt-3 flex gap-3">
              {console.log(order?.user.profile_photo_path) ?? ""}
              <Image
                className="h-10 w-10 rounded-full"
                src={
                  order?.user.profile_photo_path
                    ? order.user.profile_photo_path
                    : "/avatar-default.png"
                }
                alt="صورة المستخدم"
                width={100}
                height={100}
              />
              <div>
                <p>{order?.user.name}</p>
                <p className="text-netral-50">
                  ID: <span>{order?.user.id}</span>
                </p>
              </div>
            </div>
          </section>

          <section className="p-4">
            <h3 className="font-bold">معلومات المتجر</h3>
            <div className="mt-3 flex gap-3">
              <Image
                className="h-10 w-10 rounded-full"
                src={order?.store.image || ""}
                alt="Avatar"
                width={100}
                height={100}
              />
              <div>
                <p className="font-bold">{order?.store.name}</p>
                <p className="text-netral-50">
                  ID: <span>{order?.store.id}</span>
                </p>
              </div>
            </div>
          </section>
        </div>

        <section className="mt-8">
          <h5 className="font-bold">التحويلات المالية</h5>
          <div className="mt-4">
            <span className="font-bold">ID: </span>
            <span>{order?.transaction.id}</span>
          </div>
          <div className="mt-2">
            <span className="font-bold">الحالة: </span>
            <Badge
              variant={
                order?.transaction.status === "success"
                  ? "success"
                  : order?.transaction.status === "pending"
                  ? "info"
                  : "error"
              }
            >
              {order?.transaction.status === "success"
                ? "ناجحة"
                : order?.transaction.status === "pending"
                ? "قيد الانتظار"
                : order?.transaction.status === "canceled"
                ? "فشلت"
                : order?.transaction.status}
            </Badge>
          </div>
          <div className="mt-2">
            <span className="font-bold">المبلغ: </span>
            <span>
              {order?.transaction.amount} {order?.transaction.currency}
            </span>
          </div>
        </section>
      </section>
    </div>
  );
};

export default Page;
