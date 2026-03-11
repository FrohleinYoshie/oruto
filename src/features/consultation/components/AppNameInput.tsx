"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { searchApps } from "@/features/post/actions/search-apps.action";
import type { AppDTO } from "@/types/app";

interface Props {
    error?: string;
}

/**
 * アプリ名入力コンポーネント
 * 検索で既存アプリが見つかればリンク、見つからなければテキストのまま送信
 */
export default function AppNameInput({ error }: Props) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<AppDTO[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedApp, setSelectedApp] = useState<AppDTO | null>(null);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleQueryChange = useCallback((value: string) => {
        setQuery(value);
        // 既存アプリの選択を解除
        setSelectedApp(null);

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

    // 選択済みの場合
    if (selectedApp) {
        return (
            <div>
                <label className="block text-sm font-medium text-gray-900 mb-1.5">
                    対象アプリ <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-3 border border-sky-500 rounded-lg px-4 py-2.5">
                    <input type="hidden" name="appName" value={selectedApp.name} />
                    <input type="hidden" name="targetAppId" value={selectedApp.id} />
                    <span className="flex-1 text-gray-900 font-medium">
                        {selectedApp.name}
                    </span>
                    <span className="text-xs text-sky-500">DB登録済み</span>
                    <button
                        type="button"
                        onClick={() => {
                            setSelectedApp(null);
                            setQuery(selectedApp.name);
                        }}
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
            <label htmlFor="appName" className="block text-sm font-medium text-gray-900 mb-1.5">
                対象アプリ <span className="text-red-500">*</span>
            </label>
            <input
                id="appName"
                type="text"
                name="appName"
                value={query}
                onChange={(e) => handleQueryChange(e.target.value)}
                onFocus={() => {
                    if (results.length > 0) setIsOpen(true);
                }}
                placeholder="困っているアプリ名を入力（例: Evernote, Notion）"
                maxLength={100}
                required
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-base focus:outline-none focus:border-sky-500 transition-colors"
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            {!error && query.length > 0 && !isOpen && (
                <p className="text-xs text-gray-500 mt-1">
                    DB未登録のアプリでもそのまま相談できます
                </p>
            )}

            {/* 検索結果ドロップダウン */}
            {isOpen && (
                <div className="border border-gray-200 rounded-lg mt-1 max-h-60 overflow-y-auto bg-white">
                    {isSearching && (
                        <div className="px-4 py-3 text-sm text-gray-500">検索中...</div>
                    )}
                    {!isSearching && results.length === 0 && query.length >= 1 && (
                        <div className="px-4 py-3 text-sm text-gray-500">
                            DBに登録されていないアプリです（このまま相談できます）
                        </div>
                    )}
                    {results.map((app) => (
                        <button
                            key={app.id}
                            type="button"
                            onClick={() => {
                                setSelectedApp(app);
                                setQuery(app.name);
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
                </div>
            )}
        </div>
    );
}
