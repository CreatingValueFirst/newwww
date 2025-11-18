"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { KpiCard } from "@/components/kpi-card"
import { DonutChart } from "@/components/donut-chart"
import { calculateB2B, B2BInputs } from "@/lib/calculations"
import { Users, Calendar, DollarSign, Target } from 'lucide-react'

export function B2BCalculator() {
  const [inputs, setInputs] = useState<B2BInputs>({
    leadsPerMonth: 1000,
    meetingConvPercent: 5,
    clientConvPercent: 20,
    ltv: 5000,
    serviceFeeMonthly: 2000,
  })

  const results = calculateB2B(inputs)

  const chartData = [
    { name: "Приходи", value: Math.max(results.revenuePerMonth, 0), color: "#14B8A6" },
    { name: "Такса за услуга", value: inputs.serviceFeeMonthly, color: "#06B6D4" },
    { name: "Нетна полза", value: Math.max(results.netBenefitPerMonth, 0), color: "#7C3AED" },
  ]

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4 gradient-text">Входни параметри</h3>
          
          <div className="space-y-6">
            <div>
              <Label htmlFor="leadsPerMonth">Размер на таргет листа (лийдове / месец)</Label>
              <Input
                id="leadsPerMonth"
                type="number"
                min="0"
                value={inputs.leadsPerMonth}
                onChange={(e) => setInputs({ ...inputs, leadsPerMonth: Number(e.target.value) })}
                className="mt-2 bg-background/50"
              />
            </div>

            <div>
              <Label htmlFor="meetingConvPercent">
                Конверсия в срещи: {inputs.meetingConvPercent}%
              </Label>
              <Slider
                id="meetingConvPercent"
                min={0}
                max={100}
                step={1}
                value={[inputs.meetingConvPercent]}
                onValueChange={(value) => setInputs({ ...inputs, meetingConvPercent: value[0] })}
                className="mt-4"
              />
            </div>

            <div>
              <Label htmlFor="clientConvPercent">
                Конверсия в клиенти: {inputs.clientConvPercent}%
              </Label>
              <Slider
                id="clientConvPercent"
                min={0}
                max={100}
                step={1}
                value={[inputs.clientConvPercent]}
                onValueChange={(value) => setInputs({ ...inputs, clientConvPercent: value[0] })}
                className="mt-4"
              />
            </div>

            <div>
              <Label htmlFor="ltv">Среден LTV на клиент (лв.)</Label>
              <Input
                id="ltv"
                type="number"
                min="0"
                value={inputs.ltv}
                onChange={(e) => setInputs({ ...inputs, ltv: Number(e.target.value) })}
                className="mt-2 bg-background/50"
              />
            </div>

            <div>
              <Label htmlFor="serviceFeeMonthly">Месечна такса за услугата (лв.)</Label>
              <Input
                id="serviceFeeMonthly"
                type="number"
                min="0"
                value={inputs.serviceFeeMonthly}
                onChange={(e) => setInputs({ ...inputs, serviceFeeMonthly: Number(e.target.value) })}
                className="mt-2 bg-background/50"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <KpiCard
            label="Очаквани срещи"
            value={results.meetingsPerMonth.toFixed(1)}
            description="/ месец"
            icon={Calendar}
            delay={0.1}
          />
          <KpiCard
            label="Нови клиенти"
            value={results.clientsPerMonth.toFixed(1)}
            description="/ месец"
            icon={Users}
            delay={0.2}
          />
          <KpiCard
            label="Очаквани приходи"
            value={`${Math.round(results.revenuePerMonth)} лв.`}
            description="/ месец"
            icon={DollarSign}
            delay={0.3}
          />
          <KpiCard
            label="ROI за 12 месеца"
            value={`${Math.round(results.roi12MonthsPercent)}%`}
            icon={Target}
            delay={0.4}
          />
        </div>

        <div className="glass-card rounded-2xl p-6">
          <h4 className="text-lg font-semibold mb-6">Разпределение на стойността</h4>
          <DonutChart data={chartData} />
        </div>
      </div>
    </div>
  )
}
