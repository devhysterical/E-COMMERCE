import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import {
  ProductService,
  CategoryService,
  AdminService,
} from "../services/api.service";
import { toast } from "react-toastify";
import { formatCurrency } from "../utils/language";
import AdminBannersTab from "../components/AdminBannersTab";
import AdminCouponsTab from "../components/AdminCouponsTab";
import AdminShippingTab from "../components/AdminShippingTab";
import AdminAnalyticsTab from "../components/AdminAnalyticsTab";
import AdminFlashSaleTab from "../components/AdminFlashSaleTab";
import AdminLoyaltyTab from "../components/AdminLoyaltyTab";
import AdminContactTab from "../components/AdminContactTab";
import AdminProductsTab from "../components/AdminProductsTab";
import AdminOrdersTab from "../components/AdminOrdersTab";
import AdminCategoriesTab from "../components/AdminCategoriesTab";
import AdminUsersTab from "../components/AdminUsersTab";
import LowStockAlert from "../components/LowStockAlert";
import {
  Package,
  LayoutGrid,
  Users,
  DollarSign,
  ShoppingBag,
  Truck,
  Download,
  Image,
  BarChart3,
  Zap,
  Crown,
  MessageSquare,
} from "lucide-react";

type TabType =
  | "products"
  | "orders"
  | "users"
  | "categories"
  | "banners"
  | "coupons"
  | "shipping"
  | "flash-sale"
  | "loyalty"
  | "analytics"
  | "contact";

const AdminDashboard = () => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>("products");

  // Stats queries
  const { data: productsData } = useQuery({
    queryKey: ["admin-products"],
    queryFn: () => ProductService.getAll({ limit: 100 }),
  });
  const products = productsData?.data || [];

  const { data: categories = [] } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: CategoryService.getAll,
  });

  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: AdminService.getStats,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white italic uppercase tracking-tighter">
          {t("admin.dashboard.title")}
        </h1>
        <div className="flex items-center gap-3">
          {/* Export Dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 dark:shadow-none">
              <Download size={18} /> {t("admin.dashboard.export")}
            </button>
            <div className="absolute right-0 top-full mt-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 min-w-48">
              <button
                onClick={async () => {
                  try {
                    const { ReportsService } =
                      await import("../services/api.service");
                    await ReportsService.exportOrders();
                    toast.success(t("admin.dashboard.exportSuccess"));
                  } catch {
                    toast.error(t("admin.dashboard.exportFailed"));
                  }
                }}
                className="flex items-center gap-2 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-t-xl text-slate-700 dark:text-slate-200 font-medium w-full text-left"
              >
                <ShoppingBag size={16} className="text-blue-500" />
                {t("admin.dashboard.exportOrders")}
              </button>
              <button
                onClick={async () => {
                  try {
                    const { ReportsService } =
                      await import("../services/api.service");
                    await ReportsService.exportProducts();
                    toast.success(t("admin.dashboard.exportSuccess"));
                  } catch {
                    toast.error(t("admin.dashboard.exportFailed"));
                  }
                }}
                className="flex items-center gap-2 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-b-xl text-slate-700 dark:text-slate-200 font-medium w-full text-left"
              >
                <Package size={16} className="text-indigo-500" />
                {t("admin.dashboard.exportProducts")}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400 mb-2">
            <DollarSign size={20} className="text-green-500" />
            <span className="text-sm font-bold uppercase tracking-wider">
              {t("admin.dashboard.stats.totalRevenue")}
            </span>
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white">
            {formatCurrency(stats?.totalRevenue || 0, i18n.language)}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400 mb-2">
            <ShoppingBag size={20} className="text-blue-500" />
            <span className="text-sm font-bold uppercase tracking-wider">
              {t("admin.dashboard.stats.totalOrders")}
            </span>
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white">
            {stats?.totalOrders || 0}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400 mb-2">
            <Package size={20} className="text-indigo-500" />
            <span className="text-sm font-bold uppercase tracking-wider">
              {t("admin.dashboard.stats.totalProducts")}
            </span>
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white">
            {products.length}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400 mb-2">
            <LayoutGrid size={20} className="text-purple-500" />
            <span className="text-sm font-bold uppercase tracking-wider">
              {t("admin.dashboard.stats.totalUsers")}
            </span>
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white">
            {categories.length}
          </p>
        </div>
      </div>

      {/* Low Stock Alert */}
      <div className="mb-8">
        <LowStockAlert
          threshold={10}
          onViewProducts={() => setActiveTab("products")}
        />
      </div>

      {/* Tabs + Content Layout */}
      <div className="flex gap-6">
        {/* Sidebar Tabs */}
        <div className="flex flex-col gap-1.5 w-52 shrink-0">
          {(
            [
              { key: "products", labelKey: "products", icon: <Package size={18} /> },
              { key: "orders", labelKey: "orders", icon: <ShoppingBag size={18} /> },
              { key: "categories", labelKey: "categories", icon: <LayoutGrid size={18} /> },
              { key: "users", labelKey: "users", icon: <Users size={18} /> },
              { key: "banners", labelKey: "banners", icon: <Image size={18} /> },
              { key: "coupons", labelKey: "coupons", icon: <DollarSign size={18} /> },
              { key: "shipping", labelKey: "shipping", icon: <Truck size={18} /> },
              { key: "analytics", labelKey: "analytics", icon: <BarChart3 size={18} /> },
              { key: "flash-sale", labelKey: "flashSale", icon: <Zap size={18} /> },
              { key: "loyalty", labelKey: "loyalty", icon: <Crown size={18} /> },
              { key: "contact", labelKey: "contact", icon: <MessageSquare size={18} /> },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2.5 px-4 py-3 rounded-xl font-bold text-sm transition-all text-left ${
                activeTab === tab.key
                  ? "bg-slate-900 text-white shadow-lg"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-700"
              }`}
            >
              {tab.icon}
              {t(`admin.dashboard.tabs.${tab.labelKey}`)}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden min-w-0">
          {activeTab === "products" && <AdminProductsTab />}
          {activeTab === "orders" && <AdminOrdersTab />}
          {activeTab === "categories" && <AdminCategoriesTab />}
          {activeTab === "users" && <AdminUsersTab />}
          {activeTab === "banners" && (
            <div className="p-6">
              <AdminBannersTab />
            </div>
          )}
          {activeTab === "coupons" && (
            <div className="p-6">
              <AdminCouponsTab />
            </div>
          )}
          {activeTab === "shipping" && (
            <div className="p-6">
              <AdminShippingTab />
            </div>
          )}
          {activeTab === "analytics" && (
            <div className="p-6">
              <AdminAnalyticsTab />
            </div>
          )}
          {activeTab === "flash-sale" && <AdminFlashSaleTab />}
          {activeTab === "loyalty" && (
            <div className="p-6">
              <AdminLoyaltyTab />
            </div>
          )}
          {activeTab === "contact" && <AdminContactTab />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
