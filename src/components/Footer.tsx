import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-5xl mx-auto flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <Link href="/" className="text-lg font-bold text-sky-500">
          オルト
        </Link>
        <p className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} オルト
        </p>
      </div>
    </footer>
  );
}
