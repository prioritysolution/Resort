export type MenuCategory = {
  Category_Id: number;
  Categ_Name: string;
  Status: number;
};

export type MenuCategoryFormValues = {
  categ_name: string;
  status: boolean;
};

export type MenuCategoryPayload = {
  categ_name: string;
  status?: number;
};
