import Link from "next/link";
import { Separator } from "@/components/ui/separator";

const footerLinks = {
  product: [
    { href: "#products", label: "Products" },
    { href: "#demo", label: "Demo" },
    { href: "#justice-engine", label: "Data Engine" },
    { href: "#partners", label: "Founding Partners" },
  ],
  company: [
    { href: "#founder", label: "Founder" },
    { href: "#pitch-deck", label: "Pitch Deck" },
    { href: "#faq", label: "FAQ" },
    { href: "mailto:contact@isoml.com", label: "Contact" },
  ],
  legal: [
    { href: "/terms", label: "Terms" },
    { href: "/privacy", label: "Privacy" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-navy-dark" role="contentinfo">
      <div className="container-max section-padding !py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-olive/20 text-lg font-bold text-olive-light">
                I
              </div>
              <div>
                <p className="font-semibold">ISOML</p>
                <p className="text-xs text-white/50">In Search of Modern Law</p>
              </div>
            </div>
            <p className="text-sm text-white/50">
              A product of Oh Ya Inc.
            </p>
            <p className="mt-4 text-sm text-white/40">
              AI-powered legal intelligence for discovery, precedent, sentencing transparency, and fairness analysis.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-white/80">Product</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/50 transition-colors hover:text-olive-light"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-white/80">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/50 transition-colors hover:text-olive-light"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/50 transition-colors hover:text-olive-light"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-white/80">Get Started</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#partners"
                  className="text-sm text-olive-light transition-colors hover:text-white"
                >
                  Request Demo
                </Link>
              </li>
              <li>
                <Link
                  href="#partners"
                  className="text-sm text-white/50 transition-colors hover:text-olive-light"
                >
                  Join Beta
                </Link>
              </li>
              <li>
                <a
                  href="mailto:contact@isoml.com"
                  className="text-sm text-white/50 transition-colors hover:text-olive-light"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} Oh Ya Inc. All rights reserved.
          </p>
          <div className="flex gap-6">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-white/40 transition-colors hover:text-white/60"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
