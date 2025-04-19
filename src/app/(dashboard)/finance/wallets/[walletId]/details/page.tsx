"use client";

import { Badge, Pagination, Title } from "@/components/atomics";
import api from "@/lib/api";
import { Transaction, Wallet } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";

const getWallet = async (id: string) => {
  const res = await api.get<{ data: Wallet[] }>(`/wallet/system-wallets/${id}`);
  return res.data.data[0];
};

const getWalletTransaction = async (id: string, page: number) => {
  const pageQuery = `?page=${page}`;
  const res = await api.get<{
    data: Transaction[];
    meta: { last_page: number };
  }>(`/system/transactions/${id}${pageQuery}`);
  return res.data;
};

export default function Page() {
  const { walletId } = useParams();
  const { data: wallet, isLoading: isWalletLoading } = useQuery({
    queryKey: ["system-wallet", { walletId }],
    queryFn: () => getWallet(walletId),
  });
  console.log(wallet);
  return (
    <div className="p-6">
      <div className="flex flex-col gap-4 rounded-md bg-white p-3 text-xl shadow-md">
        <Title size="lg" variant="default">
          بيانات المحفظة المالية
        </Title>
        {!isWalletLoading ? (
          <>
            <div className="flex items-center gap-4">
              <span className="font-bold">ID:</span>
              <span>{wallet?.id}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-bold">نوع المحفظة:</span>
              <span>{wallet?.wallet_type}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-bold">الرصيد:</span>
              <Badge variant="info">
                <span className="text-base">{wallet?.balance} د.ل</span>
              </Badge>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-bold">تاريخ الإنشاء:</span>
              <span>
                {format(new Date(wallet?.created_at as string), "yyyy-MM-dd")}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-bold">تاريخ آخر تعديل:</span>
              <span>
                {format(new Date(wallet?.updated_at as string), "yyyy-MM-dd")}
              </span>
            </div>
          </>
        ) : (
          <div className="self-center justify-self-center">
            <Loader2 className="my-8 h-16 w-16 animate-spin text-primary-main" />
          </div>
        )}
      </div>
      <WalletTransactions walletId={walletId} />
    </div>
  );
}

const dummyData = [
  {
    id: 20,
    amount: "4.00",
    status: "عملية ناجحة",
    updated_at: "2025-03-15 23:46:04",
    description: "شراء طلبية",
    wallet_id: 25,
    wallet_type: "محفظة العمولات",
    reference: "ORD-67cb7daa86b42",
    receiver_name: "زمرد",
  },
  {
    id: 20,
    amount: "25.00",
    status: "عملية فاشلة",
    updated_at: "2025-03-15 23:46:04",
    description: "شراء طلبية",
    wallet_id: 26,
    wallet_type: "محفظة الارباح ",
    reference: "ORD-67cb7daa86b42",
    receiver_name: "زمرد",
  },
];

interface TransactionProps {
  walletId: string;
}
function WalletTransactions({ walletId }: TransactionProps) {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useQuery({
    queryKey: ["wallet-transactions", { walletId }, { page }],
    queryFn: () => getWalletTransaction(walletId, page),
  });
  console.log(data?.data);
  const transactions = data?.data || [];
  return (
    <div className="mt-6 rounded-md bg-white p-3 shadow-md">
      <Title className="mb-4" size="lg" variant="default">
        تحويلات المحفظة المالية
      </Title>
      <table className="mt-4 w-full table-auto">
        <thead className="bg-netral-15 text-body-sm font-semibold uppercase">
          <tr>
            <th className="whitespace-nowrap px-3 py-4 text-center text-netral-50 first:rounded-l-lg first:pl-5 last:rounded-r-lg last:pr-5">
              <span className="text-body-sm font-semibold">id</span>
            </th>

            <th className="whitespace-nowrap px-3 py-4 text-center text-netral-50 first:rounded-l-lg first:pl-5 last:rounded-r-lg last:pr-5">
              <span className="text-body-sm font-semibold">القيمة</span>
            </th>

            <th className="whitespace-nowrap px-3 py-4 text-center text-netral-50 first:rounded-l-lg first:pl-5 last:rounded-r-lg last:pr-5">
              <span className="text-body-sm font-semibold">الإجراء</span>
            </th>

            <th className="whitespace-nowrap px-3 py-4 text-center text-netral-50 first:rounded-l-lg first:pl-5 last:rounded-r-lg last:pr-5">
              <span className="text-body-sm font-semibold">الحالة</span>
            </th>

            <th className="whitespace-nowrap px-3 py-4 text-center text-netral-50 first:rounded-l-lg first:pl-5 last:rounded-r-lg last:pr-5">
              <span className="text-body-sm font-semibold">نوع المحفظة</span>
            </th>

            <th className="whitespace-nowrap px-3 py-4 text-center text-netral-50 first:rounded-l-lg first:pl-5 last:rounded-r-lg last:pr-5">
              <span className="text-body-sm font-semibold">اسم المستلم</span>
            </th>

            <th className="whitespace-nowrap px-3 py-4 text-center text-netral-50 first:rounded-l-lg first:pl-5 last:rounded-r-lg last:pr-5">
              <span className="text-body-sm font-semibold">المرجع</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-netral-20 pt-4 text-sm">
          {!isLoading
            ? transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="whitespace-nowrap px-3 py-5 text-center first:pl-5 last:pr-5">
                    <span className="text-body-base font-medium text-netral-80">
                      {transaction.id}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-3 py-5 text-center first:pl-5 last:pr-5">
                    <span className="text-body-base font-medium text-netral-80">
                      {transaction.amount}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-3 py-5 text-center first:pl-5 last:pr-5">
                    <span className="text-body-base font-medium text-netral-80">
                      {transaction.description}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-3 py-5 text-center first:pl-5 last:pr-5">
                    <Badge
                      variant={
                        transaction.status === "عملية ناجحة"
                          ? "success"
                          : "error"
                      }
                    >
                      {transaction.status}
                    </Badge>
                  </td>

                  <td className="whitespace-nowrap px-3 py-5 text-center first:pl-5 last:pr-5">
                    <span className="text-body-base font-medium text-netral-80">
                      {transaction.wallet_type}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-3 py-5 text-center first:pl-5 last:pr-5">
                    <span className="text-body-base font-medium text-netral-80">
                      {transaction.receiver_name}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-3 py-5 text-center first:pl-5 last:pr-5">
                    <span className="text-body-base font-medium text-netral-80">
                      {transaction.reference || "/"}
                    </span>
                  </td>

                  {/* <td className="whitespace-nowrap px-3 py-5 text-center first:pl-5 last:pr-5">
                      <Link href={`/orders/${transaction.id}/details`}>
                        <Button
                          size="md"
                          variant="primary-nude"
                          className="mx-auto"
                        >
                          التفاصيل
                        </Button>
                      </Link>
                    </td> */}
                </tr>
              ))
            : [...Array(5)].map((_, index) => (
                <Skeleton key={index} width={100} />
              ))}
        </tbody>
      </table>
      {/* Pagination */}
      {data?.meta?.last_page && data?.meta?.last_page > 1 && (
        <Pagination
          page={page}
          setPage={setPage}
          lastPage={data?.meta?.last_page as number}
        />
      )}
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
