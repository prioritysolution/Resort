"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { setSecureCookie } from "@/utils/secureCookieHelper";
import { loginUserAPI } from "@/container/auth/login/LoginApis";
import type { LoginFormValues, LoginUser } from "./types";

const schema: yup.ObjectSchema<LoginFormValues> = yup.object({
  user_code: yup.string().required("User code is required"),
  password: yup.string().required("Password is required"),
  rememberMe: yup.boolean().required().default(true),
});

const persistSession = (
  token: string,
  tokenType: string | undefined,
  user: LoginUser,
  rememberMe: boolean,
) => {
  const cookieOptions = rememberMe ? { expires: 30 } : undefined;

  setSecureCookie("resortToken", token, cookieOptions);
  setSecureCookie("resortTokenType", tokenType || "Bearer", cookieOptions);
  setSecureCookie("resortUserId", String(user.user_id), cookieOptions);
  setSecureCookie("resortOrgId", String(user.org_id), cookieOptions);
  setSecureCookie("resortBranchId", String(user.branch_id), cookieOptions);
  setSecureCookie("resortUserName", user.user_name || "", cookieOptions);
  setSecureCookie("resortShortName", user.short_name || "", cookieOptions);
  setSecureCookie("resortUserCode", user.user_code || "", cookieOptions);
  setSecureCookie(
    "resortIsActive",
    String(Boolean(user.is_active)),
    cookieOptions,
  );
  setSecureCookie("resortStatus", user.status || "", cookieOptions);
  setSecureCookie("resortBranchCode", user.branch_code || "", cookieOptions);
  setSecureCookie("resortBranchName", user.branch_name || "", cookieOptions);
  setSecureCookie("resortName", user.resort_name || "", cookieOptions);
  setSecureCookie("resortOrgSchema", user.org_schema || "", cookieOptions);
  setSecureCookie(
    "resortDatabaseName",
    user.database_name || "",
    cookieOptions,
  );
};

export const useLogin = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      user_code: "",
      password: "",
      rememberMe: true,
    },
  });

  const handleSubmit = async (values: LoginFormValues) => {
    setLoading(true);
    try {
      const res = await loginUserAPI({
        user_code: values.user_code.trim(),
        password: values.password,
      });

      if (res?.token && res?.user) {
        persistSession(res.token, res.token_type, res.user, values.rememberMe);
        toast.success(res.message || "Welcome back");
        router.replace("/dashboard");
        return;
      }

      toast.error(res?.message || "Unable to sign in");
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    showPassword,
    setShowPassword,
    handleSubmit,
  };
};
