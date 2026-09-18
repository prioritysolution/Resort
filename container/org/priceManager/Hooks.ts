"use client";

import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { format, isValid, parseISO } from "date-fns";
import toast from "react-hot-toast";
import {
  addRegularRateAPI,
  addSpecialRateAPI,
  deleteRegularRateAPI,
  deleteSpecialRateAPI,
  getRegularRateListAPI,
  getSpecialRateListAPI,
  searchRegularRateAPI,
  searchSpecialRateAPI,
  updateRegularRateAPI,
  updateSpecialRateAPI,
} from "@/container/org/priceManager/PriceManagerApis";
import { getRoomTypeListAPI } from "@/container/org/roomType/RoomTypeApis";
import type { RegularRate, RegularRateFormValues, SpecialRate, SpecialRateFormValues } from "./types";
import type { RoomType } from "@/container/org/roomType/types";

export type PriceManagerTab = "regular" | "special";

const rateField = (label: string) =>
  yup
    .mixed<number | string>()
    .required(`${label} is required`)
    .test(label, `Enter a valid ${label.toLowerCase()}`, (value) => {
      const num = Number(value);
      return value !== "" && value != null && !Number.isNaN(num) && num >= 0;
    });

const regularSchema: yup.ObjectSchema<RegularRateFormValues> = yup.object({
  room_tid: yup
    .mixed<number | string>()
    .required("Room type is required")
    .test("room_tid", "Select a room type", (value) => {
      const num = Number(value);
      return value !== "" && value != null && !Number.isNaN(num) && num > 0;
    }),
  rate_mon: rateField("Monday rate"),
  rate_tue: rateField("Tuesday rate"),
  rate_wed: rateField("Wednesday rate"),
  rate_thu: rateField("Thursday rate"),
  rate_fri: rateField("Friday rate"),
  rate_sat: rateField("Saturday rate"),
  rate_sun: rateField("Sunday rate"),
});

const specialSchema: yup.ObjectSchema<SpecialRateFormValues> = yup.object({
  room_tid: yup
    .mixed<number | string>()
    .required("Room type is required")
    .test("room_tid", "Select a room type", (value) => {
      const num = Number(value);
      return value !== "" && value != null && !Number.isNaN(num) && num > 0;
    }),
  event_name: yup
    .string()
    .required("Event name is required")
    .max(100, "Max 100 characters"),
  date_from: yup
    .mixed<Date | string>()
    .nullable()
    .required("From date is required")
    .test("date_from", "Select from date", (value) => Boolean(value)),
  date_upto: yup
    .mixed<Date | string>()
    .nullable()
    .required("Upto date is required")
    .test("date_upto", "Select upto date", (value) => Boolean(value)),
  rate_spl: rateField("Special rate"),
  status: yup.boolean().required().default(true),
});

const emptyRegular: RegularRateFormValues = {
  room_tid: "",
  rate_mon: "",
  rate_tue: "",
  rate_wed: "",
  rate_thu: "",
  rate_fri: "",
  rate_sat: "",
  rate_sun: "",
};

const emptySpecial: SpecialRateFormValues = {
  room_tid: "",
  event_name: "",
  date_from: null,
  date_upto: null,
  rate_spl: "",
  status: true,
};

const toDateOrNull = (value?: string | null) => {
  if (!value) return null;
  const parsed = parseISO(value);
  return isValid(parsed) ? parsed : null;
};

const toApiDate = (value: Date | string | null | undefined) => {
  if (!value) return "";
  if (value instanceof Date) {
    return isValid(value) ? format(value, "yyyy-MM-dd") : "";
  }
  const parsed = parseISO(String(value));
  return isValid(parsed) ? format(parsed, "yyyy-MM-dd") : String(value);
};

export const useRegularRates = () => {
  const [rows, setRows] = useState<RegularRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");
  const [roomTypeFilter, setRoomTypeFilter] = useState<number | string>("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<RegularRate | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<RegularRate | null>(null);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const form = useForm<RegularRateFormValues>({
    resolver: yupResolver(regularSchema),
    defaultValues: emptyRegular,
  });

  const loadList = useCallback(
    async (keyword = "", roomTid: number | string = "") => {
      setLoading(true);
      try {
        const res = keyword.trim()
          ? await searchRegularRateAPI(keyword.trim())
          : await getRegularRateListAPI(roomTid || undefined);

        if (res?.Error_Code === 0 || res?.Message === "Success") {
          setRows(Array.isArray(res.data) ? res.data : []);
          return;
        }

        toast.error(
          res?.Message || res?.message || "Unable to load regular rates",
        );
        setRows([]);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

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
    form.reset(emptyRegular);
    setDialogOpen(true);
  };

  const openEdit = (row: RegularRate) => {
    setEditingRow(row);
    form.reset({
      room_tid: row.Room_TId ?? "",
      rate_mon: row.Rate_Mon ?? "",
      rate_tue: row.Rate_Tue ?? "",
      rate_wed: row.Rate_Wed ?? "",
      rate_thu: row.Rate_Thu ?? "",
      rate_fri: row.Rate_Fri ?? "",
      rate_sat: row.Rate_Sat ?? "",
      rate_sun: row.Rate_Sun ?? "",
    });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingRow(null);
    form.reset(emptyRegular);
  };

  const handleSubmit = async (values: RegularRateFormValues) => {
    setSaving(true);
    try {
      const body = {
        room_tid: Number(values.room_tid),
        rate_mon: Number(values.rate_mon),
        rate_tue: Number(values.rate_tue),
        rate_wed: Number(values.rate_wed),
        rate_thu: Number(values.rate_thu),
        rate_fri: Number(values.rate_fri),
        rate_sat: Number(values.rate_sat),
        rate_sun: Number(values.rate_sun),
      };

      const res = editingRow?.Rate_Id_Reg
        ? await updateRegularRateAPI(editingRow.Rate_Id_Reg, body)
        : await addRegularRateAPI(body);

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
    if (!deleteTarget?.Rate_Id_Reg) return;
    setDeleting(true);
    try {
      const res = await deleteRegularRateAPI(deleteTarget.Rate_Id_Reg);
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

export const useSpecialRates = () => {
  const [rows, setRows] = useState<SpecialRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");
  const [roomTypeFilter, setRoomTypeFilter] = useState<number | string>("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<SpecialRate | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SpecialRate | null>(null);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const form = useForm<SpecialRateFormValues>({
    resolver: yupResolver(specialSchema),
    defaultValues: emptySpecial,
  });

  const loadList = useCallback(
    async (keyword = "", roomTid: number | string = "") => {
      setLoading(true);
      try {
        const res = keyword.trim()
          ? await searchSpecialRateAPI(keyword.trim())
          : await getSpecialRateListAPI(roomTid || undefined);

        if (res?.Error_Code === 0 || res?.Message === "Success") {
          setRows(Array.isArray(res.data) ? res.data : []);
          return;
        }

        toast.error(
          res?.Message || res?.message || "Unable to load special rates",
        );
        setRows([]);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

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
    form.reset(emptySpecial);
    setDialogOpen(true);
  };

  const openEdit = (row: SpecialRate) => {
    setEditingRow(row);
    form.reset({
      room_tid: row.Room_TId ?? "",
      event_name: row.Event_Name || "",
      date_from: toDateOrNull(row.Date_From),
      date_upto: toDateOrNull(row.Date_Upto),
      rate_spl: row.Rate_Spl ?? "",
      status: Number(row.Status) === 1,
    });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingRow(null);
    form.reset(emptySpecial);
  };

  const handleSubmit = async (values: SpecialRateFormValues) => {
    setSaving(true);
    try {
      const body = {
        room_tid: Number(values.room_tid),
        event_name: String(values.event_name).trim(),
        date_from: toApiDate(values.date_from),
        date_upto: toApiDate(values.date_upto),
        rate_spl: Number(values.rate_spl),
      };

      const res = editingRow?.Rate_Id_Spl
        ? await updateSpecialRateAPI(editingRow.Rate_Id_Spl, {
            ...body,
            status: values.status ? 1 : 0,
          })
        : await addSpecialRateAPI(body);

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
    if (!deleteTarget?.Rate_Id_Spl) return;
    setDeleting(true);
    try {
      const res = await deleteSpecialRateAPI(deleteTarget.Rate_Id_Spl);
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

export const usePriceManager = () => {
  const [activeTab, setActiveTab] = useState<PriceManagerTab>("regular");
  const [roomTypeOptions, setRoomTypeOptions] = useState<RoomType[]>([]);
  const regular = useRegularRates();
  const special = useSpecialRates();

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

  useEffect(() => {
    void loadRoomTypes();
  }, [loadRoomTypes]);

  return {
    activeTab,
    setActiveTab,
    roomTypeOptions,
    regular,
    special,
  };
};
