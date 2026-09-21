import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type SidebarChildLink = {
  submenu_id: number;
  submenu_name: string;
  icon?: string | null;
  route: string;
  menu_sl?: number;
};

export type SidebarLink = {
  menu_id: number;
  menu_name: string;
  icon: string;
  route: string;
  sub_menus: SidebarChildLink[];
};

export type SidebarState = {
  sidebarData: SidebarLink[];
  loading: boolean;
};

const initialState: SidebarState = {
  sidebarData: [],
  loading: true,
};

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    setSidebarData: (state, action: PayloadAction<SidebarLink[]>) => {
      state.sidebarData = action.payload;
    },
    setSidebarLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setSidebarData, setSidebarLoading } = sidebarSlice.actions;
export default sidebarSlice.reducer;
