import { AlertTriangle } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning";
  isPending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal = ({
  isOpen,
  title,
  message,
  confirmLabel = "Xác nhận",
  cancelLabel = "Huỷ bỏ",
  variant = "danger",
  isPending = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) => {
  if (!isOpen) return null;

  const colors =
    variant === "danger"
      ? {
          icon: "bg-red-100 text-red-600",
          button: "bg-red-600 hover:bg-red-700 shadow-red-100",
        }
      : {
          icon: "bg-amber-100 text-amber-600",
          button: "bg-amber-600 hover:bg-amber-700 shadow-amber-100",
        };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-sm animate-in fade-in zoom-in-95 border border-slate-100 dark:border-slate-700">
        <div className="p-6 text-center">
          <div
            className={`inline-flex items-center justify-center w-14 h-14 rounded-full mb-4 ${colors.icon}`}>
            <AlertTriangle size={28} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
            {title}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            {message}
          </p>
        </div>
        <div className="flex gap-3 px-6 pb-6">
          <button
            onClick={onCancel}
            disabled={isPending}
            className="flex-1 px-4 py-3 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50">
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className={`flex-1 px-4 py-3 text-white rounded-xl font-semibold transition-all shadow-lg disabled:opacity-50 ${colors.button}`}>
            {isPending ? "Đang xử lý..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
