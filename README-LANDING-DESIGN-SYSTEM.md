# Landing page design system (CDB Therapy)

Use this as a copy/paste reference for building a **Next.js marketing site** that matches the **CDB Therapy mobile app UI** (Expo/React Native).

---

## Brand + theme

- **Theme**: Dark-first (near-black background, elevated charcoal cards)
- **Primary accent**: Teal (`#2A9D8F`)
- **Secondary accents**: Indigo/purple and coral used as highlight colors in cards
- **Status colors**: iOS-style success/warn/error/info

---

## Color palette

### Core tokens (from `constants/colors.ts`)

**Brand accents**

- Primary: `#2A9D8F`
- Secondary: `#0A8A7A`
- Accent: `#1DB9A8`

**Surfaces**

- Background: `#000000`
- Card: `#1C1C1E`
- Card (secondary): `#2C2C2E`
- Card (tertiary): `#3A3A3C`

**Text**

- Text: `#FFFFFF`
- Text secondary: `#EBEBF5`
- Text tertiary: `#99999D`
- Text muted: `#8E8E93`

**Borders**

- Border: `#38383A`
- Border light: `#48484A`
- Divider: `#2C2C2E`

**Status**

- Success: `#30D158`
- Warning: `#FFD60A`
- Error: `#FF453A`
- Info: `#64D2FF`

**Overlays**

- Overlay: `rgba(0,0,0,0.7)`
- Modal background: `#1C1C1E`

**Gradients (optional)**

- Gradient start: `#0F2027`
- Gradient middle: `#203A43`
- Gradient end: `#2C5364`

**Verse card**

- Verse card: `#1B5E5B`
- Verse card dark: `#144A47`

### Secondary highlight colors (used in card color maps)

These appear across Study/Prayer/Bible UI as rotating card colors:

- Black: `#1A1A1A`
- Purple: `#6A4C93`
- Deep blue: `#4A5C8F`
- Soft blue: `#5B7BB4`
- Purple alt: `#6B5B95`
- Teal-green: `#2B9F98`
- Teal alt: `#5A9C92`
- Coral: `#D9896A`
- Coral/orange: `#D97758`
- Orange/coral: `#E85D4F`
- Pink/magenta: `#A84664`

### Common alpha overlays used

- White alpha: `rgba(255,255,255,0.06)`, `0.08`, `0.18`, `0.2`, `0.25`, `0.3`, `0.35`, `0.7`, `0.85`, `0.9`, `0.95`
- Black alpha: `rgba(0,0,0,0.2)`, `0.3`, `0.5`, `0.6`, `0.7`
- Teal tints: `rgba(42,157,143,0.05)`, `0.08`, `0.15`

---

## Typography

### Fonts

- **Default**: system UI font stack (mobile uses platform defaults)
- **Dyslexia-friendly option in-app**: **Atkinson Hyperlegible**
  - Regular: `AtkinsonHyperlegible-Regular`
  - Bold: `AtkinsonHyperlegible-Bold`

For Next.js:
- Use `font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;`
- Optionally load Atkinson Hyperlegible (Google Fonts or self-host) as a selectable font.

### Type scale (values found across the UI)

**Font sizes**

`9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 20, 22, 24, 28, 32, 34, 42, 48`

**Line heights**

`18, 20, 21, 22, 24, 26, 28, 30, 36`

### Typical usage mapping (recommended for landing page)

- Hero title: `42–48` / lh `~48–56` (use 48 if you want it bold and “app-like”)
- Section title: `28–34` / lh `36`
- Card title: `18–22` / lh `24–28`
- Body: `14–16` / lh `20–24`
- Caption: `12–13` / lh `18–20`

---

## Spacing + radius

### Spacing values used (observed)

**Padding**

`0, 4, 6, 8, 10, 12, 14, 16, 18, 20, 24, 28, 30, 32, 40`

**Margin**

`2, 4, 5, 6, 8, 10, 12, 14, 16, 20, 24, 28, 32, 40, 72, 100`

### Corner radius values used (observed)

`3, 4, 5, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 28, 30, 32, 35, 40, 50, 999`

Recommended landing defaults:

- Buttons: radius `12–20`
- Cards: radius `16–24`
- Pills/chips: radius `20–999`

---

## Copy/paste: CSS variables

Put this in `globals.css` (or `:root` + `.dark` if you support light mode later):

```css
:root {
  /* Brand */
  --db-primary: #2A9D8F;
  --db-secondary: #0A8A7A;
  --db-accent: #1DB9A8;

  /* Surfaces */
  --db-bg: #000000;
  --db-card: #1C1C1E;
  --db-card-2: #2C2C2E;
  --db-card-3: #3A3A3C;

  /* Text */
  --db-text: #FFFFFF;
  --db-text-2: #EBEBF5;
  --db-text-3: #99999D;
  --db-text-muted: #8E8E93;

  /* Borders */
  --db-border: #38383A;
  --db-border-2: #48484A;
  --db-divider: #2C2C2E;

  /* Status */
  --db-success: #30D158;
  --db-warning: #FFD60A;
  --db-error: #FF453A;
  --db-info: #64D2FF;

  /* Overlays */
  --db-overlay: rgba(0,0,0,0.7);
}
```

Optional highlight colors:

```css
:root {
  --db-black: #1A1A1A;
  --db-purple: #6A4C93;
  --db-deep-blue: #4A5C8F;
  --db-soft-blue: #5B7BB4;
  --db-coral: #D9896A;
  --db-orange: #E85D4F;
  --db-pink: #A84664;
}
```

---

## Copy/paste: Tailwind tokens (optional)

Add to `tailwind.config.ts`:

```ts
export default {
  theme: {
    extend: {
      colors: {
        db: {
          primary: "#2A9D8F",
          secondary: "#0A8A7A",
          accent: "#1DB9A8",

          bg: "#000000",
          card: "#1C1C1E",
          card2: "#2C2C2E",
          card3: "#3A3A3C",

          text: "#FFFFFF",
          text2: "#EBEBF5",
          text3: "#99999D",
          muted: "#8E8E93",

          border: "#38383A",
          border2: "#48484A",
          divider: "#2C2C2E",

          success: "#30D158",
          warning: "#FFD60A",
          error: "#FF453A",
          info: "#64D2FF",
        },
      },
      borderRadius: {
        pill: "999px",
        card: "24px",
        button: "14px",
      },
    },
  },
};
```

---

## Landing page styling guidelines

- Use **solid black background** and **charcoal elevated cards**.
- Headlines are **bold (700–800)** and high-contrast.
- Use teal (`--db-primary`) for:
  - primary CTA buttons
  - active states
  - focus rings (subtle)
- Use purple/coral/soft-blue sparingly as accent surfaces behind icons or feature tiles.

---

## Quick component recipe (CSS-only)

**Card**

```css
.db-card {
  background: var(--db-card);
  border: 1px solid var(--db-border);
  border-radius: 24px;
  padding: 20px;
}
```

**Primary button**

```css
.db-btn {
  background: var(--db-primary);
  color: var(--db-text);
  border-radius: 14px;
  padding: 12px 16px;
  font-weight: 700;
}
```

---

## Notes

- The mobile app supports accessibility toggles (larger text, bold, dyslexia font). For the marketing site, consider:
  - `prefers-reduced-motion`
  - `prefers-contrast`
  - providing a font toggle if you want to mirror the app.

