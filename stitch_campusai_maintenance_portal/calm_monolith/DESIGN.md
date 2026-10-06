---
name: Calm Monolith
colors:
  surface: '#fdf8f8'
  surface-dim: '#ded9d9'
  surface-bright: '#fdf8f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f8f2f2'
  surface-container: '#f2edec'
  surface-container-high: '#ece7e7'
  surface-container-highest: '#e6e1e1'
  on-surface: '#1d1b1b'
  on-surface-variant: '#47464b'
  inverse-surface: '#323030'
  inverse-on-surface: '#f5efef'
  outline: '#78767b'
  outline-variant: '#c8c5cb'
  surface-tint: '#5f5e61'
  primary: '#5f5d61'
  on-primary: '#ffffff'
  primary-container: '#78767a'
  on-primary-container: '#050507'
  inverse-primary: '#c9c5ca'
  secondary: '#5f5e60'
  on-secondary: '#ffffff'
  secondary-container: '#e2dfe1'
  on-secondary-container: '#646264'
  tertiary: '#635c5f'
  on-tertiary: '#ffffff'
  tertiary-container: '#7c7577'
  on-tertiary-container: '#060405'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5e1e6'
  primary-fixed-dim: '#c9c5ca'
  on-primary-fixed: '#1c1b1e'
  on-primary-fixed-variant: '#47464a'
  secondary-fixed: '#e5e1e3'
  secondary-fixed-dim: '#c9c5c8'
  on-secondary-fixed: '#1c1b1d'
  on-secondary-fixed-variant: '#474648'
  tertiary-fixed: '#e9e0e3'
  tertiary-fixed-dim: '#cdc4c7'
  on-tertiary-fixed: '#1f1a1c'
  on-tertiary-fixed-variant: '#4b4548'
  background: '#fdf8f8'
  on-background: '#1d1b1b'
  surface-variant: '#e6e1e1'
typography:
  display-lg:
    fontFamily: Domine
    fontSize: 36px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.035em
  headline-lg:
    fontFamily: Domine
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 30px
    letterSpacing: -0.025em
  body-lg:
    fontFamily: Anybody
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: -0.005em
  label-md:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.005em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  space-1: 0.25rem
  space-2: 0.5rem
  space-3: 0.75rem
  space-4: 1rem
  space-5: 1.25rem
  space-6: 1.5rem
  space-8: 2rem
  space-10: 2.5rem
  space-12: 3rem
  space-16: 4rem
  gutter-sm: 1rem
  gutter-md: 1.5rem
  gutter-lg: 2rem
  max-width-content: 1120px
---

## Brand & Style

This design system embraces a content-driven, editorial aesthetic engineered for immersive reading, clear communication, and structured information architecture. It balances expressive editorial typography with a grounded, accessible color palette.

### Brand Personality
- **Editorial Clarity:** Every typographic choice emphasizes readability and a sophisticated literary presence.
- **Structural Calm:** Surfaces feel balanced and stable, reducing cognitive fatigue while presenting rich content.
- **Understated Craft:** Polish emerges through refined typographic rhythms, subtle structural lines, and thoughtful spacing.

### Aesthetic Direction
Rooted in expressive content design, the system uses an earthy, sophisticated neutral and muted palette anchored by warm grays and deep tones. Interactions are clean and deliberate: crisp borders define space, and layout components serve as discrete structural containers.

## Colors

The palette operates on rich, content-driven tonal control: warm neutral grays, balanced structural elements, and deep ink accents. Color is applied with purpose to guide the eye and define hierarchy.

### Color Tokens & Roles

- **Canvas & Backgrounds:**
  - `surface-canvas`: `#FAFAFA` — The foundational low-contrast backdrop.
  - `surface-card`: `#FFFFFF` — Foreground sheets, interactive cards, and content containers.
  - `surface-subtle`: `#F4F4F5` — Table headers and subtle input fills.
  - `surface-hover`: `#F4F4F6` — Discrete interactive hover fills.

- **Borders & Dividers:**
  - `border-hairline`: `#F4F4F5` — Ultra-subtle interior segmenting lines.
  - `border-subtle`: `#E4E4E7` — Standard structural bounding lines.
  - `border-strong`: `#D4D4D8` — Hovered control states and high-emphasis separators.

- **Typography & Text Contrast:**
  - `text-primary`: `#1b1719` — High-contrast deep tone for headings and active content.
  - `text-secondary`: `#78767a` — Supporting body copy and metadata.
  - `text-muted`: `#797676` — De-emphasized timestamps and helper text.
  - `text-tertiary`: `#A1A1AA` — Disabled states and placeholders.

- **Accents & Contextual Status:**
  - `accent-primary`: `#78767a` — The default execution color for primary keys and active indicators.
  - `accent-secondary`: `#787678` — Secondary interactive and structural accents.

## Typography

The typographic hierarchy combines `Domine` for editorial headlines, `Anybody` for dynamic body text, and `Atkinson Hyperlegible Next` for clear, readable labels and UI elements.

### Typographic Principles
- **Editorial Distinction:** Distinct font families establish clear hierarchy between display headers, body content, and functional labels.
- **Vertical Rhythm:** Headings and body texts enforce fixed proportional line-heights matching the layout grid.

## Layout & Spacing

The spatial engine relies on a modular scale within a constrained fixed-width fluid container (`max-width: 1120px`). Centered, book-like containers keep reading lines comfortable and functional zones distinct.

### Structural Breakpoints
- **Desktop (`>= 1024px`):** Max application width constrained to `1120px` with `2rem` side gutters.
- **Tablet (`768px - 1023px`):** Single-column main content stream with collapsible split utility panels.
- **Mobile (`< 768px`):** Fluid single column with `1rem` margin gutters.

## Elevation & Depth

Visual hierarchy is achieved through planar stacking, boundary contrast via micro-borders, and subtle ambient ground occlusion.

### Elevation Levels

- **Base Canvas (Level 0):** Flat `#FAFAFA`. Has no borders and no shadows.
- **Raised Surfaces / Cards (Level 1):** Flat `#FFFFFF` enclosed in a continuous `1px solid #E4E4E7` border with micro-drop shadows.
- **Active / Popover / Command Menus (Level 2):** Pure `#FFFFFF` with dual-stage focused shadows.
- **Modals & Overlays (Level 3):** `#FFFFFF` paired with an unblurred backdrop.

## Shapes

The design system employs a rounded, approachable corner language (Level 2), producing smooth, friendly containers suited for content-rich interfaces.

### Radius Token Mapping
- **Default Elements (`0.5rem` / `8px`):** Inputs, standard buttons, select triggers, and inline code blocks.
- **Group Elements (`rounded-lg`: `1rem` / `16px`):** Cards, primary dialog frames, and dropdown containers.
- **Outer Shells (`rounded-xl`: `1.5rem` / `24px`):** Centered application modals and preview sheets.
- **Pill Badges (`9999px`):** Reserved for status chips and classification tags.

## Components

### Buttons
- **Primary:** Background `#78767a`, text `#FFFFFF`, border `1px solid #78767a`, radius `8px`, font-weight `500`, padding `8px 16px`.
- **Secondary / Ghost:** Background `#FFFFFF`, text `#1b1719`, border `1px solid #E4E4E7`, radius `8px`, font-weight `500`, padding `8px 16px`.

### Input Fields & Controls
- Height: `40px` comfortable rhythm.
- Visuals: Background `#FFFFFF`, border `1px solid #E4E4E7`, radius `8px`, text `#1b1719`.

### Cards & Grouping
- Background `#FFFFFF`, border `1px solid #E4E4E7`, radius `16px`, shadow `0 1px 2px 0 rgba(0, 0, 0, 0.03)`.