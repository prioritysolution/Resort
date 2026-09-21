"use client";

import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import {
  addMenuDetailsAPI,
  deleteMenuDetailsAPI,
  getMenuDetailsListAPI,
  searchMenuDetailsAPI,
  updateMenuDetailsAPI,
} from "@/container/org/menuDetails/MenuDetailsApis";
import { getMenuCategoryListAPI } from "@/container/org/menuCategory/MenuCategoryApis";
import type { MenuCategory } from "@/container/org/menuCategory/types";
import type { MenuDetail, MenuDetailFormValues } from "./types";

const schema: yup.ObjectSchema<MenuDetailFormValues> = yup.object({
  category_id: yup
    .mixed<number | string>()
    .required("Category is required")
    .test("category_id", "Select a category", (value) => {
      const num = Number(value);
      return value !== "" && value != null && !Number.isNaN(num) && num > 0;
    }),
  menu_code: yup
    .mixed<number | string>()
    .default("")
    .test("menu_code", "Enter a valid menu code", (value) => {
      if (value === "" || value == null) return true;
      const num = Number(value);
      return !Number.isNaN(num) && num >= 0;
    }),
  menu_name: yup
    .string()
    .required("Menu name is required")
    .max(150, "Max 150 characters"),
  menu_shortnm: yup.string().default("").max(25, "Max 25 characters"),
  menu_desc: yup.string().default("").max(255, "Max 255 characters"),
  rate: yup
    .mixed<number | string>()
    .required("Rate is required")
    .test("rate", "Enter a valid rate", (value) => {
      const num = Number(value);
      return value !== "" && value != null && !Number.isNaN(num) && num >= 0;
    }),
  // status: yup.boolean().required().default(true),
});

const emptyValues: MenuDetailFormValues = {
  category_id: "",
  menu_code: "",
  menu_name: "",
  menu_shortnm: "",
  menu_desc: "",
  rate: "",
  // status: true,
};

export const useMenuDetails = () => {
  const [rows, setRows] = useState<MenuDetail[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<number | string>("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<MenuDetail | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MenuDetail | null>(null);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const form = useForm<MenuDetailFormValues>({
    resolver: yupResolver(schema),
    defaultValues: emptyValues,
  });

  const loadCategories = useCallback(async () => {
    try {
      const res = await getMenuCategoryListAPI();
      if (res?.Error_Code === 0 || res?.Message === "Success") {
        setCategoryOptions(Array.isArray(res.data) ? res.data : []);
        return;
      }
      setCategoryOptions([]);
    } catch {
      setCategoryOptions([]);
    }
  }, []);

  const loadList = useCallback(
    async (keyword = "", categoryId: number | string = "") => {
      setLoading(true);
      try {
        const res = keyword.trim()
          ? await searchMenuDetailsAPI(keyword.trim())
          : await getMenuDetailsListAPI(categoryId || undefined);

        if (res?.Error_Code === 0 || res?.Message === "Success") {
          setRows(Array.isArray(res.data) ? res.data : []);
          return;
        }

        toast.error(
          res?.Message || res?.message || "Unable to load menu details",
        );
        setRows([]);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    const timer = setTimeout(
      () => {
        void loadList(search.trim(), categoryFilter);
      },
      search.trim() ? 350 : 0,
    );
    return () => clearTimeout(timer);
  }, [search, categoryFilter, loadList]);

  const openCreate = () => {
    setEditingRow(null);
    form.reset(emptyValues);
    setDialogOpen(true);
  };

  const openEdit = (row: MenuDetail) => {
    setEditingRow(row);
    form.reset({
      category_id: row.Category_Id ?? "",
      menu_code: row.Menu_Code ?? "",
      menu_name: row.Menu_Name || "",
      menu_shortnm: row.Menu_ShortNm || "",
      menu_desc: row.Menu_Desc || "",
      rate: row.Rate ?? "",
      // status: Number(row.Status) === 1,
    });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingRow(null);
    form.reset(emptyValues);
  };

  const handleSubmit = async (values: MenuDetailFormValues) => {
    setSaving(true);
    try {
      const body = {
        category_id: Number(values.category_id),
        menu_name: String(values.menu_name).trim(),
        rate: Number(values.rate),
        menu_code:
          values.menu_code === "" || values.menu_code == null
            ? undefined
            : Number(values.menu_code),
        menu_shortnm: String(values.menu_shortnm || "").trim() || undefined,
        menu_desc: String(values.menu_desc || "").trim() || undefined,
      };

      const res = editingRow?.Item_Id
        ? await updateMenuDetailsAPI(editingRow.Item_Id, {
            ...body,
            // status: values.status ? 1 : 0,
          })
        : await addMenuDetailsAPI(body);

      if (res?.Error_Code === 0) {
        setSuccessMessage(res.Message || "Saved successfully.");
        setSuccessOpen(true);
        closeDialog();
        await loadList(search.trim(), categoryFilter);
        return;
      }

      toast.error(res?.Message || res?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget?.Item_Id) return;
    setDeleting(true);
    try {
      const res = await deleteMenuDetailsAPI(deleteTarget.Item_Id);
      if (res?.Error_Code === 0) {
        toast.success(res.Message || "Deleted");
        setDeleteTarget(null);
        await loadList(search.trim(), categoryFilter);
        return;
      }
      toast.error(res?.Message || res?.message || "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  return {
    rows,
    categoryOptions,
    loading,
    saving,
    deleting,
    search,
    setSearch,
    categoryFilter,
    setCategoryFilter,
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
    reload: () => loadList(search.trim(), categoryFilter),
  };
};
