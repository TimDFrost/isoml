export const OHYA_BRANDS = {
  yables: {
    name: "Yables",
    tagline: "Discover Yourself.",
    domain: "yables.com",
    footer: "Yables, a subsidiary of Oh Ya Inc, est. 2024",
  },
  isoml: {
    name: "isoML",
    meaning: "in search of Machine Learning",
    tagline: "Bring Yourself to Life.",
    domain: "isoml.com",
    footer: "isoML, a subsidiary of Oh Ya Inc, est. 2024",
    flagship: "Reachy Mini × You",
  },
} as const;

export function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${String(value)}`);
}
