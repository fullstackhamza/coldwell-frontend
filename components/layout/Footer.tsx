import Link from "next/link";
import { footerNav } from "@/lib/navigation";
import { SITE_NAME } from "@/lib/site-config";

export function Footer() {
  return (
    <footer className="border-t border-line bg-paper">
      <div className="container-page grid grid-cols-2 gap-x-8 gap-y-10 py-14 md:grid-cols-5">
        <div className="col-span-2">
          <p className="font-display text-xl tracking-wide">{SITE_NAME}</p>
          <p className="mt-3 max-w-[32ch] text-sm text-ink-soft">
            Considered clothing for daily wear, designed and shipped across
            Pakistan.
          </p>
          <form className="mt-6 flex max-w-sm border-b border-ink pb-2">
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              placeholder="Email address"
              className="w-full bg-transparent text-sm text-ink placeholder:text-ink-soft focus:outline-none"
            />
            <button
              type="submit"
              className="whitespace-nowrap text-sm font-medium text-ink transition hover:text-oxblood"
            >
              Sign up
            </button>
          </form>
        </div>

        <FooterColumn title="Shop" links={footerNav.shop} />
        <FooterColumn title="Help" links={footerNav.help} />
        <FooterColumn title="Company" links={footerNav.company} />
      </div>

      <div className="border-t border-line">
        <div className="container-page flex flex-col gap-3 py-6 text-xs text-ink-soft md:flex-row md:items-center md:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {SITE_NAME}. All rights
            reserved.
          </p>
          <p>Cash on Delivery · Online Payment · Bank Transfer</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-ink-soft">{title}</p>
      <ul className="mt-3 flex flex-col gap-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-ink transition hover:text-oxblood"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
