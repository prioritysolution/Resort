"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { emailRegex } from "@/utils/validationRegex";
import { setSecureCookie } from "@/utils/secureCookieHelper";
import { loginUserAPI } from "@/container/auth/login/LoginApis";

const schema = yup.object({
  email: yup
    .string()
    .required("Email is required")
    .matches(emailRegex, "Enter a valid email"),
  password: yup.string().required("Password is required").min(6, "Min 6 characters"),
  rememberMe: yup.boolean(),
});

const persistSession = (details, rememberMe) => {
  const cookieOptions = rememberMe ? { expires: 30 } : undefined;
  setSecureCookie("prioBankClientToken", details.token, cookieOptions);
  setSecureCookie("userName", details.userName || "User", cookieOptions);
  setSecureCookie(
    "userOrgName",
    details.userOrgName || "Innap Cooperative Bank",
    cookieOptions,
  );
  setSecureCookie("orgId", details.orgId || "1", cookieOptions);
  setSecureCookie("userBranchId", details.userBranchId || "1", cookieOptions);
  setSecureCookie("finId", details.finId || "1", cookieOptions);

  const year = new Date().getFullYear();
  const fyStart = `${year}-04-01`;
  const fyEnd = `${year + 1}-03-31`;
  setSecureCookie("beg_date", fyStart, cookieOptions);
  setSecureCookie("fin_start_date", fyStart, cookieOptions);
  setSecureCookie("fin_end_date", fyEnd, cookieOptions);
};

export const useLogin = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: true,
    },
  });

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const res = await loginUserAPI({
        email: values.email,
        password: values.password,
      });

      if (res.message === "Success" || res.message === "Data Found") {
        persistSession(res.details || {}, values.rememberMe);
        toast.success("Welcome back");
        router.replace("/dashboard");
        return;
      }

      toast.error(res.message || "Unable to sign in");
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
