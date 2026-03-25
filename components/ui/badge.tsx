import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-thrive-purple text-white',
        secondary: 'border-transparent bg-secondary text-secondary-foreground',
        destructive: 'border-transparent bg-destructive text-destructive-foreground',
        outline: 'text-foreground',
        purple: 'border-transparent bg-thrive-purple-soft text-thrive-purple',
        blue: 'border-transparent bg-thrive-blue-soft text-thrive-blue',
        pink: 'border-transparent bg-thrive-pink-soft text-thrive-pink',
        teal: 'border-transparent bg-thrive-teal-light text-thrive-teal',
        gold: 'border-transparent bg-thrive-gold-light text-thrive-gold',
        green: 'border-transparent bg-green-50 text-green-700',
        red: 'border-transparent bg-red-50 text-red-700',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
