import api from "../api/axios";

export interface UserProfile {
  id: string;
  email: string;
  fullName: string | null;
  phone: string | null;
  address: string | null;
  dateOfBirth: string | null;
  avatarUrl: string | null;
  role: string;
  createdAt: string;
}

export const UserService = {
  getProfile: async (): Promise<UserProfile> => {
    const response = await api.get("/users/profile");
    return response.data;
  },
  updateProfile: async (data: {
    fullName?: string;
    phone?: string;
    address?: string;
    dateOfBirth?: string;
    avatarUrl?: string;
  }): Promise<UserProfile> => {
    const response = await api.patch("/users/profile", data);
    return response.data;
  },
  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<{ message: string }> => {
    const response = await api.patch("/users/change-password", data);
    return response.data;
  },
  getAllAdmin: async (): Promise<UserProfile[]> => {
    const response = await api.get("/admin/users");
    return response.data;
  },
};
