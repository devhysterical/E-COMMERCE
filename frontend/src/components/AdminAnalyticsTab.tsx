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
import { useTranslation } from "react-i18next";
import { useTheme } from "../hooks/useTheme";
import {
  formatCurrency,
  formatDate,
  formatNumber,
  getLanguageTag,
} from "../utils/language";

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

const formatCompactAmount = (value: number, language: string) => {
  const locale = getLanguageTag(language);
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toLocaleString(locale, { maximumFractionDigits: 1 })}M`;
  }

  if (value >= 1_000) {
    return `${(value / 1_000).toLocaleString(locale, { maximumFractionDigits: 0 })}K`;
  }

  return value.toLocaleString(locale);
};

const formatShortDate = (dateStr: string, language: string) => {
  const formatted = formatDate(dateStr, language, {
    day: "numeric",
    month: "numeric",
  });
  return formatted.replace(/\s/g, "");
};

function PeriodSelector({
  value,
  onChange,
  labels,
}: {
  value: Period;
  onChange: (p: Period) => void;
  labels: Record<Period, string>;
}) {
  return (
    <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
      {(["7d", "30d", "90d"] as Period[]).map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
            value === p
              ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          }`}>
          {labels[p]}
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
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-700 p-5 shadow-sm">
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
      <p className="text-2xl font-black text-slate-900 dark:text-white">
        {value}
      </p>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{label}</p>
      {sub && (
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
          {sub}
        </p>
      )}
    </div>
  );
}

export default function AdminAnalyticsTab() {
  const { t, i18n } = useTranslation();
  const { resolvedTheme } = useTheme();
  const [revenuePeriod, setRevenuePeriod] = useState<Period>("30d");
  const [orderPeriod, setOrderPeriod] = useState<Period>("30d");
  const isDark = resolvedTheme === "dark";
  const language = i18n.resolvedLanguage ?? i18n.language;
  const periodLabels: Record<Period, string> = {
    "7d": t("admin.analytics.period.7d"),
    "30d": t("admin.analytics.period.30d"),
    "90d": t("admin.analytics.period.90d"),
  };
  const chartGridColor = isDark ? "#1e293b" : "#f1f5f9";
  const chartAxisColor = isDark ? "#64748b" : "#94a3b8";
  const tooltipStyle = {
    borderRadius: "12px",
    border: `1px solid ${isDark ? "#334155" : "#e2e8f0"}`,
    fontSize: "13px",
    backgroundColor: isDark ? "#0f172a" : "#ffffff",
    color: isDark ? "#e2e8f0" : "#0f172a",
  };

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
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <BarChart3 size={22} className="text-indigo-600" />
          {t("admin.analytics.title")}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {t("admin.analytics.subtitle")}
        </p>
      </div>

      {/* Conversion Stats Cards */}
      {conversionStats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label={t("admin.analytics.revenue30d")}
            value={formatCompactAmount(conversionStats.totalRevenue, language)}
            icon={TrendingUp}
            color="bg-indigo-500"
          />
          <StatCard
            label={t("admin.analytics.totalOrders")}
            value={formatNumber(conversionStats.totalOrders, language)}
            sub={`${t("admin.analytics.delivered")}: ${formatNumber(conversionStats.deliveredOrders, language)}`}
            icon={ShoppingCart}
            color="bg-emerald-500"
            trend={conversionStats.deliveryRate}
          />
          <StatCard
            label={t("admin.analytics.activeCarts")}
            value={formatNumber(conversionStats.activeCarts, language)}
            sub={`${t("admin.analytics.conversionRate")}: ${conversionStats.conversionRate}%`}
            icon={Package}
            color="bg-amber-500"
          />
          <StatCard
            label={t("admin.analytics.avgOrderValue")}
            value={formatCompactAmount(conversionStats.avgOrderValue, language)}
            sub={`${t("admin.analytics.cancellationRate")}: ${conversionStats.cancellationRate}%`}
            icon={Users}
            color="bg-rose-500"
          />
        </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-700 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <TrendingUp size={18} className="text-indigo-500" />
              {t("admin.analytics.revenue")}
            </h3>
            <PeriodSelector
              value={revenuePeriod}
              onChange={setRevenuePeriod}
              labels={periodLabels}
            />
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} />
              <XAxis
                dataKey="date"
                tickFormatter={(value) => formatShortDate(String(value), language)}
                fontSize={11}
                stroke={chartAxisColor}
              />
              <YAxis
                tickFormatter={(value) =>
                  formatCompactAmount(Number(value ?? 0), language)
                }
                fontSize={11}
                stroke={chartAxisColor}
                width={60}
              />
              <Tooltip
                formatter={(value: number | undefined) => [
                  formatCurrency(value ?? 0, language),
                  t("admin.analytics.revenue"),
                ]}
                labelFormatter={(label: unknown) => {
                  return formatDate(String(label), language);
                }}
                contentStyle={tooltipStyle}
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
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-700 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <ShoppingCart size={18} className="text-emerald-500" />
              {t("admin.analytics.orders")}
            </h3>
            <PeriodSelector
              value={orderPeriod}
              onChange={setOrderPeriod}
              labels={periodLabels}
            />
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={orderData}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} />
              <XAxis
                dataKey="date"
                tickFormatter={(value) => formatShortDate(String(value), language)}
                fontSize={11}
                stroke={chartAxisColor}
              />
              <YAxis fontSize={11} stroke={chartAxisColor} />
              <Tooltip
                labelFormatter={(label: unknown) => {
                  return formatDate(String(label), language);
                }}
                contentStyle={tooltipStyle}
              />
              <Legend />
              <Bar
                dataKey="total"
                name={t("admin.analytics.total")}
                fill="#6366f1"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="delivered"
                name={t("admin.analytics.delivered")}
                fill="#10b981"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="cancelled"
                name={t("admin.analytics.cancelled")}
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
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-700 p-5 shadow-sm">
          <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-4">
            <PieChartIcon size={18} className="text-amber-500" />
            {t("admin.analytics.revenueByCategory")}
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
                      formatCurrency(value ?? 0, language),
                      t("admin.analytics.revenue"),
                    ]}
                    contentStyle={tooltipStyle}
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
                    <span className="text-slate-600 dark:text-slate-300 truncate flex-1">
                      {cat.name}
                    </span>
                    <span className="font-bold text-slate-800 dark:text-white">
                      {formatCurrency(cat.revenue, language)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[220px] text-slate-400 dark:text-slate-500 text-sm">
              {t("admin.common.noData")}
            </div>
          )}
        </div>

        {/* Conversion Breakdown */}
        {conversionStats && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-700 p-5 shadow-sm">
            <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-4">
              <BarChart3 size={18} className="text-rose-500" />
              {t("admin.analytics.conversionMetrics")}
            </h3>
            <div className="space-y-4">
              {[
                {
                  label: t("admin.analytics.cartToOrder"),
                  value: conversionStats.conversionRate,
                  color: "bg-indigo-500",
                },
                {
                  label: t("admin.analytics.deliveryRate"),
                  value: conversionStats.deliveryRate,
                  color: "bg-emerald-500",
                },
                {
                  label: t("admin.analytics.cancellationRateLabel"),
                  value: conversionStats.cancellationRate,
                  color: "bg-red-500",
                },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600 dark:text-slate-300">{stat.label}</span>
                    <span className="font-bold text-slate-800 dark:text-white">
                      {stat.value}%
                    </span>
                  </div>
                  <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
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
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-700 p-5 shadow-sm">
          <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-4">
            <Package size={18} className="text-indigo-500" />
            {t("admin.analytics.topProducts")}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700">
                  <th className="text-left py-2 text-xs font-bold text-slate-400 uppercase">
                    {t("admin.analytics.product")}
                  </th>
                  <th className="text-right py-2 text-xs font-bold text-slate-400 uppercase">
                    {t("admin.analytics.sold")}
                  </th>
                  <th className="text-right py-2 text-xs font-bold text-slate-400 uppercase">
                    {t("admin.analytics.revenue")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                {topProducts.map((product, i) => (
                  <tr
                    key={product.productId}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/70">
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
                        <span className="font-medium text-slate-700 dark:text-slate-200 truncate max-w-[180px]">
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td className="text-right py-2.5 font-semibold text-slate-600 dark:text-slate-300">
                      {formatNumber(product.totalQuantity, language)}
                    </td>
                    <td className="text-right py-2.5 font-bold text-slate-800 dark:text-white">
                      {formatCurrency(product.totalRevenue, language)}
                    </td>
                  </tr>
                ))}
                {topProducts.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-slate-400 dark:text-slate-500">
                      {t("admin.common.noData")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Customers */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-700 p-5 shadow-sm">
          <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-4">
            <Users size={18} className="text-emerald-500" />
            {t("admin.analytics.topCustomers")}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700">
                  <th className="text-left py-2 text-xs font-bold text-slate-400 uppercase">
                    {t("admin.analytics.customer")}
                  </th>
                  <th className="text-right py-2 text-xs font-bold text-slate-400 uppercase">
                    {t("admin.analytics.orderCount")}
                  </th>
                  <th className="text-right py-2 text-xs font-bold text-slate-400 uppercase">
                    {t("admin.analytics.totalSpent")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                {topCustomers.map((customer, i) => (
                  <tr
                    key={customer.userId}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/70">
                    <td className="py-2.5">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-slate-400 w-5">
                          {i + 1}
                        </span>
                        <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center overflow-hidden">
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
                          <p className="font-medium text-slate-700 dark:text-slate-200 truncate max-w-[160px]">
                            {customer.fullName || t("common.notAvailable")}
                          </p>
                          <p className="text-xs text-slate-400 dark:text-slate-500 truncate max-w-[160px]">
                            {customer.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="text-right py-2.5 font-semibold text-slate-600 dark:text-slate-300">
                      {formatNumber(customer.orderCount, language)}
                    </td>
                    <td className="text-right py-2.5 font-bold text-slate-800 dark:text-white">
                      {formatCurrency(customer.totalSpent, language)}
                    </td>
                  </tr>
                ))}
                {topCustomers.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-slate-400 dark:text-slate-500">
                      {t("admin.common.noData")}
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
