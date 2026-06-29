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
import { PlayerProvider, usePlayer } from "@/context/playerContext";
import { AudioPlayer } from "@/components/AudioPlayer";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTheme } from "@/hooks/useTheme";

const Home        = lazy(() => import("./pages/Home"));
const BookDetail  = lazy(() => import("./pages/BookDetail"));
const ReadingList = lazy(() => import("./pages/ReadingList"));
const OfflineFallback = lazy(() => import("./pages/OfflineFallback"));
const MyBooks     = lazy(() => import("./pages/MyBooks"));

const fallback = (
  <div className="max-w-2xl mx-auto px-4 py-8 text-sm text-muted-foreground">
    <p>Loading…</p>
  </div>
);

function AppContent() {
  const navigate = useNavigate();
  const { activeBook, stopPlaying } = usePlayer();
  const { theme, toggle } = useTheme();

  useEffect(() => {
    const handleOffline = () => navigate("/offline");
    const handleOnline  = () => navigate("/");
    window.addEventListener("offline", handleOffline);
    window.addEventListener("online",  handleOnline);
    if (!navigator.onLine) navigate("/offline");
    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online",  handleOnline);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background text-foreground pb-12">
      <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/80 backdrop-blur-md">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
          <NavLink
            to="/"
            className="flex items-center gap-2 font-heading font-bold text-lg text-primary tracking-tight">
            <span>LitVoice</span>
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
          </NavLink>

          <div className="flex items-center gap-2">
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
            <ThemeToggle theme={theme} onToggle={toggle} />
          </div>
        </div>
      </header>

      <Routes>
        <Route path="/" element={
          <ErrorBoundary><Suspense><Home /></Suspense></ErrorBoundary>
        } />
        <Route path="/reading-list" element={
          <ErrorBoundary><Suspense fallback={fallback}><ReadingList /></Suspense></ErrorBoundary>
        } />
        <Route path="/books/:olid" element={
          <ErrorBoundary><Suspense fallback={fallback}><BookDetail /></Suspense></ErrorBoundary>
        } />
        <Route path="/offline" element={
          <ErrorBoundary><Suspense fallback={fallback}><OfflineFallback /></Suspense></ErrorBoundary>
        } />
        <Route path="/my-books" element={
          <ErrorBoundary><Suspense fallback={fallback}><MyBooks /></Suspense></ErrorBoundary>
        } />
      </Routes>

      {activeBook && (
        <AudioPlayer
          text={activeBook.text}
          title={activeBook.title}
          startPosition={activeBook.startPosition}
          onPositionChange={activeBook.onPositionChange}
          onClose={() => stopPlaying()}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <PlayerProvider>
        <AppContent />
      </PlayerProvider>
    </BrowserRouter>
  );
}

export default App;
