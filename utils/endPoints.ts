const createApi = process.env.NEXT_PUBLIC_BASE_API_URL || "";

export const endPoints = {
  // Auth — Resort API
  login: `${createApi}/login`,
  menus: `${createApi}/menus`,

  // Room Type
  roomTypeList: `${createApi}/room-type/list`,
  roomTypeSearch: (keyword: string) =>
    `${createApi}/room-type/search?keyword=${encodeURIComponent(keyword || "")}`,
  roomTypeAdd: `${createApi}/room-type/add`,
  roomTypeUpdate: (id: number | string) =>
    `${createApi}/room-type/update/${id}`,
  roomTypeDelete: (id: number | string) =>
    `${createApi}/room-type/delete/${id}`,

  // Room Details
  roomDetailsList: (roomType?: number | string) =>
    roomType
      ? `${createApi}/room-details/list?room_type=${roomType}`
      : `${createApi}/room-details/list`,
  roomDetailsSearch: (keyword: string) =>
    `${createApi}/room-details/search?keyword=${encodeURIComponent(keyword || "")}`,
  roomDetailsAdd: `${createApi}/room-details/add`,
  roomDetailsUpdate: (id: number | string) =>
    `${createApi}/room-details/update/${id}`,
  roomDetailsDelete: (id: number | string) =>
    `${createApi}/room-details/delete/${id}`,

  // Menu Category
  menuCategoryList: `${createApi}/menu-category/list`,
  menuCategorySearch: (keyword: string) =>
    `${createApi}/menu-category/search?keyword=${encodeURIComponent(keyword || "")}`,
  menuCategoryAdd: `${createApi}/menu-category/add`,
  menuCategoryUpdate: (id: number | string) =>
    `${createApi}/menu-category/update/${id}`,
  menuCategoryDelete: (id: number | string) =>
    `${createApi}/menu-category/delete/${id}`,

  // Menu Details
  menuDetailsList: (categoryId?: number | string) =>
    categoryId
      ? `${createApi}/menu-details/list?category_id=${categoryId}`
      : `${createApi}/menu-details/list`,
  menuDetailsSearch: (keyword: string) =>
    `${createApi}/menu-details/search?keyword=${encodeURIComponent(keyword || "")}`,
  menuDetailsAdd: `${createApi}/menu-details/add`,
  menuDetailsUpdate: (id: number | string) =>
    `${createApi}/menu-details/update/${id}`,
  menuDetailsDelete: (id: number | string) =>
    `${createApi}/menu-details/delete/${id}`,

  // Paid Service
  paidServiceList: `${createApi}/paid-service/list`,
  paidServiceSearch: (keyword: string) =>
    `${createApi}/paid-service/search?keyword=${encodeURIComponent(keyword || "")}`,
  paidServiceAdd: `${createApi}/paid-service/add`,
  paidServiceUpdate: (id: number | string) =>
    `${createApi}/paid-service/update/${id}`,
  paidServiceDelete: (id: number | string) =>
    `${createApi}/paid-service/delete/${id}`,

  // Travel Agent
  travelAgentList: `${createApi}/travel-agent/list`,
  travelAgentSearch: (keyword: string) =>
    `${createApi}/travel-agent/search?keyword=${encodeURIComponent(keyword || "")}`,
  travelAgentAdd: `${createApi}/travel-agent/add`,
  travelAgentUpdate: (id: number | string) =>
    `${createApi}/travel-agent/update/${id}`,
  travelAgentDelete: (id: number | string) =>
    `${createApi}/travel-agent/delete/${id}`,

  // Staff Profile
  staffProfileList: `${createApi}/staff-profile/list`,
  staffProfileSearch: (keyword: string) =>
    `${createApi}/staff-profile/search?keyword=${encodeURIComponent(keyword || "")}`,
  staffProfileAdd: `${createApi}/staff-profile/add`,
  staffProfileUpdate: (id: number | string) =>
    `${createApi}/staff-profile/update/${id}`,
  staffProfileDelete: (id: number | string) =>
    `${createApi}/staff-profile/delete/${id}`,

  // Users
  usersList: `${createApi}/users/list`,
  usersSearch: (keyword: string) =>
    `${createApi}/users/search?keyword=${encodeURIComponent(keyword || "")}`,
  usersAdd: `${createApi}/users/add`,
  usersUpdate: (id: number | string) => `${createApi}/users/update/${id}`,
  usersDelete: (id: number | string) => `${createApi}/users/delete/${id}`,

  // Price Manager
  regularRateList: (roomTid?: number | string) =>
    roomTid
      ? `${createApi}/price-manager/regular/list?room_tid=${roomTid}`
      : `${createApi}/price-manager/regular/list`,
  regularRateSearch: (keyword: string) =>
    `${createApi}/price-manager/regular/search?keyword=${encodeURIComponent(keyword || "")}`,
  regularRateAdd: `${createApi}/price-manager/regular/add`,
  regularRateUpdate: (id: number | string) =>
    `${createApi}/price-manager/regular/update/${id}`,
  regularRateDelete: (id: number | string) =>
    `${createApi}/price-manager/regular/delete/${id}`,
  specialRateList: (roomTid?: number | string) =>
    roomTid
      ? `${createApi}/price-manager/special/list?room_tid=${roomTid}`
      : `${createApi}/price-manager/special/list`,
  specialRateSearch: (keyword: string) =>
    `${createApi}/price-manager/special/search?keyword=${encodeURIComponent(keyword || "")}`,
  specialRateAdd: `${createApi}/price-manager/special/add`,
  specialRateUpdate: (id: number | string) =>
    `${createApi}/price-manager/special/update/${id}`,
  specialRateDelete: (id: number | string) =>
    `${createApi}/price-manager/special/delete/${id}`,
} as const;
