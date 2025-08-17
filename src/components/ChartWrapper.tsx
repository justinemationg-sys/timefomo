import React, { ErrorBoundary } from 'react';

interface ChartWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

class ChartErrorBoundary extends React.Component<
  ChartWrapperProps,
  { hasError: boolean }
> {
  constructor(props: ChartWrapperProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    console.warn('Chart rendering error:', error);
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.warn('Chart error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
          <span className="text-gray-500 dark:text-gray-400 text-sm">Chart Error</span>
        </div>
      );
    }

    return this.props.children;
  }
}

const ChartWrapper: React.FC<ChartWrapperProps> = ({ children, fallback }) => {
  return (
    <ChartErrorBoundary fallback={fallback}>
      {children}
    </ChartErrorBoundary>
  );
};

export default ChartWrapper;
