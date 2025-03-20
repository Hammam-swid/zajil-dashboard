"use client";

import Image from "next/image";
import React from "react";
import { Title } from "../atomics";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Store } from "@/types";
import { Star } from "lucide-react";

const getTopStores = async () => {
  const res = await api.get("/stores?most_rated=true&per_page=5");
  return res.data.data as Store[];
};

export default function TopStores() {
  const { data: stores, isLoading } = useQuery({
    queryKey: ["top-stores"],
    queryFn: getTopStores,
  });
  return (
    <section className="relative col-span-8 space-y-6 rounded-lg-10 bg-white p-6">
      <nav className="flex items-center justify-between">
        <Title size="lg" variant="default">
          أعلى 5 متاجر تقييما
        </Title>
      </nav>

      {/* Table */}
      <div className="mb-6 overflow-x-hidden">
        <table className="w-full table-auto">
          <thead className="text-body-sm font-semibold uppercase">
            <tr>
              <th className="whitespace-nowrap rounded-l-lg-10 bg-netral-15 px-3 py-4 text-start text-netral-50 first:pl-5 last:pr-5">
                <span className="text-body-sm font-semibold">المتجر</span>
              </th>

              <th className="whitespace-nowrap rounded-r-lg-10 bg-netral-15 px-3 py-4 text-center text-netral-50 first:pl-5 last:pr-5">
                <span className="text-body-sm font-semibold">
                  متوسط التقييمات
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-netral-20 pt-4 text-sm">
            {stores?.map((store) => (
              <tr key={store.id}>
                <td className="whitespace-nowrap px-3 py-2 text-start first:pl-5 last:pr-5">
                  <div className="flex items-center gap-3">
                    <div className="relative h-16 w-16 overflow-hidden rounded-lg-10 2xl:h-20 2xl:w-20">
                      {store.image && (
                        <Image
                          src={store.image}
                          className="h-full w-full object-cover"
                          sizes="responsive"
                          width={80}
                          height={80}
                          alt={"شعار " + store.name}
                        />
                      )}
                    </div>

                    <span className="w-24 whitespace-pre-wrap break-words text-body-sm font-medium text-netral-80 2xl:w-48 2xl:text-body-base">
                      {store.name}
                    </span>
                  </div>
                </td>

                <td className="whitespace-nowrap px-3 py-5 text-center first:pl-5 last:pr-5">
                  <span className="flex items-center justify-center gap-2 text-body-sm font-bold text-netral-80 2xl:text-body-base">
                    {Number(store.average_rating).toFixed(2)}
                    <Star className="inline-block h-4 w-4" fill="yellow" />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
