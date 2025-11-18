"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { KpiCard } from "@/components/kpi-card"
import { DonutChart } from "@/components/donut-chart"
import { calculateSEO, SEOInputs } from "@/lib/calculations"
import { TrendingUp, Users, DollarSign, Target } from 'lucide-react'

export function SEOCalculator() {
  const [inputs, setInputs] = useState<SEOInputs>({
    organicTraffic: 10000,
    convPercent: 2,
    leadValue: 150,
    growthPercent: 30,
    seoInvestment: 1500,
  })

  const results = calculateSEO(inputs)

  const chartData = [
    { name: "Допълнителни приходи", value: Math.max(results.additionalRevenuePerMonth, 0), color: "#14B8A6" },
    { name: "Инвестиция в SEO", value: inputs.seoInvestment, color: "#06B6D4" },
  ]

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4 gradient-text">Входни параметри</h3>
          
          <div className="space-y-6">
            <div>
              <Label htmlFor="organicTraffic">Органичен трафик / месец (посещения)</Label>
              <Input
                id="organicTraffic"
                type="number"
                min="0"
                value={inputs.organicTraffic}
                onChange={(e) => setInputs({ ...inputs, organicTraffic: Number(e.target.value) })}
                className="mt-2 bg-background/50"
              />
            </div>

            <div>
              <Label htmlFor="convPercent">
                Конверсия трафик → лид: {inputs.convPercent}%
              </Label>
              <Slider
                id="convPercent"
                min={0}
                max={50}
                step={0.5}
                value={[inputs.convPercent]}
                onValueChange={(value) => setInputs({ ...inputs, convPercent: value[0] })}
                className="mt-4"
              />
            </div>

            <div>
              <Label htmlFor="leadValue">Средна стойност на лид (лв.)</Label>
              <Input
                id="leadValue"
                type="number"
                min="0"
                value={inputs.leadValue}
                onChange={(e) => setInputs({ ...inputs, leadValue: Number(e.target.value) })}
                className="mt-2 bg-background/50"
              />
            </div>

            <div>
              <Label htmlFor="growthPercent">
                Очакван ръст на органичния трафик: {inputs.growthPercent}%
              </Label>
              <Slider
                id="growthPercent"
                min={0}
                max={200}
                step={5}
                value={[inputs.growthPercent]}
                onValueChange={(value) => setInputs({ ...inputs, growthPercent: value[0] })}
                className="mt-4"
              />
            </div>

            <div>
              <Label htmlFor="seoInvestment">Месечна инвестиция в съдържание/SEO (лв.)</Label>
              <Input
                id="seoInvestment"
                type="number"
                min="0"
                value={inputs.seoInvestment}
                onChange={(e) => setInputs({ ...inputs, seoInvestment: Number(e.target.value) })}
                className="mt-2 bg-background/50"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <KpiCard
            label="Допълнителни посещения"
            value={Math.round(results.additionalVisits).toLocaleString('bg-BG')}
            description="/ месец"
            icon={TrendingUp}
            delay={0.1}
          />
          <KpiCard
            label="Допълнителни лидове"
            value={Math.round(results.additionalLeads).toLocaleString('bg-BG')}
            description="/ месец"
            icon={Users}
            delay={0.2}
          />
          <KpiCard
            label="Допълнителни приходи"
            value={`${Math.round(results.additionalRevenuePerMonth)} лв.`}
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
          <h4 className="text-lg font-semibold mb-6">Възвръщаемост на инвестицията</h4>
          <DonutChart data={chartData} />
        </div>
      </div>
    </div>
  )
}
