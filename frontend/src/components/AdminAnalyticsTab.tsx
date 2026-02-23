import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  AnalyticsService,
  type RevenueDataPoint,
  type OrderDataPoint,
  type TopProduct,
  type TopCustomer,
  type CategoryBreakdown,
  type ConversionStats,
} from "../services/api.service";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  TrendingUp,
  ShoppingCart,
  Package,
  Users,
  BarChart3,
  PieChart as PieChartIcon,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

type Period = "7d" | "30d" | "90d";

const COLORS = [
  "#6366f1",
  "#f59e0b",
  "#10b981",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
];

const formatVND = (value: number) => {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
  return value.toLocaleString("vi-VN");
};

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return `${d.getDate()}/${d.getMonth() + 1}`;
};

function PeriodSelector({
  value,
  onChange,
}: {
  value: Period;
  onChange: (p: Period) => void;
}) {
  return (
    <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
      {(["7d", "30d", "90d"] as Period[]).map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
            value === p
              ? "bg-white text-indigo-600 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}>
          {p === "7d" ? "7 ngày" : p === "30d" ? "30 ngày" : "90 ngày"}
        </button>
      ))}
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  color,
  trend,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ElementType;
  color: string;
  trend?: number;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={20} className="text-white" />
        </div>
        {trend !== undefined && (
          <span
            className={`flex items-center gap-1 text-xs font-bold ${
              trend >= 0 ? "text-green-600" : "text-red-500"
            }`}>
            {trend >= 0 ? (
              <ArrowUpRight size={14} />
            ) : (
              <ArrowDownRight size={14} />
            )}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="text-2xl font-black text-slate-900">{value}</p>
      <p className="text-sm text-slate-500 mt-1">{label}</p>
      {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
    </div>
  );
}

export default function AdminAnalyticsTab() {
  const [revenuePeriod, setRevenuePeriod] = useState<Period>("30d");
  const [orderPeriod, setOrderPeriod] = useState<Period>("30d");

  const { data: revenueData = [] } = useQuery<RevenueDataPoint[]>({
    queryKey: ["analytics-revenue", revenuePeriod],
    queryFn: () => AnalyticsService.getRevenueChart(revenuePeriod),
  });

  const { data: orderData = [] } = useQuery<OrderDataPoint[]>({
    queryKey: ["analytics-orders", orderPeriod],
    queryFn: () => AnalyticsService.getOrderChart(orderPeriod),
  });

  const { data: topProducts = [] } = useQuery<TopProduct[]>({
    queryKey: ["analytics-top-products"],
    queryFn: () => AnalyticsService.getTopProducts(10),
  });

  const { data: topCustomers = [] } = useQuery<TopCustomer[]>({
    queryKey: ["analytics-top-customers"],
    queryFn: () => AnalyticsService.getTopCustomers(10),
  });

  const { data: categoryData = [] } = useQuery<CategoryBreakdown[]>({
    queryKey: ["analytics-categories"],
    queryFn: AnalyticsService.getCategoryBreakdown,
  });

  const { data: conversionStats } = useQuery<ConversionStats>({
    queryKey: ["analytics-conversion"],
    queryFn: AnalyticsService.getConversionStats,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <BarChart3 size={22} className="text-indigo-600" />
          Bảng thống kê
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Thống kê doanh thu, đơn hàng và khách hàng
        </p>
      </div>

      {/* Conversion Stats Cards */}
      {conversionStats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Doanh thu (30 ngày)"
            value={`${formatVND(conversionStats.totalRevenue)}đ`}
            icon={TrendingUp}
            color="bg-indigo-500"
          />
          <StatCard
            label="Tổng đơn hàng"
            value={String(conversionStats.totalOrders)}
            sub={`Đã giao: ${conversionStats.deliveredOrders}`}
            icon={ShoppingCart}
            color="bg-emerald-500"
            trend={conversionStats.deliveryRate}
          />
          <StatCard
            label="Giỏ hàng đang hoạt động"
            value={String(conversionStats.activeCarts)}
            sub={`Tỷ lệ chuyển đổi: ${conversionStats.conversionRate}%`}
            icon={Package}
            color="bg-amber-500"
          />
          <StatCard
            label="Giá trị đơn trung bình"
            value={`${formatVND(conversionStats.avgOrderValue)}đ`}
            sub={`Tỷ lệ huỷ: ${conversionStats.cancellationRate}%`}
            icon={Users}
            color="bg-rose-500"
          />
        </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <TrendingUp size={18} className="text-indigo-500" />
              Doanh thu
            </h3>
            <PeriodSelector value={revenuePeriod} onChange={setRevenuePeriod} />
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                fontSize={11}
                stroke="#94a3b8"
              />
              <YAxis
                tickFormatter={formatVND}
                fontSize={11}
                stroke="#94a3b8"
                width={60}
              />
              <Tooltip
                formatter={(value: number | undefined) => [
                  `${(value ?? 0).toLocaleString("vi-VN")}đ`,
                  "Doanh thu",
                ]}
                labelFormatter={(label: unknown) => {
                  const d = new Date(String(label));
                  return d.toLocaleDateString("vi-VN");
                }}
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  fontSize: "13px",
                }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#6366f1"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, fill: "#6366f1" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Orders Chart */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <ShoppingCart size={18} className="text-emerald-500" />
              Don hang
            </h3>
            <PeriodSelector value={orderPeriod} onChange={setOrderPeriod} />
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={orderData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                fontSize={11}
                stroke="#94a3b8"
              />
              <YAxis fontSize={11} stroke="#94a3b8" />
              <Tooltip
                labelFormatter={(label: unknown) => {
                  const d = new Date(String(label));
                  return d.toLocaleDateString("vi-VN");
                }}
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  fontSize: "13px",
                }}
              />
              <Legend />
              <Bar
                dataKey="total"
                name="Tổng"
                fill="#6366f1"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="delivered"
                name="Đã giao"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="cancelled"
                name="Đã huỷ"
                fill="#ef4444"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category & Conversion Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Pie Chart */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
            <PieChartIcon size={18} className="text-amber-500" />
            Doanh thu theo danh mục
          </h3>
          {categoryData.length > 0 ? (
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="50%" height={220}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={90}
                    dataKey="revenue"
                    nameKey="name"
                    paddingAngle={2}>
                    {categoryData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number | undefined) => [
                      `${(value ?? 0).toLocaleString("vi-VN")}đ`,
                      "Doanh thu",
                    ]}
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid #e2e8f0",
                      fontSize: "13px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {categoryData.slice(0, 6).map((cat, i) => (
                  <div
                    key={cat.categoryId}
                    className="flex items-center gap-2 text-sm">
                    <div
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{
                        backgroundColor: COLORS[i % COLORS.length],
                      }}
                    />
                    <span className="text-slate-600 truncate flex-1">
                      {cat.name}
                    </span>
                    <span className="font-bold text-slate-800">
                      {formatVND(cat.revenue)}đ
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[220px] text-slate-400 text-sm">
              Chưa có dữ liệu
            </div>
          )}
        </div>

        {/* Conversion Breakdown */}
        {conversionStats && (
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
              <BarChart3 size={18} className="text-rose-500" />
              Chỉ số chuyển đổi
            </h3>
            <div className="space-y-4">
              {[
                {
                  label: "Tỷ lệ chuyển đổi (Giỏ hàng → Đơn hàng)",
                  value: conversionStats.conversionRate,
                  color: "bg-indigo-500",
                },
                {
                  label: "Tỷ lệ giao thành công",
                  value: conversionStats.deliveryRate,
                  color: "bg-emerald-500",
                },
                {
                  label: "Tỷ lệ huỷ đơn",
                  value: conversionStats.cancellationRate,
                  color: "bg-red-500",
                },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600">{stat.label}</span>
                    <span className="font-bold text-slate-800">
                      {stat.value}%
                    </span>
                  </div>
                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${stat.color} transition-all duration-500`}
                      style={{ width: `${Math.min(stat.value, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
            <Package size={18} className="text-indigo-500" />
            Top sản phẩm bán chạy
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left py-2 text-xs font-bold text-slate-400 uppercase">
                    Sản phẩm
                  </th>
                  <th className="text-right py-2 text-xs font-bold text-slate-400 uppercase">
                    Đã bán
                  </th>
                  <th className="text-right py-2 text-xs font-bold text-slate-400 uppercase">
                    Doanh thu
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {topProducts.map((product, i) => (
                  <tr key={product.productId} className="hover:bg-slate-50/50">
                    <td className="py-2.5">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-slate-400 w-5">
                          {i + 1}
                        </span>
                        {product.imageUrl && (
                          <img
                            src={product.imageUrl}
                            alt=""
                            className="w-8 h-8 rounded-lg object-cover"
                          />
                        )}
                        <span className="font-medium text-slate-700 truncate max-w-[180px]">
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td className="text-right py-2.5 font-semibold text-slate-600">
                      {product.totalQuantity}
                    </td>
                    <td className="text-right py-2.5 font-bold text-slate-800">
                      {formatVND(product.totalRevenue)}đ
                    </td>
                  </tr>
                ))}
                {topProducts.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-slate-400">
                      Chưa có dữ liệu
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Customers */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
            <Users size={18} className="text-emerald-500" />
            Top khách hàng
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left py-2 text-xs font-bold text-slate-400 uppercase">
                    Khách hàng
                  </th>
                  <th className="text-right py-2 text-xs font-bold text-slate-400 uppercase">
                    Đơn hàng
                  </th>
                  <th className="text-right py-2 text-xs font-bold text-slate-400 uppercase">
                    Tổng chi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {topCustomers.map((customer, i) => (
                  <tr key={customer.userId} className="hover:bg-slate-50/50">
                    <td className="py-2.5">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-slate-400 w-5">
                          {i + 1}
                        </span>
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden">
                          {customer.avatarUrl ? (
                            <img
                              src={customer.avatarUrl}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-xs font-bold text-indigo-600">
                              {(customer.fullName ||
                                customer.email ||
                                "?")[0].toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-slate-700 truncate max-w-[160px]">
                            {customer.fullName || "N/A"}
                          </p>
                          <p className="text-xs text-slate-400 truncate max-w-[160px]">
                            {customer.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="text-right py-2.5 font-semibold text-slate-600">
                      {customer.orderCount}
                    </td>
                    <td className="text-right py-2.5 font-bold text-slate-800">
                      {formatVND(customer.totalSpent)}đ
                    </td>
                  </tr>
                ))}
                {topCustomers.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-slate-400">
                      Chưa có dữ liệu
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
