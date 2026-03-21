import * as Sentry from '@sentry/react'
import { getThriveOSAdapter } from '../browseros/adapter'
import { env } from '../env'

if (env.VITE_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: env.VITE_PUBLIC_SENTRY_DSN,
    // Setting this option to true will send default PII data to Sentry.
    // For example, automatic IP address collection on events
    sendDefaultPii: true,
    environment: env.PROD ? 'production' : 'development',
    release: chrome.runtime.getManifest().version,
  })

  ;(async () => {
    const adapter = getThriveOSAdapter()
    const chromiumVersion = await adapter.getVersion()
    const browserOSVersion = await adapter.getBrowserosVersion()
    Sentry.setTag('chromiumVersion', chromiumVersion)
    Sentry.setTag('browserOSVersion', browserOSVersion)
  })()
}

/**
 * @public
 */
export const sentry = Sentry
