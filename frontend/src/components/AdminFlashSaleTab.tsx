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
    return { label: "Tắt", color: "bg-gray-100 text-gray-600" };
  if (now < start)
    return { label: "Sắp diễn ra", color: "bg-blue-100 text-blue-700" };
  if (now > end)
    return { label: "Đã kết thúc", color: "bg-gray-100 text-gray-500" };
  return { label: "Đang diễn ra", color: "bg-green-100 text-green-700" };
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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
            <Zap className="text-white" size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Flash Sale</h2>
            <p className="text-sm text-slate-500">
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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Tạo Flash Sale mới</h3>
              <button
                onClick={resetForm}
                className="p-2 hover:bg-slate-100 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Tên chương trình
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="VD: Flash Sale Cuối Tuần"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Bắt đầu
                  </label>
                  <input
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Kết thúc
                  </label>
                  <input
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              {/* Product search */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Thêm sản phẩm
                </label>
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={16}
                  />
                  <input
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Tìm sản phẩm..."
                    className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  />
                </div>
                {productSearch && (
                  <div className="mt-1 border border-slate-200 rounded-xl max-h-40 overflow-y-auto">
                    {filteredProducts.slice(0, 8).map((p: Product) => (
                      <button
                        key={p.id}
                        onClick={() => addProductToList(p)}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 text-sm flex justify-between items-center">
                        <span>{p.name}</span>
                        <span className="text-slate-400">
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
                  <p className="text-sm font-medium text-slate-700">
                    Sản phẩm đã chọn ({items.length})
                  </p>
                  {items.map((item, idx) => (
                    <div
                      key={item.productId}
                      className="flex items-center gap-3 bg-slate-50 rounded-xl p-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {item.productName}
                        </p>
                        <div className="flex gap-3 mt-2">
                          <div>
                            <label className="text-xs text-slate-500">
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
                              className="w-28 border border-slate-200 rounded-lg px-2 py-1 text-sm mt-0.5"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-slate-500">
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
                              className="w-20 border border-slate-200 rounded-lg px-2 py-1 text-sm mt-0.5"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-slate-500">
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
                              className="w-20 border border-slate-200 rounded-lg px-2 py-1 text-sm mt-0.5"
                            />
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          setItems(items.filter((_, i) => i !== idx))
                        }
                        className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
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
                className="px-5 py-2.5 text-sm text-slate-600 hover:bg-slate-100 rounded-xl font-medium">
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
          <div className="text-center py-16 text-slate-400">
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
                className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                {/* Sale Header */}
                <div className="p-5 flex items-center justify-between border-b border-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl flex items-center justify-center">
                      <Zap className="text-orange-500" size={18} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{sale.name}</h3>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
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
                      <div className="w-9 h-5 bg-gray-200 peer-focus:ring-2 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-500" />
                    </label>
                    <button
                      onClick={() => {
                        if (confirm("Xóa Flash Sale này?"))
                          deleteMutation.mutate(sale.id);
                      }}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Progress */}
                <div className="px-5 py-3 bg-slate-50/50">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium text-slate-600">
                      Đã bán: {totalSold}/{totalQty}
                    </span>
                    <span className="text-xs font-semibold text-orange-600">
                      {progress.toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full transition-all"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Items */}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold text-slate-700">
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
                    <div className="mb-4 border border-orange-200 rounded-xl p-4 bg-orange-50/50 space-y-3">
                      <select
                        value={addProductId}
                        onChange={(e) => {
                          setAddProductId(e.target.value);
                          const p = products.find(
                            (pr: Product) => pr.id === e.target.value,
                          );
                          if (p) setAddSalePrice(Math.floor(p.price * 0.5));
                        }}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white">
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
                          <label className="text-xs text-slate-500">
                            Giá sale
                          </label>
                          <input
                            type="number"
                            value={addSalePrice}
                            onChange={(e) =>
                              setAddSalePrice(Number(e.target.value))
                            }
                            className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm mt-0.5"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-slate-500">
                            Số lượng
                          </label>
                          <input
                            type="number"
                            value={addSaleQty}
                            onChange={(e) =>
                              setAddSaleQty(Number(e.target.value))
                            }
                            className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm mt-0.5"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-slate-500">
                            Giới hạn/người
                          </label>
                          <input
                            type="number"
                            value={addLimitPerUser}
                            onChange={(e) =>
                              setAddLimitPerUser(Number(e.target.value))
                            }
                            className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm mt-0.5"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setShowAddItem(null)}
                          className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg">
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
                          className="flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-slate-50 group">
                          <img
                            src={item.product.imageUrl || "/placeholder.png"}
                            alt={item.product.name}
                            className="w-10 h-10 rounded-lg object-cover border border-slate-100"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {item.product.name}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-sm font-bold text-red-600">
                                {formatVND(item.salePrice)}đ
                              </span>
                              <span className="text-xs text-slate-400 line-through">
                                {formatVND(item.product.price)}đ
                              </span>
                              <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded">
                                -{discount}%
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-slate-500">
                              {item.soldQty}/{item.saleQty}
                            </p>
                            <div className="w-16 h-1.5 bg-slate-200 rounded-full mt-1 overflow-hidden">
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
                            className="p-1.5 text-red-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
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
