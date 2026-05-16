import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[Module Crash Caught]:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-10 bg-rose-50 border-2 border-dashed border-rose-200 rounded-[3rem] text-center">
          <div className="w-16 h-16 bg-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-rose-500">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          </div>
          <h2 className="text-xl font-black text-rose-900 mb-2 tracking-tight">Component Unavailable</h2>
          <p className="text-rose-600 font-medium text-sm mb-6">Something went wrong while rendering this section. Our team has been notified.</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-rose-500 text-white font-bold rounded-xl hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/20"
          >
            Refresh Dashboard
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
