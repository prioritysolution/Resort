import { doGetApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

const demoPayload = {
  message: "Data Found",
  details: {
    stats: {
      cashInHand: "₹ 18,42,500",
      deposits: "₹ 2.14 Cr",
      loans: "₹ 96.8 L",
      members: "1,284",
      cashTrend: "+4.2%",
      depositTrend: "+1.8%",
      loanTrend: "-0.6%",
      memberTrend: "+12",
    },
    cashTrend: [
      { day: "Mon", amount: 12.4 },
      { day: "Tue", amount: 13.1 },
      { day: "Wed", amount: 11.8 },
      { day: "Thu", amount: 14.6 },
      { day: "Fri", amount: 15.2 },
      { day: "Sat", amount: 16.4 },
      { day: "Sun", amount: 18.4 },
    ],
    activity: [
      {
        id: "TXN-2401",
        member: "Ramesh Kulkarni",
        type: "Deposit",
        amount: "₹ 25,000",
        status: "Posted",
      },
      {
        id: "TXN-2402",
        member: "Sneha Patil",
        type: "Loan EMI",
        amount: "₹ 8,450",
        status: "Posted",
      },
      {
        id: "TXN-2403",
        member: "Iqbal Shaikh",
        type: "Withdrawal",
        amount: "₹ 12,000",
        status: "Pending",
      },
      {
        id: "TXN-2404",
        member: "Meera Joshi",
        type: "Share",
        amount: "₹ 5,000",
        status: "Posted",
      },
      {
        id: "TXN-2405",
        member: "Arjun Nair",
        type: "Deposit",
        amount: "₹ 40,000",
        status: "Posted",
      },
    ],
  },
};

export const getDashboardStatsAPI = async (orgId) => {
  if (!process.env.NEXT_PUBLIC_BASE_API_URL) {
    return demoPayload;
  }
  return doGetApiCall({ url: endPoints.dashboardStats(orgId) });
};
