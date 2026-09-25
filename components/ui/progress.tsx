import * as React from "react"
import { Progress as ProgressPrimitive } from "@base-ui/react/progress"
import { cn } from "cn"

function Progress({
  className,
  value,
  label,
  duration = 500,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> & {
  label?: string
  duration?: number
}) {
  return (
    <ProgressPrimitive.Root
      value={value}
      data-slot="progress"
      className={cn("flex flex-col gap-1.5", className)}
      {...props}
    >
      <div className="flex items-center justify-between gap-2">
        {label && (
          <ProgressPrimitive.Label
            data-slot="progress-label"
            className="text-[14px] text-foreground"
          >
            {label}
          </ProgressPrimitive.Label>
        )}
        <ProgressPrimitive.Value
          data-slot="progress-value"
          className="ml-auto text-[14px] text-muted-foreground"
        />
      </div>
      <ProgressPrimitive.Track
        data-slot="progress-track"
        className="h-1.5 w-full overflow-hidden rounded-full bg-border"
      >
        <ProgressPrimitive.Indicator
          data-slot="progress-indicator"
          className="h-full rounded-full bg-[#3a7d44] ease-in-out"
          style={{ width: `${value ?? 0}%`, transition: `width ${duration}ms ease-in-out` }}
        />
      </ProgressPrimitive.Track>
    </ProgressPrimitive.Root>
  )
}

export { Progress }
