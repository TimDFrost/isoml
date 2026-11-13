import Image from "next/image";
import { cn } from "@/lib/utils";

type IsoMlWordmarkProps = {
  className?: string;
  size?: "sm" | "md" | "lg" | "hero";
  priority?: boolean;
};

const sizes = {
  sm: {
    iso: "text-[1.35rem] tracking-tight",
    mark: "h-[1.55rem] w-auto",
    gap: "gap-1",
  },
  md: {
    iso: "text-[1.85rem] tracking-tight",
    mark: "h-[2.15rem] w-auto",
    gap: "gap-1.5",
  },
  lg: {
    iso: "text-[2.6rem] tracking-tight sm:text-[3rem]",
    mark: "h-[3.1rem] w-auto sm:h-[3.55rem]",
    gap: "gap-2",
  },
  hero: {
    iso: "text-[3.4rem] tracking-tight sm:text-[4.6rem] lg:text-[5.4rem]",
    mark: "h-[4rem] w-auto sm:h-[5.35rem] lg:h-[6.25rem]",
    gap: "gap-2 sm:gap-3",
  },
} as const;

export function IsoMlWordmark({
  className,
  size = "md",
  priority = false,
}: IsoMlWordmarkProps) {
  const token = sizes[size];

  return (
    <span
      className={cn(
        "inline-flex items-end font-display font-bold text-[var(--chrome)]",
        token.gap,
        className,
      )}
      aria-label="isoML"
    >
      <span className={cn("leading-none", token.iso)}>iso</span>
      <Image
        src="/brand/isoml-ml-mark.png"
        alt="ML"
        width={216}
        height={294}
        priority={priority}
        className={cn(
          "relative top-[0.08em] object-contain drop-shadow-[0_0_18px_rgba(200,220,255,0.22)]",
          token.mark,
        )}
      />
    </span>
  );
}
