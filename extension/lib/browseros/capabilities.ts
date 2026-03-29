/**
 * ThriveOS: Stub capabilities — no chrome.browserOS.* required.
 * Features that need browser automation are disabled.
 * Features that only need the local server are enabled.
 */

export enum Feature {
  OPENAI_COMPATIBLE_SUPPORT = 'OPENAI_COMPATIBLE_SUPPORT',
  MANAGED_MCP_SUPPORT = 'MANAGED_MCP_SUPPORT',
  PERSONALIZATION_SUPPORT = 'PERSONALIZATION_SUPPORT',
  UNIFIED_PORT_SUPPORT = 'UNIFIED_PORT_SUPPORT',
  CUSTOMIZATION_SUPPORT = 'CUSTOMIZATION_SUPPORT',
  WORKSPACE_FOLDER_SUPPORT = 'WORKSPACE_FOLDER_SUPPORT',
  PROXY_SUPPORT = 'PROXY_SUPPORT',
  WORKFLOW_SUPPORT = 'WORKFLOW_SUPPORT',
  PREVIOUS_CONVERSATION_ARRAY = 'PREVIOUS_CONVERSATION_ARRAY',
  SOUL_SUPPORT = 'SOUL_SUPPORT',
  NEWTAB_CHAT_SUPPORT = 'NEWTAB_CHAT_SUPPORT',
  VERTICAL_TABS_SUPPORT = 'VERTICAL_TABS_SUPPORT',
  MEMORY_SUPPORT = 'MEMORY_SUPPORT',
  SKILLS_SUPPORT = 'SKILLS_SUPPORT',
  CHATGPT_PRO_SUPPORT = 'CHATGPT_PRO_SUPPORT',
  GITHUB_COPILOT_SUPPORT = 'GITHUB_COPILOT_SUPPORT',
  QWEN_CODE_SUPPORT = 'QWEN_CODE_SUPPORT',
  CREDITS_SUPPORT = 'CREDITS_SUPPORT',
}

// Features enabled in ThriveOS (server-only, no chrome.browserOS.* needed)
const ENABLED_FEATURES = new Set<Feature>([
  Feature.OPENAI_COMPATIBLE_SUPPORT,
  Feature.PERSONALIZATION_SUPPORT,
  Feature.PREVIOUS_CONVERSATION_ARRAY,
])

export const Capabilities = {
  async supports(feature: Feature): Promise<boolean> {
    return ENABLED_FEATURES.has(feature)
  },
  async getBrowserOSVersion(): Promise<string | null> {
    return null
  },
  async getServerVersion(): Promise<string | null> {
    return null
  },
  async initialize(): Promise<void> {},
  reset(): void {},
}
