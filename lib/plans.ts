export type PlanType = "free" | "pro" | "enterprise"

export interface Plan {
  type: PlanType
  name: string
  price: number
  scanLimit: number
  pagesPerScan: number
  description: string
  features: string[]
}

export const plans: Record<PlanType, Plan> = {
  free: {
    type: "free",
    name: "Free",
    price: 0,
    scanLimit: 5,
    pagesPerScan: 1,
    description: "Perfect for personal projects",
    features: [
      "5 website scans per month",
      "Basic element mapping",
      "Single page analysis",
      "Standard configuration",
      "Community support",
    ],
  },
  pro: {
    type: "pro",
    name: "Pro",
    price: 29,
    scanLimit: Number.POSITIVE_INFINITY,
    pagesPerScan: Number.POSITIVE_INFINITY,
    description: "For professional developers",
    features: [
      "Unlimited website scans",
      "Advanced element mapping",
      "Multi-page analysis",
      "Custom configuration",
      "Priority email support",
      "CI/CD integration",
      "Advanced selectors",
    ],
  },
  enterprise: {
    type: "enterprise",
    name: "Enterprise",
    price: 99,
    scanLimit: Number.POSITIVE_INFINITY,
    pagesPerScan: Number.POSITIVE_INFINITY,
    description: "For teams and organizations",
    features: [
      "Everything in Pro",
      "Team collaboration",
      "Custom integrations",
      "Advanced analytics",
      "Dedicated support",
      "SLA guarantees",
      "Custom training",
      "White labeling",
    ],
  },
}

// Helper functions for plan management
export function getUserPlan(user: any): Plan {
  return plans[user?.plan || "free"]
}

export function canUserScan(user: any): boolean {
  const plan = getUserPlan(user)
  const scansUsed = user?.scansUsed || 0
  return scansUsed < plan.scanLimit
}

export function getScansRemaining(user: any): number {
  const plan = getUserPlan(user)
  const scansUsed = user?.scansUsed || 0

  if (plan.scanLimit === Number.POSITIVE_INFINITY) {
    return Number.POSITIVE_INFINITY
  }

  return Math.max(0, plan.scanLimit - scansUsed)
}

export function getPagesLimit(user: any): number {
  const plan = getUserPlan(user)
  return plan.pagesPerScan
}
