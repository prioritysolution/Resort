export type AppUser = {
  User_Id: number;
  Org_Id: number;
  Branch_Id: number;
  User_Name: string;
  Short_Name: string;
  User_Code: string;
  Is_Active: number;
  Status: string;
  Branch_Name?: string;
  Resort_Name?: string;
};

export type AppUserFormValues = {
  org_id: number | string;
  branch_id: number | string;
  user_name: string;
  short_name: string;
  user_code: string;
  password: string;
  is_active: boolean;
};

export type AppUserAddPayload = {
  org_id: number;
  branch_id: number;
  user_name: string;
  short_name: string;
  user_code: string;
  password: string;
};

export type AppUserUpdatePayload = {
  user_name: string;
  short_name: string;
  user_code: string;
  is_active: number;
};
