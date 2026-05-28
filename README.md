# Tab Out

**Keep tabs on your tabs.**

Tab Out is a Chrome extension that opens a dashboard of everything you have open from the extension icon. Tabs are grouped by domain, with homepages (Gmail, X, LinkedIn, etc.) pulled into their own group. Close tabs with a satisfying swoosh + confetti.

No server. No account. No external API calls. Just a Chrome extension.

---

## Install with a coding agent

Send your coding agent (Claude Code, Codex, etc.) this repo and say **"install this"**:

```
https://github.com/LLLucasXU/tabout-v1.1
```

The agent will walk you through it. Takes about 1 minute.

---

## Features

- **See all your tabs at a glance** on a clean grid, grouped by domain
- **Open from the extension icon** while Chrome's native new tab page stays unchanged
- **One Tab Out dashboard per Chrome window** so repeated icon clicks focus the existing dashboard
- **Homepages group** pulls Gmail inbox, X home, YouTube, LinkedIn, GitHub homepages into one card
- **Close tabs with style** with swoosh sound + confetti burst
- **Duplicate detection** flags when you have the same page open twice, with one-click cleanup
- **Click any tab to jump to it** across windows, no new tab opened
- **Save for later** bookmark tabs to a checklist before closing them
- **Localhost grouping** shows port numbers next to each tab so you can tell your vibe coding projects apart
- **Expandable groups** show the first 8 tabs with a clickable "+N more"
- **100% local** your data never leaves your machine
- **Pure Chrome extension** no server, no Node.js, no npm, no setup beyond loading the extension

---

## Manual Setup

**1. Clone the repo**

```bash
git clone https://github.com/LLLucasXU/tabout-v1.1.git
```

**2. Load the Chrome extension**

1. Open Chrome and go to `chrome://extensions`
2. Enable **Developer mode** (top-right toggle)
3. Click **Load unpacked**
4. Navigate to the `extension/` folder inside the cloned repo and select it

**3. Open Tab Out**

Click the Tab Out extension icon in Chrome's toolbar. Chrome's `+` button still opens the native new tab page.

---

## How it works

```
You click the Tab Out extension icon
  -> Tab Out shows your open tabs grouped by domain
  -> If this window already has Tab Out open, Chrome focuses that tab
  -> Homepages (Gmail, X, etc.) get their own group at the top
  -> Click any tab title to jump to it
  -> Close groups you're done with (swoosh + confetti)
  -> Save tabs for later before closing them
```

Everything runs inside the Chrome extension. No external server, no API calls, no data sent anywhere. Saved tabs are stored in `chrome.storage.local`.

---

## Tech stack

| What | How |
|------|-----|
| Extension | Chrome Manifest V3 |
| Storage | chrome.storage.local |
| Sound | Web Audio API (synthesized, no files) |
| Animations | CSS transitions + JS confetti particles |

---

## License

MIT

---

## Credits

Original Tab Out was built by [Zara](https://x.com/zarazhangrui).

This v1.1 version was modified by Lucas to adjust the product logic:
- Tab Out opens from the extension icon instead of replacing Chrome's new tab page
- Chrome's native `+` new tab behavior is preserved
- Each Chrome window keeps at most one Tab Out dashboard, and repeated icon clicks focus the existing dashboard
