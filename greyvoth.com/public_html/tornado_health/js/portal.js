/* Tornado Health member portal: homepage behavior.
   Sections: helpers, data + rendering, ID card actions, recommendations,
   family switcher, find a doctor, assistant, dialogs, placeholder links. No dependencies beyond Bootstrap. */
(() => {
  "use strict";

  /* Helpers -------------------------------------------------------------- */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const money = (n) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
  const shortDate = (iso) => new Date(`${iso}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" });

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
  const badge = (tone, text) => h("span", { class: `badge bg-${tone}-subtle text-${tone}-emphasis` }, text);

  /* Greeting (local time) ------------------------------------------------ */
  const hour = new Date().getHours();
  const partOfDay = hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";
  setField("today", new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }));

  /* Data + rendering ----------------------------------------------------- */
  // Meters fill from zero once on load (skipped for reduced motion). Ease-out-quart, 700ms.
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fillMeter = (meter, value) => {
    if (calm) { meter.value = value; return; }
    const start = performance.now();
    const step = (now) => {
      const t = Math.min((now - start) / 700, 1);
      meter.value = value * (1 - (1 - t) ** 4);
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const renderList = (name, items) => {
    const list = $(`[data-list="${name}"]`);
    list.replaceChildren(...items);
    list.removeAttribute("aria-busy");
    return list;
  };

  // The action block: a compact strip with the single task Roy must do and the page's only primary button
  const actionBlock = (a) => [
    h("div", { class: "flex-grow-1" },
      h("p", { class: "mb-1" }, h("span", { class: "badge action-badge" }, icon("fa-circle-exclamation"), "Action needed")),
      h("h3", { class: "mb-1", id: "action-title" }, a.title),
      h("p", { class: "small text-body-secondary mb-0 text-measure" }, a.detail)),
    h("a", { class: "btn btn-primary d-inline-flex align-items-center justify-content-center gap-2 px-4 flex-shrink-0", href: a.action.href },
      a.action.label, srOnly(`: ${a.title}`), icon("fa-arrow-right"))];
  const allClear = () => [
    h("div", { class: "flex-grow-1" },
      h("p", { class: "mb-1" }, badge("success", "All clear")),
      h("h3", { class: "mb-0", id: "action-title" }, "Nothing needs your action right now"))];

  // Updates: in progress, nothing to do yet. Quieter than the action strip.
  const updateItem = (a) => h("li", { class: "list-group-item update-row" },
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
    h("span", { class: "claim-amount text-md-end" }, `You owe ${money(c.youOwe)}`),
    h("span", { class: "text-md-end" }, badge(c.tone, c.status)));

  const render = (data) => {
    const { member, plan } = data;
    const year = member.planYear.start.slice(0, 4);

    $("#greeting").replaceChildren(`Good ${partOfDay}, `, h("span", { "data-field": "firstName" }, member.firstName));
    setField("initials", member.initials);
    setField("msgCount", String(data.inbox.messages));
    setField("noteCount", String(data.inbox.notifications));
    setField("alertTotal", String(data.inbox.messages + data.inbox.notifications));
    setField("planName", member.planName);
    setField("planYearShort", `Plan year ${year}`);
    setField("fullName", `${member.firstName} ${member.lastName}`);
    setField("memberId", member.memberId);
    setField("rxBin", member.rx.bin);
    setField("rxPcn", member.rx.pcn);

    // Plan at a glance: big number, "of" limit, meter, and a text equivalent
    [["deductible", "ded"], ["outOfPocket", "oop"]].forEach(([key, prefix]) => {
      const { spent, limit } = plan[key];
      const meter = $(`[data-meter="${key}"]`);
      meter.max = limit;
      fillMeter(meter, spent);
      setField(`${prefix}Spent`, money(spent));
      setField(`${prefix}Limit`, money(limit));
      setField(`${prefix}Help`, key === "deductible"
        ? `${money(limit - spent)} left before your plan pays more.`
        : `${money(limit - spent)} left. After that, covered care is $0.`);
    });

    // Priority: action needed first; everything else is an update
    const actions = data.attention.filter((a) => a.actionNeeded);
    const updates = data.attention.filter((a) => !a.actionNeeded);
    setField("todoCount", actions.length ? `${actions.length} ${actions.length === 1 ? "thing" : "things"} to do` : "Nothing to do");
    setField("dedLeft", `${money(plan.deductible.limit - plan.deductible.spent)} left on your deductible`);
    renderList("action", actions.length ? actionBlock(actions[0]) : allClear());
    renderList("updates", updates.length ? updates.map(updateItem) : [h("li", { class: "list-group-item small text-body-secondary" }, "No new updates.")]);

    family = data.family;
    allClaims = data.claims;
    setField("viewingName", family[0].firstName);
    renderFamily();
    renderClaims();
    renderRecommendations(data.recommendations);
    assistantData = data;
    renderPrompts(data.assistant);
  };

  /* Family member switcher: changes whose claims show ---------------------- */
  let family = [];
  let allClaims = [];
  let viewing = "roy";
  function renderClaims() {
    const person = family.find((p) => p.id === viewing);
    $("#claims-title").textContent = person.relation === "You" ? "Recent claims" : `${person.firstName}'s recent claims`;
    const rows = allClaims.filter((c) => c.patient === viewing).slice(0, 3).map(claimRow);
    renderList("claims", rows.length ? rows : [h("li", { class: "list-group-item small text-body-secondary" }, `No recent claims for ${person.firstName}.`)]);
  }
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
    renderClaims();
    announce(`Now viewing ${p.firstName}. Recent claims updated.`);
    $(".member-switch").focus();
  }

  fetch("data/member.json")
    .then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(render)
    .catch(() => {
      $("#load-error").classList.remove("d-none");
      $$("[aria-busy]").forEach((el) => el.removeAttribute("aria-busy"));
    });

  /* ID card actions (mock) ------------------------------------------------ */
  const idMessages = {
    download: "Your ID card is ready. In this demo, nothing is downloaded.",
    wallet: "Added to your phone's wallet. In this demo, nothing is saved.",
  };
  $$("[data-id-action]").forEach((btn) => btn.addEventListener("click", () => {
    $("#id-status").textContent = idMessages[btn.dataset.idAction];
  }));

  /* Recommendations: max 2 shown, dismiss is remembered -------------------- */
  const DISMISSED = "th-dismissed-recs";
  let allRecs = [];
  function renderRecommendations(all) {
    allRecs = all;
    const dismissed = store.get(DISMISSED) || [];
    const visible = all.filter((r) => !dismissed.includes(r.id)).slice(0, 2);
    renderList("recommendations", visible.map(recCard));
    // Nothing left to suggest: the whole card goes away
    $('[aria-labelledby="rec-title"]').hidden = !visible.length;
  }
  // "For you": one line each, a short reason, and a dismiss button
  const recCard = (r) => h("li", { class: "list-group-item d-flex align-items-start gap-2", id: `rec-${r.id}` },
    h("div", { class: "flex-grow-1" },
      h("a", { class: "link-icon", href: r.action.href }, r.title, icon("fa-arrow-right")),
      h("p", { class: "small text-body-secondary mb-0" }, r.why)),
    h("button", { class: "btn btn-link link-icon tap-target text-body-secondary p-0", type: "button", "aria-label": `Dismiss ${r.title}`, onclick: () => dismissRec(r) }, icon("fa-xmark")));

  function dismissRec(r) {
    const dismissed = store.get(DISMISSED) || [];
    store.set(DISMISSED, [...new Set([...dismissed, r.id])]);
    renderRecommendations(allRecs);
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

  /* Find a doctor (mock search) ------------------------------------------- */
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

  /* Assistant (mock answers from member.json) ------------------------------ */
  let assistantData = null;
  function renderPrompts(items) {
    renderList("prompts", items.map((item) =>
      h("button", { class: "btn btn-outline-primary btn-sm chat-chip", type: "button", onclick: () => ask(item.prompt) }, item.prompt)));
  }
  function ask(question) {
    const q = question.toLowerCase();
    const match = assistantData?.assistant.find((item) => item.prompt.toLowerCase() === q || item.keywords.some((k) => q.includes(k)));
    const answer = match ? match.answer : assistantData?.assistantFallback || "I can't answer right now.";
    const log = $('[data-list="chat"]');
    log.append(h("p", { class: "align-self-end bg-primary-subtle text-primary-emphasis rounded-3 p-3 mb-0" }, srOnly("You: "), question));
    log.append(h("p", { class: "bg-body-tertiary rounded-3 p-3 mb-0" }, srOnly("AI Chat: "), answer));
    log.scrollTop = log.scrollHeight;
  }
  $("#chat-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const input = $("#chat-input");
    const question = input.value.trim();
    if (!question) return;
    ask(question);
    input.value = "";
    input.focus();
  });

  /* Dialogs ---------------------------------------------------------------- */
  // Return focus to whatever opened a panel
  $$(".offcanvas").forEach((panel) => {
    let opener = null;
    panel.addEventListener("show.bs.offcanvas", (e) => { opener = e.relatedTarget || document.activeElement; });
    panel.addEventListener("hidden.bs.offcanvas", () => { opener?.isConnected && opener.offsetParent && opener.focus(); });
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

  // Placeholder links: say so instead of jumping to the top. Real pages get real hrefs.
  document.addEventListener("click", (e) => {
    if (!e.target.closest('a[href="#"]')) return;
    e.preventDefault();
    const msg = "This page isn't part of the demo ... yet.";
    $("#demo-toast-msg").textContent = msg;
    bootstrap.Toast.getOrCreateInstance($("#demo-toast")).show(); // its container is a polite live region
  });

  // The More sheet belongs to the bottom nav: close it if the window grows to desktop width
  const desktop = matchMedia("(min-width: 992px)");
  desktop.addEventListener("change", (e) => {
    if (!e.matches) return;
    const sheet = $("#more-sheet");
    if (sheet.classList.contains("show")) bootstrap.Offcanvas.getOrCreateInstance(sheet).hide();
  });
})();
