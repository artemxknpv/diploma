import { OrganizationProfile } from "@clerk/nextjs";
import { Theme } from "@clerk/types";

export default function SettingsPage() {
  return (
    <div className="w-full">
      <OrganizationProfile appearance={ORG_PROFILE_APPEARANCE} />
    </div>
  );
}

const ORG_PROFILE_APPEARANCE: Theme = {
  elements: {
    rootBox: {
      boxShadow: "none",
      width: "100%",
    },
    card: {
      border: "1px solid #e5e5e5",
      boxShadow: "none",
      width: "100%",
    },
  },
};
