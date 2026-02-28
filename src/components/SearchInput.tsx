"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchInput() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-lg gap-2">
      <label htmlFor="search-input" className="sr-only">
        アプリ名を検索
      </label>
      <input
        id="search-input"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="アプリ名を入力（例: Evernote）"
        className="flex-1 border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-sky-500"
      />
      <button
        type="submit"
        className="bg-sky-500 text-white rounded-lg px-4 py-2 hover:bg-sky-600"
      >
        検索
      </button>
    </form>
  );
}
