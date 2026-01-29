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
        fill="#606C38"
        fontWeight={700}
        fontSize={13}
        className="md:hidden"
      >
        {payload?.value}
      </text>
      <text
        x={0}
        y={0}
        dy={16}
        textAnchor="middle"
        fill="#606C38"
        fontWeight={700}
        fontSize={13}
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
    "#BC6C25", // Tiger
    "#DDA15E", // Earth
    "#606C38", // Dark
    "#283618", // Pakistan
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
          className="group cursor-pointer flex-1 min-w-[250px] relative p-6 rounded-3xl bg-white/40 backdrop-blur-xl shadow-lg hover:shadow-2xl hover:bg-white/60 transition-all duration-300"
        >
          <div className="flex justify-between items-center mb-4">
            <div className="p-3 rounded-2xl bg-[#BC6C25]/10 text-[#BC6C25]">
              <TrendingUp size={24} />
            </div>
            <span className="text-2xl font-black text-[#283618]">{year}</span>
          </div>
          <div>
            <p className="text-[#606C38] text-xs font-bold uppercase tracking-widest mb-1">
              Annual Revenue
            </p>
            <p className="text-2xl font-black text-[#BC6C25]">
              EGP {getYearTotal(year).toLocaleString()}
            </p>
          </div>
          <div className="mt-4 flex items-center gap-2 text-[#606C38] text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
            <span>View Details</span>
            <TrendingUp size={14} />
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
          className="group cursor-pointer flex-1 min-w-[250px] relative p-6 rounded-3xl bg-[#283618]/80 backdrop-blur-xl shadow-lg hover:shadow-2xl hover:bg-[#283618] transition-all duration-300 flex flex-col justify-center items-center text-center text-white"
        >
          <ArrowRightLeft size={32} className="mb-2 text-[#DDA15E]" />
          <p className="text-lg font-black uppercase tracking-widest">
            Compare Years
          </p>
          <p className="text-xs font-medium opacity-60">
            Compare performance over time
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
            className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white/50 border border-white/50 text-[#606C38] font-bold hover:bg-white/80 transition-all active:scale-95"
          >
            <ArrowBigLeft size={20} />
            Back to Overview
          </button>
          <div className="text-left md:text-right w-full md:w-auto">
            <h2 className="text-3xl font-black text-[#283618]">
              {year} Performance
            </h2>
            <p className="text-[#606C38] font-bold">
              Monthly breakdown of revenue
            </p>
          </div>
        </div>

        <div className="rounded-3xl shadow-xl p-4 bg-white/40 backdrop-blur-md border border-white/60">
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
                  tick={{ fill: "#606C38", fontSize: 13, fontWeight: 700 }}
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
                  fill="#BC6C25"
                  radius={[10, 10, 0, 0]}
                  animationDuration={1500}
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
            className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white/50 border border-white/50 text-[#606C38] font-bold hover:bg-white/80 transition-all active:scale-95"
          >
            <ArrowBigLeft size={20} />
            Back to Overview
          </button>
          <div className="text-left md:text-right w-full md:w-auto">
            <h2 className="text-3xl font-black text-[#283618]">
              {y2} vs {y1}
            </h2>
            <p className="text-[#606C38] font-bold">Comparative analysis</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white/40 backdrop-blur-md text-center">
            <p className="text-[#606C38] text-xs font-black uppercase tracking-widest mb-1">
              {y2} Revenue
            </p>
            <p className="text-3xl font-black text-[#283618]">
              EGP {total2.toLocaleString()}
            </p>
          </div>
          <div className="p-6 rounded-3xl bg-[#BC6C25] text-white shadow-xl flex flex-col justify-center items-center">
            <p className="text-xs font-black uppercase tracking-widest mb-1 opacity-80">
              Growth
            </p>
            <div className="flex items-center gap-2">
              <span className="text-4xl font-black">
                {growth > 0 ? "+" : ""}
                {growth.toFixed(1)}%
              </span>
              <TrendingUp size={32} />
            </div>
          </div>
          <div className="p-6 rounded-3xl bg-white/40 backdrop-blur-md text-center">
            <p className="text-[#606C38] text-xs font-black uppercase tracking-widest mb-1">
              {y1} Revenue
            </p>
            <p className="text-3xl font-black text-[#283618]">
              EGP {total1.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="rounded-3xl shadow-xl p-6 bg-white/40 backdrop-blur-md border border-white/60">
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
                  tick={{ fill: "#606C38" }}
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
                  fill="#DDA15E"
                  radius={[10, 10, 0, 0]}
                  animationDuration={1500}
                />
                <Bar
                  dataKey={y1}
                  fill="#BC6C25"
                  radius={[10, 10, 0, 0]}
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
        <div className="flex justify-center items-center h-screen bg-[#FEFAE0]">
          <div className="flex gap-2 text-[#BC6C25] font-bold text-xl">
            <div>An error occurred while fetching data. Try again.</div>
          </div>
        </div>
      ) : (
        <div
          data-testid="dashboard-container"
          className="p-4 md:p-8 min-h-screen space-y-8 bg-[#FEFAE0] overflow-x-hidden"
        >
          {/* Header */}
          <div className="relative mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-5xl font-black text-[#283618] mb-2 font-display tracking-tight">
                Dashboard Overview
              </h1>
              <p className="text-[#606C38] font-medium tracking-widest uppercase text-xs md:text-sm opacity-80">
                Welcome back to your control center
              </p>
            </div>
            {!selectedYear && !compareYear && (
              <div className="bg-[#BC6C25]/10 px-4 py-3 rounded-2xl border border-[#BC6C25]/20 w-full md:w-auto">
                <p className="text-[#BC6C25] font-black text-xs uppercase tracking-tighter mb-1">
                  Current Stats
                </p>
                <p className="text-[#283618] font-bold text-lg">
                  {new Date().getFullYear()} Target: EGP 10M
                </p>
              </div>
            )}
          </div>

          {/* Totals Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {totalsCards?.map((item, i) => (
              <div
                key={i}
                data-testid="stat-card"
                className="group relative p-6 rounded-3xl bg-white/40 backdrop-blur-xl border border-white/50 shadow-lg hover:shadow-2xl hover:bg-white/60 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                  {/* Giant Background Icon */}
                  {React.cloneElement(
                    item.icon as React.ReactElement<{ size: number | string }>,
                    {
                      size: 100,
                    },
                  )}
                </div>

                <div className="relative z-10 flex flex-col items-start gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-white/50 text-[#BC6C25] shadow-sm relative">
                      {item.icon}
                      {item.length !== undefined && (
                        <span className="absolute -top-2 -right-2 bg-[#BC6C25] text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm">
                          {item.length}
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-[#606C38] text-sm font-bold uppercase tracking-wider mb-1">
                      {item.title}
                    </h3>
                    <p className="text-4xl font-black text-[#283618]">
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
            <div className="rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-4 sm:p-6 bg-white/40 backdrop-blur-md border border-white/60">
              <h3 className="text-xl font-black mb-6 flex items-center gap-3 text-[#283618]">
                <div className="p-2 rounded-xl bg-[#BC6C25]/10 text-[#BC6C25]">
                  <PieIcon size={20} />
                </div>
                Discounts Overview
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
                      cornerRadius={8}
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
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        borderRadius: "16px",
                        border: "none",
                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                        color: "#283618",
                        fontWeight: "bold",
                      }}
                      itemStyle={{ color: "#283618" }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      iconType="circle"
                      formatter={(value) => (
                        <span className="text-[#606C38] font-bold ml-1">
                          {value}
                        </span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Order Status Chart */}
            <div className="rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-4 sm:p-6 bg-white/40 backdrop-blur-md border border-white/60">
              <h3 className="text-xl font-black mb-6 flex items-center gap-3 text-[#283618]">
                <div className="p-2 rounded-xl bg-[#BC6C25]/10 text-[#BC6C25]">
                  <TrendingUp size={20} />
                </div>
                Orders Status
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
                      tick={{ fill: "#606C38", fontWeight: 700, fontSize: 12 }}
                      interval={0}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#606C38", fontSize: 12, fontWeight: 700 }}
                    />
                    <Tooltip
                      cursor={{ fill: "#BC6C25", opacity: 0.1 }}
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        borderRadius: "16px",
                        border: "none",
                        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                        color: "#283618",
                        fontWeight: "bold",
                      }}
                    />
                    <Bar
                      dataKey="value"
                      radius={[10, 10, 0, 0]}
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
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-xl bg-[#BC6C25]/10 text-[#BC6C25]">
                    <TrendingUp size={20} />
                  </div>
                  <h3 className="text-xl font-black text-[#283618]">
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
            <div className="rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-4 sm:p-6 bg-white/40 backdrop-blur-md border border-white/60">
              <h3 className="text-xl font-black mb-6 flex items-center gap-3 text-[#283618]">
                <div className="p-2 rounded-xl bg-[#BC6C25]/10 text-[#BC6C25]">
                  <Users size={20} />
                </div>
                Top Customers
              </h3>

              <div className="overflow-hidden rounded-2xl border border-[#283618]/5">
                <table className="min-w-full text-left">
                  <thead>
                    <tr className="bg-[#283618]/5">
                      <th className="p-4 text-xs font-black uppercase tracking-widest text-[#606C38]">
                        Customer
                      </th>
                      <th className="p-4 text-xs font-black uppercase tracking-widest text-[#606C38] text-right">
                        Orders
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#283618]/5 bg-white/30">
                    {topCustomers?.map((item: TopCustomerItem, i: number) => (
                      <tr
                        key={i}
                        className="hover:bg-white/50 transition-colors duration-200"
                      >
                        <td className="p-4 font-bold text-[#283618]">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#DDA15E] flex items-center justify-center text-white font-bold text-xs shadow-inner">
                              {item.email.charAt(0).toUpperCase()}
                            </div>
                            {item.email}
                          </div>
                        </td>
                        <td className="p-4 font-black text-[#BC6C25] text-right text-lg">
                          {item.count}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Profits & Costs */}
            <div className="rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-4 sm:p-6 bg-white/40 backdrop-blur-md border border-white/60">
              <h3 className="text-xl font-black mb-6 flex items-center gap-3 text-[#283618]">
                <div className="p-2 rounded-xl bg-[#BC6C25]/10 text-[#BC6C25]">
                  <DollarSign size={20} />
                </div>
                Financial Overview
              </h3>

              <div className="space-y-4">
                {[
                  {
                    label: "Wholesale",
                    value: costs?.totalWholesalePrice,
                    color: "#DDA15E",
                  },
                  {
                    label: "Marketing",
                    value: costs?.totalMarketingCosts,
                    color: "#DDA15E",
                  },
                  {
                    label: "Packaging",
                    value: costs?.totalPackagingCost,
                    color: "#DDA15E",
                  },
                  {
                    label: "Delivery",
                    value: costs?.deliveryPrice,
                    color: "#DDA15E",
                  },
                  {
                    label: "Net Profit",
                    value: costs?.totalNetProfit,
                    color: "#16a34a",
                    highlight: true,
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-4 rounded-2xl ${
                      item.highlight
                        ? "bg-green-100/50 border border-green-200"
                        : "bg-white/30 hover:bg-white/50 transition-colors border border-transparent hover:border-white/50"
                    }`}
                  >
                    <span className="font-bold text-[#606C38] uppercase text-xs tracking-widest">
                      {item.label}
                    </span>
                    <span
                      className={`text-xl font-black ${
                        item.highlight ? "text-green-600" : "text-[#283618]"
                      }`}
                    >
                      EGP {item.value?.toLocaleString()}
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
