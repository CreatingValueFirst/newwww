"use client"

import { useState } from "react"
import { useRouter } from 'next/navigation'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { KpiCard } from "@/components/kpi-card"
import { DonutChart } from "@/components/donut-chart"
import { calculateChatbot, ChatbotInputs } from "@/lib/calculations"
import { Clock, DollarSign, TrendingUp, Calendar, Target, FileText } from 'lucide-react'

export function ChatbotCalculator() {
  const router = useRouter()
  
  const [inputs, setInputs] = useState<ChatbotInputs>({
    inquiries: 500,
    avgMinutes: 8,
    hourlyRate: 15,
    automationPercent: 70,
    planFee: 600,
  })

  const results = calculateChatbot(inputs)

  const handleViewSummary = () => {
    const params = new URLSearchParams({
      chat_savedHours: results.savedHours.toFixed(1),
      chat_savedCost: Math.round(results.savedCost).toString(),
      chat_roi: Math.round(results.roi12MonthsPercent).toString(),
      chat_netBenefit: Math.round(results.netMonthlyBenefit).toString(),
    })
    router.push(`/summary?${params.toString()}`)
  }

  const chartData = [
    { name: "Спестени разходи", value: Math.max(results.savedCost, 0), color: "#14B8A6" },
    { name: "Такса", value: inputs.planFee, color: "#06B6D4" },
    { name: "Нетна полза", value: Math.max(results.netMonthlyBenefit, 0), color: "#7C3AED" },
  ]

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4 gradient-text">Входни параметри</h3>
          
          <div className="space-y-6">
            <div>
              <Label htmlFor="inquiries">Месечен брой запитвания</Label>
              <Input
                id="inquiries"
                type="number"
                min="0"
                value={inputs.inquiries}
                onChange={(e) => setInputs({ ...inputs, inquiries: Number(e.target.value) })}
                className="mt-2 bg-background/50"
              />
            </div>

            <div>
              <Label htmlFor="avgMinutes">Средно време на оператор (мин.)</Label>
              <Input
                id="avgMinutes"
                type="number"
                min="1"
                value={inputs.avgMinutes}
                onChange={(e) => setInputs({ ...inputs, avgMinutes: Number(e.target.value) })}
                className="mt-2 bg-background/50"
              />
            </div>

            <div>
              <Label htmlFor="hourlyRate">Средна часова ставка на служител (лв./час)</Label>
              <Input
                id="hourlyRate"
                type="number"
                min="0"
                value={inputs.hourlyRate}
                onChange={(e) => setInputs({ ...inputs, hourlyRate: Number(e.target.value) })}
                className="mt-2 bg-background/50"
              />
            </div>

            <div>
              <Label htmlFor="automationPercent">
                Очакван процент автоматизация: {inputs.automationPercent}%
              </Label>
              <Slider
                id="automationPercent"
                min={0}
                max={100}
                step={5}
                value={[inputs.automationPercent]}
                onValueChange={(value) => setInputs({ ...inputs, automationPercent: value[0] })}
                className="mt-4"
              />
            </div>

            <div>
              <Label htmlFor="planFee">Месечна такса план (лв.)</Label>
              <Input
                id="planFee"
                type="number"
                min="0"
                value={inputs.planFee}
                onChange={(e) => setInputs({ ...inputs, planFee: Number(e.target.value) })}
                className="mt-2 bg-background/50"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Можете да използвате ориентир от страницата с цени.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <KpiCard
            label="Спестено време"
            value={`${results.savedHours.toFixed(1)} часа`}
            description="/ месец"
            icon={Clock}
            delay={0.1}
          />
          <KpiCard
            label="Спестени разходи"
            value={`${Math.round(results.savedCost)} лв.`}
            description="/ месец"
            icon={DollarSign}
            delay={0.2}
          />
          <KpiCard
            label="Нетна полза"
            value={`${Math.round(results.netMonthlyBenefit)} лв.`}
            description="/ месец"
            icon={TrendingUp}
            delay={0.3}
          />
          <KpiCard
            label="Период на изплащане"
            value={results.paybackMonths ? `${results.paybackMonths.toFixed(1)} мес.` : "N/A"}
            icon={Calendar}
            delay={0.4}
          />
        </div>

        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-primary" />
            <h4 className="text-lg font-semibold">ROI за 12 месеца</h4>
          </div>
          <p className="text-4xl font-bold gradient-text mb-6">
            {Math.round(results.roi12MonthsPercent)}%
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
