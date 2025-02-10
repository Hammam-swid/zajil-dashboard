import Image from "next/image";
import React from "react";
import { Selectbox, Title } from "../atomics";

export default function TopProducts() {
  return (
    <section className="relative space-y-6 rounded-lg-10 bg-white p-6">
      <nav className="flex items-center justify-between">
        <Title size="lg" variant="default">
          أفضل المنتجات
        </Title>

        <div className="w-32 2xl:w-40">
          <Selectbox
            className="!border-transparent"
            datas={[
              { name: "تصفية", value: "1" },
              { name: "هذا الاسبوع", value: "2" },
              { name: "هذا الشهر", value: "3" },
              { name: "هذه السنة", value: "4" },
            ]}
          />
        </div>
      </nav>

      {/* Table */}
      <div className="mb-6 overflow-x-hidden">
        <table className="w-full table-auto">
          <thead className="text-body-sm font-semibold uppercase">
            <tr>
              <th className="whitespace-nowrap rounded-l-lg-10 bg-netral-15 px-3 py-4 text-start text-netral-50 first:pl-5 last:pr-5">
                <span className="text-body-sm font-semibold">المنتج</span>
              </th>

              <th className="whitespace-nowrap rounded-r-lg-10 bg-netral-15 px-3 py-4 text-left text-netral-50 first:pl-5 last:pr-5">
                <span className="text-body-sm font-semibold">المباع</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-netral-20 pt-4 text-sm">
            {[1, 2, 3].map((item) => (
              <tr key={item}>
                <td className="whitespace-nowrap px-3 py-5 text-left first:pl-5 last:pr-5">
                  <div className="flex items-center gap-3">
                    <div className="relative h-16 w-16 overflow-hidden rounded-lg-10 2xl:h-20 2xl:w-20">
                      <Image
                        src={`/products-1.png`}
                        className="h-full w-full object-cover"
                        sizes="responsive"
                        width={80}
                        height={80}
                        alt="Products 1"
                      />
                    </div>

                    <span className="w-24 whitespace-pre-wrap break-words text-body-sm font-medium text-netral-80 2xl:w-48 2xl:text-body-base">
                      {"T-Men's UA Storm Armour Down 2.0 Jacket"}
                    </span>
                  </div>
                </td>

                <td className="whitespace-nowrap px-3 py-5 text-left first:pl-5 last:pr-5">
                  <span className="text-body-sm font-medium text-netral-80 2xl:text-body-base">
                    401
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
