"use client";

import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import {
  addRoomTypeAPI,
  deleteRoomTypeAPI,
  getRoomTypeListAPI,
  searchRoomTypeAPI,
  updateRoomTypeAPI,
} from "@/container/org/roomType/RoomTypeApis";
import type { RoomType, RoomTypeFormValues } from "./types";

const schema: yup.ObjectSchema<RoomTypeFormValues> = yup.object({
  room_tname: yup
    .string()
    .required("Room type name is required")
    .max(150, "Max 150 characters"),
  room_charges: yup
    .mixed<number | string>()
    .required("Room charges are required")
    .test("charges", "Enter a valid charge", (value) => {
      const num = Number(value);
      return !Number.isNaN(num) && num >= 0;
    }),
  extra_bed_charges: yup
    .mixed<number | string>()
    .required()
    .test("extra", "Enter a valid charge", (value) => {
      if (value === "" || value == null) return true;
      const num = Number(value);
      return !Number.isNaN(num) && num >= 0;
    }),
  status: yup.boolean().required().default(true),
});

const emptyValues: RoomTypeFormValues = {
  room_tname: "",
  room_charges: "",
  extra_bed_charges: "",
  status: true,
};

export const useRoomType = () => {
  const [rows, setRows] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<RoomType | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<RoomType | null>(null);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const form = useForm<RoomTypeFormValues>({
    resolver: yupResolver(schema),
    defaultValues: emptyValues,
  });

  const loadList = useCallback(async (keyword = "") => {
    setLoading(true);
    try {
      const res = keyword.trim()
        ? await searchRoomTypeAPI(keyword.trim())
        : await getRoomTypeListAPI();

      if (res?.Error_Code === 0 || res?.Message === "Success") {
        setRows(Array.isArray(res.data) ? res.data : []);
        return;
      }

      toast.error(res?.Message || res?.message || "Unable to load room types");
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

  const openEdit = (row: RoomType) => {
    setEditingRow(row);
    form.reset({
      room_tname: row.Room_TName || "",
      room_charges: row.Room_Charges ?? "",
      extra_bed_charges: row.Extra_Bed_Charges ?? "",
      status: Number(row.Status) === 1,
    });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingRow(null);
    form.reset(emptyValues);
  };

  const handleSubmit = async (values: RoomTypeFormValues) => {
    setSaving(true);
    try {
      const body = {
        room_tname: String(values.room_tname).trim(),
        room_charges: Number(values.room_charges),
        extra_bed_charges: Number(values.extra_bed_charges || 0),
      };

      const res = editingRow?.Room_TId
        ? await updateRoomTypeAPI(editingRow.Room_TId, {
            ...body,
            status: values.status ? 1 : 0,
          })
        : await addRoomTypeAPI(body);

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
    if (!deleteTarget?.Room_TId) return;
    setDeleting(true);
    try {
      const res = await deleteRoomTypeAPI(deleteTarget.Room_TId);
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
