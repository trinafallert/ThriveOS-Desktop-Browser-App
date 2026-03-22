import { BarChart3, Heart, LayoutDashboard } from 'lucide-react'
import type { FC } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

interface ThriveOSPinnedTabsProps {
  expanded?: boolean
}

type ThriveOSTab = {
  name: string
  url: string
  icon: typeof LayoutDashboard
  variant: 'overview' | 'bizbox' | 'lifebud'
}

const thriveOSTabs: ThriveOSTab[] = [
  {
    name: 'Overview',
    url: 'https://thriveos.app/dashboard',
    icon: LayoutDashboard,
    variant: 'overview',
  },
  {
    name: 'Bizbox',
    url: 'https://thriveos.app/dashboard/bizbox',
    icon: BarChart3,
    variant: 'bizbox',
  },
  {
    name: 'Lifebud',
    url: 'https://thriveos.app/dashboard/lifebud',
    icon: Heart,
    variant: 'lifebud',
  },
]

function openThriveOSTab(url: string) {
  if (typeof chrome !== 'undefined' && chrome.tabs?.create) {
    // Extension context — open in a real browser tab
    chrome.tabs.query({ url: `${new URL(url).origin}${new URL(url).pathname}*` }, (tabs) => {
      if (tabs.length > 0 && tabs[0].id != null) {
        chrome.tabs.update(tabs[0].id, { active: true })
      } else {
        chrome.tabs.create({ url })
      }
    })
  } else {
    window.open(url, '_blank', 'noopener,noreferrer')
  }
}

export const ThriveOSPinnedTabs: FC<ThriveOSPinnedTabsProps> = ({
  expanded = true,
}) => {
  return (
    <TooltipProvider delayDuration={0}>
      <div className="px-2 pt-2 pb-1">
        {/* Section label */}
        {expanded && (
          <div className="mb-1.5 px-3">
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
              ThriveOS
            </span>
          </div>
        )}

        <nav className="space-y-0.5">
          {thriveOSTabs.map((tab) => {
            const Icon = tab.icon
            const button = (
              <button
                type="button"
                onClick={() => openThriveOSTab(tab.url)}
                style={getTabStyle(tab.variant)}
                className={cn(
                  'relative flex h-9 w-full items-center gap-2 overflow-hidden whitespace-nowrap rounded-md px-3 font-medium text-sm transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                  tab.variant === 'overview' && 'text-violet-400 dark:text-violet-300',
                  (tab.variant === 'bizbox' || tab.variant === 'lifebud') && 'text-sidebar-foreground',
                )}
              >
                <Icon
                  className={cn(
                    'size-4 shrink-0',
                    tab.variant === 'overview' && 'text-violet-400 dark:text-violet-300',
                    tab.variant === 'bizbox' && 'text-blue-400',
                    tab.variant === 'lifebud' && 'text-pink-400',
                  )}
                />
                <span
                  className={cn(
                    'truncate transition-opacity duration-200',
                    expanded ? 'opacity-100' : 'opacity-0',
                  )}
                >
                  {tab.name}
                </span>

                {/* Glow underliner for Bizbox and Lifebud */}
                {tab.variant === 'bizbox' && (
                  <span
                    className="pointer-events-none absolute bottom-0 left-2 right-2 h-px rounded-full"
                    style={{
                      background: 'rgba(147, 197, 253, 0.9)',
                      boxShadow: '0 0 6px 1px rgba(147, 197, 253, 0.7)',
                    }}
                  />
                )}
                {tab.variant === 'lifebud' && (
                  <span
                    className="pointer-events-none absolute bottom-0 left-2 right-2 h-px rounded-full"
                    style={{
                      background: 'rgba(249, 168, 212, 0.9)',
                      boxShadow: '0 0 6px 1px rgba(249, 168, 212, 0.7)',
                    }}
                  />
                )}
              </button>
            )

            if (!expanded) {
              return (
                <Tooltip key={tab.name}>
                  <TooltipTrigger asChild>{button}</TooltipTrigger>
                  <TooltipContent side="right">{tab.name}</TooltipContent>
                </Tooltip>
              )
            }

            return <div key={tab.name}>{button}</div>
          })}
        </nav>

        {/* Divider separating ThriveOS tabs from regular nav */}
        <div className="mx-3 mt-2 h-px bg-border/50" />
      </div>
    </TooltipProvider>
  )
}

function getTabStyle(variant: ThriveOSTab['variant']): React.CSSProperties {
  if (variant === 'overview') {
    return {
      boxShadow:
        '0 0 0 1px rgba(167, 139, 250, 0.35), 0 0 10px 1px rgba(167, 139, 250, 0.15)',
      background: 'rgba(167, 139, 250, 0.06)',
    }
  }
  return {}
}
