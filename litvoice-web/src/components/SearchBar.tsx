import { useState } from "react";
import { Input } from "@/components/ui/input.js";
import { Button } from "@/components/ui/button.js";

type Props = {
  onSearch: (query: string) => void;
  loading: boolean;
};

export function SearchBar({ onSearch, loading }: Props) {
  const [query, setQuery] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) onSearch(query.trim());
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for a book..."
        disabled={loading}
      />
      <Button type="submit" disabled={loading || !query.trim()}>
        {loading ? "Searching…" : "Search"}
      </Button>
    </form>
  );
}
