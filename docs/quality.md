# Quality report: one-pager revamp

Six methods were used to refine this build. Everything runs on mocked data; nothing is sent anywhere.

## 1. Design-driven development (UI/UX TDD)

The design rules were written as tests first (`tests/design.test.ts`). They failed (7 of 87) against the
earlier UI, and the new UI was built until all of them passed. They now guard the design on every change:

| Rule | Checked by |
| --- | --- |
| Flat colour only | No `gradient(`, glow, blur, glass or drop shadow anywhere in `app/` or `components/`. |
| Colour roles | One bright orange action colour (#FF5A1F) with ink text, and five distinct solid service colours. The page is light. |
| Contrast | Every text colour pair passes WCAG AA (4.5:1). |
| Touch targets | Every button and link is at least 44px tall. |
| Shape | Corner radii of 8px or less; no oversized rounding. |
| Type | Instrument Sans only. |
| Structure | Step 1 has the official headline, services, "Search USA address" and "Check Availability"; no step numbers anywhere. |

## 2. UI component unit tests

`tests/components.test.tsx` (15 tests) tests each building block on its own:
- **Button:** a real button with 44px height, flat orange with ink text, and inert when disabled.
- **Input:** linked label, `aria-invalid`, and errors announced.
- **Checkbox:** starts unticked and toggles.
- **Chip:** pressed state, or checked when used as a radio.
- **Slider:** labelled, with value text and change handling.
- **Segmented control:** roving tabindex with arrow keys.
- **Empty state:** its title is a heading.
- **Modal:** a labelled dialog that closes on Escape and returns focus.
- **Service tiles:** toggle buttons with official names, in the official order, filled with solid colour when selected.
- **Address combobox:** arrows, Enter and Escape work; "Try a different address" clears and refocuses.
- **Plan row:** provider, price and labels, and both actions open the right overlay.

## 3. UI/UX integration tests

`tests/flow.test.tsx` and `tests/callback.test.tsx` drive the whole page like a visitor:
- the official selection rules;
- Check Availability gated on a service and an address;
- bundle shortcuts;
- the official no-match error;
- the business rule (and that it never skips name or usage);
- name gating;
- Back with no dead end;
- changing services after moving on returns to step 1;
- the full flow to results;
- the whole callback form.

axe-core runs at step 1, at usage and at results with **0 violations**, and every visible text node is checked against the official copy.

Plus unit suites for selection (38), copy (official text only), address, plans, schedule and the callback helpers.

## 4. UX pen tester (empathic attacker)

_In progress; findings and decisions are added here._

## 5. Simulated users

**Model level, 20,000 visitors** (`tests/simulation.test.ts`, runs with `npm test` in under 1 s). Random services and bundle clicks, random addresses (including no match), Check Availability with the business rule, name, usage, TV, scan, results, Back (5% per step) and Start over. Every journey checks that:
- the selection is always an official combination and never empty;
- Check Availability always leads to the name step;
- a business address never continues with a non-business selection;
- usage appears only with Internet and TV only with TV, and neither is skipped when it applies;
- Back always moves back;
- Start over clears everything;
- every finished journey reaches results that have their own plans.

Result: 20,000 journeys, **0 violations**. 17,063 reached usage, 10,808 TV, 19,634 results, with 7,807 business choices, 3,522 no-match addresses, 2,868 Back presses and 366 restarts.

**Browser level** (`scripts/simulate.cjs`, Playwright against the production build): _results added below._
