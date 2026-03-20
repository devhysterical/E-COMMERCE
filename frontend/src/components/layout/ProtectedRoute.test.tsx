import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuthStore } from "../../store/useAuthStore";

// Mock Navbar và SessionTimeoutModal để isolate ProtectedRoute logic
vi.mock("./Navbar", () => ({
  default: () => <nav data-testid="navbar">Navbar</nav>,
}));

vi.mock("../SessionTimeoutModal", () => ({
  default: ({ isOpen }: { isOpen: boolean }) =>
    isOpen ? <div data-testid="timeout-modal" /> : null,
}));

vi.mock("../../hooks/useIdleTimeout", () => ({
  useIdleTimeout: () => {},
}));

// Import AFTER mocks
import ProtectedRoute from "./ProtectedRoute";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const renderWithRouter = (
  ui: React.ReactElement,
  { route = "/" } = {},
) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route path="/" element={ui} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

describe("ProtectedRoute", () => {
  beforeEach(() => {
    useAuthStore.getState().logout();
  });

  it("should redirect to /login when not authenticated", () => {
    renderWithRouter(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>,
    );

    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });

  it("should render children when authenticated", () => {
    useAuthStore.getState().setAuth(
      {
        id: "user-1",
        email: "test@example.com",
        fullName: "Test User",
        role: "USER",
      },
    );

    renderWithRouter(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>,
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
    expect(screen.getByTestId("navbar")).toBeInTheDocument();
  });

  it("should redirect non-admin users when requireAdmin is true", () => {
    useAuthStore.getState().setAuth(
      {
        id: "user-1",
        email: "test@example.com",
        fullName: "Test User",
        role: "USER",
      },
    );

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={["/admin"]}>
          <Routes>
            <Route path="/" element={<div>Home</div>} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <div>Admin Content</div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(screen.queryByText("Admin Content")).not.toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();
  });

  it("should render admin content for admin users", () => {
    useAuthStore.getState().setAuth(
      {
        id: "admin-1",
        email: "admin@example.com",
        fullName: "Admin User",
        role: "ADMIN",
      },
    );

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={["/admin"]}>
          <Routes>
            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <div>Admin Content</div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(screen.getByText("Admin Content")).toBeInTheDocument();
  });
});
