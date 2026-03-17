import { describe, it, expect, beforeEach } from "vitest";
import { useAuthStore } from "../store/useAuthStore";

describe("useAuthStore", () => {
  beforeEach(() => {
    // Reset store trước mỗi test
    useAuthStore.getState().logout();
  });

  it("should have correct initial state", () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.refreshToken).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it("should set auth correctly", () => {
    const mockUser = {
      id: "user-1",
      email: "test@example.com",
      fullName: "Test User",
      role: "USER" as const,
    };

    useAuthStore.getState().setAuth(mockUser, "access-token", "refresh-token");

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.token).toBe("access-token");
    expect(state.refreshToken).toBe("refresh-token");
    expect(state.isAuthenticated).toBe(true);
  });

  it("should update tokens without changing user", () => {
    const mockUser = {
      id: "user-1",
      email: "test@example.com",
      fullName: "Test User",
      role: "USER" as const,
    };

    useAuthStore.getState().setAuth(mockUser, "old-token", "old-refresh");
    useAuthStore.getState().setTokens("new-token", "new-refresh");

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.token).toBe("new-token");
    expect(state.refreshToken).toBe("new-refresh");
    expect(state.isAuthenticated).toBe(true);
  });

  it("should clear all state on logout", () => {
    const mockUser = {
      id: "user-1",
      email: "test@example.com",
      fullName: "Test User",
      role: "ADMIN" as const,
    };

    useAuthStore.getState().setAuth(mockUser, "token", "refresh");
    useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.refreshToken).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it("should not persist tokens in partialize", () => {
    // Verify partialize config chỉ lưu user + isAuthenticated
    const mockUser = {
      id: "user-1",
      email: "test@example.com",
      fullName: "Test User",
      role: "USER" as const,
    };

    useAuthStore.getState().setAuth(mockUser, "secret-token", "secret-refresh");

    // Simulate what persist stores (check localStorage)
    const stored = localStorage.getItem("auth-storage");
    if (stored) {
      const parsed = JSON.parse(stored);
      expect(parsed.state).not.toHaveProperty("token");
      expect(parsed.state).not.toHaveProperty("refreshToken");
      expect(parsed.state).toHaveProperty("user");
      expect(parsed.state).toHaveProperty("isAuthenticated");
    }
  });
});
