import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Eye, X, Clock, Loader, CheckCircle, XCircle } from "lucide-react";
import api from "../api/axios";
import { toast } from "react-toastify";
import { formatDate } from "../utils/language";
import Pagination from "./Pagination";

interface ContactTicket {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  adminNote: string | null;
  createdAt: string;
  updatedAt: string;
}

const statusIcons: Record<string, { color: string; icon: React.ReactNode }> = {
  OPEN: {
    color: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
    icon: <Clock size={14} />,
  },
  IN_PROGRESS: {
    color: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300",
    icon: <Loader size={14} />,
  },
  RESOLVED: {
    color: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300",
    icon: <CheckCircle size={14} />,
  },
  CLOSED: {
    color: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300",
    icon: <XCircle size={14} />,
  },
};

const TICKET_STATUSES = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"] as const;

const AdminContactTab = () => {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const [selectedTicket, setSelectedTicket] = useState<ContactTicket | null>(null);
  const [adminNote, setAdminNote] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [page, setPage] = useState(1);
  const limit = 5;

  const { data: ticketsData } = useQuery({
    queryKey: ["admin-tickets", filterStatus],
    queryFn: async () => {
      const params = filterStatus ? `?status=${filterStatus}` : "";
      const res = await api.get(`/contact${params}`);
      return res.data as { data: ContactTicket[]; total: number };
    },
  });

  const tickets = ticketsData?.data || [];

  const updateStatusMutation = useMutation({
    mutationFn: ({
      id,
      status,
      adminNote,
    }: {
      id: string;
      status: string;
      adminNote?: string;
    }) => api.patch(`/contact/${id}`, { status, adminNote }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-tickets"] });
      setSelectedTicket(null);
      toast.success(t("admin.contact.updateSuccess"));
    },
  });

  const handleUpdateStatus = (id: string, status: string) => {
    updateStatusMutation.mutate({
      id,
      status,
      adminNote: adminNote || undefined,
    });
  };

  return (
    <>
      {/* Filter */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center gap-3">
        <span className="text-sm font-bold text-slate-500 dark:text-slate-400">{t("admin.common.filter")}:</span>
        {(["", ...TICKET_STATUSES] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
              filterStatus === status
                ? "bg-slate-900 text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            {status === "" ? t("admin.common.all") : t(`admin.contact.statusLabels.${status}`)}
          </button>
        ))}
      </div>

      {/* Table */}
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700">
          <tr>
            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
              {t("admin.contact.customer")}
            </th>
            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
              {t("admin.contact.subject")}
            </th>
            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
              {t("admin.contact.status")}
            </th>
            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
              {t("admin.contact.sentDate")}
            </th>
            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">
              {t("admin.common.actions")}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
          {tickets.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-12 text-center text-slate-400 dark:text-slate-500">
                {t("admin.contact.noTickets")}
              </td>
            </tr>
          ) : (
            tickets.slice((page - 1) * limit, page * limit).map((ticket) => (
              <tr
                key={ticket.id}
                className="hover:bg-slate-50/50 dark:hover:bg-slate-800/70 transition-colors"
              >
                <td className="px-6 py-4">
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{ticket.name}</p>
                    <p className="text-sm text-slate-400 dark:text-slate-500">{ticket.email}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-700 dark:text-slate-200 font-medium">
                  {ticket.subject}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold ${
                      statusIcons[ticket.status]?.color || "bg-slate-100"
                    }`}
                  >
                    {statusIcons[ticket.status]?.icon}
                    {t(`admin.contact.statusLabels.${ticket.status}`)}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                  {formatDate(ticket.createdAt, i18n.language)}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => {
                      setSelectedTicket(ticket);
                      setAdminNote(ticket.adminNote || "");
                    }}
                    className="p-2 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all"
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <Pagination
        page={page}
        totalPages={Math.ceil(tickets.length / limit)}
        totalItems={tickets.length}
        label={t("admin.contact.subject")}
        onPageChange={setPage}
      />

      {/* Detail Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-slate-100 dark:border-slate-700">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {t("admin.contact.detailTitle")}
              </h3>
              <button
                onClick={() => setSelectedTicket(null)}
                className="p-2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{t("admin.contact.fullName")}</p>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {selectedTicket.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{t("admin.contact.email")}</p>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {selectedTicket.email}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">{t("admin.contact.subject")}</p>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {selectedTicket.subject}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">{t("admin.contact.content")}</p>
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 text-slate-700 dark:text-slate-200 whitespace-pre-wrap">
                  {selectedTicket.message}
                </div>
              </div>

              <hr className="border-slate-100 dark:border-slate-700" />

              {/* Admin actions */}
              <div>
                <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-2">
                  {t("admin.contact.updateStatus")}
                </p>
                <select
                  value={selectedTicket.status}
                  onChange={(e) =>
                    handleUpdateStatus(selectedTicket.id, e.target.value)
                  }
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                >
                  {TICKET_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {t(`admin.contact.statusLabels.${s}`)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-2">
                  {t("admin.contact.adminNote")}
                </p>
                <textarea
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-y"
                  placeholder={t("admin.contact.adminNotePlaceholder")}
                />
                <button
                  onClick={() =>
                    handleUpdateStatus(selectedTicket.id, selectedTicket.status)
                  }
                  disabled={updateStatusMutation.isPending}
                  className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors text-sm"
                >
                  {t("admin.contact.saveNote")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminContactTab;
