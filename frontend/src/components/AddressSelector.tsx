import { useTranslation } from "react-i18next";
import { MapPin, ChevronDown, Check, Plus } from "lucide-react";
import { useState } from "react";
import type { Address } from "../services/api.service";

interface AddressSelectorProps {
  addresses: Address[];
  selectedId: string | null;
  onSelect: (address: Address) => void;
  onAddNew: () => void;
  isLoading?: boolean;
}

export default function AddressSelector({
  addresses,
  selectedId,
  onSelect,
  onAddNew,
  isLoading,
}: AddressSelectorProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const selectedAddress = addresses.find((a) => a.id === selectedId);
  const defaultAddress = addresses.find((a) => a.isDefault);

  const formatAddress = (addr: Address) => {
    return [addr.street, addr.ward, addr.district, addr.province]
      .filter(Boolean)
      .join(", ");
  };

  if (isLoading) {
    return (
      <div className="animate-pulse rounded-lg bg-gray-100 p-4 dark:bg-gray-700">
        <div className="h-5 w-1/3 rounded bg-gray-300 dark:bg-gray-600" />
        <div className="mt-2 h-4 w-2/3 rounded bg-gray-300 dark:bg-gray-600" />
      </div>
    );
  }

  if (addresses.length === 0) {
    return (
      <button
        onClick={onAddNew}
        className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 py-8 text-gray-500 transition-colors hover:border-blue-400 hover:text-blue-600 dark:border-gray-600 dark:hover:border-blue-500">
        <Plus className="h-5 w-5" />
        {t("address.addShipping")}
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-start justify-between rounded-lg border border-gray-300 bg-white p-4 text-left transition-colors hover:border-blue-400 dark:border-gray-600 dark:bg-gray-800">
        <div className="flex items-start gap-3">
          <MapPin className="mt-1 h-5 w-5 flex-shrink-0 text-blue-600" />
          <div>
            {selectedAddress ? (
              <>
                <p className="font-medium text-gray-900 dark:text-white">
                  {selectedAddress.fullName} - {selectedAddress.phone}
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {formatAddress(selectedAddress)}
                </p>
              </>
            ) : defaultAddress ? (
              <>
                <p className="font-medium text-gray-900 dark:text-white">
                  {defaultAddress.fullName} - {defaultAddress.phone}
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {formatAddress(defaultAddress)}
                </p>
              </>
            ) : (
              <p className="text-gray-500">{t("address.selectShipping")}</p>
            )}
          </div>
        </div>
        <ChevronDown
          className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-20 mt-2 max-h-80 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
          {addresses.map((addr) => (
            <button
              key={addr.id}
              type="button"
              onClick={() => {
                onSelect(addr);
                setIsOpen(false);
              }}
              className="flex w-full items-start gap-3 border-b border-gray-100 p-4 text-left transition-colors hover:bg-gray-50 last:border-b-0 dark:border-gray-700 dark:hover:bg-gray-700">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {addr.fullName}
                  </p>
                  {addr.isDefault && (
                    <span className="rounded bg-blue-100 px-1.5 py-0.5 text-xs text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                      {t("address.default")}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {addr.phone}
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {formatAddress(addr)}
                </p>
              </div>
              {(selectedId === addr.id || (!selectedId && addr.isDefault)) && (
                <Check className="h-5 w-5 text-blue-600" />
              )}
            </button>
          ))}

          {/* Add New */}
          <button
            type="button"
            onClick={() => {
              onAddNew();
              setIsOpen(false);
            }}
            className="flex w-full items-center gap-2 p-4 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20">
            <Plus className="h-5 w-5" />
            {t("address.addNew")}
          </button>
        </div>
      )}
    </div>
  );
}
