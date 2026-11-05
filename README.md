# Assured Saving: one-pager UI/UX revamp (design preview)

A redesign of the Assured Saving quote flow, built as one page. Wording and rules follow
https://www.assuredsaving.com/; the visual design and UX are new. Everything runs on mocked
sample data: nothing calls a real service, places a call or sends a text.

## Design

A light, editorial product page with flat colour only (no gradients, glows or glass).

- **Step 1 follows the official home page.** It has:
  - the official headline "Find the Best Internet";
  - the five services and the official bundle shortcuts;
  - "Search USA address" with "Check Availability".
- **Later steps are full-width bands.** On desktop each band has its heading in a left column and the fields on the right.
  - **Name:** "Please enter your full name."
  - **Usage:** "How do you use the internet?", only with Internet.
  - **TV needs:** only with TV.
  - **Scan:** "Assured Saving Agent — Live".
  - **Results:** plans as comparison rows (who and what, the facts, the price, actions), with the top pick marked by an orange bar.
- **Colour.** Warm white page, near-black ink, one bright orange for actions (with ink text), and one solid colour per service: Internet blue, TV pink, Landline violet, Mobile yellow, Home Security green.
- **Type and shape.** Instrument Sans, corners of 8px or less, 1px borders, 44px touch targets.
- **Accessibility.** Every text colour pair passes WCAG AA, and reduced motion is respected.
- **Header.** Only the current step's official name (no step numbers), ENG | ESP and US Only.

## Official wording and rules

| Area | How |
| --- | --- |
| Wording | Every visible string (English and Spanish) is copied word for word from the official site into `data/official-copy.json`. `lib/copy-sources.ts` maps UI keys to it, and `npm run copy` writes only the used strings to `lib/copy.gen.json`. Tests fail on any non-official text. |
| Services | Any one service on its own; combinations only Internet + TV, + Landline, + Mobile, or all four; Home Security always alone. Recorded from the live site (`lib/selection.ts`). |
| Business addresses | Official rule: only Internet or Internet + TV Bundle. Other selections get the official chooser. |
| Callback | Official "Schedule AI Callback" form, consent text and calling window (8am - 9pm). |

## Run it

```bash
npm install
npm run dev
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build`, then `npm start` | Production build (runs `npm run copy` first) and server |
| `npm test` | All tests (Vitest + Testing Library + axe-core) |
| `npm run contrast` | WCAG AA check of every colour pair |
| `npm run check` | Typecheck, lint, contrast, tests, production build |

## How it was refined

See `docs/quality.md` for the full report.

1. **Design-driven development (UI/UX TDD).** The design rules were written as tests (`tests/design.test.ts`) before the UI was built, and the UI was built until they passed. The rules:
   - flat colour only;
   - the colour roles;
   - AA contrast;
   - 44px targets;
   - corner sizes;
   - one typeface;
   - the official home-page structure;
   - no step numbers.
2. **UI component unit tests** (`tests/components.test.tsx`): buttons, fields, checkbox, chips, slider, segmented control, modal (focus trap, Escape, focus return), service tiles, the address combobox and plan rows.
3. **UI/UX integration tests** (`tests/flow.test.tsx`, `tests/callback.test.tsx`):
   - the whole page is driven like a visitor;
   - axe-core accessibility checks run at each step;
   - every visible text node is checked against the official copy.
4. **UX pen tester (empathic attacker).** A separate reviewer walked the app as seven personas and reported friction. The points were discussed and improved.
5. **Simulated users:**
   - 20,000 model-level journeys run in the test suite;
   - 1,000 real-browser sessions run with `scripts/simulate.cjs`.

## Deploy to Vercel

Import the repository at https://vercel.com/new with the defaults (Next.js). No environment variables.
Security headers are set in `next.config.ts`.
