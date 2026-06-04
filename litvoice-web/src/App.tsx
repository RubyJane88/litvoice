import { Home } from "./pages/Home";
import { ErrorBoundary } from "@/components/ErrorBoundary";

function App() {
  return (
    <div className="app">
      <h1>LitVoice</h1>
      <p>Personal free audiobook reader</p>
      <ErrorBoundary>
        <Home />
      </ErrorBoundary>
    </div>
  );
}

export default App;
