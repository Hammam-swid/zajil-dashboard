import { useFormik } from "formik";
import { Badge, Button, Input } from "../atomics";
import { Modal } from "../moleculs";
import { WalletIcon } from "lucide-react";
import * as Yup from "yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Driver, PaymentMethod, Store } from "@/types";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface StorePayDuesModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  debitsBalance: number;
  earningsBalance: number;
  driver: Driver;
}

export default function DriverPayDuesModal({
  open,
  setOpen,
  debitsBalance,
  earningsBalance,
  driver,
}: StorePayDuesModalProps) {
  const { formik, methods, setPaymentMethod, isPending, isPay, setIsPay } =
    useDueForm(debitsBalance, earningsBalance, driver, setOpen);
  return (
    <>
      <Modal
        setOpen={setOpen}
        variant="default"
        className="max-w-md"
        open={open}
        title="إغلاق الحسابات المالية"
      >
        <form
          onSubmit={formik.handleSubmit}
          className="mt-4 flex flex-col gap-4"
        >
          <div className="grid grid-cols-2 gap-4">
            {[true, false].map((e, i) => (
              <div
                className={`bottom-2 cursor-pointer rounded-md border p-2 text-center text-primary-main shadow-sm transition-colors ${
                  isPay == e
                    ? "bg-primary-main text-white"
                    : "text-primary-main"
                }`}
                onClick={() => setIsPay(e)}
                key={i}
              >
                {e ? "دفع المستحقات" : "استلام النقد"}
              </div>
            ))}
          </div>
          <p>
            أقصى قيمة:{" "}
            <Badge variant={"info"}>
              <span className="text-base">
                {isPay ? earningsBalance.toFixed(2) : debitsBalance.toFixed()}{" "}
                د.ل
              </span>
            </Badge>
          </p>
          <Input
            value={formik.values.amount.toString()}
            id="amount"
            placeholder="القيمة"
            onChange={formik.handleChange}
            label="القيمة"
            onBlur={formik.handleBlur}
            variant={
              formik.errors.amount && formik.touched.amount
                ? "default-error"
                : "default"
            }
            message={
              formik.errors.amount && formik.touched.amount
                ? formik.errors.amount
                : ""
            }
          />
          <label>طريقة الدفع</label>
          <div className="grid grid-cols-3 gap-2">
            {methods
              ?.filter((m) => !m.is_for_customers)
              .map((method) => (
                <div
                  onClick={() => {
                    setPaymentMethod(method.id);
                    if (!formik.touched.payment_method_id)
                      formik.setFieldTouched("payment_method_id", false);
                  }}
                  className={`cursor-pointer rounded-md border-2 p-2 ${
                    formik.values.payment_method_id === method.id &&
                    "border-primary-main"
                  }`}
                  key={method.id}
                >
                  <Image
                    src={method.image as string}
                    className="h-10 w-10"
                    width={100}
                    height={100}
                    alt="صورة طريقة الدفع"
                  />
                  <span>{method.name}</span>
                </div>
              ))}
          </div>
          {formik.errors.payment_method_id &&
            formik.touched.payment_method_id && (
              <p className="text-sm text-error-main">
                {formik.errors.payment_method_id}
              </p>
            )}
          <Button
            disabled={isPending}
            type="submit"
            variant="primary-bg"
            className="mt-4 disabled:opacity-50"
          >
            دفع <WalletIcon className="h-5 w-5" />
          </Button>
        </form>
      </Modal>
      <Button
        onClick={() => setOpen(true)}
        // size="md"
        variant="primary-outline"
        href="/outlet/edit"
      >
        إغلاق الحسابات المالية
      </Button>
    </>
  );
}

interface FormValues {
  amount: number | string;
  payment_method_id: number | null;
}

const useDueForm = (
  debitsBalance: number,
  earningsBalance: number,
  driver: Driver,
  setOpen: (open: boolean) => void
) => {
  const [isPay, setIsPay] = useState(true);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: methods } = useQuery({
    queryKey: ["payment-methods"],
    queryFn: getPaymentMethods,
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["pay-driver-dues", { driverId: driver.id }],
    mutationFn: (values: FormValues) =>
      isPay ? payDues(values, driver) : receiveCash(values, driver),
    onSuccess: () => {
      const t = toast({
        title: "تمت العملية بنجاح",
      });
      setTimeout(t.dismiss, 3000);
      queryClient.invalidateQueries({
        queryKey: ["driver", { driverId: driver.id.toString() }],
      });
      queryClient.invalidateQueries({
        queryKey: ["driver-transactions", { driverId: driver.id }],
      });
      formik.resetForm();
      setOpen(false);
    },
    onError: (error) => {
      console.log(error);
      const t = toast({
        title: "حدث خطأ أثناء عملية دفع المستحقات",
        variant: "destructive",
      });
      setTimeout(t.dismiss, 3000);
    },
  });
  const validationSchema = Yup.object({
    amount: Yup.number()
      .required("يجب إدخال القيمة")
      .max(
        isPay ? earningsBalance : debitsBalance,
        `يجب ألا تتخطى القيمة ${isPay ? earningsBalance : debitsBalance}`
      )
      .positive("يجب أن يقوم القيمة أكبر من صفر")
      .typeError("يمكنك إدخال أرقام فقط"),
    payment_method_id: Yup.number().required("يجب اختيار طريقة دفع"),
  });
  const formik = useFormik<FormValues>({
    initialValues: {
      amount: "",
      payment_method_id: null,
    },
    validationSchema,
    onSubmit: (values) => {
      mutate(values);
    },
  });

  const setPaymentMethod = (id: number) => {
    formik.setFieldValue("payment_method_id", id);
  };
  return { formik, methods, setPaymentMethod, isPending, isPay, setIsPay };
};

const payDues = async (values: FormValues, driver: Driver) => {
  const res = await api.post(`/dashboards/drivers/${driver.id}/pay-to`, values);
  console.log(res);
  return res.data;
};

const receiveCash = async (values: FormValues, driver: Driver) => {
  const res = await api.post(
    `/dashboards/drivers/${driver.id}/recieve-cash-from`,
    values
  );
  console.log(res);
  return res.data;
};

const getPaymentMethods = async () => {
  const res = await api.get<{ data: PaymentMethod[] }>(
    "/dashboards/payment-methods"
  );
  return res.data.data;
};
