"use client";

import React from "react";
import Link from "next/link";
import { Switch } from "@headlessui/react";
import { useRouter } from "next/navigation";

import { Button, Input } from "@/components/atomics";
import { Layout } from "@/components/templates";
import { CheckIcon, EyeIcon } from "@/assets/icons";
import Image from "next/image";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { login } from "@/store/authSlice";
import { User } from "@/types";
import { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface ValuesTypes {
  email: string;
  password: string;
}

const AuthLogin = () => {
  // const token = useAppSelector((state) => state.token);
  // ---------------------------------------------------
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { toast, toasts } = useToast();
  const loginMutation = useMutation<
    any,
    AxiosError<{ message: string }, ValuesTypes>,
    ValuesTypes
  >({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const { data } = await api.post("/login", credentials);
      return data;
    },
    onSuccess: (data) => {
      const user = data.data as User;
      const token = data.token as string;
      dispatch(login({ user, token }));
      const t = toast({
        title: "تم تسجيل الدخول بنجاح",
        description: "تم تسجيل الدخول بنجاح",
      });
      setTimeout(() => {
        t.dismiss();
      }, 3000);

      setTimeout(() => {
        router.push("/");
      }, 500);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  // ---------------------------------------------------
  const [showPassword, setShowPassword] = React.useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  // ---------------------------------------------------
  const formik = useFormik<ValuesTypes>({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("يجب أن يكون البريد الإلكتروني صالحًا")
        .required("يجب إدخال البريد الإلكتروني"),
      password: Yup.string()
        .required("يجب إدخال كلمة المرور")
        .min(8, "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل"),
    }),
    onSubmit: async (values) => {
      loginMutation.mutate(values);
    },
  });

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="w-[598px] rounded-lg bg-netral-10 p-10 shadow-lg">
        <div className="mb-2 w-fit rounded-md bg-primary-main p-2">
          <Image
            src={"/zajil-logo.png"}
            alt="Zajil Logo"
            width={150}
            height={150}
            priority
          />
        </div>
        <header className="mb-8 space-y-3">
          <h5 className="text-heading-md font-bold">أهلاً!</h5>
          <p className="text-body-lg">Welcome back to e-commerce dashboard</p>
        </header>
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <Input
            id="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="أدخل بريدك الإلكتروني"
            label="البريد الإلكتروني"
            variant={
              formik.touched.email && formik.errors.email
                ? "default-error"
                : "default"
            }
          />
          {(formik.touched.email && formik.errors.email) ||
          loginMutation.isError ? (
            <span className="text-body-sm text-error-main">
              {formik.errors.email ??
                loginMutation.error?.response?.data?.message}
            </span>
          ) : null}

          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="أدخل كلمة المرور الخاصة بك"
              label="كلمة المرور"
              variant={
                formik.touched.password && formik.errors.password
                  ? "default-error"
                  : "default"
              }
            />
            <span
              onClick={togglePasswordVisibility}
              className={`absolute end-3 top-1/2 h-8 w-8 cursor-pointer rounded-lg-10 p-1 hover:bg-netral-30 ${
                showPassword ? "bg-primary-main/30" : "bg-white"
              }`}
            >
              <EyeIcon />
            </span>
          </div>
          {formik.touched.password && formik.errors.password ? (
            <span className="text-body-sm text-error-main">
              {formik.errors.password}
            </span>
          ) : null}

          <Button
            type="submit"
            size="lg"
            disabled={loginMutation.isPending}
            variant="primary-bg"
            className="w-full cursor-pointer hover:bg-primary-main disabled:cursor-not-allowed disabled:opacity-50 disabled:grayscale"
            // onClick={() => router.push("/")}
            // disabled={true}
          >
            {loginMutation.isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              "تسجيل الدخول"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AuthLogin;
