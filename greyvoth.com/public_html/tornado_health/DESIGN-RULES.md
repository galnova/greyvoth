# Tornado Health design rules

Living document for the Tornado Health member portal (portfolio demo, fictional brand, synthetic data).
It becomes the pattern page in a later step. Updated after homepage revision 10 (family switcher, find a doctor, log out dialog, placeholder links, spacing pass).

## Principles

- **One focus per page.** The single task Roy must do sits in a compact action strip with the page's only primary button. Priority order: action needed > updates > everything else.
- **No bulky hero sections.** The top of the page is a greeting plus a one-line status ("You have 1 thing to do · $860 left on your deductible"), then the action strip. No banner, no image, no oversized type.
- **Page structure:** greeting with status, then two columns. Main (2/3): To do (action strip + updates), Recent claims. Side (1/3): Your plan, ID card, For you.
- **Group by meaning, and never put content of different types and heights in one row** (it leaves dead space). Every section on the page has the same container, so nothing floats.
- **Nothing that repeats the nav.** Quick links were removed from the homepage because every item already exists in the nav, the More sheet or the action strip.
- **Light theme only.** No dark mode and no theme toggle.
- **No clutter:** no stock photo, no decorative gradients, no animation beyond panel slides (off with reduced motion).

## Stack

| Piece | Version | Notes |
|---|---|---|
| Bootstrap | 5.3.3 (CDN, SRI) | Layout, utilities, dropdown (megamenu), offcanvas. Themed only through CSS variables. |
| Font Awesome Free | 6.7.2 (CDN, SRI) | `fontawesome` + `solid` only. Decorative icons have `aria-hidden="true"`. |
| Custom CSS | `css/portal.css` | One file: tokens, Bootstrap mapping, base, components, responsive. |
| Script | `js/portal.js` | Vanilla, deferred. Renders `data/member.json`. |

There's no inline code, no inline styles and no `!important`.

## Breakpoints

| Width | Navigation |
|---|---|
| < 576px | Logo + avatar (My Account kept for screen readers) · bottom nav |
| 576–991px | Logo + avatar + "My Account" · bottom nav |
| ≥ 992px | Full wordmark + top nav + divider + avatar and "My Account", on one 64px row |

Measured: the header is one 64px row with no overflow at 992, 1024, 1100, 1199, 1200, 1280, 1440 and 1920px.

## Tokens

All raw values live in section 1 of `portal.css` (`--th-*`). Section 2 maps them to Bootstrap variables. Nothing below that uses a raw color.

### Color

| Token | Hex | Role |
|---|---|---|
| purple-50 | `#F5F2FB` | Tints: hover, active tab, open nav item |
| purple-100 | `#EBE4F7` | Action strip background (body text on it: 14.6:1) |
| purple-200 | `#D5C8EE` | Meter track |
| purple-300 to 500 | `#B7A2E0`, `#9478CD`, `#7354B5` | Reserved, decorative only |
| purple-600 | `#5A3D98` | Focus ring |
| purple-700 | `#472D7F` | Reserved |
| purple-800 | `#3B1F6E` | Primary: buttons, links, meter fill, ID card, avatar |
| purple-900 | `#26134A` | Primary hover |
| white | `#FFFFFF` | Surfaces |
| neutral-50 | `#F7F6FA` | Page background, More tiles |
| neutral-200 | `#E1DEE9` | Decorative card borders, dividers |
| neutral-500 | `#6E6A7C` | Meaningful borders (inputs, outlines) |
| neutral-600 | `#57536A` | Muted text |
| neutral-900 | `#17151F` | Body text |
| success | `#1E6B3A` on `#E3F3E8` | Processed, covered |
| warning | `#8A4B00` on `#FDF0DC` | Needs info |
| danger | `#B42318` on `#FDECEA` | Errors |
| info | `#1D5C9E` on `#E6F0FB` | In review |

### Contrast (measured, WCAG 2.2 AA)

Text needs 4.5:1 (3:1 at 24px+ or 19px+ bold). UI parts and focus indicators need 3:1.

| Pair | Ratio |
|---|---|
| Body text on surface / page | 18.1 / 16.8 |
| Muted text on surface / page | 7.4 / 6.9 |
| Link and primary text on surface | 13.1 |
| Primary button label (white on 800) | 13.1 |
| Primary text on purple-50 (badges, active states) | 11.8 |
| Status text on its tint (success / warning / danger / info) | 5.7 / 6.1 / 5.8 / 5.9 |
| Bottom nav idle / active | 7.4 / 11.8 |
| ID card text | 13.1 |
| Meter fill vs track (UI) | 8.3 |
| Focus ring vs page (UI) | 8.2 |
| Input and outline borders (UI) | 5.2 |

Cards have no border; they're separated by surface color, shadow and spacing. Dividers inside cards (`neutral-200`, 1.7:1) are decorative.

### Type

System font stack, so there's no web font and no layout shift.

| Token | Value | Use |
|---|---|---|
| `--th-fs-h1` | `clamp(1.625rem, 1.4rem + 1.1vw, 2.125rem)` | Greeting (one h1 per page) |
| `--th-fs-h2` | `clamp(1.1875rem, 1.1rem + .45vw, 1.375rem)` | Section titles |
| `--th-fs-h3` | `clamp(1.0625rem, 1rem + .3vw, 1.1875rem)` | Small headings |
| `--th-fs-stat` | `clamp(1.625rem, 1.5rem + .5vw, 1.875rem)` | Amounts spent in Your plan |
| `--th-fs-base` | `clamp(1rem, .97rem + .15vw, 1.0625rem)` | Body |
| `--th-fs-sm` | `.875rem` | Nav, meta, helper text |
| `--th-fs-xs` | `.8125rem` | ID card labels, avatar initials |
| `--th-measure` | `65ch` | Max line length (`.text-measure`) |

### Spacing, radii, elevation, targets

- **Spacing:** Bootstrap's scale only (4 / 8 / 16 / 24 / 48px). Layout spacing is set with utilities in the markup; custom CSS only pads controls (buttons, chips, inputs). The system:
  - **Page:** `container-xl` for every full-width section, 24px above and below the content (`py-4`) in the band, the main area, the footer and the megamenus.
  - **Cards:** 24px on every side (`card-body p-4`), 24px between cards (`gap-4` / `g-4`). Top and bottom space measure the same.
  - **Inside a card:** heading to content 16px (`mb-3`); a heading with a one-line description uses `mb-1`, then the description `mb-3`; a new group inside a card starts 24px down (`mt-4`).
  - **List rows** (claims, updates, suggestions): 16px apart, set once with `--bs-list-group-item-padding-y`. The first and last rows sit flush so they don't add to the card's 24px. Don't put `py-*` utilities on rows.
  - **Status lines** (`.status-line`, `role="status"`) take no space until they show a message, then sit 16px below what they describe.
  - **48px hit areas next to headings or at a card's edge** (header links such as "See all claims", the ID card actions) overlap the space around them (negative block margin) so they don't make the card look padded unevenly.
- **Radii:** 6px controls, 12px cards and tiles, 16px ID card and bottom sheet.
- **Elevation:** `--th-shadow-card` (cards: soft two-layer shadow, no outline), `--th-shadow-1` (header), `-2` (megamenu), `-3` (chat button, chat panel, overlays).
- **Targets:** `--th-target` is 48px. Every standalone link, button, tab, megamenu link and close button meets it.

## Components

### Card
White surface, 16px radius, no outline, `--th-shadow-card`. - Don't nest bordered boxes inside cards. Use a tinted panel or plain rows instead.

### Header
One 64px row: logo (links home), primary nav, a 1px divider, My Account. No theme toggle.
- Below 992px only the logo and My Account show; the bottom nav takes over.

### Account menu
My Account opens a small dropdown (`.account-menu`, right-aligned, 256px), not a megamenu.
- **Avatar counter:** a red circle at the avatar's top-right with a 2px white ring shows the total of unread messages plus new notifications. It is decorative; the button also says "N new" for screen readers.
- **Items, in order:** Messages (count badge) · Notifications (count badge) · divider · **Account overview** (the menu's primary CTA, full-width filled button) · Addresses · Other options · divider · Log out.
- The caret sits 6px from "My Account"; the avatar keeps 16px on its right for the counter.
- Every row is 48px tall with a purple fixed-width icon, the label, and a badge pushed to the right edge. Badge numbers have visually hidden "unread" or "new" after them.
- Counts come from `inbox` in `member.json`.

### Primary nav and megamenu
`<nav aria-label="Primary">` with five items, each a button that opens a full-width megamenu under the header (Bootstrap dropdown, static display).

| Menu | Primary CTA | Sub-options |
|---|---|---|
| Coverage | Coverage overview | **Your benefits:** Medical, Rx, Dental, Vision, Spending Accounts · **Your plan:** ID Cards, Who's Covered, Coordination of Benefits, Referrals & Prior Auths |
| Claims | Claim summary | Claim Details, EOBs (Explanation of Benefits) |
| Find Care | Choices for care | Find a Doctor, Behavioral Health Support, Get a Second Opinion, Estimate Your Cost |
| Programs & Services | Programs overview | Health Care & Well-Being, Rewards & Perks |
| Support | Help center | **Get help:** Contact Us, FAQ, AI Chat (opens the chat panel), Website Feedback · **Forms:** All Forms |

- **Layout:** a tinted CTA panel on the left third (title, one line, one filled "Go to …" button), with link groups on the right two thirds. Every group gets a small uppercase title, aligned with its links and linked to its list with `aria-labelledby`. Groups are always half the link area wide, so a menu with one group stops at the halfway mark instead of stretching across.
- Sub-options are single-line, 48px rows with no descriptions. The CTA panel is the only filled button in a menu.
- **States:** default; hover and open (tint fill, primary text, `aria-expanded="true"`); focus (3px ring). Items have a 4px gap so hover fills never touch.
- **Keyboard:** Enter or Space opens, arrow keys move between sub-options, Esc closes and returns focus to the button. Only one megamenu is open at a time.
- Don't put My Account or a sixth item here.

### Bottom nav (below 992px)
`<nav aria-label="Mobile">`, fixed. Home, Coverage, Claims, ID Card, More.
- Icon plus label on every tab. Active tab has `aria-current="page"` and a tint fill.
- Tabs have 6px of space around the bar's edge and 4px between them, so the active fill never touches the edges or its neighbors.
- Pads for `safe-area-inset-bottom`; the page adds matching bottom padding.
- Hidden from 992px up, so only one nav landmark is ever exposed.

### More sheet
Bottom sheet (`offcanvas-bottom`, `role="dialog"`) with a drag-handle cue, a title and a 2-column grid of tiles:
Find Care, Programs & Services, Help Center, All Forms, Referrals & Prior Auths, Who's Covered. Messages and notifications live in the account menu, which shows on every screen size.
- Each tile has an icon chip, a title and a one-line description. Hover is a tint fill with no underline.
- Focus moves in and is trapped; Esc and Close dismiss it; focus returns to the More tab.
- It closes automatically if the window widens to 992px or more.

### Greeting and status
A full-width band in the primary purple (`.greeting-band`) directly under the header. It is the page's one dark moment, kept slim: 24px padding top and bottom, no image, no extra height. Inside the page container: today's date (small, purple-200, 8.3:1), then the white H1 "Good morning/afternoon/evening, Roy" by local time (13.1:1), then a row of status chips:
- "1 thing to do" (warning icon), which links to To do.
- "$860 left on your deductible" (wallet icon), which links to Your plan.
Only links get the white chip shape, so nothing looks clickable that isn't. The meta line above the H1 reads: family switcher | date | plan name and year (plain light-lavender text with the shield icon, not a link), separated by 1px pipes (`.meta-divider`). On phones the three stack and the pipes hide. The date is set as soon as the script runs, not after the data loads, so the line doesn't shift.

### Family member switcher
"Viewing: Roy ▾" is the first item in the meta line: a small purple-700 button (32px tall, 6px radius) that opens a dropdown of everyone on the plan (Roy, You · Keeley, Spouse · Leo, Son, age 9), each with initials, name and relationship. The current person has a tint fill, a check and `aria-current="true"`.
- Choosing someone updates the button, filters Recent claims to that person (title becomes "Leo's recent claims"; an empty list says "No recent claims for Leo."), announces the change, and returns focus to the switcher.
- In this demo the To do list and plan totals stay on the subscriber. Family members come from `family` in `member.json`; each claim has a `patient`.
- The band's white focus ring switches back to purple inside the (white) menu.
Chips are white, 12px radius, 48px tall, with no shadow on the band. The focus ring turns white inside the band so it stays visible. Linked chips tint on hover. Headings have `scroll-margin-top` so jumps land below the sticky header.

### AI Chat promo (band, desktop only)
The right third of the greeting band, aligned with the side column below. A darker panel (purple-900, 12px radius, no border) with an inline chat icon and the title "Questions? Ask AI Chat" (h2), one line of copy, and a small light "Start a chat" button that opens the chat panel.
- Kept to the band's existing height: no separate icon column, one-line description, 16px padding.
- The button is light and small on purpose. It is secondary; the action strip's button stays the page's primary action.
- Hidden below 992px, where the floating chat button does the same job.

### To do (main column)
Card titled "To do". It holds two groups, ordered by priority:
- **Action strip:** tinted panel (purple-100, 12px radius) with an "Action needed" badge (solid brand purple, white text, exclamation icon; the pale warning style clashed with the lavender panel), the task title (h3), a one-line detail and the page's only primary button (right on desktop, full width on phones). It shows the first task with `actionNeeded: true`, or an "All clear" strip with no button. Its loading placeholder uses the same elements, so nothing shifts.
- **Updates:** small "Updates" label, then one row per in-progress item: icon chip, linked title, short note (for example, "Knee MRI approval in review · Decision by Dec 2").
- Don't make the strip a hero: no oversized type, no extra height, no second button.

### Recent claims (main column)
Card with the last 3 claims for the person being viewed, as aligned rows. From 768px: service and provider · date · "You owe $X" · status badge. On phones: details left, amount over status right. "See all claims →" sits in the header.

### Your plan (side column)
Card with deductible and out-of-pocket stacked. Each has a label with "of $X" on the right, the amount spent as the largest number in the column (`--th-fs-stat`), a native `<progress>` meter, and a text equivalent linked by `aria-describedby`.

### ID card (side column)
Compact preview: logo, plan, member, member ID, Rx BIN and Rx PCN. "View →" in the header opens the full card. Download and Add to wallet are icon text buttons below. Mock results write to a `role="status"` line under them.

### For you (side column)
At most 2 suggestions, one row each: the title as an icon link, the reason as small text, and a dismiss button. Dismissals are saved in `localStorage` (try/catch); the next suggestion fills in, the change is announced, and focus moves to the next dismiss button.
- When every suggestion has been dismissed, the whole card disappears (also on reload). Focus moves to the "Your ID card" heading above it. No empty-state message.

### Find a doctor (full width, below the columns)
Its own card spanning the page under the two columns, content stacked top to bottom: heading, "In network for your Tornado Gold PPO plan.", a labeled search field ("Name, specialty or condition") with an outline Search button joined to it, then "Popular searches" chips (Primary care, Urgent care, Dermatology).
- `role="search"` form. Submitting empty shows "Enter a name, specialty or condition." (linked with `aria-describedby`, `aria-invalid`) and focuses the field.
- A search or chip writes a demo result line to a `role="status"` line. The Search button is an outline button so the action strip keeps the page's only filled primary.

### Log out dialog
"Log out" in the account menu opens a centered Bootstrap modal instead of logging out straight away.
- **Confirm step:** no icon. "Log out of Tornado Health?", one line on what happens, then the buttons left-aligned with the primary first: "Log out" (filled), "Stay signed in" (outline). On phones they stack full width, Log out on top.
- **Done step:** after confirming, the same dialog shows "You're logged out" with a left-aligned "Sign back in" button (demo). The dialog's label switches to the new heading and focus moves to the button.
- Esc, the backdrop and Stay signed in close it. Closing resets it to the confirm step and returns focus to the My Account button.

### Placeholder links
Every link that still points to `#` shows a small primary-purple message at the bottom center ("This page isn't part of the demo yet.") with white text. The close X sits 12px from the right edge, mirroring the 12px text inset on the left, inside a 48px hit area instead of jumping to the top. It sits above the bottom nav on smaller screens, closes on its own after 5 seconds, and its container is a polite live region so screen readers hear it.
- As real pages are added, give their links real hrefs; the message then stops for those links with no other change.

### AI Chat
The assistant is always called **AI Chat** in the interface (panel title, button names, Support menu link).
- **Button:** fixed, 56px, named "Open AI Chat". On phones and tablets it sits above the bottom nav.
- **Panel size:** on desktop (992px and up) a floating card in the bottom-right, 400px wide and at most 640px tall, with 16px radius. On tablets it's a 400px side panel; on phones it fills the whole screen.
- **Panel:** `offcanvas-end`, `role="dialog"`. Shows a demo note, then a message log (`role="log"`, `aria-live="polite"`, focusable so keyboard users can scroll it) and suggested questions as buttons.
- **Input at the bottom:** a labeled text field with the send arrow inside it.
- Typed questions are matched to keywords in `member.json`; anything else gets a friendly fallback answer.
- Focus is trapped while open; Esc returns focus to the chat button.

### Motion
Short and quiet, so the page feels responsive without calling attention to itself. Opacity and transform only, never layout properties. Easing is `--th-ease-out` (ease-out-quart); nothing bounces.
- **Hover fills** on nav items, menu rows, chips, tiles, tabs and buttons fade in over 150ms.
- **Menus** (megamenus and the account menu) drop in: fade plus a 4px slide, 180ms.
- **Loaded content** fades in over its placeholder (300ms). Placeholders match the real content's size, so nothing shifts (CLS stays under 0.01).
- **Plan meters** fill from zero once on load (700ms, `requestAnimationFrame`).
- All of it is off when the OS asks for reduced motion: meters render at their value, nothing fades or slides.
- Don't add: scroll-triggered reveals, parallax, looping or attention-seeking animation, arrow nudges on hover (tried and removed), or motion on the action strip's button.

### Links
- Links and link-buttons with an icon use one class, `.link-icon`: inline-flex, icon vertically centered with the text, 8px gap, semibold, never underlined (including the dismiss X). Hover changes color only. Measured: every icon sits at 0px offset from its text's center.
- Plain text links keep the underline.

### Focus
One rule for everything: a 3px solid ring in purple-600 with a 2px offset. Bootstrap parts that remove the outline get it back at the same specificity.

### Footer
Always at the bottom of the window, even on short pages (the body is a flex column and `main` grows). 24px padding top and bottom, 24px on the sides (12px wider than the page container, as requested).
Help & contact · Accessibility statement · Privacy · Language assistance · Nondiscrimination notice (placeholders), plus a fictional-company note.

## Test results (homepage, revision 10)

| Test | Result |
|---|---|
| axe-core 4 (WCAG 2.0–2.2 A/AA + best practice) at 1280, 1024 and 375px, with the assistant, More sheet, each of the 5 megamenus, the account menu, the family menu, the search error, the placeholder message and both log out steps open | 0 violations in all 20 runs |
| Lighthouse 12, desktop | Accessibility 100 · Best Practices 100 · Performance 96 (LCP 1.1s, CLS 0.005) |
| Lighthouse 12, mobile | Accessibility 100 · Best Practices 100 · Performance 86 (LCP 3.3s, CLS 0.004) |
| W3C HTML validator | 0 errors, 0 warnings |
| Header fit, 992 to 1920px | One 64px row at every width tested |
| Reflow and text spacing at 320px | No overflow |
| Esc closes the assistant and returns focus | Pass |
| More sheet closes when resized to desktop | Pass |
| Footer sits at the bottom of a 2600px-tall window | Pass |
| Assistant on phones fills the screen | Pass (844px on an 844px screen) |
| Card padding, measured to the first and last text | 22–26px top and bottom on every card at 1280px |
| Family switcher filters claims and returns focus | Pass (Roy 3, Keeley 1, Leo 1) |
| For you disappears after the last dismiss, and stays gone on reload | Pass; focus moves to the ID card heading |
| Log out: confirm, done state, Esc resets and returns focus | Pass |
| Placeholder links show the message and stay on the page | Pass |

SEO scores 60 only because of the intentional `noindex`.
Mobile load time misses the 2.5s target because the full Bootstrap stylesheet comes from the CDN; fixing it would mean self-hosting a trimmed copy.
Still to check by hand: an NVDA or VoiceOver read-through, and 200% zoom on a real device.
