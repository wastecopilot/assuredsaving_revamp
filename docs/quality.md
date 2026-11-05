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

## 4. UX pen tester (empathic attacker), discussed and improved

A separate reviewer drove the running app with Playwright as seven personas:
1. an impatient phone user;
2. an older visitor with low vision at 200% zoom;
3. a keyboard and screen-reader user;
4. a Spanish speaker;
5. a small business owner;
6. an indecisive comparer;
7. a privacy-cautious person at the callback form.

The reviewer reported 23 findings. Each was discussed against the constraints (official wording only, flat colour, official rules), then improved with a test first where it could be tested.

| # | Finding | Severity | Decision and change |
| --- | --- | --- | --- |
| 1 | The browser or phone Back button left the site, and reload lost everything | Major | **Fixed.** Each step and open dialog adds a history entry, so Back returns to the previous step or closes the dialog. Progress is kept in `sessionStorage` for the tab, never the callback code. Tests: Back and reload. |
| 2 | Answers never changed the results; "Our Top Pick" and "Best Pick" could be on different plans, one hidden | Major | **Fixed** (`displayOrder`). Heavy use (gaming, 4K, remote work, data-heavy, media, or 50+ devices) makes the Fastest plan the top pick; otherwise the Most Affordable. Every labelled plan is in the top group, and rank follows the shown order. Tests. |
| 3 | Finished steps kept live "Continue" buttons that did nothing | Major | **Fixed.** Step buttons show only on the current step. Test. |
| 4 | Changing a service on results wiped answers; "Start a new search" had no confirmation | Major | **Fixed.** Usage and TV answers are kept (usage resets only if home/business changes). "Start a new search" asks first, with the official "Start Over" and "Cancel". Test. |
| 5 | On a 390×844 phone, the address field and "Check Availability" were below the fold | Major | **Fixed.** Compact service tiles on phones, the bundle shortcuts in one scrolling row, and the repeated description hidden on phones. "Check Availability" now ends at 613 px. |
| 6 | Address suggestions ignored the typed city; a business address was offered first | Major | **Fixed.** A typed ", City, ST ZIP" is honoured (with that state's time zone), home addresses come first, and each suggestion shows a home or business icon. Tests. |
| 7 | The address error blamed the wrong thing | Major | **Fixed.** The official example "Type your full US address, e.g. 123 Main St, Dallas, TX 75201" shows under the field. A missing street number gets the official "Include State (e.g. NY, CA) and a street number". The service hint appears only when no service is chosen; otherwise focus goes to the address. Tests. |
| 8 | A business-rule conflict gave no feedback on "Check Availability" | Major | **Fixed.** The official panel takes focus and is announced as an alert; "Check Availability" switches to the secondary style while the panel's two choices are the next step. Test. **Not done:** disabling tiles, because it would change the official selection rule. |
| 9 | Callback errors stayed after fixing, and "preferred time" was blamed for Call Me Now | Major | **Fixed.** Each error clears when its field becomes valid, Call Me Now never mentions a preferred time in hours, focus goes to the first problem, and errors are linked to their fields instead of several simultaneous alerts. Tests. |
| 10 | "Call Me Now" outside calling hours failed with a misleading message | Major | **Fixed.** Outside Mon–Sat 8am–9pm in the chosen zone there is no "Call Me Now"; "Schedule Callback" becomes the main action. Test. |
| 11 | The callback form forgot everything when closed; success didn't say when | Major | **Fixed.** Email, phone and the verified number are kept for the visit. The success screen shows the booked day and time. Test. |
| 12 | Two time zones had the same name | Major | **Fixed.** The browser's zone name plus the city, e.g. "(Phoenix)". Test. |
| 13 | Business results used household wording | Major | **Fixed.** No "…suit most households" reason for business addresses. Test. **Not done:** business-only pricing, which needs real business plan data. |
| 14 | Focus was lost after verifying the code | Major | **Fixed.** Focus moves to the call-consent box. Test. |
| 15 | Keyboard and screen-reader details | Minor | **Fixed.** ArrowDown reopens suggestions; Enter on a verified address runs "Check Availability"; a persistent live region announces "Address Found" and the type; the dialog opens on the email field; filter chips are toggle buttons; usage tiles have a name plus a separate description; plan headings include the provider. |
| 16 | The provider filter was hidden, and the count didn't follow it | Minor | **Fixed.** The filter sits above the top picks, the heading count follows the filter, and the list scrolls into view. **Not done:** a sort control. |
| 17 | The price overlapped the buttons on tablets | Minor | **Fixed.** The four-column row starts at desktop width, with the price column sized to fit. |
| 18 | Phone plan cards were hard to compare | Minor | **Fixed.** The price comes right after the provider, and phones show one reason. The redundant "Priced at…" reason was removed. |
| 19 | Text that contradicted itself | Minor | **Fixed.** No "recommendation is loading" footer after loading; no "connectivity" or "technology" sentences for security, phone or mobile plans; Aria is mentioned once. Tests. |
| 20 | Low vision at 200% zoom | Minor | **Fixed.** The header doesn't stick on short screens (`max-height: 500px`), small labels are larger, and the name field has a visible label. |
| 21 | Spanish leftovers | Minor | **Fixed.** Time slots are formatted for the language, and the long name chip is hidden below wide screens. |
| 22 | Wording polish | Polish | **Fixed.** No "Intent" label on the first screen; the official "Let's Get the Right Deal" headline when Internet isn't chosen. **Kept:** "Landline" on the tile and "Home Phone" in results, as both are the official site's wording in those places. |
| 23 | "Send Code" greyed out with no reason | Polish | **Fixed.** It's always tappable and explains a short number. Test. |

## 5. Simulated users

**Model level, 20,000 visitors** (`tests/simulation.test.ts`, runs with `npm test` in under 1 s). Random services and bundle clicks, random addresses (including no match), Check Availability with the business rule, name, usage, TV, scan, results, Back (5% per step) and Start over. Every journey checks that:
- the selection is always an official combination and never empty;
- Check Availability always leads to the name step;
- a business address never continues with a non-business selection;
- usage appears only with Internet and TV only with TV, and neither is skipped when it applies;
- Back always moves back;
- Start over clears everything;
- every finished journey reaches results that have their own plans.

Result after the UX fixes: 20,000 journeys, **0 violations**. 16,201 reached usage, 9,899 TV, 19,507 results, with 7,365 business choices, 3,736 no-match addresses, 2,397 Back presses and 493 restarts.

**Browser level** (`scripts/simulate.cjs`, Playwright against the production build at 5 visitors at a time, seed 31337).

Each visitor:
- clicks random services and bundle shortcuts;
- switches language;
- types good, bad and no-match addresses;
- enters odd names (one letter, HTML, 200 characters, accents);
- goes Back;
- uses the usage and TV options;
- restarts;
- opens plan details;
- fills the callback form with valid and invalid emails, numbers and codes.

Result: **986 sessions in 72 minutes, 0 rule violations, 0 broken flows and 0 horizontal overflow.**
- 934 reached results, 642 reached usage and 479 reached TV.
- 257 business choices and 98 no-match errors were shown.
- 485 opened details, 52 callbacks completed and 560 callback errors were shown.
- 67 Back presses, 48 restarts and 275 language switches.

19 sessions timed out (the page took more than 30 s to load, or a step more than 12 s). All 19 fall in three short windows when the same machine was also compiling another build, so the server was starved; none showed a wrong state. An earlier pilot without that load had none.
