import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FlashSaleService, ProductService } from "../services/api.service";
import type {
  FlashSale,
  FlashSaleItem,
  Product,
} from "../services/api.service";
import { toast } from "react-toastify";
import { Plus, Trash2, Zap, Clock, X, Search } from "lucide-react";

const formatVND = (value: number) => value.toLocaleString("vi-VN");

const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

function getSaleStatus(sale: FlashSale) {
  const now = Date.now();
  const start = new Date(sale.startTime).getTime();
  const end = new Date(sale.endTime).getTime();

  if (!sale.isActive)
    return {
      label: "Tắt",
      color:
        "bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-slate-300",
    };
  if (now < start)
    return {
      label: "Sắp diễn ra",
      color: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-200",
    };
  if (now > end)
    return {
      label: "Đã kết thúc",
      color:
        "bg-gray-100 text-gray-500 dark:bg-slate-800 dark:text-slate-400",
    };
  return {
    label: "Đang diễn ra",
    color:
      "bg-green-100 text-green-700 dark:bg-emerald-500/15 dark:text-emerald-200",
  };
}

export default function AdminFlashSaleTab() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [showAddItem, setShowAddItem] = useState<string | null>(null);
  const [productSearch, setProductSearch] = useState("");

  // Form state
  const [name, setName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [items, setItems] = useState<
    {
      productId: string;
      productName: string;
      salePrice: number;
      saleQty: number;
      limitPerUser: number;
    }[]
  >([]);

  // Add item form
  const [addProductId, setAddProductId] = useState("");
  const [addSalePrice, setAddSalePrice] = useState(0);
  const [addSaleQty, setAddSaleQty] = useState(0);
  const [addLimitPerUser, setAddLimitPerUser] = useState(1);

  const { data: flashSales = [], isLoading } = useQuery({
    queryKey: ["flash-sales"],
    queryFn: FlashSaleService.getAll,
  });

  const { data: productsData } = useQuery({
    queryKey: ["products-all"],
    queryFn: () => ProductService.getAll({ limit: 200 }),
  });

  const products: Product[] = productsData?.data ?? [];

  const createMutation = useMutation({
    mutationFn: FlashSaleService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flash-sales"] });
      toast.success("Tạo Flash Sale thành công");
      resetForm();
    },
    onError: () => toast.error("Lỗi khi tạo Flash Sale"),
  });

  const deleteMutation = useMutation({
    mutationFn: FlashSaleService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flash-sales"] });
      toast.success("Đã xóa Flash Sale");
    },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      FlashSaleService.update(id, { isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flash-sales"] });
    },
  });

  const addItemMutation = useMutation({
    mutationFn: ({
      flashSaleId,
      data,
    }: {
      flashSaleId: string;
      data: {
        productId: string;
        salePrice: number;
        saleQty: number;
        limitPerUser: number;
      };
    }) => FlashSaleService.addItem(flashSaleId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flash-sales"] });
      toast.success("Đã thêm sản phẩm");
      setShowAddItem(null);
    },
    onError: () => toast.error("Sản phẩm đã có trong Flash Sale này"),
  });

  const removeItemMutation = useMutation({
    mutationFn: ({
      flashSaleId,
      itemId,
    }: {
      flashSaleId: string;
      itemId: string;
    }) => FlashSaleService.removeItem(flashSaleId, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flash-sales"] });
      toast.success("Đã xóa sản phẩm");
    },
  });

  const resetForm = () => {
    setShowForm(false);
    setName("");
    setStartTime("");
    setEndTime("");
    setItems([]);
  };

  const addProductToList = (product: Product) => {
    if (items.some((i) => i.productId === product.id)) return;
    setItems([
      ...items,
      {
        productId: product.id,
        productName: product.name,
        salePrice: Math.floor(product.price * 0.5),
        saleQty: 10,
        limitPerUser: 1,
      },
    ]);
    setProductSearch("");
  };

  const handleCreate = () => {
    if (!name || !startTime || !endTime || items.length === 0) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }
    createMutation.mutate({
      name,
      startTime: new Date(startTime).toISOString(),
      endTime: new Date(endTime).toISOString(),
      items: items.map((i) => ({
        productId: i.productId,
        salePrice: i.salePrice,
        saleQty: i.saleQty,
        limitPerUser: i.limitPerUser,
      })),
    });
  };

  const filteredProducts = products.filter(
    (p: Product) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) &&
      !items.some((i) => i.productId === p.id),
  );

  if (isLoading)
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full" />
      </div>
    );

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
            <Zap className="text-white" size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Flash Sale
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {flashSales.length} chương trình
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:shadow-lg transition-all">
          <Plus size={18} />
          Tạo Flash Sale
        </button>
      </div>

      {/* Create Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl space-y-5 overflow-y-auto rounded-2xl bg-white p-6 dark:border dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Tạo Flash Sale mới
              </h3>
              <button
                onClick={resetForm}
                className="rounded-lg p-2 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Tên chương trình
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="VD: Flash Sale Cuối Tuần"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-transparent focus:ring-2 focus:ring-orange-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Bắt đầu
                  </label>
                  <input
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-transparent focus:ring-2 focus:ring-orange-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Kết thúc
                  </label>
                  <input
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-transparent focus:ring-2 focus:ring-orange-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  />
                </div>
              </div>

              {/* Product search */}
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Thêm sản phẩm
                </label>
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                    size={16}
                  />
                  <input
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Tìm sản phẩm..."
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition-colors focus:border-transparent focus:ring-2 focus:ring-orange-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
                  />
                </div>
                {productSearch && (
                  <div className="mt-1 max-h-40 overflow-y-auto rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950">
                    {filteredProducts.slice(0, 8).map((p: Product) => (
                      <button
                        key={p.id}
                        onClick={() => addProductToList(p)}
                        className="flex w-full items-center justify-between px-4 py-2 text-left text-sm transition-colors hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800">
                        <span>{p.name}</span>
                        <span className="text-slate-400 dark:text-slate-500">
                          {formatVND(p.price)}đ
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Items list */}
              {items.length > 0 && (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Sản phẩm đã chọn ({items.length})
                  </p>
                  {items.map((item, idx) => (
                    <div
                      key={item.productId}
                      className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/70">
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                          {item.productName}
                        </p>
                        <div className="flex gap-3 mt-2">
                          <div>
                            <label className="text-xs text-slate-500 dark:text-slate-400">
                              Giá sale
                            </label>
                            <input
                              type="number"
                              value={item.salePrice}
                              onChange={(e) => {
                                const n = [...items];
                                n[idx].salePrice = Number(e.target.value);
                                setItems(n);
                              }}
                              className="mt-0.5 w-28 rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-slate-500 dark:text-slate-400">
                              Số lượng
                            </label>
                            <input
                              type="number"
                              value={item.saleQty}
                              onChange={(e) => {
                                const n = [...items];
                                n[idx].saleQty = Number(e.target.value);
                                setItems(n);
                              }}
                              className="mt-0.5 w-20 rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-slate-500 dark:text-slate-400">
                              Giới hạn/người
                            </label>
                            <input
                              type="number"
                              value={item.limitPerUser}
                              onChange={(e) => {
                                const n = [...items];
                                n[idx].limitPerUser = Number(e.target.value);
                                setItems(n);
                              }}
                              className="mt-0.5 w-20 rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                            />
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          setItems(items.filter((_, i) => i !== idx))
                        }
                        className="rounded-lg p-1.5 text-red-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-red-300 dark:hover:bg-red-500/10 dark:hover:text-red-200">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={resetForm}
                className="rounded-xl px-5 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
                Hủy
              </button>
              <button
                onClick={handleCreate}
                disabled={createMutation.isPending}
                className="px-5 py-2.5 text-sm bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50">
                {createMutation.isPending ? "Đang tạo..." : "Tạo Flash Sale"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Flash Sales List */}
      <div className="space-y-4">
        {flashSales.length === 0 ? (
          <div className="py-16 text-center text-slate-400 dark:text-slate-500">
            <Zap size={48} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">Chưa có Flash Sale nào</p>
            <p className="text-sm mt-1">Tạo chương trình Flash Sale đầu tiên</p>
          </div>
        ) : (
          flashSales.map((sale: FlashSale) => {
            const status = getSaleStatus(sale);
            const totalSold = sale.items.reduce(
              (s: number, i: FlashSaleItem) => s + i.soldQty,
              0,
            );
            const totalQty = sale.items.reduce(
              (s: number, i: FlashSaleItem) => s + i.saleQty,
              0,
            );
            const progress = totalQty > 0 ? (totalSold / totalQty) * 100 : 0;

            return (
              <div
                key={sale.id}
                className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                {/* Sale Header */}
                <div className="flex items-center justify-between border-b border-slate-50 p-5 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl flex items-center justify-center">
                      <Zap className="text-orange-500" size={18} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-slate-100">
                        {sale.name}
                      </h3>
                      <div className="mt-0.5 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <Clock size={12} />
                        <span>
                          {formatDateTime(sale.startTime)} -{" "}
                          {formatDateTime(sale.endTime)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${status.color}`}>
                      {status.label}
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sale.isActive}
                        onChange={() =>
                          toggleMutation.mutate({
                            id: sale.id,
                            isActive: !sale.isActive,
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="peer h-5 w-9 rounded-full bg-gray-200 peer-focus:ring-2 peer-focus:ring-orange-300 peer-checked:bg-orange-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all after:content-[''] dark:bg-slate-700" />
                    </label>
                    <button
                      onClick={() => {
                        if (confirm("Xóa Flash Sale này?"))
                          deleteMutation.mutate(sale.id);
                      }}
                      className="rounded-lg p-2 text-red-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-red-300 dark:hover:bg-red-500/10 dark:hover:text-red-200">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Progress */}
                <div className="bg-slate-50/50 px-5 py-3 dark:bg-slate-800/50">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                      Đã bán: {totalSold}/{totalQty}
                    </span>
                    <span className="text-xs font-semibold text-orange-600">
                      {progress.toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                    <div
                      className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full transition-all"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Items */}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Sản phẩm ({sale.items.length})
                    </p>
                    <button
                      onClick={() =>
                        setShowAddItem(showAddItem === sale.id ? null : sale.id)
                      }
                      className="text-xs flex items-center gap-1 text-orange-600 hover:text-orange-700 font-medium">
                      <Plus size={14} />
                      Thêm
                    </button>
                  </div>

                  {/* Add Item inline form */}
                  {showAddItem === sale.id && (
                    <div className="mb-4 space-y-3 rounded-xl border border-orange-200 bg-orange-50/50 p-4 dark:border-orange-500/30 dark:bg-orange-500/10">
                      <select
                        value={addProductId}
                        onChange={(e) => {
                          setAddProductId(e.target.value);
                          const p = products.find(
                            (pr: Product) => pr.id === e.target.value,
                          );
                          if (p) setAddSalePrice(Math.floor(p.price * 0.5));
                        }}
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100">
                        <option value="">Chọn sản phẩm</option>
                        {products
                          .filter(
                            (p: Product) =>
                              !sale.items.some(
                                (si: FlashSaleItem) => si.productId === p.id,
                              ),
                          )
                          .map((p: Product) => (
                            <option key={p.id} value={p.id}>
                              {p.name} - {formatVND(p.price)}đ
                            </option>
                          ))}
                      </select>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="text-xs text-slate-500 dark:text-slate-400">
                            Giá sale
                          </label>
                          <input
                            type="number"
                            value={addSalePrice}
                            onChange={(e) =>
                              setAddSalePrice(Number(e.target.value))
                            }
                            className="mt-0.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-slate-500 dark:text-slate-400">
                            Số lượng
                          </label>
                          <input
                            type="number"
                            value={addSaleQty}
                            onChange={(e) =>
                              setAddSaleQty(Number(e.target.value))
                            }
                            className="mt-0.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-slate-500 dark:text-slate-400">
                            Giới hạn/người
                          </label>
                          <input
                            type="number"
                            value={addLimitPerUser}
                            onChange={(e) =>
                              setAddLimitPerUser(Number(e.target.value))
                            }
                            className="mt-0.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setShowAddItem(null)}
                          className="rounded-lg px-3 py-1.5 text-xs text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
                          Hủy
                        </button>
                        <button
                          onClick={() => {
                            if (!addProductId) return;
                            addItemMutation.mutate({
                              flashSaleId: sale.id,
                              data: {
                                productId: addProductId,
                                salePrice: addSalePrice,
                                saleQty: addSaleQty,
                                limitPerUser: addLimitPerUser,
                              },
                            });
                          }}
                          className="px-3 py-1.5 text-xs bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600">
                          Thêm
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    {sale.items.map((item: FlashSaleItem) => {
                      const itemProgress =
                        item.saleQty > 0
                          ? (item.soldQty / item.saleQty) * 100
                          : 0;
                      const discount =
                        item.product.price > 0
                          ? Math.round(
                              (1 - item.salePrice / item.product.price) * 100,
                            )
                          : 0;

                      return (
                        <div
                          key={item.id}
                          className="group flex items-center gap-3 rounded-xl px-3 py-2 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/70">
                          <img
                            src={item.product.imageUrl || "/placeholder.png"}
                            alt={item.product.name}
                            className="h-10 w-10 rounded-lg border border-slate-100 object-cover dark:border-slate-700"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                              {item.product.name}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-sm font-bold text-red-600">
                                {formatVND(item.salePrice)}đ
                              </span>
                              <span className="text-xs text-slate-400 line-through dark:text-slate-500">
                                {formatVND(item.product.price)}đ
                              </span>
                              <span className="rounded bg-orange-50 px-1.5 py-0.5 text-xs font-semibold text-orange-600 dark:bg-orange-500/15 dark:text-orange-200">
                                -{discount}%
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {item.soldQty}/{item.saleQty}
                            </p>
                            <div className="mt-1 h-1.5 w-16 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                              <div
                                className="h-full bg-orange-400 rounded-full"
                                style={{
                                  width: `${Math.min(itemProgress, 100)}%`,
                                }}
                              />
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              removeItemMutation.mutate({
                                flashSaleId: sale.id,
                                itemId: item.id,
                              })
                            }
                            className="p-1.5 text-red-300 opacity-0 transition-all group-hover:opacity-100 hover:text-red-500 dark:text-red-400 dark:hover:text-red-200">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
