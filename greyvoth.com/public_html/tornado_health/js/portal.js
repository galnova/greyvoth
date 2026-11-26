/* Tornado Health member portal: one script for every page.
   The shared shell (account menu counts, family switcher, AI Chat, dialogs, placeholder links,
   bottom nav) runs everywhere. Page sections run only on their own page (<body data-page="...">).
   Sections: helpers, state, shell, home page, coverage page, AI Chat, dialogs, placeholder links,
   bottom nav + More sheet, start. No dependencies beyond Bootstrap. */
(() => {
  "use strict";

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
  const badge = (tone, text) => h("span", { class: `badge badge-${tone}` }, h("span", {}, text)); // solid status color, white text; label wrapped so it can be trimmed (css)

  const renderList = (name, items) => {
    const list = $(`[data-list="${name}"]`);
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

  /* Shell: everything every page shows ------------------------------------ */
  setField("today", new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }));
  setField("year", String(new Date().getFullYear())); // footer: always the current year
  // Band chips scroll sideways on phones: bring a focused chip (and its ring) fully into view.
  // Browsers leave a chip alone if part of it already shows.
  $$(".band-chips").forEach((row) => row.addEventListener("focusin", (e) => e.target.scrollIntoView({ block: "nearest", inline: "nearest" })));

  const renderShell = (data, pageData) => {
    const { member } = data;
    setField("initials", member.initials);
    setField("msgCount", String(data.inbox.messages));
    setField("noteCount", String(data.inbox.notifications));
    setField("alertTotal", String(data.inbox.messages + data.inbox.notifications));
    setField("planName", member.planName);

    family = data.family;
    setField("viewingName", family[0].firstName);
    renderFamily();

    // AI Chat: the page's own questions come first; answers can come from either list
    chatAnswers = [...(pageData?.assistant || []), ...data.assistant];
    chatFallback = data.assistantFallback || chatFallback;
    renderPrompts(pageData?.assistant || data.assistant);
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

  /* Home page ------------------------------------------------------------- */
  const home = (() => {
    let claims = [];
    let recs = [];

    // The action block: a compact strip with the single task Roy must do and the page's only primary button
    const actionBlock = (a) => [
      h("div", { class: "flex-grow-1" },
        h("p", { class: "mb-1" }, h("span", { class: "badge action-badge" }, icon("fa-circle-exclamation"), h("span", {}, "Action needed"))),
        h("h3", { class: "mb-1", id: "action-title" }, a.title),
        h("p", { class: "small text-body-secondary mb-0 text-measure" }, a.detail)),
      h("a", { class: "btn btn-primary d-inline-flex align-items-center justify-content-center gap-2 px-4 flex-shrink-0", href: a.action.href },
        a.action.label, srOnly(`: ${a.title}`), icon("fa-arrow-right"))];
    const allClear = () => [
      h("div", { class: "flex-grow-1" },
        h("p", { class: "mb-1" }, badge("success", "All clear")),
        h("h3", { class: "mb-0", id: "action-title" }, "Nothing needs your action right now"))];

    // Updates: in progress, nothing to do yet. Quieter than the action strip.
    const updateRow = (a) => h("li", { class: "list-group-item update-row" },
      h("span", { class: `icon-chip bg-${a.tone}-subtle text-${a.tone}-emphasis`, "aria-hidden": "true" }, icon(a.icon)),
      h("div", {},
        h("a", { class: "link-icon", href: a.action.href }, a.title),
        h("p", { class: "small text-body-secondary mb-0" }, a.short)));

    // Claim row: service and provider, date, amount, status (aligned columns from 768px)
    const claimRow = (c) => h("li", { class: "list-group-item claim-row" },
      h("div", {},
        h("p", { class: "fw-semibold mb-0" }, c.service),
        h("p", { class: "small text-body-secondary mb-0" }, c.provider, h("span", { class: "d-md-none" }, ` · ${shortDate(c.date)}`))),
      h("span", { class: "small text-body-secondary d-none d-md-block" }, shortDate(c.date)),
      h("span", { class: "claim-amount text-end" }, `You owe ${money(c.youOwe)}`),
      h("span", { class: "text-end" }, badge(c.tone, c.status)));

    function renderClaims() {
      const p = person();
      $("#claims-title").textContent = p.relation === "You" ? "Recent claims" : `${p.firstName}'s recent claims`;
      const rows = claims.filter((c) => c.patient === viewing).slice(0, 3).map(claimRow);
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

      // Find a doctor (mock search)
      const findInput = $("#find-q");
      const findError = $("#find-error");
      const findStatus = $("#find-status");
      const setFindError = (on) => {
        findError.hidden = !on;
        findInput.classList.toggle("is-invalid", on);
        if (on) findInput.setAttribute("aria-invalid", "true");
        else findInput.removeAttribute("aria-invalid");
      };
      const search = (q) => {
        setFindError(false);
        findStatus.textContent = `Demo: this would list in-network results for "${q}" near your home address.`;
      };
      $("#find-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const q = findInput.value.trim();
        if (!q) {
          findStatus.textContent = "";
          setFindError(true);
          findInput.focus();
          return;
        }
        search(q);
      });
      $$("[data-find]").forEach((btn) => btn.addEventListener("click", () => {
        findInput.value = btn.dataset.find;
        search(btn.dataset.find);
      }));
    }

    function render(data) {
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

      claims = data.claims;
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
        h("p", { class: "fw-semibold mb-0" }, a.title),
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

  const pages = { home, coverage };
  const PAGE_DATA = { coverage: "data/coverage.json" };

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

  // Log out: confirm first, then show the logged-out state. Closing resets it.
  const logoutModal = $("#logout-modal");
  const confirmStep = $('[data-step="confirm"]');
  const doneStep = $('[data-step="done"]');
  $("#logout-confirm").addEventListener("click", () => {
    confirmStep.hidden = true;
    doneStep.hidden = false;
    logoutModal.setAttribute("aria-labelledby", "logout-done-title");
    $("#logout-done-btn").focus();
  });
  logoutModal.addEventListener("hidden.bs.modal", () => {
    confirmStep.hidden = false;
    doneStep.hidden = true;
    logoutModal.setAttribute("aria-labelledby", "logout-title");
    $(".account-link").focus(); // the menu item that opened it is hidden by now
  });

  /* Placeholder links: say so instead of jumping to the top. Real pages get real hrefs. */
  document.addEventListener("click", (e) => {
    if (!e.target.closest('a[href="#"]')) return;
    e.preventDefault();
    const msg = "This page isn't part of the demo yet.";
    $("#demo-toast-msg").textContent = msg;
    bootstrap.Toast.getOrCreateInstance($("#demo-toast")).show(); // its container is a polite live region
  });

  /* Bottom nav + More sheet (below 992px) ----------------------------------- */
  // The More sheet belongs to the bottom nav: close it if the window grows to desktop width
  const desktop = matchMedia("(min-width: 992px)");
  const moreSheet = $("#more-sheet");
  // Mark the row for where you are: same page, and the same tab when the link names one (coverage.html#dental)
  moreSheet.addEventListener("show.bs.offcanvas", () => {
    $$(".more-link[href]").forEach((link) => {
      const url = new URL(link.href);
      const placeholder = link.getAttribute("href") === "#"; // not a real page yet
      const here = !placeholder && url.pathname === location.pathname && (!url.hash || url.hash === location.hash);
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
  Promise.all([getJSON("data/member.json"), PAGE_DATA[page] ? getJSON(PAGE_DATA[page]) : null])
    .then(([data, pageData]) => {
      renderShell(data, pageData);
      pages[page].render(data, pageData);
    })
    .catch(() => {
      $("#load-error").hidden = false;
      $$("[aria-busy]").forEach((el) => el.removeAttribute("aria-busy"));
    });
})();
