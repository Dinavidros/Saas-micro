"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { DashboardOverview } from "@/components/dashboard-overview"
import { mockInfluencers, mockCampaigns, mockRevenueData } from "@/lib/data"
import { calculateKPIs } from "@/lib/utils"

// Importar outros componentes conforme necessário
import { InfluencersManager } from "@/components/influencers-manager"
import { CampaignsManager } from "@/components/campaigns-manager"
import { ReportsManager } from "@/components/reports-manager"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [influencers, setInfluencers] = useState(mockInfluencers)
  const [campaigns, setCampaigns] = useState(mockCampaigns)

  // Recalcula KPIs sempre que campaigns mudar
  const kpis = calculateKPIs(campaigns)

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <DashboardOverview
            kpis={kpis}
            revenueData={mockRevenueData}
            recentCampaigns={campaigns}
            influencers={influencers}
          />
        )
      case "influencers":
        return <InfluencersManager influencers={influencers} setInfluencers={setInfluencers} />
      case "campaigns":
        return <CampaignsManager campaigns={campaigns} setCampaigns={setCampaigns} influencers={influencers} />
      case "reports":
        return <ReportsManager campaigns={campaigns} influencers={influencers} kpis={kpis} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex-1 p-8">{renderContent()}</div>
      </div>
    </div>
  )
}
