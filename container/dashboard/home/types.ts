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

export type DashboardDetails = {
  stats: DashboardStats | null;
  cashTrend: CashTrendPoint[];
  activity: unknown[];
};

export type DashboardApiResponse = {
  message: string;
  details: DashboardDetails;
};

export type DashboardState = {
  stats: DashboardStats | null;
  activity: unknown[];
  cashTrend: CashTrendPoint[];
  loading: boolean;
};

export type DashboardDataPayload = {
  stats?: DashboardStats | null;
  activity?: unknown[];
  cashTrend?: CashTrendPoint[];
};
