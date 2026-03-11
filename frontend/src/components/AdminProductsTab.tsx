import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ProductService,
  CategoryService,
  UploadService,
} from "../services/api.service";
import { toast } from "react-toastify";
import type { Product } from "../services/api.service";
import { Plus, Edit, Trash2, X, Save, Upload, Loader } from "lucide-react";
import ConfirmModal from "./ConfirmModal";
import Pagination from "./Pagination";

const AdminProductsTab = () => {
  const queryClient = useQueryClient();
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const limit = 5;

  const { data: productsData } = useQuery({
    queryKey: ["admin-products"],
    queryFn: () => ProductService.getAll({ limit: 100 }),
  });
  const products = productsData?.data || [];

  const { data: categories = [] } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: CategoryService.getAll,
  });

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

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowProductModal(true);
  };

  const handleDeleteProduct = (id: string) => {
    setDeleteProductId(id);
  };

  return (
    <>
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex justify-end">
        <button
          onClick={() => {
            setEditingProduct(null);
            setShowProductModal(true);
          }}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
          <Plus size={20} /> Thêm sản phẩm
        </button>
      </div>

      {/* Table */}
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
          {products.slice((page - 1) * limit, page * limit).map((product: Product) => (
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

      <Pagination
        page={page}
        totalPages={Math.ceil(products.length / limit)}
        totalItems={products.length}
        label="sản phẩm"
        onPageChange={setPage}
      />

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

      <ConfirmModal
        isOpen={!!deleteProductId}
        title="Xoá sản phẩm"
        message="Bạn có chắc muốn xoá sản phẩm này? Hành động này không thể hoàn tác."
        confirmLabel="Xoá sản phẩm"
        variant="danger"
        isPending={deleteProductMutation.isPending}
        onConfirm={() => {
          if (deleteProductId) {
            deleteProductMutation.mutate(deleteProductId, {
              onSuccess: () => setDeleteProductId(null),
            });
          }
        }}
        onCancel={() => setDeleteProductId(null)}
      />
    </>
  );
};

// Product Modal Component
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

            <div className="space-y-3">
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

export default AdminProductsTab;
