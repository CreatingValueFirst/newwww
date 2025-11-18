"use client"

import { Type as type, LucideIcon } from 'lucide-react'

interface KpiCardProps {
  label: string
  value: string
  description?: string
  icon?: LucideIcon
  delay?: number
}

export function KpiCard({ label, value, description, icon: Icon }: KpiCardProps) {
  return (
    <div className="glass-card rounded-2xl p-6 shadow-xl fade-in-up">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-2">{label}</p>
          <p className="text-3xl font-bold gradient-text">{value}</p>
          {description && (
            <p className="text-xs text-muted-foreground mt-2">{description}</p>
          )}
        </div>
        {Icon && (
          <div className="ml-4 p-3 rounded-xl bg-primary/10">
            <Icon className="w-6 h-6 text-primary" />
          </div>
        )}
      </div>
    </div>
  )
}
