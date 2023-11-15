import { PropsWithChildren } from "react";
import { Navbar } from "./_components/navbar";

const LandingLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="h-full bg-slate-100">
      <Navbar />
      <main className="pt-40 pb-20 bg-slate-100">{children}</main>
      {/* Footer */}
    </div>
  );
};

export default LandingLayout;
