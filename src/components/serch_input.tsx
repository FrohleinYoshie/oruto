"use client"
import { useState } from "react"

export default function SearchInput() {
    const [search, setSearch] = useState("")

    return (
        <>
            <form onSubmit={(e) => e.preventDefault()}>
                <input type="text"
                    placeholder="検索"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)} />
                <button type="submit">検索</button>
            </form>
        </>
    )
}