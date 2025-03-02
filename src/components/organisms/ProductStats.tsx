"use client";

import dynamic from "next/dynamic";
import { Selectbox, Title } from "../atomics";
import { ApexOptions } from "apexcharts";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

const ReactApexCharts = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const getProductStats = async () => {
  const res = await api.get<{
    data: {
      active_products: number;
      inactive_products: number;
      total_products: number;
    };
  }>("/dashboards/products-stats/get");
  return res.data.data;
};

export default function ProductStats() {
  const { data, isLoading } = useQuery({
    queryKey: ["product-stats"],
    queryFn: getProductStats,
    staleTime: 1000 * 60 * 5,
  });

  const radialSeries = [
    data
      ? +((data?.active_products / data.total_products) * 100).toFixed(2)
      : 0,
    data
      ? +((data.inactive_products / data.total_products) * 100).toFixed(2)
      : 0,
  ];

  const radialDummy = [
    {
      color: "bg-primary-main",
      label: "منتجات نشطة",
      number: data?.active_products,
    },
    {
      color: "bg-error-main",
      label: "منتجات غير نشطة",
      number: data?.inactive_products,
    },
  ];

  const radialBarData: ApexOptions = {
    chart: {
      toolbar: { show: false },
      height: 350,
      type: "radialBar",
    },
    colors: ["#3259A8", "#FF5630"],
    plotOptions: {
      radialBar: {
        // stroke: {
        //   colors: ["#5E59FF", "#FFAB00"]
        // },
        dataLabels: {
          name: {
            fontSize: "22px",
          },
          value: {
            fontSize: "16px",
          },
          total: {
            show: true,
            label: "الإجمالي",
            formatter: function () {
              // By default this function returns the average of all series. The below is just an example to show the use of custom formatter function

              return data?.total_products + " منتج" || "لا يوجد بيانات";
            },
          },
        },
        track: {
          // background: ["#5E59FF", "#FFAB00"]
        },
      },
    },
    labels: ["منتجات نشطة", "منتجات غير نشطة"],
    stroke: {
      lineCap: "round",
      colors: ["#5E59FF", "#FFAB00"],
    },
  };
  if (isLoading) return <div>جار التحميل... </div>;
  return (
    <section className="col-span-4 space-y-6 rounded-lg-10 bg-white p-6">
      <nav className="flex items-center justify-between">
        <Title size="lg" variant="default">
          المنتجات
        </Title>
      </nav>

      <div className="flex flex-col flex-wrap items-center gap-0 2xl:flex-row 2xl:gap-2">
        <div className="h-72 !font-jakarta 2xl:h-80">
          <ReactApexCharts
            type="radialBar"
            height={"100%"}
            options={radialBarData}
            series={radialSeries}
          />
        </div>

        <div className="flex flex-row items-start gap-4 2xl:flex-col">
          {radialDummy.map((item, index) => (
            <div
              key={index}
              className="flex flex-col-reverse items-center gap-1 2xl:flex-col 2xl:items-start"
            >
              <div className="flex items-center gap-2">
                <div
                  className={`h-2 w-2 ${item.color} flex-shrink-0 rounded-full`}
                />

                <h5 className="whitespace-nowrap text-body-base font-medium text-netral-60">
                  {item.label}
                </h5>
              </div>

              <div className="text-body-xl font-bold">{item.number}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
