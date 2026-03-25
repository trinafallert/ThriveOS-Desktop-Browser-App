'use client'

import * as React from 'react'
import * as ProgressPrimitive from '@radix-ui/react-progress'
import { cn } from '@/lib/utils'

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
    color?: 'purple' | 'blue' | 'pink' | 'teal' | 'gold' | 'green'
  }
>(({ className, value, color = 'purple', ...props }, ref) => {
  const colorMap = {
    purple: 'bg-thrive-purple',
    blue: 'bg-thrive-blue',
    pink: 'bg-thrive-pink',
    teal: 'bg-thrive-teal',
    gold: 'bg-thrive-gold',
    green: 'bg-green-500',
  }

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn('relative h-2 w-full overflow-hidden rounded-full bg-gray-100', className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn('h-full w-full flex-1 transition-all duration-500 ease-out rounded-full', colorMap[color])}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  )
})
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
