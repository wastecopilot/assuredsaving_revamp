/**
 * Address autocomplete (MOCKED, no real lookup), modelled on the original one-pager:
 * sample addresses match first, and when fewer than 3 match, realistic US
 * addresses are built from whatever the visitor typed, so the list never goes empty.
 *
 * The address type (residential or business) is detected automatically from
 * the address itself. The visitor never has to choose it.
 */
import { ADDRESSES, type AddressType, type SampleAddress } from "@/data/catalog";

/** Words that mark a commercial address. Apartment markers (Apt, Unit, #) stay residential. */
const BUSINESS_HINTS =
  /\b(suite|ste\.?|floor|office|offices|plaza|center|centre|commerce|commercial|business|industrial|corporate|tower|mall|warehouse|depot|tech park|office park|business park|[A-Z]{2}-\d+|US-\d+|hwy|highway)\b/i;

export function detectAddressType(address: string): AddressType {
  return BUSINESS_HINTS.test(address) ? "business" : "residential";
}

/** City, state and ZIP used to complete what the visitor typed. */
const PLACES = [
  { city: "Austin", state: "TX", zip: "78745", timeZone: "America/Chicago", street: "Maple Ridge Dr" },
  { city: "Tampa", state: "FL", zip: "33602", timeZone: "America/New_York", street: "Harbor View Ave, Suite 300" },
  { city: "Raleigh", state: "NC", zip: "27601", timeZone: "America/New_York", street: "Commerce Park Way" },
  { city: "Sacramento", state: "CA", zip: "95814", timeZone: "America/Los_Angeles", street: "Orchard Lane" },
  { city: "Bozeman", state: "MT", zip: "59715", timeZone: "America/Denver", street: "County Road 14" },
];

const titleCase = (s: string) => s.replace(/\b([a-z])/g, (m) => m.toUpperCase());
export const formatAddress = (a: SampleAddress) => `${a.line1}, ${a.city}, ${a.state} ${a.zip}`;

export function getAddressSuggestions(query: string): SampleAddress[] {
  const q = query.trim();
  if (!q) return ADDRESSES;
  const words = q.toLowerCase().split(/\s+/);
  const base = ADDRESSES.filter((a) => words.every((w) => formatAddress(a).toLowerCase().includes(w)));
  if (base.length >= 3) return base.slice(0, 5);

  // Only the street part of what was typed (drop any city/state typed after a comma).
  const typed = titleCase(q.split(",")[0].replace(/\s+/g, " ").trim());
  const onlyNumber = /^\d+[A-Za-z]?$/.test(typed);
  const taken = new Set(base.map((a) => formatAddress(a).toLowerCase()));
  const built = PLACES.map((p, i): SampleAddress => {
    const line1 = onlyNumber ? `${typed} ${p.street}` : typed;
    return { id: `typed-${i}-${line1.toLowerCase()}`, line1, city: p.city, state: p.state, zip: p.zip, timeZone: p.timeZone, type: detectAddressType(line1) };
  }).filter((a) => !taken.has(formatAddress(a).toLowerCase()));
  return [...base, ...built].slice(0, 5);
}
