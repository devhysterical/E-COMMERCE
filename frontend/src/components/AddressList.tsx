import { useTranslation } from "react-i18next";
import {
  MapPin,
  Star,
  Pencil,
  Trash2,
  Plus,
  Home,
  Building2,
  MapPinned,
} from "lucide-react";
import type { Address } from "../services/api.service";

interface AddressListProps {
  addresses: Address[];
  onAdd: () => void;
  onEdit: (address: Address) => void;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
  isLoading?: boolean;
}

function getLabelIcon(label: string) {
  switch (label.toLowerCase()) {
    case "home":
      return <Home className="h-4 w-4" />;
    case "office":
      return <Building2 className="h-4 w-4" />;
    default:
      return <MapPinned className="h-4 w-4" />;
  }
}

export default function AddressList({
  addresses,
  onAdd,
  onEdit,
  onDelete,
  onSetDefault,
  isLoading,
}: AddressListProps) {
  const { t } = useTranslation();

  const formatAddress = (addr: Address) => {
    const parts = [addr.street, addr.ward, addr.district, addr.province].filter(
      Boolean,
    );
    return parts.join(", ");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t("address.title")}
        </h3>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          {t("address.add")}
        </button>
      </div>

      {/* Address List */}
      {addresses.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-gray-300 py-12 text-center dark:border-gray-600">
          <MapPin className="mx-auto mb-3 h-12 w-12 text-gray-400" />
          <p className="text-gray-500 dark:text-gray-400">
            {t("address.empty")}
          </p>
          <button
            onClick={onAdd}
            className="mt-4 text-blue-600 hover:underline dark:text-blue-400">
            {t("address.addFirst")}
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`group relative rounded-xl border p-4 transition-all hover:shadow-md ${
                address.isDefault
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
              }`}>
              {/* Default Badge */}
              {address.isDefault && (
                <span className="absolute -top-2 right-3 flex items-center gap-1 rounded-full bg-blue-600 px-2 py-0.5 text-xs text-white">
                  <Star className="h-3 w-3" />
                  {t("address.default")}
                </span>
              )}

              {/* Label */}
              <div className="mb-2 flex items-center gap-2">
                <span className="flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                  {getLabelIcon(address.label)}
                  {t(`address.labels.${address.label.toLowerCase()}`)}
                </span>
              </div>

              {/* Details */}
              <p className="font-medium text-gray-900 dark:text-white">
                {address.fullName}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {address.phone}
              </p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {formatAddress(address)}
              </p>

              {/* Actions */}
              <div className="mt-3 flex items-center gap-2 border-t border-gray-100 pt-3 dark:border-gray-700">
                <button
                  onClick={() => onEdit(address)}
                  className="flex items-center gap-1 rounded-lg px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700">
                  <Pencil className="h-4 w-4" />
                  {t("common.edit")}
                </button>
                <button
                  onClick={() => onDelete(address.id)}
                  className="flex items-center gap-1 rounded-lg px-2 py-1 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20">
                  <Trash2 className="h-4 w-4" />
                  {t("common.delete")}
                </button>
                {!address.isDefault && (
                  <button
                    onClick={() => onSetDefault(address.id)}
                    className="ml-auto text-sm text-blue-600 hover:underline dark:text-blue-400">
                    {t("address.setAsDefault")}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
