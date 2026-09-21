"use client";

import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import {
  addMenuCategoryAPI,
  deleteMenuCategoryAPI,
  getMenuCategoryListAPI,
  searchMenuCategoryAPI,
  updateMenuCategoryAPI,
} from "@/container/org/menuCategory/MenuCategoryApis";
import type { MenuCategory, MenuCategoryFormValues } from "./types";

const schema: yup.ObjectSchema<MenuCategoryFormValues> = yup.object({
  categ_name: yup
    .string()
    .required("Category name is required")
    .max(50, "Max 50 characters"),
  status: yup.boolean().required().default(true),
});

const emptyValues: MenuCategoryFormValues = {
  categ_name: "",
  status: true,
};

export const useMenuCategory = () => {
  const [rows, setRows] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<MenuCategory | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MenuCategory | null>(null);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const form = useForm<MenuCategoryFormValues>({
    resolver: yupResolver(schema),
    defaultValues: emptyValues,
  });

  const loadList = useCallback(async (keyword = "") => {
    setLoading(true);
    try {
      const res = keyword.trim()
        ? await searchMenuCategoryAPI(keyword.trim())
        : await getMenuCategoryListAPI();

      if (res?.Error_Code === 0 || res?.Message === "Success") {
        setRows(Array.isArray(res.data) ? res.data : []);
        return;
      }

      toast.error(
        res?.Message || res?.message || "Unable to load menu categories",
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

  const openEdit = (row: MenuCategory) => {
    setEditingRow(row);
    form.reset({
      categ_name: row.Categ_Name || "",
      status: Number(row.Status) === 1,
    });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingRow(null);
    form.reset(emptyValues);
  };

  const handleSubmit = async (values: MenuCategoryFormValues) => {
    setSaving(true);
    try {
      const body = {
        categ_name: String(values.categ_name).trim(),
      };

      const res = editingRow?.Category_Id
        ? await updateMenuCategoryAPI(editingRow.Category_Id, {
            ...body,
            status: values.status ? 1 : 0,
          })
        : await addMenuCategoryAPI(body);

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
    if (!deleteTarget?.Category_Id) return;
    setDeleting(true);
    try {
      const res = await deleteMenuCategoryAPI(deleteTarget.Category_Id);
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
