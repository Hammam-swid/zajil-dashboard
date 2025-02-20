"use client";

import { Button, Input, Toggle } from "@/components/atomics";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api";
import { City, Region } from "@/types";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useFormik } from "formik";
import { Loader2, Pencil, Plus } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import * as Yup from "yup";

const getRegions = async (cityId: string) => {
  const res = await api.get<{ data: Region[] }>(
    `/dashboards/cities/getRegions/${cityId}`
  );
  return res.data.data;
};

export default function Page() {
  const queryClient = useQueryClient();
  const { cityId } = useParams();

  const { data: regions, isLoading: isRegionsLoading } = useQuery({
    queryKey: ["regions", cityId],
    queryFn: () => getRegions(cityId),
  });
  return (
    <div className="px-8 pb-8">
      <div className="flex items-center justify-between">
        <CityComponent cityId={cityId} />
        <AddRegion cityId={cityId} queryClient={queryClient} />
      </div>
      {isRegionsLoading ? (
        <div>
          <Loader2 className="mx-auto mt-6 h-20 w-20 animate-spin text-primary-main" />
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {regions?.map((region) => (
            <RegionComponent key={region.id} region={region} />
          ))}
        </div>
      )}
    </div>
  );
}
interface CityProps {
  cityId: string;
}

function CityComponent({ cityId }: CityProps) {
  const queryClient = useQueryClient();
  const allCities = queryClient.getQueryData<City[]>(["cities"]);
  const [city, setCity] = useState<City | undefined>(
    allCities?.find((c) => c.id === +cityId)
  );

  // const { data: city } = useQuery({
  //   queryKey: ["city", cityId],
  //   initialData: () => allCities?.find((c) => c.id === +cityId),
  // });
  const [isActive, setIsActive] = useState<boolean>(
    city?.is_active ? true : false
  );
  const toggleStatus = async (cityId: string | number) => {
    const res = await api.patch(`/dashboards/cities/toggle-status/${cityId}`);
    console.log(res);
    return res.data.data;
  };
  return (
    <div className="my-8 flex w-fit items-center gap-3 rounded-md bg-white px-6 py-2 shadow-md">
      <h3 className="text-2xl font-bold">{city?.name}</h3>
      <Button size="sm" variant="primary-nude">
        <Pencil />
      </Button>
      <Toggle
        enabled={isActive}
        setEnabled={async (v: boolean) => {
          console.log(cityId);
          setIsActive(v);
          if (cityId) {
            try {
              toggleStatus(city?.id || cityId);
              queryClient.invalidateQueries({ queryKey: ["cities"] });
            } catch (error) {
              console.log(error);
              setIsActive(!v);
            }
          }
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
  const queryClient = useQueryClient();
  const toggleStatus = async (region_id: string | number) => {
    const res = await api.patch(
      `/dashboards/regions/toggle-status/${region_id}`
    );
    console.log(res);
    return res.data.data;
  };
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
          try {
            toggleStatus(region.id);
            queryClient?.invalidateQueries({
              queryKey: ["regions", { cityId: String(region.city_id) }],
            });
          } catch (error) {
            console.log(error);
            setIsActive(!v);
          }
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
  const { toast } = useToast();
  const mutation = useMutation({
    mutationKey: ["regions", cityId],
    mutationFn: async (values: { name: string }) => {
      console.log(values);
      const res = await api.post(`/dashboards/regions`, {
        ...values,
        city_id: +cityId,
      });
      return res.data;
    },
    onSuccess: () => {
      console.log("error");
      const t = toast({
        title: "تم اضافة المنطقة بنجاح",
        description: "يمكنك الآن اضافة المناطق الجديدة",
      });
      setTimeout(() => t.dismiss(), 3000);
      queryClient?.invalidateQueries({ queryKey: ["regions", cityId] });
    },
    onError: () => {
      const t = toast({
        title: "حدث خطأ اثناء اضافة المدينة",
        description: "يرجى المحاولة مرة اخرى",
        variant: "destructive",
      });
      setTimeout(() => t.dismiss(), 3000);
    },
  });
  const formik = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("يجب عليك ادخال اسم المنطقة"),
    }),
    onSubmit: (values) => {
      mutation.mutate(values);
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
      <Button disabled={mutation.isPending} variant="primary-bg">
        {mutation.isPending ? (
          <Loader2 className="animate-spin" />
        ) : (
          "إضافة منطقة"
        )}
      </Button>
    </form>
  );
}
