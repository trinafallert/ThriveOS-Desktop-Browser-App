/**
 * ThriveOS stub: chrome.browserOS.* APIs are not available in Electron.
 * All methods are no-ops or throw "not available" so callers can handle gracefully.
 */

export type PrefObject = { value: unknown }
export type SelectedPath = { path: string }
export type ChoosePathOptions = { title?: string }
export type InteractiveNode = { id: number; text?: string }
export type InteractiveSnapshot = { nodes: InteractiveNode[] }
export type InteractiveSnapshotOptions = { maxDepth?: number }
export type InteractiveNodeType = string
export type PageLoadStatus = string
export type Rect = { x: number; y: number; width: number; height: number }
export type Key = string
export type AccessibilityTree = { nodes: unknown[] }
export type SnapshotItem = { id: string }
export type Snapshot = { items: SnapshotItem[] }
export type SnapshotOptions = Record<string, unknown>
export type SnapshotContext = Record<string, unknown>
export type SelectionType = string

export const SCREENSHOT_SIZES = {
  small: 512,
  medium: 768,
  large: 1028,
} as const
export type ScreenshotSizeKey = keyof typeof SCREENSHOT_SIZES

const notAvailable = (method: string) => {
  throw new Error(`chrome.browserOS.${method} is not available in ThriveOS`)
}

class ThriveOSAdapter {
  private static instance: ThriveOSAdapter | null = null
  static getInstance() {
    if (!ThriveOSAdapter.instance) ThriveOSAdapter.instance = new ThriveOSAdapter()
    return ThriveOSAdapter.instance
  }

  async getPref(_name: string): Promise<PrefObject> { return notAvailable('getPref') }
  async setPref(_name: string, _value: unknown): Promise<void> { return notAvailable('setPref') }
  async getVersion(): Promise<string | null> { return null }
  async getBrowserosVersion(): Promise<string | null> { return null }
  async getInteractiveSnapshot(): Promise<InteractiveSnapshot> { return notAvailable('getInteractiveSnapshot') }
  async click(): Promise<void> { return notAvailable('click') }
  async inputText(): Promise<void> { return notAvailable('inputText') }
  async clear(): Promise<void> { return notAvailable('clear') }
  async scrollToNode(): Promise<boolean> { return notAvailable('scrollToNode') }
  async takeScreenshot(): Promise<string> { return notAvailable('takeScreenshot') }
  async getAccessibilityTree(): Promise<AccessibilityTree> { return notAvailable('getAccessibilityTree') }
  async choosePath(_options?: ChoosePathOptions): Promise<SelectedPath | null> { return null }
  isAPIAvailable(_method: string): boolean { return false }
  getAvailableAPIs(): string[] { return [] }
}

export class BrowserOSAdapter extends ThriveOSAdapter {}
export const getBrowserOSAdapter = () => ThriveOSAdapter.getInstance()
