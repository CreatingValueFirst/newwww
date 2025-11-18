"use client"

import { useState } from "react"
import { useRouter } from 'next/navigation'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { KpiCard } from "@/components/kpi-card"
import { DonutChart } from "@/components/donut-chart"
import { calculateBackoffice, BackofficeInputs } from "@/lib/calculations"
import { Clock, DollarSign, Users, FileText } from 'lucide-react'

export function BackofficeCalculator() {
  const router = useRouter()
  
  const [inputs, setInputs] = useState<BackofficeInputs>({
    employees: 15,
    minutesPerDay: 30,
    monthlySalary: 2000,
    reductionPercent: 40,
  })

  const results = calculateBackoffice(inputs)

  const handleViewSummary = () => {
    const params = new URLSearchParams({
      backoffice_savedHours: results.savedHoursPerMonth.toFixed(1),
      backoffice_savedCost: Math.round(results.savedCostPerMonth).toString(),
    })
    router.push(`/summary?${params.toString()}`)
  }

  const chartData = [
    { name: "Спестено време", value: results.savedMinutesPerMonth, color: "#14B8A6" },
    { name: "Оставащо време", value: results.totalMinutesPerMonth - results.savedMinutesPerMonth, color: "#06B6D4" },
  ]

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4 gradient-text">Входни параметри</h3>
          
          <div className="space-y-6">
            <div>
              <Label htmlFor="employees">Брой служители</Label>
              <Input
                id="employees"
                type="number"
                min="1"
                value={inputs.employees}
                onChange={(e) => setInputs({ ...inputs, employees: Number(e.target.value) })}
                className="mt-2 bg-background/50"
              />
            </div>

            <div>
              <Label htmlFor="minutesPerDay">Средно време за търсене на информация (мин./ден)</Label>
              <Input
                id="minutesPerDay"
                type="number"
                min="0"
                value={inputs.minutesPerDay}
                onChange={(e) => setInputs({ ...inputs, minutesPerDay: Number(e.target.value) })}
                className="mt-2 bg-background/50"
              />
            </div>

            <div>
              <Label htmlFor="monthlySalary">Средна месечна заплата (лв.)</Label>
              <Input
                id="monthlySalary"
                type="number"
                min="0"
                value={inputs.monthlySalary}
                onChange={(e) => setInputs({ ...inputs, monthlySalary: Number(e.target.value) })}
                className="mt-2 bg-background/50"
              />
            </div>

            <div>
              <Label htmlFor="reductionPercent">
                Очаквано намаляване на време: {inputs.reductionPercent}%
              </Label>
              <Slider
                id="reductionPercent"
                min={0}
                max={80}
                step={5}
                value={[inputs.reductionPercent]}
                onValueChange={(value) => setInputs({ ...inputs, reductionPercent: value[0] })}
                className="mt-4"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Процентно намаляване на времето за търсене благодарение на AI асистента.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <KpiCard
            label="Спестени часове"
            value={`${results.savedHoursPerMonth.toFixed(1)} часа`}
            description="/ месец"
            icon={Clock}
            delay={0.1}
          />
          <KpiCard
            label="Спестени разходи"
            value={`${Math.round(results.savedCostPerMonth)} лв.`}
            description="/ месец"
            icon={DollarSign}
            delay={0.2}
          />
        </div>

        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-primary" />
            <h4 className="text-lg font-semibold">Анализ на времето</h4>
          </div>
          <p className="text-sm text-muted-foreground mb-6">
            Ориентировъчна стойност на един час: {results.hourlyRateApprox.toFixed(2)} лв.
          </p>
          <DonutChart data={chartData} />
        </div>

        <Button 
          onClick={handleViewSummary}
          size="lg"
          className="w-full bg-gradient-to-r from-teal-500 via-cyan-500 to-purple-600 hover:opacity-90 text-white font-semibold"
        >
          <FileText className="mr-2 w-5 h-5" />
          Виж обобщение
        </Button>
      </div>
    </div>
  )
}
