"use client";

import { Badge, Button, Title } from "@/components/atomics";

import {
  FunnelIcon,
  PencilSimpleIcon,
  SortAscendingIcon,
} from "@/assets/icons";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Driver } from "@/types";
import { Modal } from "@/components/moleculs";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const Page = () => {
  const { driverId } = useParams();
  const { data: driver } = useQuery({
    queryKey: ["driver", { driverId }],
    queryFn: () => getDriver(driverId),
  });
  const [inActiveModal, setInActiveModal] = useState(false);

  return (
    <div className="relative space-y-6 p-6">
      <section className="relative rounded-lg-10 bg-white p-6">
        <nav className="mb-8 flex items-center justify-between">
          <Title size="lg" variant="default">
            معلومات السائق
          </Title>

          <div className="flex items-center gap-3">
            {driver && (
              <Button
                onClick={() => setInActiveModal(true)}
                variant={
                  driver?.user.status === "active"
                    ? "error-outline"
                    : "primary-outline"
                }
              >
                {driver?.user.status === "active" ? "إلغاء التفعيل" : "تفعيل"}
              </Button>
            )}
            <InactivateModal
              setOpen={setInActiveModal}
              open={inActiveModal}
              driver={driver}
            />
            <Link href={"edit"}>
              <Button size="md" variant="primary-bg" type="button">
                <PencilSimpleIcon className="h-4 w-4 stroke-[4px]" />
                تعديل
              </Button>
            </Link>
          </div>
        </nav>

        <section className="relative flex flex-row gap-5">
          <div className="relative aspect-square h-[8.25rem] w-[8.25rem]  rounded-full">
            <Image
              src={"/avatar-default.png"}
              className="h-full w-full object-cover"
              alt="Avatar"
              fill
            />
          </div>

          <div className="space-y-7">
            <h3 className="text-heading-sm font-semibold">
              {driver?.user.name}
            </h3>
            <section className="flex flex-row flex-wrap items-start gap-x-20 gap-y-5">
              <div className="space-y-1.5">
                <h5 className="text-body-sm uppercase text-netral-50">
                  البريد الالكتروني
                </h5>

                <p dir="ltr" className="text-right text-body-base font-medium">
                  {driver?.user.email}
                </p>
              </div>

              <div className=" space-y-1.5">
                <h5 className="text-body-sm uppercase text-netral-50">
                  رقم الهاتف
                </h5>

                <p dir="ltr" className="text-right text-body-base font-medium">
                  {driver?.user?.phones?.[0]?.phone || "لا يوجد"}
                </p>
              </div>
              <div className="space-y-1.5">
                <h5 className="text-body-sm uppercase text-netral-50">
                  الجنسية
                </h5>

                <p className="text-body-base font-medium">
                  {driver?.user.nationality}
                </p>
              </div>

              <div className="space-y-1.5">
                <h5 className="text-body-sm uppercase text-netral-50">
                  المنطقة
                </h5>

                <p className="text-body-base font-medium">
                  {driver?.region.name}
                </p>
              </div>

              <div className="space-y-1.5">
                <h5 className="text-center text-body-sm uppercase text-netral-50">
                  حالة الاتصال
                </h5>

                <p className="text-center text-body-base font-medium">
                  <Badge variant={driver?.isOnline ? "success" : "error"}>
                    {driver?.isOnline ? "متصل" : "غير متصل"}
                  </Badge>
                </p>
              </div>

              <div className="space-y-1.5">
                <h5 className="text-center text-body-sm uppercase text-netral-50">
                  متاح للعمل
                </h5>

                <p className="text-center text-body-base font-medium">
                  <Badge variant={driver?.isAvailable ? "success" : "error"}>
                    {driver?.isAvailable ? "متاح" : "غير متاح"}
                  </Badge>
                </p>
              </div>
              {/* <div className="absolute end-0">
                <Toggle enabled={isActive} setEnabled={setIsActive} />
              </div> */}
            </section>
            <section className="flex flex-row items-center gap-x-20 gap-y-5">
              <div className="space-y-1.5">
                <h5 className="text-center text-body-sm uppercase text-netral-50">
                  جواز السفر
                </h5>
                {driver?.passport && (
                  <Image
                    src={driver?.passport as string}
                    width={100}
                    height={100}
                    alt="صورة جواز السفر"
                  />
                )}
              </div>

              <div className="space-y-1.5">
                <h5 className="text-center text-body-sm uppercase text-netral-50">
                  رخصة القيادة
                </h5>
                {driver?.driving_license && (
                  <Image
                    src={driver?.driving_license as string}
                    width={100}
                    height={100}
                    alt="صورة رخصة القيادة"
                  />
                )}
              </div>
            </section>
            <h4 className="text-sm text-netral-50">بيانات المركبة:</h4>
            <section className="flex flex-row flex-wrap gap-x-20 gap-y-5">
              <div className="space-y-1.5">
                <h5 className="text-center text-body-sm uppercase text-netral-50">
                  الشركة المصنعة للمركبة
                </h5>
                <p className="text-body-base font-medium">
                  {driver?.user.vehicles?.[0].name}
                </p>
              </div>
              <div className="space-y-1.5">
                <h5 className="text-center text-body-sm uppercase text-netral-50">
                  رقم الهيكل
                </h5>
                <p className="text-body-base font-medium">
                  {driver?.user.vehicles?.[0].vin}
                </p>
              </div>
              <div className="space-y-1.5">
                <h5 className="text-center text-body-sm uppercase text-netral-50">
                  رقم اللوحة
                </h5>
                <p className="text-body-base font-medium">
                  {driver?.user.vehicles?.[0].plate_no}
                </p>
              </div>
              <div className="space-y-1.5">
                <h5 className="text-center text-body-sm uppercase text-netral-50">
                  سنة التصنيع
                </h5>
                <p className="text-body-base font-medium">
                  {driver?.user.vehicles?.[0].year}
                </p>
              </div>
            </section>
          </div>
        </section>
      </section>

      <section className="relative rounded-lg-10 bg-white p-6">
        <nav className="mb-8 flex items-center justify-between">
          <Title size="lg" variant="default">
            سجل الطلبات
          </Title>

          <div className="flex flex-row gap-3">
            <Button size="md" variant="default-bg">
              ترتيب
              <SortAscendingIcon className="h-4 w-4 stroke-2" />
            </Button>
            <Button size="md" variant="default-bg">
              تصفية
              <FunnelIcon className="h-4 w-4 stroke-2" />
            </Button>
          </div>
        </nav>

        {/* Table */}
        <div className="mb-6 overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="bg-netral-15 text-body-sm font-semibold uppercase">
              <tr>
                <th className="whitespace-nowrap px-3 py-4 text-center text-netral-50 first:pl-5 last:pr-5">
                  <span className="text-body-sm font-semibold">order_id</span>
                </th>

                <th className="w-56 whitespace-nowrap px-3 py-4 text-center text-netral-50 first:pl-5 last:pr-5">
                  <span className="text-body-sm font-semibold">اسم المتجر</span>
                </th>

                <th className="whitespace-nowrap px-3 py-4 text-center text-netral-50 first:pl-5 last:pr-5">
                  <span className="text-body-sm font-semibold">الكمية</span>
                </th>

                <th className="whitespace-nowrap px-3 py-4 text-center text-netral-50 first:pl-5 last:pr-5">
                  <span className="text-body-sm font-semibold">الحالة</span>
                </th>

                <th className="whitespace-nowrap px-3 py-4 text-center text-netral-50 first:pl-5 last:pr-5">
                  <span className="text-body-sm font-semibold">
                    سعر التوصيل
                  </span>
                </th>

                <th className="whitespace-nowrap px-3 py-4 text-center text-netral-50 first:pl-5 last:pr-5">
                  <span className="text-body-sm font-semibold">
                    السعر الاجمالي
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-netral-20 pt-4 text-sm">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <tr key={item}>
                  <td className="whitespace-nowrap px-3 py-5 text-center first:pl-5 last:pr-5">
                    <span className="text-body-base font-medium text-netral-80">
                      653518
                    </span>
                  </td>

                  <td className="w-56 whitespace-pre-wrap px-3 py-5 text-center first:pl-5 last:pr-5">
                    <span className="whitespace-pre-wrap break-words text-body-base font-medium text-netral-80">
                      {"Heimer Miller Sofa (Mint Condition)"}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-3 py-5 text-center first:pl-5 last:pr-5">
                    <span className="text-body-base font-medium text-netral-80">
                      3
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-3 py-5 text-center first:pl-5 last:pr-5">
                    <span className=" text-body-base font-medium text-netral-80">
                      <Badge variant={item % 2 === 0 ? "success" : "error"}>
                        {item % 2 === 0 ? "تم التوصيل" : "تم الإلغاء"}
                      </Badge>
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-3 py-5 text-center first:pl-5 last:pr-5">
                    <span className="text-body-base font-medium text-netral-80">
                      $739.65
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-3 py-5 text-center first:pl-5 last:pr-5">
                    <span className="text-body-base font-medium text-netral-80">
                      ${782.01}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

interface InactivateModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  driver?: Driver;
}

const InactivateModal = ({ open, setOpen, driver }: InactivateModalProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationKey: ["toggle-driver-status", { driverId: driver?.id }],
    mutationFn: toggleDriverStatus,
    onSuccess: () => {
      const t = toast({
        title:
          driver?.user.status === "active"
            ? "تم إلغاء تفعيل السائق بنجاح"
            : "تم تفعيل السائق بنجاح",
      });
      queryClient.invalidateQueries({
        queryKey: ["driver", { driverId: driver?.id.toString() }],
      });
      setTimeout(t.dismiss, 3000);
      setOpen(false);
    },
  });
  return (
    <Modal
      open={open}
      setOpen={setOpen}
      variant={driver?.user.status === "active" ? "error" : "primary"}
      className="max-w-xl"
      title={
        driver?.user.status === "active" ? "إلغاء تفعيل سائق" : "تفعيل سائق"
      }
    >
      <p>
        هل أنت متأكد من أنك تريد
        {driver?.user.status === "active"
          ? " إلغاء تفعيل السائق"
          : " تفعيل السائق"}
        ؟
      </p>
      <div className="mt-3 flex flex-row-reverse items-center gap-3">
        <Button
          variant={driver?.user.status === "active" ? "error-bg" : "primary-bg"}
          size="md"
          className="w-20"
          disabled={isPending}
          onClick={() => mutate(driver?.id || 0)}
        >
          {isPending ? <Loader2 className="animate-spin" /> : "نعم"}
        </Button>
        <Button
          onClick={() => setOpen(false)}
          variant={"default-outline"}
          size="md"
          disabled={isPending}
          className="w-20"
        >
          لا
        </Button>
      </div>
    </Modal>
  );
};

const getDriver = async (driverId: string) => {
  const res = await api.get<Driver>(`/dashboards/drivers/${driverId}`);

  return res.data;
};

const toggleDriverStatus = async (id: number) => {
  const res = await api.patch(`/drivers/toggle-account-status/${id}`);
  return res;
};

export default Page;
