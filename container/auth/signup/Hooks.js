"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { emailRegex, passwordRegex } from "@/utils/validationRegex";
import { setSecureCookie } from "@/utils/secureCookieHelper";
import { signupUserAPI } from "@/container/auth/signup/SignupApis";

const usernameRegex = /^[a-zA-Z0-9._-]{3,30}$/;

const schema = yup.object({
  username: yup
    .string()
    .required("Username is required")
    .matches(
      usernameRegex,
      "Use 3–30 letters, numbers, dots, underscores or hyphens",
    ),
  email: yup
    .string()
    .required("Email is required")
    .matches(emailRegex, "Enter a valid email"),
  password: yup
    .string()
    .required("Password is required")
    .matches(
      passwordRegex,
      "Use 8+ chars with upper, lower, number and symbol",
    ),
});

const persistSession = (details) => {
  const cookieOptions = { expires: 7 };
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

export const useSignup = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const res = await signupUserAPI({
        username: values.username,
        email: values.email,
        password: values.password,
      });

      if (res.message === "Success" || res.message === "Data Found") {
        persistSession(res.details || {});
        setSuccessOpen(true);
        return;
      }

      toast.error(res.message || "Unable to create account");
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setSuccessOpen(false);
    router.replace("/dashboard");
  };

  return {
    form,
    loading,
    showPassword,
    setShowPassword,
    successOpen,
    handleSuccessClose,
    handleSubmit,
  };
};
