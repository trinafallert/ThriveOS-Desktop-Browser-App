/**
 * ThriveOS Startup Tabs
 *
 * On browser startup, ensures the three ThriveOS dashboard tabs are pinned
 * at the top of the vertical tab strip. Pinned tabs always appear before
 * regular tabs in Chromium's vertical tab strip.
 *
 * Visual hierarchy in the left tab strip:
 *   📊 Overview   ← pinned, position 0 (glow highlight)
 *   💼 Bizbox     ← pinned, position 1 (blue glow underline)
 *   🌸 Lifebud    ← pinned, position 2 (pink glow underline)
 *   ─────────────────
 *   [regular user tabs below]
 */

export const THRIVEOS_TABS = [
  {
    name: 'Overview',
    url: 'https://thriveos.app/dashboard',
    index: 0,
  },
  {
    name: 'Bizbox',
    url: 'https://thriveos.app/dashboard/bizbox',
    index: 1,
  },
  {
    name: 'Lifebud',
    url: 'https://thriveos.app/dashboard/lifebud',
    index: 2,
  },
] as const

type ThriveOSTabUrl = (typeof THRIVEOS_TABS)[number]['url']

function isThriveOSUrl(url: string): url is ThriveOSTabUrl {
  return THRIVEOS_TABS.some(
    (t) => url === t.url || url.startsWith(t.url),
  )
}

/**
 * Ensures ThriveOS dashboard tabs are pinned at the top of the tab strip.
 * Called on startup and install.
 */
export async function ensureThriveOSPinnedTabs(): Promise<void> {
  const windows = await chrome.windows.getAll({ populate: true })
  for (const win of windows) {
    if (!win.id || win.type !== 'normal') continue
    await ensurePinnedTabsInWindow(win.id)
  }
}

async function ensurePinnedTabsInWindow(windowId: number): Promise<void> {
  const existingTabs = await chrome.tabs.query({ windowId, pinned: true })

  // Find which ThriveOS tabs already exist as pinned
  const existingThriveOSPinned = existingTabs.filter(
    (t) => t.url && isThriveOSUrl(t.url),
  )
  const existingUrls = new Set(existingThriveOSPinned.map((t) => t.url))

  // Move already-pinned ThriveOS tabs to the correct positions
  for (const tab of existingThriveOSPinned) {
    const def = THRIVEOS_TABS.find(
      (d) => tab.url && tab.url.startsWith(d.url),
    )
    if (def && tab.id != null) {
      await chrome.tabs.move(tab.id, { index: def.index }).catch(() => null)
    }
  }

  // Create any missing ThriveOS tabs as pinned
  for (const def of THRIVEOS_TABS) {
    if (!existingUrls.has(def.url)) {
      await chrome.tabs
        .create({
          url: def.url,
          windowId,
          index: def.index,
          pinned: true,
          active: false,
        })
        .catch(() => null)
    }
  }

  // Group the ThriveOS pinned tabs with a purple ThriveOS label
  await groupThriveOSTabs(windowId)
}

async function groupThriveOSTabs(windowId: number): Promise<void> {
  try {
    const pinnedTabs = await chrome.tabs.query({ windowId, pinned: true })
    const thriveTabs = pinnedTabs.filter(
      (t) => t.url && isThriveOSUrl(t.url) && t.id != null,
    )
    const thriveTabIds = thriveTabs
      .map((t) => t.id)
      .filter((id): id is number => id != null)

    if (thriveTabIds.length === 0) return

    // Check if they're already in a group
    const alreadyGrouped = thriveTabs.filter((t) => (t.groupId ?? -1) >= 0)
    if (alreadyGrouped.length === thriveTabIds.length) return

    // Create a new tab group with ThriveOS purple color
    const groupId = await chrome.tabs.group({ tabIds: thriveTabIds, createProperties: { windowId } })
    await chrome.tabGroups.update(groupId, {
      title: 'ThriveOS',
      color: 'purple',
      collapsed: false,
    })
  } catch {
    // Tab groups API may not be available in all contexts — gracefully skip
  }
}
