// components/RouteErrorBoundary.jsx
// Catches render errors below it - most importantly a rejected React.lazy()
// route import (e.g. a chunk deleted by a redeploy), which Suspense does not
// handle. Without this, React unmounts the whole tree and leaves a blank page.
// Must be a class component: React has no hook equivalent for error boundaries.
import React from "react";
import env from "../utils/env";

class RouteErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Route render failed:", error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-4 text-center">
        <p className="text-lg">Something went wrong while loading this page.</p>
        <div className="flex gap-3">
          <button className="px-4 py-2 rounded bg-blue-600 text-white" onClick={() => window.location.reload()}>
            Reload
          </button>
          <button className="px-4 py-2 rounded border border-gray-400" onClick={() => window.location.assign(`/${env.ROOT_PATH().replace(/^\/|\/$/g, "")}`)}>
            Go home
          </button>
        </div>
      </div>
    );
  }
}

export default RouteErrorBoundary;
