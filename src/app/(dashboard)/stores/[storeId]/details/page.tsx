"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Badge, Button, Title } from "@/components/atomics";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Store } from "@/types";
import { useParams } from "next/navigation";
import { Star } from "lucide-react";
import { Modal } from "@/components/moleculs";
import StorePayDuesModal from "@/components/organisms/StorePayDuesModal";

const getStore = async (storeId: string) => {
  const res = await api.get<{ data: Store }>(`/dashboards/stores/${storeId}`);
  return res.data.data;
};

const Page = () => {
  const { storeId } = useParams();
  const { data: store } = useQuery({
    queryKey: ["store-details", { storeId }],
    queryFn: () => getStore(storeId),
  });
  console.log(store);
  const tableDetails = [
    {
      id: 1,
      heading: "العنوان الكامل",
      text: store?.location?.address || "لا يوجد",
    },
    {
      id: 2,
      heading: "المدينة",
      text: store?.location?.city || "لا يوجد",
    },
    {
      id: 3,
      heading: "رقم الهاتف",
      text: "لا يوجد",
    },
    {
      id: 4,
      heading: "رقم الهاتف",
      text: "لا يوجد",
    },
    {
      id: 5,
      heading: "متوسط التقييمات",
      text: (
        <p className="flex items-center gap-2">
          {Number(store?.average_rating).toFixed(2) ?? "لا يوجد"}{" "}
          <Star className="h-4 w-4 fill-yellow-400" />
        </p>
      ),
    },
    {
      id: 6,
      heading: "عدد التقييمات",
      text: store?.number_of_ratings || "لا يوجد",
    },
    {
      id: 7,
      heading: "عدد المتابعين",
      text: store?.number_of_followers || "لا يوجد",
    },
  ];
  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="relative p-6">
      <h1 className="text-heading-sm font-semibold">تفاصيل المتجر</h1>

      <section className="relative mt-2 space-y-8 rounded-lg-10 bg-white p-6">
        <nav className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">{store?.name}</h2>

          <StorePayDuesModal
            maxValue={Math.abs(store?.wallet.balance as number)}
            open={openModal}
            setOpen={setOpenModal}
          />
        </nav>

        <section className="grid grid-cols-2 gap-16">
          <div className="relative block aspect-video h-80 w-full rounded-lg-10">
            <Image
              className={`h-full w-full rounded-lg-10 object-cover ${
                store?.background_image ? "brightness-75" : "brightness-[25%]"
              } `}
              src={store?.background_image || "/outlet-1.jpg"}
              alt="الصورة الخلفية للمتجر"
              width={1920}
              height={1280}
            />
            <div className="absolute bottom-0 right-3 flex h-48 w-48 translate-y-1/2 items-center justify-center overflow-hidden rounded-full bg-white shadow-lg">
              <Image
                src={store?.image || ""}
                alt="Store Photo"
                width={1920}
                height={1440}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div>
            {store?.wallet && (
              <div className="mb-5">
                <div className="mb-2 text-heading-sm font-semibold">
                  المستحقات{" "}
                </div>
                <Badge variant={store.wallet.balance > 0 ? "success" : "error"}>
                  <span className="text-base">
                    {Math.abs(store?.wallet?.balance as number).toFixed(2)} د.ل
                  </span>
                </Badge>
              </div>
            )}
            <div className="">
              <h3 className="text-heading-sm font-semibold">الوصف</h3>
              <p className="max-w-lg text-body-base text-netral-80">
                {store?.description}
              </p>
            </div>

            <div className="mt-8 space-y-6">
              {tableDetails.map((detail) => (
                <span key={detail.id} className="grid grid-cols-2">
                  <h5 className="text-body-sm uppercase text-netral-80">
                    {detail.heading}
                  </h5>

                  <p className="text-body-base font-semibold">{detail.text}</p>
                </span>
              ))}
            </div>
          </div>
        </section>
        {/* Table */}
        <div className="mb-6 mt-6 overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="bg-netral-15 text-body-sm font-semibold uppercase">
              <tr>
                <th className="whitespace-nowrap px-3 py-4 text-center text-netral-50 first:pl-5 last:pr-5">
                  <span className="text-body-sm font-semibold">order_id</span>
                </th>

                <th className="w-56 whitespace-nowrap px-3 py-4 text-center text-netral-50 first:pl-5 last:pr-5">
                  <span className="text-body-sm font-semibold">اسم المتجر</span>
                </th>

                <th className="whitespace-nowrap px-3 py-4 text-center text-netral-50 first:pl-5 last:pr-5">
                  <span className="text-body-sm font-semibold">الكمية</span>
                </th>

                <th className="whitespace-nowrap px-3 py-4 text-center text-netral-50 first:pl-5 last:pr-5">
                  <span className="text-body-sm font-semibold">الحالة</span>
                </th>

                <th className="whitespace-nowrap px-3 py-4 text-center text-netral-50 first:pl-5 last:pr-5">
                  <span className="text-body-sm font-semibold">
                    سعر التوصيل
                  </span>
                </th>

                <th className="whitespace-nowrap px-3 py-4 text-center text-netral-50 first:pl-5 last:pr-5">
                  <span className="text-body-sm font-semibold">
                    السعر الاجمالي
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-netral-20 pt-4 text-sm">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <tr key={item}>
                  <td className="whitespace-nowrap px-3 py-5 text-center first:pl-5 last:pr-5">
                    <span className="text-body-base font-medium text-netral-80">
                      653518
                    </span>
                  </td>

                  <td className="w-56 whitespace-pre-wrap px-3 py-5 text-center first:pl-5 last:pr-5">
                    <span className="whitespace-pre-wrap break-words text-body-base font-medium text-netral-80">
                      {"Heimer Miller Sofa (Mint Condition)"}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-3 py-5 text-center first:pl-5 last:pr-5">
                    <span className="text-body-base font-medium text-netral-80">
                      3
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-3 py-5 text-center first:pl-5 last:pr-5">
                    <span className=" text-body-base font-medium text-netral-80">
                      <Badge variant={item % 2 === 0 ? "success" : "error"}>
                        {item % 2 === 0 ? "تم التوصيل" : "تم الإلغاء"}
                      </Badge>
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-3 py-5 text-center first:pl-5 last:pr-5">
                    <span className="text-body-base font-medium text-netral-80">
                      $739.65
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-3 py-5 text-center first:pl-5 last:pr-5">
                    <span className="text-body-base font-medium text-netral-80">
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
  );
};

export default Page;
