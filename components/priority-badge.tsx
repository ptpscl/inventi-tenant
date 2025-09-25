import { Badge } from "@/components/ui/badge"
import { Clock, AlertTriangle, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

interface PriorityBadgeProps {
  priority: "Low" | "Medium" | "High" | "Critical"
  size?: "sm" | "md" | "lg"
  showIcon?: boolean
}

const priorityConfig = {
  Low: {
    color: "bg-gray-100 text-gray-800 border-gray-200",
    icon: Clock,
    label: "Low",
  },
  Medium: {
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: Clock,
    label: "Medium",
  },
  High: {
    color: "bg-orange-100 text-orange-800 border-orange-200",
    icon: AlertTriangle,
    label: "High",
  },
  Critical: {
    color: "bg-red-100 text-red-800 border-red-200",
    icon: Zap,
    label: "Critical",
  },
}

export default function PriorityBadge({ priority, size = "md", showIcon = true }: PriorityBadgeProps) {
  const config = priorityConfig[priority]
  const Icon = config.icon

  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-2.5 py-1",
    lg: "text-base px-3 py-1.5",
  }

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  }

  return (
    <Badge variant="outline" className={cn(config.color, sizeClasses[size])}>
      {showIcon && <Icon className={cn(iconSizes[size], "mr-1")} />}
      {config.label}
    </Badge>
  )
}
