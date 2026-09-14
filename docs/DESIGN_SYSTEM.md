# Design system

The visual direction is an agricultural field ledger: crop-row lines and tactile forest surfaces establish place; clear tabular amounts and restrained white panels keep operations legible. The interface intentionally avoids the generic analytics-dashboard look.

## Foundations

- Forest `#174A2E`, field `#2F7D4A`, leaf `#67A95C`, earth `#965D2D`, harvest `#E1B84B`
- Canvas `#F8F7F1`, white surface, muted field surface `#EEF5EC`
- Inter/Noto Sans language-aware stack; 16px minimum body size
- 4/8px spacing rhythm, 12–16px functional radii, two deliberate shadow levels
- Tabular figures for price, quantity, settlement and time

Important actions combine icon and label. Status chips combine text, icon and color. Interactive controls are at least 44px, focus rings are visible, zoom is not disabled, and layouts collapse without horizontal page scrolling. Tables that need width use labelled local scrolling.

Motion uses a calm corporate personality: 150ms press response, 200ms hover/elevation and a single 280ms decelerating page entrance. `prefers-reduced-motion` reduces all motion to effectively zero.
