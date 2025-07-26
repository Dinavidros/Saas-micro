"use client"

import { Button } from "@/components/ui/button"
import { TrendingUp, Users, Target, Calendar } from "lucide-react"

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: TrendingUp },
    { id: "influencers", label: "Microinfluenciadores", icon: Users },
    { id: "campaigns", label: "Campanhas", icon: Target },
    { id: "reports", label: "Relatórios", icon: Calendar },
  ]

  return (
    <div className="w-64 bg-white shadow-sm border-r min-h-screen">
      <div className="p-6">
        <h1 className="text-xl font-bold text-gray-900">InfluencerHub</h1>
        <p className="text-sm text-gray-500">Painel Administrativo</p>
      </div>

      <nav className="px-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <Button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              variant="ghost"
              className={`w-full justify-start ${
                activeTab === item.id
                  ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Icon className="mr-3 h-4 w-4" />
              {item.label}
            </Button>
          )
        })}
      </nav>
    </div>
  )
}
