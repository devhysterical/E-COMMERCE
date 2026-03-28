import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ShoppingBag, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "../hooks/useTheme";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
  const { t } = useTranslation();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-white">
      {/* Left Side - Hero/Branding */}
      <div
        className={`hidden lg:flex lg:w-1/2 relative overflow-hidden border-r ${
          isDark
            ? "border-slate-800 bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.28),_transparent_32%),linear-gradient(160deg,_#020617_0%,_#0f172a_45%,_#111827_100%)]"
            : "border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(79,70,229,0.22),_transparent_30%),linear-gradient(160deg,_#eef2ff_0%,_#f8fafc_50%,_#e0f2fe_100%)]"
        }`}>
        {/* Animated Background Blobs */}
        <div className="absolute inset-0">
          <div
            className={`absolute top-1/4 -left-20 h-80 w-80 rounded-full blur-3xl animate-pulse ${
              isDark ? "bg-indigo-500/18" : "bg-indigo-400/20"
            }`}
          />
          <div
            className={`absolute bottom-1/4 right-10 h-96 w-96 rounded-full blur-3xl animate-pulse delay-1000 ${
              isDark ? "bg-cyan-400/10" : "bg-sky-300/28"
            }`}
          />
          <div
            className={`absolute top-1/2 left-1/3 h-64 w-64 rounded-full blur-3xl animate-pulse delay-500 ${
              isDark ? "bg-violet-400/14" : "bg-fuchsia-300/18"
            }`}
          />
        </div>

        {/* Grid Pattern Overlay */}
        <div
          className={`absolute inset-0 ${isDark ? "opacity-15" : "opacity-20"}`}
          style={{
            backgroundImage: isDark
              ? `linear-gradient(rgba(148,163,184,0.12) 1px, transparent 1px),
                 linear-gradient(90deg, rgba(148,163,184,0.12) 1px, transparent 1px)`
              : `linear-gradient(rgba(99,102,241,0.08) 1px, transparent 1px),
                 linear-gradient(90deg, rgba(99,102,241,0.08) 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex w-full flex-col justify-between px-12 py-12">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className={`group inline-flex items-center gap-3 transition-opacity hover:opacity-85 ${
                isDark ? "text-white" : "text-slate-900"
              }`}>
              <div
                className={`rounded-2xl border p-4 backdrop-blur-sm transition-transform group-hover:scale-105 ${
                  isDark
                    ? "border-white/10 bg-white/5"
                    : "border-white/70 bg-white/75 shadow-lg shadow-indigo-100/80"
                }`}>
                <ShoppingBag
                  size={36}
                  className={isDark ? "text-indigo-200" : "text-indigo-600"}
                />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-500 dark:text-indigo-300">
                  L-TECH
                </p>
                <h2 className="text-3xl font-black tracking-tight italic">
                  SOLUTIONS.
                </h2>
              </div>
            </Link>
            <Link
              to="/"
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                isDark
                  ? "border-slate-700 bg-slate-900/70 text-slate-200 hover:bg-slate-800"
                  : "border-slate-200 bg-white/80 text-slate-700 hover:bg-white"
              }`}>
              <ArrowLeft size={16} />
              <span>{t("common.home")}</span>
            </Link>
          </div>

          <div className="mx-auto flex max-w-xl flex-1 flex-col justify-center text-center">
            <div
              className={`mx-auto mb-8 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium backdrop-blur-sm ${
                isDark
                  ? "border-indigo-400/20 bg-indigo-400/10 text-indigo-100"
                  : "border-indigo-200 bg-white/80 text-indigo-700"
              }`}>
              <Sparkles size={16} />
              <span>{title}</span>
            </div>

            <h1
              className={`text-5xl font-black leading-[1.05] tracking-tight ${
                isDark ? "text-white" : "text-slate-900"
              }`}>
              {t("authLayout.heroTitleLine1")}
              <br />
              <span className={isDark ? "text-indigo-200" : "text-indigo-600"}>
                {t("authLayout.heroTitleLine2")}
              </span>
            </h1>
            <p
              className={`mx-auto mt-6 max-w-lg text-lg leading-8 ${
                isDark ? "text-slate-300" : "text-slate-600"
              }`}>
              {t("authLayout.heroDescription")}
            </p>

            <div className="mt-10 grid grid-cols-3 gap-4 text-left">
              {[
                { value: "10K+", label: t("authLayout.stats.products") },
                { value: "50K+", label: t("authLayout.stats.customers") },
                { value: "99%", label: t("authLayout.stats.satisfaction") },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className={`rounded-2xl border px-5 py-4 backdrop-blur-sm ${
                    isDark
                      ? "border-slate-800 bg-slate-900/55"
                      : "border-white/80 bg-white/75 shadow-lg shadow-slate-200/60"
                  }`}>
                  <div
                    className={`text-3xl font-black ${
                      isDark ? "text-white" : "text-slate-900"
                    }`}>
                    {stat.value}
                  </div>
                  <div
                    className={`mt-1 text-sm ${
                      isDark ? "text-slate-400" : "text-slate-500"
                    }`}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="relative flex w-full items-center justify-center overflow-hidden bg-slate-50 p-6 sm:p-12 dark:bg-slate-950 lg:w-1/2">
        <div className="absolute right-6 top-6 z-20 flex items-center gap-3">
          <ThemeToggle />
        </div>

        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-70 dark:opacity-100">
          <div
            className={`absolute right-0 top-0 h-96 w-96 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 ${
              isDark ? "bg-indigo-500/18" : "bg-indigo-400/20"
            }`}
          />
          <div
            className={`absolute bottom-0 left-0 h-96 w-96 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 ${
              isDark ? "bg-sky-400/10" : "bg-cyan-300/25"
            }`}
          />
        </div>

        {/* Form Container */}
        <div className="w-full max-w-md relative z-10">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8 pt-14 sm:pt-10">
            <Link to="/" className="flex items-center gap-3">
              <div
                className={`rounded-xl p-3 ${
                  isDark
                    ? "bg-slate-900 ring-1 ring-slate-800"
                    : "bg-white shadow-lg shadow-slate-200/70"
                }`}>
                <ShoppingBag
                  size={24}
                  className={isDark ? "text-indigo-300" : "text-indigo-600"}
                />
              </div>
              <span className="text-xl font-black tracking-tight italic text-slate-900 dark:text-white">
                L-TECH SOLUTIONS.
              </span>
            </Link>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {title}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
              {subtitle}
            </p>
          </div>

          {/* Glassmorphism Card */}
          <div
            className={`rounded-3xl border p-8 backdrop-blur-xl ${
              isDark
                ? "border-slate-800/80 bg-slate-900/82 shadow-2xl shadow-slate-950/60"
                : "border-white/80 bg-white/82 shadow-2xl shadow-slate-200/55"
            }`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
