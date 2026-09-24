"use client";
import { useCallback, useEffect, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import { useGuestCrud } from "@/container/guest/shared/useGuestCrud";
import { apiMessage, isApiSuccess } from "@/container/guest/shared/types";
import { getMenuDetailsListAPI } from "@/container/org/menuDetails/MenuDetailsApis";
import { getStaffProfileListAPI } from "@/container/org/staffProfile/StaffProfileApis";
import { getReservationDetailsAPI } from "@/container/guest/reservation/ReservationApis";
import {
  addFoodOrderAPI,
  deleteFoodOrderAPI,
  getFoodOrderDetailsAPI,
  getFoodOrderListAPI,
  updateFoodOrderAPI,
} from "./FoodOrderApis";
import type { FoodOrder, FoodOrderFormValues, FoodOrderPayload } from "./types";
import { format, isValid } from "date-fns";

const toApiDate = (value: Date | string | null | undefined) => {
  if (!value) return "";
  if (value instanceof Date) {
    return isValid(value) ? format(value, "yyyy-MM-dd") : "";
  }
  const parsed = new Date(String(value));
  return isValid(parsed) ? format(parsed, "yyyy-MM-dd") : String(value);
};

const emptyValues: FoodOrderFormValues = {
  reservation_no: "",
  order_date: "",
  order_time: "",
  room_service: false,
  room_id: "",
  special_ins: "",
  items: [{ menu_id: "", quantity: 1 }],
};
const schema = yup.object({
  reservation_no: yup.string().trim(),
  order_date: yup.mixed<string | Date>().nullable().default(""),
  order_time: yup.string().default(""),
  room_service: yup.boolean().required(),
  room_id: yup.mixed().default("").required("Room is required"),
  special_ins: yup.string().max(100).default(""),
  items: yup
    .array()
    .of(
      yup.object({
        menu_id: yup.mixed().required("Menu item is required"),
        quantity: yup
          .number()
          .integer()
          .min(1, "Quantity must be at least 1")
          .required("Quantity is required"),
      }),
    )
    .min(1, "Add at least one item")
    .required("Add at least one item"),
});
export function useFoodOrder() {
  const form = useForm<FoodOrderFormValues>({
    resolver: yupResolver(schema) as unknown as Resolver<FoodOrderFormValues>,
    defaultValues: emptyValues,
    mode: "onSubmit",
    reValidateMode: "onChange",
  });
  const [menus, setMenus] = useState<Array<{ Id: number; Name: string }>>([]);
  const [rooms, setRooms] = useState<Array<{ Id: number; Name: string }>>([]);
  const [staff, setStaff] = useState<Array<{ Id: number; Name: string }>>([]);
  const reservationNo = form.watch("reservation_no");

  const loadReservationRooms = useCallback(
    async (reservationNoValue: string) => {
      const response = await getReservationDetailsAPI(reservationNoValue);
      if (!isApiSuccess(response)) {
        return {
          ok: false as const,
          message: apiMessage(response, "Reservation not found"),
        };
      }

      const data =
        response.data &&
        typeof response.data === "object" &&
        !Array.isArray(response.data)
          ? (response.data as Record<string, unknown>)
          : {};
      const fromData = Array.isArray(data.rooms)
        ? data.rooms
        : Array.isArray(data.Rooms)
          ? data.Rooms
          : [];
      const fromRoot = Array.isArray(response.rooms) ? response.rooms : [];
      const seen = new Set<number>();
      const options = [...fromData, ...fromRoot]
        .map((row) => {
          if (!row || typeof row !== "object") return null;
          const record = row as Record<string, unknown>;
          const id = Number(record.room_id ?? record.Room_Id);
          if (!Number.isFinite(id) || id <= 0 || seen.has(id)) return null;
          seen.add(id);
          const roomNo = String(record.room_no ?? record.Room_No ?? "").trim();
          const roomType = String(
            record.room_type ?? record.Room_TName ?? "",
          ).trim();
          const name = [roomNo, roomType].filter(Boolean).join(" — ");
          return { Id: id, Name: name || `Room ${id}` };
        })
        .filter((row): row is { Id: number; Name: string } => row != null);

      return { ok: true as const, options };
    },
    [],
  );

  useEffect(() => {
    void Promise.all([getMenuDetailsListAPI(), getStaffProfileListAPI()]).then(
      ([m, s]) => {
        setMenus(
          (m.data || [])
            .filter((x) => Number(x.Status) === 1)
            .map((x) => ({ Id: x.Item_Id, Name: x.Menu_Name })),
        );
        setStaff(
          (s.data || [])
            .filter((x) => Number(x.Status) === 1)
            .map((x) => ({ Id: x.Staff_Id, Name: x.Staff_Name })),
        );
      },
    );
  }, []);

  useEffect(() => {
    const value = String(reservationNo || "").trim();
    if (!value) {
      setRooms([]);
      form.setValue("room_id", "", { shouldValidate: false });
      return;
    }

    let cancelled = false;
    const timer = window.setTimeout(() => {
      void (async () => {
        const result = await loadReservationRooms(value);
        if (cancelled) return;
        if (!result.ok) {
          setRooms([]);
          form.setValue("room_id", "", { shouldValidate: false });
          toast.error(result.message);
          return;
        }
        setRooms(result.options);
        const current = form.getValues("room_id");
        const stillValid = result.options.some(
          (row) => String(row.Id) === String(current),
        );
        if (result.options.length === 1) {
          form.setValue("room_id", result.options[0].Id, {
            shouldValidate: false,
          });
        } else if (!stillValid) {
          form.setValue("room_id", "", { shouldValidate: false });
        }
      })();
    }, 400);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [form, loadReservationRooms, reservationNo]);
  const crud = useGuestCrud<FoodOrder, FoodOrderFormValues, FoodOrderPayload>({
    form,
    emptyValues,
    getList: getFoodOrderListAPI,
    getDetails: (r) =>
      getFoodOrderDetailsAPI(r.Food_Ord_Id || r.FoodOrd_Id || ""),
    detailKeys: ["food_order", "order"],
    add: addFoodOrderAPI,
    update: updateFoodOrderAPI,
    remove: deleteFoodOrderAPI,
    getId: (r) => r.Food_Ord_Id || r.FoodOrd_Id,
    entityName: "food orders",
    toValues: (r) => ({
      reservation_no: r.Reservation_No || "",
      order_date: r.Order_Date || "",
      order_time: r.Order_Time || "",
      room_service: Boolean(r.Room_Service),
      room_id: r.Room_Id || "",
      special_ins: r.Special_Ins || "",
      items: (r.Items || r.items || []).map((x) => ({
        menu_id: x.Menu_Id || x.Item_Id || x.menu_id || "",
        quantity: x.Quantity || x.quantity || 1,
      })) || [{ menu_id: "", quantity: 1 }],
    }),
    toPayload: (v) => {
      const now = new Date();
      const orderDate = toApiDate(v.order_date) || format(now, "yyyy-MM-dd");
      const orderTime =
        String(v.order_time || "").trim() || format(now, "HH:mm");
      return {
        reservation_no: v.reservation_no.trim(),
        order_date: orderDate,
        order_time: orderTime,
        room_service: v.room_service,
        ...(v.room_id ? { room_id: Number(v.room_id) } : {}),
        ...(v.special_ins.trim() ? { special_ins: v.special_ins.trim() } : {}),
        items: v.items.map((x) => ({
          menu_id: Number(x.menu_id),
          quantity: Number(x.quantity),
        })),
      };
    },
  });
  const markDelivered = async (row: FoodOrder) => {
    const id = row.Food_Ord_Id || row.FoodOrd_Id;
    if (!id) return;
    const response = await updateFoodOrderAPI(id, {
      order_status: 1,
      delivered_by: staff[0]?.Id,
      special_ins: row.Special_Ins || "Delivered",
    });
    if (isApiSuccess(response)) {
      toast.success(response.Message || "Marked delivered");
      crud.reload();
    } else toast.error(response.Message || response.message || "Update failed");
  };
  return { ...crud, menus, rooms, staff, markDelivered };
}
