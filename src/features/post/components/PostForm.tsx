"use client"

import { useActionState, useRef } from "react";
import { redirect } from "next/navigation";
import { PostApp } from "@/features/post/actions/post.action";
import { CategoryWithAppsDTO } from "@/types/category";

interface Props {
    isLoggedIn: boolean;
    categoryName: string[];
}

interface BooleanSelectProps {
    name: string;
    labelTrue: string;
    labelFalse: string;
}

function BooleanSelect({ name, labelTrue, labelFalse }: BooleanSelectProps) {
    return (
        <select name={name}>
            <option value="TRUE">{labelTrue}</option>
            <option value="FALSE">{labelFalse}</option>
        </select>
    )
}

export default function PostForm({ isLoggedIn, categoryName }: Props) {
    if (!isLoggedIn) {
        redirect("/signup");
    }
    const formRef = useRef<HTMLFormElement>(null);
    const [state, formAction, isPending] = useActionState(
        async (_prev: { error: string | null }, formData: FormData) => {
            const result = await PostApp(formData);
            if (!result.error) {
                formRef.current?.reset();
            }
            return result;
        },
        { error: null }
    );

    const platforms = [
        "Web",
        "iOS",
        "Android",
        "Windows",
        "Mac",
        "Linux",
        "Chrome Extension",
        "Firefox Extension",
        "Edge Extension",
        "Safari Extension",
        "Other",
    ];

    const pricingTypes = [
        "無料",
        "無料プランあり",
        "有料",
        "その他",
    ];
    return (
        <>
            <h1 className="text-xl font-bold text-gray-900 mb-2">投稿ページ</h1>
            <p className="text-sm text-gray-500">新しいアプリを登録しましょう</p>
            <form ref={formRef} action={formAction}>
                <input type="text" name="name" placeholder="アプリ名" />
                <input type="text" name="description" placeholder="アプリの説明" />
                <input type="text" name="url" placeholder="アプリのURL" />
                <select name="category" >
                    <option value="">カテゴリ</option>
                    {categoryName.map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
                <select name="platform" >
                    <option value="">プラットフォーム</option>
                    {platforms.map((platform) => (
                        <option key={platform} value={platform}>
                            {platform}
                        </option>
                    ))}
                </select>
                {/* TODO: isJpSupport,hasFreePlanをbooleanで表示は日本語対応、無料プランあり。Supabaseに登録 */}
                <BooleanSelect name="isJpSupport" labelTrue="日本語対応" labelFalse="日本語非対応" />
                <BooleanSelect name="hasFreePlan" labelTrue="無料プランあり" labelFalse="無料プランなし" />
                <select name="pricingType">
                    <option value="">価格タイプ</option>
                    {pricingTypes.map((pricingType) => (
                        <option key={pricingType} value={pricingType}>
                            {pricingType}
                        </option>
                    ))}
                </select>
                <button type="submit" disabled={isPending}>{isPending ? "投稿中..." : "投稿する"}</button>
            </form>
        </>
    )
}
