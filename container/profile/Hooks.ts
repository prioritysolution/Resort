"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import getCookieData from "@/utils/getCookieData";
import { nameRegex } from "@/utils/validationRegex";
import { setSecureCookie } from "@/utils/secureCookieHelper";
import type { ProfileFormValues } from "./types";

const schema: yup.ObjectSchema<ProfileFormValues> = yup.object({
  fullName: yup
    .string()
    .required("Name is required")
    .matches(nameRegex, "Enter a valid name"),
  orgName: yup.string().required("Organisation is required"),
  email: yup.string().default(""),
});

export const useProfile = () => {
  const [loading, setLoading] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      fullName: "",
      orgName: "",
      email: "",
    },
  });

  useEffect(() => {
    form.reset({
      fullName:
        getCookieData("resortUserName") ||
        getCookieData("resortShortName") ||
        "",
      orgName:
        getCookieData("resortName") ||
        getCookieData("resortBranchName") ||
        "",
      email: getCookieData("resortUserCode") || "",
    });
  }, [form]);

  const handleSubmit = async (values: ProfileFormValues) => {
    setLoading(true);
    try {
      setSecureCookie("resortUserName", values.fullName, { expires: 7 });
      setSecureCookie("resortName", values.orgName, { expires: 7 });
      toast.success("Profile updated");
      setSuccessOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    successOpen,
    setSuccessOpen,
    handleSubmit,
  };
};
