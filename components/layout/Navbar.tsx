"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { mainNav } from "@/lib/navigation";
import { SITE_NAME } from "@/lib/site-config";
import { useCart } from "@/components/cart/CartProvider";
import { useAuth } from "@/components/auth/AuthProvider";
import { MegaMenu } from "./MegaMenu";
import { MobileMenu } from "./MobileMenu";

export function Navbar() {
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const { itemCount } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const activeCategory = mainNav.find((item) => item.label === openCategory);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    const query = searchValue.trim();
    if (!query) return;
    setSearchOpen(false);
    router.push(`/shop?q=${encodeURIComponent(query)}`);
  }

  return (
    <header className="sticky top-0 z-50 bg-paper">
      {/* Trust bar — short and factual, not a marketing banner */}
      <div className="hidden border-b border-line bg-ink py-2 text-center text-xs tracking-wide text-paper md:block">
        Cash on delivery available nationwide · Free delivery over PKR{" "}
        {new Intl.NumberFormat("en-PK").format(5000)}
      </div>

      <div
        className="relative border-b border-line"
        onMouseLeave={() => setOpenCategory(null)}
      >
        <div className="container-page flex h-16 items-center justify-between md:h-20">
          {/* Mobile: menu trigger */}
          <button
            type="button"
            className="p-2 -ml-2 md:hidden"
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={22} strokeWidth={1.5} />
          </button>

          <Link
            href="/"
            className="font-display text-xl tracking-wide md:text-2xl"
          >
            {SITE_NAME}
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
            {mainNav.map((item) => (
              <div
                key={item.href}
                onMouseEnter={() => setOpenCategory(item.label)}
                onFocus={() => setOpenCategory(item.label)}
              >
                <Link
                  href={item.href}
                  className={`text-sm uppercase tracking-wide transition hover:text-oxblood ${
                    item.label === "Sale" ? "text-oxblood" : "text-ink"
                  }`}
                >
                  {item.label}
                </Link>
              </div>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-1 md:gap-2">
            <button
              type="button"
              aria-label={searchOpen ? "Close search" : "Search"}
              aria-expanded={searchOpen}
              onClick={() => setSearchOpen((v) => !v)}
              className="rounded-sm p-2 transition hover:bg-sand"
            >
              {searchOpen ? (
                <X size={20} strokeWidth={1.5} />
              ) : (
                <Search size={20} strokeWidth={1.5} />
              )}
            </button>
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="rounded-sm p-2 transition hover:bg-sand"
            >
              <Heart size={20} strokeWidth={1.5} />
            </Link>
            <Link
              href="/account"
              aria-label={user ? "Account" : "Log in"}
              className="relative hidden rounded-sm p-2 transition hover:bg-sand md:inline-flex"
            >
              <User size={20} strokeWidth={1.5} />
              {user && (
                <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-oxblood" />
              )}
            </Link>
            <Link
              href="/cart"
              aria-label={`Cart, ${itemCount} items`}
              className="relative rounded-sm p-2 transition hover:bg-sand"
            >
              <ShoppingBag size={20} strokeWidth={1.5} />
              <AnimatePresence>
                {itemCount > 0 && (
                  <motion.span
                    key={itemCount}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 20 }}
                    className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-oxblood text-[10px] text-paper"
                  >
                    {itemCount > 9 ? "9+" : itemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          </div>
        </div>

        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="overflow-hidden border-b border-line bg-paper"
            >
              <form
                onSubmit={handleSearchSubmit}
                className="container-page flex items-center gap-3 py-4"
              >
                <Search size={18} strokeWidth={1.5} className="text-ink-soft" />
                <input
                  autoFocus
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Search products…"
                  aria-label="Search products"
                  className="flex-1 bg-transparent text-sm text-ink placeholder:text-ink-soft focus:outline-none"
                />
                <button
                  type="submit"
                  className="text-xs uppercase tracking-wide text-ink transition hover:text-oxblood"
                >
                  Search
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {activeCategory && (
            <MegaMenu key={activeCategory.label} category={activeCategory} />
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {mobileOpen && <MobileMenu onClose={() => setMobileOpen(false)} />}
      </AnimatePresence>
    </header>
  );
}
