export type MenuDetail = {
  Item_Id: number;
  Category_Id: number;
  Categ_Name: string;
  Menu_Code: number | null;
  Menu_Name: string;
  Menu_ShortNm: string | null;
  Menu_Desc: string | null;
  Rate: string | number;
  Status: number;
};

export type MenuDetailFormValues = {
  category_id: number | string;
  menu_code: number | string;
  menu_name: string;
  menu_shortnm: string;
  menu_desc: string;
  rate: number | string;
  status: boolean;
};

export type MenuDetailPayload = {
  category_id: number;
  menu_code?: number;
  menu_name: string;
  menu_shortnm?: string;
  menu_desc?: string;
  rate: number;
  status?: number;
};
