export interface Influencer {
  id: number
  name: string
  instagram: string
  profileUrl: string
  whatsapp: string
  niche: string
  engagement: string
  followers: string
  notes: string
  createdAt?: string
  updatedAt?: string
}

export interface Campaign {
  id: number
  name: string
  influencer: string
  influencerId?: number
  startDate: string
  endDate: string
  cost: number
  revenue: number
  profit: number
  status: "ativa" | "encerrada" | "planejada"
  createdAt?: string
  updatedAt?: string
}

export interface RevenueData {
  month: string
  revenue: number
  profit: number
  expenses: number
}

export interface KPIData {
  totalRevenue: number
  totalCosts: number
  totalProfit: number
  totalCampaigns: number
  activeCampaigns: number
  averageROI: number
  averageTicket: number
}
