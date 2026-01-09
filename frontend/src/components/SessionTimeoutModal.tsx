import { AlertTriangle } from "lucide-react";

interface SessionTimeoutModalProps {
  isOpen: boolean;
  onConfirm: () => void;
}

const SessionTimeoutModal = ({
  isOpen,
  onConfirm,
}: SessionTimeoutModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 animate-in fade-in zoom-in duration-200">
        {/* Icon */}
        <div className="w-16 h-16 bg-amber-100 rounded-full mx-auto flex items-center justify-center mb-6">
          <AlertTriangle size={32} className="text-amber-600" />
        </div>

        {/* Content */}
        <h2 className="text-2xl font-bold text-slate-900 text-center mb-3">
          Phiên đăng nhập đã hết hạn
        </h2>
        <p className="text-slate-500 text-center mb-8">
          Bạn đã không hoạt động trong một thời gian dài. Vui lòng đăng nhập lại
          để tiếp tục sử dụng.
        </p>

        {/* Button */}
        <button
          onClick={onConfirm}
          className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors">
          Xác nhận
        </button>
      </div>
    </div>
  );
};

export default SessionTimeoutModal;
