import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

type Props = {
  children: ReactNode;
  fallback?: ReactNode;
};

type State = {
  hasError: boolean;
  errorMessage: string | null;
};

export class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
    errorMessage: null,
  };

  static getDerivedStateFromError(error: unknown): State {
    const errorMessage =
      error instanceof Error ? error.message : "Something went wrong.";
    return { hasError: true, errorMessage };
  }

  componentDidCatch(error: unknown, info: ErrorInfo) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  handleRetry = () => {
    this.setState({ hasError: false, errorMessage: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div
            role="alert"
            className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-4">
            <h1 className="text-2xl font-bold">Something went wrong</h1>
            <p className="text-sm text-muted-foreground">
              A UI error occurred. You can retry without reloading the page.
            </p>
            {import.meta.env.DEV && this.state.errorMessage && (
              <p className="text-sm text-destructive">
                {this.state.errorMessage}
              </p>
            )}
            <Button onClick={this.handleRetry}>Retry</Button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
