"use client";
import {
  Badge,
  Button,
  Checkbox,
  Input,
  Pagination,
} from "@/components/atomics";
import AddCityForm from "@/components/organisms/AddCityForm";
import api from "@/lib/api";
import { City } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const getCities = async (page: number) => {
  const pageQuery = page ? `&page=${page}` : "";
  const res = await api.get<{ data: City[]; meta: { last_page: number } }>(
    `/dashboards/cities?per_page=10${pageQuery}&search=طرابلس`
  );
  return res.data;
};

export default function Page() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["cities", { page }],
    queryFn: () => getCities(page),
  });

  const cities = data?.data || [];
  const lastPage = data?.meta.last_page || 1;

  return (
    <div className="container relative mx-auto mt-8 min-h-[400px] overflow-hidden bg-white p-4">
      <div className="w-1/2">
        <table className="relative w-full table-auto">
          <thead className="z-10 bg-netral-15 text-body-sm font-semibold uppercase">
            <tr>
              <th className="whitespace-nowrap px-3 py-4 text-center text-netral-50 first:pl-5 last:pr-5">
                <span className="text-body-sm font-semibold">الاسم</span>
              </th>

              <th className="whitespace-nowrap px-3 py-4 text-center text-netral-50 first:pl-5 last:pr-5">
                <span className="text-body-sm font-semibold">الحالة</span>
              </th>

              <th className="whitespace-nowrap px-3 py-4 text-center text-netral-50 first:pl-5 last:pr-5">
                <span className="text-body-sm font-semibold">الإجراءات</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={3} className="text-center">
                  <Loader2 className="mx-auto mt-4 h-20 w-20 animate-spin text-primary-main" />
                </td>
              </tr>
            ) : (
              cities?.map((city) => (
                <tr key={city.id}>
                  <td className="whitespace-nowrap px-3 py-4 text-center text-netral-100 first:pl-5 last:pr-5">
                    {city.name}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-center text-netral-100 first:pl-5 last:pr-5">
                    <Badge variant={city.is_active ? "success" : "error"}>
                      {city.is_active ? "مفعل" : "غير مفعل"}
                    </Badge>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-center text-netral-100 first:pl-5 last:pr-5">
                    <Link href={`/entries/cities/${city.id}/regions`}>
                      <Button
                        variant="primary-nude"
                        size="sm"
                        className="mx-auto"
                      >
                        المناطق
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <Pagination
          page={page}
          setPage={setPage}
          lastPage={lastPage}
          isLoading={isLoading}
        />
      </div>
      <div className="fixed end-4 top-48 w-1/3 rounded-md border border-primary-main/50 bg-white p-4 shadow-xl">
        <AddCityForm />
      </div>
    </div>
  );
}
