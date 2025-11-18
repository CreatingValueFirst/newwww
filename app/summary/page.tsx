"use client"

import { useSearchParams, useRouter } from 'next/navigation'
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { KpiCard } from "@/components/kpi-card"
import { ArrowLeft, Printer, Send, Sparkles, TrendingUp, Clock, DollarSign } from 'lucide-react'
import { useState } from "react"

export default function SummaryPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
  })

  const chatSavedHours = searchParams.get("chat_savedHours")
  const chatSavedCost = searchParams.get("chat_savedCost")
  const chatRoi = searchParams.get("chat_roi")
  const chatNetBenefit = searchParams.get("chat_netBenefit")
  
  const backofficeSavedHours = searchParams.get("backoffice_savedHours")
  const backofficeSavedCost = searchParams.get("backoffice_savedCost")
  
  const b2bMeetings = searchParams.get("b2b_meetings")
  const b2bClients = searchParams.get("b2b_clients")
  const b2bRevenue = searchParams.get("b2b_revenue")
  const b2bRoi = searchParams.get("b2b_roi")
  
  const seoVisits = searchParams.get("seo_visits")
  const seoLeads = searchParams.get("seo_leads")
  const seoRevenue = searchParams.get("seo_revenue")
  const seoRoi = searchParams.get("seo_roi")

  const hasData = chatSavedHours || backofficeSavedHours || b2bRevenue || seoRevenue

  const handlePrint = () => {
    window.print()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormSubmitted(true)
  }

  const scrollToContact = () => {
    document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" })
  }

  if (!hasData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-card rounded-3xl p-12 max-w-2xl text-center">
          <h2 className="text-3xl font-bold mb-4 gradient-text">Все още няма въведени данни</h2>
          <p className="text-muted-foreground mb-8">
            Върнете се към калкулатора и въведете вашите параметри.
          </p>
          <Button onClick={() => router.push("/")} size="lg">
            <ArrowLeft className="mr-2 w-5 h-5" />
            Назад към калкулатора
          </Button>
        </div>
      </div>
    )
  }

  const totalMonthlySavings = 
    (parseFloat(chatNetBenefit || "0")) +
    (parseFloat(backofficeSavedCost || "0")) +
    (parseFloat(b2bRevenue || "0")) +
    (parseFloat(seoRevenue || "0"))

  const totalAnnualValue = totalMonthlySavings * 12

  const totalMonthlyHoursSaved = 
    (parseFloat(chatSavedHours || "0")) +
    (parseFloat(backofficeSavedHours || "0"))

  return (
    <main className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 print:py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 print:mb-6">
          <div className="flex justify-center mb-4 print:mb-3">
            <div className="relative w-20 h-20 print:w-16 print:h-16 rounded-xl glass-card print:glass-card-print p-4 shadow-xl print:shadow-md">
              <Image src="/favicon.png" alt="AI-Masters" width={80} height={80} className="w-full h-full object-contain" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl print:text-4xl font-bold mb-3 gradient-text print:text-gray-900">
            Персонализиран ROI Анализ
          </h1>
          <p className="text-lg text-muted-foreground print:text-gray-600 mb-2">
            AI-Masters Automation Studio
          </p>
          <p className="text-sm text-muted-foreground print:text-gray-500">
            {new Date().toLocaleDateString('bg-BG', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center mt-6 no-print">
            <Button onClick={() => router.push("/")} variant="outline">
              <ArrowLeft className="mr-2 w-4 h-4" />
              Назад
            </Button>
            <Button onClick={handlePrint} variant="outline">
              <Printer className="mr-2 w-4 h-4" />
              Принтирай / Запази като PDF
            </Button>
            <Button 
              onClick={scrollToContact}
              className="bg-gradient-to-r from-teal-500 via-cyan-500 to-purple-600 hover:opacity-90"
            >
              Запази безплатна консултация
            </Button>
          </div>
        </div>

        <div className="mb-8 print:mb-6 print:break-inside-avoid">
          <div className="glass-card print:glass-card-print rounded-2xl p-6 print:p-5 shadow-2xl print:shadow-md">
            <div className="flex items-center gap-2 mb-6 print:mb-4">
              <Sparkles className="w-6 h-6 text-primary print:text-teal-600" />
              <h2 className="text-2xl print:text-xl font-bold gradient-text print:text-gray-900">
                Обобщение на резултатите
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 print:gap-3">
              <div className="glass-card print:bg-gray-50 print:border print:border-gray-200 rounded-xl p-4 print:p-3 text-center">
                <div className="flex justify-center mb-2">
                  <Clock className="w-8 h-8 print:w-6 print:h-6 text-cyan-500 print:text-cyan-600" />
                </div>
                <p className="text-sm text-muted-foreground print:text-gray-600 mb-1">Спестено време месечно</p>
                <p className="text-3xl print:text-2xl font-bold gradient-text print:text-gray-900">
                  {Math.round(totalMonthlyHoursSaved)} ч.
                </p>
              </div>
              
              <div className="glass-card print:bg-gray-50 print:border print:border-gray-200 rounded-xl p-4 print:p-3 text-center">
                <div className="flex justify-center mb-2">
                  <DollarSign className="w-8 h-8 print:w-6 print:h-6 text-purple-500 print:text-purple-600" />
                </div>
                <p className="text-sm text-muted-foreground print:text-gray-600 mb-1">Месечна стойност</p>
                <p className="text-3xl print:text-2xl font-bold gradient-text print:text-gray-900">
                  {Math.round(totalMonthlySavings).toLocaleString('bg-BG')} лв.
                </p>
              </div>
              
              <div className="glass-card print:bg-teal-50 print:border print:border-teal-200 rounded-xl p-4 print:p-3 text-center">
                <div className="flex justify-center mb-2">
                  <TrendingUp className="w-8 h-8 print:w-6 print:h-6 text-teal-500 print:text-teal-600" />
                </div>
                <p className="text-sm text-muted-foreground print:text-gray-600 mb-1">Годишна стойност</p>
                <p className="text-3xl print:text-2xl font-bold gradient-text print:text-teal-700">
                  {Math.round(totalAnnualValue).toLocaleString('bg-BG')} лв.
                </p>
              </div>
            </div>
          </div>
        </div>

        {chatSavedHours && (
          <div className="mb-8 print:mb-6 print:break-inside-avoid">
            <div className="glass-card print:glass-card-print rounded-2xl p-6 print:p-5">
              <h3 className="text-xl print:text-lg font-bold mb-4 print:mb-3 gradient-text print:text-gray-900">
                Автоматизация на поддръжката на клиенти & Voice Agent
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 print:gap-3">
                <div className="glass-card print:bg-gray-50 print:border print:border-gray-200 rounded-xl p-4 print:p-3">
                  <p className="text-xs text-muted-foreground print:text-gray-500 mb-1">Спестено време</p>
                  <p className="text-2xl print:text-xl font-bold gradient-text print:text-gray-900">
                    {chatSavedHours} ч/мес
                  </p>
                </div>
                <div className="glass-card print:bg-gray-50 print:border print:border-gray-200 rounded-xl p-4 print:p-3">
                  <p className="text-xs text-muted-foreground print:text-gray-500 mb-1">Спестени разходи</p>
                  <p className="text-2xl print:text-xl font-bold gradient-text print:text-gray-900">
                    {chatSavedCost} лв/мес
                  </p>
                </div>
                <div className="glass-card print:bg-gray-50 print:border print:border-gray-200 rounded-xl p-4 print:p-3">
                  <p className="text-xs text-muted-foreground print:text-gray-500 mb-1">Нетна полза</p>
                  <p className="text-2xl print:text-xl font-bold gradient-text print:text-gray-900">
                    {chatNetBenefit} лв/мес
                  </p>
                </div>
                <div className="glass-card print:bg-teal-50 print:border print:border-teal-200 rounded-xl p-4 print:p-3">
                  <p className="text-xs text-muted-foreground print:text-gray-600 mb-1">ROI за 12 месеца</p>
                  <p className="text-2xl print:text-xl font-bold gradient-text print:text-teal-700">
                    {chatRoi}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {backofficeSavedHours && (
          <div className="mb-8 print:mb-6 print:break-inside-avoid">
            <div className="glass-card print:glass-card-print rounded-2xl p-6 print:p-5">
              <h3 className="text-xl print:text-lg font-bold mb-4 print:mb-3 gradient-text print:text-gray-900">
                BackOffice AI асистент
              </h3>
              <div className="grid grid-cols-2 gap-4 print:gap-3">
                <div className="glass-card print:bg-gray-50 print:border print:border-gray-200 rounded-xl p-4 print:p-3">
                  <p className="text-xs text-muted-foreground print:text-gray-500 mb-1">Спестени часове</p>
                  <p className="text-2xl print:text-xl font-bold gradient-text print:text-gray-900">
                    {backofficeSavedHours} ч/мес
                  </p>
                </div>
                <div className="glass-card print:bg-gray-50 print:border print:border-gray-200 rounded-xl p-4 print:p-3">
                  <p className="text-xs text-muted-foreground print:text-gray-500 mb-1">Спестени разходи</p>
                  <p className="text-2xl print:text-xl font-bold gradient-text print:text-gray-900">
                    {backofficeSavedCost} лв/мес
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {b2bRevenue && (
          <div className="mb-8 print:mb-6 print:break-inside-avoid">
            <div className="glass-card print:glass-card-print rounded-2xl p-6 print:p-5">
              <h3 className="text-xl print:text-lg font-bold mb-4 print:mb-3 gradient-text print:text-gray-900">
                B2B лийд генератор
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 print:gap-3">
                <div className="glass-card print:bg-gray-50 print:border print:border-gray-200 rounded-xl p-4 print:p-3">
                  <p className="text-xs text-muted-foreground print:text-gray-500 mb-1">Очаквани срещи</p>
                  <p className="text-2xl print:text-xl font-bold gradient-text print:text-gray-900">
                    {b2bMeetings}/мес
                  </p>
                </div>
                <div className="glass-card print:bg-gray-50 print:border print:border-gray-200 rounded-xl p-4 print:p-3">
                  <p className="text-xs text-muted-foreground print:text-gray-500 mb-1">Нови клиенти</p>
                  <p className="text-2xl print:text-xl font-bold gradient-text print:text-gray-900">
                    {b2bClients}/мес
                  </p>
                </div>
                <div className="glass-card print:bg-gray-50 print:border print:border-gray-200 rounded-xl p-4 print:p-3">
                  <p className="text-xs text-muted-foreground print:text-gray-500 mb-1">Очаквани приходи</p>
                  <p className="text-2xl print:text-xl font-bold gradient-text print:text-gray-900">
                    {b2bRevenue} лв/мес
                  </p>
                </div>
                <div className="glass-card print:bg-teal-50 print:border print:border-teal-200 rounded-xl p-4 print:p-3">
                  <p className="text-xs text-muted-foreground print:text-gray-600 mb-1">ROI за 12 месеца</p>
                  <p className="text-2xl print:text-xl font-bold gradient-text print:text-teal-700">
                    {b2bRoi}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {seoRevenue && (
          <div className="mb-8 print:mb-6 print:break-inside-avoid">
            <div className="glass-card print:glass-card-print rounded-2xl p-6 print:p-5">
              <h3 className="text-xl print:text-lg font-bold mb-4 print:mb-3 gradient-text print:text-gray-900">
                AI Visibility / SEO
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 print:gap-3">
                <div className="glass-card print:bg-gray-50 print:border print:border-gray-200 rounded-xl p-4 print:p-3">
                  <p className="text-xs text-muted-foreground print:text-gray-500 mb-1">Допълнителни посещения</p>
                  <p className="text-2xl print:text-xl font-bold gradient-text print:text-gray-900">
                    {seoVisits}/мес
                  </p>
                </div>
                <div className="glass-card print:bg-gray-50 print:border print:border-gray-200 rounded-xl p-4 print:p-3">
                  <p className="text-xs text-muted-foreground print:text-gray-500 mb-1">Допълнителни лидове</p>
                  <p className="text-2xl print:text-xl font-bold gradient-text print:text-gray-900">
                    {seoLeads}/мес
                  </p>
                </div>
                <div className="glass-card print:bg-gray-50 print:border print:border-gray-200 rounded-xl p-4 print:p-3">
                  <p className="text-xs text-muted-foreground print:text-gray-500 mb-1">Допълнителни приходи</p>
                  <p className="text-2xl print:text-xl font-bold gradient-text print:text-gray-900">
                    {seoRevenue} лв/мес
                  </p>
                </div>
                <div className="glass-card print:bg-teal-50 print:border print:border-teal-200 rounded-xl p-4 print:p-3">
                  <p className="text-xs text-muted-foreground print:text-gray-600 mb-1">ROI за 12 месеца</p>
                  <p className="text-2xl print:text-xl font-bold gradient-text print:text-teal-700">
                    {seoRoi}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="print:block hidden text-center text-sm text-gray-500 mt-8 pt-4 border-t border-gray-200">
          <p>AI-Masters Automation Studio | www.ai-masters.bg | info@ai-masters.bg</p>
        </div>

        {/* Contact Form - Hidden on print */}
        <div id="contact-form" className="no-print">
          <div className="glass-card rounded-3xl p-8 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4 gradient-text text-center">
              Изпрати ми детайлен ROI анализ
            </h2>
            <p className="text-muted-foreground mb-8 text-center">
              Оставете контактите си и екипът на AI-Masters ще ви изпрати персонализиран анализ.
            </p>

            {formSubmitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Благодарим!</h3>
                <p className="text-muted-foreground">
                  Ще се свържем с вас с детайлен анализ възможно най-скоро.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name">Име *</Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-2 bg-background/50"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Имейл *</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-2 bg-background/50"
                  />
                </div>

                <div>
                  <Label htmlFor="company">Фирма</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="mt-2 bg-background/50"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Телефон *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="mt-2 bg-background/50"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-gradient-to-r from-teal-500 via-cyan-500 to-purple-600 hover:opacity-90 text-white font-semibold"
                >
                  <Send className="mr-2 w-5 h-5" />
                  Изпрати заявка
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
