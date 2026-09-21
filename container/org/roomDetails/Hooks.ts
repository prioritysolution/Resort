"use client";

import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import {
  addRoomDetailsAPI,
  deleteRoomDetailsAPI,
  getRoomDetailsListAPI,
  searchRoomDetailsAPI,
  updateRoomDetailsAPI,
} from "@/container/org/roomDetails/RoomDetailsApis";
import { getRoomTypeListAPI } from "@/container/org/roomType/RoomTypeApis";
import type { RoomDetail, RoomDetailFormValues } from "./types";
import type { RoomType } from "@/container/org/roomType/types";

const schema: yup.ObjectSchema<RoomDetailFormValues> = yup.object({
  room_type: yup
    .mixed<number | string>()
    .required("Room type is required")
    .test("room_type", "Select a room type", (value) => {
      const num = Number(value);
      return value !== "" && value != null && !Number.isNaN(num) && num > 0;
    }),
  room_no: yup
    .string()
    .required("Room number is required")
    .max(10, "Max 10 characters"),
  room_desc: yup.string().default("").max(150, "Max 150 characters"),
  adult: yup
    .mixed<number | string>()
    .required("Adult capacity is required")
    .test("adult", "Enter at least 1 adult", (value) => {
      const num = Number(value);
      return !Number.isNaN(num) && num >= 1;
    }),
  child: yup
    .mixed<number | string>()
    .required()
    .test("child", "Enter a valid child count", (value) => {
      if (value === "" || value == null) return true;
      const num = Number(value);
      return !Number.isNaN(num) && num >= 0;
    }),
  booking_allowed: yup.boolean().required().default(true),
  // status: yup.boolean().required().default(true),
});

const emptyValues: RoomDetailFormValues = {
  room_type: "",
  room_no: "",
  room_desc: "",
  adult: "",
  child: "",
  booking_allowed: true,
  // status: true,
};

export const useRoomDetails = () => {
  const [rows, setRows] = useState<RoomDetail[]>([]);
  const [roomTypeOptions, setRoomTypeOptions] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");
  const [roomTypeFilter, setRoomTypeFilter] = useState<number | string>("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<RoomDetail | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<RoomDetail | null>(null);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const form = useForm<RoomDetailFormValues>({
    resolver: yupResolver(schema),
    defaultValues: emptyValues,
  });

  const loadRoomTypes = useCallback(async () => {
    try {
      const res = await getRoomTypeListAPI();
      if (res?.Error_Code === 0 || res?.Message === "Success") {
        setRoomTypeOptions(Array.isArray(res.data) ? res.data : []);
        return;
      }
      setRoomTypeOptions([]);
    } catch {
      setRoomTypeOptions([]);
    }
  }, []);

  const loadList = useCallback(
    async (keyword = "", roomType: number | string = "") => {
      setLoading(true);
      try {
        const res = keyword.trim()
          ? await searchRoomDetailsAPI(keyword.trim())
          : await getRoomDetailsListAPI(roomType || undefined);

        if (res?.Error_Code === 0 || res?.Message === "Success") {
          setRows(Array.isArray(res.data) ? res.data : []);
          return;
        }

        toast.error(
          res?.Message || res?.message || "Unable to load room details",
        );
        setRows([]);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    void loadRoomTypes();
  }, [loadRoomTypes]);

  useEffect(() => {
    const timer = setTimeout(
      () => {
        void loadList(search.trim(), roomTypeFilter);
      },
      search.trim() ? 350 : 0,
    );
    return () => clearTimeout(timer);
  }, [search, roomTypeFilter, loadList]);

  const openCreate = () => {
    setEditingRow(null);
    form.reset(emptyValues);
    setDialogOpen(true);
  };

  const openEdit = (row: RoomDetail) => {
    setEditingRow(row);
    form.reset({
      room_type: row.Room_Type ?? "",
      room_no: row.Room_No || "",
      room_desc: row.Room_Desc || "",
      adult: row.Adult ?? "",
      child: row.Child ?? "",
      booking_allowed: Number(row.Booking_Allowed) === 1,
      // status: Number(row.Status) === 1,
    });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingRow(null);
    form.reset(emptyValues);
  };

  const handleSubmit = async (values: RoomDetailFormValues) => {
    setSaving(true);
    try {
      const body = {
        room_type: Number(values.room_type),
        room_no: String(values.room_no).trim(),
        room_desc: String(values.room_desc || "").trim() || undefined,
        adult: Number(values.adult),
        child: Number(values.child || 0),
        booking_allowed: values.booking_allowed ? 1 : 0,
      };

      const res = editingRow?.Room_Id
        ? await updateRoomDetailsAPI(editingRow.Room_Id, {
            ...body,
            // status: values.status ? 1 : 0,
          })
        : await addRoomDetailsAPI(body);

      if (res?.Error_Code === 0) {
        setSuccessMessage(res.Message || "Saved successfully.");
        setSuccessOpen(true);
        closeDialog();
        await loadList(search.trim(), roomTypeFilter);
        return;
      }

      toast.error(res?.Message || res?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget?.Room_Id) return;
    setDeleting(true);
    try {
      const res = await deleteRoomDetailsAPI(deleteTarget.Room_Id);
      if (res?.Error_Code === 0) {
        toast.success(res.Message || "Deleted");
        setDeleteTarget(null);
        await loadList(search.trim(), roomTypeFilter);
        return;
      }
      toast.error(res?.Message || res?.message || "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  return {
    rows,
    roomTypeOptions,
    loading,
    saving,
    deleting,
    search,
    setSearch,
    roomTypeFilter,
    setRoomTypeFilter,
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
    reload: () => loadList(search.trim(), roomTypeFilter),
  };
};
