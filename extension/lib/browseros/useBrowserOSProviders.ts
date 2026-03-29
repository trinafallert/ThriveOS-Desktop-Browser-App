/**
 * ThriveOS: Return fixed local server URL immediately, no loading state.
 */
import { THRIVEOS_AGENT_PORT } from './helpers'

interface UseAgentServerUrlResult {
  baseUrl: string | null
  isLoading: boolean
  error: Error | null
}

export function useAgentServerUrl(): UseAgentServerUrlResult {
  return {
    baseUrl: `http://127.0.0.1:${THRIVEOS_AGENT_PORT}`,
    isLoading: false,
    error: null,
  }
}
