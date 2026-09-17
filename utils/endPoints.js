const createApi = process.env.NEXT_PUBLIC_BASE_API_URL || "";

export const endPoints = {
  login: `${createApi}/Auth/Login`,
  signup: `${createApi}/Auth/Register`,
  logout: `${createApi}/Auth/Logout`,
  dashboardStats: (orgId) =>
    `${createApi}/Dashboard/Stats?org_id=${orgId}`,
  updateProfile: `${createApi}/Auth/UpdateProfile`,
};
