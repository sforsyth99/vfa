type Ticket = { price_min: number | null; price_max: number | null };

function fmt(n: number) {
  return Number.isInteger(n) ? `$${n}` : `$${n.toFixed(2)}`;
}

export function formatTicketPrice(tickets: Ticket[], freeLabel: string): string | null {
  const priced = tickets.filter((t) => t.price_min !== null);
  if (priced.length === 0) return null;

  const lo = Math.min(...priced.map((t) => t.price_min as number));
  const hi = Math.max(...priced.map((t) => t.price_max ?? (t.price_min as number)));

  if (hi === 0) return freeLabel;
  return lo === hi ? fmt(lo) : `${fmt(lo)}–${fmt(hi)}`;
}
