"use client";

import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { format, isValid, parseISO } from "date-fns";
import toast from "react-hot-toast";
import {
  addStaffProfileAPI,
  deleteStaffProfileAPI,
  getStaffProfileListAPI,
  searchStaffProfileAPI,
  updateStaffProfileAPI,
} from "@/container/org/staffProfile/StaffProfileApis";
import type { StaffProfile, StaffProfileFormValues } from "./types";

const schema: yup.ObjectSchema<StaffProfileFormValues> = yup.object({
  staff_name: yup
    .string()
    .required("Staff name is required")
    .max(100, "Max 100 characters"),
  nick_name: yup.string().default("").max(25, "Max 25 characters"),
  guardian_name: yup.string().default("").max(75, "Max 75 characters"),
  address: yup.string().default("").max(255, "Max 255 characters"),
  cont_no: yup.string().default("").max(15, "Max 15 characters"),
  gender_cd: yup
    .mixed<number | string>()
    .required("Gender is required")
    .test("gender", "Select a gender", (value) => {
      const num = Number(value);
      return [1, 2, 3].includes(num);
    }),
  age: yup.string().default("").max(2, "Max 2 characters"),
  aadhar_no: yup.string().default("").max(20, "Max 20 characters"),
  join_date: yup.mixed<Date | string>().nullable().default(null),
  designation: yup.string().default("").max(25, "Max 25 characters"),
  salary: yup
    .mixed<number | string>()
    .required()
    .test("salary", "Enter a valid salary", (value) => {
      if (value === "" || value == null) return true;
      const num = Number(value);
      return !Number.isNaN(num) && num >= 0;
    }),
  bank_dtls: yup.string().default("").max(25, "Max 25 characters"),
  remarks: yup.string().default("").max(50, "Max 50 characters"),
  release_date: yup.mixed<Date | string>().nullable().default(null),
  status: yup.boolean().required().default(true),
});

const emptyValues: StaffProfileFormValues = {
  staff_name: "",
  nick_name: "",
  guardian_name: "",
  address: "",
  cont_no: "",
  gender_cd: 1,
  age: "",
  aadhar_no: "",
  join_date: null,
  designation: "",
  salary: "",
  bank_dtls: "",
  remarks: "",
  release_date: null,
  status: true,
};

const toDateOrNull = (value?: string | null) => {
  if (!value) return null;
  const parsed = parseISO(value);
  return isValid(parsed) ? parsed : null;
};

const toApiDate = (value: Date | string | null | undefined) => {
  if (!value) return null;
  if (value instanceof Date) {
    return isValid(value) ? format(value, "yyyy-MM-dd") : null;
  }
  const parsed = parseISO(String(value));
  return isValid(parsed) ? format(parsed, "yyyy-MM-dd") : String(value);
};

export const useStaffProfile = () => {
  const [rows, setRows] = useState<StaffProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<StaffProfile | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<StaffProfile | null>(null);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const form = useForm<StaffProfileFormValues>({
    resolver: yupResolver(schema),
    defaultValues: emptyValues,
  });

  const loadList = useCallback(async (keyword = "") => {
    setLoading(true);
    try {
      const res = keyword.trim()
        ? await searchStaffProfileAPI(keyword.trim())
        : await getStaffProfileListAPI();

      if (res?.Error_Code === 0 || res?.Message === "Success") {
        setRows(Array.isArray(res.data) ? res.data : []);
        return;
      }

      toast.error(
        res?.Message || res?.message || "Unable to load staff profiles",
      );
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadList();
  }, [loadList]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadList(search.trim());
    }, 350);
    return () => clearTimeout(timer);
  }, [search, loadList]);

  const openCreate = () => {
    setEditingRow(null);
    form.reset(emptyValues);
    setDialogOpen(true);
  };

  const openEdit = (row: StaffProfile) => {
    setEditingRow(row);
    form.reset({
      staff_name: row.Staff_Name || "",
      nick_name: row.Nick_Name || "",
      guardian_name: row.Guardian_Name || "",
      address: row.Address || "",
      cont_no: row.Cont_No || "",
      gender_cd: row.Gender_Cd ?? 1,
      age: row.Age || "",
      aadhar_no: row.Aadhar_No || "",
      join_date: toDateOrNull(row.Join_Date),
      designation: row.Designation || "",
      salary: row.Salary ?? "",
      bank_dtls: row.Bank_Dtls || "",
      remarks: row.Remarks || "",
      release_date: toDateOrNull(row.Release_Date),
      status: Number(row.Status) === 1,
    });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingRow(null);
    form.reset(emptyValues);
  };

  const handleSubmit = async (values: StaffProfileFormValues) => {
    setSaving(true);
    try {
      const body = {
        staff_name: String(values.staff_name).trim(),
        nick_name: String(values.nick_name || "").trim() || null,
        guardian_name: String(values.guardian_name || "").trim() || null,
        address: String(values.address || "").trim() || null,
        cont_no: String(values.cont_no || "").trim() || null,
        gender_cd: Number(values.gender_cd) || 1,
        age: String(values.age || "").trim() || null,
        aadhar_no: String(values.aadhar_no || "").trim() || null,
        join_date: toApiDate(values.join_date),
        designation: String(values.designation || "").trim() || null,
        salary:
          values.salary === "" || values.salary == null
            ? null
            : Number(values.salary),
        bank_dtls: String(values.bank_dtls || "").trim() || null,
        remarks: String(values.remarks || "").trim() || null,
      };

      const res = editingRow?.Staff_Id
        ? await updateStaffProfileAPI(editingRow.Staff_Id, {
            ...body,
            release_date: toApiDate(values.release_date),
            status: values.status ? 1 : 0,
          })
        : await addStaffProfileAPI(body);

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
    if (!deleteTarget?.Staff_Id) return;
    setDeleting(true);
    try {
      const res = await deleteStaffProfileAPI(deleteTarget.Staff_Id);
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
