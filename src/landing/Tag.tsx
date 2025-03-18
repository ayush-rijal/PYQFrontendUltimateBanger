
import React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const tagVariants = cva(
  "inline-flex items-center gap-1 rounded-full text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20",
        accent: "bg-accent/80 text-accent-foreground hover:bg-accent border border-accent/20",
        secondary: "bg-secondary/10 text-secondary-foreground hover:bg-secondary/20 border border-secondary/20",
        destructive: "bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/20",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        success: "bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500/20 border border-green-500/20",
        info: "bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 border border-blue-500/20",
        warning:
          "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-500/20 border border-yellow-500/20",
      },
      size: {
        sm: "px-2 py-0.5 text-[10px]",
        md: "px-2.5 py-0.5",
        lg: "px-4 py-2",
      },
      withIcon: {
        true: "",
        false: "",
      },
      uppercase: {
        true: "uppercase tracking-wide",
        false: "",
      },
      interactive: {
        true: "cursor-pointer active:scale-95",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      withIcon: false,
      uppercase: false,
      interactive: false,
    },
    compoundVariants: [
      {
        withIcon: true,
        size: "sm",
        class: "pl-1.5",
      },
      {
        withIcon: true,
        size: "md",
        class: "pl-2",
      },
      {
        withIcon: true,
        size: "lg",
        class: "pl-2.5",
      },
    ],
  },
)

export interface TagProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof tagVariants> {
  icon?: React.ReactNode
  onRemove?: () => void
}

const Tag = React.forwardRef<HTMLDivElement, TagProps>(
  ({ className, variant, size, uppercase, interactive, icon, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(tagVariants({ variant, size, withIcon: !!icon, uppercase, interactive }), className)}
        {...props}
      >
        {icon ? <span className="flex items-center justify-center">{icon}</span> : null}
        <span>{children}</span>
      </div>
    )
  },
)
Tag.displayName = "Tag"

export { Tag, tagVariants }

