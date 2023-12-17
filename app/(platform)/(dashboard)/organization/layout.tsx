import { PropsWithChildren } from "react";
import { Sidebar } from "../_components/sidebar";

export default function OrganizationLayout({ children }: PropsWithChildren) {
  return (
    <main className="pt-20 md:pt-24 px-4 w-4/5 mx-auto grow flex">
      <div className="flex gap-x-7 grow">
        <div className="w-64 shrink-0 md:block hidden">
          <Sidebar />
        </div>
        {children}
      </div>
    </main>
  );
}
