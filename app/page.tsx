"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ChatbotCalculator } from "@/components/chatbot-calculator"
import { BackofficeCalculator } from "@/components/backoffice-calculator"
import { B2BCalculator } from "@/components/b2b-calculator"
import { SEOCalculator } from "@/components/seo-calculator"
import { ArrowRight, FileText, Sparkles } from 'lucide-react'

export default function Home() {
  const router = useRouter()

  const handleViewSummary = () => {
    router.push('/summary')
  }

  const scrollToCalculator = () => {
    document.getElementById('calculator-section')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-cyan-500/10 to-purple-500/10 blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto text-center fade-in-up">
          <div className="flex justify-center mb-8">
            <div className="relative w-20 h-20 rounded-2xl glass-card p-4 shadow-2xl">
              <Image
                src="/favicon.png"
                alt="AI-Masters"
                width={80}
                height={80}
                className="w-full h-full object-contain"
              />
              <div className="absolute -top-1 -right-1">
                <Sparkles className="w-6 h-6 text-primary animate-pulse" />
              </div>
            </div>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 text-balance">
            <span className="gradient-text">Automation ROI Studio</span>
          </h1>

          <p className="text-xl sm:text-2xl text-muted-foreground mb-4 max-w-3xl mx-auto text-balance">
            Виж колко печелите от автоматизация на поддръжката, гласов агент и AI решения
          </p>

          <p className="text-base sm:text-lg text-muted-foreground/80 mb-12 max-w-2xl mx-auto text-pretty">
            Интерактивен ROI калкулатор за услугите на AI-Masters – изчислете спестено време, разходи и възвръщаемост за вашия бизнес.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-teal-500 via-cyan-500 to-purple-600 hover:opacity-90 text-white font-semibold px-8"
              onClick={scrollToCalculator}
            >
              Започни изчисление
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/20 hover:bg-white/5"
              onClick={handleViewSummary}
            >
              <FileText className="mr-2 w-5 h-5" />
              Виж обобщение
            </Button>
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section id="calculator-section" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="chatbot" className="w-full">
            <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-8 glass-card p-2 h-auto gap-2">
              <TabsTrigger 
                value="chatbot" 
                className="data-[state=active]:bg-primary/20 text-xs sm:text-sm lg:text-base py-3 px-2 sm:px-3 whitespace-normal h-auto min-h-[3rem] leading-tight"
              >
                <span className="block text-center">
                  Автоматизация на поддръжката
                  <span className="hidden sm:inline"> & Voice Agent</span>
                </span>
              </TabsTrigger>
              <TabsTrigger 
                value="backoffice" 
                className="data-[state=active]:bg-primary/20 text-xs sm:text-sm lg:text-base py-3 px-2 sm:px-3 whitespace-normal h-auto min-h-[3rem] leading-tight"
              >
                <span className="block text-center">BackOffice AI асистент</span>
              </TabsTrigger>
              <TabsTrigger 
                value="b2b" 
                className="data-[state=active]:bg-primary/20 text-xs sm:text-sm lg:text-base py-3 px-2 sm:px-3 whitespace-normal h-auto min-h-[3rem] leading-tight"
              >
                <span className="block text-center">B2B лийд генератор</span>
              </TabsTrigger>
              <TabsTrigger 
                value="seo" 
                className="data-[state=active]:bg-primary/20 text-xs sm:text-sm lg:text-base py-3 px-2 sm:px-3 whitespace-normal h-auto min-h-[3rem] leading-tight"
              >
                <span className="block text-center">AI Visibility / SEO</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chatbot" className="mt-0">
              <ChatbotCalculator />
            </TabsContent>

            <TabsContent value="backoffice" className="mt-0">
              <BackofficeCalculator />
            </TabsContent>

            <TabsContent value="b2b" className="mt-0">
              <B2BCalculator />
            </TabsContent>

            <TabsContent value="seo" className="mt-0">
              <SEOCalculator />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-card rounded-3xl p-12 fade-in-up">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 gradient-text">
              Готови за следващата стъпка?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 text-balance">
              Запазете безплатна консултация с експертите на AI-Masters и получете персонализиран ROI анализ за вашия бизнес.
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-teal-500 via-cyan-500 to-purple-600 hover:opacity-90 text-white font-semibold px-8"
              onClick={handleViewSummary}
            >
              Запази безплатна консултация
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
