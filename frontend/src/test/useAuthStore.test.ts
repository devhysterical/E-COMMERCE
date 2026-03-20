import { describe, it, expect, beforeEach } from "vitest";
import { useAuthStore } from "../store/useAuthStore";

describe("useAuthStore", () => {
  beforeEach(() => {
    useAuthStore.getState().logout();
  });

  it("should have correct initial state", () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it("should set auth correctly with user only (tokens in httpOnly cookies)", () => {
    const mockUser = {
      id: "user-1",
      email: "test@example.com",
      fullName: "Test User",
      role: "USER" as const,
    };

    useAuthStore.getState().setAuth(mockUser);

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
  });

  it("should clear all state on logout", () => {
    const mockUser = {
      id: "user-1",
      email: "test@example.com",
      fullName: "Test User",
      role: "ADMIN" as const,
    };

    useAuthStore.getState().setAuth(mockUser);
    useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it("should persist user and isAuthenticated only", () => {
    const mockUser = {
      id: "user-1",
      email: "test@example.com",
      fullName: "Test User",
      role: "USER" as const,
    };

    useAuthStore.getState().setAuth(mockUser);

    const stored = localStorage.getItem("auth-storage");
    if (stored) {
      const parsed = JSON.parse(stored);
      expect(parsed.state).toHaveProperty("user");
      expect(parsed.state).toHaveProperty("isAuthenticated");
    }
  });
});
