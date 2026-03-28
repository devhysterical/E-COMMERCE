import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ProductService,
  CategoryService,
  UploadService,
} from "../services/api.service";
import type { SpecificationItem } from "../services/product.service";
import { toast } from "react-toastify";
import type { Product } from "../services/api.service";
import { formatCurrency } from "../utils/language";
import { Plus, Edit, Trash2, X, Save, Upload, Loader } from "lucide-react";
import ConfirmModal from "./ConfirmModal";
import Pagination from "./Pagination";

const AdminProductsTab = () => {
  const { t, i18n } = useTranslation();
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
      toast.success(t("admin.products.createSuccess"));
    },
    onError: () => {
      toast.error(t("admin.products.createFailed"));
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
        shortName: string;
        price: number;
        stock: number;
        imageUrl: string;
        categoryId: string;
        specifications: SpecificationItem[];
      }>;
    }) => ProductService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      setShowProductModal(false);
      setEditingProduct(null);
      toast.success(t("admin.products.updateSuccess"));
    },
    onError: () => {
      toast.error(t("admin.products.updateFailed"));
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: ProductService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast.success(t("admin.products.deleteSuccess"));
    },
    onError: () => {
      toast.error(t("admin.products.deleteFailed"));
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
      <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-end">
        <button
          onClick={() => {
            setEditingProduct(null);
            setShowProductModal(true);
          }}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 dark:shadow-none"
        >
          <Plus size={20} /> {t("admin.products.addProduct")}
        </button>
      </div>

      {/* Table */}
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700">
          <tr>
            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
              {t("admin.products.product")}
            </th>
            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
              {t("admin.products.category")}
            </th>
            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
              {t("admin.products.price")}
            </th>
            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
              {t("admin.products.stock")}
            </th>
            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">
              {t("admin.common.actions")}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
          {products.slice((page - 1) * limit, page * limit).map((product: Product) => (
            <tr
              key={product.id}
              className="hover:bg-slate-50/50 dark:hover:bg-slate-800/70 transition-colors"
            >
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    {product.imageUrl && (
                      <img
                        src={product.imageUrl}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {product.name}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded-md">
                  {product.category.name}
                </span>
              </td>
              <td className="px-6 py-4 font-bold text-slate-700 dark:text-slate-200">
                {formatCurrency(product.price, i18n.language)}
              </td>
              <td className="px-6 py-4">
                <span
                  className={`font-bold ${
                    product.stock > 0 ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {product.stock}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="p-2 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="p-2 text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                  >
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
        label={t("admin.products.product")}
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
                data,
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
        title={t("admin.products.deleteProduct")}
        message={t("admin.products.confirmDelete")}
        confirmLabel={t("admin.products.deleteProduct")}
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
    shortName: string;
    price: number;
    stock: number;
    imageUrl: string;
    categoryId: string;
    specifications: SpecificationItem[];
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
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: product?.name || "",
    shortName: product?.shortName || "",
    price: product?.price || 0,
    stock: product?.stock || 0,
    imageUrl: product?.imageUrl || "",
    categoryId: product?.categoryId || categories[0]?.id || "",
  });
  const [specifications, setSpecifications] = useState<SpecificationItem[]>(
    (product?.specifications as SpecificationItem[]) || [],
  );

  const addSpecRow = () => {
    setSpecifications([...specifications, { label: "", value: "" }]);
  };

  const removeSpecRow = (index: number) => {
    setSpecifications(specifications.filter((_, i) => i !== index));
  };

  const updateSpecRow = (
    index: number,
    field: "label" | "value",
    value: string,
  ) => {
    const updated = [...specifications];
    updated[index] = { ...updated[index], [field]: value };
    setSpecifications(updated);
  };
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const result = await UploadService.uploadImage(file);
      setFormData({ ...formData, imageUrl: result.url });
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error(t("admin.products.uploadFailed"));
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const filteredSpecs = specifications.filter(
      (s) => s.label.trim() || s.value.trim(),
    );
    onSubmit({
      ...formData,
      specifications: filteredSpecs,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-slate-100 dark:border-slate-700">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {product ? t("admin.products.editProduct") : t("admin.products.addNewProduct")}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              {t("admin.products.shortName")}
            </label>
            <input
              type="text"
              value={formData.shortName}
              onChange={(e) =>
                setFormData({ ...formData, shortName: e.target.value })
              }
              placeholder={t("admin.products.shortNamePlaceholder")}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              {t("admin.products.shortNameHint")}
            </p>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              {t("admin.products.fullName")}
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder={t("admin.products.fullNamePlaceholder")}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              required
            />
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              {t("admin.products.fullNameHint")}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                {t("admin.products.priceLabel")}
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: Number(e.target.value) })
                }
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                required
                min={0}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                {t("admin.products.quantity")}
              </label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({ ...formData, stock: Number(e.target.value) })
                }
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                required
                min={0}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              {t("admin.products.productImage")}
            </label>

            {formData.imageUrl && (
              <div className="mb-3 relative w-32 h-32 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23f1f5f9" width="100" height="100"/><text x="50" y="55" text-anchor="middle" fill="%2394a3b8" font-size="12">Error</text></svg>';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, imageUrl: "" })}
                  className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <label
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors cursor-pointer ${
                    isUploading
                      ? "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {isUploading ? (
                    <>
                      <Loader size={18} className="animate-spin" />
                      {t("admin.products.uploading")}
                    </>
                  ) : (
                    <>
                      <Upload size={18} />
                      {t("admin.products.selectImage")}
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
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              {t("admin.products.category")}
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) =>
                setFormData({ ...formData, categoryId: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              required
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Specifications Table Builder */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
                {t("admin.products.specifications")}
              </label>
              <button
                type="button"
                onClick={addSpecRow}
                className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                <Plus size={14} /> {t("admin.products.addSpec")}
              </button>
            </div>

            {specifications.length > 0 ? (
              <div className="space-y-3">
                {specifications.map((spec, index) => (
                  <div
                    key={index}
                    className="flex gap-2 items-start bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700"
                  >
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={spec.label}
                        onChange={(e) =>
                          updateSpecRow(index, "label", e.target.value)
                        }
                        placeholder={t("admin.products.specLabelPlaceholder")}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm"
                      />
                      <textarea
                        value={spec.value}
                        onChange={(e) =>
                          updateSpecRow(index, "value", e.target.value)
                        }
                        placeholder={t("admin.products.specValuePlaceholder")}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm resize-y min-h-[40px]"
                        rows={1}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeSpecRow(index)}
                      className="p-2 text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all mt-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 dark:text-slate-500 italic">
                {t("admin.products.noSpecs")}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all disabled:bg-indigo-400 dark:disabled:bg-indigo-900/50"
          >
            <Save size={20} />
            {isPending ? t("admin.common.saving") : product ? t("admin.common.update") : t("admin.products.addProduct")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminProductsTab;
