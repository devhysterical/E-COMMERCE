import { Component, type ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import i18n from "../i18n";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("[ErrorBoundary]", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      const t = i18n.t.bind(i18n);

      return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 text-center max-w-md shadow-xl border border-slate-100 dark:border-slate-800">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full mb-6">
              <AlertTriangle size={32} className="text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
              {t("errorBoundary.title")}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              {t("errorBoundary.description")}
            </p>
            {import.meta.env.DEV && this.state.error && (
              <pre className="text-left bg-slate-50 dark:bg-slate-800 rounded-xl p-4 text-sm text-red-600 dark:text-red-400 mb-6 overflow-auto max-h-40 border border-slate-200 dark:border-slate-700">
                {this.state.error.message}
              </pre>
            )}
            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleRetry}
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors">
                <RefreshCw size={18} />
                {t("errorBoundary.retry")}
              </button>
              <button
                onClick={() => (window.location.href = "/")}
                className="px-5 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                {t("errorBoundary.backHome")}
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
