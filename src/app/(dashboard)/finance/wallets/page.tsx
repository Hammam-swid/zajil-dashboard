"use client";

import { Badge, Button, Pagination, Title } from "@/components/atomics";
import api from "@/lib/api";
import { Wallet } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import Link from "next/link";

const getWallets = async () => {
  const res = await api.get<{
    data: Wallet[];
  }>("/wallet/system-wallets");
  return res.data;
};

export default function Page() {
  const { data, isLoading } = useQuery({
    queryKey: ["system-wallets"],
    queryFn: getWallets,
  });
  console.log(data);
  const wallets = data && data.data ? data.data : [];
  return (
    <div className="p-6">
      <div className="mb-6 overflow-x-auto rounded-md bg-white p-4 shadow-md">
        <Title variant="default" size="lg">
          المحافظ المالية
        </Title>
        <table className="mt-4 w-full table-auto">
          <thead className="bg-netral-15 text-body-sm font-semibold uppercase">
            <tr>
              <th className="whitespace-nowrap px-3 py-4 text-center text-netral-50 first:rounded-l-lg first:pl-5 last:rounded-r-lg last:pr-5">
                <span className="text-body-sm font-semibold">id</span>
              </th>

              <th className="whitespace-nowrap px-3 py-4 text-center text-netral-50 first:rounded-l-lg first:pl-5 last:rounded-r-lg last:pr-5">
                <span className="text-body-sm font-semibold">نوع المحفظة</span>
              </th>

              <th className="whitespace-nowrap px-3 py-4 text-center text-netral-50 first:rounded-l-lg first:pl-5 last:rounded-r-lg last:pr-5">
                <span className="text-body-sm font-semibold">الرصيد</span>
              </th>

              <th className="whitespace-nowrap px-3 py-4 text-center text-netral-50 first:rounded-l-lg first:pl-5 last:rounded-r-lg last:pr-5">
                <span className="text-body-sm font-semibold">
                  تاريخ الإنشاء
                </span>
              </th>

              <th className="whitespace-nowrap px-3 py-4 text-center text-netral-50 first:rounded-l-lg first:pl-5 last:rounded-r-lg last:pr-5">
                <span className="text-body-sm font-semibold">
                  تاريخ التعديل
                </span>
              </th>

              {/* <th className="whitespace-nowrap px-3 py-4 text-center text-netral-50 first:rounded-l-lg first:pl-5 last:rounded-r-lg last:pr-5">
                <span className="text-body-sm font-semibold">اسم المستلم</span>
              </th> */}

              <th className="whitespace-nowrap px-3 py-4 text-center text-netral-50 first:rounded-l-lg first:pl-5 last:rounded-r-lg last:pr-5">
                <span className="text-body-sm font-semibold">الإجراءات</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-netral-20 pt-4 text-sm">
            {!isLoading
              ? wallets.map((wallet) => (
                  <tr key={wallet.id}>
                    <td className="whitespace-nowrap px-3 py-5 text-center first:pl-5 last:pr-5">
                      <span className="text-body-base font-medium text-netral-80">
                        {wallet.id}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-3 py-5 text-center first:pl-5 last:pr-5">
                      <span className="text-body-base font-medium text-netral-80">
                        {wallet.wallet_type}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-3 py-5 text-center first:pl-5 last:pr-5">
                      <Badge variant={"info"}>{wallet.balance}</Badge>
                    </td>

                    {/* <td className="whitespace-nowrap px-3 py-5 text-center first:pl-5 last:pr-5">
                      <Badge
                        variant={
                          wallet.status === "عملية ناجحة"
                            ? "success"
                            : "error"
                        }
                      >
                        {wallet.status}
                      </Badge> 
                    </td> */}

                    <td className="whitespace-nowrap px-3 py-5 text-center first:pl-5 last:pr-5">
                      <span className="text-body-base font-medium text-netral-80">
                        {format(new Date(wallet.created_at), "yyyy-MM-dd")}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-3 py-5 text-center first:pl-5 last:pr-5">
                      <span className="text-body-base font-medium text-netral-80">
                        {format(new Date(wallet.updated_at), "yyyy-MM-dd")}
                      </span>
                    </td>

                    {/* <td className="whitespace-nowrap px-3 py-5 text-center first:pl-5 last:pr-5">
                      <span className="text-body-base font-medium text-netral-80">
                        {wallet.reference}
                      </span>
                    </td> */}

                    <td className="whitespace-nowrap px-3 py-5 text-center first:pl-5 last:pr-5">
                      <Link href={`/finance/wallets/${wallet.id}/details`}>
                        <Button
                          size="md"
                          variant="primary-nude"
                          className="mx-auto"
                        >
                          التفاصيل
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))
              : [...Array(5)].map((_, index) => (
                  <Skeleton key={index} width={100} />
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Skeleton({ width }: { width: number }) {
  return (
    <tr>
      <td className="whitespace-nowrap px-3 py-5">
        <span
          className={`w- mx-auto block h-8 w-[${
            width * 0.5
          }px] animate-pulse rounded-md bg-netral-40`}
        ></span>
      </td>
      <td className="whitespace-nowrap px-3 py-5 text-center">
        <span
          className={`mx-auto block h-8 w-[${
            width * 0.9
          }px] animate-pulse rounded-md bg-netral-40`}
        ></span>
      </td>
      <td className="whitespace-nowrap px-3 py-5 text-center">
        <span
          className={`mx-auto block h-8 w-[${
            width * 0.3
          }px] animate-pulse rounded-md bg-netral-40`}
        ></span>
      </td>
      <td className="whitespace-nowrap px-3 py-5 text-center">
        <span
          className={`mx-auto block h-8 w-[${
            width * 0.4
          }px] animate-pulse rounded-md bg-netral-40`}
        ></span>
      </td>
      <td className="whitespace-nowrap px-3 py-5 text-center">
        <span
          className={`mx-auto block h-8 w-[${
            width * 0.7
          }px] animate-pulse rounded-md bg-netral-40`}
        ></span>
      </td>
      <td className="whitespace-nowrap px-3 py-5 text-center">
        <span
          className={`mx-auto block h-8 w-[${
            width * 0.5
          }px] animate-pulse rounded-md bg-netral-40`}
        ></span>
      </td>
      <td className="whitespace-nowrap px-3 py-5 text-center">
        <span
          className={`mx-auto block h-8 w-[${
            width * 0.4
          }px] animate-pulse rounded-md bg-netral-40`}
        ></span>
      </td>
    </tr>
  );
}
