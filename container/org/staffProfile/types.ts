export type StaffProfile = {
  Staff_Id: number;
  Staff_Name: string;
  Nick_Name: string | null;
  Guardian_Name: string | null;
  Address: string | null;
  Cont_No: string | null;
  Gender_Cd: number;
  Age: string | null;
  Aadhar_No: string | null;
  Join_Date: string | null;
  Designation: string | null;
  Salary: string | number | null;
  Bank_Dtls: string | null;
  Remarks: string | null;
  Status: number;
  Release_Date: string | null;
};

export type StaffProfileFormValues = {
  staff_name: string;
  nick_name: string;
  guardian_name: string;
  address: string;
  cont_no: string;
  gender_cd: number | string;
  age: string;
  aadhar_no: string;
  join_date: Date | string | null;
  designation: string;
  salary: number | string;
  bank_dtls: string;
  remarks: string;
  release_date: Date | string | null;
  status: boolean;
};

export type StaffProfilePayload = {
  staff_name: string;
  nick_name?: string | null;
  guardian_name?: string | null;
  address?: string | null;
  cont_no?: string | null;
  gender_cd?: number;
  age?: string | null;
  aadhar_no?: string | null;
  join_date?: string | null;
  designation?: string | null;
  salary?: number | null;
  bank_dtls?: string | null;
  remarks?: string | null;
  release_date?: string | null;
  status?: number;
};
