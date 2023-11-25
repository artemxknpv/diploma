import { User } from "@clerk/backend";

export function generateUserFullName(user: User) {
  return `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || "unknown";
}
