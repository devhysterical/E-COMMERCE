import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ProductService,
  CategoryService,
  AdminService,
  UploadService,
} from "../services/api.service";
import { toast } from "react-toastify";
import type { Product, Order, UserProfile } from "../services/api.service";
import AdminBannersTab from "../components/AdminBannersTab";
import AdminCouponsTab from "../components/AdminCouponsTab";
import AdminShippingTab from "../components/AdminShippingTab";
import AdminAnalyticsTab from "../components/AdminAnalyticsTab";
import AdminFlashSaleTab from "../components/AdminFlashSaleTab";
import LowStockAlert from "../components/LowStockAlert";
import {
  Plus,
  Edit,
  Trash2,
  Package,
  LayoutGrid,
  Users,
  DollarSign,
  ShoppingBag,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  Loader,
  X,
  Save,
  Upload,
  Eye,
  Download,
  MapPin,
  Phone,
  Image,
  BarChart3,
  Zap,
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
  | "analytics";

const statusConfig: Record<
  string,
  { label: string; color: string; icon: React.ReactNode }
> = {
  PENDING: {
    label: "Chờ xử lý",
    color: "bg-yellow-100 text-yellow-700",
    icon: <Clock size={14} />,
  },
  PROCESSING: {
    label: "Đang xử lý",
    color: "bg-blue-100 text-blue-700",
    icon: <Loader size={14} />,
  },
  SHIPPED: {
    label: "Đang giao",
    color: "bg-indigo-100 text-indigo-700",
    icon: <Truck size={14} />,
  },
  DELIVERED: {
    label: "Đã giao",
    color: "bg-green-100 text-green-700",
    icon: <CheckCircle size={14} />,
  },
  CANCELLED: {
    label: "Đã hủy",
    color: "bg-red-100 text-red-700",
    icon: <XCircle size={14} />,
  },
};

const AdminDashboard = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<TabType>("products");
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<{
    id: string;
    name: string;
    description?: string;
  } | null>(null);

  // Queries
  const { data: productsData } = useQuery({
    queryKey: ["admin-products"],
    queryFn: () => ProductService.getAll({ limit: 100 }),
  });
  const products = productsData?.data || [];

  const { data: categories = [] } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: CategoryService.getAll,
  });

  const { data: orders = [] } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: AdminService.getAllOrders,
    enabled: activeTab === "orders",
  });

  const { data: users = [] } = useQuery({
    queryKey: ["admin-users"],
    queryFn: AdminService.getAllUsers,
    enabled: activeTab === "users",
  });

  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: AdminService.getStats,
  });

  // Mutations
  const createProductMutation = useMutation({
    mutationFn: ProductService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      setShowProductModal(false);
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<{
        name: string;
        description: string;
        price: number;
        stock: number;
        imageUrl: string;
        categoryId: string;
      }>;
    }) => ProductService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      setShowProductModal(false);
      setEditingProduct(null);
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: ProductService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
  });

  const updateOrderStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      AdminService.updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    },
  });

  // Category Mutations
  const createCategoryMutation = useMutation({
    mutationFn: CategoryService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      setShowCategoryModal(false);
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { name?: string; description?: string };
    }) => CategoryService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      setShowCategoryModal(false);
      setEditingCategory(null);
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: CategoryService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
    },
  });

  // User Role Mutation
  const updateUserRoleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) =>
      AdminService.updateUserRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowProductModal(true);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
      deleteProductMutation.mutate(id);
    }
  };

  const handleEditCategory = (category: {
    id: string;
    name: string;
    description?: string;
  }) => {
    setEditingCategory(category);
    setShowCategoryModal(true);
  };

  const handleDeleteCategory = (id: string) => {
    if (confirm("Bạn có chắc muốn xóa danh mục này?")) {
      deleteCategoryMutation.mutate(id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-black text-slate-900 italic uppercase tracking-tighter">
          Hệ thống quản trị
        </h1>
        <div className="flex items-center gap-3">
          {/* Export Dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100">
              <Download size={18} /> Xuất báo cáo
            </button>
            <div className="absolute right-0 top-full mt-2 bg-white rounded-xl border border-slate-100 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 min-w-48">
              <button
                onClick={async () => {
                  try {
                    const { ReportsService } =
                      await import("../services/api.service");
                    await ReportsService.exportOrders();
                    toast.success("Đã tải xuống báo cáo đơn hàng!");
                  } catch {
                    toast.error("Không thể tải báo cáo");
                  }
                }}
                className="flex items-center gap-2 px-4 py-3 hover:bg-slate-50 rounded-t-xl text-slate-700 font-medium w-full text-left">
                <ShoppingBag size={16} className="text-blue-500" />
                Xuất đơn hàng
              </button>
              <button
                onClick={async () => {
                  try {
                    const { ReportsService } =
                      await import("../services/api.service");
                    await ReportsService.exportProducts();
                    toast.success("Đã tải xuống báo cáo tồn kho!");
                  } catch {
                    toast.error("Không thể tải báo cáo");
                  }
                }}
                className="flex items-center gap-2 px-4 py-3 hover:bg-slate-50 rounded-b-xl text-slate-700 font-medium w-full text-left">
                <Package size={16} className="text-indigo-500" />
                Xuất tồn kho
              </button>
            </div>
          </div>

          {activeTab === "products" && (
            <button
              onClick={() => {
                setEditingProduct(null);
                setShowProductModal(true);
              }}
              className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
              <Plus size={20} /> Thêm sản phẩm
            </button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4 text-slate-500 mb-2">
            <DollarSign size={20} className="text-green-500" />
            <span className="text-sm font-bold uppercase tracking-wider">
              Doanh thu
            </span>
          </div>
          <p className="text-3xl font-black text-slate-900">
            {(stats?.totalRevenue || 0).toLocaleString("vi-VN")} đ
          </p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4 text-slate-500 mb-2">
            <ShoppingBag size={20} className="text-blue-500" />
            <span className="text-sm font-bold uppercase tracking-wider">
              Đơn hàng
            </span>
          </div>
          <p className="text-3xl font-black text-slate-900">
            {stats?.totalOrders || 0}
          </p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4 text-slate-500 mb-2">
            <Package size={20} className="text-indigo-500" />
            <span className="text-sm font-bold uppercase tracking-wider">
              Sản phẩm
            </span>
          </div>
          <p className="text-3xl font-black text-slate-900">
            {products.length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4 text-slate-500 mb-2">
            <LayoutGrid size={20} className="text-purple-500" />
            <span className="text-sm font-bold uppercase tracking-wider">
              Danh mục
            </span>
          </div>
          <p className="text-3xl font-black text-slate-900">
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
          {[
            { key: "products", label: "Sản phẩm", icon: <Package size={18} /> },
            {
              key: "orders",
              label: "Đơn hàng",
              icon: <ShoppingBag size={18} />,
            },
            {
              key: "categories",
              label: "Danh mục",
              icon: <LayoutGrid size={18} />,
            },
            { key: "users", label: "Người dùng", icon: <Users size={18} /> },
            { key: "banners", label: "Banners", icon: <Image size={18} /> },
            {
              key: "coupons",
              label: "Mã giảm giá",
              icon: <DollarSign size={18} />,
            },
            {
              key: "shipping",
              label: "Vận chuyển",
              icon: <Truck size={18} />,
            },
            {
              key: "analytics",
              label: "Thống kê",
              icon: <BarChart3 size={18} />,
            },
            {
              key: "flash-sale",
              label: "Flash Sale",
              icon: <Zap size={18} />,
            },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as TabType)}
              className={`flex items-center gap-2.5 px-4 py-3 rounded-xl font-bold text-sm transition-all text-left ${
                activeTab === tab.key
                  ? "bg-slate-900 text-white shadow-lg"
                  : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-100"
              }`}>
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden min-w-0">
          {activeTab === "products" && (
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                    Sản phẩm
                  </th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                    Danh mục
                  </th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                    Giá
                  </th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                    Kho
                  </th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {products.map((product: Product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden">
                          {product.imageUrl && (
                            <img
                              src={product.imageUrl}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <span className="font-bold text-slate-900">
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
                        {product.category.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-700">
                      {product.price.toLocaleString("vi-VN")} đ
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`font-bold ${
                          product.stock > 0 ? "text-green-600" : "text-red-500"
                        }`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === "orders" && (
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                    Mã đơn
                  </th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                    Khách hàng
                  </th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                    Tổng tiền
                  </th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                    Trạng thái
                  </th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                    Ngày đặt
                  </th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {orders.map((order: Order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-sm text-slate-600">
                      #{order.id.slice(0, 8)}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-slate-900">
                          {order.user?.fullName || "N/A"}
                        </p>
                        <p className="text-sm text-slate-400">
                          {order.user?.email}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-700">
                      {order.totalAmount.toLocaleString("vi-VN")} đ
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateOrderStatusMutation.mutate({
                            id: order.id,
                            status: e.target.value,
                          })
                        }
                        className={`px-3 py-1 rounded-full text-sm font-semibold border-0 cursor-pointer ${
                          statusConfig[order.status]?.color || "bg-slate-100"
                        }`}>
                        <option value="PENDING">Chờ xử lý</option>
                        <option value="PROCESSING">Đang xử lý</option>
                        <option value="SHIPPED">Đang giao</option>
                        <option value="DELIVERED">Đã giao</option>
                        <option value="CANCELLED">Đã hủy</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === "categories" && (
            <>
              <div className="p-4 border-b border-slate-100 flex justify-end">
                <button
                  onClick={() => {
                    setEditingCategory(null);
                    setShowCategoryModal(true);
                  }}
                  className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                  <Plus size={20} /> Thêm danh mục
                </button>
              </div>
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                      Tên danh mục
                    </th>
                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                      Mô tả
                    </th>
                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                      Số sản phẩm
                    </th>
                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {categories.map(
                    (category: {
                      id: string;
                      name: string;
                      description?: string;
                      _count?: { products: number };
                    }) => (
                      <tr
                        key={category.id}
                        className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-bold text-slate-900">
                            {category.name}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500">
                          {category.description || "Chưa có mô tả"}
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold">
                            {category._count?.products || 0} sản phẩm
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEditCategory(category)}
                              className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(category.id)}
                              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </>
          )}

          {activeTab === "users" && (
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                    Người dùng
                  </th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                    Email
                  </th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                    Vai trò
                  </th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                    Ngày tạo
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {users.map((user: UserProfile) => (
                  <tr
                    key={user.id}
                    className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                          {user.fullName?.charAt(0) ||
                            user.email.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-bold text-slate-900">
                          {user.fullName || "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{user.email}</td>
                    <td className="px-6 py-4">
                      <select
                        value={user.role}
                        onChange={(e) =>
                          updateUserRoleMutation.mutate({
                            id: user.id,
                            role: e.target.value,
                          })
                        }
                        className={`px-3 py-1 rounded-full text-sm font-semibold border-0 cursor-pointer ${
                          user.role === "ADMIN"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-slate-100 text-slate-600"
                        }`}>
                        <option value="USER">User</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Banners Tab */}
          {activeTab === "banners" && (
            <div className="p-6">
              <AdminBannersTab />
            </div>
          )}

          {/* Coupons Tab */}
          {activeTab === "coupons" && (
            <div className="p-6">
              <AdminCouponsTab />
            </div>
          )}

          {/* Shipping Tab */}
          {activeTab === "shipping" && (
            <div className="p-6">
              <AdminShippingTab />
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === "analytics" && (
            <div className="p-6">
              <AdminAnalyticsTab />
            </div>
          )}

          {/* Flash Sale Tab */}
          {activeTab === "flash-sale" && <AdminFlashSaleTab />}
        </div>
      </div>

      {/* Product Modal */}
      {showProductModal && (
        <ProductModal
          product={editingProduct}
          categories={categories}
          onClose={() => {
            setShowProductModal(false);
            setEditingProduct(null);
          }}
          onSubmit={(data) => {
            if (editingProduct) {
              updateProductMutation.mutate({
                id: editingProduct.id,
                data: { ...data, description: data.description || undefined },
              });
            } else {
              createProductMutation.mutate(
                data as Parameters<typeof ProductService.create>[0],
              );
            }
          }}
          isPending={
            createProductMutation.isPending || updateProductMutation.isPending
          }
        />
      )}

      {/* Category Modal */}
      {showCategoryModal && (
        <CategoryModal
          category={editingCategory}
          onClose={() => {
            setShowCategoryModal(false);
            setEditingCategory(null);
          }}
          onSubmit={(data) => {
            if (editingCategory) {
              updateCategoryMutation.mutate({
                id: editingCategory.id,
                data,
              });
            } else {
              createCategoryMutation.mutate(data);
            }
          }}
          isPending={
            createCategoryMutation.isPending || updateCategoryMutation.isPending
          }
        />
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">
                Chi tiết đơn hàng #{selectedOrder.id.slice(0, 8)}
              </h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] space-y-6">
              {/* Customer Info */}
              <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
                <h3 className="font-bold text-slate-700 flex items-center gap-2">
                  <Users size={18} className="text-indigo-600" />
                  Thông tin khách hàng
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400">Họ tên:</span>
                    <p className="font-semibold text-slate-800">
                      {selectedOrder.user?.fullName || "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400">Email:</span>
                    <p className="font-semibold text-slate-800">
                      {selectedOrder.user?.email}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400 flex items-center gap-1">
                      <Phone size={14} /> Điện thoại:
                    </span>
                    <p className="font-semibold text-slate-800">
                      {selectedOrder.phone || "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400 flex items-center gap-1">
                      <MapPin size={14} /> Địa chỉ:
                    </span>
                    <p className="font-semibold text-slate-800">
                      {selectedOrder.address || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Status */}
              <div className="flex items-center justify-between bg-slate-50 rounded-2xl p-4">
                <div>
                  <span className="text-sm text-slate-400">Trạng thái</span>
                  <p
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold mt-1 ${
                      statusConfig[selectedOrder.status]?.color
                    }`}>
                    {statusConfig[selectedOrder.status]?.icon}
                    {statusConfig[selectedOrder.status]?.label}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm text-slate-400">Ngày đặt</span>
                  <p className="font-semibold text-slate-800">
                    {new Date(selectedOrder.createdAt).toLocaleString("vi-VN")}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
                  <Package size={18} className="text-indigo-600" />
                  Sản phẩm ({selectedOrder.orderItems?.length || 0})
                </h3>
                <div className="space-y-3">
                  {selectedOrder.orderItems?.map(
                    (item: {
                      id: string;
                      quantity: number;
                      price: number;
                      product: { name: string; imageUrl: string | null };
                    }) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 bg-slate-50 rounded-xl p-3">
                        <div className="w-16 h-16 bg-slate-200 rounded-lg overflow-hidden flex-shrink-0">
                          {item.product.imageUrl ? (
                            <img
                              src={item.product.imageUrl}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                              N/A
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-slate-800">
                            {item.product.name}
                          </p>
                          <p className="text-sm text-slate-500">
                            Số lượng: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-slate-900">
                            {(item.price * item.quantity).toLocaleString(
                              "vi-VN",
                            )}{" "}
                            đ
                          </p>
                          <p className="text-xs text-slate-400">
                            {item.price.toLocaleString("vi-VN")} đ/sp
                          </p>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>

              {/* Total */}
              <div className="bg-indigo-50 rounded-2xl p-4 flex items-center justify-between">
                <span className="text-lg font-bold text-indigo-900">
                  Tổng cộng
                </span>
                <span className="text-2xl font-black text-indigo-600">
                  {selectedOrder.totalAmount.toLocaleString("vi-VN")} đ
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface ProductModalProps {
  product: Product | null;
  categories: { id: string; name: string }[];
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    description: string;
    price: number;
    stock: number;
    imageUrl: string;
    categoryId: string;
  }) => void;
  isPending: boolean;
}

const ProductModal = ({
  product,
  categories,
  onClose,
  onSubmit,
  isPending,
}: ProductModalProps) => {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || 0,
    stock: product?.stock || 0,
    imageUrl: product?.imageUrl || "",
    categoryId: product?.categoryId || categories[0]?.id || "",
  });
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const result = await UploadService.uploadImage(file);
      setFormData({ ...formData, imageUrl: result.url });
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Tải ảnh lên thất bại. Vui lòng thử lại.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">
            {product ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Tên sản phẩm
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Mô tả
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-y min-h-24"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Giá (VND)
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: Number(e.target.value) })
                }
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                required
                min={0}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Số lượng
              </label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({ ...formData, stock: Number(e.target.value) })
                }
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                required
                min={0}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Hình ảnh sản phẩm
            </label>

            {/* Image Preview */}
            {formData.imageUrl && (
              <div className="mb-3 relative w-32 h-32 rounded-xl overflow-hidden border border-slate-200">
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23f1f5f9" width="100" height="100"/><text x="50" y="55" text-anchor="middle" fill="%2394a3b8" font-size="12">Lỗi ảnh</text></svg>';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, imageUrl: "" })}
                  className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors">
                  <X size={14} />
                </button>
              </div>
            )}

            {/* Upload Options */}
            <div className="space-y-3">
              {/* File Upload Button */}
              <div className="flex items-center gap-3">
                <label
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors cursor-pointer ${
                    isUploading
                      ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}>
                  {isUploading ? (
                    <>
                      <Loader size={18} className="animate-spin" />
                      Đang tải lên...
                    </>
                  ) : (
                    <>
                      <Upload size={18} />
                      Chọn hình ảnh
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={isUploading}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleFileUpload(file);
                      }
                    }}
                  />
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Danh mục
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) =>
                setFormData({ ...formData, categoryId: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              required>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all disabled:bg-indigo-400">
            <Save size={20} />
            {isPending ? "Đang lưu..." : product ? "Cập nhật" : "Thêm sản phẩm"}
          </button>
        </form>
      </div>
    </div>
  );
};

// Category Modal Component
interface CategoryModalProps {
  category: { id: string; name: string; description?: string } | null;
  onClose: () => void;
  onSubmit: (data: { name: string; description?: string }) => void;
  isPending: boolean;
}

const CategoryModal = ({
  category,
  onClose,
  onSubmit,
  isPending,
}: CategoryModalProps) => {
  const [formData, setFormData] = useState({
    name: category?.name || "",
    description: category?.description || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">
            {category ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Tên danh mục
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              placeholder="Nhập tên danh mục..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Mô tả
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none h-24"
              placeholder="Nhập mô tả danh mục..."
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all disabled:bg-indigo-400">
            <Save size={20} />
            {isPending
              ? "Đang lưu..."
              : category
                ? "Cập nhật"
                : "Thêm danh mục"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboard;
