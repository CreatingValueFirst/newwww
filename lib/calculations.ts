export interface ChatbotInputs {
  inquiries: number
  avgMinutes: number
  hourlyRate: number
  automationPercent: number
  planFee: number
}

export interface ChatbotOutputs {
  savedHours: number
  savedCost: number
  netMonthlyBenefit: number
  paybackMonths: number | null
  roi12MonthsPercent: number
}

export function calculateChatbot(inputs: ChatbotInputs): ChatbotOutputs {
  const totalMinutes = inputs.inquiries * inputs.avgMinutes
  const automatedMinutes = totalMinutes * (inputs.automationPercent / 100)
  const savedHours = automatedMinutes / 60
  const savedCost = savedHours * inputs.hourlyRate
  const netMonthlyBenefit = savedCost - inputs.planFee
  
  const paybackMonths = 
    netMonthlyBenefit > 0 && inputs.planFee > 0
      ? inputs.planFee / netMonthlyBenefit
      : null
  
  const roi12MonthsPercent = 
    inputs.planFee > 0
      ? ((savedCost * 12 - inputs.planFee * 12) / (inputs.planFee * 12)) * 100
      : 0
  
  return {
    savedHours,
    savedCost,
    netMonthlyBenefit,
    paybackMonths,
    roi12MonthsPercent,
  }
}

export interface BackofficeInputs {
  employees: number
  minutesPerDay: number
  monthlySalary: number
  reductionPercent: number
}

export interface BackofficeOutputs {
  savedHoursPerMonth: number
  savedCostPerMonth: number
  hourlyRateApprox: number
  totalMinutesPerMonth: number
  savedMinutesPerMonth: number
}

export function calculateBackoffice(inputs: BackofficeInputs): BackofficeOutputs {
  const workDays = 22
  const totalMinutesPerMonth = inputs.employees * inputs.minutesPerDay * workDays
  const savedMinutesPerMonth = totalMinutesPerMonth * (inputs.reductionPercent / 100)
  const savedHoursPerMonth = savedMinutesPerMonth / 60
  const hourlyRateApprox = inputs.monthlySalary / (22 * 8)
  const savedCostPerMonth = savedHoursPerMonth * hourlyRateApprox
  
  return {
    savedHoursPerMonth,
    savedCostPerMonth,
    hourlyRateApprox,
    totalMinutesPerMonth,
    savedMinutesPerMonth,
  }
}

export interface B2BInputs {
  leadsPerMonth: number
  meetingConvPercent: number
  clientConvPercent: number
  ltv: number
  serviceFeeMonthly: number
}

export interface B2BOutputs {
  meetingsPerMonth: number
  clientsPerMonth: number
  revenuePerMonth: number
  netBenefitPerMonth: number
  roi12MonthsPercent: number
}

export function calculateB2B(inputs: B2BInputs): B2BOutputs {
  const meetingsPerMonth = inputs.leadsPerMonth * (inputs.meetingConvPercent / 100)
  const clientsPerMonth = meetingsPerMonth * (inputs.clientConvPercent / 100)
  const revenuePerMonth = clientsPerMonth * inputs.ltv
  const netBenefitPerMonth = revenuePerMonth - inputs.serviceFeeMonthly
  
  const roi12MonthsPercent = 
    inputs.serviceFeeMonthly > 0
      ? ((revenuePerMonth * 12 - inputs.serviceFeeMonthly * 12) / (inputs.serviceFeeMonthly * 12)) * 100
      : 0
  
  return {
    meetingsPerMonth,
    clientsPerMonth,
    revenuePerMonth,
    netBenefitPerMonth,
    roi12MonthsPercent,
  }
}

export interface SEOInputs {
  organicTraffic: number
  convPercent: number
  leadValue: number
  growthPercent: number
  seoInvestment: number
}

export interface SEOOutputs {
  additionalVisits: number
  additionalLeads: number
  additionalRevenuePerMonth: number
  roi12MonthsPercent: number
}

export function calculateSEO(inputs: SEOInputs): SEOOutputs {
  const additionalVisits = inputs.organicTraffic * (inputs.growthPercent / 100)
  const additionalLeads = additionalVisits * (inputs.convPercent / 100)
  const additionalRevenuePerMonth = additionalLeads * inputs.leadValue
  
  const roi12MonthsPercent = 
    inputs.seoInvestment > 0
      ? ((additionalRevenuePerMonth * 12 - inputs.seoInvestment * 12) / (inputs.seoInvestment * 12)) * 100
      : 0
  
  return {
    additionalVisits,
    additionalLeads,
    additionalRevenuePerMonth,
    roi12MonthsPercent,
  }
}
