import Image from "next/image";
import { cn } from "@/lib/utils";

type OhYaAttributionProps = {
  className?: string;
};

/**
 * Exact legal line with the full “Ya” wordmark image.
 * Reads as: isoML, a subsidiary of Oh Ya Inc, est. 2024
 */
export function OhYaAttribution({ className }: OhYaAttributionProps) {
  return (
    <p
      className={cn(
        "inline-flex flex-wrap items-baseline gap-x-1.5 text-sm text-[var(--ink-soft)]",
        className,
      )}
    >
      <span>isoML, a subsidiary of Oh</span>
      <Image
        src="/brand/oh-ya-ya-mark.png"
        alt="Ya"
        width={126}
        height={85}
        className="relative top-[0.18em] inline-block h-[1.15em] w-auto object-contain brightness-0 invert opacity-95"
      />
      <span>Inc, est. 2024</span>
    </p>
  );
}
