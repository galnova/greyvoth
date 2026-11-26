## Changing existing pages

When changing an existing page, preserve established global layouts, navigation, shared components, design tokens and behavior. Follow existing repository patterns rather than introducing page-specific alternatives unless necessary.

Do not change shared components or global styles unless the task explicitly requires it. If a necessary change could affect other pages, explain the impact and ask for approval before proceeding.

## Agent review

Agent review setting: OFF

**How it works**
- ON: after any HTML, CSS or JS edit, run the three agents below, one at a time and in this order, on the changed files only. Apply their fixes and summarize what each one found.
- OFF: don't run them unless the user asks.
- Re-read the setting line from disk before each task, since the user may have changed it.
- One request only: "run the agent review" or "skip the agent review" in the chat overrides the setting for that request.

**Agents**
1. ui-structure: page organization and duplication
2. ui-design-system: consistency with shared styles
3. ui-accessibility: keyboard use, screen readers and contrast

**When to use**
- Turn ON for: new pages or components, layout changes, shared CSS/JS or navigation, and a final check before handoff.
- Leave OFF for: small edits like adding a button, changing copy or tweaking a color.

**To switch:** change ON or OFF on the setting line above. Default is OFF.