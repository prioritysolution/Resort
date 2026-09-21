"use client";

import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import {
  addPaidServiceAPI,
  deletePaidServiceAPI,
  getPaidServiceListAPI,
  searchPaidServiceAPI,
  updatePaidServiceAPI,
} from "@/container/org/paidService/PaidServiceApis";
import type { PaidService, PaidServiceFormValues } from "./types";

const schema: yup.ObjectSchema<PaidServiceFormValues> = yup.object({
  service_name: yup
    .string()
    .required("Service name is required")
    .max(100, "Max 100 characters"),
  serv_desc: yup.string().max(150, "Max 150 characters").default(""),
  serv_charges: yup
    .mixed<number | string>()
    .required("Service charges are required")
    .test("charges", "Enter a valid charge", (value) => {
      const num = Number(value);
      return !Number.isNaN(num) && num >= 0;
    }),
  status: yup.boolean().required().default(true),
});

const emptyValues: PaidServiceFormValues = {
  service_name: "",
  serv_desc: "",
  serv_charges: "",
  status: true,
};

export const usePaidService = () => {
  const [rows, setRows] = useState<PaidService[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<PaidService | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PaidService | null>(null);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const form = useForm<PaidServiceFormValues>({
    resolver: yupResolver(schema),
    defaultValues: emptyValues,
  });

  const loadList = useCallback(async (keyword = "") => {
    setLoading(true);
    try {
      const res = keyword.trim()
        ? await searchPaidServiceAPI(keyword.trim())
        : await getPaidServiceListAPI();

      if (res?.Error_Code === 0 || res?.Message === "Success") {
        setRows(Array.isArray(res.data) ? res.data : []);
        return;
      }

      toast.error(
        res?.Message || res?.message || "Unable to load paid services",
      );
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
    setEditingRow(null);
    form.reset(emptyValues);
    setDialogOpen(true);
  };

  const openEdit = (row: PaidService) => {
    setEditingRow(row);
    form.reset({
      service_name: row.Service_Name || "",
      serv_desc: row.Serv_Desc || "",
      serv_charges: row.Serv_Charges ?? "",
      status: Number(row.Status) === 1,
    });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingRow(null);
    form.reset(emptyValues);
  };

  const handleSubmit = async (values: PaidServiceFormValues) => {
    setSaving(true);
    try {
      const body = {
        service_name: String(values.service_name).trim(),
        serv_desc: String(values.serv_desc || "").trim(),
        serv_charges: Number(values.serv_charges),
      };

      const res = editingRow?.Service_Id
        ? await updatePaidServiceAPI(editingRow.Service_Id, {
            ...body,
            status: values.status ? 1 : 0,
          })
        : await addPaidServiceAPI(body);

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
    if (!deleteTarget?.Service_Id) return;
    setDeleting(true);
    try {
      const res = await deletePaidServiceAPI(deleteTarget.Service_Id);
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
