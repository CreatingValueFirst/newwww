"use client"

import { useSearchParams, useRouter } from 'next/navigation'
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { KpiCard } from "@/components/kpi-card"
import { ArrowLeft, Printer, Send, Sparkles } from 'lucide-react'
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

  // Get all query parameters
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

  // Calculate total annual value
  const totalAnnualValue = 
    (parseFloat(chatNetBenefit || "0") * 12) +
    (parseFloat(backofficeSavedCost || "0") * 12) +
    (parseFloat(b2bRevenue || "0") * 12) +
    (parseFloat(seoRevenue || "0") * 12)

  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 fade-in-up">
          <div className="flex justify-center mb-6">
            <div className="relative w-16 h-16 rounded-xl glass-card p-3 shadow-xl">
              <Image src="/favicon.png" alt="AI-Masters" width={64} height={64} className="w-full h-full object-contain" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 gradient-text">ROI Анализ - Обобщение</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Вашият персонализиран анализ на възвръщаемостта
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center no-print">
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

        {/* Global KPI */}
        <div className="mb-12 fade-in-up" style={{ animationDelay: "0.1s" }}>
          <div className="glass-card rounded-3xl p-8 text-center shadow-2xl">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold mb-4 gradient-text">Обща допълнителна стойност за 12 месеца</h2>
            </div>
            <p className="text-5xl sm:text-6xl font-bold gradient-text">
              {Math.round(totalAnnualValue).toLocaleString('bg-BG')} лв.
            </p>
          </div>
        </div>

        {/* Chatbot Summary */}
        {chatSavedHours && (
          <div className="mb-8 fade-in-up" style={{ animationDelay: "0.2s" }}>
            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-6 gradient-text">Автоматизация на поддръжката на клиенти & Voice Agent – обобщение</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard label="Спестено време" value={`${chatSavedHours} часа / мес.`} />
                <KpiCard label="Спестени разходи" value={`${chatSavedCost} лв. / мес.`} />
                <KpiCard label="Нетна полза" value={`${chatNetBenefit} лв. / мес.`} />
                <KpiCard label="ROI за 12 месеца" value={`${chatRoi}%`} />
              </div>
            </div>
          </div>
        )}

        {/* Backoffice Summary */}
        {backofficeSavedHours && (
          <div className="mb-8 fade-in-up" style={{ animationDelay: "0.3s" }}>
            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-6 gradient-text">BackOffice AI асистент – обобщение</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <KpiCard label="Спестени часове" value={`${backofficeSavedHours} часа / мес.`} />
                <KpiCard label="Спестени разходи" value={`${backofficeSavedCost} лв. / мес.`} />
              </div>
            </div>
          </div>
        )}

        {/* B2B Summary */}
        {b2bRevenue && (
          <div className="mb-8 fade-in-up" style={{ animationDelay: "0.4s" }}>
            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-6 gradient-text">B2B лийд генератор – обобщение</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard label="Очаквани срещи" value={`${b2bMeetings} / мес.`} />
                <KpiCard label="Нови клиенти" value={`${b2bClients} / мес.`} />
                <KpiCard label="Очаквани приходи" value={`${b2bRevenue} лв. / мес.`} />
                <KpiCard label="ROI за 12 месеца" value={`${b2bRoi}%`} />
              </div>
            </div>
          </div>
        )}

        {/* SEO Summary */}
        {seoRevenue && (
          <div className="mb-12 fade-in-up" style={{ animationDelay: "0.5s" }}>
            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-6 gradient-text">AI Visibility / SEO – обобщение</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard label="Допълнителни посещения" value={`${seoVisits} / мес.`} />
                <KpiCard label="Допълнителни лидове" value={`${seoLeads} / мес.`} />
                <KpiCard label="Допълнителни приходи" value={`${seoRevenue} лв. / мес.`} />
                <KpiCard label="ROI за 12 месеца" value={`${seoRoi}%`} />
              </div>
            </div>
          </div>
        )}

        {/* Contact Form */}
        <div id="contact-form" className="no-print fade-in-up" style={{ animationDelay: "0.6s" }}>
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
