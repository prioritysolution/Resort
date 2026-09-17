import { createSlice } from "@reduxjs/toolkit";

/**
 * Sidebar menu mirrored from DB grid:
 * Menu_Id / Menu_Name / SubMenu_Name / Route / Status=1
 * Maps to: title, path, childLinks[{ Menue_Name, Page_Allies }]
 */
const initialSidebarData = [
  {
    title: "Dashboard",
    path: "/dashboard",
    Icon: "MdDashboard",
    menuId: 1,
    childLinks: [],
  },
  {
    title: "Organization Setup",
    path: "",
    Icon: "MdBusiness",
    menuId: 2,
    childLinks: [
      { Menue_Name: "Room Type", Page_Allies: "/org/room-type", SubMenu_Id: 1 },
      {
        Menue_Name: "Room Details",
        Page_Allies: "/org/room-details",
        SubMenu_Id: 2,
      },
      {
        Menue_Name: "Price Manager",
        Page_Allies: "/org/price-manager",
        SubMenu_Id: 3,
      },
      {
        Menue_Name: "Menu Category",
        Page_Allies: "/org/menu-category",
        SubMenu_Id: 4,
      },
      {
        Menue_Name: "Menu Details",
        Page_Allies: "/org/menu-details",
        SubMenu_Id: 5,
      },
      {
        Menue_Name: "Paid Service",
        Page_Allies: "/org/paid-service",
        SubMenu_Id: 6,
      },
      {
        Menue_Name: "Travel Agent",
        Page_Allies: "/org/travel-agent",
        SubMenu_Id: 7,
      },
      {
        Menue_Name: "Staff Profile",
        Page_Allies: "/org/staff-profile",
        SubMenu_Id: 8,
      },
      { Menue_Name: "Users", Page_Allies: "/org/users", SubMenu_Id: 9 },
      {
        Menue_Name: "Coupon Manager",
        Page_Allies: "/org/coupon-manager",
        SubMenu_Id: 10,
      },
    ],
  },
  {
    title: "Guest",
    path: "",
    Icon: "MdPeople",
    menuId: 3,
    childLinks: [
      { Menue_Name: "Booking", Page_Allies: "/booking/list", SubMenu_Id: 1 },
      {
        Menue_Name: "Reservation",
        Page_Allies: "/reservation/list",
        SubMenu_Id: 2,
      },
      {
        Menue_Name: "Add Payments",
        Page_Allies: "/guest/add-payments",
        SubMenu_Id: 3,
      },
      {
        Menue_Name: "Food Order",
        Page_Allies: "/guest/food-order",
        SubMenu_Id: 4,
      },
      {
        Menue_Name: "Service Order",
        Page_Allies: "/guest/service-order",
        SubMenu_Id: 5,
      },
      {
        Menue_Name: "Checkout & Billing",
        Page_Allies: "/guest/checkout-billing",
        SubMenu_Id: 6,
      },
      {
        Menue_Name: "Invoices",
        Page_Allies: "/guest/invoices",
        SubMenu_Id: 7,
      },
    ],
  },
  {
    title: "Reports",
    path: "",
    Icon: "MdAssessment",
    menuId: 4,
    childLinks: [
      {
        Menue_Name: "Booking Register",
        Page_Allies: "/reports/booking-register",
        SubMenu_Id: 1,
      },
      {
        Menue_Name: "Reservation Register",
        Page_Allies: "/reports/reservation-register",
        SubMenu_Id: 2,
      },
      {
        Menue_Name: "Collection Ledger",
        Page_Allies: "/reports/collection-ledger",
        SubMenu_Id: 3,
      },
      {
        Menue_Name: "Agent Commission",
        Page_Allies: "/reports/agent-commission",
        SubMenu_Id: 4,
      },
    ],
  },
];

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState: {
    sidebarData: initialSidebarData,
    loading: false,
  },
  reducers: {
    setSidebarData: (state, action) => {
      state.sidebarData = action.payload;
    },
    setSidebarLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setSidebarData, setSidebarLoading } = sidebarSlice.actions;
export default sidebarSlice.reducer;
