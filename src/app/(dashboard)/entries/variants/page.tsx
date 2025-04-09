"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Option, Variation } from "@/types";
import { useState } from "react";
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { Button, Input } from "@/components/atomics";
import { useFormik } from "formik";
import { useToast } from "@/hooks/use-toast";
import * as Yup from "yup";

const getVariations = async () => {
  const { data } = await api.get<{ data: Variation[] }>("/variations");
  return data.data;
};

export default function Page() {
  const { data: variations, isLoading } = useQuery({
    queryKey: ["variations"],
    queryFn: getVariations,
  });
  return (
    <div className="p-6">
      {!isLoading ? (
        <div className="grid grid-cols-4 items-start gap-4 rounded-md bg-white p-4">
          {variations?.map((v) => (
            <VariationComponent key={v.id} variation={v} />
          ))}
        </div>
      ) : (
        <Loader2 className="mx-auto h-20 w-20 animate-spin text-primary-main" />
      )}
      <AddingForm />
    </div>
  );
}

const addOptions = async (values: {
  options: string[];
  variation_id: number;
}) => {
  const { data } = await api.post("/variation-options", values);
  return data;
};

function VariationComponent({ variation }: { variation: Variation }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationKey: ["variation-options"],
    mutationFn: addOptions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["variations"] });
      formik.resetForm();
      const t = toast({
        title: "تمت الاضافة بنجاح",
        description: "تمت اضافة الخيارات بنجاح",
      });
      setTimeout(() => t.dismiss(), 3000);
    },
    onError: (e) => {
      console.log(e);
      const t = toast({
        title: "حدث خطأ",
        description: "حدث خطأ أثناء اضافة الخيارات",
        variant: "destructive",
      });
      setTimeout(() => t.dismiss(), 3000);
    },
  });
  const [optionsOpen, setOptionsOpen] = useState(false);
  const formik = useFormik<{ options: string[] }>({
    initialValues: { options: [] },
    validationSchema: Yup.object({
      options: Yup.array()
        .of(Yup.string().required("يجب إضافة خيارات"))
        .required("يجب إضافة خيارات"),
    }),

    onSubmit: (values) => {
      mutation.mutate({
        options: values.options,
        variation_id: variation.id,
      });
    },
  });

  return (
    <div className="rounded-md border p-4 shadow-md transition-[height]">
      <div className="flex items-center justify-between">
        <span className="text-lg font-bold">{variation.name}</span>
        <button
          id={`open-options-${variation.id}`}
          onClick={() => setOptionsOpen(!optionsOpen)}
        >
          {!optionsOpen ? <ChevronDown /> : <ChevronUp />}
        </button>
      </div>
      {optionsOpen && (
        <div className="mt-2 rounded-md border p-2">
          {variation?.options && variation?.options?.length > 0 ? (
            variation?.options?.map((o) => (
              <OptionComponent key={o.id} option={o} />
            ))
          ) : (
            <p className="text-netral-60">لا يوجد خيارات</p>
          )}
          <form onSubmit={formik.handleSubmit}>
            {formik.values.options.length > 0 &&
              formik.values.options?.map((o, index) => (
                <div
                  key={"option-" + index}
                  className="mt-2 flex items-center gap-2"
                >
                  <Input
                    id={"added-option-" + index}
                    value={o}
                    placeholder="القيمة"
                    onChange={(e) => {
                      const newOptions = [...formik.values.options];
                      newOptions[index] = e.target.value;
                      formik.setFieldValue("options", newOptions);
                    }}
                  />
                  <Button
                    onClick={() => {
                      const newOptions = [...formik.values.options];
                      newOptions.splice(index, 1);
                      formik.setFieldValue("options", newOptions);
                    }}
                    variant="error-nude"
                    size="sm"
                    type="button"
                  >
                    حذف
                  </Button>
                </div>
              ))}
            <Button
              type="button"
              onClick={() => {
                formik.setFieldValue("options", [...formik.values.options, ""]);
              }}
              variant="primary-outline"
              size="sm"
              className="ms-auto mt-1 disabled:grayscale"
              disabled={!formik.isValid}
            >
              <span>إضافة خيار</span>
            </Button>
            {formik.values.options.length > 0 && (
              <Button
                type="submit"
                variant="primary-bg"
                size="sm"
                className="mt-2 w-full "
              >
                تأكيد
              </Button>
            )}
          </form>
        </div>
      )}
    </div>
  );
}

function OptionComponent({ option }: { option: Option }) {
  return (
    <div>
      <p>{option.value}</p>
    </div>
  );
}

const addVariation = async (values: { name: string; options: string[] }) => {
  console.log("values", values);
  const { data } = await api.post("/variations", values);
  return data;
};

interface AddingFormValues {
  name: string;
  options: string[];
}

function AddingForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationKey: ["variations"],
    mutationFn: addVariation,
    onSuccess: () => {
      const t = toast({
        title: "تمت الاضافة بنجاح",
        description: "تمت اضافة المتغير بنجاح",
      });
      formik?.resetForm();
      setTimeout(() => t.dismiss(), 3000);
      queryClient.invalidateQueries({ queryKey: ["variations"] });
    },
    onError: (e) => {
      console.log(e);
      const t = toast({
        title: "حدث خطأ",
        description: "حدث خطأ أثناء اضافة المتغير",
        variant: "destructive",
      });
      setTimeout(() => t.dismiss(), 3000);
    },
  });
  const formik = useFormik<AddingFormValues>({
    initialValues: {
      name: "",
      options: [""],
    },
    validationSchema: Yup.object({
      name: Yup.string().required("اسم المتغير مطلوب"),
      options: Yup.array()
        .of(Yup.string().required("يجب إضافة خيارات"))
        .required("يجب إضافة خيارات"),
    }),
    onSubmit: (values) => {
      mutation.mutate(values);
    },
  });
  return (
    <form
      className="mx-auto my-4 max-w-lg rounded-md bg-white p-4 shadow-md"
      onSubmit={formik.handleSubmit}
    >
      <div className="mb-4 flex items-center gap-4">
        <Input
          id="name"
          placeholder="اسم المتغير"
          onChange={formik.handleChange}
          value={formik.values.name}
          onBlur={formik.handleBlur}
        />
        <Button type="submit" variant="primary-bg">
          إضافة متغير
        </Button>
      </div>
      <div className="flex flex-col gap-4 rounded-md border px-6 py-2">
        {formik.values.options.map((option, index) => (
          <div key={index} className="flex items-center gap-4">
            <Input
              id={`option-${index}`}
              placeholder="القيمة"
              onChange={(e) => {
                const newOptions = [...formik.values.options];
                newOptions[index] = e.target.value;
                formik.setFieldValue("options", newOptions);
              }}
              onBlur={formik.handleBlur}
              value={option}
            />
            <Button
              variant="error-nude"
              size="sm"
              type="button"
              onClick={() => {
                if (formik.values.options.length === 1) return;
                const newOptions = [...formik.values.options];
                newOptions.splice(index, 1);
                formik.setFieldValue("options", newOptions);
              }}
            >
              حذف
            </Button>
          </div>
        ))}
        <Button
          variant="primary-outline"
          size="sm"
          type="button"
          className="disabled:grayscale"
          onClick={() => {
            formik.setFieldValue("options", [...formik.values.options, ""]);
          }}
          disabled={!formik.isValid}
        >
          إضافة خيار
        </Button>
      </div>
    </form>
  );
}
