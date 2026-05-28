/**
 * background.js — Service Worker for Badge Updates
 *
 * Chrome's "always-on" background script for Tab Out.
 * It keeps the toolbar badge showing the current open tab count and opens
 * one Tab Out dashboard per Chrome window from the extension icon.
 *
 * Since we no longer have a server, we query chrome.tabs directly.
 * The badge counts real web tabs (skipping chrome:// and extension pages).
 *
 * Color coding gives a quick at-a-glance health signal:
 *   Green  (#3d7a4a) → 1–10 tabs  (focused, manageable)
 *   Amber  (#b8892e) → 11–20 tabs (getting busy)
 *   Red    (#b35a5a) → 21+ tabs   (time to cull!)
 */

// ─── Badge updater ────────────────────────────────────────────────────────────

function isTabOutPage(tab) {
  const tabOutUrl = chrome.runtime.getURL('index.html');
  const url = tab.url || '';
  return url === tabOutUrl || url.startsWith(`${tabOutUrl}?`) || url.startsWith(`${tabOutUrl}#`);
}

async function openOrFocusTabOut(windowId) {
  const tabs = await chrome.tabs.query({ windowId });
  const tabOutTabs = tabs.filter(isTabOutPage);
  const existing = tabOutTabs.find(t => t.active) || tabOutTabs[0];

  if (existing) {
    const extras = tabOutTabs.filter(t => t.id !== existing.id).map(t => t.id);
    if (extras.length > 0) await chrome.tabs.remove(extras);
    await chrome.tabs.update(existing.id, { active: true });
    await chrome.windows.update(windowId, { focused: true });
    return;
  }

  await chrome.tabs.create({
    windowId,
    url: chrome.runtime.getURL('index.html'),
    active: true,
  });
}

/**
 * updateBadge()
 *
 * Counts open real-web tabs and updates the extension's toolbar badge.
 * "Real" tabs = not chrome://, not extension pages, not about:blank.
 */
async function updateBadge() {
  try {
    const tabs = await chrome.tabs.query({});

    // Only count actual web pages — skip browser internals and extension pages
    const count = tabs.filter(t => {
      const url = t.url || '';
      return (
        !url.startsWith('chrome://') &&
        !url.startsWith('chrome-extension://') &&
        !url.startsWith('about:') &&
        !url.startsWith('edge://') &&
        !url.startsWith('brave://')
      );
    }).length;

    // Don't show "0" — an empty badge is cleaner
    await chrome.action.setBadgeText({ text: count > 0 ? String(count) : '' });

    if (count === 0) return;

    // Pick badge color based on workload level
    let color;
    if (count <= 10) {
      color = '#3d7a4a'; // Green — you're in control
    } else if (count <= 20) {
      color = '#b8892e'; // Amber — things are piling up
    } else {
      color = '#b35a5a'; // Red — time to focus and close some tabs
    }

    await chrome.action.setBadgeBackgroundColor({ color });

  } catch {
    // If something goes wrong, clear the badge rather than show stale data
    chrome.action.setBadgeText({ text: '' });
  }
}

// ─── Event listeners ──────────────────────────────────────────────────────────

chrome.action.onClicked.addListener((tab) => {
  if (tab.windowId == null) return;
  openOrFocusTabOut(tab.windowId);
});

// Update badge when the extension is first installed
chrome.runtime.onInstalled.addListener(() => {
  updateBadge();
});

// Update badge when Chrome starts up
chrome.runtime.onStartup.addListener(() => {
  updateBadge();
});

// Update badge whenever a tab is opened
chrome.tabs.onCreated.addListener(() => {
  updateBadge();
});

// Update badge whenever a tab is closed
chrome.tabs.onRemoved.addListener(() => {
  updateBadge();
});

// Update badge when a tab's URL changes (e.g. navigating to/from chrome://)
chrome.tabs.onUpdated.addListener(() => {
  updateBadge();
});

// ─── Initial run ─────────────────────────────────────────────────────────────

// Run once immediately when the service worker first loads
updateBadge();
