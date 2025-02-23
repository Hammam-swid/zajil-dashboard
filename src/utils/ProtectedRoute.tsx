"use client";

import { logout } from "@/store/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useAppSelector((state) => state.user);
  const token = useAppSelector((state) => state.token);
  const dispatch = useAppDispatch();
  const router = useRouter();
  useEffect(() => {
    if (!token || !user) {
      router.push("/login");
      dispatch(logout());
    }
  }, [token, user, router, dispatch]);

  return !token || !user ? null : <React.Fragment>{children}</React.Fragment>;
};

export default ProtectedRoute;
