import { City, Driver, Region, VehicleType } from "@/types";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useToast } from "./use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { useState } from "react";

interface FormValues {
  name: string;
  phone: string;
  email: string;
  nationality: string;
  driving_license: File | null;
  region: {
    value: number | null;
    label: string | null;
  } | null;
  plate_no: string;
  passport: File | null;
  date_of_birth: Date;
  document: File | null;
  vehicle_name: string;
  model: string;
  vin: string;
  vehicle_type_id: number | null;
  year: string;
}

const validationSchema = Yup.object<FormValues>({
  name: Yup.string().required("الاسم مطلوب"),
  phone: Yup.string()
    .required("رقم الهاتف مطلوب")
    .matches(/^(\+218|00218|0)?(9[1-5]\d{7})$/, "رقم الهاتف غير صالح"),
  email: Yup.string()
    .email("البريد الإلكتروني غير صالح")
    .required("البريد الإلكتروني مطلوب"),
  nationality: Yup.string().required("الجنسية مطلوبة"),
  region: Yup.object().shape({
    value: Yup.number().required("المنطقة مطلوبة"),
    label: Yup.string(),
  }),
  plate_no: Yup.string().required("رقم اللوحة مطلوب"),
  date_of_birth: Yup.date()
    .required("تاريخ الميلاد مطلوب")
    .max(new Date(), "تاريخ الميلاد يجب أن يكون في الماضي")
    .min(new Date("1900-01-01"), "تاريخ الميلاد يجب ألا يتخطى 1900"),
  vehicle_name: Yup.string().required("اسم المركبة مطلوب"),
  model: Yup.string().required("الموديل مطلوب"),
  vin: Yup.string().required("رقم الهيكل مطلوب"),
  year: Yup.string().required("سنة الصنع مطلوبة"),
  vehicle_type_id: Yup.number().required("نوع المركبة مطلوب"),
  passport: Yup.mixed().required("جواز السفر مطلوب"),
  driving_license: Yup.mixed().required("رخصة القيادة مطلوبة"),
  document: Yup.mixed().required("كتيب السيارة مطلوب"),
});

export default function useDriverForm(type: "add" | "edit", driver?: Driver) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [selectedCity, setSelectedCity] = useState<{
    value: number;
    label: string;
  } | null>(null);
  const { data: cities, isLoading: isCitiesLoading } = useQuery({
    queryKey: ["cities"],
    queryFn: getCities,
  });
  const { data: regions, isLoading: isRegionsLoading } = useQuery({
    queryKey: ["regions", { cityId: selectedCity?.value }],
    queryFn: () => getRegions(selectedCity?.value),
  });
  const { data: vehicleTypes } = useQuery({
    queryKey: ["vehicle-types"],
    queryFn: getVehicleTypes,
  });

  const driverMutation = useMutation({
    mutationKey: ["create-driver"],
    mutationFn:
      type === "add"
        ? createDriver
        : (values: FormValues) => updateDriver(values, driver?.id as number),
    onError: () => {
      const t = toast({
        title: "حدث خطأ",
        description:
          type === "add"
            ? "حدث خطأ أثناء عملية الإضافة"
            : "حدث خطأ أثناء عملية التعديل",
        variant: "destructive",
      });
      setTimeout(t.dismiss, 3000);
    },
  });

  const formik = useFormik<FormValues>({
    initialValues: {
      name: "",
      phone: "",
      email: "",
      nationality: "",
      driving_license: null,
      region: null,
      plate_no: "",
      passport: null,
      date_of_birth: new Date("2000-01-01"),
      vehicle_name: "",
      model: "",
      vin: "",
      vehicle_type_id: null,
      year: "",
      document: null,
    },
    validationSchema,
    onSubmit: (values) => {
      driverMutation.mutate(values, {
        onSuccess: () => {
          const t = toast({
            title: "نجحت العملية",
            description:
              type === "add"
                ? "تمت إضافة سائق بنجاح"
                : "تم تعديل بيانات السائق بنجاح",
          });
          setTimeout(t.dismiss, 3000);
          queryClient.invalidateQueries({ queryKey: ["drivers"] });
        },
      });
    },
  });
  const citiesOptions = cities?.map((city) => ({
    value: city.id,
    label: city.name,
  }));
  const regionsOptions = regions?.map((region) => ({
    value: region.id,
    label: region.name,
  }));

  return {
    formik,
    citiesOptions,
    selectedCity,
    setSelectedCity,
    regionsOptions,
    isCitiesLoading,
    isRegionsLoading,
    vehicleTypes,
    isPending: driverMutation.isPending,
  };
}

// Queries Functions
const getVehicleTypes = async () => {
  const res = await api.get<{ data: VehicleType[] }>(
    `/dashboards/vehicle-types`
  );
  return res.data.data;
};

const getCities = async () => {
  const res = await api.get<{ data: City[] }>(`/dashboards/cities`);
  return res.data.data;
};

const getRegions = async (cityId?: number) => {
  if (!cityId) return [];
  const res = await api.get<{ data: { regions: Region[] } }>(
    `/dashboards/cities/getRegions/${cityId}`
  );
  return res.data.data.regions;
};

// Mutations Functions

const createDriver = async (values: FormValues) => {
  const formData = new FormData();
  formData.append("name", values.name);
  formData.append("phone", values.phone);
  formData.append("email", values.email);
  formData.append("nationality", values.nationality);
  if (values.region?.value)
    formData.append("region_id", values.region?.value?.toString());
  formData.append("plate_no", values.plate_no);
  // formData.append("date_of_birth", values.date_of_birth.toString());
  if (values.vehicle_type_id)
    formData.append("vehicle_type_id", values.vehicle_type_id.toString());
  formData.append("vehicle_name", values.vehicle_name);
  formData.append("model", values.model);
  formData.append("vin", values.vin);
  formData.append("year", values.year);
  if (values.passport) formData.append("passport", values.passport);
  // if (values.clearance_form)
  //   formData.append("clearance_form", values.clearance_form);
  if (values.driving_license)
    formData.append("driving_license", values.driving_license);
  if (values.document) formData.append("document", values.document);

  const res = await api.post("/dashboards/drivers", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

const updateDriver = async (values: FormValues, driverId: number) => {
  if (!driverId) throw new Error("يجب اختيار سائق");
  const formData = new FormData();
  formData.append("name", values.name);
  formData.append("phone", values.phone);
  formData.append("email", values.email);
  formData.append("nationality", values.nationality);
  if (values.region?.value)
    formData.append("region_id", values.region?.value?.toString());
  formData.append("plate_no", values.plate_no);
  // formData.append("date_of_birth", values.date_of_birth.toString());
  if (values.vehicle_type_id)
    formData.append("vehicle_type_id", values.vehicle_type_id.toString());
  formData.append("vehicle_name", values.vehicle_name);
  formData.append("model", values.model);
  formData.append("vin", values.vin);
  formData.append("year", values.year);
  if (values.passport) formData.append("passport", values.passport);
  // if (values.clearance_form)
  //   formData.append("clearance_form", values.clearance_form);
  if (values.driving_license)
    formData.append("driving_license", values.driving_license);
  if (values.document) formData.append("document", values.document);
  const res = await api.put(`/dashboards/drivers/${driverId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};
