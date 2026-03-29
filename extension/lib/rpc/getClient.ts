// ThriveOS: @browseros/server not available — use untyped Hono client
import { hc } from 'hono/client'
import { getAgentServerUrl } from '../browseros/helpers'

// biome-ignore lint/suspicious/noExplicitAny: server type not available in ThriveOS
export type RpcClient = ReturnType<typeof hc<any>>

let clientPromise: Promise<RpcClient> | null = null

export const getClient = (): Promise<RpcClient> => {
  if (!clientPromise) {
    clientPromise = getAgentServerUrl().then((serverUrl) =>
      // biome-ignore lint/suspicious/noExplicitAny: untyped client
      hc<any>(serverUrl),
    )
  }
  return clientPromise
}

// Pre-resolve the client immediately when the module is imported
getClient()
