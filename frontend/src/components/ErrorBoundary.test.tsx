import { beforeEach, describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ErrorBoundary from "./ErrorBoundary";
import i18n from "../i18n";

// Component luôn throw error để test ErrorBoundary
const ThrowError = ({ message = "Test error" }: { message?: string }) => {
  throw new Error(message);
};

// Component bình thường
const HappyChild = () => <div>All is well</div>;

describe("ErrorBoundary", () => {
  beforeEach(async () => {
    await i18n.changeLanguage("vi");
  });

  it("should render children when no error", () => {
    render(
      <ErrorBoundary>
        <HappyChild />
      </ErrorBoundary>,
    );

    expect(screen.getByText("All is well")).toBeInTheDocument();
  });

  it("should show fallback UI when child throws", () => {
    // Suppress console.error from ErrorBoundary
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowError message="Something broke" />
      </ErrorBoundary>,
    );

    expect(screen.getByText(i18n.t("errorBoundary.title"))).toBeInTheDocument();
    expect(
      screen.getByText(i18n.t("errorBoundary.description")),
    ).toBeInTheDocument();

    spy.mockRestore();
  });

  it("should have retry and home buttons", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>,
    );

    expect(screen.getByText(i18n.t("errorBoundary.retry"))).toBeInTheDocument();
    expect(screen.getByText(i18n.t("errorBoundary.backHome"))).toBeInTheDocument();

    spy.mockRestore();
  });

  it("should reset error state on retry click", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const user = userEvent.setup();

    let shouldThrow = true;
    const MaybeThrow = () => {
      if (shouldThrow) throw new Error("fail");
      return <div>Recovered</div>;
    };

    const { rerender } = render(
      <ErrorBoundary>
        <MaybeThrow />
      </ErrorBoundary>,
    );

    expect(screen.getByText(i18n.t("errorBoundary.title"))).toBeInTheDocument();

    // Fix: component sẽ re-render sau khi retry
    shouldThrow = false;
    await user.click(screen.getByText(i18n.t("errorBoundary.retry")));

    // After retry, ErrorBoundary resets state — re-render children
    rerender(
      <ErrorBoundary>
        <MaybeThrow />
      </ErrorBoundary>,
    );

    expect(screen.getByText("Recovered")).toBeInTheDocument();

    spy.mockRestore();
  });
});
