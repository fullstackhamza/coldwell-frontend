function AccordionSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <details className="border-b border-line py-4">
      <summary className="cursor-pointer list-none text-sm uppercase tracking-wide text-ink [&::-webkit-details-marker]:hidden">
        {title}
      </summary>
      <div className="mt-3 text-sm text-ink-soft">{children}</div>
    </details>
  );
}

export function ProductInfoAccordion() {
  return (
    <div className="border-t border-line">
      <AccordionSection title="Product Details">
        <ul className="flex flex-col gap-1">
          <li>100% cotton, pre-shrunk fabric</li>
          <li>Machine wash cold, tumble dry low</li>
          <li>Imported</li>
        </ul>
      </AccordionSection>
      <AccordionSection title="Shipping Information">
        <p>
          Standard delivery nationwide in 3–5 business days. Free delivery on
          orders over PKR 5,000. Cash on Delivery available everywhere.
        </p>
      </AccordionSection>
      <AccordionSection title="Return Information">
        <p>
          Easy 14-day returns on unworn items with tags attached. Start a
          return from your order history once it's delivered.
        </p>
      </AccordionSection>
    </div>
  );
}
