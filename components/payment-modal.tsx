"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Loader2, CheckCircle, CreditCard } from "lucide-react"
import { type Plan, plans } from "@/lib/plans"

interface PaymentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (plan: Plan) => void
  currentPlan: Plan
}

export function PaymentModal({ open, onOpenChange, onSuccess, currentPlan }: PaymentModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<Plan>(currentPlan.type === "free" ? plans.pro : plans.enterprise)
  const [loading, setLoading] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setPaymentSuccess(true)
    setLoading(false)

    // Simulate success callback after showing success message
    setTimeout(() => {
      onSuccess(selectedPlan)
      setPaymentSuccess(false)
    }, 1500)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-zinc-900 border-zinc-800 text-white">
        {paymentSuccess ? (
          <div className="py-12 flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Payment Successful!</h2>
            <p className="text-zinc-400 text-center">
              Your account has been upgraded to {selectedPlan.name}. Enjoy your new features!
            </p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl text-white">Upgrade Your Plan</DialogTitle>
              <DialogDescription className="text-zinc-400">
                Choose a plan that works best for your needs.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6 py-4">
              <RadioGroup
                defaultValue={selectedPlan.type}
                onValueChange={(value) => setSelectedPlan(plans[value as keyof typeof plans])}
                className="space-y-4"
              >
                {Object.values(plans)
                  .filter((plan) => plan.type !== "free")
                  .map((plan) => (
                    <div
                      key={plan.type}
                      className={`flex items-start space-x-3 rounded-lg border p-4 ${
                        selectedPlan.type === plan.type
                          ? "border-purple-600 bg-purple-900/20"
                          : "border-zinc-800 bg-zinc-950/50"
                      }`}
                    >
                      <RadioGroupItem value={plan.type} id={plan.type} className="mt-1" />
                      <div className="flex-1">
                        <Label
                          htmlFor={plan.type}
                          className="text-base font-medium flex items-center justify-between cursor-pointer"
                        >
                          {plan.name}
                          <span className="text-lg font-bold text-purple-400">${plan.price}/mo</span>
                        </Label>
                        <p className="text-sm text-zinc-400 mt-1">{plan.description}</p>
                        <ul className="mt-2 space-y-1">
                          {plan.features.slice(0, 4).map((feature, i) => (
                            <li key={i} className="text-xs text-zinc-300 flex items-start">
                              <CheckCircle className="h-3 w-3 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
              </RadioGroup>

              <div className="space-y-4">
                <h3 className="text-sm font-medium text-zinc-300">Payment Information</h3>
                <div className="space-y-2">
                  <Label htmlFor="cardName" className="text-zinc-300">
                    Name on card
                  </Label>
                  <Input id="cardName" placeholder="John Smith" className="bg-zinc-950 border-zinc-800 text-zinc-300" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cardNumber" className="text-zinc-300">
                    Card number
                  </Label>
                  <div className="relative">
                    <Input
                      id="cardNumber"
                      placeholder="4242 4242 4242 4242"
                      className="bg-zinc-950 border-zinc-800 text-zinc-300 pl-10"
                    />
                    <CreditCard className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry" className="text-zinc-300">
                      Expiry date
                    </Label>
                    <Input id="expiry" placeholder="MM/YY" className="bg-zinc-950 border-zinc-800 text-zinc-300" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvc" className="text-zinc-300">
                      CVC
                    </Label>
                    <Input id="cvc" placeholder="123" className="bg-zinc-950 border-zinc-800 text-zinc-300" />
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="border-zinc-700 text-zinc-300"
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `Pay $${selectedPlan.price}.00`
                  )}
                </Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
