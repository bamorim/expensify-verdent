import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import OrgLayoutClient from "./layout-client";

export default async function OrgLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  return <OrgLayoutClient>{children}</OrgLayoutClient>;
}
