import { City, Driver, Region, VehicleType } from "@/types";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useToast } from "./use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { useEffect, useState } from "react";
import { format } from "date-fns";

interface FormValues {
  name: string;
  phone: string;
  email: string;
  nationality: string;
  driving_license: File | string | null;
  region: {
    value: number | null;
    label: string | null;
  } | null;
  plate_no: string;
  passport: File | string | null;
  date_of_birth: Date;
  document: File | string | null;
  vehicle_name: string;
  model: string;
  vin: string;
  vehicle_type_id: number | null;
  year: string;
  clearance_form: File | string | null;
}

const getValidationSchema = (type: "add" | "edit") =>
  Yup.object<FormValues>({
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
    passport:
      type === "edit"
        ? Yup.mixed().nullable()
        : Yup.mixed().required("جواز السفر مطلوب"),
    driving_license:
      type === "edit"
        ? Yup.mixed().nullable()
        : Yup.mixed().required("رخصة القيادة مطلوبة"),
    document:
      type === "edit"
        ? Yup.mixed().nullable()
        : Yup.mixed().required("كتيب السيارة مطلوب"),
    clearance_form:
      type === "edit"
        ? Yup.mixed().nullable()
        : Yup.mixed().nullable().typeError("إخلاء الطلب مطلوب"),
  });

export default function useDriverForm(type: "add" | "edit", driver?: Driver) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: cities, isLoading: isCitiesLoading } = useQuery({
    queryKey: ["cities"],
    queryFn: getCities,
  });

  const [selectedCity, setSelectedCity] = useState<{
    value: number;
    label: string;
  } | null>(null);

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
        : (values: FormValues) => updateDriver(values, driver as Driver),
    onError: (error) => {
      console.log(error);
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
  useEffect(() => {
    if (driver) {
      formik.setFieldValue("region", {
        value: driver.region.id.toString(),
        label: driver.region.name,
      });
      formik.setFieldValue(
        "vehicle_type_id",
        driver?.user?.vehicles?.[0]?.vehicle_type?.id
      );
      setSelectedCity({
        value: driver.region.city.id,
        label: driver.region.city.name,
      });
    }
  }, []);

  const formik = useFormik<FormValues>({
    initialValues: {
      name: driver?.user.name || "",
      phone: driver?.user?.phones?.[0]?.phone || "",
      email: driver?.user.email || "",
      nationality: driver?.user?.nationality || "",
      driving_license: null,
      region: driver?.region
        ? { value: driver.region.id, label: driver.region.name }
        : null,
      plate_no: driver?.user?.vehicles?.[0]?.plate_no || "",
      passport: null,
      date_of_birth: new Date(driver?.user?.date_of_birth || "2000-01-01"),
      vehicle_name: driver?.user?.vehicles?.[0]?.name || "",
      model: driver?.user?.vehicles?.[0]?.model || "",
      vin: driver?.user?.vehicles?.[0]?.vin || "",
      vehicle_type_id: null,
      year: driver?.user?.vehicles?.[0]?.year || "",
      document: null,
      clearance_form: null,
    },
    validationSchema: getValidationSchema(type),
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

  console.log(formik.errors);

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
  formData.append(
    "date_of_birth",
    format(values.date_of_birth as Date, "yyyy-MM-dd")
  );
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

const updateDriver = async (values: FormValues, driver: Driver) => {
  console.log(values);
  if (!driver) throw new Error("يجب اختيار سائق");
  const formData = new FormData();
  if (values.name && values.name !== driver.user.name)
    formData.append("name", values.name);

  if (values.phone && values.phone !== driver.user.phones[0].phone)
    formData.append("phone", values.phone);

  if (values.email && values.email !== driver.user.email)
    formData.append("email", values.email);

  if (values.nationality && values.nationality !== driver.user.nationality)
    formData.append("nationality", values.nationality);
  if (values.region?.value)
    formData.append("region_id", values.region?.value?.toString());

  if (
    values.plate_no &&
    values.plate_no !== driver?.user?.vehicles?.[0].plate_no
  )
    formData.append("plate_no", values.plate_no);
  formData.append(
    "date_of_birth",
    format(values.date_of_birth as Date, "yyyy-MM-dd")
  );
  if (values.vehicle_type_id)
    formData.append("vehicle_type_id", values.vehicle_type_id.toString());
  if (
    values.vehicle_name &&
    values.vehicle_name !== driver?.user?.vehicles?.[0].name
  )
    formData.append("vehicle_name", values.vehicle_name);
  if (values.model && values.model !== driver?.user?.vehicles?.[0].model)
    formData.append("model", values.model);
  if (values.vin && values.vin !== driver?.user?.vehicles?.[0].vin)
    formData.append("vin", values.vin);
  if (values.year && values.year !== driver?.user?.vehicles?.[0].year)
    formData.append("year", values.year);

  if (values.passport) formData.append("passport", values.passport);
  // if (values.clearance_form)
  //   formData.append("clearance_form", values.clearance_form);
  if (values.driving_license)
    formData.append("driving_license", values.driving_license);
  if (values.document) formData.append("document", values.document);
  formData.append("_method", "PATCH");
  const res = await api.post(`/dashboards/drivers/${driver?.id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      "X-HTTP-Method-Override": "PATCH",
    },
  });
  console.log(res);
  return res.data;
};
