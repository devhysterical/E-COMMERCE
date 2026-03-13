import api from "../api/axios";

export interface Address {
  id: string;
  userId: string;
  label: string;
  fullName: string;
  phone: string;
  province: string;
  district: string;
  ward: string | null;
  street: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAddressData {
  label: string;
  fullName: string;
  phone: string;
  province: string;
  district: string;
  ward?: string;
  street: string;
  isDefault?: boolean;
}

export type UpdateAddressData = Partial<CreateAddressData>;

export const AddressService = {
  getAll: async (): Promise<Address[]> => {
    const response = await api.get("/addresses");
    return response.data;
  },

  getOne: async (id: string): Promise<Address> => {
    const response = await api.get(`/addresses/${id}`);
    return response.data;
  },

  create: async (data: CreateAddressData): Promise<Address> => {
    const response = await api.post("/addresses", data);
    return response.data;
  },

  update: async (id: string, data: UpdateAddressData): Promise<Address> => {
    const response = await api.patch(`/addresses/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/addresses/${id}`);
  },

  setDefault: async (id: string): Promise<Address> => {
    const response = await api.patch(`/addresses/${id}/default`);
    return response.data;
  },
};
