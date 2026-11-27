/* Tornado Health member portal: one script for every page.
   The shared shell (account menu counts, family switcher, AI Chat, dialogs, placeholder links,
   bottom nav) runs everywhere. Page sections run only on their own page (<body data-page="...">).
   Sections: helpers, state, shell, shared pieces, home page, coverage page, claims page, claim details + EOB, find care, programs, ID cards, Message Center, Help center, Account overview, AI Chat, dialogs, placeholder links,
   bottom nav + More sheet, start. No dependencies beyond Bootstrap.
   First of all it loads the shared header and footer (partials/) into the page, then starts the rest. */
(() => {
  "use strict";

  /* Form errors (every form): a field's error line is its id + "-error". Showing one marks the field invalid and
     links it to the message; clearing it unlinks it. A hint the field points to (data-hint) stays linked. */
  function setFieldError(input, msg) {
    const err = document.getElementById(`${input.id}-error`);
    err.textContent = msg || "";
    err.hidden = !msg;
    if (msg) input.setAttribute("aria-invalid", "true");
    else input.removeAttribute("aria-invalid");
    const ids = [msg ? err.id : null, input.dataset.hint].filter(Boolean).join(" ");
    if (ids) input.setAttribute("aria-describedby", ids);
    else input.removeAttribute("aria-describedby");
  }
  // [field, message or ""] pairs: show each, put focus on the first problem; true when every field is fine
  function checkFields(pairs) {
    pairs.forEach(([input, msg]) => setFieldError(input, msg));
    const bad = pairs.find(([, msg]) => msg);
    if (bad) bad[0].focus();
    return !bad;
  }

  /* Sign in (signin.html) ---------------------------------------------------------
     Signed out, so no portal shell: this runs instead of everything below. Any email and password work (demo). */
  function signInPage() {
    const q = (s) => document.querySelector(s);
    q('[data-field="year"]').textContent = String(new Date().getFullYear());
    if (new URLSearchParams(location.search).has("signed-out")) q("#signed-out").hidden = false;
    // Placeholder links say so instead of jumping to the top (the toast lives in the portal shell, so: a status line)
    document.addEventListener("click", (e) => {
      if (!e.target.closest('a[href="#"]')) return;
      e.preventDefault();
      const note = q("#signed-out");
      note.className = "notice notice-info mb-4";
      note.querySelector("i").className = "fa-solid fa-circle-info";
      note.querySelector("span").textContent = "That isn't part of the demo yet. Choose Sign in to explore the portal.";
      note.hidden = false;
    });
    // Show or hide the password; the button says which it will do
    const pw = q("#signin-password");
    const toggle = q(".password-toggle");
    toggle.addEventListener("click", () => {
      const show = pw.type === "password";
      pw.type = show ? "text" : "password";
      toggle.setAttribute("aria-pressed", String(show));
      toggle.querySelector("span").textContent = show ? "Hide" : "Show";
      toggle.querySelector("i").className = `fa-solid ${show ? "fa-eye-slash" : "fa-eye"}`;
    });
    q("#signin-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const email = q("#signin-email");
      if (!checkFields([
        [email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()) ? "" : "Enter the email you use for Tornado Health."],
        [pw, pw.value ? "" : "Enter your password."],
      ])) return;
      const btn = q(".signin-submit");
      btn.disabled = true;
      btn.textContent = "Signing in…";
      // Demo details: empty the fields first, so the browser doesn't offer to save a made-up password
      email.value = "";
      pw.value = "";
      pw.type = "text";
      location.href = "index.html";
    });
  }
  if (document.body.dataset.page === "signin") { signInPage(); return; }

  /* Shared header and footer ----------------------------------------------------
     One copy each, edited in one place: partials/header.html (logo, megamenus, account menu) and
     partials/footer.html (footer, bottom nav, More sheet, AI Chat, dialogs, placeholder message).
     Every page has an empty placeholder (<div data-include="partials/header.html">) that is filled here,
     before anything else runs.
     Where you are comes from the page's h1: each megamenu button and bottom-bar tab lists the headings of its
     pages in data-pages ("Coverage|ID Cards"). A heading that starts with one of them is a match. */
  const CURRENT = " (current section)";
  const make = (tag, attrs = {}, ...children) => {
    const el = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    el.append(...children);
    return el;
  };
  const note = () => make("span", { class: "visually-hidden" }, CURRENT);

  function markCurrent() {
    const heading = (document.querySelector("main h1")?.textContent || "").replace(/\s+/g, " ").trim();
    const belongs = (el) => el.dataset.pages.split("|").map((p) => p.trim()).some((p) => p && heading.startsWith(p));
    const file = location.pathname.split("/").pop() || "index.html";
    // Header: the section's megamenu button (a solid tint, plus "(current section)" for screen readers)
    let section = null;
    document.querySelectorAll(".primary-nav [data-pages]").forEach((toggle) => {
      if (section || !belongs(toggle)) return;
      toggle.classList.add("is-current");
      toggle.append(note());
      section = toggle;
    });
    // This page's own overview link inside its megamenu
    document.querySelectorAll(".mega-menu .menu-cta, .account-menu .menu-cta").forEach((link) => {
      if (link.getAttribute("href") === file) link.setAttribute("aria-current", "page");
    });
    // Bottom bar: the tab, or More for pages only More reaches
    document.querySelectorAll(".bottom-nav [data-pages]").forEach((tab) => {
      if (!belongs(tab)) return;
      if (tab.tagName === "A") tab.setAttribute("aria-current", "page");
      else { tab.classList.add("is-current"); tab.append(note()); }
    });
    buildMoreSheet(section);
  }

  // The More sheet (phones): one group per megamenu, its overview first, then its links, minus what the bottom
  // bar already has. Built from the megamenus, so the desktop and mobile menus can't drift apart.
  function buildMoreSheet(section) {
    const nav = document.querySelector("#more-sheet nav");
    const inBar = new Set([...document.querySelectorAll(".bottom-nav a")].map((a) => a.getAttribute("href")));
    const chevron = () => make("i", { class: "fa-solid fa-chevron-right", "aria-hidden": "true" });
    document.querySelectorAll(".primary-nav .nav-item.dropdown").forEach((menu, i) => {
      const label = menu.querySelector("[data-bs-toggle='dropdown']").firstChild.textContent.trim();
      const id = `more-${label.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
      const overview = { href: menu.querySelector(".menu-cta").getAttribute("href"), text: menu.querySelector(".mega-cta .fw-bold").textContent.trim() };
      const links = [...menu.querySelectorAll(".mega-link")].map((x) => (x.tagName === "A" ? { href: x.getAttribute("href"), text: x.textContent.trim() } : { button: x, text: x.textContent.trim() }));
      const rows = [overview, ...links].filter((item) => !(item.href && inBar.has(item.href))).map((item) => {
        if (item.href) return make("li", {}, make("a", { class: "more-link", href: item.href }, item.text, chevron()));
        const button = item.button.cloneNode(false); // keeps what it does (AI Chat opens the chat panel)
        button.className = "more-link";
        button.append(item.text, chevron());
        return make("li", {}, button);
      });
      const current = Boolean(section) && menu.contains(section);
      const title = make("h3", { class: "more-group-title", id }, label);
      if (current) title.append(note());
      nav.append(make("div", { class: `more-group${current ? " is-current" : ""}` },
        title, make("ul", { class: "list-unstyled mb-0", "aria-labelledby": id }, ...rows)));
    });
  }

  // Fill the placeholders, mark where you are, then start the page
  Promise.all([...document.querySelectorAll("[data-include]")].map((slot) => fetch(slot.dataset.include)
    .then((r) => { if (!r.ok) throw new Error(`${slot.dataset.include}: ${r.status}`); return r.text(); })
    .then((html) => {
      const t = document.createElement("template");
      t.innerHTML = html;
      slot.replaceWith(t.content);
    })))
    .then(() => { markCurrent(); start(); }, () => {
      // The shell couldn't load (offline, or opened as a file instead of from a server): say so
      const error = document.getElementById("load-error");
      if (error) error.hidden = false;
    });

  // Everything else: runs once the header and footer are in the page
  function start() {

    /* Helpers -------------------------------------------------------------- */
    const $ = (sel, root = document) => root.querySelector(sel);
    const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
    const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
    const money = (n) => usd.format(n);
    const toDate = (iso) => new Date(`${iso}T12:00:00`);
    const shortDate = (iso) => toDate(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const longDate = (iso) => toDate(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

    const store = {
      get(key) { try { return JSON.parse(localStorage.getItem(key)); } catch (e) { return null; } },
      set(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* storage blocked: keep working */ } },
    };

    const setField = (name, value) => $$(`[data-field="${name}"]`).forEach((el) => { el.textContent = value; });
    const announce = (msg) => { const el = $("#live-status"); el.textContent = ""; requestAnimationFrame(() => { el.textContent = msg; }); };

    // Build an element from a tag, attributes and children (strings become text nodes, never HTML)
    const h = (tag, attrs = {}, ...children) => {
      const el = document.createElement(tag);
      Object.entries(attrs).forEach(([k, v]) => {
        if (k === "class") el.className = v;
        else if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
        else el.setAttribute(k, v);
      });
      children.flat().forEach((c) => c != null && el.append(c));
      return el;
    };
    const icon = (name) => h("i", { class: `fa-solid ${name}`, "aria-hidden": "true" });
    const srOnly = (text) => h("span", { class: "visually-hidden" }, text);
    const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
    // Move focus to something that isn't a control (a heading or notice), e.g. after the button that was there is gone
    const focusEl = (el) => { if (!el) return; if (!el.hasAttribute("tabindex")) el.tabIndex = -1; el.focus(); };
    // Home and mailing address: changed on Account overview (remembered here), used by ID Cards for new cards
    const ADDRESS = "th-address";
    const APPEALS = "th-appeals"; // appeals sent in the demo, by claim id
    // A timeline row (claims, approvals): a dot (a check when done), the step, and its date or a note
    const STEP_TEXT = { done: "done", current: "current step", next: "next" };
    const timelineStep = (s) => h("li", { class: `timeline-step is-${s.state}` },
      h("span", { class: "timeline-dot", "aria-hidden": "true" }, s.state === "done" ? icon("fa-check") : null),
      h("div", {},
        h("p", { class: "fw-semibold mb-0" }, s.label, srOnly(`, ${STEP_TEXT[s.state]}`)),
        s.date || s.note ? h("p", { class: "small text-body-secondary mb-0" }, s.date ? longDate(s.date) : s.note) : null));
    const addressLines = (a) => [a.unit ? `${a.street}, ${a.unit}` : a.street, `${a.city}, ${a.state} ${a.zip}`];
    const badge = (tone, text) => h("span", { class: `badge badge-${tone}` }, h("span", {}, text)); // solid status color, white text; label wrapped so it can be trimmed (css)

    const renderList = (name, items) => {
      const list = $(`[data-list="${name}"]`);
      if (!list.hasAttribute("aria-busy")) list.dataset.settled = ""; // drawn before: no fade-in this time (css)
      list.replaceChildren(...items);
      list.removeAttribute("aria-busy");
      return list;
    };

    // Meters fill from zero the first time (skipped for reduced motion), then move from where they are.
    // Ease-out-quart, 700ms.
    const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fillMeter = (meter, value) => {
      const from = meter.dataset.filled ? meter.value : 0;
      meter.dataset.filled = "true";
      if (calm) { meter.value = value; return; }
      const start = performance.now();
      const step = (now) => {
        const t = Math.min((now - start) / 700, 1);
        meter.value = from + (value - from) * (1 - (1 - t) ** 4);
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    // Screen readers say "$640 of $1,500" for a meter instead of a percentage of an unknown total
    const meterText = (meter, value, limit) => meter.setAttribute("aria-valuetext", `${money(value)} of ${money(limit)}`);
    // A meter block: big number, "of" limit, native <progress>, and its text equivalent
    const setMeter = (key, prefix, spent, limit, help) => {
      const meter = $(`[data-meter="${key}"]`);
      meter.max = limit;
      meterText(meter, spent, limit);
      fillMeter(meter, spent);
      setField(`${prefix}Spent`, money(spent));
      setField(`${prefix}Limit`, money(limit));
      setField(`${prefix}Help`, help);
    };

    /* State (filled in once the data loads) -------------------------------- */
    const page = document.body.dataset.page;
    let family = [];
    let viewing = "roy";
    let chatAnswers = [];
    let chatFallback = "I can't answer right now.";

    /* Inbox: member.json lists what's unread. Reading something remembers its id (localStorage), so the counts
       drop everywhere: avatar counter, account menu, Message Center tabs. A count of 0 hides its badge. */
    const READ = "th-read";
    let inbox = { messages: [], notifications: [] };
    const isRead = (id) => (store.get(READ) || []).includes(id);
    function renderInboxCounts() {
      const m = inbox.messages.filter((id) => !isRead(id)).length;
      const n = inbox.notifications.filter((id) => !isRead(id)).length;
      setField("msgCount", String(m));
      setField("noteCount", String(n));
      setField("alertTotal", String(m + n));
      $$("[data-hide-zero]").forEach((el) => { el.hidden = (el.matches("[data-field]") ? el : $("[data-field]", el)).textContent === "0"; });
    }
    const markRead = (ids) => { store.set(READ, [...new Set([...(store.get(READ) || []), ...ids])]); renderInboxCounts(); };

    /* Shell: everything every page shows ------------------------------------ */
    setField("today", new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }));
    setField("year", String(new Date().getFullYear())); // footer: always the current year
    // Band chips scroll sideways on phones: bring a focused chip (and its ring) fully into view.
    // Browsers leave a chip alone if part of it already shows.
    $$(".band-chips").forEach((row) => row.addEventListener("focusin", (e) => e.target.scrollIntoView({ block: "nearest", inline: "nearest" })));

    const renderShell = (data, pageData) => {
      const { member } = data;
      setField("initials", member.initials);
      inbox = data.inbox;
      renderInboxCounts();
      setField("planName", member.planName);

      family = data.family;
      setField("viewingName", family[0].firstName);
      if ($('[data-list="family"]')) renderFamily(); // pages about one claim have no switcher

      // AI Chat: pages with their own questions show them; answers can come from either list
      const own = PAGE_DATA[page]?.ownPrompts && pageData?.assistant;
      chatAnswers = [...(pageData?.assistant || []), ...data.assistant];
      chatFallback = data.assistantFallback || chatFallback;
      renderPrompts(own || data.assistant);
    };

    // Family member switcher: the page decides what changes (its onViewing hook)
    const person = () => family.find((p) => p.id === viewing);
    function renderFamily() {
      renderList("family", family.map((p) => {
        const current = p.id === viewing;
        return h("li", {}, h("button", { class: "dropdown-item", type: "button", ...(current && { "aria-current": "true" }), onclick: () => selectMember(p) },
          h("span", { class: "avatar", "aria-hidden": "true" }, p.initials),
          h("span", { class: "d-flex flex-column" }, h("span", { class: "fw-semibold" }, `${p.firstName} ${p.lastName}`), h("small", { class: "text-body-secondary" }, p.relation)),
          current ? icon("fa-check ms-auto") : null));
      }));
    }
    function selectMember(p) {
      viewing = p.id;
      setField("viewingName", p.firstName);
      renderFamily();
      announce(`Now viewing ${p.firstName}. ${pages[page].onViewing()}`);
      $(".member-switch").focus();
    }

    /* Shared pieces (home and claims) ------------------------------------------ */
    // The action block: a compact strip with the single task to do and the page's only primary button
    const actionBlock = (a) => [
      h("div", { class: "flex-grow-1" },
        h("p", { class: "mb-1" }, h("span", { class: "badge action-badge" }, icon("fa-circle-exclamation"), h("span", {}, "Action needed"))),
        h("h3", { class: "mb-1", id: "action-title" }, a.title),
        h("p", { class: "small text-body-secondary mb-0 measure" }, a.detail)),
      h("a", { class: "btn btn-primary d-inline-flex align-items-center justify-content-center gap-2 px-4 flex-shrink-0", href: a.action.href },
        a.action.label, srOnly(`: ${a.title}`), icon("fa-arrow-right"))];
    const allClear = () => [
      h("div", { class: "flex-grow-1" },
        h("p", { class: "mb-1" }, badge("success", "All clear")),
        h("h3", { class: "mb-0", id: "action-title" }, "Nothing needs your action right now"))];

    // Claim row: service and provider, date, what you owe, status (aligned columns from 768px).
    // The detailed row (Claims page) links the service to its details and adds billed, plan paid and the EOB link.
    const owed = (c) => (c.youOwe == null ? "Pending" : `You owe ${money(c.youOwe)}`);
    const claimRow = (c, detailed = false) => {
      const when = shortDate(c.date);
      const hasEob = c.status === "Processed" || c.status === "Not covered"; // decided claims have an EOB
      return h("li", { class: `${detailed ? "claim-card" : "list-group-item"} claim-row` },
        h("div", {},
          detailed
            ? h("a", { class: "claim-link", href: `claim-detail.html?id=${c.id}` }, c.service, srOnly(`, ${when}, details`))
            : h("p", { class: "fw-semibold mb-0" }, c.service),
          h("p", { class: "small text-body-secondary mb-0" }, c.provider, h("span", { class: "d-md-none" }, ` · ${when}`)),
          detailed ? h("p", { class: "small text-body-secondary mb-0" },
            `Billed ${money(c.billed)} · Plan paid ${hasEob ? money(c.planPaid) : "pending"}`,
            hasEob ? [" · ", h("a", { href: `eob.html?id=${c.id}` }, "EOB", srOnly(` for ${c.service}, ${when}`))] : null) : null),
        h("span", { class: "small text-body-secondary d-none d-md-block" }, when),
        h("span", { class: "claim-amount text-end" }, owed(c)),
        h("span", { class: "text-end" }, badge(c.tone, c.status)));
    };

    /* Home page ------------------------------------------------------------- */
    const home = (() => {
      let claims = [];
      let recs = [];

      // Updates: in progress, nothing to do yet. Quieter than the action strip.
      const updateRow = (a) => h("li", { class: "list-group-item update-row" },
        h("span", { class: `icon-chip bg-${a.tone}-subtle text-${a.tone}-emphasis`, "aria-hidden": "true" }, icon(a.icon)),
        h("div", {},
          h("a", { class: "link-icon", href: a.action.href }, a.title),
          h("p", { class: "small text-body-secondary mb-0" }, a.short)));

      function renderClaims() {
        const p = person();
        $("#claims-title").textContent = p.relation === "You" ? "Recent claims" : `${p.firstName}'s recent claims`;
        const rows = claims.filter((c) => c.patient === viewing).slice(0, 3).map((c) => claimRow(c));
        renderList("claims", rows.length ? rows : [h("li", { class: "list-group-item small text-body-secondary" }, `No recent claims for ${p.firstName}.`)]);
      }

      /* Recommendations: max 2 shown, dismiss is remembered */
      const DISMISSED = "th-dismissed-recs";
      function renderRecommendations() {
        const dismissed = store.get(DISMISSED) || [];
        const visible = recs.filter((r) => !dismissed.includes(r.id)).slice(0, 2);
        renderList("recommendations", visible.map(recRow));
        $("#rec-card").hidden = !visible.length; // nothing left to suggest: the whole card goes away
      }
      // "For you": one line each, a short reason, and a dismiss button
      const recRow = (r) => h("li", { class: "list-group-item d-flex align-items-start gap-2", id: `rec-${r.id}` },
        h("div", { class: "flex-grow-1" },
          h("a", { class: "link-icon", href: r.action.href }, r.title, icon("fa-arrow-right")),
          h("p", { class: "small text-body-secondary mb-0" }, r.why)),
        h("button", { class: "btn btn-link link-icon tap-target text-body-secondary p-0", type: "button", "aria-label": `Dismiss ${r.title}`, onclick: () => dismissRec(r) }, icon("fa-xmark")));
      function dismissRec(r) {
        const dismissed = store.get(DISMISSED) || [];
        store.set(DISMISSED, [...new Set([...dismissed, r.id])]);
        renderRecommendations();
        announce(`${r.title} dismissed.`);
        // Keep keyboard focus in a sensible place: the next dismiss button, or (card gone) the ID card heading above it
        const nextBtn = $('[data-list="recommendations"] button');
        if (nextBtn) {
          nextBtn.focus();
        } else {
          const heading = $("#id-title");
          heading.tabIndex = -1;
          heading.focus();
        }
      }

      // Listeners for the page's own controls (run as soon as the script loads)
      function init() {
        // ID card actions (mock)
        const idMessages = {
          download: "Your ID card is ready. In this demo, nothing is downloaded.",
          wallet: "Added to your phone's wallet. In this demo, nothing is saved.",
        };
        $$("[data-id-action]").forEach((btn) => btn.addEventListener("click", () => {
          $("#id-status").textContent = idMessages[btn.dataset.idAction];
        }));
      }

      function render(data, pageData) {
        const { member, plan } = data;
        const hour = new Date().getHours();
        const partOfDay = hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";
        $("#greeting").replaceChildren(`Good ${partOfDay}, `, h("span", { "data-field": "firstName" }, member.firstName));
        setField("fullName", `${member.firstName} ${member.lastName}`);
        setField("memberId", member.memberId);
        setField("rxBin", member.rx.bin);
        setField("rxPcn", member.rx.pcn);

        // Your plan: deductible and out-of-pocket
        const ded = plan.deductible;
        const oop = plan.outOfPocket;
        setMeter("deductible", "ded", ded.spent, ded.limit, `${money(ded.limit - ded.spent)} left before your plan pays more.`);
        setMeter("outOfPocket", "oop", oop.spent, oop.limit, `${money(oop.limit - oop.spent)} left. After that, covered care is $0.`);

        // Priority: action needed first; everything else is an update
        const actions = data.attention.filter((a) => a.actionNeeded);
        const updates = data.attention.filter((a) => !a.actionNeeded);
        setField("todoCount", actions.length ? `${actions.length} ${actions.length === 1 ? "thing" : "things"} to do` : "Nothing to do");
        setField("dedLeft", `${money(ded.limit - ded.spent)} left on your deductible`);
        renderList("action", actions.length ? actionBlock(actions[0]) : allClear());
        renderList("updates", updates.length ? updates.map(updateRow) : [h("li", { class: "list-group-item small text-body-secondary" }, "No new updates.")]);

        claims = pageData.claims;
        recs = data.recommendations;
        renderClaims();
        renderRecommendations();
      }

      function onViewing() {
        renderClaims();
        return "Recent claims updated.";
      }

      return { init, render, onViewing };
    })();

    /* Coverage page ---------------------------------------------------------- */
    const coverage = (() => {
      let cov = null;
      const possessive = (p, start = false) => (p.relation === "You" ? (start ? "Your" : "your") : `${p.firstName}'s`);

      // One person's progress toward a limit: name and amount, a thin bar, then what's left or a done badge
      const progressRow = (p, list, label, spent, limit, leftText, done) => {
        const statusId = `${list}-${p.id}-status`;
        const shown = Math.min(spent, limit);
        const bar = h("progress", { class: "meter meter-thin my-2", max: String(limit), value: "0", "aria-label": `${p.firstName} ${p.lastName}, ${label}`, "aria-describedby": statusId });
        meterText(bar, shown, limit);
        fillMeter(bar, shown);
        return h("li", { class: "list-group-item" },
          h("div", { class: "d-flex align-items-baseline justify-content-between gap-2" },
            h("span", { class: "fw-semibold" }, `${p.firstName} ${p.lastName}`),
            h("span", { class: "small text-body-secondary" }, `${money(shown)} of ${money(limit)}`)),
          bar,
          spent >= limit
            ? h("p", { class: "mb-0", id: statusId }, badge(done.tone, done.text))
            : h("p", { class: "small text-body-secondary mb-0", id: statusId }, leftText(limit - spent)));
      };

      // Deductible or out-of-pocket: the family total, then everyone on the plan
      function renderLimit(key, prefix, label) {
        const spentBy = cov.costs.spent;
        const famLimit = cov.costs.family[key];
        const famSpent = Math.min(Object.values(spentBy).reduce((total, s) => total + s[key], 0), famLimit);
        setMeter(`${prefix}-family`, `${prefix}Fam`, famSpent, famLimit,
          famSpent >= famLimit ? `The family ${label} is met.` : `${money(famLimit - famSpent)} to go for the family.`);
        setField(`${prefix}Limit`, money(cov.costs.individual[key]));
        renderList(`${prefix}-people`, family.map((p) =>
          progressRow(p, `${prefix}-people`, label, spentBy[p.id][key], cov.costs.individual[key], (left) => `${money(left)} to go`, { tone: "success", text: "Met" })));
      }

      // Band chip: how far the person being viewed is from their deductible
      function renderChip() {
        const p = person();
        const left = cov.costs.individual.deductible - cov.costs.spent[viewing].deductible;
        setField("dedLeft", left > 0 ? `${money(left)} to go on ${possessive(p)} deductible` : `${possessive(p, true)} deductible is met`);
      }

      // Referral or prior auth: what, details, status badge
      const authRow = (a) => h("li", { class: "list-group-item auth-row" },
        h("div", {},
          h("p", { class: "fw-semibold mb-0" }, h("a", { class: "claim-link", href: `auth.html?id=${a.id}` }, a.title)),
          h("p", { class: "small text-body-secondary mb-0" }, a.detail)),
        badge(a.tone, a.status));
      function renderAuths() {
        const rows = cov.auths.filter((a) => a.patient === viewing).map(authRow);
        renderList("auths", rows.length ? rows : [h("li", { class: "list-group-item small text-body-secondary" }, `No referrals or prior auths for ${person().firstName}.`)]);
      }

      // Benefit limits in the Medical table: how many the person being viewed has used
      function renderLimitsUsed() {
        const p = person();
        $$("[data-limit]").forEach((el) => {
          const used = cov.limitsUsed[el.dataset.limit]?.[viewing] || 0;
          el.textContent = used ? `${p.firstName} has used ${used} of ${el.dataset.limitMax}` : "";
        });
      }

      // Vision: when the person being viewed can use each benefit again
      function renderVisionNext() {
        const next = cov.vision.nextAvailable[viewing];
        const names = { exam: "Eye exam", frames: "Frames", lenses: "Lenses", contacts: "Contacts" };
        renderList("vision-next", Object.entries(names).map(([key, name]) => h("div", { class: "benefit-row" },
          h("dt", {}, name),
          h("dd", {}, next[key] ? `From ${longDate(next[key])}` : "Available now"))));
      }

      // Tabs: open the one named in the address (menu links like coverage.html#dental), or the tab that holds
      // a linked card (#fsa-title); keep the address in step as people switch tabs.
      // After a link on this page (not on first load), keyboard focus follows: to the tab for a tab link, or to
      // the card's heading. Otherwise the browser drops focus to the page, because the target was hidden.
      // Not while a panel (More sheet) is open: its focus trap keeps focus, and closing it returns focus.
      function openFromHash(follow) {
        const id = location.hash.slice(1);
        const target = id ? document.getElementById(id) : null;
        const pane = target?.closest(".tab-pane");
        if (!pane) return;
        const tab = $(`#tab-${pane.id}`);
        bootstrap.Tab.getOrCreateInstance(tab).show();
        (target === pane ? $(".page-tabs") : target).scrollIntoView({ block: "start" });
        if (follow !== true || $(".offcanvas.show")) return;
        const focusTarget = target === pane ? tab : target;
        if (focusTarget.tabIndex < 0 && !focusTarget.hasAttribute("tabindex")) focusTarget.tabIndex = -1;
        focusTarget.focus({ preventScroll: true });
      }

      function init() {
        openFromHash();
        addEventListener("hashchange", () => openFromHash(true));
        // A link to the address already shown fires no hashchange, but the browser still drops focus
        document.addEventListener("click", (e) => {
          const link = e.target.closest("a[href*='#']");
          if (link && link.hash.length > 1 && link.pathname === location.pathname && link.hash === location.hash) {
            requestAnimationFrame(() => openFromHash(true));
          }
        });
        $$('.page-tabs [data-bs-toggle="tab"]').forEach((tab) => tab.addEventListener("shown.bs.tab", () => {
          history.replaceState(null, "", `#${tab.getAttribute("aria-controls")}`);
        }));
      }

      function render(data, pageData) {
        cov = pageData;
        const { planYear } = data.member;
        setField("planDates", `${shortDate(planYear.start)} to ${longDate(planYear.end)}`);

        renderLimit("deductible", "ded", "deductible");
        renderLimit("outOfPocket", "oop", "out-of-pocket max");

        const { elected, available, useBy } = cov.fsa;
        // Not setMeter: this card shows what's available (not spent), so its fields are named for that
        const fsaMeter = $('[data-meter="fsa"]');
        fsaMeter.max = elected;
        meterText(fsaMeter, available, elected);
        fillMeter(fsaMeter, available);
        setField("fsaAvailable", money(available));
        setField("fsaElected", money(elected));
        setField("fsaHelp", `Use it by ${longDate(useBy)}. Money you don't use doesn't carry over.`);
        setField("fsaLeft", `${money(available)} left in your FSA`);

        const { yearlyMax, used } = cov.dental;
        setField("dentalMax", money(yearlyMax));
        renderList("dental-people", family.map((p) =>
          progressRow(p, "dental-people", "dental yearly maximum used", used[p.id], yearlyMax, (left) => `${money(left)} left this year`, { tone: "warning", text: "Used up" })));

        renderChip();
        renderAuths();
        renderLimitsUsed();
        renderVisionNext();
      }

      function onViewing() {
        renderChip();
        renderAuths();
        renderLimitsUsed();
        renderVisionNext();
        return "Deductible, referrals, limits and vision updated.";
      }

      return { init, render, onViewing };
    })();

    /* Claims page ------------------------------------------------------------ */
    const claimsPage = (() => {
      let all = [];
      let type = "all";

      const mine = () => all.filter((c) => c.patient === viewing);
      const sum = (list, key) => list.reduce((total, c) => total + (c[key] ?? 0), 0);

      // Needs your attention: the first claim with something to do; the card goes away when there's nothing
      function renderAttention() {
        const todo = mine().filter((c) => c.action);
        $("#attention-card").hidden = !todo.length;
        if (todo.length) renderList("action", actionBlock({ ...todo[0].action, action: todo[0].action }));
        setField("claimsActionCount", `${plural(todo.length, "claim needs", "claims need")} info`);
        $('[data-field="claimsActionCount"]').closest("li").hidden = !todo.length; // no chip pointing at a hidden card
      }

      // This year: what the person being viewed owes, plus billed and plan paid, across every claim type
      function renderTotals() {
        const list = mine();
        const inProcess = list.filter((c) => c.youOwe == null).length;
        setField("totOwe", money(sum(list, "youOwe")));
        setField("totBilled", money(sum(list, "billed")));
        setField("totPlanPaid", money(sum(list, "planPaid")));
        setField("totInProcess", inProcess ? `${plural(inProcess, "claim", "claims")} in process` : "");
        setField("claimsOweChip", `${person().relation === "You" ? "You owe" : `${person().firstName} owes`} ${money(sum(list, "youOwe"))}`);
      }

      // The list: claim type (radio bar), status and sort
      function renderClaimList(announceCount = false) {
        const status = $("#claim-status").value;
        const sort = $("#claim-sort").value;
        const rows = mine()
          .filter((c) => (type === "all" || c.type === type) && (status === "all" || c.status === status))
          .sort((a, b) => (sort === "owe" ? (b.youOwe ?? -1) - (a.youOwe ?? -1) : 0) || (sort === "oldest" ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date)));
        const count = `Showing ${plural(rows.length, "claim", "claims")}`;
        setField("claimCount", count);
        renderList("claims", rows.length ? rows.map((c) => claimRow(c, true))
          : [h("li", { class: "claim-card small text-body-secondary" }, `No claims for ${person().firstName} match these filters.`)]);
        if (announceCount) announce(`${count}.`);
      }

      function init() {
        const params = new URLSearchParams(location.search);
        const presetStatus = params.get("status");
        if (presetStatus && $(`#claim-status option[value="${presetStatus}"]`)) $("#claim-status").value = presetStatus;
        const presetType = $(`input[name="claim-type"][value="${params.get("type")}"]`);
        if (presetType) { presetType.checked = true; type = presetType.value; }
        $$('input[name="claim-type"]').forEach((radio) => radio.addEventListener("change", () => {
          type = radio.value;
          renderClaimList(true);
        }));
        $("#claim-status").addEventListener("change", () => renderClaimList(true));
        $("#claim-sort").addEventListener("change", () => renderClaimList(true));
      }

      function render(data, pageData) {
        all = pageData.claims;
        renderAttention();
        renderTotals();
        renderClaimList();
      }

      function onViewing() {
        renderAttention();
        renderTotals();
        renderClaimList();
        return `Claims updated. ${$('[data-field="claimCount"]').textContent}.`;
      }

      return { init, render, onViewing };
    })();

    /* Claim details and EOB: one claim, picked by ?id= in the address ---------- */
    const decided = (c) => c.status === "Processed" || c.status === "Not covered";
    // ?id= picks the claim; without one, the claim that needs something, else the newest
    const claimFromUrl = (claims) => claims.find((c) => c.id === new URLSearchParams(location.search).get("id")) || claims.find((c) => c.action) || claims[0];
    const patientName = (c) => { const p = family.find((f) => f.id === c.patient); return `${p.firstName} ${p.lastName}`; };
    const fact = (term, value) => h("div", { class: "benefit-row" }, h("dt", {}, term), h("dd", {}, value));
    const credit = (n) => `−${money(n)}`; // minus sign, for discounts

    // Band: breadcrumb, title, one line of facts, and the browser tab title
    function claimBand(c, isEob) {
      setField("pageTitle", isEob ? "Explanation of Benefits" : c.service);
      setField("crumbCurrent", isEob ? "EOB" : c.service);
      setField("crumbClaim", c.service);
      $$("[data-claim-link]").forEach((a) => { a.href = `claim-detail.html?id=${c.id}`; });
      setField("claimFacts", `${patientName(c)} · ${c.provider} · ${longDate(c.date)} · Claim ${c.number}`);
      document.title = `${isEob ? "EOB" : "Claim"}: ${c.service}, ${shortDate(c.date)} | Tornado Health`;
    }

    const claimDetail = (() => {
      // Where it stands: done steps, the current step, what's next
      function steps(c) {
        const list = [{ label: "Received", date: c.received, state: "done" }];
        if (c.status === "In process") {
          list.push({ label: "In review", note: "Most claims are decided within 30 days.", state: "current" }, { label: "Decision", state: "next" });
        } else if (c.status === "Needs info") {
          list.push({ label: "Reviewed", date: c.infoRequested, state: "done" }, { label: "Waiting for your form", note: "We need the accident form to finish.", state: "current" }, { label: "Paid", state: "next" });
        } else {
          list.push({ label: "Reviewed", state: "done" }, { label: c.status === "Processed" ? "Paid" : "Not covered", date: c.processed, state: "done" });
        }
        return list;
      }
      const stepRow = timelineStep;

      // Cost breakdown: billed, network discount, allowed, plan paid, then the member's share
      function costRows(c) {
        if (!decided(c)) {
          return [fact("Billed", money(c.billed)), fact("Allowed amount", "Pending"), fact("Plan paid", "Pending"), ...(c.share || []).map((s) => fact(s.label, money(s.amount)))];
        }
        return [
          fact("Billed", money(c.billed)),
          ...(c.status === "Processed" ? [fact("Network discount", credit(c.billed - c.allowed))] : []),
          fact("Allowed amount", money(c.allowed)),
          fact("Plan paid", money(c.planPaid)),
          ...c.share.map((s) => fact(s.label, money(s.amount))),
        ];
      }
      const lineRow = (l) => h("tr", {}, h("th", { scope: "row" }, l.service), h("td", {}, money(l.billed)),
        h("td", {}, l.planPaid == null ? "Pending" : money(l.planPaid)), h("td", {}, l.youOwe == null ? "Pending" : money(l.youOwe)));
      const arrowLink = (text, href) => h("a", { class: "link-icon", href }, text, icon("fa-arrow-right"));

      // What happens next, by status
      function next(c) {
        if (c.status === "Processed") {
          return [c.youOwe ? `Your provider will bill you ${money(c.youOwe)}. Compare their bill with your EOB before you pay.` : "You don't owe anything for this claim.",
            [arrowLink("View your EOB", `eob.html?id=${c.id}`)]];
        }
        if (c.status === "Not covered") {
          const appeal = (store.get(APPEALS) || {})[c.id];
          if (appeal) return [`Your appeal is in review. We'll decide by ${longDate(appeal.decisionBy)}, and you don't need to pay this bill until then.`, [arrowLink("See your appeal", `appeal.html?claim=${c.id}`), arrowLink("View your EOB", `eob.html?id=${c.id}`)]];
          return [`${c.reason} You have 180 days to appeal.`, [arrowLink("View your EOB", `eob.html?id=${c.id}`), arrowLink("Start an appeal", `appeal.html?claim=${c.id}`)]];
        }
        if (c.status === "Needs info") return [c.note, []];
        return ["We're reviewing this claim. We'll send you a message when it's decided, usually within 30 days.", []];
      }

      function render(data, pageData) {
        const c = claimFromUrl(pageData.claims);
        claimBand(c, false);
        if (c.action) {
          $("#attention-card").hidden = false;
          renderList("action", actionBlock({ ...c.action, action: c.action }));
        }
        renderList("status-badge", [badge(c.tone, c.status)]);
        renderList("timeline", steps(c).map(stepRow));
        renderList("cost", costRows(c));
        setField("oweLabel", decided(c) ? "You owe" : "You may owe");
        setField("oweAmount", c.youOwe == null ? "Pending" : money(c.youOwe));
        renderList("lines", c.lines.map(lineRow));
        const [text, links] = next(c);
        setField("nextText", text);
        renderList("next-links", links);
        renderList("info", [
          fact("Claim number", c.number), fact("Patient", patientName(c)), fact("Provider", c.provider), fact("Network", c.network),
          fact("Date of service", longDate(c.date)), fact("Received", longDate(c.received)), ...(c.processed ? [fact("Decided", longDate(c.processed))] : []),
        ]);
      }

      return { init() {}, render, onViewing: () => "" };
    })();

    const eob = (() => {
      function init() {
        $$("[data-eob-action]").forEach((btn) => btn.addEventListener("click", () => {
          if (btn.dataset.eobAction === "print") print();
          else $("#eob-status").textContent = "Your EOB is ready. In this demo, nothing is downloaded.";
        }));
      }

      function render(data, pageData) {
        const c = claimFromUrl(pageData.claims);
        claimBand(c, true);
        setField("eobService", `${c.service}, ${shortDate(c.date)}`);
        const body = $("#eob-body");
        body.removeAttribute("aria-busy");
        if (!decided(c)) { // no statement until the claim is decided
          body.hidden = true;
          $("#eob-empty").hidden = false;
          $(".eob-actions").remove();
          return;
        }
        const { member } = data;
        renderList("eob-facts", [
          ["Member", `${member.firstName} ${member.lastName}`], ["Member ID", member.memberId], ["Patient", patientName(c)], ["Claim number", c.number],
          ["Provider", c.provider], ["Network", c.network], ["Date of service", longDate(c.date)], ["Date processed", longDate(c.processed)],
        ].map(([term, value]) => h("div", { class: "col" }, h("dt", {}, term), h("dd", { class: "mb-0" }, value))));

        const covered = c.status === "Processed";
        const cells = (l) => [money(l.billed), covered ? credit(l.billed - l.allowed) : "Not covered", money(l.allowed), money(l.planPaid), money(l.youOwe)];
        renderList("eob-lines", c.lines.map((l) => h("tr", {}, h("th", { scope: "row" }, l.service), cells(l).map((v) => h("td", {}, v)))));
        const total = ["billed", "allowed", "planPaid", "youOwe"].reduce((t, k) => ({ ...t, [k]: c.lines.reduce((s, l) => s + l[k], 0) }), {});
        renderList("eob-total", [h("tr", {}, h("th", { scope: "row" }, "Total"), cells(total).map((v) => h("td", {}, v)))]);
        renderList("eob-share", c.share.length ? c.share.map((s) => fact(s.label, money(s.amount))) : [fact("Copay or coinsurance", money(0))]);
        setField("eobNote", c.reason || (c.youOwe
          ? "Your share counts toward your out-of-pocket max. Copays don't count toward your deductible."
          : "Covered in full. You don't owe anything for this claim."));
      }

      return { init, render, onViewing: () => "" };
    })();

    /* Find Care page ----------------------------------------------------------- */
    const findCare = (() => {
      let care = null;
      let lastQuery = "";
      const providerById = (id) => care.providers.find((pr) => pr.id === id);

      // One search result: who, specialty and practice, distance and next opening; cost and new-patient status
      const providerRow = (pr) => h("li", { class: "list-group-item provider-row" },
        h("div", {},
          h("a", { class: "claim-link", href: `provider.html?id=${pr.id}` }, pr.name),
          h("p", { class: "small text-body-secondary mb-0" }, `${pr.specialty} · ${pr.practice}`),
          h("p", { class: "small text-body-secondary mb-0" }, `${pr.distance} mi`, pr.next ? ` · Next opening ${shortDate(pr.next)}` : "")),
        h("div", { class: "text-end" },
          h("p", { class: "care-cost mb-1" }, pr.cost),
          pr.accepting ? badge("success", "New patients") : h("p", { class: "small text-body-secondary mb-0" }, "Not taking new patients")));

      // Match the words people use: name, specialty, practice or any keyword
      const matches = (pr, query) => [pr.name, pr.specialty, pr.practice, ...pr.keywords]
        .some((term) => term.toLowerCase().includes(query) || (term.length > 3 && query.includes(term.toLowerCase())));

      function search(q, { moveFocus = false } = {}) {
        lastQuery = q;
        const query = q.trim().toLowerCase();
        const zip = $("#care-zip").value.trim();
        const onlyNew = $("#care-accepting").checked;
        const found = care.providers.filter((pr) => matches(pr, query) && (!onlyNew || pr.accepting)).sort((a, b) => a.distance - b.distance);
        $("#care-results").hidden = false;
        const count = found.length
          ? `${plural(found.length, "result", "results")} for "${q}" near ${zip}`
          : `No in-network results for "${q}" near ${zip}${onlyNew ? " taking new patients" : ""}. Try a broader search, like "primary care".`;
        setField("careCount", count);
        renderList("providers", found.map(providerRow));
        announce(count);
        if (moveFocus) $("#care-results-title").focus(); // results are somewhere else on the page: take people there
      }

      // Your doctors: the person being viewed
      function renderDoctors() {
        const p = person();
        setField("doctorsTitle", p.relation === "You" ? "Your doctors" : `${p.firstName}'s doctors`);
        const mine = care.yourDoctors[viewing] || [];
        renderList("doctors", mine.length ? mine.map(({ provider, lastVisit }) => {
          const pr = providerById(provider);
          return h("li", { class: "list-group-item" },
            h("p", { class: "fw-semibold mb-0" }, h("a", { class: "claim-link", href: `provider.html?id=${pr.id}` }, pr.name)),
            h("p", { class: "small text-body-secondary mb-0" }, `${pr.specialty} · Last visit ${longDate(lastVisit)}`),
            h("a", { class: "book-link small", href: `provider.html?id=${pr.id}#book-title` }, "Book a visit", srOnly(` with ${pr.name}`)));
        }) : [h("li", { class: "list-group-item small text-body-secondary" }, `No doctors on file for ${p.firstName} yet.`)]);
      }

      function init() {
        const input = $("#care-q");
        const zip = $("#care-zip");
        $("#care-search").addEventListener("submit", (e) => {
          e.preventDefault();
          if (!checkFields([
            [input, input.value.trim() ? "" : "Enter a name, specialty or condition."],
            [zip, /^\d{5}$/.test(zip.value.trim()) ? "" : "Enter a 5-digit ZIP code."],
          ])) return;
          search(input.value.trim());
        });
        $$("[data-care-search]").forEach((el) => el.addEventListener("click", (e) => {
          e.preventDefault();
          input.value = el.dataset.careSearch;
          setFieldError(input, "");
          search(el.dataset.careSearch, { moveFocus: true });
        }));
        $("#care-accepting").addEventListener("change", () => { if (lastQuery) search(lastQuery); });
      }

      function render(data, pageData) {
        care = pageData;
        renderDoctors();
        // Arriving with a search (the home page's Find a doctor box): run it
        const q = new URLSearchParams(location.search).get("q");
        if (q) {
          $("#care-q").value = q;
          search(q);
        }
      }

      function onViewing() {
        renderDoctors();
        return "Doctors updated.";
      }

      return { init, render, onViewing };
    })();

    /* Programs & Services page --------------------------------------------------- */
    const programsPage = (() => {
      let prog = null;
      const ENROLLED = "th-enrolled-programs"; // demo enrollments, remembered per person
      const byId = (id) => prog.programs.find((x) => x.id === id);
      // Program icon in a brand-tinted tile (never bigger than the logo)
      const art = (name) => h("span", { class: "program-art", "aria-hidden": "true" }, icon(name));
      const enrolledIds = () => [...(prog.enrolled[viewing] || []), ...((store.get(ENROLLED) || {})[viewing] || [])];
      const isEnrolled = (id) => enrolledIds().includes(id);
      // The button that was pressed is gone after enrolling: move focus to what replaced it
      // Programs that fit the person being viewed: kids' programs for children, the rest for adults
      const fits = (x) => x.for === "all" || x.for === (person().isChild ? "child" : "adult");

      function enroll(program) {
        const saved = store.get(ENROLLED) || {};
        saved[viewing] = [...new Set([...(saved[viewing] || []), program.id])];
        store.set(ENROLLED, saved);
        renderRecommended();
        renderPrograms();
        announce(`${person().firstName} is enrolled in ${program.title}.`);
      }

      // Recommended for the person being viewed: art, why, what you get, Enroll (the page's one primary button)
      function renderRecommended() {
        const p = person();
        const rec = prog.recommended[viewing];
        const program = byId(rec.program);
        $("[data-rec-icon]").replaceChildren(icon(program.icon));
        setField("recEyebrow", p.relation === "You" ? "Recommended for you" : `Recommended for ${p.firstName}`);
        setField("recTitle", program.title);
        setField("recWhy", rec.why);
        setField("recChip", `Recommended: ${program.title.replace(/ program$/, "")}`);
        renderList("rec-includes", rec.includes.map((item) => h("li", {}, icon("fa-check"), h("span", {}, item))));
        renderList("rec-actions", isEnrolled(program.id)
          ? [h("p", { class: "notice notice-success mb-0" }, icon("fa-circle-check"), h("span", {}, `${p.relation === "You" ? "You're" : `${p.firstName} is`} enrolled. A coach will reach out within 2 business days.`))]
          : [
            h("button", { class: "btn btn-primary px-4", type: "button", onclick: () => { enroll(program); focusEl($('[data-list="rec-actions"] .notice')); } },
              "Enroll", srOnly(` in ${program.title}`)),
            h("a", { class: "link-icon", href: "#" }, "Learn more", srOnly(` about ${program.title}`), icon("fa-arrow-right")),
          ]);
      }

      // Program card: the icon and title on one row; one line, details, then Join (secondary) or an Enrolled badge
      // at full width, with the action pinned to the bottom so cards in a row line up
      const programCard = (x) => h("li", { class: "col" },
        h("div", { class: "card h-100" },
          h("div", { class: "card-body p-4 d-flex flex-column" },
            h("div", { class: "icon-heading mb-2" }, art(x.icon), h("h3", { class: "program-title mb-0" }, x.title)),
            h("p", { class: "small text-body-secondary mb-2" }, x.line),
            h("p", { class: "small text-body-secondary mb-3" }, x.meta),
            h("div", { class: "mt-auto" }, isEnrolled(x.id)
              ? badge("success", "Enrolled")
              : h("button", { class: "btn btn-outline-primary btn-sm program-join d-inline-flex align-items-center justify-content-center gap-2", type: "button", onclick: () => { enroll(x); focusEl($("#wellbeing-title")); } },
                icon("fa-plus"), "Join", srOnly(` ${x.title}`))))));

      function renderPrograms() {
        const p = person();
        setField("programsFor", `Programs that fit ${p.firstName}. All are free with your plan.`);
        const featured = prog.recommended[viewing].program; // already shown above, with its own Enroll
        const list = prog.programs.filter((x) => fits(x) && x.id !== featured);
        // Enrolled programs first, so people see what they're already in
        list.sort((a, b) => isEnrolled(b.id) - isEnrolled(a.id));
        renderList("programs", list.map(programCard));
      }

      function renderRewards() {
        const { points, goal, goalLabel, earn } = prog.rewards;
        const count = new Intl.NumberFormat("en-US");
        setField("pointsChip", `${count.format(points)} reward points`);
        setField("pointsSpent", count.format(points));
        setField("pointsLimit", count.format(goal));
        setField("pointsHelp", `${count.format(goal - points)} more for ${goalLabel}.`);
        const meter = $('[data-meter="points"]');
        meter.max = goal;
        fillMeter(meter, points);
        meter.setAttribute("aria-valuetext", `${count.format(points)} of ${count.format(goal)} points`);
        renderList("earn", earn.map((e) => h("li", { class: `list-group-item earn-row${e.done ? " is-done" : ""}` },
          h("span", { class: "d-inline-flex align-items-center gap-2" }, e.done ? icon("fa-circle-check") : icon("fa-circle"), e.label, srOnly(e.done ? ", earned" : ", not yet")),
          h("span", { class: "earn-points" }, `+${e.points}`))));
        renderList("perks", prog.perks.map((x) => h("li", { class: "col perk" },
          h("span", { class: "icon-chip", "aria-hidden": "true" }, icon(x.icon)),
          h("div", {}, h("p", { class: "perk-label mb-0" }, x.label), h("p", { class: "perk-value mb-0" }, x.value)))));
      }

      function render(data, pageData) {
        prog = pageData;
        renderRecommended();
        renderPrograms();
        renderRewards();
      }

      function onViewing() {
        renderRecommended();
        renderPrograms();
        return "Recommendation and programs updated.";
      }

      return { init() {}, render, onViewing };
    })();

    /* ID Cards page ------------------------------------------------------------ */
    const idcardsPage = (() => {
      let ic = null;      // idcards.json
      let baseId = "";    // the number in the member ID; each person adds their own two digits
      const ORDERS = "th-card-orders"; // demo orders, remembered per person and card
      const modalEl = $("#idc-modal");
      let modalType = null;

      const cardOf = (type) => ic.cards.find((c) => c.type === type);
      const memberId = (card) => `${card.idPrefix} ${baseId} ${String(family.indexOf(person()) + 1).padStart(2, "0")}`;
      const orderedOn = (card) => (store.get(ORDERS) || {})[`${viewing}:${card.type}`];
      const owner = () => (person().relation === "You" ? "Your" : `${person().firstName}'s`);
      const modalOpen = () => modalEl.classList.contains("show");
      // While the full-screen view is open, messages go to its own status line (the page behind it is hidden)
      const say = (msg) => {
        if (!modalOpen()) { announce(msg); return; }
        const el = $("#idc-modal-status");
        el.textContent = "";
        requestAnimationFrame(() => { el.textContent = msg; });
      };

      // The logo, from the same symbol as the header's
      const logo = () => {
        const NS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(NS, "svg");
        svg.setAttribute("class", "idc-logo");
        svg.setAttribute("aria-hidden", "true");
        svg.setAttribute("focusable", "false");
        const use = document.createElementNS(NS, "use");
        use.setAttribute("href", "assets/logo.svg#logo");
        svg.append(use);
        return svg;
      };
      const pair = (label, value) => h("div", {}, h("dt", {}, label), h("dd", {}, value));

      // Front: logo and kind, plan, who, plan numbers, and what you pay along the bottom
      const front = (card) => h("div", { class: `idc-face idc-front idc-${card.type}` },
        h("h3", { class: "visually-hidden" }, `Front of ${card.label.toLowerCase()} card`),
        h("div", { class: "idc-top" }, logo(), srOnly("Tornado Health"), h("span", { class: "idc-kind" }, icon(card.icon), card.label)),
        h("p", { class: "idc-plan" }, card.plan),
        h("dl", { class: "idc-who" }, pair("Member", `${person().firstName} ${person().lastName}`), pair("Member ID", memberId(card))),
        h("dl", { class: "idc-fields" }, card.fields.map((f) => pair(f.label, f.value))),
        h("dl", { class: "idc-costs" }, card.costs.map((c) => pair(c.label, c.value))));

      // Back: phone numbers (call links), where claims go, the effective date and the fine print
      const back = (card) => h("div", { class: `idc-face idc-back idc-${card.type}` },
        h("h3", { class: "visually-hidden" }, `Back of ${card.label.toLowerCase()} card`),
        h("dl", { class: "idc-contacts" }, card.contacts.map((c) =>
          h("div", {}, h("dt", {}, c.label), h("dd", {}, h("a", { href: `tel:+${c.phone.replace(/\D/g, "")}` }, c.phone))))),
        h("p", { class: "idc-mail" }, h("span", { class: "fw-semibold" }, "Send claims to "), card.claimsTo),
        h("p", { class: "idc-fine" }, `Effective ${longDate(card.effective)} · tornadohealth.example. This card doesn't guarantee coverage.`));

      // Turn the card over. The face that's away can't be reached by keyboard or screen reader.
      function flip(view, btn) {
        const toBack = !view.classList.contains("is-flipped");
        view.classList.toggle("is-flipped", toBack);
        const [f, b] = $$(".idc-face", view);
        f.inert = toBack;
        b.inert = !toBack;
        $("[data-flip-label]", btn).textContent = toBack ? "Show front" : "Show back";
        say(`Showing the ${toBack ? "back" : "front"} of the ${view.dataset.label} card.`);
      }

      // Print: just this card, front and back at real size (3.375 x 2.125 in), from a hidden frame,
      // so nothing else on the page prints
      function printCard(card) {
        const frame = h("iframe", { class: "idc-print-frame", title: "Card for printing", "aria-hidden": "true", tabindex: "-1" });
        document.body.append(frame);
        const doc = frame.contentDocument;
        doc.title = `${owner()} ${card.label.toLowerCase()} card | Tornado Health`;
        const sheets = $$('link[rel="stylesheet"]').map((l) => doc.importNode(l, true));
        const loaded = sheets.map((l) => new Promise((done) => { l.onload = done; l.onerror = done; }));
        doc.head.append(...sheets);
        doc.body.className = "idc-print-doc";
        doc.body.append(doc.importNode(h("div", { class: "idc" }, front(card)), true), doc.importNode(h("div", { class: "idc" }, back(card)), true));
        Promise.race([Promise.all(loaded), new Promise((done) => { setTimeout(done, 3000); })]).then(() => {
          const win = frame.contentWindow;
          win.addEventListener("afterprint", () => frame.remove());
          win.focus();
          win.print();
        });
      }

      // Order a card: a confirm panel opens under the actions; once ordered, a note replaces the button
      function openOrder(card, where, area, btn) {
        if (btn.getAttribute("aria-expanded") === "true") { closeOrder(area, btn); return; }
        const id = `idc-order-${card.type}-${where}`;
        area.replaceChildren(h("div", { class: "idc-order", id, role: "group", "aria-labelledby": `${id}-title` },
          h("p", { class: "fw-semibold mb-1", id: `${id}-title` }, `Mail a new ${card.label.toLowerCase()} card for ${person().firstName}?`),
          h("p", { class: "small text-body-secondary mb-3" }, `We'll send it to ${store.get(ADDRESS) ? addressLines(store.get(ADDRESS)).join(", ") : ic.mailingAddress}. It arrives in 7 to 10 days, and the digital card works until then.`),
          h("div", { class: "d-flex flex-wrap gap-2" },
            h("button", { class: "btn btn-primary btn-sm px-4", type: "button", onclick: () => placeOrder(card, where) }, "Order card"),
            h("button", { class: "btn btn-outline-primary btn-sm px-4", type: "button", onclick: () => closeOrder(area, btn) }, "Cancel"))));
        btn.setAttribute("aria-expanded", "true");
        $(".btn-primary", area).focus();
      }
      function closeOrder(area, btn) {
        area.replaceChildren();
        btn.setAttribute("aria-expanded", "false");
        btn.focus();
      }
      function placeOrder(card, where) {
        const saved = store.get(ORDERS) || {};
        saved[`${viewing}:${card.type}`] = new Date().toISOString().slice(0, 10);
        store.set(ORDERS, saved);
        renderPage();
        if (modalOpen()) renderModal();
        const scope = where === "modal" ? $("[data-idc-modal-body]") : $(`[data-idc="${card.type}"]`);
        $(".idc-order-area > .notice", scope).focus();
        say(`New ${card.label.toLowerCase()} card ordered. It arrives in 7 to 10 days.`);
      }

      // The card with its flip, print and order controls, for the page (768px and up) or the full-screen view
      function controls(card, where) {
        const label = card.label.toLowerCase();
        const inModal = where === "modal";
        const view = h("div", { class: "idc", "data-label": label }, h("div", { class: "idc-inner" }, front(card), back(card)));
        $(".idc-back", view).inert = true;
        const flipBtn = h("button", { class: `btn ${inModal ? "btn-primary" : "btn-outline-primary"} idc-flip d-inline-flex align-items-center justify-content-center gap-2`, type: "button", onclick: () => flip(view, flipBtn) },
          icon("fa-rotate"), h("span", { "data-flip-label": "" }, "Show back"), srOnly(` of ${label} card`));
        view.addEventListener("click", (e) => { if (!e.target.closest("a")) flipBtn.click(); });
        const link = inModal ? "btn btn-outline-primary" : "btn btn-link link-icon px-0";
        const printBtn = h("button", { class: link, type: "button", onclick: () => printCard(card) }, icon("fa-print"), "Print", srOnly(` ${label} card`));
        const area = h("div", { class: "idc-order-area" });
        const date = orderedOn(card);
        let orderBtn = null;
        if (date) {
          area.append(h("p", { class: "notice notice-success mb-0", tabindex: "-1" }, icon("fa-circle-check"),
            h("span", {}, `New card ordered ${shortDate(date)}. It arrives in 7 to 10 days. Use this digital card until then.`)));
        } else {
          orderBtn = h("button", { class: link, type: "button", "aria-expanded": "false", "aria-controls": `idc-order-${card.type}-${where}`, onclick: () => openOrder(card, where, area, orderBtn) },
            icon("fa-envelope"), "Order a card", srOnly(` (${label})`));
        }
        const actions = h("div", { class: `idc-actions${inModal ? "" : " d-none d-md-flex"}` }, flipBtn, printBtn, orderBtn);
        return [view, actions, area];
      }

      function renderPage() {
        ic.cards.forEach((card) => {
          const section = $(`[data-idc="${card.type}"]`);
          $("[data-idc-for]", section).textContent = `${owner()} card, ${card.useAt}`;
          const [view, actions, area] = controls(card, "page");
          // Phones: the card is the button (stretched over it) that opens the full-screen view
          const open = h("button", { class: "btn btn-outline-primary w-100 mt-3 d-md-none stretched-link idc-open d-inline-flex align-items-center justify-content-center", type: "button", onclick: () => openModal(card.type) },
            icon("fa-expand"), "Open card", srOnly(`: ${card.label.toLowerCase()}, full screen`));
          const slot = $("[data-idc-slot]", section);
          slot.replaceChildren(view, actions, open, area);
          slot.removeAttribute("aria-busy");
        });
      }

      function renderModal() {
        const card = cardOf(modalType);
        $("#idc-modal-title").textContent = `${owner()} ${card.label.toLowerCase()} card`;
        $("[data-idc-modal-body]").replaceChildren(...controls(card, "modal"));
      }
      function openModal(type) {
        modalType = type;
        renderModal();
        bootstrap.Modal.getOrCreateInstance(modalEl).show();
      }

      function init() {
        // On close, focus goes back to the Open card button of the card that was showing
        modalEl.addEventListener("hidden.bs.modal", () => {
          $("[data-idc-modal-body]").replaceChildren();
          $(`[data-idc="${modalType}"] .idc-open`)?.focus();
        });
      }

      function render(data, pageData) {
        ic = pageData;
        baseId = data.member.memberId.split(" ")[1];
        renderPage();
      }

      function onViewing() {
        renderPage();
        return "Cards updated.";
      }

      return { init, render, onViewing };
    })();

    /* Message Center page ------------------------------------------------------- */
    const messagesPage = (() => {
      let box = null;      // messages.json
      let me = null;       // member.json member (initials for "You")
      let current = null;  // the open thread's id, "new" while writing one, or null
      const SENT = "th-sent-threads"; // demo: messages written here, remembered in localStorage
      const REPLIES = "th-replies";
      const pane = () => $("[data-msg-pane]");
      // "Now" on the demo's timeline (its plan year), so new messages sort above the samples
      const nowAt = () => `${box.today}T${new Date().toTimeString().slice(0, 5)}`;
      const when = (at) => new Date(at).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
      const isUnread = (id) => inbox.messages.includes(id) && !isRead(id);
      const noteUnread = (n) => inbox.notifications.includes(n.id) && !isRead(n.id);
      const fileIcon = (name) => (/\.pdf$/i.test(name) ? "fa-file-pdf" : /\.(jpe?g|png|heic)$/i.test(name) ? "fa-file-image" : "fa-file");

      // Sample threads plus what was written here, newest activity first
      const threads = () => {
        const replies = store.get(REPLIES) || {};
        return [...(store.get(SENT) || []), ...box.threads]
          .map((t) => ({ ...t, messages: [...t.messages, ...(replies[t.id] || [])] }))
          .sort((a, b) => b.messages.at(-1).at.localeCompare(a.messages.at(-1).at)); // ties keep order: new ones first
      };

      // The address says what's open (?thread=t-1, ?new=1), so links can open a thread and, on phones,
      // the browser's Back goes from a thread to the list
      function go(params, focus) {
        const qs = params ? `?${new URLSearchParams(params)}` : "";
        history.pushState(null, "", `${location.pathname}${qs}#messages`);
        route(focus);
      }
      function route(focus) {
        const q = new URLSearchParams(location.search);
        const prev = current;
        current = q.has("new") ? "new" : q.get("thread");
        const t = current && current !== "new" ? threads().find((x) => x.id === current) : null;
        if (current !== "new" && !t) current = null;
        if (t && isUnread(t.id)) markRead([t.id]); // opening it reads it: the counts drop everywhere
        $(".msg-center").classList.toggle("is-reading", Boolean(current));
        renderThreads();
        renderPane(t);
        if (!focus) return;
        if (current) focusEl($("#pane-title"));
        else focusEl($(`.msg-row[data-id="${prev}"]`) || $("[data-msg-new]"));
      }

      // Inbox: one row per conversation. Unread: a dot and bold sender and subject. Open: a solid tint.
      function renderThreads() {
        renderList("threads", threads().map((t) => {
          const unread = isUnread(t.id);
          const last = t.messages.at(-1);
          return h("li", {}, h("a", {
            class: `msg-row${unread ? " is-unread" : ""}`, href: `?thread=${t.id}#messages`, "data-id": t.id,
            ...(t.id === current && { "aria-current": "true" }),
            onclick: (e) => { e.preventDefault(); go({ thread: t.id }, true); },
          },
          h("span", { class: "msg-dot", "aria-hidden": "true" }),
          h("span", { class: "msg-from" }, unread ? srOnly("Unread: ") : null, t.from),
          h("time", { class: "msg-date", datetime: last.at }, shortDate(last.at.slice(0, 10))),
          h("span", { class: "msg-subject" }, t.subject),
          h("span", { class: "msg-snippet" }, `${last.mine ? "You: " : ""}${last.body.replace(/\s+/g, " ")}`)));
        }));
      }

      const backButton = () => h("button", { class: "btn btn-link link-icon px-0 mb-3 d-lg-none", type: "button", onclick: () => go(null, true) },
        icon("fa-arrow-left"), "All messages");

      // The right-hand pane: a conversation, the new-message form, or (desktop, nothing open) a prompt
      function renderPane(t) {
        if (current === "new") { pane().replaceChildren(...composeView()); return; }
        if (!t) {
          pane().replaceChildren(h("div", { class: "msg-empty" },
            h("span", { class: "program-art mb-3", "aria-hidden": "true" }, icon("fa-envelope-open-text")),
            h("p", { class: "fw-semibold mb-1" }, "Pick a message to read it"),
            h("p", { class: "small text-body-secondary mb-0" }, "Or start a new one. We reply within 1 business day.")));
          return;
        }
        const about = family.find((p) => p.id === t.about);
        pane().replaceChildren(...[ // (skip empty slots: replaceChildren would print "null")
          backButton(),
          h("h2", { class: "mb-1", id: "pane-title" }, t.subject),
          h("p", { class: "small text-body-secondary mb-4" }, `${t.from} · ${t.topic} · About ${about ? about.firstName : me.firstName}`),
          h("ol", { class: "msg-thread list-unstyled mb-0", "aria-label": "Messages, oldest first" }, t.messages.map(messageItem)),
          t.messages.at(-1).mine
            ? h("p", { class: "notice notice-info mt-3 mb-0", "data-sent-note": "" }, icon("fa-circle-info"), h("span", {}, "We got your message. We reply within 1 business day."))
            : null,
          replyForm(t)].filter(Boolean));
      }

      // One message: who and when, the text, attachments, links. Yours on the brand tint, ours on gray.
      const messageItem = (m) => h("li", { class: `msg${m.mine ? " msg-mine" : ""}` },
        h("div", { class: "msg-head" },
          m.mine
            ? h("span", { class: "avatar", "aria-hidden": "true" }, me.initials)
            : h("span", { class: "avatar avatar-plan", "aria-hidden": "true" }, icon("fa-shield-heart")),
          h("p", { class: "msg-name mb-0" }, m.mine ? "You" : m.name),
          h("time", { class: "msg-time", datetime: m.at }, when(m.at))),
        h("div", { class: "msg-body" }, m.body.split(/\n{2,}/).map((p) => h("p", {}, p))),
        m.attachments?.length
          ? h("ul", { class: "msg-attachments list-unstyled mb-0", "aria-label": "Attachments" }, m.attachments.map((f) =>
            h("li", {}, h("a", { class: "msg-attach", href: "#" }, icon(fileIcon(f.name)), h("span", {}, f.name), h("span", { class: "msg-attach-size" }, f.size)))))
          : null,
        m.links?.length
          ? h("p", { class: "msg-links mb-0" }, m.links.map((l) => h("a", { class: "link-icon", href: l.href }, l.label, icon("fa-arrow-right"))))
          : null);

      // A labelled control with an optional hint and an error line (hidden until it has something to say)
      const group = (id, label, control, hint, wrap = "mb-3") => {
        control.id = id;
        if (hint) { control.dataset.hint = `${id}-hint`; control.setAttribute("aria-describedby", `${id}-hint`); }
        return h("div", { class: wrap },
          h("label", { class: "form-label fw-semibold", for: id }, label),
          control,
          hint ? h("p", { class: "form-text mt-1 mb-0", id: `${id}-hint` }, hint) : null,
          h("p", { class: "small text-danger-emphasis fw-semibold mt-2 mb-0", id: `${id}-error`, hidden: "" }));
      };

      function replyForm(t) {
        const text = h("textarea", { class: "form-control", rows: "4", maxlength: "2000" });
        const form = h("form", { class: "msg-reply", novalidate: "" },
          group("reply-text", "Reply", text, "We reply within 1 business day. In an emergency, call 911."),
          h("button", { class: "btn btn-primary px-4 d-inline-flex align-items-center gap-2", type: "submit" }, icon("fa-paper-plane"), "Send reply"));
        form.addEventListener("submit", (e) => {
          e.preventDefault();
          const body = text.value.trim();
          if (!checkFields([[text, body ? "" : "Write a reply before sending."]])) return;
          const replies = store.get(REPLIES) || {};
          replies[t.id] = [...(replies[t.id] || []), { mine: true, at: nowAt(), body }];
          store.set(REPLIES, replies);
          route(false);
          focusEl($("[data-sent-note]"));
          announce("Reply sent.");
        });
        return form;
      }

      function composeView() {
        const topic = h("select", { class: "form-select" }, h("option", { value: "" }, "Choose a topic"), box.topics.map((x) => h("option", { value: x }, x)));
        const about = h("select", { class: "form-select" }, family.map((p) => h("option", { value: p.id }, p.relation === "You" ? `${p.firstName} (you)` : p.firstName)));
        const subject = h("input", { class: "form-control", type: "text", maxlength: "80", autocomplete: "off" });
        const body = h("textarea", { class: "form-control", rows: "6", maxlength: "2000" });
        const files = h("input", { class: "form-control", type: "file", multiple: "", accept: ".pdf,.jpg,.jpeg,.png,.heic" });
        const form = h("form", { novalidate: "" },
          h("div", { class: "row g-3 mb-3" },
            h("div", { class: "col-sm-7" }, group("new-topic", "Topic", topic, null, "")),
            h("div", { class: "col-sm-5" }, group("new-about", "Who it's about", about, null, ""))),
          group("new-subject", "Subject", subject),
          group("new-body", "Message", body, "Nothing urgent here, please. In an emergency, call 911."),
          group("new-files", "Attach files (optional)", files, "PDFs or photos. In this demo, files aren't uploaded.", "mb-4"),
          h("div", { class: "d-flex flex-wrap gap-2" },
            h("button", { class: "btn btn-primary px-4 d-inline-flex align-items-center gap-2", type: "submit" }, icon("fa-paper-plane"), "Send message"),
            h("button", { class: "btn btn-outline-primary px-4", type: "button", onclick: () => go(null, true) }, "Cancel")));
        form.addEventListener("submit", (e) => {
          e.preventDefault();
          const checks = [[topic, topic.value ? "" : "Choose a topic."], [subject, subject.value.trim() ? "" : "Add a subject."], [body, body.value.trim() ? "" : "Write your message."]];
          if (!checkFields(checks)) return;
          const t = {
            id: `t-${Date.now()}`, subject: subject.value.trim(), topic: topic.value, about: about.value, from: "Member services",
            messages: [{ mine: true, at: nowAt(), body: body.value.trim(), attachments: [...files.files].map((f) => ({ name: f.name, size: `${Math.max(1, Math.round(f.size / 1024))} KB` })) }],
          };
          store.set(SENT, [t, ...(store.get(SENT) || [])]);
          history.replaceState(null, "", `${location.pathname}?thread=${t.id}#messages`);
          route(false);
          focusEl($("[data-sent-note]"));
          announce("Message sent.");
        });
        return [backButton(), h("h2", { class: "mb-1", id: "pane-title" }, "New message"),
          h("p", { class: "small text-body-secondary mb-4" }, "Secure. We reply within 1 business day."), form];
      }

      // Notifications: New (unread) first, then Earlier. Following one, or Mark all as read, reads it.
      const noteRow = (n) => {
        const unread = noteUnread(n);
        return h("li", { class: `list-group-item action-row${unread ? " is-unread" : ""}` },
          h("span", { class: `icon-chip bg-${n.tone}-subtle text-${n.tone}-emphasis`, "aria-hidden": "true" }, icon(n.icon)),
          h("div", { class: "note-text" },
            h("p", { class: "note-title mb-1" }, unread ? h("span", { class: "msg-dot", "aria-hidden": "true" }) : null, unread ? srOnly("New: ") : null, n.title),
            h("p", { class: "small text-body-secondary mb-0" }, `${n.detail} · `, h("time", { class: "text-nowrap", datetime: n.date }, shortDate(n.date)))),
          h("a", { class: "link-icon row-action", href: n.action.href, onclick: () => markRead([n.id]) }, n.action.label, srOnly(`: ${n.title}`), icon("fa-arrow-right")));
      };
      function renderNotes() {
        const fresh = box.notifications.filter(noteUnread);
        const earlier = box.notifications.filter((n) => !noteUnread(n));
        renderList("notes-new", fresh.map(noteRow)).hidden = !fresh.length;
        $("[data-notes-caught-up]").hidden = Boolean(fresh.length);
        renderList("notes-earlier", earlier.map(noteRow)).hidden = !earlier.length;
        $("#notes-earlier-title").hidden = !earlier.length;
        $("[data-mark-all]").hidden = !fresh.length;
      }

      // Tabs: each has its own address (messages.html#notifications), so the account menu opens the right one
      function showTabFromHash(follow) {
        const name = location.hash.slice(1);
        if (!["messages", "notifications"].includes(name)) return;
        const tab = $(`#tab-${name}`);
        bootstrap.Tab.getOrCreateInstance(tab).show();
        if (follow && !$(".offcanvas.show")) tab.focus();
      }

      function init() {
        showTabFromHash(false);
        addEventListener("hashchange", () => showTabFromHash(true));
        // A link to the tab already shown (the account menu) fires no hashchange: still move to it
        document.addEventListener("click", (e) => {
          const link = e.target.closest("a[href*='#']:not(.msg-row)"); // inbox rows open a thread instead
          if (link && link.href === location.href && ["#messages", "#notifications"].includes(link.hash)) {
            e.preventDefault();
            requestAnimationFrame(() => showTabFromHash(true));
          }
        });
        $$('.page-tabs [data-bs-toggle="tab"]').forEach((tab) => tab.addEventListener("shown.bs.tab", () => {
          history.replaceState(null, "", `${location.pathname}${location.search}#${tab.id.replace("tab-", "")}`); // #messages, #notifications
        }));
        addEventListener("popstate", () => { if (box) route(true); });
        $("[data-msg-new]").addEventListener("click", () => go({ new: 1 }, true));
        $("[data-mark-all]").addEventListener("click", () => {
          markRead(box.notifications.filter(noteUnread).map((n) => n.id));
          renderNotes();
          focusEl($("#notes-title"));
          announce("All notifications marked as read.");
        });
      }

      function render(data, pageData) {
        box = pageData;
        me = data.member;
        renderNotes();
        route(false);
      }

      return { init, render, onViewing: () => "" };
    })();

    /* Help center page ------------------------------------------------------------ */
    // The questions, contacts and forms are written into help.html; this only searches and filters.
    const helpPage = (() => {
      const norm = (s) => s.toLowerCase().replace(/[^a-z0-9$]+/g, " ").trim();
      let announceTimer = null;
      // What each question can be found by: its question, its answer and a few extra words (data-keywords)
      const searchText = (d) => norm(`${$("summary", d).textContent} ${$(".faq-answer", d).textContent} ${d.dataset.keywords || ""}`);

      // Show the questions that match the topic and every word typed; say how many (after typing pauses)
      function apply(speak) {
        const query = $("#help-q").value.trim();
        const words = norm(query).split(" ").filter((w) => w.length > 1);
        const topic = $('input[name="help-topic"]:checked').value;
        const shown = $$(".faq").filter((d) => {
          const match = (topic === "all" || d.dataset.topic === topic) && words.every((w) => searchText(d).includes(w));
          d.hidden = !match;
          return match;
        });
        if (shown.length === 1 && words.length) shown[0].open = true;
        const count = query ? `${plural(shown.length, "answer", "answers")} for "${query}"` : plural(shown.length, "question", "questions");
        $("#faq-count").textContent = shown.length ? count : "";
        $("#faq-count").hidden = !shown.length;
        setField("helpQuery", query);
        $("#faq-empty").hidden = Boolean(shown.length);
        if (!speak) return;
        clearTimeout(announceTimer);
        announceTimer = setTimeout(() => announce(shown.length ? `${count}.` : `No answers for "${query}".`), 600);
      }

      // After a search, bring the results into view and put focus at their start
      function showResults() {
        apply(true);
        const url = new URL(location.href);
        if ($("#help-q").value.trim()) url.searchParams.set("q", $("#help-q").value.trim());
        else url.searchParams.delete("q");
        history.replaceState(null, "", url);
        $("#faq-title").focus();
      }

      // A link to one question (help.html#faq-lost-card) opens it
      function openFromHash() {
        const d = location.hash.startsWith("#faq-") ? document.getElementById(location.hash.slice(1)) : null;
        if (d?.tagName === "DETAILS") { d.hidden = false; d.open = true; }
      }

      function init() {
        const q = new URLSearchParams(location.search).get("q");
        if (q) $("#help-q").value = q;
        apply(false);
        openFromHash();
        addEventListener("hashchange", openFromHash);
        $("#help-q").addEventListener("input", () => apply(true));
        $("#help-search").addEventListener("submit", (e) => { e.preventDefault(); showResults(); });
        $$('input[name="help-topic"]').forEach((r) => r.addEventListener("change", () => apply(true)));
        $$("[data-help-query]").forEach((b) => b.addEventListener("click", () => { $("#help-q").value = b.dataset.helpQuery; showResults(); }));
      }

      return { init, render() {}, onViewing: () => "" };
    })();

    /* Account overview page ------------------------------------------------------ */
    // account.html is written with the current details, so nothing shifts as it loads. This fills them from the data
    // (plus anything changed here, remembered in localStorage) and runs the edit forms, switches and sign-out.
    const accountPage = (() => {
      let acct = null;
      const CONTACT = "th-account-contact";
      const PREFS = "th-preferences";
      const SIGNED_OUT = "th-signed-out-others";
      const contact = () => ({ ...acct.contact, ...(store.get(CONTACT) || {}) });
      const address = () => ({ ...acct.address, ...(store.get(ADDRESS) || {}) });
      const prefs = () => ({ ...acct.preferences, ...(store.get(PREFS) || {}) });
      // Each section's own status line (role="status"): says what was saved, right where it happened
      const saved = (name, msg) => {
        const el = $(`[data-saved="${name}"]`);
        el.textContent = "";
        requestAnimationFrame(() => { el.textContent = msg; });
      };

      function renderContact() {
        const c = contact();
        setField("acctEmail", c.email);
        setField("acctPhone", c.phone);
        setField("acctLanguage", c.language);
        setField("acctPhoneLast4", c.phone.replace(/\D/g, "").slice(-4));
      }
      function renderAddress() {
        const [line1, line2] = addressLines(address());
        setField("addrLine1", line1);
        setField("addrLine2", line2);
      }
      function renderPrefs() {
        const p = prefs();
        $$("[data-pref]").forEach((input) => { input.checked = Boolean(p[input.dataset.pref]); });
      }
      function renderDevices() {
        const n = store.get(SIGNED_OUT) ? 0 : acct.security.otherDevices;
        setField("deviceCount", n ? `This device and ${plural(n, "other", "others")}.` : "Only this device.");
        $("[data-signout-others]").hidden = !n;
      }
      // One tile per person; member IDs end in their place on the plan (01, 02, 03), as on their ID cards
      function renderCovered(member) {
        renderList("covered", family.map((p, i) => h("li", { class: "col" }, h("div", { class: "person-tile" },
          h("span", { class: "avatar", "aria-hidden": "true" }, p.initials),
          h("div", {},
            h("p", { class: "fw-semibold mb-0" }, `${p.firstName} ${p.lastName}`),
            h("p", { class: "small text-body-secondary mb-1" }, p.relation === "You" ? "You · Subscriber" : p.relation),
            h("p", { class: "small mb-0" }, `Member ID ${member.memberId} ${String(i + 1).padStart(2, "0")}`),
            h("p", { class: "small text-body-secondary mb-0" }, `Born ${longDate(acct.people[p.id].dob)}`))))));
      }

      // Edit in place: the details give way to a form. Save (when valid) or Cancel brings them back and returns focus
      // to Edit.
      function editable(name, fill, save) {
        const view = $(`[data-view="${name}"]`);
        const form = $(`[data-edit="${name}"]`);
        const edit = $(`[data-edit-btn="${name}"]`);
        const close = () => { form.hidden = true; view.hidden = false; edit.hidden = false; edit.focus(); };
        edit.addEventListener("click", () => {
          fill();
          $$("input[aria-invalid]", form).forEach((input) => setFieldError(input, ""));
          $(`[data-saved="${name}"]`).textContent = "";
          view.hidden = true;
          edit.hidden = true;
          form.hidden = false;
          $("input, select", form).focus();
        });
        $("[data-cancel]", form).addEventListener("click", close);
        form.addEventListener("submit", (e) => {
          e.preventDefault();
          if (save()) close();
        });
      }

      function wire() {
        editable("contact", () => {
          const c = contact();
          $("#acct-email").value = c.email;
          $("#acct-phone").value = c.phone;
          $("#acct-language").value = c.language;
        }, () => {
          const email = $("#acct-email");
          const phone = $("#acct-phone");
          const digits = phone.value.replace(/\D/g, "").replace(/^1(?=\d{10}$)/, "");
          if (!checkFields([
            [email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()) ? "" : "Enter an email address, like name@example.com."],
            [phone, digits.length === 10 ? "" : "Enter a 10-digit phone number."],
          ])) return false;
          store.set(CONTACT, { email: email.value.trim(), phone: `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`, language: $("#acct-language").value });
          renderContact();
          saved("contact", "Saved. We'll use these from now on.");
          return true;
        });

        const f = (id) => $(`#addr-${id}`);
        editable("address", () => {
          const a = address();
          ["street", "unit", "city", "state", "zip"].forEach((k) => { f(k).value = a[k] || ""; });
        }, () => {
          const v = (k) => f(k).value.trim();
          if (!checkFields([
            [f("street"), v("street") ? "" : "Enter a street address."],
            [f("city"), v("city") ? "" : "Enter a city."],
            [f("state"), /^[a-z]{2}$/i.test(v("state")) ? "" : "Enter a 2-letter state, like MI."],
            [f("zip"), /^\d{5}$/.test(v("zip")) ? "" : "Enter a 5-digit ZIP code."],
          ])) return false;
          store.set(ADDRESS, { street: v("street"), unit: v("unit"), city: v("city"), state: v("state").toUpperCase(), zip: v("zip") });
          renderAddress();
          saved("address", "Saved. New ID cards and mailed letters will go here.");
          return true;
        });

        $$("[data-pref]").forEach((input) => input.addEventListener("change", () => {
          store.set(PREFS, { ...prefs(), [input.dataset.pref]: input.checked });
          saved("prefs", `Saved: ${$(`label[for="${input.id}"]`).textContent}, ${input.checked ? "on" : "off"}.`);
        }));

        // The button goes once it's done its job, so focus moves to the line that says what happened
        $("[data-signout-others]").addEventListener("click", () => {
          store.set(SIGNED_OUT, true);
          renderDevices();
          saved("security", "Signed out of your other devices.");
          $('[data-saved="security"]').focus();
        });
      }

      function render(data, pageData) {
        acct = pageData;
        const { member } = data;
        setField("acctName", `${member.firstName} ${member.lastName}`);
        setField("acctDob", longDate(acct.people[family[0].id].dob));
        setField("acctMemberId", `${member.memberId} 01`);
        setField("acctGroup", member.group);
        setField("acctEmployer", acct.employer);
        setField("acctPlanYear", `${shortDate(member.planYear.start)} to ${longDate(member.planYear.end)}`);
        setField("pwChanged", longDate(acct.security.passwordChanged));
        renderContact();
        renderAddress();
        renderPrefs();
        renderDevices();
        renderCovered(member);
        wire();
      }

      return { init() {}, render, onViewing: () => "" };
    })();

    // Pages that are only content (404, accessibility statement): the shell runs, nothing of their own to load
    const staticPage = { init() {}, render() {}, onViewing: () => "" };
    /* Provider profile page (provider.html?id=p-patel) ----------------------------- */
    const providerPage = (() => {
      let care = null;
      let pr = null;
      let member = null;
      // Someone in the family already sees them: booking works even when they aren't taking new patients
      const seenBy = () => family.filter((p) => (care.yourDoctors[p.id] || []).some((d) => d.provider === pr.id));

      function renderAbout() {
        setField("pageTitle", pr.name);
        setField("crumbCurrent", pr.name);
        document.title = `${pr.name} | Tornado Health`;
        setField("providerFacts", `${pr.specialty} · ${pr.practice}`);
        renderList("provider-badges", [
          badge("success", "In network"),
          pr.accepting ? badge("success", "Taking new patients") : badge("warning", "Not taking new patients"),
          ...seenBy().map((p) => badge("info", p.relation === "You" ? "Your doctor" : `${p.firstName}'s doctor`)),
        ]);
        setField("providerAbout", pr.about);
        setField("providerSpecialty", pr.specialty);
        setField("providerLanguages", pr.languages.join(", "));
        setField("providerVisits", pr.visitTypes.join(", "));
        setField("providerHospital", pr.hospital || "None");
        setField("providerCost", pr.cost.replace(" copay", ""));
        setField("providerPractice", pr.practice);
        setField("providerAddress", pr.address);
        setField("providerDistance", `${pr.distance} miles from ${member.zip || "48201"}`);
        const phone = $("[data-provider-phone]");
        phone.textContent = pr.phone;
        phone.href = `tel:+1${pr.phone.replace(/\D/g, "")}`;
        renderList("provider-hours", pr.hours.map((line) => h("li", {}, line)));
      }

      // The booking card: a request form; or walk in; or not taking new patients
      function renderBooking() {
        const card = $("[data-book]");
        const title = (text) => h("h2", { class: "mb-1", id: "book-title", tabindex: "-1" }, text);
        if (pr.visitTypes.includes("Walk-in")) {
          card.replaceChildren(title("Walk in"), h("p", { class: "small text-body-secondary mb-3" }, "No appointment needed. Bring your ID card."),
            h("ul", { class: "list-unstyled mb-0" }, pr.hours.map((line) => h("li", { class: "fw-semibold" }, line))));
          return;
        }
        const patients = seenBy();
        if (!pr.accepting && !patients.length) {
          card.replaceChildren(title("Not taking new patients"),
            h("p", { class: "small text-body-secondary mb-3" }, `${pr.name} isn't seeing new patients right now. These ${pr.specialty.toLowerCase()} providers are in network:`),
            h("a", { class: "link-icon", href: `find-care.html?q=${encodeURIComponent(pr.specialty)}` }, `Find ${pr.specialty.toLowerCase()}`, h("i", { class: "fa-solid fa-arrow-right", "aria-hidden": "true" })));
          return;
        }
        const who = patients.length && !pr.accepting ? patients : family;
        const today = toDate(pr.next || "2027-11-29");
        const iso = (d) => d.toISOString().slice(0, 10);
        const field = (id, label, control, error) => h("div", { class: "mb-3" },
          h("label", { class: "form-label small fw-semibold", for: id }, label), control,
          error ? h("p", { class: "small text-danger-emphasis fw-semibold mt-2 mb-0", id: `${id}-error`, hidden: "" }) : null);
        const date = h("input", { class: "form-control", type: "date", id: "book-date", min: iso(today), value: iso(today) });
        const person = h("select", { class: "form-select", id: "book-who" }, who.map((p) => h("option", { value: p.id }, p.relation === "You" ? `${p.firstName} (you)` : p.firstName)));
        const radio = (name, value, label, checked) => h("div", { class: "form-check" },
          h("input", { class: "form-check-input", type: "radio", name, id: `${name}-${value}`, value, ...(checked && { checked: "" }) }),
          h("label", { class: "form-check-label", for: `${name}-${value}` }, label));
        const form = h("form", { novalidate: "", "aria-labelledby": "book-title" },
          field("book-who", "Who it's for", person),
          field("book-date", "Earliest day that works", date, true),
          h("fieldset", { class: "mb-3" }, h("legend", { class: "form-label small fw-semibold mb-1" }, "Time of day"),
            h("div", { class: "d-flex flex-wrap column-gap-4" }, radio("book-time", "morning", "Morning", true), radio("book-time", "afternoon", "Afternoon"))),
          pr.visitTypes.length > 1
            ? h("fieldset", { class: "mb-3" }, h("legend", { class: "form-label small fw-semibold mb-1" }, "Visit type"),
              h("div", { class: "d-flex flex-wrap column-gap-4" }, pr.visitTypes.map((t, i) => radio("book-type", t.toLowerCase().replace(/\W+/g, "-"), t, i === 0))))
            : null,
          field("book-reason", "Reason for the visit (optional)", h("textarea", { class: "form-control", id: "book-reason", rows: "3", maxlength: "300" })),
          h("button", { class: "btn btn-primary w-100", type: "submit" }, "Request a visit"));
        form.addEventListener("submit", (e) => {
          e.preventDefault();
          const err = $("#book-date-error");
          const ok = date.value && date.value >= date.min;
          err.textContent = ok ? "" : `Choose ${shortDate(date.min)} or later.`;
          err.hidden = ok;
          if (!ok) { date.setAttribute("aria-invalid", "true"); date.setAttribute("aria-describedby", err.id); date.focus(); return; }
          const p = family.find((f) => f.id === person.value);
          const note = h("p", { class: "notice notice-success mb-0", tabindex: "-1" }, icon("fa-circle-check"),
            h("span", {}, `Request sent for ${p.firstName}. ${pr.practice} will call ${member.phone || "you"} within 1 business day to set a time, from ${shortDate(date.value)} on.`));
          card.replaceChildren(title("Visit requested"), note);
          note.focus();
          announce("Visit requested.");
        });
        card.replaceChildren(title("Book a visit"),
          h("p", { class: "small text-body-secondary mb-3" }, pr.next ? `Next opening ${shortDate(pr.next)}. The office calls you to confirm a time.` : "The office calls you to confirm a time."),
          form);
      }

      function render(data, pageData) {
        care = pageData;
        member = { zip: "48201", phone: "(313) 555-0142", ...data.member };
        pr = care.providers.find((x) => x.id === new URLSearchParams(location.search).get("id"));
        if (!pr) {
          $("[data-provider]").hidden = true;
          $("#provider-missing").hidden = false;
          setField("pageTitle", "Provider not found");
          return;
        }
        renderAbout();
        renderBooking();
        if (location.hash === "#book-title") requestAnimationFrame(() => $("#book-title").scrollIntoView({ block: "start" }));
      }

      return { init() {}, render, onViewing: () => "" };
    })();

    /* Cost estimate page (estimate.html?service=knee-mri) ---------------------------- */
    // Works out what the person being viewed would pay at each in-network place, from where they stand today
    // (coverage.json: deductible and out-of-pocket so far) and the service's prices (estimate.json).
    const estimatePage = (() => {
      let est = null;
      let costs = null;
      let place = 0; // index into the chosen service's places
      const service = () => est.services.find((s) => s.id === $("#est-service").value);
      function standing() {
        const spent = costs.spent[viewing];
        return {
          dedLeft: Math.max(0, costs.individual.deductible - spent.deductible),
          oopLeft: Math.max(0, costs.individual.outOfPocket - spent.outOfPocket),
        };
      }
      // What you pay at one price: preventive is $0; copays are flat; otherwise deductible first, then coinsurance,
      // never more than what's left before the out-of-pocket max
      function costAt(s, price) {
        const { dedLeft, oopLeft } = standing();
        if (s.kind === "preventive") return { you: 0, rows: [["Covered as preventive care", money(0)]] };
        if (s.kind === "copay") {
          const you = Math.min(s.copay, price, oopLeft);
          return { you, rows: [["Your copay", money(you)]] };
        }
        const toDed = Math.min(price, dedLeft);
        const share = Math.round((price - toDed) * s.coinsurance);
        const you = Math.min(toDed + share, oopLeft);
        const rows = [["Toward your deductible", money(toDed)], [`Your ${s.coinsurance * 100}% share after that`, money(share)]];
        if (you < toDed + share) rows.push(["Capped at your out-of-pocket max", `−${money(toDed + share - you)}`]);
        return { you, rows };
      }
      const sorted = (s) => s.places.map((pl, i) => ({ ...pl, i, you: costAt(s, pl.price).you })).sort((a, b) => a.you - b.you || a.price - b.price);

      function renderStanding() {
        const { dedLeft, oopLeft } = standing();
        setField("estName", person().firstName);
        setField("estDedLeft", money(dedLeft));
        setField("estOopLeft", money(oopLeft));
      }
      function renderPlaces() {
        const s = service();
        renderList("est-places", sorted(s).map((pl) => h("label", { class: `est-place${pl.i === place ? " is-chosen" : ""}`, for: `est-place-${pl.i}` },
          h("input", { class: "form-check-input", type: "radio", name: "est-place", id: `est-place-${pl.i}`, value: String(pl.i), ...(pl.i === place && { checked: "" }) }),
          h("span", { class: "est-place-name" }, h("span", { class: "fw-semibold d-block" }, pl.name), h("span", { class: "small text-body-secondary" }, `${pl.distance} mi · Price ${money(pl.price)}`)),
          h("span", { class: "est-place-cost" }, h("span", { class: "fw-bold d-block" }, money(pl.you)), h("span", { class: "small text-body-secondary" }, "you pay")))));
        $$('input[name="est-place"]').forEach((r) => r.addEventListener("change", () => { place = Number(r.value); renderPlaces(); renderEstimate(); $(`#est-place-${place}`).focus(); }));
      }
      function renderEstimate() {
        const s = service();
        const pl = s.places[place];
        const { you, rows } = costAt(s, pl.price);
        setField("estWhere", `${s.name} at ${pl.name}, for ${person().firstName}`);
        setField("estYouPay", money(you));
        renderList("est-breakdown", [
          h("tr", {}, h("th", { scope: "row" }, "Price at this place"), h("td", {}, money(pl.price))),
          ...rows.map(([label, value]) => h("tr", {}, h("th", { scope: "row" }, label), h("td", {}, value))),
          h("tr", { class: "is-total" }, h("th", { scope: "row" }, "You'd pay"), h("td", {}, money(you))),
          h("tr", {}, h("th", { scope: "row" }, "The plan pays"), h("td", {}, money(pl.price - you))),
        ]);
        renderList("est-notes", (s.notes || []).map((n) => h("p", { class: `notice notice-${n.tone} small mb-0` }, icon(n.icon), h("span", {}, n.text,
          n.link ? [" ", h("a", { href: n.link.href }, n.link.label), "."] : null))));
      }
      function renderAll() {
        renderStanding();
        renderPlaces();
        renderEstimate();
      }
      // A new service starts on the place that costs you least
      function pickService() {
        place = sorted(service())[0].i;
        const url = new URL(location.href);
        url.searchParams.set("service", service().id);
        history.replaceState(null, "", url);
        renderAll();
      }

      function render(data, pageData) {
        est = pageData;
        costs = pageData.costs;
        const sel = $("#est-service");
        sel.replaceChildren(...est.groups.map((g) => h("optgroup", { label: g.label },
          est.services.filter((s) => s.group === g.id).map((s) => h("option", { value: s.id }, s.name)))));
        const wanted = new URLSearchParams(location.search).get("service");
        if (est.services.some((s) => s.id === wanted)) sel.value = wanted;
        sel.addEventListener("change", () => { pickService(); announce(`Estimate updated: ${$("[data-field='estYouPay']").textContent} at ${service().places[place].name}.`); });
        pickService();
      }

      function onViewing() {
        renderAll();
        return `Estimate updated for ${person().firstName}: ${money(costAt(service(), service().places[place].price).you)}.`;
      }

      return { init() {}, render, onViewing };
    })();

    /* Approval details page (auth.html?id=a-mri): prior authorizations and referrals ---------- */
    const authPage = (() => {
      const arrow = (text, href) => h("a", { class: "link-icon", href }, text, icon("fa-arrow-right"));
      const fact = (label, value) => h("div", {}, h("dt", {}, label), h("dd", {}, value));

      function render(data, cov) {
        const a = cov.auths.find((x) => x.id === new URLSearchParams(location.search).get("id"));
        if (!a) {
          $("[data-auth]").hidden = true;
          $("#auth-missing").hidden = false;
          setField("pageTitle", "Approval not found");
          return;
        }
        const who = family.find((p) => p.id === a.patient);
        setField("pageTitle", a.title);
        setField("crumbCurrent", a.title);
        document.title = `${a.title} | Tornado Health`;
        setField("authFacts", `${a.kind} · For ${who.firstName} · Requested ${longDate(a.requested)}`);
        renderList("auth-badge", [badge(a.tone, a.status)]);
        setField("authHeadline", a.headline);
        setField("authNext", a.next);
        renderList("auth-timeline", a.steps.map(timelineStep));
        renderList("auth-details", [
          fact(a.kind === "Referral" ? "Referred to" : "What's requested", a.service),
          fact("For", `${who.firstName} ${who.lastName}`),
          fact("Requested by", a.requestedBy),
          fact("Where", a.where),
          fact("Reason given", a.reason),
          fact(a.validTo ? "Good through" : "Decision by", longDate(a.validTo || a.decisionBy)),
          fact("Reference number", a.reference),
        ]);
        if (a.visits) {
          $("[data-auth-visits]").hidden = false;
          setField("authVisitsText", `${a.visits.used} of ${a.visits.total} used, ${a.visits.total - a.visits.used} left.`);
          const meter = $('[data-meter="authVisits"]');
          meter.max = a.visits.total;
          meter.setAttribute("aria-valuetext", `${a.visits.used} of ${a.visits.total} visits used`);
          fillMeter(meter, a.visits.used);
        }
        renderList("auth-actions", [
          a.estimate ? h("li", {}, arrow("Estimate what you'd pay", `estimate.html?service=${a.estimate}`)) : null,
          a.provider ? h("li", {}, arrow(`See ${a.whereShort || a.where}`, `provider.html?id=${a.provider}`)) : null,
          h("li", {}, arrow("Ask us about this", "messages.html?new=1#messages")),
          h("li", {}, arrow("All approvals", "coverage.html#auths-title")),
        ].filter(Boolean));
      }

      return { init() {}, render, onViewing: () => "" };
    })();

    /* Appeal page (appeal.html?claim=c-1009): three steps, then a confirmation -------------- */
    // A sent appeal is remembered (localStorage), so the page and the claim show it from then on.
    const appealPage = (() => {
      const TODAY = "2027-11-24"; // the demo's date (its plan year)
      let claim = null;
      let step = 1;
      const answers = { reason: "covered", details: "", files: [], contact: "message" };
      const REASONS = { covered: "It should be covered", amount: "The amount is wrong", other: "Something else" };
      const CONTACT = { message: "Message Center", phone: "Phone call", mail: "Mail" };
      const pane = () => $("[data-appeal]");
      const addDays = (iso, n) => { const d = toDate(iso); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };

      const radio = (name, value, label, hint) => h("div", { class: "form-check appeal-choice" },
        h("input", { class: "form-check-input", type: "radio", name, id: `${name}-${value}`, value, ...(answers[name.replace("appeal-", "")] === value && { checked: "" }) }),
        h("label", { class: "form-check-label", for: `${name}-${value}` }, h("span", { class: "fw-semibold d-block" }, label), hint ? h("span", { class: "small text-body-secondary" }, hint) : null));

      // Step indicator: where you are of three; the current step is announced by its heading taking focus
      const progress = () => h("ol", { class: "appeal-steps list-unstyled", "aria-label": "Steps" },
        ["Reason", "Details", "Review"].map((label, i) => h("li", { class: i + 1 < step ? "is-done" : i + 1 === step ? "is-current" : "", ...(i + 1 === step && { "aria-current": "step" }) },
          h("span", { class: "appeal-step-num", "aria-hidden": "true" }, i + 1 < step ? icon("fa-check") : String(i + 1)), label)));
      const heading = (text) => h("h2", { class: "mb-1", id: "appeal-step-title", tabindex: "-1" }, text);
      const buttons = (nextLabel, back = true) => h("div", { class: "d-flex flex-wrap gap-2 mt-4" },
        h("button", { class: "btn btn-primary px-4", type: "submit" }, nextLabel),
        back ? h("button", { class: "btn btn-outline-primary px-4", type: "button", onclick: () => go(step - 1) }, "Back") : null);

      function stepOne() {
        const details = h("textarea", { class: "form-control", id: "appeal-details", rows: "5", maxlength: "2000", "aria-describedby": "appeal-details-hint", "data-hint": "appeal-details-hint" }, answers.details);
        const form = h("form", { novalidate: "" },
          h("fieldset", { class: "mb-4" }, h("legend", { class: "visually-hidden" }, "Why are you appealing?"), // the step heading says it on screen
            h("div", { class: "vstack gap-2" },
              radio("appeal-reason", "covered", REASONS.covered, "For example, a doctor prescribed it or it was medically necessary."),
              radio("appeal-reason", "amount", REASONS.amount, "You were charged more than your plan's share."),
              radio("appeal-reason", "other", REASONS.other))),
          h("label", { class: "form-label fw-semibold", for: "appeal-details" }, "Tell us what happened"),
          h("p", { class: "form-text mt-0 mb-2", id: "appeal-details-hint" }, "In your own words. Include anything the claim decision missed."),
          details,
          h("p", { class: "small text-danger-emphasis fw-semibold mt-2 mb-0", id: "appeal-details-error", hidden: "" }),
          buttons("Continue", false));
        form.addEventListener("submit", (e) => {
          e.preventDefault();
          answers.reason = $('input[name="appeal-reason"]:checked', form).value;
          answers.details = details.value.trim();
          if (!checkFields([[details, answers.details ? "" : "Tell us why you're appealing."]])) return;
          go(2);
        });
        return [heading("Why are you appealing?"), h("p", { class: "small text-body-secondary mb-4" }, "Step 1 of 3"), form];
      }

      function stepTwo() {
        const files = h("input", { class: "form-control", type: "file", id: "appeal-files", multiple: "", accept: ".pdf,.jpg,.jpeg,.png,.heic", "aria-describedby": "appeal-files-hint" });
        const form = h("form", { novalidate: "" },
          h("label", { class: "form-label fw-semibold", for: "appeal-files" }, "Supporting documents (optional)"),
          h("p", { class: "form-text mt-0 mb-2", id: "appeal-files-hint" }, "A prescription or a letter from your doctor helps most. PDFs or photos. In this demo, files aren't uploaded."),
          files,
          answers.files.length ? h("p", { class: "small text-body-secondary mt-2 mb-0" }, `Already added: ${answers.files.join(", ")}`) : null,
          h("fieldset", { class: "mt-4" }, h("legend", { class: "form-label fw-semibold" }, "How should we reach you about it?"),
            h("div", { class: "d-flex flex-wrap column-gap-4 row-gap-2" },
              Object.entries(CONTACT).map(([value, label]) => radio("appeal-contact", value, label)))),
          buttons("Continue"));
        form.addEventListener("submit", (e) => {
          e.preventDefault();
          if (files.files.length) answers.files = [...files.files].map((f) => f.name);
          answers.contact = $('input[name="appeal-contact"]:checked', form).value;
          go(3);
        });
        return [heading("Add details"), h("p", { class: "small text-body-secondary mb-4" }, "Step 2 of 3"), form];
      }

      function stepThree() {
        const confirm = h("input", { class: "form-check-input", type: "checkbox", id: "appeal-confirm" });
        const row = (label, value) => h("div", {}, h("dt", {}, label), h("dd", {}, value));
        const form = h("form", { novalidate: "" },
          h("dl", { class: "acct-dl appeal-review mb-4" },
            row("Claim", `${claim.service}, ${longDate(claim.date)}`),
            row("Reason", REASONS[answers.reason]),
            row("What happened", answers.details),
            row("Documents", answers.files.length ? answers.files.join(", ") : "None"),
            row("We'll reach you by", CONTACT[answers.contact])),
          h("div", { class: "form-check signin-check" }, confirm,
            h("label", { class: "form-check-label", for: "appeal-confirm" }, "What I've told you is true, to the best of my knowledge.")),
          h("p", { class: "small text-danger-emphasis fw-semibold mt-2 mb-0", id: "appeal-confirm-error", hidden: "" }),
          buttons("Send appeal"));
        form.addEventListener("submit", (e) => {
          e.preventDefault();
          if (!checkFields([[confirm, confirm.checked ? "" : "Check the box to confirm before you send."]])) return;
          const saved = store.get(APPEALS) || {};
          saved[claim.id] = { ref: `APL-${claim.number.slice(-6)}`, filed: TODAY, decisionBy: addDays(TODAY, 30), contact: answers.contact };
          store.set(APPEALS, saved);
          step = 4;
          renderStep(true);
          announce("Appeal sent.");
        });
        return [heading("Review and send"), h("p", { class: "small text-body-secondary mb-4" }, "Step 3 of 3. Check your answers; use Back to change anything."), form];
      }

      function done() {
        const a = store.get(APPEALS)[claim.id];
        return [heading("Appeal sent"),
          h("p", { class: "notice notice-success mt-3 mb-4" }, icon("fa-circle-check"), h("span", {}, `We got your appeal for ${claim.service}. Your reference number is ${a.ref}.`)),
          h("dl", { class: "acct-dl mb-4" },
            h("div", {}, h("dt", {}, "Sent"), h("dd", {}, longDate(a.filed))),
            h("div", {}, h("dt", {}, "Decision by"), h("dd", {}, longDate(a.decisionBy))),
            h("div", {}, h("dt", {}, "We'll reach you by"), h("dd", {}, CONTACT[a.contact])),
            h("div", {}, h("dt", {}, "Reference number"), h("dd", {}, a.ref))),
          h("h3", { class: "acct-subtitle mb-2" }, "What happens next"),
          h("ol", { class: "statement-list mb-4" },
            h("li", {}, "A reviewer who wasn't part of the first decision looks at your claim and anything you sent."),
            h("li", {}, "If we need more, we'll ask. You can also send more any time by secure message."),
            h("li", {}, `You'll hear from us by ${longDate(a.decisionBy)}. You don't need to pay the bill for this claim while we review it.`)),
          h("div", { class: "d-flex flex-wrap column-gap-4 row-gap-2" },
            h("a", { class: "link-icon", href: `claim-detail.html?id=${claim.id}` }, "Back to the claim", icon("fa-arrow-right")),
            h("a", { class: "link-icon", href: "messages.html#messages" }, "Message Center", icon("fa-arrow-right")))];
      }

      function renderStep(focus) {
        const content = step === 1 ? stepOne() : step === 2 ? stepTwo() : step === 3 ? stepThree() : done();
        pane().replaceChildren(...(step < 4 ? [progress()] : []), ...content.filter(Boolean));
        if (focus) $("#appeal-step-title").focus();
      }
      function go(n) {
        step = Math.max(1, n);
        renderStep(true);
      }

      function render(data, pageData) {
        claim = pageData.claims.find((c) => c.id === new URLSearchParams(location.search).get("claim"));
        if (!claim || claim.status !== "Not covered") {
          pane().replaceChildren(heading("This claim can't be appealed here"),
            h("p", { class: "mb-3" }, "Appeals are for claims we didn't cover. If something about another claim looks wrong, message us and we'll look into it."),
            h("a", { class: "link-icon", href: "claims.html" }, "Back to claims", icon("fa-arrow-right")));
          $("#appeal-claim-title").closest(".col-lg-4").hidden = true;
          return;
        }
        const who = family.find((p) => p.id === claim.patient);
        setField("appealCrumbClaim", claim.service);
        $("[data-appeal-claim-link]").href = `claim-detail.html?id=${claim.id}`;
        setField("appealFacts", `${claim.service} · ${claim.provider} · ${longDate(claim.date)} · Claim ${claim.number}`);
        setField("appealClaimFor", `For ${who.firstName}, ${longDate(claim.date)}`);
        setField("appealReason", claim.reason);
        renderList("appeal-claim-amounts", [["Billed", money(claim.billed)], ["Plan paid", money(claim.planPaid)], ["You owe", money(claim.youOwe)]]
          .map(([label, value], i) => h("tr", { class: i === 2 ? "is-total" : "" }, h("th", { scope: "row" }, label), h("td", {}, value))));
        step = (store.get(APPEALS) || {})[claim.id] ? 4 : 1;
        renderStep(false);
      }

      return { init() {}, render, onViewing: () => "" };
    })();

    const pages = { home, coverage, claims: claimsPage, claim: claimDetail, eob, findcare: findCare, programs: programsPage, idcards: idcardsPage, messages: messagesPage, help: helpPage, account: accountPage, provider: providerPage, estimate: estimatePage, auth: authPage, appeal: appealPage, behavioral: staticPage, components: staticPage, casestudy: staticPage, prompts: staticPage, notfound: staticPage, accessibility: staticPage };
    // Each page's own data file; ownPrompts: its AI Chat questions replace the shared ones
    const PAGE_DATA = {
      home: { url: "data/claims.json", ownPrompts: false },
      coverage: { url: "data/coverage.json", ownPrompts: true },
      claims: { url: "data/claims.json", ownPrompts: true },
      claim: { url: "data/claims.json", ownPrompts: true },
      eob: { url: "data/claims.json", ownPrompts: true },
      findcare: { url: "data/findcare.json", ownPrompts: true },
      programs: { url: "data/programs.json", ownPrompts: true },
      idcards: { url: "data/idcards.json", ownPrompts: true },
      messages: { url: "data/messages.json", ownPrompts: true },
      help: { url: "data/help.json", ownPrompts: true },
      account: { url: "data/account.json", ownPrompts: true },
      provider: { url: "data/findcare.json", ownPrompts: true },
      behavioral: { url: "data/behavioral.json", ownPrompts: true },
      estimate: { url: ["data/coverage.json", "data/estimate.json"], ownPrompts: true }, // two files: later ones win on shared keys
      auth: { url: "data/coverage.json", ownPrompts: true },
      appeal: { url: "data/claims.json", ownPrompts: true },
    };

    /* AI Chat (mock answers from the data files) ----------------------------- */
    const chatInput = $("#chat-input");
    function renderPrompts(items) {
      renderList("prompts", items.map((item) =>
        h("button", { class: "btn btn-outline-primary btn-sm chip-btn", type: "button", onclick: () => ask(item.prompt) }, item.prompt)));
    }
    // Answer a picked or typed question; focus always ends up in the input
    function ask(question) {
      $('[data-list="prompts"]')?.remove(); // suggestions are a starting point; once a question is asked they go away (d-flex would override [hidden])
      const q = question.toLowerCase();
      const match = chatAnswers.find((item) => item.prompt.toLowerCase() === q || item.keywords.some((k) => q.includes(k)));
      const log = $('[data-list="chat"]');
      log.append(h("p", { class: "chat-bubble chat-bubble-user p-3 mb-0" }, srOnly("You: "), question));
      log.append(h("p", { class: "chat-bubble p-3 mb-0" }, srOnly("AI Chat: "), match ? match.answer : chatFallback));
      log.scrollTop = log.scrollHeight;
      chatInput.focus();
    }
    $("#chat-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const question = chatInput.value.trim();
      if (!question) return;
      chatInput.value = "";
      ask(question);
    });

    /* Dialogs ---------------------------------------------------------------- */
    // Return focus to whatever opened a panel. If the opener is gone or hidden (AI Chat opened from inside
    // the More sheet), use the panel's visible button instead. Not offsetParent (fixed elements like the
    // chat button have none); also skip anything in a closed panel (visibility: hidden).
    const isShown = (el) => el?.isConnected && el.getClientRects().length > 0 && getComputedStyle(el).visibility !== "hidden";
    $$(".offcanvas").forEach((panel) => {
      let opener = null;
      panel.addEventListener("show.bs.offcanvas", (e) => { opener = e.relatedTarget || document.activeElement; });
      panel.addEventListener("hidden.bs.offcanvas", () => {
        const target = isShown(opener) ? opener : $$(`[data-bs-target="#${panel.id}"]`).find(isShown);
        target?.focus();
      });
    });

    // Log out: confirm first, then the sign-in page, which says you're signed out. Staying returns focus to the menu.
    const logoutModal = $("#logout-modal");
    $("#logout-confirm").addEventListener("click", () => { location.href = "signin.html?signed-out"; });
    logoutModal.addEventListener("hidden.bs.modal", () => {
      $(".account-link").focus(); // the menu item that opened it is hidden by now
    });

    /* Placeholder links: say so instead of jumping to the top. Real pages get real hrefs. */
    document.addEventListener("click", (e) => {
      if (!e.target.closest('a[href="#"]')) return;
      e.preventDefault();
      showToast("This page isn't part of the demo yet.");
    });
    function showToast(msg) {
      $("#demo-toast-msg").textContent = msg;
      bootstrap.Toast.getOrCreateInstance($("#demo-toast")).show(); // its container is a polite live region
    }

    /* Reset demo (footer): forget everything the demo remembered (localStorage keys starting th-) and start the story
       over on Home (staying put could undo it: an open message would be read again). Home says it worked. */
    $("[data-reset-demo]").addEventListener("click", () => {
      try {
        Object.keys(localStorage).filter((k) => k.startsWith("th-")).forEach((k) => localStorage.removeItem(k));
        sessionStorage.setItem("th-demo-reset", "1");
      } catch (e) { /* storage blocked: nothing was saved, so there's nothing to reset */ }
      location.href = "index.html";
    });
    try {
      if (sessionStorage.getItem("th-demo-reset")) {
        sessionStorage.removeItem("th-demo-reset");
        showToast("The demo is back to where it started.");
      }
    } catch (e) { /* storage blocked */ }

    /* Bottom nav + More sheet (below 992px) ----------------------------------- */
    // The More sheet belongs to the bottom nav: close it if the window grows to desktop width
    const desktop = matchMedia("(min-width: 992px)");
    const moreSheet = $("#more-sheet");
    // Mark the row for where you are: same page, and the same tab when the link names one (coverage.html#dental)
    // A More link to a spot on this same page (a Coverage tab): close the sheet first, then go there,
    // so the tab doesn't open hidden behind the sheet and focus isn't lost inside it
    moreSheet.addEventListener("click", (e) => {
      const link = e.target.closest(".more-link[href]");
      if (!link || link.getAttribute("href") === "#" || link.pathname !== location.pathname || !link.hash) return;
      e.preventDefault();
      moreSheet.addEventListener("hidden.bs.offcanvas", () => {
        if (location.hash === link.hash) dispatchEvent(new HashChangeEvent("hashchange"));
        else location.hash = link.hash;
      }, { once: true });
      bootstrap.Offcanvas.getOrCreateInstance(moreSheet).hide();
    });
    moreSheet.addEventListener("show.bs.offcanvas", () => {
      $$(".more-link[href]").forEach((link) => {
        const url = new URL(link.href);
        const placeholder = link.getAttribute("href") === "#"; // not a real page yet
        const here = !placeholder && url.pathname === location.pathname && (!url.hash || url.hash === location.hash) && (!url.search || url.search === location.search);
        if (here) link.setAttribute("aria-current", "page");
        else link.removeAttribute("aria-current");
      });
    });
    desktop.addEventListener("change", (e) => {
      if (e.matches && moreSheet.classList.contains("show")) bootstrap.Offcanvas.getOrCreateInstance(moreSheet).hide();
    });

    // Phones: tuck the bottom bar away while scrolling and bring it back once scrolling stops.
    // It stays put near the top and bottom of the page, while it has focus, while the More sheet is open,
    // and always under reduced motion.
    const bottomNav = $(".bottom-nav");
    let scrollIdle;
    window.addEventListener("scroll", () => {
      if (calm || desktop.matches) return;
      const doc = document.documentElement;
      const nearEdge = scrollY < 80 || scrollY + innerHeight > doc.scrollHeight - 80;
      const inUse = bottomNav.contains(document.activeElement) || moreSheet.classList.contains("show");
      document.body.classList.toggle("nav-tucked", !nearEdge && !inUse);
      clearTimeout(scrollIdle);
      scrollIdle = setTimeout(() => document.body.classList.remove("nav-tucked"), 250);
    }, { passive: true });
    bottomNav.addEventListener("focusin", () => document.body.classList.remove("nav-tucked"));

    /* Start: wire up the page, then load the shared data plus the page's own ---- */
    const getJSON = (url) => fetch(url).then((r) => { if (!r.ok) throw new Error(`${url}: ${r.status}`); return r.json(); });
    pages[page].init();
    // A page can need more than one file (the cost estimate): they arrive as one object
    const pageData = (url) => (Array.isArray(url) ? Promise.all(url.map(getJSON)).then((parts) => Object.assign({}, ...parts)) : getJSON(url));
    Promise.all([getJSON("data/member.json"), PAGE_DATA[page] ? pageData(PAGE_DATA[page].url) : null])
      .then(([data, pageData]) => {
        renderShell(data, pageData);
        pages[page].render(data, pageData);
        showLoaded();
      })
      .catch(() => {
        $("#load-error").hidden = false;
        $$("[aria-busy]").forEach((el) => el.removeAttribute("aria-busy"));
        showLoaded();
      });
    // Content held back while loading (data-loading, see css) appears all at once, in its final layout
    function showLoaded() {
      $$("[data-loading]").forEach((el) => { el.removeAttribute("data-loading"); el.removeAttribute("aria-busy"); });
    }
  }
})();
