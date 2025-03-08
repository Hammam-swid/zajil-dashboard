"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import api from "@/lib/api";
import { VehicleType } from "@/types";
import { useFormik } from "formik";
import { Button, Input } from "@/components/atomics";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
const getVehicleTypes = async () => {
  const res = await api.get<{ data: VehicleType[] }>(
    "/dashboards/vehicle-types"
  );
  return res.data.data;
};
export default function Page() {
  const { data: vehicleTypes, isLoading } = useQuery({
    queryKey: ["vehicleTypes"],
    queryFn: () => getVehicleTypes(),
  });
  return (
    <div className="mt-8">
      <AddVehicleType />
      {isLoading ? (
        <Loader2 className="mx-auto mt-8 h-20 w-20 animate-spin text-primary-main" />
      ) : (
        <div className="grid grid-cols-4 gap-4 p-4">
          {vehicleTypes?.map((type) => (
            <div
              className="rounded-md bg-white py-2 text-center text-lg font-semibold shadow-md"
              key={type.id}
            >
              {type.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AddVehicleType() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (values: { name: string }) => {
      return await api.post("/dashboards/vehicle-types", values);
    },
    onSuccess: () => {
      const t = toast({
        title: "تمت العملية بنجاح",
        description: "تمت إضافة النوع بنجاح",
      });
      setTimeout(() => t.dismiss(), 3000);
      queryClient.invalidateQueries({ queryKey: ["vehicleTypes"] });
    },
    onError: (error) => {
      console.log(error);
      const t = toast({
        title: "حدث خطأ",
        description: "حدث خطأ أثناء إضافة النوع",
        variant: "destructive",
      });
      setTimeout(() => t.dismiss(), 3000);
    },
  });
  const formik = useFormik({
    initialValues: {
      name: "",
    },
    onSubmit: (values) => {
      mutation.mutate(values);
    },
  });
  return (
    <form
      className="flex max-w-lg items-center justify-center gap-3 p-4"
      onSubmit={formik.handleSubmit}
    >
      <Input
        id="name"
        value={formik.values.name}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        placeholder="أدخل اسم النوع"
      />
      <Button disabled={mutation.isPending} variant="primary-bg">
        {mutation.isPending ? (
          <Loader2 className="animate-spin" />
        ) : (
          "إضافة نوع جديد"
        )}
      </Button>
    </form>
  );
}
