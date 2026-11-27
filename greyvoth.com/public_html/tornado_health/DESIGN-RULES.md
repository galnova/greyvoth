# Tornado Health design rules

Living document for the Tornado Health member portal (portfolio demo, fictional brand, synthetic data).
It becomes the pattern page in a later step. Updated after revision 15: the site is now multi-page (home and Coverage), with a generated shared shell.

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

All raw values live in section 1 of `portal.css` (`--th-*`). Section 2 maps them to Bootstrap variables (repeating a few colors as RGB triplets, which Bootstrap needs). Nothing below that uses a raw color, shadow, radius or font size.

### Color

| Token | Hex | Role |
|---|---|---|
| purple-50 | `#F5F2FB` | Tints: hover, active tab, open nav item |
| purple-100 | `#EBE4F7` | Action strip background (body text on it: 14.6:1) |
| purple-200 | `#D5C8EE` | Meter track, greeting meta text |
| purple-300, 500 | `#B7A2E0`, `#7354B5` | Reserved, decorative only |
| purple-400 | `#9478CD` | Meta-line dividers on the band (decorative) |
| purple-600 | `#5A3D98` | Focus ring, family switcher hover |
| purple-700 | `#472D7F` | Family switcher button |
| purple-800 | `#3B1F6E` | Primary: buttons, links, meter fill, ID card, avatar, greeting band |
| purple-900 | `#26134A` | Primary hover, AI Chat promo panel |
| white | `#FFFFFF` | Surfaces |
| neutral-50 | `#F7F6FA` | Page background, More tiles |
| neutral-200 | `#E1DEE9` | Decorative card borders, dividers |
| neutral-500 | `#6E6A7C` | Meaningful borders (inputs, outlines) |
| neutral-600 | `#57536A` | Muted text |
| neutral-900 | `#17151F` | Body text |
| success | `#1E6B3A` (600), `#E3F3E8` (50) | Status badges: white on 600, 6.5:1 (Processed, All clear); 50 tints icon chips |
| warning | `#8A4B00` (600), `#FDF0DC` (50) | Status badges: white on 600, 6.8:1 (Needs info); 50 tints icon chips |
| danger | `#B42318` (600), `#FDECEA` (50) | White on 600, 6.6:1 (errors, avatar counter) |
| info | `#1D5C9E` (600), `#E6F0FB` (50) | White on 600, 6.8:1 (In review); 50 tints icon chips |

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

Cards have no border; they're separated by surface color, shadow and spacing. Dividers inside cards and between list and table rows (`neutral-200`, 1.7:1) are decorative. Bootstrap draws list-group, table and border-utility lines with `--bs-border-color`, which here is the darker field outline (neutral-500), so those are set to neutral-200 once in the CSS; neutral-500 is only for field, checkbox and radio outlines.

### Type

System font stack, so there's no web font and no layout shift.

| Token | Value | Use |
|---|---|---|
| `--th-fs-h1` | `clamp(1.625rem, 1.4rem + 1.1vw, 2.125rem)` | Greeting (one h1 per page) |
| `--th-fs-h2` | `clamp(1.1875rem, 1.1rem + .45vw, 1.375rem)` | Section titles |
| `--th-fs-h3` | `clamp(1.0625rem, 1rem + .3vw, 1.1875rem)` | Small headings |
| `--th-fs-stat` | `clamp(1.625rem, 1.5rem + .5vw, 1.875rem)` | Amounts spent in Your plan |
| `--th-fs-base` | `clamp(1rem, .97rem + .15vw, 1.0625rem)` | Body |
| `--th-fs-nav-icon` | `1.125rem` | Bottom nav icons |
| `--th-fs-sm` | `.875rem` | Nav, meta, helper text |
| `--th-fs-xs` | `.8125rem` | ID card labels, avatar initials, megamenu group titles |
| `--th-fs-2xs` | `.75rem` | Bottom nav labels |
| `--th-fs-3xs` | `.6875rem` | Avatar counter |
| `--th-measure` | `65ch` | Max line length (`.measure`) |

### Spacing, radii, elevation, targets

- **Spacing:** Bootstrap's scale only (4 / 8 / 16 / 24 / 48px). Layout spacing is set with utilities in the markup; custom CSS only pads controls (buttons, chips, inputs). The system:
  - **Page:** `container-xl` for every full-width section, with 24px on each side (`--th-page-gutter`, double Bootstrap's 12px), 24px above and below the content (`py-4`) in the band, the main area, the footer and the megamenus.
  - **Cards:** 24px on every side (`card-body p-4`), 24px between cards (`gap-4` / `g-4`). Top and bottom space measure the same.
  - **Inside a card:** heading to content 16px (`mb-3`); a heading with a one-line description uses `mb-1`, then the description `mb-3`; a new group inside a card starts 24px down (`mt-4`).
  - **List rows** (claims, updates, suggestions): 16px apart, set once with `--bs-list-group-item-padding-y`. The first and last rows sit flush so they don't add to the card's 24px. Don't put `py-*` utilities on rows.
  - **Panels and rows inside a card** (claim cards, messages, the order panel, Estimate's panels and places, example panels): 16px padding. No 20px steps.
  - **Status lines** (`.status-line`, `role="status"`) are muted small text (`text-body-secondary`, 7.4:1). They take no space until they show a message, then sit 16px below what they describe.
  - **48px hit areas next to headings or at a card's edge** (header links such as "See all claims", the ID card actions) overlap the space around them (negative block margin) so they don't make the card look padded unevenly.
- **Radii:** `--th-radius-sm` 6px controls (small buttons too: `--bs-border-radius-sm` is mapped to it); `-md` 12px tiles, tinted panels, status chips and chat bubbles; `-lg` 16px cards, ID card, bottom sheet, chat panel and dialog; `-pill` for the avatar counter, meters and sheet handle; `-round` for the avatar, icon chips and chat button.
- **Elevation:** `--th-shadow-card` (cards: soft two-layer shadow, no outline), `--th-shadow-1` (header), `-2` (megamenu), `-3` (chat button, chat panel, overlays). Two hairlines that aren't elevation: `--th-ring-white` (2px white ring around the avatar counter) and `--th-edge-top` (the bottom nav's 1px top edge).
- **Targets:** `--th-target` is 48px. Every standalone link, button, tab, megamenu link and close button meets it. Smaller controls that sit on the band use `--th-control-sm` (32px family switcher) and `--th-control-md` (40px "Start a chat").

## Pages and the shared shell

| Page | File | Data | Status |
|---|---|---|---|
| Home | `index.html` | `data/member.json` | Built |
| Coverage overview | `coverage.html` | `member.json` + `data/coverage.json` | Built |
| Claim summary | `claims.html` | `member.json` + `data/claims.json` (also used by Home's Recent claims) | Built |
| Claim details | `claim-detail.html?id=c-1042` | `member.json` + `data/claims.json` | Built |
| EOB | `eob.html?id=c-1037` | `member.json` + `data/claims.json` | Built |
| Care Decisions (Find Care) | `find-care.html` | `member.json` + `data/findcare.json` | Built |
| Programs overview | `programs.html` | `member.json` + `data/programs.json` | Built |
| ID Cards | `idcards.html` | `member.json` + `data/idcards.json` | Built |
| Message Center | `messages.html` (`#messages`, `#notifications`) | `member.json` + `data/messages.json` | Built |
| Help center | `help.html` (`#contact-title`, `#faq-title`, `#forms-title`) | `member.json` + `data/help.json` (AI Chat questions) | Built |
| Account overview | `account.html` (`#addresses-title`, `#preferences-title`) | `member.json` + `data/account.json` | Built |
| Provider profile | `provider.html?id=p-patel` (`#book-title`) | `member.json` + `data/findcare.json` | Built |
| Behavioral health | `behavioral-health.html` | `member.json` + `data/behavioral.json` (AI Chat questions) | Built |
| Cost estimate | `estimate.html?service=knee-mri` | `member.json` + `data/coverage.json` + `data/estimate.json` | Built |
| Approval details | `auth.html?id=a-mri` | `member.json` + `data/coverage.json` | Built |
| Appeal | `appeal.html?claim=c-1009` | `member.json` + `data/claims.json` | Built |
| Sign in | `signin.html` (`?signed-out`) | none (no portal shell) | Built |
| Accessibility statement | `accessibility.html` | `member.json` | Built |
| Page not found | `404.html` (served by `.htaccess`) | `member.json` | Built |
| Components | `components.html` | `member.json` | Built |
| Case study | `case-study.html` | `member.json` | Built |
| Every prompt | `prompts.html` | `member.json` (the log is written into the page) | Built |

- **Shared shell, one copy each:** the header (logo, megamenus, account menu) lives only in `partials/header.html`, and everything after `<main>` (footer, bottom nav, More sheet, AI Chat, log out dialog, placeholder message) only in `partials/footer.html`. **Edit the navigation there; every page picks it up.** Pages hold just two empty placeholders, `<div class="shell-header" data-include="partials/header.html">` after the skip link and `<div data-include="partials/footer.html">` before `</body>`. `js/portal.js` fetches both first (they're preloaded in each page's `<head>`), puts them in place, marks where you are, and only then starts everything else. The header placeholder holds the header's 64px, so nothing shifts while it loads (measured: no added layout shift, even on a throttled connection). Pages must be served over http (the local server or the host), not opened as files; if the shell can't load, the page shows its load-error notice.
- **Where a page belongs comes from its h1**, set in the partials too: each megamenu button and each bottom-bar tab lists the headings of its pages in `data-pages`, separated by `|` (Coverage: `Coverage|ID Cards`; Claims: `Claims Overview|Claim details|Explanation of Benefits`; Home tab: `Welcome back`; More tab: `Find care|Programs & Services|Help center`). A page whose h1, as written in the HTML, **starts with** one of them belongs there (so "Welcome back, Roy" matches `Welcome back`). Pages that match nothing, like the Message Center, light up nothing. **If you rename a page's h1, update its `data-pages` entries.** Claim details and EOB match on their h1 as written in the HTML, before the claim's name replaces it.
- **More sheet:** built in the browser from the megamenus in `header.html` (each menu's overview first, then its links, minus any link the bottom bar already has), so desktop and mobile menus can't drift apart. Links that exist get real hrefs in `header.html`; everything else stays `#` (the "not part of the demo yet" message).
- **Current page:** the section's top-nav button gets `.is-current` (the same solid tint as hover and open) plus a visually hidden "(current section)"; the overview link inside its megamenu gets `aria-current="page"`; the bottom-bar tab gets `aria-current="page"`.
- **One script:** `js/portal.js` runs the shell on every page and the page's own section from `<body data-page="...">` (`home`, `coverage`). Each page section has `init` (its own controls), `render` (after the data loads) and `onViewing` (what the family switcher changes, and what it announces).
- **Data:** `member.json` is shared (member, family, inbox, AI Chat); each page adds its own file. AI Chat shows the page's own suggested questions and can answer from both files.
- **New page checklist:** copy an existing page (head, the two shell placeholders, the `<main>` pattern); set `data-page` on `<body>`; give it an h1; in `partials/header.html` point its menu link at it and add its h1 to its megamenu's `data-pages`, and to a bottom-bar tab's `data-pages` in `partials/footer.html` if one should light up; add its section to `portal.js` (and `PAGE_DATA`); add its data file.

## Components

### Card
White surface, 16px radius, no outline, `--th-shadow-card`. - Don't nest bordered boxes inside cards. Use a tinted panel or plain rows instead.

### Header
One 64px row: logo (links home), primary nav, a 1px divider, My Account. No theme toggle.
- Below 992px only the logo and My Account show; the bottom nav takes over.

### Account menu
My Account opens a small dropdown (`.account-menu`, right-aligned, 256px), not a megamenu.
- **Avatar counter:** a red circle at the avatar's top-right with a 2px white ring shows the total of unread messages plus new notifications. It is decorative; the button also says "N new" for screen readers.
- **Items, in order:** Messages (unread count badge, opens the Message Center) · Notifications (new count badge, opens its Notifications tab) · divider · **Account overview** (the menu's primary CTA, full-width filled button) · Addresses · Other options · divider · Log out.
- The caret sits 6px from "My Account"; the avatar keeps 16px on its right for the counter.
- Every row is 48px tall with a purple fixed-width icon, the label, and a badge pushed to the right edge. Badge numbers have visually hidden "unread" or "new" after them.
- Counts come from `inbox` in `member.json`.

### Primary nav and megamenu
`<nav aria-label="Primary">` with five items, each a button that opens a full-width megamenu under the header (Bootstrap dropdown, static display).

| Menu | Primary CTA | Sub-options |
|---|---|---|
| Coverage | Coverage overview | **Your benefits:** Medical, Rx, Dental, Vision, Spending Accounts · **Your plan:** ID Cards, Who's Covered, Coordination of Benefits, Referrals & Prior Auths |
| Claims | Claim summary | EOBs (Explanation of Benefits). Claim details aren't in the menu: they open from an individual claim. |
| Find Care | Care Decisions | Find a Doctor, Behavioral Health Support, Get a Second Opinion, Estimate Your Cost |
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
- **Tucks while scrolling:** as the page scrolls, the bar slides down out of view (200ms, ease-out) and the chat button follows it; about 250ms after scrolling stops, both slide back. It stays put within 80px of the top or bottom of the page, while keyboard focus is inside it, while the More sheet is open, and always under reduced motion. Tabbing into the bar brings it back immediately.

### More sheet
Bottom sheet (`offcanvas-bottom`, `role="dialog"`) with a drag-handle cue and a title. It is the full site menu for phones: everything the bottom bar doesn't already reach, grouped exactly like the desktop megamenus.
- **Groups (h3, small uppercase, same style as the megamenu group titles):** Coverage · Claims · Find Care · Programs & Services · Support. Each group lists its overview page first (Care Decisions, Programs overview, Help center), then every megamenu link. Left out because the bottom bar already has them: Coverage overview, Claim summary, ID Cards. Account items (Messages, Notifications, Addresses, Log out) live in the My Account menu, which shows on phones.
- **Rows:** full-width 48px links with a small chevron on the right; tint fill on hover, no underline. "AI Chat" opens the chat panel (the sheet closes first).
- **Section you're in:** the whole group for the current section (Coverage on coverage.html) sits on a light tint panel with a purple group title and a hidden "(current section)", marked by portal.js from the page's h1. The row for your exact tab turns white inside it.
- **Where you are:** when the sheet opens, the row for the current page (and tab, for links like coverage.html#dental) gets the same light tint as the current bottom-bar tab and `aria-current="page"`. Placeholder links never match. On pages only More reaches (listed in the More tab's `data-pages`: Find care, Programs & Services), the More tab itself gets the tint and a hidden "(current section)".
- **Height:** grows with its content up to 85% of the screen, then scrolls inside; the title and close button stay put.
- **One source:** the megamenus and this sheet are generated from the same `MENUS` list (build_nav.py), so they can't drift apart.
- Focus moves in and is trapped; Esc and Close dismiss it; focus returns to the More tab. If a panel's opener is hidden when it closes (AI Chat opened from inside the sheet), focus goes to that panel's visible button instead (the chat button).
- It closes automatically if the window widens to 992px or more.

### Greeting and status
**On phones the band stays compact (198px at 375px, 24% of the screen):** 16px padding instead of 24px; the meta line wraps instead of stacking (the switcher and plan name share the first line and the date always takes its own second line, `.meta-date`, so the date filled in by the script can't reflow the band; 16px between wrapped lines, which looks even with the 8px above the h1 because the h1 has its own space above the letters); the h1 has 8px under it; and the chips stay on one row that scrolls sideways (`.band-chips`, no scrollbar), with the second chip peeking in. The row has 5px of padding offset by a negative margin, so the focus ring isn't clipped by the scroller, and a chip that gets focus scrolls fully into view (12px `scroll-padding`). The row runs to the screen edge (no right inset where chips are cut off); scrolled to the end, the last chip stops at the page gutter (24px), in line with the page. From 768px the chips wrap and the band is unchanged. The same rules apply to every page's band.

A full-width band in the primary purple (`.greeting-band`) directly under the header. It is the page's one dark moment, kept slim: 24px padding top and bottom, no image, no extra height. Inside the page container: today's date (small, purple-200, 8.3:1), then the white H1 "Good morning/afternoon/evening, Roy" by local time (13.1:1), then a row of status chips:
- "1 thing to do" (warning icon), which links to To do.
- "$860 left on your deductible" (wallet icon), which links to Your plan.
Only links get the white chip shape, so nothing looks clickable that isn't. The meta line above the H1 (8px above it) reads: family switcher | date | plan name, with no plan year so longer plan names fit (plain light-lavender text with the shield icon, not a link), separated by 1px pipes (`.meta-divider`). On phones the three stack and the pipes hide. The date is set as soon as the script runs, not after the data loads, so the line doesn't shift.

### Family member switcher
"Viewing: Roy ▾" is the first item in the meta line: a small purple-700 button (32px tall, 6px radius) that opens a dropdown of everyone on the plan (Roy, You · Keeley, Spouse · Leo, Son, age 9), each with initials, name and relationship. The current person has a tint fill, a check and `aria-current="true"`.
- Choosing someone updates the button, filters Recent claims to that person (title becomes "Leo's recent claims"; an empty list says "No recent claims for Leo."), announces the change, and returns focus to the switcher.
- In this demo the To do list and plan totals stay on the subscriber. Family members come from `family` in `member.json`; each claim has a `patient`.
- The band's white focus ring switches back to purple inside the (white) menu.
Chips are white, 12px radius, 48px tall, with no shadow on the band. The focus ring turns white inside the band so it stays visible. Linked chips tint on hover. The page has `scroll-padding` so jumps, and anything focused, land clear of the sticky header (and of the bottom bar on phones).

### AI Chat promo (band, desktop only)
The right third of the greeting band, aligned with the side column below. A darker panel (purple-900, 12px radius, no border) with an inline chat icon and the title "Questions? Ask AI Chat" (h2), one line of copy, and a small light "Start a chat" button that opens the chat panel.
- Kept to the band's existing height: no separate icon column, one-line description, 16px padding.
- The button is light and small on purpose. It is secondary; the action strip's button stays the page's primary action.
- Hidden below 992px, where the floating chat button does the same job.
- **Only on Home, Coverage and Claims**, where a question comes up right away ("What does my plan cover?", "Why do I owe this?"). Other pages leave it out: the floating chat button is on every page, and a second way in would compete with the page's one task. Their bands are shorter for it.

### To do (main column)
Card titled "To do". It holds two groups, ordered by priority:
- **Action strip:** tinted panel (purple-100, 12px radius) with an "Action needed" badge (solid brand purple, white text, exclamation icon; the pale warning style clashed with the lavender panel), the task title (h3), a one-line detail and the page's only primary button (right on desktop, full width on phones). It shows the first task with `actionNeeded: true`, or an "All clear" strip with no button. Its loading placeholder uses the same elements, so nothing shifts.
- **Updates:** small "Updates" label, then one row per in-progress item: icon chip, linked title, short note (for example, "Knee MRI approval in review · Decision by Dec 2").
- Don't make the strip a hero: no oversized type, no extra height, no second button.

### Recent claims (main column)
Card with the last 3 claims for the person being viewed, as aligned rows. From 768px: service and provider · date · "You owe $X" · status badge. On phones: details left, amount over status, both flush with the right edge. "See all claims →" sits in the header.

### Your plan (side column)
Card with deductible and out-of-pocket stacked. Each has a label with "of $X" on the right, the amount spent as the largest number in the column (`--th-fs-stat`), a native `<progress>` meter, and a text equivalent linked by `aria-describedby`.

### ID card (side column)
Compact preview with no logo: the plan name on its own full line (so long names fit), then member, member ID, Rx BIN and Rx PCN. "View →" in the header opens the ID Cards page (`idcards.html`). Download and Add to wallet are icon text buttons below. Mock results write to a `role="status"` line under them.

### For you (side column)
At most 2 suggestions, one row each: the title as an icon link, the reason as small text, and a dismiss button. Dismissals are saved in `localStorage` (try/catch); the next suggestion fills in, the change is announced, and focus moves to the next dismiss button.
- When every suggestion has been dismissed, the whole card disappears (also on reload). Focus moves to the "Your ID card" heading above it. No empty-state message.

### Need care? (home, full width, below the columns)
A slim link card, not a search: "Need care?", one line ("Find an in-network doctor, or compare a video visit, urgent care and the ER.") and a "Find care" link on the right (stacked on phones). Searching lives on the Find Care page only, so there's one search experience to keep right; a second, cut-down search on the home page would repeat the nav.

### Log out dialog
"Log out" in the account menu opens a centered Bootstrap modal instead of logging out straight away.
- **Confirm step:** no icon. "Log out of Tornado Health?", one line on what happens, then the buttons left-aligned with the primary first: "Log out" (filled), "Stay signed in" (outline). On phones they stack full width, Log out on top.
- **After confirming:** the sign-in page, which says "You're signed out."
- Esc, the backdrop and Stay signed in close it and return focus to the My Account button.

### Coverage page
Same band component as the home greeting: Viewing switcher | plan name | plan dates, then the h1 "Coverage" and two link chips ("$860 to go on your deductible" to the Deductible card, "$420 left in your FSA" to the FSA card). The AI Chat promo sits on the right ("Is it covered? Ask AI Chat").

**Tabs:** Overview · Medical · Rx · Dental · Vision, in a white bar under the band (`.page-tabs`: Bootstrap tabs with the ARIA tab pattern; arrow keys move between them, Home and End jump to the first and last). The open tab is a solid brand-purple fill. On phones the five tabs share the width and use small type so all of them show at 375px; below 360px the tab padding tightens so they also fit at 320px. Picking a Coverage tab from the More sheet closes the sheet first, then opens the tab and focuses it. Empty Limits cells in the cost tables say "None" (no blank cells; no em dash, per the copy rules). Benefit lists and cost tables sit flush in their cards like list rows: 22 to 27px top and bottom on every Coverage card.
- **Each tab has an address** (`coverage.html#medical`, `#rx`, `#dental`, `#vision`), kept in step as people switch tabs. The megamenu and More sheet link Medical, Rx, Dental and Vision straight to their tab; Spending Accounts and Referrals & Prior Auths link to their card on Overview. A link to any card inside a tab opens that tab and scrolls to the card. After a link on the page (band chip, "All", megamenu), keyboard focus follows: to the tab for a tab link, or to the card's heading (made focusable with `tabindex="-1"`), because the browser otherwise drops focus to the page. Not on first load, and not while the More sheet is open (its focus trap keeps focus).
- Dental and Vision are separate plans (other lines of business), so each gets its own tab and its own plan name.

**Overview tab**
- **Main column:** Deductible and Out-of-pocket max cards with the same structure: a one-line explanation of individual vs family limits; the family total (standard meter, "$2,190 to go for the family"); then "By person": one row per family member with name, "$640 of $1,500", a thin meter (`.meter-thin`, 6px) and "$860 to go", or a solid green "Met" badge once met.
- **Meter names for screen readers:** each person's meter is named "Roy Kent, deductible" and described by its "$860 to go" or "Met"; the family meters are named "Family Deductible" and "Family Out-of-pocket max" (label plus card heading), the FSA meter "Flexible spending account Available". Every meter (here and on home) carries `aria-valuetext` such as "$640 of $1,500", so it isn't read as a bare percentage.
- **Side column:** Common costs (6 in-network copays, "All" opens the Medical tab), Flexible spending account, Referrals & prior auths, Other insurance.

**Medical, Rx, Dental, Vision tabs:** in-network cost tables (`.cost-table`: real `<table>` with row headers; columns Service, You pay, Limits). Benefit limits show what the person being viewed has used ("Roy has used 4 of 30"). Rx shows tiers for 30-day retail and 90-day mail order. Dental adds Yearly maximum (a thin meter per person, "Used up" badge when reached). Vision adds "When Roy can use it next" for exam, frames, lenses and contacts.

- **Family switcher here:** changes the deductible chip, the referrals list, the limits used and the vision dates. Everyone's deductible and out-of-pocket rows always show.
- **No primary button:** it's a reference page; nothing on it needs doing.
- **Columns balanced:** on Overview both columns end within about 10px of each other at 1280px.

### Claims page (Claim summary)
Same band: Viewing switcher | plan name, h1 "Claims", chips "1 claim needs info" (to the attention card) and "You owe $165" (to This year). AI Chat promo: "Questions about a bill? Ask AI Chat".
- **Needs your attention** (full width, first): the shared action strip with the page's only primary button (Upload form). It shows the first claim with an `action` for the person being viewed; with nothing to do, the card and its chip are hidden (no "all clear" card).
- **Claim type bar:** All · Medical · Rx · Dental · Vision. It filters one list, so it's a radio group (`role="radiogroup"`, native radios, arrow keys) styled exactly like the Coverage tabs; the chosen type is the solid fill.
- **Your claims (main column):** a header card (title, "Showing 9 claims", one line on what "you owe" means, Status and Sort selects), then **each claim is its own card** (`.claim-card`: white, 12px radius, card shadow, 12px apart). A claim card: the service as a link to its details (underline on hover), provider, "Billed $210 · Plan paid $185 · EOB"; date; "You owe $25" (or "Pending" while in process); status badge. Only decided claims (Processed, Not covered) have an EOB link. Filter and sort changes announce the new count.
- **Side column:** This year (you owe, claims in process, billed, plan paid for the person being viewed), Reading your EOB (3 short steps), Submit a claim. On desktop it stays in view while the list scrolls (`.side-sticky`, below the sticky header).
- **Family switcher:** changes the attention card, both chips, the totals and the list ("Keeley owes $210"), and announces "Claims updated. Showing 4 claims."
- **Shared pieces:** the action strip and the claim row live in `portal.js` "Shared pieces"; Home uses the simple row, Claims the detailed card (`claimRow(c, true)`). Home's Recent claims read the same `claims.json`.

### Claim details page (`claim-detail.html?id=…`)
One claim, picked by `?id=` (opened from a claim card's service link). With no id it shows the claim that needs something, else the newest. Claim details are only reached from an individual claim (they're not in the menu or the More sheet); "EOBs" links to the Claims list filtered to Processed (`claims.html?status=Processed`).
- **Band (pages about one thing):** a breadcrumb (`.band-crumbs`: Claims › service), the service as h1, one line of facts (`.band-facts`: patient · provider · date · claim number). No family switcher: the claim belongs to one person.
- **Needs your attention:** the shared action strip, only when the claim has an action (Upload form).
- **Main column:** Where it stands (`.timeline`: a dot per step on a thin rail; done = green check, current = brand purple with a tint ring, next = track color; each step's state is spoken, e.g. "Waiting for your form, current step"; the status badge sits in the card header); Cost breakdown (billed, network discount shown as a minus amount, allowed amount, plan paid, the member's share, then "You owe" / "You may owe" as the big number; "Pending" until decided); Service lines (`.amount-table`).
- **Side column:** What happens next (by status: compare the provider's bill with the EOB; appeal, with the reason it wasn't covered; we're waiting for your form; we'll message you when it's decided) and Claim info (number, patient, provider, network, dates).

### EOB page (`eob.html?id=…`)
One statement card (`.eob-doc`), opened from a claim card's EOB link. Breadcrumb: Claims › service › EOB.
- Heading "Statement for Lab work, Oct 28", then an info notice (`.notice-info`): "This is not a bill. Your provider will send you a bill for what you owe." Print and Download PDF (mock) buttons, outline style.
- Facts grid (member, member ID, patient, claim number, provider, network, date of service, date processed), the service table (billed, network discount, allowed, plan paid, you owe, with a total row; it scrolls sideways on phones inside a focusable, named region), Your share, Notes (the reason when it wasn't covered), and appeal rights.
- Claims not decided yet have no EOB: the page says so and links back to the claim.
- **Print:** only the statement prints (header, band, footer, bottom nav, chat button and the buttons themselves are hidden).
- **Amount tables:** every money column is regular weight and the same color; "You owe" and the total row are bold. Discounts use a real minus sign, not a hyphen or dash.

### Find Care page (`find-care.html`)
The "Care Decisions" overview. On phones it's reached from More, so the More tab lights up and the More sheet highlights the Find Care group and the "Care Decisions" row. The menu's Find a Doctor, Behavioral Health Support, Get a Second Opinion and Estimate Your Cost link to their cards here.
- **Band:** Viewing switcher | plan name, h1 "Find care", chips "Find a doctor" and "Compare care options".
- **Emergency first:** a danger notice above everything: call 911 or go to the ER; in a mental health crisis, call or text 988.
- **Find a doctor (main column):** name/specialty/condition plus ZIP, "Accepting new patients only", and Search as the page's only filled primary button. Errors sit under their field (`aria-invalid`, focus moves to the field). Popular searches run a search. Results (hidden until the first search) are rows: the provider as a link, specialty and practice, distance and next opening, the visit cost in bold and a "New patients" badge or "Not taking new patients". The count is announced; chips and the side links move focus to the Results heading.
- **Compare your options:** a purple-100 card (`.options-card`: transparent rows, purple-200 lines, white icon tiles) so it stands apart from the white search card. Video visit $0, Primary care $25, Urgent care $50, Emergency room $250: an icon chip, what it's good for, typical wait and hours, and the cost on the right.
- **Side column:** Your doctors (follows the switcher; "Book a visit" links have a 24px target), Behavioral health support (24/7 phone line and "Find a therapist", which runs the search), Get a second opinion, Estimate your cost.
- **Arriving with a search:** `find-care.html?q=...` runs that search on load (the home page links here without one).

### Programs & Services page (`programs.html`)
The "Programs overview". On phones it's reached from More (More tab lit, Programs group and row highlighted). The menu's Health Care & Well-Being and Rewards & Perks link to their sections. One column of full-width sections, top to bottom:
- **Recommended (first):** left: the eyebrow, then the program's icon tile and title on one row, an eyebrow ("Recommended for you" / "for Leo"), the program as h2, why it's suggested, then **Enroll** (the page's only filled button) and "Learn more". Right: "What you get" as a green-check list in a tinted panel (`.tint-panel`). After enrolling, a success notice replaces the buttons and takes focus. That program isn't repeated below.
- **Health and well-being:** a header card (h2 and "Programs that fit Roy"), then **one card per program, 3 across on desktop, 2 on tablets, 1 on phones** (equal heights in a row): the icon tile and title on one row (`.icon-heading`), then one line, "Free · 12 weeks · Phone", and a secondary action pinned to the bottom: outline **+ Join** (24px side padding, the same as Enroll, `.program-join`), or a green "Enrolled" badge. Enrolled programs sort first. Adults see adult programs; children (`isChild` in member.json) see kids' programs. Joining announces it and moves focus to the section heading.
- **Rewards: a full-width dark purple band** (`.dark-band`, shared with Forms on the Help center; edge to edge, 48px padding) between the program cards and Perks, so the page isn't white card on white card. Points with a white meter on a mid-purple track and "Redeem points" on the left; ways to earn (white check when done, lavender circle when not) on the right; a faint white line divides the two sides on desktop, with a 48px gutter. Text is white, secondary text lavender, and the focus ring white.
- **Perks (full width):** partner discounts in a row of four (two on phones), each with an icon chip (brand tint), a label and the discount in bold; "All perks" in the header. A plain list, not a `dl`.
- **Section heading for the program cards** sits on the page background (no card behind it), like a heading over a grid.
- **Privacy:** an info notice: programs are voluntary and private.
- **Icons, not illustrations:** each program, the recommended card, Rewards (gift) and Perks (tags) show a Font Awesome icon in a brand-tinted tile (`.program-art`: purple-50 tint, purple icon, 6px radius). Program icons come from `icon` in programs.json (walking person, comments, no smoking, pregnant person, droplet, brain, child, moon). **Size rule: no image or icon tile is ever bigger or more prominent than the Tornado Health logo** (about 31px tall on desktop, 28px on phones), so tiles are 32px on desktop and 28px on phones.
- **Family switcher:** changes the recommendation, the program cards and enrollments. Demo enrollments are remembered per person in localStorage.

### ID Cards page (`idcards.html`)
The bottom bar's ID Card tab, the Coverage menu's ID Cards link and the home ID card's "View →" all open it. Band: a breadcrumb first ("Coverage › ID Cards", `.band-crumbs`, since the page is part of Coverage but the bottom bar and home card reach it directly), then the family switcher and plan, then h1 "ID Cards" (no AI Chat promo). Then **three cards: Medical, Dental, Vision**, each a white section card (`.idc-section`). **From 1200px, three across on the page background** (no white box, which wouldn't leave room for three actual-size cards; same parts, so the same height). **768-1199px: one per row** in a white box, the ID card on the left and its heading, actions and order panel beside it (so no card sits alone with empty space next to it). **Phones: one column, without the white box** (so the card fits at actual size). Each has h2 ("Medical card"), whose card it is and where it's used ("Your card, for the dentist."), the ID card, then its actions.
- **The ID card (`.idc`): actual size, 3.375 × 2.125 in** (85.6 × 54mm; 324 × 204 CSS px) on every layout, desktop and phone. Only a screen narrower than the card (under about 340px) shrinks it, keeping the shape. Text is sized from the card's width (11px at actual size, like a printed card), so it stays in proportion; if text is zoomed, the card grows taller rather than clipping.
  - **Front:** brand purple, a different step per card so they never get mixed up: Medical purple-800, Dental purple-600, Vision purple-500. The logo (no bigger than the header's), the kind ("MEDICAL" with a stethoscope, "DENTAL" with a tooth, "VISION" with an eye), the plan, Member and Member ID (each person adds their own two digits: 01 Roy, 02 Keeley, 03 Leo), plan numbers (Group and Rx BIN / PCN / GRP; Dental and Vision: Group and Network), then what you pay along the bottom under a faint line (copays; Dental: cleanings, fillings, crowns, yearly max; Vision: eye exam, lenses, and the frames and contacts allowances). Values match the Coverage page.
  - **Back:** light lavender with dark text: phone numbers as call links (24px tall targets), where to send claims, the effective date, the site and "This card doesn't guarantee coverage."
- **Flip:** "Show back" / "Show front" (outline button, with a rotate icon), or click the card. The card turns over (600ms ease-out; instant under reduced motion). The face that's turned away is `inert`, so keyboard and screen readers only reach what's showing, and the side shown is announced.
- **Print:** prints just that card, front and back at real size (3.375 × 2.125 in), from a hidden frame, so nothing else on the page prints.
- **Order a card:** opens a tinted panel under the actions ("Mail a new medical card for Roy?", the address, 7 to 10 days, the digital card works until then) with **Order card** and Cancel. Focus moves into the panel, and Cancel returns it to the button. After ordering, a success notice replaces the button and takes focus. Orders are remembered per person and card (localStorage).
- **Phones (below 768px):** each card shows its full front at actual size on the page background. **Open card**, a button stretched over the whole card so a tap anywhere opens it, opens a **full-screen dialog** (`.idc-modal`, `modal-fullscreen-md-down`): "Your medical card" and a close X at the top, the card at actual size, centered (the side padding gives way on narrow phones so it still fits), then **Show back** (filled, full width) with Print and Order a card side by side below it (stacked under 360px). The dialog has its own status line for announcements; on close, focus returns to that card's Open card button.
- **Family switcher:** shows that person's cards (their name and member ID) and their orders.
- **Data:** `data/idcards.json`: mailing address, and per card: plan, ID prefix, fields, costs, contacts, claims address, effective date; plus AI Chat questions (lost card, which card at the pharmacy, family cards).

### Message Center page (`messages.html`)
Reached from the account menu: **Messages** opens `messages.html#messages`, **Notifications** opens `messages.html#notifications`. No bottom-bar tab or megamenu lights up (its h1 isn't in any `data-pages` list) and there's no family switcher: messages belong to the whole account. Band: h1 "Message Center" and one line ("Secure messages and updates from Tornado Health. We reply within 1 business day."). No AI Chat promo.
- **Tabs (`.page-tabs`):** Messages and Notifications, each with its unread count as a small solid pill (`.tab-count`; white on the open tab). Each tab has its own address, so the account menu opens the right one, even from the page itself.
- **Messages, 992px and up:** two panes. Left (1/3): the **Inbox** card, which stays in view while a long conversation scrolls (`.side-sticky`), with **New message** (the page's primary button) in its header. Rows run edge to edge: unread dot, sender, date; the subject on one line (cut off with "…"; the full subject is the conversation's title, and screen readers hear all of it); one line of the latest message ("You: ..." when it's yours). Unread rows are bold with a dot; the open conversation is a solid purple-100 tint. Right (2/3): the open conversation, the new-message form, or, with nothing open, a short centered prompt ("Pick a message to read it").
- **Messages, below 992px:** the list and the conversation take turns. Opening a row shows the conversation with "← All messages" above it; the browser's Back does the same.
- **Addresses:** `?thread=t-1` opens a conversation and `?new=1` the form, so links can open a thread directly. Opening a conversation moves focus to its title; going back moves focus to the row you came from.
- **A conversation:** subject (h2), then "sender · topic · about whom". Messages oldest first, each a tinted panel (ours on neutral-50, yours on the brand tint; not chat bubbles): avatar (yours: your initials; ours: a shield on white), name, date and time, the text, attachments as white chips with a light shadow (file icon, name, size), and links ("View claim →"). On phones the time sits under the name. If the last message is yours, an info notice says "We got your message. We reply within 1 business day." Then **Reply**: a textarea with a hint (reply time, call 911 in an emergency) and **Send reply**. An empty reply shows an inline error and keeps focus in the field.
- **New message:** Topic (required) and Who it's about side by side, Subject (required), Message (required, with the emergency hint), Attach files (optional; PDFs or photos; not uploaded in the demo), then **Send message** and Cancel. Errors appear under each field (`aria-invalid`, described by the error and hint), and focus goes to the first one. Sending opens the new conversation at the top of the Inbox and focuses the "We got your message" notice.
- **Read and unread:** `member.json` lists the unread ids (`inbox.messages`, `inbox.notifications`). Opening a conversation, following a notification, or Mark all as read remembers the id (localStorage, `th-read`), so the avatar counter, the account menu badges and the tab counts drop on every page. A count of 0 hides its badge (`data-hide-zero`). Messages and replies written in the demo are remembered too.
- **Notifications:** one card. Header: h2 and **Mark all as read** (only while something is new). **New** first, then **Earlier** (small uppercase group titles); with nothing new, "You're all caught up." Each row: an icon chip in its tone (Bootstrap subtle background), the title (bold with a dot when new), detail and date, and its action on the right ("View claim →", "Upload form →"; under the text on phones). Following the action reads it. A closing line links to notification settings (placeholder).
- **Data:** `data/messages.json`: topics, threads (sender, topic, who it's about, messages with attachments and links), notifications (icon, tone, title, detail, date, action) and AI Chat questions (reply time, sending a photo of a form, who can see messages).

### Help center page (`help.html`)
Reached from the Support menu (Help center; Contact Us, FAQ and All Forms jump to its sections) and the footer's "Help & contact". It lights up Support, and More on phones. No family switcher. Band: h1 "Help center" and two jump chips, **Contact us** and **Forms** (so phones can skip down). No AI Chat promo.
- **Written into the page:** the questions, contacts and forms are plain HTML, not loaded from data, so the page doesn't shift while loading and search works before the data arrives. `data/help.json` only holds the page's AI Chat questions (reaching a person, forms, the nurse line).
- **Full width,** top to bottom:
  - **How can we help?** (the page's one focus): a labelled search field with a filled **Search** button, then popular searches as chips (Lost ID card, Claim needs a form, 90-day supply, After-hours care).
  - **Topics:** the same radio-group bar as the claim filters: All, Claims, Coverage, ID cards, Pharmacy, Find care, Account.
  - **Common questions:** 15 native disclosure rows (`details`/`summary`, `.faq`): the whole question is a 48px target with a chevron that turns when open, hairlines between rows. Each answer is a short paragraph or two plus links to where to act ("Open the claim that needs a form →"). No per-answer feedback buttons.
  - **Forms: a full-width dark purple band** (`.dark-band`, the same pattern as Rewards on Programs) between the questions and Contact us, so the page isn't white card on white card. White heading and form links, lavender secondary text, white focus ring. Five PDFs, three across on desktop and two on tablets: a PDF icon on the brand tint, the form name as the link (its size read out with it), what it's for, and "PDF · 84 KB". Links are placeholders in the demo.
  - **Contact us (last):** four ways, four across on wide screens and two on tablets, each with an icon chip: send a secure message (to a new message in the Message Center), call Member services (number large, with hours and TTY 711), the 24/7 nurse line, and Ask AI Chat (opens the chat panel). Then the emergency notice (911, and 988 for a mental health crisis). The band's **Contact us** chip jumps here.
- **Search:** filters as you type, matching every word against the question, the answer and a few extra words per question (`data-keywords`, so "refill" finds the 90-day answer). Topic and words combine. The count line says "15 questions" or "1 answer for "lost card""; a single match opens. Counts are announced once typing pauses. **Search** (or a popular chip) also moves focus to the results heading and puts the search in the address (`help.html?q=lost+card`), so a search can be linked. No matches: "No answers for "…"", a hint, and a link to send a message.
- **Links to one question:** `help.html#faq-lost-card` opens that answer.

### Account overview page (`account.html`)
The account menu's **Account overview** (its filled button, marked current on this page), **Addresses** (`#addresses-title`) and **Other options** (`#preferences-title`) open it; so do the Message Center's "notification settings" link and the Help center's address answer. No megamenu or bottom tab lights up, and there's no family switcher (the account is the subscriber's). Band: h1 and four jump chips (Your details, Who's covered, Preferences, Sign-in and security).
- **Written into the page:** current details are in the HTML (`data-field`), so nothing shifts while `data/account.json` loads; the script fills them from the data plus anything changed here. Contact details and the home address live in `member.json` (with the demo's date, `today`), so a change here also shows on ID Cards (where a new card is mailed) and Provider (the ZIP for distances, the phone the office calls).
- **Your details:** contact info on the left (name, date of birth, member ID, email, mobile, language for calls and letters; label over value, two across, one on small phones) and the **home and mailing address** in a tinted panel on the right. Each has **Edit**, which swaps the details for a form in place: labelled fields, errors under each field (email format, 10-digit phone; street, city, 2-letter state, 5-digit ZIP), focus on the first problem, **Save** and Cancel. Save or Cancel returns focus to Edit, and a status line says what was saved. Changes are remembered in this browser (demo).
- **One address everywhere:** a saved address is what ID Cards shows when you order a card ("We'll send it to…").
- **Who's covered:** the plan line (plan, group, employer, plan year), then one gray tile per person, three across: avatar, name, relation ("You · Subscriber"), member ID (01, 02, 03, matching their ID cards) and date of birth; "ID cards →" in the header.
- **Communication preferences:** six switches, two across, each with a one-line hint (the email and phone hints follow your contact info). They save as they change, and a status line confirms ("Saved: Text me reminders, on."). Switches are 24px tall, gray with a white knob when off and brand purple when on, with no border.
- **Sign-in and security:** rows with an icon chip, the text and an action on the right (under it on phones): password (last changed), two-step verification (green "On" badge; the code goes to your phone's last four digits) and signed-in devices with **Sign out of other devices**, which goes away once used; focus moves to the line that confirms it.

### Provider profile (`provider.html?id=p-patel`)
Find Care results, "Your doctors" names and the behavioral health page link here; "Book a visit" links to `#book-title`. Lights up Find Care (h1 "Provider details" before the data). Everything comes from the provider, so the content waits (`data-loading`).
- **Band:** "Find care › name" breadcrumb, the name, specialty and practice.
- **Main (2/3):** About (badges: In network; Taking new patients or Not taking new patients (warning); "Your doctor" / "Leo's doctor" when someone in the family sees them), the bio, and specialty, languages, visit types, hospital); What you'll pay (the copay as the large number, what it covers, a link to the cost estimate); Location and hours (address, distance, phone, directions).
- **Side (1/3, stays in view): Book a visit.** Who it's for, earliest day (a date field that starts at the next opening), morning or afternoon, visit type when there's a choice, an optional reason, **Request a visit**. A day before the next opening is an error. Sending replaces the form with a success notice (the office calls within 1 business day) that takes focus. Not taking new patients: booking only for family members who already see them; otherwise a note and a link to others in that specialty. Urgent care: "Walk in" and the hours, no form.
- **Data:** `findcare.json` providers have address, phone, hours, languages, visit types, hospital and a short bio. An unknown id shows a "couldn't find that provider" notice.

### Behavioral health page (`behavioral-health.html`)
The Find Care menu's Behavioral Health Support, and the Find Care page's card ("All support"), link here; it lights up Find Care. Written into the page.
- **Crisis first:** a danger notice at the top: call or text 988, and 911 in an emergency, as call links.
- **Talk to someone today (the page's focus):** three cards: the 24/7 behavioral health line (1-800-555-0130, its own number; the Find Care card uses it too), 5 free counseling sessions (Mental well-being), and therapy in person or by video ($25, no referral).
- **Therapists and psychiatrists** (the in-network behavioral providers, linked to their profiles; a tip at the bottom: the line can match you with someone) beside **Programs that help** (Mental well-being, Sleep better, Health coaching).
- **What you pay:** a cost table (line and sessions $0; therapy or psychiatry $25, matching Coverage's mental health office visit; intensive and inpatient 20% after deductible with approval; ER $250). No scroll wrapper: the table wraps to fit, like Coverage's.
- **Privacy:** an info notice that behavioral health care isn't shared with your employer or other adults on the plan.

### Cost estimate (`estimate.html?service=knee-mri`)
The Find Care menu's Estimate Your Cost, the Find Care card, the provider page and the MRI approval link here; it lights up Find Care. The family switcher changes the answer.
- **The question:** a service select (scans and tests, visits, procedures) beside a tinted panel with where the person stands: deductible left and what's left before the out-of-pocket max (from `coverage.json`).
- **Compare places:** in-network places as choosable rows (radio, name, distance, price, and what you'd pay on the right), cheapest for you first; the chosen row is a solid purple-100 tint. A note at the bottom explains why prices differ.
- **Your estimate (side, stays in view):** what you'd pay as the large number, then a breakdown table: price, toward your deductible, your 20% share after that (or the copay, or preventive $0), capped at the out-of-pocket max when it applies, you'd pay, the plan pays. Notes per service (the MRI needs approval, the ER copay is waived if admitted, screening is free) and a line that it's an estimate, not a promise.
- **Rules:** preventive $0; copay services pay the copay (never more than the price or what's left to the max); otherwise the deductible first, then 20%, capped at the out-of-pocket max. `?service=` keeps the choice in the address. Two data files load as one (`PAGE_DATA` can list several).

### Approval details (`auth.html?id=a-mri`)
Each approval on Coverage (Referrals & prior auths) links here; it lights up Coverage. Content waits for the data.
- **Band:** "Coverage › title" breadcrumb, the title, then kind · for whom · requested date.
- **Status card:** a badge, the headline ("In review: a decision by Dec 2"), what happens next, and the timeline (the same component as claims, now shared: done steps get a green check, the current step purple).
- **Details:** what's requested (or who it's a referral to), for, requested by, where, reason given, good-through or decision date, reference number.
- **Side (stays in view):** for approvals with a number of visits, a meter ("4 of 12 used, 8 left"); then **What you can do**: estimate the cost, see the provider, ask us about it, all approvals.

### Appeal (`appeal.html?claim=c-1009`)
"Start an appeal" on a claim we didn't cover opens it (lights up Claims). Three steps in one card, one at a time, with a step indicator (done: green check; current: filled purple, `aria-current="step"`); each step's heading takes focus.
1. **Why:** three choices as roomy radio rows (should be covered, the amount is wrong, something else) and "Tell us what happened" (required).
2. **Details:** optional documents (not uploaded in the demo) and how we should reach you.
3. **Review and send:** the answers, a required "this is true" checkbox, **Send appeal**. Back keeps every answer.
- **Sent:** a success notice with the reference number, sent and decision dates (30 days), what happens next, and links back to the claim and the Message Center. It's remembered (localStorage, `th-appeals`): the page reopens on the confirmation, and the claim's "What happens next" says the appeal is in review, with "See your appeal".
- **Side (stays in view):** the claim (billed, plan paid, you owe), why it wasn't covered, the 180-day window and ways to ask.
- A claim that wasn't denied shows a short note instead of the form.

### Sign in (`signin.html`)
Signed out, so no portal shell: just the logo, one centered card and a short footer. Confirming **Log out** comes here with "You're signed out" (`?signed-out`).
- Email and password are filled in (a demo notice says so). Password has Show/Hide inside the field (`aria-pressed`). Remember me and Forgot password on one row. Errors under each field; **Sign in** goes to Home.
- **No "save password?" prompt:** the fields are `autocomplete="off"`, and they're emptied (and the password field made plain text) just before leaving, so browsers have nothing to offer to save.
- Placeholder links say "That isn't part of the demo yet" in the page (the toast lives in the shell).

### Accessibility statement (`accessibility.html`)
The footer link. Our commitment (WCAG 2.2 AA), what's built in, how we check, known limits, other formats; a side card to report a barrier. Claims only what the demo does and was tested for.

### Page not found (`404.html`)
`.htaccess` serves it for missing addresses (`ErrorDocument 404 /tornado_health/404.html`); `<base href="/tornado_health/">` keeps its styles, shell and links working at any depth. A search that goes to the Help center's answers, and links to Home, Claims, Find care and Help center.

### Components (`components.html`)
The design system, live: the footer links it ("Components"). Every example is the real markup and css: color tokens, type, radii and shadows; buttons, links, chips, band pieces, tabs and filters; badges, counts, notices, the message and the dialog; fields with hints and errors, checks, radios, switch, password field; cards, rows, tiles, choosable rows, disclosure, the dark band; meters, timeline, cost table, details, the ID card; loading placeholders (rows, `.loading-card`, `.idc-skeleton`) and empty states. Class names sit under each example.

### Case study (`case-study.html`) and prompt log (`prompts.html`)
The footer's **Case study** link (after Components). Written for portfolio reviewers, in Keith's voice: overview, the problem, goals, key decisions, how the AI work was directed, measured results and honest next steps (no user research yet), in the long-form `.statement` style, with an **At a glance** side card (role, timeline, tools, scale, and links: Try the portal, the design system, every prompt, the accessibility statement). It says plainly that this is a concept, not client work.
- **Taking it to production (`#cs-production`, last section):** the Angular and AEM version in brief: who owns what (AEM content, Angular and an API layer for member data, never health data in AEM), how each prototype piece translates, four folded code samples (`details.cs-code`, focusable `pre` that scrolls inside itself), and effort and risks, labeled a rough estimate. Linked from At a glance ("How it would be built").
- **Every prompt (`prompts.html`):** the 158 prompts, in order and exactly as typed (typos kept), from the point the project was named Tornado Health; earlier, unrelated prompts are left out. Each shows its number, time (Eastern) and "While working" when it was sent mid-task. Nothing pasted is shown (a prompt that was only a paste is left out; one with typed words keeps just those). The one long typed prompt folds behind "Show the full prompt". System notices and interruption markers are left out. Generated from the session transcript into static HTML.

### Placeholder links
Every link that still points to `#` shows a small primary-purple message at the bottom center ("This page isn't part of the demo yet.") with white text. The close X sits 12px from the right edge, mirroring the 12px text inset on the left, inside a 48px hit area instead of jumping to the top. It sits above the bottom nav on smaller screens, closes on its own after 5 seconds, and its container is a polite live region so screen readers hear it.
- As real pages are added, give their links real hrefs; the message then stops for those links with no other change.

### AI Chat
The assistant is always called **AI Chat** in the interface (panel title, button names, Support menu link).
- **Button:** fixed, 56px, named "Open AI Chat". On phones and tablets it sits above the bottom nav.
- **Panel size:** on desktop (992px and up) a floating card in the bottom-right, 400px wide and at most 640px tall, with 16px radius. On tablets it's a 400px side panel; on phones it fills the whole screen.
- **Panel:** `offcanvas-end`, `role="dialog"`. Shows a demo note, then a message log (`role="log"`, `aria-live="polite"`, focusable so keyboard users can scroll it) and suggested questions as buttons.
- **Suggested questions** are a starting point: once any question is asked (picked or typed), they are removed and focus goes to the input.
- **Bubbles** (`.chat-bubble`, 12px radius, 16px padding from `p-3`): AI Chat answers on the page tint; the member's questions add `.chat-bubble-user` (primary tint, primary text, pushed right). The markup and the script use the same classes, so the two can't drift.
- **Input at the bottom:** a labeled text field with the send arrow inside it.
- Typed questions are matched to keywords in `member.json`; anything else gets a friendly fallback answer.
- Focus is trapped while open; Esc returns focus to the chat button.

### Motion
Short and quiet, so the page feels responsive without calling attention to itself. Opacity and transform only, never layout properties. Easing is `--th-ease-out` (ease-out-quart); nothing bounces.
- **Hover fills** on nav items, menu rows, chips, tiles, tabs and buttons fade in over 150ms.
- **Menus** (megamenus and the account menu) drop in: fade plus a 4px slide, 180ms.
- **Loaded content** fades in over its placeholder (300ms). Placeholders match the real content's size, so nothing shifts (CLS stays under 0.01). Where the default content is known, it's written into the page instead of a placeholder (Programs' "What you get"). **Claim details and EOB** depend almost entirely on the claim, so their content waits invisibly (`data-loading`) over one card-shaped placeholder and appears all at once; on phones the band's facts line holds two lines from the start. Measured on a throttled connection with an empty cache: every page under 0.01 from 320px to 1280px. Only once: a list drawn again later (opening a message, switching family member) updates without fading (`data-settled`).
- **Plan meters** fill from zero once on load (700ms, `requestAnimationFrame`).
- All of it is off when the OS asks for reduced motion: meters render at their value, nothing fades or slides.
- **Programs page only:** hovering a program card (or tabbing into it) bounces its icon once; hovering a perk beats its icon once. These use Font Awesome's own `fa-bounce` / `fa-beat` keyframes, play one time, and are off under reduced motion.
- Don't add: scroll-triggered reveals, parallax, looping or attention-seeking animation, arrow nudges on hover (tried and removed), or motion on the action strip's button.

### Notices
Every notification-style message uses one component: `.notice` plus a tone (`.notice-info`, `-success`, `-warning`, `-danger`).
- **Background:** the tone's status color at 25% on white (`--th-info-tint` and friends, made with `color-mix`). No border, 12px radius, 12px by 16px padding.
- **Text:** dark body color, small and semibold, never the status color: on a 25% tint, green and red text would fall under 4.5:1. The leading icon carries the tone (`fa-circle-info` for info, `fa-circle-exclamation` for danger).
- **In use:** the EOB's "This is not a bill" and "No EOB yet" (info), the AI Chat demo note (info), and the "We couldn't load your information" error on every page (danger, `role="alert"`). Use it for any new message of this kind instead of a Bootstrap alert.

### Badges
24px tall, solid color with white text (status tones, brand purple for Action needed and counts).
- **Optical centering:** the label sits in its own span with `text-box: trim-both cap alphabetic`, so it centers on the letters, not the font's line box. (Segoe UI reserves extra space above the letters, which made labels sit about 1.25px low.) Icons in badges move down .09em, because Font Awesome glyphs sit high when flexbox centers them.
- Measured with letter pixels: every badge within 0.4px of center. Browsers without `text-box` keep the previous look.

### Links
- Links and link-buttons with an icon use one class, `.link-icon`: inline-flex, icon vertically centered with the text, 8px gap, semibold, never underlined (including the dismiss X). Hover changes color only. Measured: every icon sits at 0px offset from its text's center.
- Plain text links keep the underline.
- **Back links** ("All messages", "Back to the claim", "Back to claims") put a left arrow before the text; links on to somewhere put a right arrow after it.

### Focus
One rule for everything: a 3px solid ring in purple-600 with a 2px offset. Bootstrap parts that remove the outline get it back at the same specificity, including selects, checkboxes, radios and switches (Bootstrap's `:focus { outline: 0 }` otherwise wins). Fields keep their gray outline while focused; the ring shows focus, not a light blue border.
- **Never hidden under the bars (WCAG 2.4.11):** `scroll-padding` on the page keeps whatever is scrolled to clear of the sticky header, and below 992px of the bottom bar and chat button.
- **Skip to main content** (`.skip-link`) sits above the sticky header when focused.
- Anything that scrolls (`overflow: auto`) clips the ring, so it needs at least 5px of padding around focusable children (the tab bar has 6px; the band chips get 5px offset by a negative margin).

### Shared details added with these pages
- **Reset demo (footer):** clears everything the demo remembered (localStorage keys starting `th-`) and returns to Home, which says "The demo is back to where it started." Staying put could undo it (an open message would be read again).
- **Bottom nav:** tabs share the bar equally with flex, however many there are.
- **More sheet:** a hairline between groups, centered in the gap (never on the current group's rounded panel). No border on its rounded top.
- **Menus:** a pressed item turns the brand tint, never Bootstrap blue (every menu, not just the megamenus).
- **Fields with an error:** a red outline (danger-600) to match the message under them; the focus ring stays purple. **Password fields** are 48px tall, so Show/Hide sits centered.
- **Loading placeholders pulse** with Bootstrap 5's own `placeholder-glow` animation (the card-shaped placeholder too); it's off under reduced motion.
- **Checks and radios:** brand purple when chosen; the unchecked outline is neutral-500 (3:1 against white). **Disabled buttons:** the brand purple, faded (Bootstrap's default is blue).
- **Timeline rows** are one shared helper (`timelineStep`) for claims and approvals.
- **One of each, no copies:** form errors go through one helper (`setFieldError`, and `checkFields` to show several and focus the first problem) on every form; one `focusEl` moves focus to a heading or notice. One `.tint-panel` (menu call-to-action box, Programs' "What you get", the account address), one `.action-row` with `.row-action` (notifications, sign-in and security), one `.measure`, one `.help-phone` for a phone line to call. In the script, one copy of each builder: `h` and `icon`, `pair` (a label and value), `arrowLink` and `backLink`, `errorLine` (a field's error line), `speak` (every status line), `possessive` ("Your" or "Keeley's") and `memberSuffix` (01, 02, 03). `focusEl` adds `tabindex="-1"` only to things that can't take focus, so controls it focuses stay in the Tab order. One live region (`#live-status`), in the shared footer. Rules that set the same thing share one selector list instead of repeating it.

### Footer
Always at the bottom of the window, even on short pages (the body is a flex column and `main` grows). 24px padding top and bottom, 24px on the sides (12px wider than the page container, as requested).
Help & contact (Help center) · Accessibility statement · Privacy · Language assistance · Nondiscrimination notice (the last three are placeholders). Under them: the year, **Reset demo** and **Components**.

## Test results (whole site, final build)

Published on the case study (`case-study.html#cs-testing`). Tools: axe-core 4.14.1, html-validate 8.18.2, puppeteer-core 23.11.1 driving Microsoft Edge 158 (headless).

| Check | How and where | Result |
|---|---|---|
| Accessibility, WCAG 2.2 AA | axe-core 4.14.1 (every WCAG 2.0, 2.1 and 2.2 A and AA rule, plus best practices) in a real browser, Microsoft Edge 158. All 22 pages at 375px and 1280px, and in their states: form errors, open menus and dialogs, the phone menu, flipped ID cards, search results and empty states, sent messages, each appeal step. | 0 violations |
| What axe can't see | Scripted measurements: checkbox and radio outlines (1.8:1 contrast, now 5:1), where focus lands after every action, no focus ring drawn on arrival, and the optical centering of arrows, badges and counters, measured in pixels. | Fixed and re-measured |
| Valid HTML | html-validate 8.18.2, standard rules, on all 22 pages, both shared partials, and each page as rendered in the browser. | 0 errors |
| Consistent structure | A script checks every page: the same head (Bootstrap and Font Awesome from a CDN with integrity hashes), one h1, landmarks, heading order, unique ids, no inline styles, no !important. | 0 problems |
| Links | Every link and #section jump on all pages and in the shared header and footer, checked against real files and ids. | 0 broken |
| Layout shift while loading | On a slowed connection (150ms latency, about 1.6 Mbps, 4× slower CPU) with an empty cache, every page at 320, 375, 768 and 1280px. Worst: 0.008 (Claims, 320px). Before the fixes: up to 0.45. | Under 0.01 everywhere |
| Small screens and zoom | Every page at 375px and 1280px; most also at 320, 768, 1024 and 1440px. 320px wide is the same as 400% zoom on a laptop. | No sideways scrolling |
| Real tasks | Scripted in the browser: sign in and out, search for care and book a visit, estimate a cost, flip, print and order ID cards, read, reply to and write messages, clear notifications, edit contact info and address, switch preferences, send an appeal, enroll in a program, reset the demo, and the 404 page at a deep address. | All pass, no errors |
| Code cleanup | An audit for unused and duplicate code, then every check above run again. | No visible change |
| Speed (Lighthouse) | On the home page, earlier in the build: Accessibility 100 and Best Practices 100 on desktop and mobile; Performance 96 on desktop, 86 on mobile (main content in 3.3 seconds, mostly the shared libraries). | Mobile 86 |
| Review agents | Three reviewers (structure, design system, accessibility) checked Home and Coverage at checkpoints, then all 22 pages in a final pass. Every fix they proposed was applied, then every check above ran again. | Done, all fixes applied |

**Not tested yet:** screen readers (NVDA, VoiceOver) and their users; Safari, Firefox and real phones; text-only zoom to 200%; Windows high contrast; usability sessions with members; a Level Access scan.
