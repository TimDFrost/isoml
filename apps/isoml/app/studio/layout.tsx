import type { Metadata } from "next";
import { StudioShell } from "@/components/studio/StudioShell";

export const metadata: Metadata = {
  title: "Private Studio",
  description:
    "isoML private studio — data, interviews, insights, twin builder, playground, Reachy Mini, and outbox.",
  alternates: { canonical: "https://isoml.com/studio" },
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StudioShell>{children}</StudioShell>;
}
