import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Campaign, KPIData, RevenueData } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateKPIs(campaigns: Campaign[]): KPIData {
  const totalRevenue = campaigns.reduce((sum, campaign) => sum + campaign.revenue, 0)
  const totalCosts = campaigns.reduce((sum, campaign) => sum + campaign.cost, 0)
  const totalProfit = totalRevenue - totalCosts
  const totalCampaigns = campaigns.length
  const activeCampaigns = campaigns.filter((c) => c.status === "ativa").length
  const averageROI =
    campaigns.length > 0 ? campaigns.reduce((sum, c) => sum + (c.profit / c.cost) * 100, 0) / campaigns.length : 0
  const averageTicket = campaigns.length > 0 ? totalRevenue / campaigns.length : 0

  return {
    totalRevenue,
    totalCosts,
    totalProfit,
    totalCampaigns,
    activeCampaigns,
    averageROI,
    averageTicket,
  }
}

export function generateRevenueData(campaigns: Campaign[]): RevenueData[] {
  const monthlyData: { [key: string]: { revenue: number; expenses: number; profit: number } } = {}

  // Inicializa os últimos 6 meses
  const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]
  const currentMonth = new Date().getMonth()

  for (let i = 5; i >= 0; i--) {
    const monthIndex = (currentMonth - i + 12) % 12
    const monthName = months[monthIndex]
    monthlyData[monthName] = { revenue: 0, expenses: 0, profit: 0 }
  }

  // Agrupa campanhas por mês
  campaigns.forEach((campaign) => {
    const campaignDate = new Date(campaign.startDate)
    const monthName = months[campaignDate.getMonth()]

    if (monthlyData[monthName]) {
      monthlyData[monthName].revenue += campaign.revenue
      monthlyData[monthName].expenses += campaign.cost
      monthlyData[monthName].profit += campaign.profit
    }
  })

  // Se não há dados reais, usa dados mockados para demonstração
  const hasRealData = Object.values(monthlyData).some((data) => data.revenue > 0)

  if (!hasRealData) {
    return [
      { month: "Jan", revenue: 45000, profit: 32000, expenses: 13000 },
      { month: "Fev", revenue: 52000, profit: 38000, expenses: 14000 },
      { month: "Mar", revenue: 48000, profit: 35000, expenses: 13000 },
      { month: "Abr", revenue: 61000, profit: 45000, expenses: 16000 },
      { month: "Mai", revenue: 55000, profit: 41000, expenses: 14000 },
      { month: "Jun", revenue: 67000, profit: 50000, expenses: 17000 },
    ]
  }

  return Object.entries(monthlyData).map(([month, data]) => ({
    month,
    revenue: data.revenue,
    profit: data.profit,
    expenses: data.expenses,
  }))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("pt-BR")
}

export function getStatusBadgeClass(status: string): string {
  const variants = {
    ativa: "bg-green-100 text-green-800",
    encerrada: "bg-gray-100 text-gray-800",
    planejada: "bg-blue-100 text-blue-800",
  }
  return variants[status as keyof typeof variants] || variants.planejada
}

export function openWhatsApp(phone: string, name: string): void {
  const message = encodeURIComponent(`Olá ${name}, tudo bem? Gostaria de conversar sobre uma nova colaboração.`)
  window.open(`https://wa.me/${phone.replace(/\D/g, "")}?text=${message}`, "_blank")
}

export function calculateCampaignDuration(startDate: string, endDate: string): number {
  return Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))
}

export function calculateCPM(cost: number, followers: string): string {
  const followersCount = Number.parseInt(followers.replace("K", "000"))
  return (cost / (followersCount / 1000)).toFixed(2)
}
