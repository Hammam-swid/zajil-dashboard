import { useQuery } from "@tanstack/react-query";
import { Badge, Pagination } from "../atomics";
import api from "@/lib/api";
import { StoreTransaction } from "@/types";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const getTransactions = async (storeId: number, page: number) => {
  const pageQuery = `?page=${page}`;

  const res = await api.get<{
    data: StoreTransaction[];
    meta: { last_page: number };
  }>(`/stores/${storeId}/transactions${pageQuery}`);
  return res.data;
};
interface TableProps {
  storeId: number;
}

export default function StoreTransactionsTable({ storeId }: TableProps) {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useQuery({
    queryKey: ["store-transaction", { storeId }, { page }],
    queryFn: () => getTransactions(storeId, page),
  });
  console.log(error);

  const transactions = data?.data || [];

  console;
  return (
    <div className="mb-6 mt-6 overflow-x-auto">
      <table className="w-full table-auto">
        <thead className="bg-netral-15 text-body-sm font-semibold uppercase">
          <tr>
            <th className="whitespace-nowrap px-3 py-4 text-center text-netral-50 first:pl-5 last:pr-5">
              <span className="text-body-sm font-semibold">id</span>
            </th>

            <th className="w-56 whitespace-nowrap px-3 py-4 text-center text-netral-50 first:pl-5 last:pr-5">
              <span className="text-body-sm font-semibold">القيمة</span>
            </th>

            <th className="whitespace-nowrap px-3 py-4 text-center text-netral-50 first:pl-5 last:pr-5">
              <span className="text-body-sm font-semibold">الإجراء</span>
            </th>

            <th className="whitespace-nowrap px-3 py-4 text-center text-netral-50 first:pl-5 last:pr-5">
              <span className="text-body-sm font-semibold">الحالة</span>
            </th>

            <th className="whitespace-nowrap px-3 py-4 text-center text-netral-50 first:pl-5 last:pr-5">
              <span className="text-body-sm font-semibold">المرجع</span>
            </th>

            {/* <th className="whitespace-nowrap px-3 py-4 text-center text-netral-50 first:pl-5 last:pr-5">
              <span className="text-body-sm font-semibold">السعر الاجمالي</span>
            </th> */}
          </tr>
        </thead>
        <tbody className="divide-y divide-netral-20 pt-4 text-sm">
          {isLoading ? (
            <tr>
              <td colSpan={5} className="text-center">
                <Loader2 className="mx-auto mt-4 h-20 w-20 animate-spin text-primary-main" />
              </td>
            </tr>
          ) : (
            transactions?.map((transaction) => (
              <tr key={transaction.id}>
                <td className="whitespace-nowrap px-3 py-5 text-center first:pl-5 last:pr-5">
                  <span className="text-body-base font-medium text-netral-80">
                    {transaction.id}
                  </span>
                </td>

                <td className="w-56 whitespace-pre-wrap px-3 py-5 text-center first:pl-5 last:pr-5">
                  <span className="whitespace-pre-wrap break-words text-body-base font-medium text-netral-80">
                    {transaction.amount} د.ل
                  </span>
                </td>

                <td className="whitespace-nowrap px-3 py-5 text-center first:pl-5 last:pr-5">
                  <span className="text-body-base font-medium text-netral-80">
                    {transaction.description}
                  </span>
                </td>

                <td className="whitespace-nowrap px-3 py-5 text-center first:pl-5 last:pr-5">
                  <span className=" text-body-base font-medium text-netral-80">
                    <Badge
                      variant={
                        transaction.status === "عملية ناجحة"
                          ? "success"
                          : transaction.status === "عملية فاشلة"
                          ? "error"
                          : "info"
                      }
                    >
                      {transaction.status}
                    </Badge>
                  </span>
                </td>

                <td className="whitespace-nowrap px-3 py-5 text-center first:pl-5 last:pr-5">
                  <span className="text-body-base font-medium text-netral-80">
                    {transaction.reference}
                  </span>
                </td>

                {/* <td className="whitespace-nowrap px-3 py-5 text-center first:pl-5 last:pr-5">
                <span className="text-body-base font-medium text-netral-80">
                  ${782.01}
                </span>
              </td> */}
              </tr>
            ))
          )}
        </tbody>
      </table>
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
