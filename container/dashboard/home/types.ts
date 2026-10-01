export type DashboardStats = {
  newBooking?: string | number;
  scheduleRoom?: string | number;
  checkIn?: string | number;
  checkOut?: string | number;
  bookingTrend?: string;
  scheduleTrend?: string;
  checkInTrend?: string;
  checkOutTrend?: string;
} & Record<string, string | number | undefined>;

export type CashTrendPoint = {
  day: string;
  amount: number;
};

export type DashboardToday = {
  occupied_rooms: number;
  vacant_rooms: number;
  total_rooms: number;
  in_house: number;
  in_house_guests: number;
  food_orders: number;
  food_amount: number;
  collection: number;
  arrivals: unknown[];
  departures: unknown[];
};

export type DashboardDetails = {
  stats: DashboardStats | null;
  cashTrend: CashTrendPoint[];
  activity?: unknown[];
  today?: DashboardToday | null;
};

export type DashboardApiResponse = {
  message: string;
  details: DashboardDetails;
};

export type DashboardState = {
  stats: DashboardStats | null;
  activity: unknown[];
  cashTrend: CashTrendPoint[];
  today: DashboardToday | null;
  loading: boolean;
};

export type DashboardDataPayload = {
  stats?: DashboardStats | null;
  activity?: unknown[];
  cashTrend?: CashTrendPoint[];
  today?: DashboardToday | null;
};
