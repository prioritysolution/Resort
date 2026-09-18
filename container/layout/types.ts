export type ApiSubMenu = {
  menu_sl?: number;
  submenu_id: number;
  submenu_name: string;
  icon?: string | null;
  route?: string | null;
};

export type ApiMenu = {
  menu_id: number;
  menu_name: string;
  icon?: string | null;
  route?: string | null;
  sub_menus?: ApiSubMenu[];
};

export type MenusApiResponse = {
  message?: string;
  menus?: ApiMenu[];
  Error_Code?: number;
  Message?: string;
};
