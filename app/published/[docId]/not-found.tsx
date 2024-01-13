import Link from "next/link";

export default function NotFound() {
  return (
    <div className="w-full h-full flex flex-col gap-y-4 items-center justify-center">
      <h1 className="font-semibold text-2xl">Документ не найден :(</h1>
      <Link href="/" className="text-blue-600">
        На главную
      </Link>
    </div>
  );
}
