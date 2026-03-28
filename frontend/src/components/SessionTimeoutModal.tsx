import { AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";

interface SessionTimeoutModalProps {
  isOpen: boolean;
  onConfirm: () => void;
}

const SessionTimeoutModal = ({
  isOpen,
  onConfirm,
}: SessionTimeoutModalProps) => {
  const { t } = useTranslation();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 animate-in fade-in zoom-in duration-200 border border-slate-100 dark:border-slate-700">
        {/* Icon */}
        <div className="w-16 h-16 bg-amber-100 rounded-full mx-auto flex items-center justify-center mb-6">
          <AlertTriangle size={32} className="text-amber-600" />
        </div>

        {/* Content */}
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-3">
          {t("modal.sessionExpiredTitle")}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-center mb-8">
          {t("modal.sessionExpiredDescription")}
        </p>

        {/* Button */}
        <button
          onClick={onConfirm}
          className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors">
          {t("modal.confirm")}
        </button>
      </div>
    </div>
  );
};

export default SessionTimeoutModal;
