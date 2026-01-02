import React from "react";
import { useQuery } from "@tanstack/react-query";
import { ProductService, CategoryService } from "../services/api.service";
import { Plus, Edit, Trash2, Package, LayoutGrid } from "lucide-react";

const AdminDashboard = () => {
  const { data: products, isLoading: prodLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: () => ProductService.getAll(),
  });

  const { data: categories } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: CategoryService.getAll,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-black text-slate-900 italic uppercase tracking-tighter">
          Hệ thống quản trị
        </h1>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
            <Plus size={20} /> Thêm sản phẩm
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Stats */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-4 text-slate-500 mb-2">
              <Package size={20} />{" "}
              <span className="text-sm font-bold uppercase tracking-wider">
                Tổng sản phẩm
              </span>
            </div>
            <p className="text-4xl font-black text-slate-900">
              {products?.length || 0}
            </p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-4 text-slate-500 mb-2">
              <LayoutGrid size={20} />{" "}
              <span className="text-sm font-bold uppercase tracking-wider">
                Danh mục
              </span>
            </div>
            <p className="text-4xl font-black text-slate-900">
              {categories?.length || 0}
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
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
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {products?.map((product: any) => (
                  <tr
                    key={product.id}
                    className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden">
                          <img
                            src={product.imageUrl}
                            alt=""
                            className="w-full h-full object-cover"
                          />
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
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                          <Edit size={18} />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
