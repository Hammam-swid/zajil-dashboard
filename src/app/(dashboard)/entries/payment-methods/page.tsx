"use client";

import { Badge, Button, Input, Toggle } from "@/components/atomics";
import { Dropzone } from "@/components/moleculs";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api";
import { PaymentMethod } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import { Loader2 } from "lucide-react";
import { useState } from "react";

const getPaymentMethods = async () => {
  const res = await api.get<{ data: PaymentMethod[] }>(
    "/dashboards/payment-methods"
  );
  console.log(res);
  return res.data.data;
};

export default function Page() {
  const {
    data: methods,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["payment-methods"],
    queryFn: getPaymentMethods,
  });
  return (
    <div className="p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">طرق الدفع</h1>
        <AddPaymentMethod />
      </div>
      {isLoading ? (
        <Loader2 className="mx-auto h-20 w-20 animate-spin text-primary-main" />
      ) : (
        <div>
          <h3>طرق الدفع الخاصة بالعملاء</h3>
          <div className="mt-4 grid grid-cols-2 gap-4">
            {methods
              ?.filter((method) => method.is_for_customers)
              .map((method) => (
                <PaymentMethodComponent
                  key={method.id}
                  paymentMethod={method}
                />
              ))}
          </div>
          <h3 className="mt-6">طرق الدفع الخاصة بلوحة التحكم</h3>
          <div className="mt-4 grid grid-cols-2 gap-4 font-bold">
            {methods
              ?.filter((method) => !method.is_for_customers)
              .map((method) => (
                <PaymentMethodComponent
                  key={method.id}
                  paymentMethod={method}
                />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface PaymentMethodProps {
  paymentMethod: PaymentMethod;
}
function PaymentMethodComponent({ paymentMethod }: PaymentMethodProps) {
  const [showForm, setShowForm] = useState<boolean>(false);
  return (
    <div className="flex flex-col justify-between rounded-md bg-white p-4 shadow-md">
      <div className="flex justify-between">
        <div>
          <h3 className="text-lg font-bold">{paymentMethod.name}</h3>
          <p>{paymentMethod.description}</p>
          {paymentMethod.is_active ? (
            <Badge variant="success">فعالة</Badge>
          ) : (
            <Badge variant="error">غير فعالة</Badge>
          )}
        </div>
        {typeof paymentMethod.image === "string" && (
          <img
            src={paymentMethod.image}
            alt={paymentMethod.name + " image"}
            className="max-w-[100px]"
          />
        )}
      </div>
      <Button
        variant="primary-outline"
        size="sm"
        type="button"
        className="mt-4 w-full text-base font-bold"
        onClick={() => setShowForm(true)}
      >
        تعديل
      </Button>
      {showForm && (
        <PaymentMethodForm
          setShowForm={setShowForm}
          method={paymentMethod}
          type="edit"
        />
      )}
    </div>
  );
}

function AddPaymentMethod() {
  const [showForm, setShowForm] = useState<boolean>(false);
  return (
    <div>
      <Button
        onClick={() => setShowForm(true)}
        type="button"
        variant="primary-bg"
      >
        إضافة طريقة دفع جديدة
      </Button>
      {showForm && <PaymentMethodForm setShowForm={setShowForm} type="add" />}
    </div>
  );
}

interface UsePaymentFormValues {
  name: string;
  description: string;
  is_for_customers: boolean;
  image: string | File;
}

function usePaymentForm(
  type: "add" | "edit",
  hideForm: () => void,
  method?: PaymentMethod
) {
  const [active, setActive] = useState<boolean>(method?.is_active || false);
  async function toggleActive() {
    setActive((prev) => !prev);
    await toggleMutate();
  }
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { mutate: toggleMutate } = useMutation({
    mutationKey: ["payment-method", { methodId: method?.id.toString() }],
    mutationFn: () => api.patch(`/payment-methods/${method?.id}/toggle-status`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-methods"] });
      const t = toast({
        title: "تم تعديل حالة الطريقة بنجاح",
      });
      setTimeout(() => t.dismiss(), 3000);
    },
    onError: (error) => {
      console.log(error);
      const t = toast({
        title: "حدث خطأ أثناء تعديل حالة الطريقة",
        variant: "destructive",
      });
      setActive((prev) => !prev);
      setTimeout(() => t.dismiss(), 3000);
    },
  });

  const mutation = useMutation({
    mutationKey: ["payment-method", { methodId: method?.id.toString() }],
    mutationFn:
      type === "add"
        ? addPaymentMethod
        : (values: UsePaymentFormValues) =>
            editPaymentMethod(values, method as PaymentMethod),
    onSuccess: () => {
      const t = toast({
        title: "تمت العملية بنجاح",
        description:
          type === "add" ? "تمت إضافة طريقة دفع جديدة" : "تم تعديل طريقة الدفع",
      });
      setTimeout(() => t.dismiss(), 3000);
      queryClient.invalidateQueries({ queryKey: ["payment-methods"] });
      hideForm();
    },
    onError: (error) => {
      console.log(error);
      const t = toast({
        title: "حدث خطأ أثناء تنفيذ العملية",
        variant: "destructive",
      });
      setTimeout(() => t.dismiss(), 3000);
    },
  });
  const formik = useFormik<UsePaymentFormValues>({
    initialValues: {
      name: type === "edit" ? (method?.name as string) : "",
      description: type === "edit" ? (method?.description as string) : "",
      is_for_customers:
        type === "edit" ? (method?.is_for_customers ? true : false) : true,
      image: type === "edit" ? (method?.image as string) : "",
    },
    onSubmit: (values) => mutation.mutate(values),
  });

  return { formik, isPending: mutation.isPending, active, toggleActive };
}

interface PaymentMethodFormProps {
  setShowForm: (show: boolean) => void;
  type: "add" | "edit";
  method?: PaymentMethod;
}

function PaymentMethodForm({
  setShowForm,
  type,
  method,
}: PaymentMethodFormProps) {
  const { formik, isPending, active, toggleActive } = usePaymentForm(
    type,
    () => setShowForm(false),
    method
  );

  return (
    <div
      // onClick={() => setShowForm(false)}
      className="fixed inset-0 z-20 flex items-center justify-center bg-black/50"
    >
      <form
        className="flex w-96 flex-col gap-4 rounded-md bg-white p-4"
        onSubmit={formik.handleSubmit}
      >
        <h2 className="text-lg font-bold">إضافة طريقة دفع جديدة</h2>
        <Input
          id="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="أدخل اسم طريقة الدفع"
          label="الاسم:"
          disabled={isPending}
        />
        <div className="w-full">
          <label className="block" htmlFor="description">
            الوصف:
          </label>
          <textarea
            name="description"
            id="description"
            className="w-full resize-none rounded-md border p-2 outline-none"
            placeholder="أدخل وصف لطريقة الدفع"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={isPending}
          />
        </div>
        <div className="flex items-center gap-2">
          <label>للعملاء: </label>
          <Toggle
            enabled={formik.values.is_for_customers ? true : false}
            setEnabled={() =>
              formik.setFieldValue(
                "is_for_customers",
                !formik.values.is_for_customers
              )
            }
          />
        </div>
        <div>
          <label htmlFor="image">الصورة:</label>
          <Dropzone
            fieldName="image"
            setField={formik.setFieldValue}
            setTouched={formik.setFieldTouched}
            path={typeof method?.image === "string" ? method.image : undefined}
            className="mt-1 w-full"
          />
        </div>
        {type === "edit" && method && (
          <div className="flex items-center gap-4">
            <label htmlFor="is_active">مفعل؟</label>
            <Toggle enabled={active} setEnabled={toggleActive} />
          </div>
        )}

        <Button
          disabled={isPending}
          type="submit"
          variant="primary-bg"
          className="block w-full disabled:opacity-50"
        >
          {type === "add" ? "إضافة" : "تعديل"}
        </Button>
        <Button
          disabled={isPending}
          type="button"
          variant="error-outline"
          onClick={() => setShowForm(false)}
        >
          إلغاء
        </Button>
      </form>
    </div>
  );
}

const addPaymentMethod = async (values: UsePaymentFormValues) => {
  const formData = new FormData();
  formData.append("name", values.name);
  formData.append("description", values.description);
  formData.append("is_for_customers", values.is_for_customers ? "1" : "0");
  formData.append("image", values.image);
  const res = await api.post("/payment-methods", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

const editPaymentMethod = async (
  values: UsePaymentFormValues,
  method: PaymentMethod
) => {
  const formData = new FormData();
  formData.append("_method", "PATCH");
  if (values.name && method.name !== values.name)
    formData.append("name", values.name);
  if (values.description && method.description !== values.description)
    formData.append("description", values.description);
  if (
    values.is_for_customers &&
    values.is_for_customers !== method.is_for_customers
  )
    formData.append("is_for_customers", values.is_for_customers ? "1" : "0");
  if (values.image && values.image instanceof File)
    formData.append("image", values.image);
  console.log(formData.get("image"));
  const res = await api.post(`/payment-methods/${method?.id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};
