"use client";

import { Button, Input, Toggle } from "@/components/atomics";
import api from "@/lib/api";
import { City, Region } from "@/types";
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import { Pencil, Plus } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import * as Yup from "yup";

const getRegions = async (cityId: string) => {
  const res = await api.get<{ data: Region[] }>(
    `/dashboards/cities/getRegions/${cityId}`
  );
  return res.data.data;
};
const getCity = async (cityId: string) => {
  const res = await api.get<{ data: City }>(`/dashboards/cities/${cityId}`);
  return res.data.data;
};
export default function Page() {
  const queryClient = useQueryClient();
  const { cityId } = useParams();
  const allCities = queryClient.getQueryData<City[]>(["cities"]);

  const { data: city } = useQuery({
    queryKey: ["city", cityId],
    initialData: () => allCities?.find((c) => c.id === +cityId),
  });
  const { data: regions } = useQuery({
    queryKey: ["regions", cityId],
    queryFn: () => getRegions(cityId),
  });
  return (
    <div className="px-8 pb-8">
      <div className="flex items-center justify-between">
        <CityComponent city={city} />
        <AddRegion cityId={cityId} queryClient={queryClient} />
      </div>
      <div className="grid grid-cols-4 gap-4">
        {regions?.map((region) => (
          <RegionComponent key={region.id} region={region} />
        ))}
      </div>
    </div>
  );
}
interface CityProps {
  city: City | undefined;
}

function CityComponent({ city }: CityProps) {
  const [isActive, setIsActive] = useState<boolean>(
    city?.is_active ? true : false
  );
  return (
    <div className="my-8 flex w-fit items-center gap-3 rounded-md bg-white px-6 py-2 shadow-md">
      <h3 className="text-2xl font-bold">{city?.name}</h3>
      <Button size="sm" variant="primary-nude">
        <Pencil />
      </Button>
      <Toggle
        enabled={isActive}
        setEnabled={(v: boolean) => {
          setIsActive(v);
        }}
      />
    </div>
  );
}

interface RegionProps {
  region: Region;
}

function RegionComponent({ region }: RegionProps) {
  const [isActive, setIsActive] = useState<boolean>(
    region.is_active ? true : false
  );
  return (
    <div
      className={`flex items-center justify-between rounded-md border-[1.5px] bg-white p-4 shadow-sm duration-300 ${
        isActive ? "border-success-main" : "border-error-main"
      } `}
    >
      {region.name}
      <Toggle
        enabled={isActive}
        setEnabled={(v: boolean) => {
          setIsActive(v);
        }}
      />
    </div>
  );
}

interface AddRegionProps {
  cityId: string;
  queryClient?: QueryClient;
}

function AddRegion({ cityId, queryClient }: AddRegionProps) {
  const formik = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("يجب عليك ادخال اسم المنطقة"),
    }),
    onSubmit: async (values) => {
      await api.post(`/dashboards/cities/${cityId}/regions`, values);
      queryClient?.invalidateQueries({ queryKey: ["regions", cityId] });
    },
  });
  return (
    <form
      onSubmit={formik.handleSubmit}
      className="flex w-fit items-center gap-3 rounded-md bg-white px-6 py-2 shadow-md"
    >
      <Input
        id="name"
        value={formik.values.name}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        variant={
          formik.touched.name && formik.errors.name
            ? "default-error"
            : "default"
        }
        message={
          formik.touched.name && formik.errors.name ? formik.errors.name : ""
        }
        placeholder="أدخل اسم المنطقة"
        className="min-w-[300px]"
      />
      <Button variant="primary-bg">إضافة منطقة</Button>
    </form>
  );
}
