import React from "react";
import { RefreshCw, AlertTriangle } from "lucide-react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      errorId: Date.now(),
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    });

    if (this.props.onRetry) {
      this.props.onRetry();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleRetry);
      }

      return (
        <div className="p-6 max-w-lg mx-auto mt-8 rounded-xl shadow-lg bg-app-card border border-app-card-border text-app-text transition-colors">
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-rose-50 border border-rose-300 dark:bg-rose-950/40 dark:border-rose-800 text-rose-800 dark:text-rose-200 flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm">Something went wrong!</h4>
                <p className="text-xs mt-1 text-rose-700 dark:text-rose-300">
                  {this.props.message ||
                    "An unexpected error occurred in this component."}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-bold text-rose-600 dark:text-rose-400">
                Component Error
              </h3>

              <p className="text-xs text-app-muted">
                Error ID: {this.state.errorId}
              </p>

              {this.props.showDetails && this.state.error && (
                <div className="p-3 bg-app-surface border border-app-border rounded-lg text-xs font-mono overflow-auto max-h-48 text-app-text">
                  <p className="font-bold mb-1 text-rose-600 dark:text-rose-400">
                    Error Details:
                  </p>
                  <p className="text-rose-700 dark:text-rose-300">{this.state.error.toString()}</p>
                  {this.state.errorInfo && (
                    <>
                      <p className="font-bold mt-3 mb-1 text-app-muted">
                        Component Stack:
                      </p>
                      <p className="text-app-muted whitespace-pre-wrap">
                        {this.state.errorInfo.componentStack}
                      </p>
                    </>
                  )}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <button
                  onClick={this.handleRetry}
                  className="flex items-center justify-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </button>

                {this.props.showReportButton && (
                  <button
                    onClick={() => console.log("Report error clicked")}
                    className="px-4 py-2 border border-app-border text-app-text hover:bg-app-hover rounded-lg text-sm font-medium transition-colors"
                  >
                    Report Issue
                  </button>
                )}

                {this.props.onGoBack && (
                  <button
                    onClick={this.props.onGoBack}
                    className="px-4 py-2 text-app-muted hover:text-app-text rounded-lg text-sm font-medium transition-colors"
                  >
                    Go Back
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
