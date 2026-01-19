import React from "react";
import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Hero/Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 overflow-hidden">
        {/* Animated Background Blobs */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-indigo-300/20 rounded-full blur-3xl animate-pulse delay-500" />
        </div>

        {/* Grid Pattern Overlay */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center w-full px-12 text-white">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 mb-12 group">
            <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl group-hover:scale-105 transition-transform">
              <ShoppingBag size={40} className="text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-black tracking-tight">L-TECH</h2>
              <p className="text-white/70 text-sm font-medium">SOLUTIONS</p>
            </div>
          </Link>

          {/* Tagline */}
          <div className="text-center max-w-md">
            <h1 className="text-4xl font-bold mb-6 leading-tight">
              Khám phá công nghệ
              <br />
              <span className="text-white/80">theo cách của bạn</span>
            </h1>
            <p className="text-white/70 text-lg">
              Nền tảng mua sắm điện tử hiện đại với hàng nghìn sản phẩm chất lượng cao
            </p>
          </div>

          {/* Features */}
          <div className="mt-12 grid grid-cols-3 gap-8 text-center">
            <div className="p-4">
              <div className="text-3xl font-bold">10K+</div>
              <div className="text-white/60 text-sm">Sản phẩm</div>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold">50K+</div>
              <div className="text-white/60 text-sm">Khách hàng</div>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold">99%</div>
              <div className="text-white/60 text-sm">Hài lòng</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-6 sm:p-12 relative overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </div>

        {/* Form Container */}
        <div className="w-full max-w-md relative z-10">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="p-3 bg-indigo-600 rounded-xl">
                <ShoppingBag size={24} className="text-white" />
              </div>
              <span className="text-xl font-black text-slate-900 dark:text-white">L-TECH</span>
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
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-slate-200/50 dark:shadow-slate-900/50 p-8 border border-white/50 dark:border-slate-700/50">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
