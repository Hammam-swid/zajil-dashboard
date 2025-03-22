"use client";
import DriverForm from "@/components/templates/DriverForm";
import api from "@/lib/api";
import { Driver } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Loader2, TriangleAlert } from "lucide-react";
import { useParams } from "next/navigation";

const getDriver = async (driverId: string) => {
  const res = await api.get<Driver>(`/dashboards/drivers/${driverId}`);
  return res.data;
};

export default function Page() {
  const { driverId } = useParams();
  const {
    data: driver,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["driver", { driverId }],
    queryFn: () => getDriver(driverId),
  });
  console.log(driver);
  if (isLoading)
    return (
      <Loader2 className="mx-auto mt-10 h-20 w-20 animate-spin text-primary-main" />
    );
  if (isError && error instanceof AxiosError) {
    if (error.response?.status === 404) {
      return (
        <div className="flex h-[80vh] flex-col items-center justify-center gap-6 ">
          <p className="flex items-center gap-2 text-2xl font-bold">
            <TriangleAlert className="h-10 w-10 text-error-main" />{" "}
            <span>404</span>
          </p>
          <h2 className="text-2xl font-bold">هذا السائق غير موجود</h2>
        </div>
      );
    } else {
      return <div>حدث خطأ ما</div>;
    }
  }

  return <DriverForm driver={driver} formType="edit" />;
}
