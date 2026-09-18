export type LoginFormValues = {
  user_code: string;
  password: string;
  rememberMe: boolean;
};

export type LoginUser = {
  user_id: number;
  org_id: number;
  branch_id: number;
  user_name: string;
  short_name: string;
  user_code: string;
  is_active: boolean;
  status: string;
  branch_code: string;
  branch_name: string;
  resort_name: string;
  org_schema: string;
  database_name: string;
};

export type LoginResponse = {
  message?: string;
  token?: string;
  token_type?: string;
  user?: LoginUser;
};

export type LoginRequest = {
  user_code: string;
  password: string;
};
