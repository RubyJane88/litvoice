import { WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export function OfflineFallback() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-16 flex flex-col items-center justify-center text-center gap-6">
      <div className="w-16 h-16 bg-muted/20 border border-border rounded-full flex items-center justify-center text-primary animate-pulse">
        <WifiOff className="w-8 h-8" />
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">You are offline</h1>
        <p className="text-sm text-muted-foreground max-w-sm">
          It looks like you don't have an active internet connection. Any books already saved to your reading list will still be available once cached.
        </p>
      </div>
      <Button
        onClick={() => window.location.reload()}
        className="px-6 py-2 text-sm"
      >
        Retry Connection
      </Button>
    </main>
  );
}

export default OfflineFallback;
