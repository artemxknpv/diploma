import { PropsWithChildren } from "react";
import { Navbar } from "./_components/navbar";

export default function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <div className="h-full flex flex-col items-start">
      <Navbar />
      {children}
    </div>
  );
}
