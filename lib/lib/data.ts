import type { Influencer, Campaign, RevenueData } from "./types"

// Mock data - substitua por chamadas de API
export const mockInfluencers: Influencer[] = [
  {
    id: 1,
    name: "Ana Silva",
    instagram: "@anasilva_fit",
    profileUrl: "https://instagram.com/anasilva_fit",
    whatsapp: "+5511999999999",
    niche: "Fitness",
    engagement: "4.2%",
    followers: "25K",
    notes: "Ótima conversão em produtos de emagrecimento",
  },
  {
    id: 2,
    name: "Carlos Mendes",
    instagram: "@carlostech",
    profileUrl: "https://instagram.com/carlostech",
    whatsapp: "+5511888888888",
    niche: "Tecnologia",
    engagement: "3.8%",
    followers: "18K",
    notes: "Especialista em cursos de programação",
  },
  {
    id: 3,
    name: "Mariana Costa",
    instagram: "@mari_empreende",
    profileUrl: "https://instagram.com/mari_empreende",
    whatsapp: "+5511777777777",
    niche: "Empreendedorismo",
    engagement: "5.1%",
    followers: "32K",
    notes: "Foco em infoprodutos de negócios",
  },
]

export const mockCampaigns: Campaign[] = [
  {
    id: 1,
    name: "Curso Emagrecimento Definitivo",
    influencer: "Ana Silva",
    influencerId: 1,
    startDate: "2024-01-15",
    endDate: "2024-01-30",
    cost: 2500,
    revenue: 8500,
    profit: 6000,
    status: "encerrada",
  },
  {
    id: 2,
    name: "Bootcamp Full Stack",
    influencer: "Carlos Mendes",
    influencerId: 2,
    startDate: "2024-02-01",
    endDate: "2024-02-15",
    cost: 3000,
    revenue: 12000,
    profit: 9000,
    status: "encerrada",
  },
  {
    id: 3,
    name: "Mentoria Empreendedora",
    influencer: "Mariana Costa",
    influencerId: 3,
    startDate: "2024-03-01",
    endDate: "2024-03-31",
    cost: 4000,
    revenue: 15000,
    profit: 11000,
    status: "ativa",
  },
]

export const mockRevenueData: RevenueData[] = [
  { month: "Jan", revenue: 45000, profit: 32000, expenses: 13000 },
  { month: "Fev", revenue: 52000, profit: 38000, expenses: 14000 },
  { month: "Mar", revenue: 48000, profit: 35000, expenses: 13000 },
  { month: "Abr", revenue: 61000, profit: 45000, expenses: 16000 },
  { month: "Mai", revenue: 55000, profit: 41000, expenses: 14000 },
  { month: "Jun", revenue: 67000, profit: 50000, expenses: 17000 },
]
