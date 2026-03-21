/**
 * @license
 * Copyright 2025 ThriveOS
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import { z } from 'zod'

import { ActionHandler } from '../ActionHandler'

// Input schema - no input needed
const CheckThriveOSInputSchema = z.any()

// Output schema
const CheckThriveOSOutputSchema = z.object({
  available: z.boolean(),
  apis: z.array(z.string()).optional(),
  error: z.string().optional(),
})

type CheckThriveOSInput = z.infer<typeof CheckThriveOSInputSchema>
type CheckThriveOSOutput = z.infer<typeof CheckThriveOSOutputSchema>

/**
 * CheckThriveOSAction - Diagnostic action to check if chrome.browserOS is available
 *
 * This action checks:
 * 1. Whether chrome.browserOS namespace exists
 * 2. What APIs are available in the namespace
 * 3. Returns detailed diagnostic information
 */
export class CheckThriveOSAction extends ActionHandler<
  CheckThriveOSInput,
  CheckThriveOSOutput
> {
  readonly inputSchema = CheckThriveOSInputSchema

  async execute(_input: CheckThriveOSInput): Promise<CheckThriveOSOutput> {
    try {
      console.log('[CheckThriveOSAction] Starting diagnostic...')
      console.log('[CheckThriveOSAction] typeof chrome:', typeof chrome)
      console.log('[CheckThriveOSAction] chrome exists:', chrome !== undefined)

      // Check if chrome.browserOS exists
      const browserOSExists = typeof chrome.browserOS !== 'undefined'
      console.log(
        '[CheckThriveOSAction] typeof chrome.browserOS:',
        typeof chrome.browserOS,
      )
      console.log('[CheckThriveOSAction] browserOSExists:', browserOSExists)

      if (!browserOSExists) {
        console.log('[CheckThriveOSAction] chrome.browserOS is NOT available')
        return {
          available: false,
          error:
            'chrome.browserOS is undefined - not running in ThriveOS Chrome',
        }
      }

      // Get available APIs
      const apis: string[] = []
      const browserOS = chrome.browserOS as Record<string, unknown>

      for (const key in browserOS) {
        if (typeof browserOS[key] === 'function') {
          apis.push(key)
        }
      }

      console.log('[CheckThriveOSAction] Found APIs:', apis)

      return {
        available: true,
        apis: apis.sort(),
      }
    } catch (error) {
      console.error('[CheckThriveOSAction] Error during diagnostic:', error)
      const errorMsg =
        error instanceof Error
          ? error.message
          : error
            ? String(error)
            : 'Unknown error'
      return {
        available: false,
        error: errorMsg,
      }
    }
  }
}
