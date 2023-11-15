"use client";

import { useParams } from "next/navigation";
import { useOrganizationList } from "@clerk/nextjs";
import { useEffect } from "react";

export function OrgControl() {
  const { organizationId } = useParams<{ organizationId: string }>();
  const { setActive } = useOrganizationList();

  useEffect(() => {
    if (!setActive) return;

    setActive({ organization: organizationId });
  }, [organizationId, setActive]);

  return null;
}
