"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import getCookieData from "@/utils/getCookieData";
import {
  addUserAPI,
  deleteUserAPI,
  getUsersListAPI,
  searchUsersAPI,
  updateUserAPI,
} from "@/container/org/users/UsersApis";
import type { AppUser, AppUserFormValues } from "./types";

const schema: yup.ObjectSchema<AppUserFormValues> = yup.object({
  org_id: yup
    .mixed<number | string>()
    .required("Organisation is required")
    .test("org_id", "Invalid organisation", (value) => {
      const num = Number(value);
      return value !== "" && value != null && !Number.isNaN(num) && num > 0;
    }),
  branch_id: yup
    .mixed<number | string>()
    .required("Branch is required")
    .test("branch_id", "Invalid branch", (value) => {
      const num = Number(value);
      return value !== "" && value != null && !Number.isNaN(num) && num > 0;
    }),
  user_name: yup
    .string()
    .required("User name is required")
    .max(100, "Max 100 characters"),
  short_name: yup
    .string()
    .required("Short name is required")
    .max(25, "Max 25 characters"),
  user_code: yup
    .string()
    .required("User code is required")
    .max(25, "Max 25 characters"),
  password: yup
    .string()
    .default("")
    .test("password", "Password must be at least 6 characters", (value) => {
      if (!value) return true;
      return value.length >= 6;
    }),
});

const cookieNumber = (key: string) => {
  const raw = getCookieData(key);
  const num = Number(raw);
  return !Number.isNaN(num) && num > 0 ? num : "";
};

const getEmptyValues = (): AppUserFormValues => ({
  org_id: cookieNumber("resortOrgId"),
  branch_id: cookieNumber("resortBranchId"),
  user_name: "",
  short_name: "",
  user_code: "",
  password: "",
});

export const useUsers = () => {
  const [rows, setRows] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<AppUser | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AppUser | null>(null);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  /** Ignore reopen from Cancel click-through onto "+ Add user" */
  const reopenGuardUntilRef = useRef(0);

  const form = useForm<AppUserFormValues>({
    resolver: yupResolver(schema),
    defaultValues: getEmptyValues(),
  });

  const loadList = useCallback(async (keyword = "") => {
    setLoading(true);
    try {
      const res = keyword.trim()
        ? await searchUsersAPI(keyword.trim())
        : await getUsersListAPI();

      if (res?.Error_Code === 0 || res?.Message === "Success") {
        setRows(Array.isArray(res.data) ? res.data : []);
        return;
      }

      toast.error(res?.Message || res?.message || "Unable to load users");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(
      () => {
        void loadList(search.trim());
      },
      search.trim() ? 350 : 0,
    );
    return () => clearTimeout(timer);
  }, [search, loadList]);

  const openCreate = () => {
    if (Date.now() < reopenGuardUntilRef.current) return;
    setEditingRow(null);
    form.reset(getEmptyValues());
    setDialogOpen(true);
  };

  const openEdit = (row: AppUser) => {
    if (Date.now() < reopenGuardUntilRef.current) return;
    setEditingRow(row);
    form.reset({
      org_id: row.Org_Id ?? cookieNumber("resortOrgId"),
      branch_id: row.Branch_Id ?? cookieNumber("resortBranchId"),
      user_name: row.User_Name || "",
      short_name: row.Short_Name || "",
      user_code: row.User_Code || "",
      password: "",
    });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    reopenGuardUntilRef.current = Date.now() + 400;
    setDialogOpen(false);
    setEditingRow(null);
    form.reset(getEmptyValues());
  };

  const handleSubmit = async (values: AppUserFormValues) => {
    setSaving(true);
    try {
      if (!editingRow?.User_Id) {
        const password = String(values.password || "");
        if (password.length < 6) {
          form.setError("password", {
            type: "manual",
            message: "Password is required (min 6 characters)",
          });
          return;
        }

        const res = await addUserAPI({
          org_id: Number(values.org_id),
          branch_id: Number(values.branch_id),
          user_name: String(values.user_name).trim(),
          short_name: String(values.short_name).trim(),
          user_code: String(values.user_code).trim(),
          password,
        });

        if (res?.Error_Code === 0) {
          setSuccessMessage(res.Message || "Saved successfully.");
          setSuccessOpen(true);
          closeDialog();
          await loadList(search.trim());
          return;
        }

        toast.error(res?.Message || res?.message || "Save failed");
        return;
      }

      const res = await updateUserAPI(editingRow.User_Id, {
        user_name: String(values.user_name).trim(),
        short_name: String(values.short_name).trim(),
        user_code: String(values.user_code).trim(),
      });

      if (res?.Error_Code === 0) {
        setSuccessMessage(res.Message || "Saved successfully.");
        setSuccessOpen(true);
        closeDialog();
        await loadList(search.trim());
        return;
      }

      toast.error(res?.Message || res?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget?.User_Id) return;
    setDeleting(true);
    try {
      const res = await deleteUserAPI(deleteTarget.User_Id);
      if (res?.Error_Code === 0) {
        toast.success(res.Message || "Deleted");
        setDeleteTarget(null);
        await loadList(search.trim());
        return;
      }
      toast.error(res?.Message || res?.message || "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  return {
    rows,
    loading,
    saving,
    deleting,
    search,
    setSearch,
    dialogOpen,
    setDialogOpen,
    editingRow,
    deleteTarget,
    setDeleteTarget,
    successOpen,
    setSuccessOpen,
    successMessage,
    form,
    openCreate,
    openEdit,
    closeDialog,
    handleSubmit,
    confirmDelete,
    reload: () => loadList(search.trim()),
  };
};
