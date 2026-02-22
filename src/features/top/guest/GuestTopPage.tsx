import SearchInput from "@/components/serch_input"

export default function GuestTopPage() {
    return (
        <>
            <section className="flex flex-col items-center justify-center">
                <h1 className="font-bold text-2xl text-center">あのツールの代わり、みんな何使っている？</h1>
                <h2 className="text-center">Orutoは、みんなで「あのツールの代わり、みんな何使っている？」を共有するプラットフォームです。</h2>
                <SearchInput />
            </section>
        </>
    )
}
