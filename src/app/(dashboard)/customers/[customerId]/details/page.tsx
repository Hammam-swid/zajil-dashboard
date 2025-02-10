"use client";
import { Badge, Button, Title } from "@/components/atomics";

import {
  FunnelIcon,
  PencilSimpleIcon,
  SortAscendingIcon,
} from "@/assets/icons";
import Image from "next/image";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { User } from "@/types";
import api from "@/lib/api";
import { Ban, CircleCheck, ShieldCheck } from "lucide-react";
import { AxiosError } from "axios";
import { Modal } from "@/components/moleculs";
import { useState } from "react";

const getUser = async (customerId: string) => {
  const res = await api.get<{ data: User }>(`/dashboards/users/${customerId}`);
  return res.data.data;
};

const toggleStatus = async (customerId: string) => {
  const res = await api.post(`/dashboards/users/${customerId}/toggle-status`);
  return res.data;
};

const Page = () => {
  const { customerId } = useParams();

  const [openModalDelete, setOpenModalDelete] = useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["customer-user", { customerId }],
    mutationFn: () => toggleStatus(customerId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["customer-user", { customerId }],
      });
      setOpenModalDelete(false);
    },
  });
  const { data, isLoading, isError, error } = useQuery<User, AxiosError>({
    queryKey: ["customer-user", { customerId }],
    queryFn: () => getUser(customerId),
  });

  if (isError && error.status === 404) {
    console.log(error);
    return (
      <div className="flex h-full w-full items-center justify-center">404</div>
    );
  }
  return (
    <div className="relative space-y-6 p-6">
      <section className="relative rounded-lg-10 bg-white p-6">
        <nav className="mb-8 flex items-center justify-between">
          <Title size="lg" variant="default">
            تفاصيل الزبون
          </Title>

          {isLoading ? (
            <Button
              size="md"
              variant="default-bg"
              disabled
              className="animate-pulse"
            >
              <div className="w-20 py-2"></div>
            </Button>
          ) : (
            <Button
              size="md"
              variant={data?.status !== "active" ? "primary-bg" : "error-bg"}
              href="/customers/buyers/update"
              type="button"
              onClick={() => setOpenModalDelete(true)}
            >
              {data?.status !== "active" ? "تفعيل" : "إلغاء التفعيل"}
              {data?.status !== "active" ? (
                <CircleCheck className="h-4 w-4 text-success-main" />
              ) : (
                <Ban className="h-4 w-4" />
              )}
            </Button>
          )}
        </nav>

        <section className="flex flex-row items-center gap-5">
          <div className="relative aspect-square h-[8.25rem] w-[8.25rem]  rounded-full">
            {!isLoading ? (
              <Image
                src={
                  data?.profile_photo_path
                    ? "https://adimtech.com.ly/" + data.profile_photo_path
                    : "/avatar-default.png"
                }
                className="h-full w-full object-cover"
                alt="Avatar"
                width={100}
                height={100}
              />
            ) : (
              <div className="h-full w-full animate-pulse rounded-full bg-netral-40"></div>
            )}
          </div>

          <div className="space-y-7">
            <h3 className="text-heading-sm font-semibold">
              {isLoading ? (
                <span className="inline-block animate-pulse rounded-md bg-netral-40 px-8 py-4"></span>
              ) : (
                data?.name
              )}
            </h3>

            <section className="flex flex-row items-start gap-2.5">
              <div className="w-72 space-y-1.5">
                <h5 className="text-body-sm uppercase text-netral-50">
                  البريد الالكتروني
                </h5>

                <p dir="ltr" className="text-right text-body-base font-medium">
                  {isLoading ? (
                    <span className="inline-block animate-pulse rounded-md bg-netral-40 px-12 py-3"></span>
                  ) : (
                    data?.email
                  )}
                </p>
              </div>

              <div className="w-72 space-y-1.5">
                <h5 className="text-body-sm uppercase text-netral-50">
                  رقم الهاتف
                </h5>

                <p dir="ltr" className="text-right text-body-base font-medium">
                  {isLoading ? (
                    <span className="inline-block animate-pulse rounded-md bg-netral-40 px-12 py-3"></span>
                  ) : (
                    data?.phones[0]?.phone || "لا يوجد"
                  )}
                </p>
              </div>

              <div className="w-72 space-y-1.5">
                <h5 className="text-body-sm uppercase text-netral-50">
                  العنوان الكامل
                </h5>

                <p className="text-body-base font-medium">
                  {isLoading ? (
                    <span className="inline-block animate-pulse rounded-md bg-netral-40 px-12 py-3"></span>
                  ) : (
                    data?.locations.find((l) => l.is_default)?.address ||
                    "لا يوجد"
                  )}
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
                  <span className="text-body-sm font-semibold">
                    العنصر الذي تم شراؤه
                  </span>
                </th>

                <th className="whitespace-nowrap px-3 py-4 text-center text-netral-50 first:pl-5 last:pr-5">
                  <span className="text-body-sm font-semibold">الكمية</span>
                </th>

                <th className="whitespace-nowrap px-3 py-4 text-center text-netral-50 first:pl-5 last:pr-5">
                  <span className="text-body-sm font-semibold">الحالة</span>
                </th>

                <th className="whitespace-nowrap px-3 py-4 text-center text-netral-50 first:pl-5 last:pr-5">
                  <span className="text-body-sm font-semibold">
                    السعر الاجمالي
                  </span>
                </th>

                <th className="whitespace-nowrap px-3 py-4 text-center text-netral-50 first:pl-5 last:pr-5">
                  <span className="text-body-sm font-semibold">
                    تاريخ المعاملة
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
                      <Badge variant="success">Success</Badge>
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-3 py-5 text-center first:pl-5 last:pr-5">
                    <span className="text-body-base font-medium text-netral-80">
                      $739.65
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-3 py-5 text-center first:pl-5 last:pr-5">
                    <span className="text-body-base font-medium text-netral-80">
                      02 Jan 2022, 16.00
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Modal
            variant={data?.status !== "active" ? "default" : "error"}
            open={openModalDelete}
            title={
              data?.status !== "active" ? "تفعيل مستخدم" : "إلغاء تفعيل مستخدم"
            }
            className="max-w-lg"
            setOpen={setOpenModalDelete}
          >
            <main className="mb-10 mt-4">
              <p className="text-body-base text-netral-80">
                <p>
                  هل أنت متأكد من أنك{" "}
                  {data?.status !== "active" ? "تفعيل" : "إلغاء تفعيل"}
                  <span className="font-bold"> {data?.name}</span>؟
                </p>
              </p>
            </main>

            <footer className="flex w-full justify-end gap-3">
              <Button
                size="md"
                variant="default-nude"
                type="button"
                onClick={() => setOpenModalDelete(false)}
              >
                إلغاء
              </Button>
              <Button
                size="md"
                variant={data?.status !== "active" ? "primary-bg" : "error-bg"}
                type="button"
                onClick={() => {
                  mutation.mutate();
                  // setOpenAlertsDelete(true);
                }}
              >
                {data?.status !== "active" ? "تفعيل" : "إلغاء تفعيل"}
              </Button>
            </footer>
          </Modal>
        </div>
      </section>
    </div>
  );
};

export default Page;
