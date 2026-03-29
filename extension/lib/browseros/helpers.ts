/**
 * ThriveOS: Always connect to local agent server on port 3747.
 * No chrome.browserOS.* pref lookups needed.
 */
const THRIVEOS_AGENT_PORT = 3747

export class AgentPortError extends Error {
  constructor() {
    super('Agent server port not configured.')
    this.name = 'AgentPortError'
  }
}

export class McpPortError extends Error {
  constructor() {
    super('MCP server port not configured.')
    this.name = 'McpPortError'
  }
}

export class ProxyPortError extends Error {
  constructor() {
    super('Proxy server port not configured.')
    this.name = 'ProxyPortError'
  }
}

export async function getAgentServerUrl(): Promise<string> {
  return `http://127.0.0.1:${THRIVEOS_AGENT_PORT}`
}

export async function getMcpServerUrl(): Promise<string> {
  return `http://127.0.0.1:${THRIVEOS_AGENT_PORT}/mcp`
}

export async function getProxyServerUrl(): Promise<string> {
  return `http://127.0.0.1:${THRIVEOS_AGENT_PORT}`
}

export async function getHealthCheckUrl(): Promise<string> {
  return `http://127.0.0.1:${THRIVEOS_AGENT_PORT}/health`
}
