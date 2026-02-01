import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
import type { Address, CreateAddressData } from "../services/api.service";

interface AddressFormProps {
  address?: Address;
  onSubmit: (data: CreateAddressData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const LABEL_OPTIONS = ["Home", "Office", "Other"];

export default function AddressForm({
  address,
  onSubmit,
  onCancel,
  isLoading,
}: AddressFormProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<CreateAddressData>({
    label: "Home",
    fullName: "",
    phone: "",
    province: "",
    district: "",
    ward: "",
    street: "",
    isDefault: false,
  });

  useEffect(() => {
    if (address) {
      setFormData({
        label: address.label,
        fullName: address.fullName,
        phone: address.phone,
        province: address.province,
        district: address.district,
        ward: address.ward || "",
        street: address.street,
        isDefault: address.isDefault,
      });
    }
  }, [address]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 dark:bg-gray-800">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {address ? t("address.edit") : t("address.add")}
          </h3>
          <button
            onClick={onCancel}
            className="rounded-lg p-1 hover:bg-gray-100 dark:hover:bg-gray-700">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Label */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("address.label")}
            </label>
            <select
              name="label"
              value={formData.label}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white">
              {LABEL_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {t(`address.labels.${opt.toLowerCase()}`)}
                </option>
              ))}
            </select>
          </div>

          {/* Full Name */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("address.fullName")}
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("address.phone")}
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Province & District */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("address.province")}
              </label>
              <input
                type="text"
                name="province"
                value={formData.province}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("address.district")}
              </label>
              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Ward */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("address.ward")}
            </label>
            <input
              type="text"
              name="ward"
              value={formData.ward}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Street */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("address.street")}
            </label>
            <input
              type="text"
              name="street"
              value={formData.street}
              onChange={handleChange}
              required
              placeholder={t("address.streetPlaceholder")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Is Default */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isDefault"
              id="isDefault"
              checked={formData.isDefault}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300"
            />
            <label
              htmlFor="isDefault"
              className="text-sm text-gray-700 dark:text-gray-300">
              {t("address.setDefault")}
            </label>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
              {t("common.cancel")}
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50">
              {isLoading ? t("common.saving") : t("common.save")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
