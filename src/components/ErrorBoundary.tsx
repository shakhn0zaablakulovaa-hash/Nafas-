import React, { Component, ErrorInfo, ReactNode } from "react";
import { ShieldAlert, RefreshCcw } from "lucide-react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  errorInfo: string | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorInfo: error.message };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      let displayMessage = "Kechirasiz, kutilmagan xatolik yuz berdi.";
      let isFirestoreError = false;

      try {
        const parsed = JSON.parse(this.state.errorInfo || "");
        if (parsed.error && parsed.operationType) {
          isFirestoreError = true;
          displayMessage = `Xavfsizlik xatosi: ${parsed.operationType} amali bajarilmadi. Iltimos, ruxsatlaringizni tekshiring.`;
        }
      } catch (e) {
        // Not a JSON error
      }

      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-6 bg-background">
          <div className="w-20 h-20 bg-error/10 text-error rounded-full flex items-center justify-center">
            <ShieldAlert size={48} />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-on-surface">Xatolik yuz berdi</h1>
            <p className="text-on-surface-variant max-w-md mx-auto">
              {displayMessage}
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-bold shadow-lg"
          >
            <RefreshCcw size={20} /> Sahifani yangilash
          </button>
          
          {isFirestoreError && (
            <div className="mt-8 p-4 bg-surface-container-low rounded-lg text-left max-w-lg overflow-auto">
              <p className="text-[10px] font-mono text-outline-variant whitespace-pre-wrap">
                {this.state.errorInfo}
              </p>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
