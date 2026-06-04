import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Props = {
  onSearch: (query: string) => void;
  loading: boolean;
};

export function SearchBar({ onSearch, loading }: Props) {
  const [query, setQuery] = useState("");

  function handleSubmit(e: React.BaseSyntheticEvent) {
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
        aria-label="Search for a book"
      />
      <Button type="submit" disabled={loading || !query.trim()}>
        {loading ? "Searching…" : "Search"}
      </Button>
    </form>
  );
}
