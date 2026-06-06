import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const Home = lazy(() => import("./pages/Home"));
const BookDetail = lazy(() => import("./pages/BookDetail"));

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <h1>LitVoice</h1>
        <p>Personal free audiobook reader</p>
        <Routes>
          <Route
            path="/"
            element={
              <ErrorBoundary>
                <Suspense>
                  <Home />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route
            path="/books/:olid"
            element={
              <ErrorBoundary>
                <Suspense fallback={<div className="px-4 py-8 text-sm text-muted-foreground"><p>Loading...</p></div>}>
                  <BookDetail />
                </Suspense>
              </ErrorBoundary>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
