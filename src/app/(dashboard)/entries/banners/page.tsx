"use client";

import { Badge, Button, Input } from "@/components/atomics";
import { Dropzone } from "@/components/moleculs";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import { Banner } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import { Loader2, Pencil, Trash, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import * as Yup from "yup";

const getBanners = async () => {
  const res = await api.get<{ data: Banner[] }>("/banners");
  console.log(res);
  return res.data.data;
};

export default function Page() {
  const { data: banners, error } = useQuery({
    queryKey: ["banners"],
    queryFn: getBanners,
  });
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">اللوحات الإعلانية</h1>
        <AddBannerForm />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {banners?.map((banner) => (
          <BannerCard key={banner.id} banner={banner} />
        ))}
      </div>
    </div>
  );
}

interface BannerCardProps {
  banner: Banner;
}

const BannerCard = ({ banner }: BannerCardProps) => {
  return (
    <div className="rounded-lg bg-white p-4 shadow-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">{banner.title}</h3>
        {banner.is_active ? (
          <Badge variant="success">فعال</Badge>
        ) : (
          <Badge variant="error">غير فعال</Badge>
        )}
      </div>
      <Image
        src={banner.image as string}
        alt={banner.title}
        width={100}
        height={100}
        className="mt-2 w-full rounded-lg border border-primary-main"
      />
      <Button variant="primary-outline" size="sm" className="mt-2 w-full">
        <Pencil />
      </Button>
      <Button variant="error-nude" size="sm" className="mt-2 w-full">
        <Trash />
      </Button>
      {/* <div className="flex items-center gap-4">
        <Button variant="error-nude" size="sm">
          <Trash className="h-4 w-4" />
        </Button>
        <Button variant="primary-bg" size="sm">
          <Pencil className="h-4 w-4" />
        </Button>
      </div> */}
    </div>
  );
};

const AddBannerForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { formik, isPending } = useAddBannerForm(setIsOpen);
  return (
    <div className="relative">
      <Button variant="primary-bg" onClick={() => setIsOpen(true)}>
        إضافة إعلان
      </Button>
      {isOpen && (
        <form
          onSubmit={formik.handleSubmit}
          className="absolute left-0 top-full mt-2 flex w-96 flex-col gap-4 rounded-lg bg-white p-4 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold">إضافة إعلان</h1>
            <Button
              size="sm"
              variant="error-nude"
              disabled={isPending}
              onClick={() => setIsOpen(false)}
            >
              <X />
            </Button>
          </div>
          <Input
            id="title"
            label="العنوان"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="العنوان"
            variant={
              formik.errors.title && formik.touched.title
                ? "default-error"
                : "default"
            }
            message={
              formik.errors.title && formik.touched.title
                ? formik.errors.title
                : ""
            }
          />
          <label htmlFor="image">الصورة</label>
          <Dropzone
            fieldName="image"
            setField={formik.setFieldValue}
            setTouched={formik.setFieldTouched}
            className="w-full"
          />
          <Button
            disabled={isPending}
            variant="primary-bg"
            type="submit"
            className={cn(isPending && "opacity-50")}
          >
            {isPending ? <Loader2 className="animate-spin" /> : "إضافة"}
          </Button>
        </form>
      )}
    </div>
  );
};

const useAddBannerForm = (setIsOpen: (isOpen: boolean) => void) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationKey: ["addBanner"],
    mutationFn: async (values: any) => {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("image", values.image);
      return api.post("/banners", formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
      const t = toast({
        title: "تم إضافة الإعلان بنجاح",
      });
      setTimeout(t.dismiss, 3000);
      setIsOpen(false);
    },
    onError: (error) => {
      console.log(error);
      const t = toast({
        title: "حدث خطأ",
        variant: "destructive",
      });
      setTimeout(t.dismiss, 3000);
    },
  });
  const formik = useFormik({
    initialValues: {
      title: "",
      image: null,
    },
    validationSchema: Yup.object({
      title: Yup.string().required("العنوان مطلوب"),
      image: Yup.mixed().required("الصورة مطلوبة"),
    }),
    onSubmit: (values) => {
      mutate(values);
    },
  });
  return { formik, isPending };
};
