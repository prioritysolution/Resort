import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type SidebarChildLink = {
  Menue_Name: string;
  Page_Allies: string;
  SubMenu_Id?: number;
};

export type SidebarLink = {
  title: string;
  path: string;
  Icon: string;
  menuId: number;
  childLinks: SidebarChildLink[];
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
