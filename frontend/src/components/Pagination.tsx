import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

interface PaginationProps {
  page: number;
  totalPages: number;
  totalItems: number;
  label?: string;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  page,
  totalPages,
  totalItems,
  label,
  onPageChange,
}: PaginationProps) {
  const { t } = useTranslation();
  if (totalPages <= 1) return null;

  const resolvedLabel = label ?? t("common.products").toLowerCase();

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-slate-700">
      <span className="text-sm text-slate-500 dark:text-slate-400">
        {t("pagination.totalItems", { total: totalItems, label: resolvedLabel })}
      </span>
      <div className="flex items-center gap-3">
        <button
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
          <ChevronLeft size={16} />
          {t("common.previous")}
        </button>
        <span className="text-sm text-slate-500 dark:text-slate-400">
          {page} / {totalPages}
        </span>
        <button
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
          {t("common.next")}
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
