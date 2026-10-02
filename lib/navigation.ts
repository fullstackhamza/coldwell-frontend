export type NavLink = {
  label: string;
  href: string;
};

export type NavCategory = NavLink & {
  subcategories?: NavLink[];
  /** Shown at the bottom of a mega menu column, e.g. "Shop all Men" */
  viewAllHref?: string;
};

export const mainNav: NavCategory[] = [
  {
    label: "Men",
    href: "/men",
    viewAllHref: "/men",
    subcategories: [
      { label: "T-Shirts", href: "/men/t-shirts" },
      { label: "Shirts", href: "/men/shirts" },
      { label: "Jeans", href: "/men/jeans" },
      { label: "Trousers", href: "/men/trousers" },
      { label: "Hoodies", href: "/men/hoodies" },
      { label: "Jackets", href: "/men/jackets" },
      { label: "Accessories", href: "/men/accessories" },
    ],
  },
  {
    label: "Women",
    href: "/women",
    viewAllHref: "/women",
    subcategories: [
      { label: "T-Shirts", href: "/women/t-shirts" },
      { label: "Tops", href: "/women/tops" },
      { label: "Dresses", href: "/women/dresses" },
      { label: "Jeans", href: "/women/jeans" },
      { label: "Trousers", href: "/women/trousers" },
      { label: "Hoodies", href: "/women/hoodies" },
      { label: "Jackets", href: "/women/jackets" },
      { label: "Accessories", href: "/women/accessories" },
    ],
  },
  { label: "New Arrivals", href: "/new-arrivals" },
  { label: "Best Sellers", href: "/best-sellers" },
  { label: "Thrift", href: "/thrift" },
  { label: "Sale", href: "/sale" },
];

export const footerNav = {
  shop: [
    { label: "Shop All", href: "/shop" },
    { label: "Men", href: "/men" },
    { label: "Women", href: "/women" },
    { label: "New Arrivals", href: "/new-arrivals" },
    { label: "Best Sellers", href: "/best-sellers" },
    { label: "Thrift", href: "/thrift" },
    { label: "Sale", href: "/sale" },
  ] as NavLink[],
  help: [
    { label: "FAQ", href: "/faq" },
    { label: "Shipping & Returns", href: "/shipping-returns" },
    { label: "Track Order", href: "/track-order" },
    { label: "Contact Us", href: "/contact" },
  ] as NavLink[],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms & Conditions", href: "/terms" },
  ] as NavLink[],
};

/**
 * Resolves a URL slug like "t-shirts" back to its display label ("T-Shirts")
 * for a given gender, by looking it up in mainNav. Returns undefined if the
 * slug doesn't match any known subcategory — callers should treat that as a
 * 404.
 */
export function getSubcategoryLabel(
  gender: "Men" | "Women",
  slug: string,
): string | undefined {
  const category = mainNav.find((item) => item.label === gender);
  const match = category?.subcategories?.find(
    (sub) => sub.href === `/${gender.toLowerCase()}/${slug}`,
  );
  return match?.label;
}
