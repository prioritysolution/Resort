"use client";

import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import {
  addTravelAgentAPI,
  deleteTravelAgentAPI,
  getTravelAgentListAPI,
  searchTravelAgentAPI,
  updateTravelAgentAPI,
} from "@/container/org/travelAgent/TravelAgentApis";
import type { TravelAgent, TravelAgentFormValues } from "./types";

const schema: yup.ObjectSchema<TravelAgentFormValues> = yup.object({
  agent_name: yup
    .string()
    .required("Agent name is required")
    .max(100, "Max 100 characters"),
  org_name: yup.string().default("").max(150, "Max 150 characters"),
  address: yup.string().default("").max(200, "Max 200 characters"),
  contact_no: yup.string().default("").max(25, "Max 25 characters"),
  gst_no: yup.string().default("").max(25, "Max 25 characters"),
  pan_no: yup.string().default("").max(15, "Max 15 characters"),
  comm_prcnt: yup
    .mixed<number | string>()
    .required()
    .test("comm", "Enter a valid percent (0–100)", (value) => {
      if (value === "" || value == null) return true;
      const num = Number(value);
      return !Number.isNaN(num) && num >= 0 && num <= 100;
    }),
  status: yup.boolean().required().default(true),
});

const emptyValues: TravelAgentFormValues = {
  agent_name: "",
  org_name: "",
  address: "",
  contact_no: "",
  gst_no: "",
  pan_no: "",
  comm_prcnt: "",
  status: true,
};

export const useTravelAgent = () => {
  const [rows, setRows] = useState<TravelAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<TravelAgent | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TravelAgent | null>(null);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const form = useForm<TravelAgentFormValues>({
    resolver: yupResolver(schema),
    defaultValues: emptyValues,
  });

  const loadList = useCallback(async (keyword = "") => {
    setLoading(true);
    try {
      const res = keyword.trim()
        ? await searchTravelAgentAPI(keyword.trim())
        : await getTravelAgentListAPI();

      if (res?.Error_Code === 0 || res?.Message === "Success") {
        setRows(Array.isArray(res.data) ? res.data : []);
        return;
      }

      toast.error(
        res?.Message || res?.message || "Unable to load travel agents",
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

  const openEdit = (row: TravelAgent) => {
    setEditingRow(row);
    form.reset({
      agent_name: row.Agent_Name || "",
      org_name: row.Org_Name || "",
      address: row.Address || "",
      contact_no: row.Contact_No || "",
      gst_no: row.GST_No || "",
      pan_no: row.PAN_No || "",
      comm_prcnt: row.Comm_Prcnt ?? "",
      status: Number(row.Status) === 1,
    });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingRow(null);
    form.reset(emptyValues);
  };

  const handleSubmit = async (values: TravelAgentFormValues) => {
    setSaving(true);
    try {
      const body = {
        agent_name: String(values.agent_name).trim(),
        org_name: String(values.org_name || "").trim() || null,
        address: String(values.address || "").trim() || null,
        contact_no: String(values.contact_no || "").trim() || null,
        gst_no: String(values.gst_no || "").trim() || null,
        pan_no: String(values.pan_no || "").trim() || null,
        comm_prcnt:
          values.comm_prcnt === "" || values.comm_prcnt == null
            ? null
            : Number(values.comm_prcnt),
      };

      const res = editingRow?.Agent_Id
        ? await updateTravelAgentAPI(editingRow.Agent_Id, {
            ...body,
            status: values.status ? 1 : 0,
          })
        : await addTravelAgentAPI(body);

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
    if (!deleteTarget?.Agent_Id) return;
    setDeleting(true);
    try {
      const res = await deleteTravelAgentAPI(deleteTarget.Agent_Id);
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
