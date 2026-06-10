import { lazy, Suspense, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  useNavigate,
} from "react-router";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { House, Bookmark, Upload } from "lucide-react";

const Home = lazy(() => import("./pages/Home"));
const BookDetail = lazy(() => import("./pages/BookDetail"));
const ReadingList = lazy(() => import("./pages/ReadingList"));
const OfflineFallback = lazy(() => import("./pages/OfflineFallback"));
const MyBooks = lazy(() => import("./pages/MyBooks"));

function AppContent() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleOffline = () => {
      navigate("/offline");
    };

    const handleOnline = () => {
      // Go back to home or previous page
      navigate("/");
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    if (!navigator.onLine) {
      navigate("/offline");
    }

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background text-foreground pb-12">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/80 backdrop-blur-md">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
          <NavLink
            to="/"
            className="flex items-center gap-2 font-bold text-lg text-primary tracking-tight">
            <span>LitVoice</span>
          </NavLink>
          <nav className="flex items-center gap-1">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`
              }>
              <House className="w-4 h-4" />
              <span>Home</span>
            </NavLink>
            <NavLink
              to="/reading-list"
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`
              }>
              <Bookmark className="w-4 h-4" />
              <span>Saved</span>
            </NavLink>
            <NavLink
              to="/my-books"
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`
              }>
              <Upload className="w-4 h-4" />
              <span>My Books</span>
            </NavLink>
          </nav>
        </div>
      </header>

      {/* Routes */}
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
          path="/reading-list"
          element={
            <ErrorBoundary>
              <Suspense
                fallback={
                  <div className="max-w-2xl mx-auto px-4 py-8 text-sm text-muted-foreground">
                    <p>Loading...</p>
                  </div>
                }>
                <ReadingList />
              </Suspense>
            </ErrorBoundary>
          }
        />
        <Route
          path="/books/:olid"
          element={
            <ErrorBoundary>
              <Suspense
                fallback={
                  <div className="max-w-2xl mx-auto px-4 py-8 text-sm text-muted-foreground">
                    <p>Loading...</p>
                  </div>
                }>
                <BookDetail />
              </Suspense>
            </ErrorBoundary>
          }
        />
        <Route
          path="/offline"
          element={
            <ErrorBoundary>
              <Suspense
                fallback={
                  <div className="max-w-2xl mx-auto px-4 py-8 text-sm text-muted-foreground">
                    <p>Loading...</p>
                  </div>
                }>
                <OfflineFallback />
              </Suspense>
            </ErrorBoundary>
          }
        />

        <Route
          path="/my-books"
          element={
            <ErrorBoundary>
              <Suspense
                fallback={
                  <div className="max-w-2xl mx-auto px-4 py-8 text-sm text-muted-foreground">
                    <p>Loading...</p>
                  </div>
                }>
                <MyBooks />
              </Suspense>
            </ErrorBoundary>
          }
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
