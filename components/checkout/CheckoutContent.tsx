"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import { useAuth } from "@/components/auth/AuthProvider";
import { computeTotals } from "@/lib/cart-utils";
import { formatPrice } from "@/lib/format";
import { isValidPakistaniPhone, isValidEmail } from "@/lib/validation";
import {
  createOrder,
  type PaymentMethod,
  type ShippingAddress,
} from "@/lib/orders";
import { ApiError } from "@/lib/api-client";
import { PAKISTAN_PROVINCES } from "@/lib/site-config";

type FormState = ShippingAddress & { paymentMethod: PaymentMethod };

const initialForm: FormState = {
  fullName: "",
  phone: "",
  email: "",
  street: "",
  city: "",
  province: PAKISTAN_PROVINCES[0],
  postalCode: "",
  paymentMethod: "cod",
};

const inputClass =
  "border border-line bg-paper px-3 py-2.5 text-sm text-ink placeholder:text-ink-soft focus:border-ink focus:outline-none";

export function CheckoutContent() {
  const router = useRouter();
  const { items, clearCart } = useCart();
  const { token, user } = useAuth();
  const [form, setForm] = useState<FormState>(initialForm);

  // Pre-fill contact info for a logged-in shopper, without clobbering
  // anything they've already typed.
  useEffect(() => {
    if (!user) return;
    setForm((f) => ({
      ...f,
      fullName: f.fullName || user.fullName,
      email: f.email || user.email,
    }));
  }, [user]);
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { subtotal, shipping, total } = computeTotals(items);

  function handleChange<K extends keyof FormState>(
    field: K,
    value: FormState[K],
  ) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.fullName.trim()) next.fullName = "Full name is required.";
    if (!isValidPakistaniPhone(form.phone)) {
      next.phone = "Please enter a valid Pakistani phone number.";
    }
    if (!isValidEmail(form.email)) {
      next.email = "Please enter a valid email address.";
    }
    if (!form.street.trim()) next.street = "Street address is required.";
    if (!form.city.trim()) next.city = "City is required.";
    if (!form.postalCode.trim()) next.postalCode = "Postal code is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    if (items.length === 0 || !validate()) return;

    setSubmitting(true);
    try {
      const order = await createOrder({
        items: items.map((item) => ({
          productSlug: item.productSlug,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
        })),
        address: {
          fullName: form.fullName,
          phone: form.phone,
          email: form.email,
          street: form.street,
          city: form.city,
          province: form.province,
          postalCode: form.postalCode,
        },
        paymentMethod: form.paymentMethod,
      }, token);
      clearCart();
      router.push(`/order-confirmation/${order.orderNumber}`);
    } catch (err) {
      setSubmitError(
        err instanceof ApiError
          ? err.message
          : "Something went wrong placing your order. Please try again.",
      );
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="container-page py-24 text-center">
        <h1 className="font-display text-3xl text-ink">
          Nothing to check out
        </h1>
        <p className="mt-2 text-sm text-ink-soft">Your cart is empty.</p>
        <Link
          href="/shop"
          className="mt-6 inline-block bg-ink px-7 py-3 text-sm uppercase tracking-wide text-paper transition hover:bg-oxblood"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page py-10 md:py-14">
      <h1 className="font-display text-3xl text-ink md:text-4xl">Checkout</h1>

      <form
        onSubmit={handlePlaceOrder}
        noValidate
        className="mt-8 grid gap-10 md:grid-cols-3"
      >
        <div className="flex flex-col gap-8 md:col-span-2">
          <section>
            <h2 className="text-sm uppercase tracking-wide text-ink">
              Contact Information
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Full Name" error={errors.fullName}>
                <input
                  className={inputClass}
                  value={form.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                  autoComplete="name"
                />
              </Field>
              <Field
                label="Phone Number"
                error={errors.phone}
                hint="e.g. 03XXXXXXXXX"
              >
                <input
                  className={inputClass}
                  value={form.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  autoComplete="tel"
                  placeholder="03XXXXXXXXX"
                />
              </Field>
              <Field label="Email" error={errors.email} className="sm:col-span-2">
                <input
                  type="email"
                  className={inputClass}
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  autoComplete="email"
                />
              </Field>
            </div>
          </section>

          <section>
            <h2 className="text-sm uppercase tracking-wide text-ink">
              Delivery Address
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field
                label="House / Street Address"
                error={errors.street}
                className="sm:col-span-2"
              >
                <input
                  className={inputClass}
                  value={form.street}
                  onChange={(e) => handleChange("street", e.target.value)}
                  autoComplete="street-address"
                />
              </Field>
              <Field label="City" error={errors.city}>
                <input
                  className={inputClass}
                  value={form.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  autoComplete="address-level2"
                />
              </Field>
              <Field label="Province">
                <select
                  className={inputClass}
                  value={form.province}
                  onChange={(e) => handleChange("province", e.target.value)}
                >
                  {PAKISTAN_PROVINCES.map((province) => (
                    <option key={province} value={province}>
                      {province}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Postal Code" error={errors.postalCode}>
                <input
                  className={inputClass}
                  value={form.postalCode}
                  onChange={(e) => handleChange("postalCode", e.target.value)}
                  autoComplete="postal-code"
                />
              </Field>
            </div>
          </section>

          <section>
            <h2 className="text-sm uppercase tracking-wide text-ink">
              Payment Method
            </h2>
            <div className="mt-4 flex flex-col gap-3">
              <PaymentOption
                value="cod"
                label="Cash on Delivery"
                hint="Pay in cash when your order arrives — the most popular option."
                current={form.paymentMethod}
                onSelect={(v) => handleChange("paymentMethod", v)}
              />
              <PaymentOption
                value="online"
                label="Online Payment"
                current={form.paymentMethod}
                onSelect={(v) => handleChange("paymentMethod", v)}
              />
              <PaymentOption
                value="bank-transfer"
                label="Bank Transfer"
                current={form.paymentMethod}
                onSelect={(v) => handleChange("paymentMethod", v)}
              />
            </div>
          </section>
        </div>

        <div className="h-fit border border-line p-6">
          <h2 className="text-sm uppercase tracking-wide text-ink">
            Order Summary
          </h2>
          <div className="mt-4 flex flex-col divide-y divide-line">
            {items.map((item) => (
              <div
                key={item.key}
                className="flex justify-between gap-3 py-3 text-sm first:pt-0"
              >
                <div>
                  <p className="text-ink">
                    {item.name} × {item.quantity}
                  </p>
                  <p className="text-xs text-ink-soft">
                    Size {item.size} · {item.color}
                  </p>
                </div>
                <span className="shrink-0 text-ink">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-2 flex flex-col gap-2 border-t border-line pt-4 text-sm">
            <div className="flex justify-between text-ink-soft">
              <span>Subtotal</span>
              <span className="text-ink">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-ink-soft">
              <span>Delivery Fee</span>
              <span className="text-ink">
                {shipping === 0 ? "Free" : formatPrice(shipping)}
              </span>
            </div>
            <div className="mt-2 flex justify-between border-t border-line pt-3 text-ink">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
          {submitError && (
            <p className="mt-4 text-xs text-oxblood">{submitError}</p>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full bg-ink py-3.5 text-sm uppercase tracking-wide text-paper transition hover:bg-oxblood disabled:opacity-60"
          >
            {submitting ? "Placing Order…" : "Place Order"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  error,
  hint,
  className,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`flex flex-col gap-1.5 ${className ?? ""}`}>
      <span className="text-xs uppercase tracking-wide text-ink-soft">
        {label}
      </span>
      {children}
      {hint && !error && (
        <span className="text-xs text-ink-soft">{hint}</span>
      )}
      {error && <span className="text-xs text-oxblood">{error}</span>}
    </label>
  );
}

function PaymentOption({
  value,
  label,
  hint,
  current,
  onSelect,
}: {
  value: PaymentMethod;
  label: string;
  hint?: string;
  current: PaymentMethod;
  onSelect: (value: PaymentMethod) => void;
}) {
  const active = current === value;
  return (
    <label
      className={`flex cursor-pointer items-start gap-3 border p-4 transition ${
        active ? "border-ink" : "border-line"
      }`}
    >
      <input
        type="radio"
        name="paymentMethod"
        checked={active}
        onChange={() => onSelect(value)}
        className="mt-0.5 h-4 w-4 accent-ink"
      />
      <span>
        <span className="block text-sm text-ink">{label}</span>
        {hint && <span className="block text-xs text-ink-soft">{hint}</span>}
      </span>
    </label>
  );
}
