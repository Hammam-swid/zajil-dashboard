"use client";
import React from "react";
import Image from "next/image";
import { Title } from "@/components/atomics";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Store } from "@/types";
import { useParams } from "next/navigation";
import { Star } from "lucide-react";

const getStore = async (storeId: string) => {
  const res = await api.get<{ data: Store }>(`/stores/${storeId}`);
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

  return (
    <div className="relative p-6">
      <h1 className="text-heading-sm font-semibold">تفاصيل المتجر</h1>

      <section className="relative mt-2 space-y-8 rounded-lg-10 bg-white p-6">
        <nav className="flex items-center justify-between">
          <Title size="lg" variant="default">
            {store?.name}
          </Title>

          {/* <Button size="md" variant="primary-outline" href="/outlet/edit">
            <PencilSimpleIcon className="h-5 w-5 stroke-2" />
            Edit Outlet
          </Button> */}
        </nav>

        <section className="flex flex-col gap-16">
          <div className="relative block aspect-video h-80 w-full rounded-lg-10">
            <Image
              className={`h-full w-full rounded-lg-10 object-cover ${
                store?.cover_image ? "brightness-75" : "brightness-[25%]"
              } `}
              src={store?.cover_image || "/outlet-1.jpg"}
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

          <div className="mt-10">
            <h3 className="text-heading-sm font-semibold">الوصف</h3>
            <p className="mt-2 max-w-lg text-body-base text-netral-50">
              {store?.description}
            </p>
          </div>

          <div className="space-y-6">
            {tableDetails.map((detail) => (
              <span key={detail.id} className="grid grid-cols-2">
                <h5 className="text-body-sm uppercase text-netral-50">
                  {detail.heading}
                </h5>

                <p className="text-body-base font-semibold">{detail.text}</p>
              </span>
            ))}
          </div>
        </section>
      </section>
    </div>
  );
};

export default Page;
