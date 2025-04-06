"use client";

import { ArrowDownRightIcon, ArrowUpRightIcon } from "@/assets/icons";
import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import React from "react";

const getStatistics = async () => {
  const res = await api.get<{
    data: {
      users_count: number;
      stores_count: number;
      orders_count: number;
    };
  }>("/dashboards");
  return res.data.data;
};

export default function MainStatistics() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getStatistics,
  });
  if (isLoading) return <Skelton />;
  return (
    <section className="grid grid-cols-3 gap-5">
      <figure className="relative w-full overflow-hidden rounded-lg-10 bg-white">
        <Image
          className="absolute right-0 top-0 -z-0 h-full w-fit object-contain object-right-top"
          src="/pattern-home-1.png"
          alt="Pattern Home 1"
          sizes="responsive"
          width={500}
          height={500}
        />

        <figcaption className="relative z-[1] px-8 py-6">
          <span className="text-body-sm font-medium uppercase text-netral-60 2xl:text-body-base">
            عدد المستخدمين
          </span>
          <h3 className="mb-1 mt-2.5 text-heading-md font-bold 2xl:mt-3.5">
            {data?.users_count}
          </h3>
          {/* <p className="inline-flex items-center text-body-sm">
            <ArrowUpRightIcon className="h-4 w-4 text-success-main" />
            <span className="ml-0.5 mr-1 text-success-main">0.4%</span>
            <span className="text-netral-60">vs last month</span>
          </p> */}
        </figcaption>
      </figure>

      <figure className="relative w-full overflow-hidden rounded-lg-10 bg-white">
        <Image
          className="absolute -right-10 top-0 -z-0 h-full w-fit object-contain object-right-top"
          src="/pattern-home-2.png"
          alt="Pattern Home 2"
          sizes="responsive"
          width={500}
          height={500}
        />

        <figcaption className="relative z-[1] px-8 py-6">
          <span className="text-body-sm font-medium uppercase text-netral-60 2xl:text-body-base">
            عدد المتاجر
          </span>

          <h3 className="mb-1 mt-2.5 text-[30px] text-heading-md font-bold 2xl:mt-3.5">
            {data?.stores_count}
          </h3>

          {/* <p className="inline-flex items-center text-body-sm">
            <ArrowDownRightIcon className="h-4 w-4 text-red-500" />
            <span className="ml-0.5 mr-1 text-red-500">12%</span>
            <span className="text-netral-60">vs last month</span>
          </p> */}
        </figcaption>
      </figure>

      <figure className="relative w-full overflow-hidden rounded-lg-10 bg-white">
        <Image
          className="absolute right-0 top-0 -z-0 h-full w-fit object-contain object-right-top"
          src="/pattern-home-3.png"
          alt="Pattern Home 3"
          sizes="responsive"
          width={500}
          height={500}
        />

        <figcaption className="relative z-[1] px-8 py-6">
          <span className="text-body-sm font-medium uppercase text-netral-60 2xl:text-body-base">
            عدد الطلبات
          </span>
          <h3 className="mb-1 mt-2.5 text-[30px] text-heading-md font-bold 2xl:mt-3.5">
            {data?.orders_count}
          </h3>
          {/* <p className="inline-flex items-center text-body-sm">
            <ArrowUpRightIcon className="h-4 w-4 text-success-main" />
            <span className="ml-0.5 mr-1 text-success-main">0.4%</span>
            <span className="text-netral-60">vs last month</span>
          </p> */}
        </figcaption>
      </figure>
    </section>
  );
}

function Skelton() {
  return (
    <section className="grid grid-cols-3 gap-5">
      <figure className="animate-pluse relative w-full overflow-hidden rounded-lg-10 bg-white">
        <div className="absolute right-0 top-0 -z-0 h-full w-fit object-contain object-right-top">
          <div className="h-full w-full animate-pulse bg-gray-300"></div>
        </div>
        <figcaption className="relative z-10 px-8 py-6">
          <span className="text-body-sm font-medium uppercase text-netral-60 2xl:text-body-base">
            عدد المستخدمين
          </span>
          <h3 className="mb-1 mt-2.5 text-heading-md font-bold 2xl:mt-3.5">
            <div className="h-6 w-20 animate-pulse rounded-md bg-gray-300"></div>
          </h3>
        </figcaption>
      </figure>
      <figure className="animate-pluse relative w-full overflow-hidden rounded-lg-10 bg-white">
        <div className="absolute -right-10 top-0 -z-0 h-full w-fit object-contain object-right-top">
          <div className="h-full w-full animate-pulse bg-gray-300"></div>
        </div>
        <figcaption className="relative z-10 px-8 py-6">
          <span className="text-body-sm font-medium uppercase text-netral-60 2xl:text-body-base">
            عدد المتاجر
          </span>
          <h3 className="mb-1 mt-2.5 text-[30px] text-heading-md font-bold 2xl:mt-3.5">
            <div className="h-6 w-20 animate-pulse rounded-md bg-gray-300"></div>
          </h3>
        </figcaption>
      </figure>
      <figure className="animate-pluse relative w-full overflow-hidden rounded-lg-10 bg-white">
        <div className="absolute right-0 top-0 -z-0 h-full w-fit object-contain object-right-top">
          <div className="h-full w-full animate-pulse bg-gray-300"></div>
        </div>
        <figcaption className="relative z-10 px-8 py-6">
          <span className="text-body-sm font-medium uppercase text-netral-60 2xl:text-body-base">
            عدد الطلبات
          </span>
          <h3 className="mb-1 mt-2.5 text-[30px] text-heading-md font-bold 2xl:mt-3.5">
            <div className="h-6 w-20 animate-pulse rounded-md bg-gray-300"></div>
          </h3>
        </figcaption>
      </figure>
    </section>
  );
}
