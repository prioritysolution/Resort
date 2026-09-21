"use client";
import { useEffect, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import { useGuestCrud } from "@/container/guest/shared/useGuestCrud";
import { isApiSuccess } from "@/container/guest/shared/types";
import { getMenuDetailsListAPI } from "@/container/org/menuDetails/MenuDetailsApis";
import { getRoomDetailsListAPI } from "@/container/org/roomDetails/RoomDetailsApis";
import { getStaffProfileListAPI } from "@/container/org/staffProfile/StaffProfileApis";
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
  reservation_no: yup.string().required(),
  order_date: yup.mixed<string | Date>().nullable().default(""),
  order_time: yup.string().default(""),
  room_service: yup.boolean().required(),
  room_id: yup.mixed().default(""),
  special_ins: yup.string().max(100).default(""),
  items: yup
    .array()
    .of(
      yup.object({
        menu_id: yup.mixed().required(),
        quantity: yup.number().integer().min(1).required(),
      }),
    )
    .min(1)
    .required(),
});
export function useFoodOrder() {
  const form = useForm<FoodOrderFormValues>({
    resolver: yupResolver(schema) as unknown as Resolver<FoodOrderFormValues>,
    defaultValues: emptyValues,
  });
  const [menus, setMenus] = useState<Array<{ Id: number; Name: string }>>([]);
  const [rooms, setRooms] = useState<Array<{ Id: number; Name: string }>>([]);
  const [staff, setStaff] = useState<Array<{ Id: number; Name: string }>>([]);
  useEffect(() => {
    void Promise.all([
      getMenuDetailsListAPI(),
      getRoomDetailsListAPI(),
      getStaffProfileListAPI(),
    ]).then(([m, r, s]) => {
      setMenus(
        (m.data || [])
          .filter((x) => Number(x.Status) === 1)
          .map((x) => ({ Id: x.Item_Id, Name: x.Menu_Name })),
      );
      setRooms(
        (r.data || [])
          .filter((x) => Number(x.Status) === 1)
          .map((x) => ({ Id: x.Room_Id, Name: x.Room_No })),
      );
      setStaff(
        (s.data || [])
          .filter((x) => Number(x.Status) === 1)
          .map((x) => ({ Id: x.Staff_Id, Name: x.Staff_Name })),
      );
    });
  }, []);
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
      const orderDate = toApiDate(v.order_date);
      return {
        reservation_no: v.reservation_no.trim(),
        ...(orderDate ? { order_date: orderDate } : {}),
        ...(v.order_time ? { order_time: v.order_time } : {}),
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
