import React from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  PieChart as PieIcon,
  TrendingUp,
  BarChart3,
  Users,
  ShoppingBag,
  DollarSign,
  ArrowBigLeft,
  ArrowRightLeft,
} from "lucide-react";
import { useGetDashboardOrdersQuery } from "../../redux/Orders/apiOrders";
import Loading from "../Loading";

/**
 * Dashboard: Main administrative overview showing key metrics and system status.
 * لوحة التحكم: نظرة إدارية عامة تعرض المؤشرات الرئيسية وحالة النظام.
 */
interface OrderByStatusItem {
  status: string;
  count: number;
}

interface TopCustomerItem {
  email: string;
  count: number;
}

interface DashboardStats {
  totals: {
    totalOrders?: number;
    totalToday?: number;
    totalYesterday?: number;
    totalWeek?: number;
    totalMonth?: number;
    totalYear?: number;
    ordersLength?: number;
  };
  discounts: {
    withDiscount?: number;
    withoutDiscount?: number;
  };
  changes: {
    daily?: string;
    weekly?: string;
    monthly?: string;
    yearly?: string;
  };
  ordersByStatus: OrderByStatusItem[];
  topCustomers: TopCustomerItem[];
  costs: {
    totalWholesalePrice?: number;
    totalMarketingCosts?: number;
    totalPackagingCost?: number;
    deliveryPrice?: number;
    totalNetProfit?: number;
  };
  monthlyStats: {
    [year: string]: number[];
  };
}

//  * لوحة التحكم: نظرة إدارية عامة تعرض المؤشرات الرئيسية وحالة النظام.

const monthNames = [
  "Jan 1",
  "Feb 2",
  "Mar 3",
  "Apr 4",
  "May 5",
  "Jun 6",
  "Jul 7",
  "Aug 8",
  "Sep 9",
  "Oct 10",
  "Nov 11",
  "Dec 12",
];

interface CustomTickProps {
  x?: number;
  y?: number;
  payload?: {
    value: string | number;
  };
}

const CustomTick = (props: CustomTickProps) => {
  const { x, y, payload } = props;
  const index = Number(payload?.value) - 1;
  const name = monthNames[index];

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={16}
        textAnchor="middle"
        fill="#1A1A1A"
        fontWeight={700}
        fontSize={11}
        className="md:hidden"
      >
        {payload?.value}
      </text>
      <text
        x={0}
        y={0}
        dy={16}
        textAnchor="middle"
        fill="#1A1A1A"
        fontWeight={700}
        fontSize={11}
        className="hidden md:block"
      >
        {name}
      </text>
    </g>
  );
};

export default function Dashboard() {
  const {
    data: dashboardOrders,
    isLoading,
    isError,
  } = useGetDashboardOrdersQuery({});

  const stats = (dashboardOrders?.stats || {}) as DashboardStats;

  const {
    totals = {},
    discounts = {},
    ordersByStatus = [],
    topCustomers = [],
    costs = {},
    monthlyStats = {},
  } = stats;
  const COLORS = [
    "#1A1A1A", // Soft Black (--color-dark)
    "#E5E5E5", // Light Gray
    "#444444", // Secondary Text (--color-pakistan)
    "#EEEEEE", // Border color
  ];

  // Totals Cards
  const totalsCards = [
    {
      title: "Total Orders",
      value: totals.totalOrders,
      length: totals.ordersLength,
      icon: <ShoppingBag />,
    },
    { title: "Today Orders", value: totals.totalToday, icon: <TrendingUp /> },
    {
      title: "Yesterday",
      value: totals.totalYesterday,
      icon: <BarChart3 />,
    },
    { title: "This Week", value: totals.totalWeek, icon: <PieIcon /> },
    { title: "This Month", value: totals.totalMonth, icon: <BarChart3 /> },
    { title: "This Year", value: totals.totalYear, icon: <TrendingUp /> },
  ];

  // Pie Chart
  const pieData = [
    { name: "With Discount", value: discounts.withDiscount },
    { name: "Without Discount", value: discounts.withoutDiscount },
  ];

  // Status Chart Data
  const deliveredCount =
    ordersByStatus.find((i) => i.status === "Delivered")?.count || 0;
  const canceledCount =
    ordersByStatus.find((i) => i.status === "Canceled")?.count || 0;
  const visaPaidCount =
    ordersByStatus.find((i) => i.status === "Paid")?.count || 0;

  const statusData = [
    {
      name: "Delivered",
      value: deliveredCount,
      color: "#16a34a",
      fill: "#dcfce7",
    }, // Green-600 stroke, Green-100 fill
    {
      name: "Canceled",
      value: canceledCount,
      color: "#dc2626",
      fill: "#fee2e2",
    }, // Red-600 stroke, Red-100 fill
    {
      name: "Visa Paid",
      value: visaPaidCount,
      color: "#3b82f6",
      fill: "#dbeafe",
    }, // Blue-500 stroke, Blue-100 fill
  ];

  const [selectedYear, setSelectedYear] = React.useState<string | null>(null);
  const [compareYear, setCompareYear] = React.useState<string | null>(null);

  const years = Object.keys(monthlyStats).sort((a, b) => Number(b) - Number(a));

  const getYearTotal = (year: string) => {
    return monthlyStats[year]?.reduce((acc, curr) => acc + curr, 0) || 0;
  };

  const getMonthlyData = (year: string) => {
    return (
      monthlyStats[year]?.map((val, idx) => ({
        month: `${idx + 1}`,
        name: monthNames[idx],
        value: val,
      })) || []
    );
  };

  const renderYearGrid = () => (
    <div className="flex flex-wrap gap-6 mb-10">
      {years.map((year) => (
        <div
          key={year}
          onClick={() => setSelectedYear(year)}
          className="group cursor-pointer flex-1 min-w-[250px] relative p-8 rounded-none bg-white border border-(--color-border) hover:border-(--color-dark) transition-all duration-300"
        >
          <div className="flex justify-between items-center mb-6">
            <div className="p-3 bg-(--color-gray-soft) text-(--color-dark)">
              <TrendingUp size={20} />
            </div>
            <span className="text-xl font-black text-(--color-dark) tracking-tighter">
              {year}
            </span>
          </div>
          <div>
            <p className="text-(--color-pakistan) text-[10px] font-bold uppercase tracking-[0.2em] mb-2">
              Annual Revenue
            </p>
            <p className="text-2xl font-black text-(--color-dark)">
              EGP {getYearTotal(year).toLocaleString()}
            </p>
          </div>
          <div className="mt-6 flex items-center gap-2 text-(--color-dark) text-[11px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
            <span>Details</span>
            <TrendingUp size={12} />
          </div>
        </div>
      ))}

      {years.length > 1 && (
        <div
          onClick={() => {
            if (years.length >= 2) {
              setSelectedYear(years[0]);
              setCompareYear(years[1]);
            }
          }}
          className="group cursor-pointer flex-1 min-w-[250px] relative p-8 rounded-none bg-(--color-dark) shadow-lg hover:bg-black transition-all duration-300 flex flex-col justify-center items-center text-center text-white"
        >
          <ArrowRightLeft size={24} className="mb-3 text-white/50" />
          <p className="text-sm font-black uppercase tracking-[0.2em]">
            Compare
          </p>
          <p className="text-[10px] font-medium opacity-40 uppercase tracking-widest mt-1">
            Historical Analysis
          </p>
        </div>
      )}
    </div>
  );

  const renderYearDetail = (year: string) => {
    const data = getMonthlyData(year);
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <button
            onClick={() => {
              setSelectedYear(null);
              setCompareYear(null);
            }}
            className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-3 rounded-none bg-white border border-(--color-dark) text-(--color-dark) font-bold uppercase text-[11px] tracking-widest hover:bg-(--color-dark) hover:text-white transition-all active:scale-95"
          >
            <ArrowBigLeft size={16} />
            BACK
          </button>
          <div className="text-left md:text-right w-full md:w-auto">
            <h2 className="text-2xl font-black text-(--color-dark) uppercase tracking-tight">
              {year} DETAIL
            </h2>
            <p className="text-(--color-pakistan) text-[10px] uppercase font-bold tracking-[0.2em] mt-1 space-x-2">
              <span>MONTHLY PERFORMANCE</span>
            </p>
          </div>
        </div>

        <div className="rounded-none shadow-sm p-6 bg-white border border-(--color-border)">
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ left: -20, right: 0, top: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#000"
                  strokeOpacity={0.05}
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={true}
                  tick={<CustomTick />}
                  interval={0}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#1A1A1A", fontSize: 11, fontWeight: 700 }}
                  tickFormatter={(val) => `${val.toLocaleString()}`}
                />
                <Tooltip
                  cursor={{ fill: "#BC6C25", opacity: 0.1 }}
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    borderRadius: "16px",
                    border: "none",
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Bar
                  dataKey="value"
                  fill="#1A1A1A"
                  radius={[0, 0, 0, 0]}
                  animationDuration={1500}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };

  const renderComparison = (y1: string, y2: string) => {
    const data1 = getMonthlyData(y1);
    const data2 = getMonthlyData(y2);
    const total1 = getYearTotal(y1);
    const total2 = getYearTotal(y2);
    const growth = total1 !== 0 ? ((total1 - total2) / total2) * 100 : 0;

    const chartData = data1.map((item, idx) => ({
      month: item.month,
      name: item.name,
      [y1]: item.value,
      [y2]: data2[idx].value,
    }));

    return (
      <div className="space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <button
            onClick={() => {
              setSelectedYear(null);
              setCompareYear(null);
            }}
            className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-3 rounded-none bg-white border border-(--color-dark) text-(--color-dark) font-bold uppercase text-[11px] tracking-widest hover:bg-(--color-dark) hover:text-white transition-all active:scale-95"
          >
            <ArrowBigLeft size={16} />
            BACK
          </button>
          <div className="text-left md:text-right w-full md:w-auto">
            <h2 className="text-2xl font-black text-(--color-dark) uppercase tracking-tight">
              {y2} vs {y1}
            </h2>
            <p className="text-(--color-pakistan) text-[10px] uppercase font-bold tracking-[0.2em] mt-1">
              COMPARATIVE ANALYSIS
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-none bg-white border border-(--color-border) text-center">
            <p className="text-(--color-pakistan) text-[10px] font-black uppercase tracking-[0.2em] mb-2">
              {y2} REVENUE
            </p>
            <p className="text-2xl font-black text-(--color-dark)">
              EGP {total2.toLocaleString()}
            </p>
          </div>
          <div className="p-8 rounded-none bg-(--color-dark) text-white shadow-lg flex flex-col justify-center items-center">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 opacity-60">
              GROWTH
            </p>
            <div className="flex items-center gap-3">
              <span className="text-3xl font-black">
                {growth > 0 ? "+" : ""}
                {growth.toFixed(1)}%
              </span>
              <TrendingUp size={24} />
            </div>
          </div>
          <div className="p-8 rounded-none bg-white border border-(--color-border) text-center">
            <p className="text-(--color-pakistan) text-[10px] font-black uppercase tracking-[0.2em] mb-2">
              {y1} REVENUE
            </p>
            <p className="text-2xl font-black text-(--color-dark)">
              EGP {total1.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="rounded-none shadow-sm p-8 bg-white border border-(--color-border)">
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ left: -20, right: 0, top: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#000"
                  strokeOpacity={0.05}
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={true}
                  tick={<CustomTick />}
                  interval={0}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#1A1A1A", fontSize: 11, fontWeight: 700 }}
                />
                <Tooltip
                  cursor={{ fill: "#BC6C25", opacity: 0.1 }}
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    borderRadius: "16px",
                    border: "none",
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Legend />
                <Bar
                  dataKey={y2}
                  fill="#E5E5E5"
                  radius={[0, 0, 0, 0]}
                  animationDuration={1500}
                />
                <Bar
                  dataKey={y1}
                  fill="#1A1A1A"
                  radius={[0, 0, 0, 0]}
                  animationDuration={1500}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };
  return (
    <>
      {isLoading ? (
        <Loading />
      ) : isError && (!dashboardOrders || !dashboardOrders.stats) ? (
        <div className="flex justify-center items-center h-screen bg-white">
          <div className="flex flex-col items-center gap-4 text-(--color-dark)">
            <p className="font-bold uppercase tracking-[0.2em] text-xs">
              An error occurred while fetching data
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 border border-(--color-dark) text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all"
            >
              Retry
            </button>
          </div>
        </div>
      ) : (
        <div
          data-testid="dashboard-container"
          className="p-4 md:p-12 min-h-screen space-y-12 bg-white overflow-x-hidden"
        >
          {/* Header */}
          <div className="relative mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-5xl font-black text-(--color-dark) mb-3 uppercase tracking-tighter">
                DASHBOARD
              </h1>
              <p className="text-(--color-pakistan) font-bold tracking-[0.3em] uppercase text-[10px] opacity-60">
                Administrative Control Center
              </p>
            </div>
            {!selectedYear && !compareYear && (
              <div className="bg-(--color-gray-soft) px-6 py-4 rounded-none border border-(--color-border) w-full md:w-auto">
                <p className="text-(--color-dark) font-black text-[10px] uppercase tracking-[0.2em] mb-2 opacity-40">
                  ANNUAL TARGET
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-black text-(--color-dark)">
                    EGP 10M
                  </span>
                  <span className="text-[10px] font-bold text-(--color-pakistan) uppercase tracking-widest">
                    Target
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Totals Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {totalsCards?.map((item, i) => (
              <div
                key={i}
                data-testid="stat-card"
                className="group relative p-8 rounded-none bg-white border border-(--color-border) hover:border-(--color-dark) transition-all duration-300"
              >
                <div className="relative z-10 flex flex-col items-start gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-(--color-gray-soft) text-(--color-dark) relative">
                      {item.icon}
                      {item.length !== undefined && (
                        <span className="absolute -top-1.5 -right-1.5 bg-(--color-dark) text-white text-[9px] font-black px-1.5 py-0.5 rounded-none shadow-sm">
                          {item.length}
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-(--color-pakistan) text-[10px] font-bold uppercase tracking-[0.2em] mb-2 opacity-60">
                      {item.title}
                    </h3>
                    <p className="text-3xl font-black text-(--color-dark)">
                      {item.value || 0}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie Chart */}
            <div className="rounded-none shadow-sm p-8 bg-white border border-(--color-border)">
              <h3 className="text-sm font-black mb-8 flex items-center gap-3 text-(--color-dark) uppercase tracking-[0.2em]">
                <div className="p-2 bg-(--color-gray-soft) text-(--color-dark)">
                  <PieIcon size={16} />
                </div>
                Discounts
              </h3>

              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={100}
                      paddingAngle={5}
                      cornerRadius={0}
                    >
                      {pieData?.map((_, index) => (
                        <Cell
                          key={index}
                          fill={COLORS[index % COLORS.length]}
                          stroke="transparent"
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        borderRadius: "0px",
                        border: "1px solid #EEEEEE",
                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05)",
                        color: "#1A1A1A",
                        fontWeight: "bold",
                        fontSize: "11px",
                      }}
                      itemStyle={{ color: "#1A1A1A", textTransform: "uppercase" }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      iconType="rect"
                      formatter={(value) => (
                        <span className="text-(--color-pakistan) font-bold ml-1 text-[10px] uppercase tracking-widest">
                          {value}
                        </span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Order Status Chart */}
            <div className="rounded-none shadow-sm p-8 bg-white border border-(--color-border)">
              <h3 className="text-sm font-black mb-8 flex items-center gap-3 text-(--color-dark) uppercase tracking-[0.2em]">
                <div className="p-2 bg-(--color-gray-soft) text-(--color-dark)">
                  <TrendingUp size={16} />
                </div>
                Order Status
              </h3>

              <div className="h-[300px] w-full" style={{ minHeight: "300px" }}>
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <BarChart
                    data={statusData}
                    margin={{ left: -20, right: 0, top: 0, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#000"
                      strokeOpacity={0.05}
                      vertical={false}
                    />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#1A1A1A", fontWeight: 700, fontSize: 10 }}
                      interval={0}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#1A1A1A", fontSize: 10, fontWeight: 700 }}
                    />
                    <Tooltip
                      cursor={{ fill: "#1A1A1A", opacity: 0.05 }}
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        borderRadius: "0px",
                        border: "1px solid #EEEEEE",
                        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.05)",
                        color: "#1A1A1A",
                        fontWeight: "bold",
                        fontSize: "11px",
                      }}
                    />
                    <Bar
                      dataKey="value"
                      radius={[0, 0, 0, 0]}
                      animationDuration={1500}
                      barSize={40}
                    >
                      {statusData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.fill}
                          stroke={entry.color}
                          strokeWidth={2}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Year Over Year Stats */}
          <div className="space-y-6">
            {!selectedYear && !compareYear && (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-(--color-gray-soft) text-(--color-dark)">
                    <TrendingUp size={16} />
                  </div>
                  <h3 className="text-sm font-black text-(--color-dark) uppercase tracking-[0.2em]">
                    Annual Performance
                  </h3>
                </div>
                {renderYearGrid()}
              </>
            )}

            {selectedYear && !compareYear && renderYearDetail(selectedYear)}

            {selectedYear &&
              compareYear &&
              renderComparison(selectedYear, compareYear)}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Customers */}
            <div className="rounded-none shadow-sm p-8 bg-white border border-(--color-border)">
              <h3 className="text-sm font-black mb-8 flex items-center gap-3 text-(--color-dark) uppercase tracking-[0.2em]">
                <div className="p-2 bg-(--color-gray-soft) text-(--color-dark)">
                  <Users size={16} />
                </div>
                Top Customers
              </h3>

              <div className="overflow-hidden rounded-none border border-(--color-border)">
                <table className="min-w-full text-left">
                  <thead>
                    <tr className="bg-(--color-gray-soft)">
                      <th className="p-4 text-[10px] font-black uppercase tracking-[0.2em] text-(--color-pakistan)">
                        Customer
                      </th>
                      <th className="p-4 text-[10px] font-black uppercase tracking-[0.2em] text-(--color-pakistan) text-right">
                        Orders
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-(--color-border) bg-white">
                    {topCustomers?.map((item: TopCustomerItem, i: number) => (
                      <tr
                        key={i}
                        className="hover:bg-white/50 transition-colors duration-200"
                      >
                        <td className="p-4 font-bold text-(--color-dark) text-[11px]">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-none bg-(--color-dark) flex items-center justify-center text-white font-bold text-xs">
                              {item.email.charAt(0).toUpperCase()}
                            </div>
                            {item.email}
                          </div>
                        </td>
                        <td className="p-4 font-black text-(--color-dark) text-right text-lg tracking-tighter">
                          {item.count}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Profits & Costs */}
            <div className="rounded-none shadow-sm p-8 bg-white border border-(--color-border)">
              <h3 className="text-sm font-black mb-8 flex items-center gap-3 text-(--color-dark) uppercase tracking-[0.2em]">
                <div className="p-2 bg-(--color-gray-soft) text-(--color-dark)">
                  <DollarSign size={16} />
                </div>
                Financials
              </h3>

              <div className="space-y-4">
                {[
                  {
                    label: "Wholesale",
                    value: costs?.totalWholesalePrice,
                  },
                  {
                    label: "Marketing",
                    value: costs?.totalMarketingCosts,
                  },
                  {
                    label: "Packaging",
                    value: costs?.totalPackagingCost,
                  },
                  {
                    label: "Delivery",
                    value: costs?.deliveryPrice,
                  },
                  {
                    label: "Net Profit",
                    value: costs?.totalNetProfit,
                    highlight: true,
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-5 rounded-none ${
                        item.highlight
                          ? "bg-(--color-gray-soft) border-l-4 border-black"
                          : "bg-white hover:bg-(--color-gray-soft) transition-colors border border-(--color-border)"
                      }`}
                  >
                    <span className="font-bold text-(--color-pakistan) uppercase text-[10px] tracking-[0.2em]">
                      {item.label}
                    </span>
                    <span className="text-xl font-black text-(--color-dark) tracking-tighter">
                      EGP {item.value?.toLocaleString() || 0}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
