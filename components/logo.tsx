import Link from "next/link";
import Image from "next/image";
import { Syncopate } from "next/font/google";
import { cn } from "@/lib";

const logoFont = Syncopate({
  subsets: ["latin"],
  weight: ["700"],
});

export function Logo() {
  return (
    <Link href="/">
      <div className="hover:opacity-75 transition items-center gap-x-2 hidden md:flex">
        <Image src="/logo.svg" width={30} alt="Logo" height={30} />
        <span className={cn(logoFont.className, "text-xl")}>Task</span>
      </div>
    </Link>
  );
}
