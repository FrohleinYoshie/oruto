"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { searchApps } from "@/features/post/actions/search-apps.action";
import type { AppDTO } from "@/types/app";

interface Props {
  label: string;
  name: string; // hidden inputのname属性（例: "targetAppId"）
  onSelect: (app: AppDTO) => void;
  onRequestNew: () => void; // 「新規登録」ボタン押下時
  selectedApp: AppDTO | null;
  onClear: () => void;
  error?: string;
}

export default function AppSearchSelect({
  label,
  name,
  onSelect,
  onRequestNew,
  selectedApp,
  onClear,
  error,
}: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<AppDTO[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // デバウンス付き検索（onChangeハンドラ内で制御）
  const handleQueryChange = useCallback((value: string) => {
    setQuery(value);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (value.length < 1) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    timerRef.current = setTimeout(async () => {
      setIsSearching(true);
      const { apps } = await searchApps(value);
      setResults(apps);
      setIsOpen(true);
      setIsSearching(false);
    }, 300);
  }, []);

  // タイマーのクリーンアップ
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // 外側クリックでドロップダウンを閉じる
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // アプリ選択済みの場合
  if (selectedApp) {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-1.5">
          {label}
        </label>
        <div className="flex items-center gap-3 border border-sky-500 rounded-lg px-4 py-2.5">
          <input type="hidden" name={name} value={selectedApp.id} />
          <span className="flex-1 text-gray-900 font-medium">
            {selectedApp.name}
          </span>
          <button
            type="button"
            onClick={onClear}
            className="text-gray-500 hover:text-gray-900 text-sm"
          >
            変更
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef}>
      <label className="block text-sm font-medium text-gray-900 mb-1.5">
        {label}
      </label>
      <input
        type="text"
        value={query}
        onChange={(e) => handleQueryChange(e.target.value)}
        onFocus={() => {
          if (results.length > 0) setIsOpen(true);
        }}
        placeholder="アプリ名を入力して検索"
        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-base focus:outline-none focus:border-sky-500 transition-colors"
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

      {/* 検索結果ドロップダウン */}
      {isOpen && (
        <div className="border border-gray-200 rounded-lg mt-1 max-h-60 overflow-y-auto bg-white">
          {isSearching && (
            <div className="px-4 py-3 text-sm text-gray-500">検索中...</div>
          )}
          {!isSearching && results.length === 0 && query.length >= 1 && (
            <div className="px-4 py-3 text-sm text-gray-500">
              該当するアプリが見つかりません
            </div>
          )}
          {results.map((app) => (
            <button
              key={app.id}
              type="button"
              onClick={() => {
                onSelect(app);
                setQuery("");
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-3 hover:bg-sky-50 transition-colors border-b border-gray-200 last:border-b-0"
            >
              <span className="text-sm font-medium text-gray-900">
                {app.name}
              </span>
              <span className="text-xs text-gray-500 ml-2">
                {app.description.length > 40
                  ? `${app.description.slice(0, 40)}...`
                  : app.description}
              </span>
            </button>
          ))}
          {/* 新規登録ボタン */}
          <button
            type="button"
            onClick={() => {
              onRequestNew();
              setIsOpen(false);
            }}
            className="w-full text-left px-4 py-3 text-sky-500 hover:bg-sky-50 transition-colors text-sm font-medium"
          >
            + 新しいアプリを登録する
          </button>
        </div>
      )}
    </div>
  );
}
