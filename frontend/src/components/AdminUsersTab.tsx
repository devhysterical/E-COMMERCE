import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminService } from "../services/api.service";
import type { UserProfile } from "../services/api.service";
import { Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import ConfirmModal from "./ConfirmModal";
import Pagination from "./Pagination";

const AdminUsersTab = () => {
  const queryClient = useQueryClient();
  const [deleteTarget, setDeleteTarget] = useState<UserProfile | null>(null);
  const [page, setPage] = useState(1);
  const limit = 5;

  const { data: users = [] } = useQuery({
    queryKey: ["admin-users"],
    queryFn: AdminService.getAllUsers,
  });

  const updateUserRoleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) =>
      AdminService.updateUserRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: AdminService.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("Đã xoá tài khoản thành công");
      setDeleteTarget(null);
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(
        error.response?.data?.message || "Không thể xoá tài khoản này",
      );
      setDeleteTarget(null);
    },
  });

  const handleDeleteUser = (user: UserProfile) => {
    if (user.role === "ADMIN") {
      toast.error(
        "Không thể xoá tài khoản Admin. Hãy hạ vai trò về User trước.",
      );
      return;
    }
    setDeleteTarget(user);
  };

  return (
    <>
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700">
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
            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">
              Hành động
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
          {users.slice((page - 1) * limit, page * limit).map((user: UserProfile) => (
            <tr
              key={user.id}
              className="hover:bg-slate-50/50 dark:hover:bg-slate-800/70 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-bold">
                    {user.fullName?.charAt(0) ||
                      user.email.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {user.fullName || "N/A"}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{user.email}</td>
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
                      ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                  }`}>
                  <option value="USER">User</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </td>
              <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                {new Date(user.createdAt).toLocaleDateString("vi-VN")}
              </td>
              <td className="px-6 py-4 text-right">
                <button
                  onClick={() => handleDeleteUser(user)}
                  disabled={user.role === "ADMIN"}
                  className={`p-2 rounded-lg transition-all ${
                    user.role === "ADMIN"
                      ? "text-slate-200 dark:text-slate-700 cursor-not-allowed"
                      : "text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  }`}
                  title={
                    user.role === "ADMIN"
                      ? "Không thể xoá Admin"
                      : "Xoá tài khoản"
                  }>
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        page={page}
        totalPages={Math.ceil(users.length / limit)}
        totalItems={users.length}
        label="người dùng"
        onPageChange={setPage}
      />

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Xoá tài khoản"
        message={`Bạn có chắc muốn xoá tài khoản "${deleteTarget?.fullName || deleteTarget?.email}"? Hành động này không thể hoàn tác.`}
        confirmLabel="Xoá tài khoản"
        variant="danger"
        isPending={deleteUserMutation.isPending}
        onConfirm={() => {
          if (deleteTarget) deleteUserMutation.mutate(deleteTarget.id);
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
};

export default AdminUsersTab;
