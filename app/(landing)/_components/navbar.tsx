import { FC } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type NavbarProps = {};

export const Navbar: FC<NavbarProps> = () => {
  return (
    <nav className="fixed top-0 w-full h-14 p-4 border-b shadow-sm bg-white flex items-center">
      <div className="md:max-w-screen-xl mx-auto flex items-center w-full justify-between">
        [ICON] Navbar
        <div className="space-x-4 md:block md:w-auto flex items-center justify-between w-full">
          <Button asChild variant="outline">
            <Link href="/sign-in">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/sign-up">Register</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};
