"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import getCookieData from "@/utils/getCookieData";
import { nameRegex } from "@/utils/validationRegex";
import { setSecureCookie } from "@/utils/secureCookieHelper";

const schema = yup.object({
  fullName: yup
    .string()
    .required("Name is required")
    .matches(nameRegex, "Enter a valid name"),
  orgName: yup.string().required("Organisation is required"),
  email: yup.string(),
});

export const useProfile = () => {
  const [loading, setLoading] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      fullName: "",
      orgName: "",
      email: "",
    },
  });

  useEffect(() => {
    const token = String(getCookieData("prioBankClientToken") || "");
    form.reset({
      fullName: getCookieData("userName") || "",
      orgName: getCookieData("userOrgName") || "",
      email: token.startsWith("demo-") ? token.replace(/^demo-/, "") : "",
    });
  }, [form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      setSecureCookie("userName", values.fullName, { expires: 7 });
      setSecureCookie("userOrgName", values.orgName, { expires: 7 });
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
