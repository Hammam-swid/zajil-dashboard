"use client";
import { Button, Input, Pagination } from "@/components/atomics";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api";
import { FAQ } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import { Loader2, Pencil, PlusCircle, Save, X } from "lucide-react";
import { useState } from "react";
import * as Yup from "yup";

const getFaqs = async (page: number, search: string) => {
  const pageQuery = page ? `&page=${page}` : "";
  const searchQuery = search ? `&search=${search}` : "";
  const res = await api.get<{ data: FAQ[]; meta: { last_page: number } }>(
    `/faqs?per_page=10${pageQuery}${searchQuery}`
  );
  return res.data;
};

export default function Page() {
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { data, isLoading } = useQuery({
    queryKey: ["faqs", { page }, { search }],
    queryFn: () => getFaqs(page, search),
  });

  const last_page = data?.meta.last_page || 1;

  const faqs = data?.data || [];

  return (
    <div>
      <div className="mt-4 flex items-center justify-between px-7">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (searchText) {
              setSearch(searchText);
              setPage(1);
            }
          }}
          className="max-w-xs"
        >
          <Input
            id="searchText"
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              if (e.target.value === "") {
                setSearch("");
                setPage(1);
              }
            }}
            placeholder="ابحث عن سؤال"
          />
        </form>
        <div className="relative ms-auto w-fit">
          <AddForm />
        </div>
      </div>
      {isLoading ? (
        <Loader2 className="mx-auto mt-8 h-20 w-20 animate-spin text-primary-main" />
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-3 px-7">
          {faqs?.map((faq) => (
            <Question faq={faq} key={faq.id} />
          ))}
        </div>
      )}
      <div className="mb-8 mt-4 px-7">
        {last_page > 1 && (
          <Pagination page={page} setPage={setPage} lastPage={last_page} />
        )}
      </div>
    </div>
  );
}

interface QuestionProps {
  faq: FAQ;
}

function Question({ faq }: QuestionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { formik, isPending } = useForm("edit", () => setIsEditing(false), faq);

  return (
    <div
      className="flex items-center justify-between gap-8 rounded-md bg-white p-5 shadow-md"
      key={faq.id}
    >
      {isEditing ? (
        <form className="flex-1" onSubmit={formik.handleSubmit}>
          <Input
            placeholder="السؤال"
            id="question"
            value={formik.values.question}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            variant={
              formik.errors.question && formik.touched.question
                ? "default-error"
                : "default"
            }
            message={
              formik.errors.question && formik.touched.question
                ? formik.errors.question
                : ""
            }
          />
          <textarea
            className="mt-4 h-32 w-full resize-none rounded-md border border-gray-300 p-2 focus:border-none focus:outline-1 focus:outline-primary-main"
            placeholder="الجواب"
            value={formik.values.answer}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            id="answer"
            name="answer"
          />
        </form>
      ) : (
        <div>
          <h2 className="text-2xl font-bold">
            <span className="me-2 inline-block h-4 w-4 rounded-full bg-primary-main align-middle"></span>
            {faq.question} ؟
          </h2>
          <p className="mt-2 text-lg">{faq.answer}</p>
        </div>
      )}
      <Button
        variant={
          formik.values.question &&
          faq.answer === formik.values.answer &&
          isEditing
            ? "error-nude"
            : "primary-nude"
        }
        size="sm"
        disabled={isPending}
        className="disabled:opacity-50"
        onClick={() =>
          !isEditing
            ? setIsEditing(true)
            : formik.values.question &&
              faq.answer === formik.values.answer &&
              isEditing
            ? setIsEditing(false)
            : formik.submitForm()
        }
      >
        {isPending ? (
          <Loader2 className="animate-spin" />
        ) : faq.question === formik.values.question &&
          faq.answer === formik.values.answer &&
          isEditing ? (
          <X />
        ) : isEditing ? (
          <Save />
        ) : (
          <Pencil />
        )}
      </Button>
    </div>
  );
}

function AddForm() {
  const [show, setShow] = useState(false);
  const { formik, isPending } = useForm("add", () => setShow(false));

  return (
    <>
      <Button variant="primary-bg" onClick={() => setShow((prev) => !prev)}>
        إضافة سؤال
        <PlusCircle className="h-4 w-4" />
      </Button>
      {show && (
        <form
          onSubmit={formik.handleSubmit}
          className="absolute end-4 top-[120%] z-20 w-96 rounded-md bg-white p-4 shadow-md"
        >
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-body-lg font-bold">إضافة سؤال</h2>
            <Button
              type="button"
              size="sm"
              variant="error-nude"
              onClick={() => {
                setShow(false);
                formik.resetForm();
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <Input
            value={formik.values.question}
            type="text"
            id="question"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            message={
              formik.errors.question && formik.touched.question
                ? formik.errors.question
                : ""
            }
            variant={
              formik.errors.question && formik.touched.question
                ? "default-error"
                : "default"
            }
            placeholder="السؤال"
          />
          <textarea
            className="mt-4 h-52 w-full resize-none rounded-md border border-gray-300 p-2 focus:border-none focus:outline-1 focus:outline-primary-main"
            placeholder="الجواب"
            value={formik.values.answer}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            id="answer"
            name="answer"
          />
          <Button
            disabled={isPending}
            type="submit"
            variant="primary-bg"
            className="mt-4 w-full disabled:opacity-50"
          >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "إضافة"}
          </Button>
        </form>
      )}
    </>
  );
}

const useForm = (type: "add" | "edit", hideForm: () => void, faq?: FAQ) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationKey: ["faqs"],
    mutationFn: (values: Partial<FAQ>) =>
      type === "add"
        ? api.post("/faqs", values)
        : api.put(`/faqs/${faq?.id}`, values),
    onSuccess: () => {
      formik.resetForm();
      const t = toast({
        title: type === "add" ? "تمت الإضافة بنجاح" : "تم التعديل بنجاح",
        description:
          type === "add" ? "تمت إضافة السؤال بنجاح" : "تم تعديل السؤال بنجاح",
      });
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
      setTimeout(t.dismiss, 3000);
      hideForm();
    },
    onError: () => {
      const t = toast({
        title: "حدث خطأ",
        description:
          type === "add"
            ? "حدث خطأ أثناء إضافة السؤال"
            : "حدث خطأ أثناء تعديل السؤال",
        variant: "destructive",
      });
      setTimeout(t.dismiss, 3000);
    },
  });
  const formik = useFormik({
    initialValues: {
      question: faq?.question || "",
      answer: faq?.answer || "",
    },
    validationSchema: Yup.object({
      question: Yup.string()
        .required("السؤال مطلوب")
        .min(3, "السؤال يجب أن يكون أكثر من 3 حروف")
        .max(255, "السؤال يجب أن لا يتعدى 255 حرف")
        .matches(/^[^?؟]*$/, "لا يمكن إضافة علامة استفهام في السؤال"),
      answer: Yup.string()
        .required("الجواب مطلوب")
        .min(3, "الجواب يجب أن يكون أكثر من 3 حروف")
        .max(50_000, "الجواب يجب أن لا يتعدى 50,000 حرف"),
    }),
    onSubmit: (values) => {
      mutation.mutate(values);
    },
  });

  return { formik, isPending: mutation.isPending };
};
