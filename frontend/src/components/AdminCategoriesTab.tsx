import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CategoryService } from "../services/api.service";
import { Plus, Edit, Trash2, X, Save } from "lucide-react";
import ConfirmModal from "./ConfirmModal";
import Pagination from "./Pagination";

const AdminCategoriesTab = () => {
  const queryClient = useQueryClient();
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<{
    id: string;
    name: string;
    description?: string;
  } | null>(null);
  const [deleteCategoryId, setDeleteCategoryId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const limit = 5;

  const { data: categories = [] } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: CategoryService.getAll,
  });

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

  const handleEditCategory = (category: {
    id: string;
    name: string;
    description?: string;
  }) => {
    setEditingCategory(category);
    setShowCategoryModal(true);
  };

  const handleDeleteCategory = (id: string) => {
    setDeleteCategoryId(id);
  };

  return (
    <>
      <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-end">
        <button
          onClick={() => {
            setEditingCategory(null);
            setShowCategoryModal(true);
          }}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 dark:shadow-none">
          <Plus size={20} /> Thêm danh mục
        </button>
      </div>
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700">
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
        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
          {categories.slice((page - 1) * limit, page * limit).map(
            (category: {
              id: string;
              name: string;
              description?: string;
              _count?: { products: number };
            }) => (
              <tr
                key={category.id}
                className="hover:bg-slate-50/50 dark:hover:bg-slate-800/70 transition-colors">
                <td className="px-6 py-4">
                  <span className="font-bold text-slate-900 dark:text-white">
                    {category.name}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                  {category.description || "Chưa có mô tả"}
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-semibold">
                    {category._count?.products || 0} sản phẩm
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleEditCategory(category)}
                      className="p-2 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all">
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="p-2 text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ),
          )}
        </tbody>
      </table>

      <Pagination
        page={page}
        totalPages={Math.ceil(categories.length / limit)}
        totalItems={categories.length}
        label="danh mục"
        onPageChange={setPage}
      />

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

      <ConfirmModal
        isOpen={!!deleteCategoryId}
        title="Xoá danh mục"
        message="Bạn có chắc muốn xoá danh mục này? Tất cả sản phẩm thuộc danh mục sẽ không còn danh mục."
        confirmLabel="Xoá danh mục"
        variant="danger"
        isPending={deleteCategoryMutation.isPending}
        onConfirm={() => {
          if (deleteCategoryId) {
            deleteCategoryMutation.mutate(deleteCategoryId, {
              onSuccess: () => setDeleteCategoryId(null),
            });
          }
        }}
        onCancel={() => setDeleteCategoryId(null)}
      />
    </>
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
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md border border-slate-100 dark:border-slate-700">
          <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-700">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {category ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
            </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              Tên danh mục
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              placeholder="Nhập tên danh mục..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              Mô tả
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none h-24"
              placeholder="Nhập mô tả danh mục..."
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all disabled:bg-indigo-400 dark:disabled:bg-indigo-900/50">
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

export default AdminCategoriesTab;
