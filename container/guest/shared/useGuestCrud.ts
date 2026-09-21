"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";
import toast from "react-hot-toast";
import type { ApiCudResponse, ApiListResponse } from "@/types/api";
import type { GuestDataResponse } from "./types";
import { apiMessage, extractDetails, extractListRows, isApiSuccess } from "./types";

type Config<T extends object, F extends FieldValues, P> = {
  form: UseFormReturn<F>;
  emptyValues: F;
  getList: (filter?: string) => Promise<ApiListResponse<T>>;
  getDetails?: (row: T) => Promise<GuestDataResponse<unknown>>;
  detailKeys?: string[];
  add: (payload: P) => Promise<ApiCudResponse>;
  update?: (id: number | string, payload: P) => Promise<ApiCudResponse>;
  remove?: (id: number | string) => Promise<ApiCudResponse>;
  getId: (row: T) => number | string | undefined;
  toValues: (row: T) => F;
  toPayload: (values: F) => P;
  clientSearch?: boolean;
  entityName: string;
};

export function useGuestCrud<T extends object, F extends FieldValues, P>({
  form,
  emptyValues,
  getList,
  getDetails,
  detailKeys = [],
  add,
  update,
  remove,
  getId,
  toValues,
  toPayload,
  clientSearch = false,
  entityName,
}: Config<T, F, P>) {
  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<T | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<T | null>(null);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const requestIdRef = useRef(0);

  const loadList = useCallback(
    async (filter = "") => {
      const requestId = ++requestIdRef.current;
      setLoading(true);
      try {
        const response = await getList(clientSearch ? "" : filter);
        if (requestId !== requestIdRef.current) return;
        if (isApiSuccess(response)) {
          const data = extractListRows<T>(
            response as unknown as Record<string, unknown>,
          );
          const query = filter.trim().toLowerCase();
          setRows(
            clientSearch && query
              ? data.filter((row) =>
                  Object.values(row).some((value) =>
                    String(value ?? "")
                      .toLowerCase()
                      .includes(query),
                  ),
                )
              : data,
          );
        } else {
          setRows([]);
          toast.error(apiMessage(response, `Unable to load ${entityName}`));
        }
      } finally {
        if (requestId === requestIdRef.current) {
          setLoading(false);
        }
      }
    },
    [clientSearch, entityName, getList],
  );

  useEffect(() => {
    let cancelled = false;
    const filter = search.trim();
    const timer = window.setTimeout(
      () => {
        if (cancelled) return;
        void loadList(filter);
      },
      filter ? 350 : 0,
    );
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [loadList, search]);

  const openCreate = () => {
    setEditingRow(null);
    form.reset(emptyValues);
    setDialogOpen(true);
  };

  const openEdit = async (row: T) => {
    let selected = row;
    if (getDetails) {
      const response = await getDetails(row);
      if (isApiSuccess(response)) {
        let next: T | null = null;
        for (const key of detailKeys) {
          const nested = response[key];
          if (nested && typeof nested === "object" && !Array.isArray(nested)) {
            next = nested as T;
            break;
          }
        }
        if (!next && response.data != null) {
          next = extractDetails<T>(response.data, detailKeys);
        }
        selected = next || row;
      } else {
        toast.error(apiMessage(response, "Unable to load details"));
      }
    }
    setEditingRow(selected);
    form.reset(toValues(selected));
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingRow(null);
    form.reset(emptyValues);
  };

  const handleSubmit = async (values: F) => {
    setSaving(true);
    try {
      const id = editingRow ? getId(editingRow) : undefined;
      const response =
        id !== undefined && update
          ? await update(id, toPayload(values))
          : await add(toPayload(values));
      if (isApiSuccess(response)) {
        setSuccessMessage(apiMessage(response, "Saved successfully."));
        setSuccessOpen(true);
        closeDialog();
        await loadList(search.trim());
      } else {
        toast.error(apiMessage(response, "Save failed"));
      }
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    const id = deleteTarget ? getId(deleteTarget) : undefined;
    if (id === undefined || !remove) return;
    setDeleting(true);
    try {
      const response = await remove(id);
      if (isApiSuccess(response)) {
        toast.success(apiMessage(response, "Completed successfully."));
        setDeleteTarget(null);
        await loadList(search.trim());
      } else {
        toast.error(apiMessage(response, "Action failed"));
      }
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
}
