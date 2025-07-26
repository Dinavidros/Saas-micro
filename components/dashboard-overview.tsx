"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TrendingUp, TrendingDown, DollarSign, Users, Target, Crown, AlertTriangle } from "lucide-react"
import type { Campaign, RevenueData, KPIData, Influencer } from "@/lib/types"
import { formatCurrency, formatDate, getStatusBadgeClass } from "@/lib/utils"

interface DashboardOverviewProps {
  kpis: KPIData
  revenueData: RevenueData[]
  recentCampaigns: Campaign[]
  influencers: Influencer[]
}

interface InfluencerROI {
  name: string
  instagram: string
  campaigns: number
  totalRevenue: number
  totalCost: number
  totalProfit: number
  roi: number
  niche: string
}

export function DashboardOverview({ kpis, revenueData, recentCampaigns, influencers }: DashboardOverviewProps) {
  // Gerar dados mensais baseados nas campanhas reais
  const generateMonthlyData = (): RevenueData[] => {
    const monthlyData: { [key: string]: { revenue: number; expenses: number; profit: number } } = {}
    const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]

    // Inicializa os últimos 6 meses
    const currentDate = new Date()
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
      const monthName = months[date.getMonth()]
      monthlyData[monthName] = { revenue: 0, expenses: 0, profit: 0 }
    }

    // Agrupa campanhas por mês
    recentCampaigns.forEach((campaign) => {
      const campaignDate = new Date(campaign.startDate)
      const monthName = months[campaignDate.getMonth()]

      if (monthlyData[monthName]) {
        monthlyData[monthName].revenue += campaign.revenue
        monthlyData[monthName].expenses += campaign.cost
        monthlyData[monthName].profit += campaign.profit
      }
    })

    // Se não há dados reais, usa dados de demonstração
    const hasRealData = Object.values(monthlyData).some((data) => data.revenue > 0)

    if (!hasRealData && recentCampaigns.length === 0) {
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

  // Calcular ROI por influenciador
  const calculateInfluencerROI = (): InfluencerROI[] => {
    const influencerStats: { [key: string]: InfluencerROI } = {}

    // Inicializa dados dos influenciadores
    influencers.forEach((influencer) => {
      influencerStats[influencer.name] = {
        name: influencer.name,
        instagram: influencer.instagram,
        campaigns: 0,
        totalRevenue: 0,
        totalCost: 0,
        totalProfit: 0,
        roi: 0,
        niche: influencer.niche,
      }
    })

    // Agrega dados das campanhas
    recentCampaigns.forEach((campaign) => {
      if (influencerStats[campaign.influencer]) {
        const stats = influencerStats[campaign.influencer]
        stats.campaigns += 1
        stats.totalRevenue += campaign.revenue
        stats.totalCost += campaign.cost
        stats.totalProfit += campaign.profit
      }
    })

    // Calcula ROI
    Object.values(influencerStats).forEach((stats) => {
      if (stats.totalCost > 0) {
        stats.roi = stats.totalProfit / stats.totalCost
      }
    })

    // Retorna apenas influenciadores com campanhas, ordenados por ROI
    return Object.values(influencerStats)
      .filter((stats) => stats.campaigns > 0)
      .sort((a, b) => b.roi - a.roi)
  }

  const monthlyData = generateMonthlyData()
  const influencerROIData = calculateInfluencerROI()

  // Dados para gráfico de pizza de status
  const statusData = [
    { name: "Ativas", value: recentCampaigns.filter((c) => c.status === "ativa").length, color: "#10b981" },
    { name: "Encerradas", value: recentCampaigns.filter((c) => c.status === "encerrada").length, color: "#6b7280" },
    { name: "Planejadas", value: recentCampaigns.filter((c) => c.status === "planejada").length, color: "#3b82f6" },
  ].filter((item) => item.value > 0)

  const getROIColor = (roi: number): string => {
    if (roi >= 2.5) return "text-green-600 bg-green-50"
    if (roi >= 2.0) return "text-green-500 bg-green-50"
    if (roi >= 1.5) return "text-yellow-600 bg-yellow-50"
    if (roi >= 1.0) return "text-orange-600 bg-orange-50"
    return "text-red-600 bg-red-50"
  }

  const getROIIcon = (roi: number) => {
    if (roi >= 2.5) return <Crown className="h-4 w-4 text-yellow-500" />
    if (roi < 1.0) return <AlertTriangle className="h-4 w-4 text-red-500" />
    return null
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-600">Visão geral das suas campanhas e resultados</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faturamento Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(kpis.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              {recentCampaigns.length > 0
                ? `${recentCampaigns.length} campanhas registradas`
                : "Adicione campanhas para ver dados"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gastos com Influenciadores</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(kpis.totalCosts)}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingDown className="inline h-3 w-3 mr-1" />
              {kpis.activeCampaigns} campanhas ativas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lucro Líquido</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(kpis.totalProfit)}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              ROI médio: {kpis.averageROI.toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Faturamento vs Lucro Mensal */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Faturamento vs Lucro Mensal</CardTitle>
            <CardDescription>
              {recentCampaigns.length > 0
                ? "Comparativo mensal baseado nas suas campanhas"
                : "Dados de demonstração - adicione campanhas para ver dados reais"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}K`} />
                <Tooltip
                  formatter={(value, name) => [
                    formatCurrency(Number(value)),
                    name === "revenue" ? "Faturamento" : "Lucro",
                  ]}
                  labelFormatter={(label) => `Mês: ${label}`}
                />
                <Bar dataKey="revenue" fill="#3b82f6" name="Faturamento" radius={[4, 4, 0, 0]} />
                <Bar dataKey="profit" fill="#10b981" name="Lucro" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status das Campanhas */}
        <Card>
          <CardHeader>
            <CardTitle>Status das Campanhas</CardTitle>
            <CardDescription>Distribuição por status</CardDescription>
          </CardHeader>
          <CardContent>
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [value, name]} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500">
                <div className="text-center">
                  <Target className="mx-auto h-12 w-12 text-gray-300 mb-2" />
                  <p>Nenhuma campanha</p>
                </div>
              </div>
            )}
            <div className="mt-4 space-y-2">
              {statusData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }} />
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Despesas com Influenciadores */}
      <Card>
        <CardHeader>
          <CardTitle>Despesas com Influenciadores</CardTitle>
          <CardDescription>Evolução mensal dos gastos</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}K`} />
              <Tooltip
                formatter={(value) => [formatCurrency(Number(value)), "Despesas"]}
                labelFormatter={(label) => `Mês: ${label}`}
              />
              <Line
                type="monotone"
                dataKey="expenses"
                stroke="#ef4444"
                strokeWidth={3}
                dot={{ fill: "#ef4444", strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, stroke: "#ef4444", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Ranking de Influenciadores por ROI */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Crown className="mr-2 h-5 w-5 text-yellow-500" />
            Ranking de Influenciadores por ROI
          </CardTitle>
          <CardDescription>
            Influenciadores ordenados por retorno sobre investimento
            {influencerROIData.length === 0 && " - Adicione campanhas para ver o ranking"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {influencerROIData.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Posição</TableHead>
                  <TableHead>Influenciador</TableHead>
                  <TableHead>Nicho</TableHead>
                  <TableHead>Campanhas</TableHead>
                  <TableHead>Investimento</TableHead>
                  <TableHead>Receita</TableHead>
                  <TableHead>Lucro</TableHead>
                  <TableHead>ROI</TableHead>
                  <TableHead>Performance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {influencerROIData.map((influencer, index) => (
                  <TableRow key={influencer.name} className={index < 3 ? "bg-yellow-50/30" : ""}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        {index === 0 && <Crown className="h-4 w-4 text-yellow-500 mr-1" />}
                        {index === 1 && <div className="h-4 w-4 bg-gray-400 rounded-full mr-1" />}
                        {index === 2 && <div className="h-4 w-4 bg-amber-600 rounded-full mr-1" />}#{index + 1}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{influencer.name}</div>
                        <div className="text-sm text-gray-500">{influencer.instagram}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{influencer.niche}</Badge>
                    </TableCell>
                    <TableCell>{influencer.campaigns}</TableCell>
                    <TableCell>{formatCurrency(influencer.totalCost)}</TableCell>
                    <TableCell>{formatCurrency(influencer.totalRevenue)}</TableCell>
                    <TableCell className="text-green-600 font-medium">
                      {formatCurrency(influencer.totalProfit)}
                    </TableCell>
                    <TableCell>
                      <div
                        className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${getROIColor(influencer.roi)}`}
                      >
                        {getROIIcon(influencer.roi)}
                        <span className="ml-1">{influencer.roi.toFixed(2)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {influencer.roi >= 2.5 ? (
                        <Badge className="bg-green-100 text-green-800">🏆 Excelente</Badge>
                      ) : influencer.roi >= 2.0 ? (
                        <Badge className="bg-green-100 text-green-700">✅ Muito Bom</Badge>
                      ) : influencer.roi >= 1.5 ? (
                        <Badge className="bg-yellow-100 text-yellow-700">⚡ Bom</Badge>
                      ) : influencer.roi >= 1.0 ? (
                        <Badge className="bg-orange-100 text-orange-700">⚠️ Regular</Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-800">❌ Baixo</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Crown className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <p>Nenhum dado de ROI disponível ainda.</p>
              <p className="text-sm">Adicione campanhas para ver o ranking de influenciadores.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Campaigns Table */}
      <Card>
        <CardHeader>
          <CardTitle>Últimas Campanhas</CardTitle>
          <CardDescription>
            {recentCampaigns.length > 0
              ? "Resumo das campanhas mais recentes"
              : "Nenhuma campanha encontrada. Adicione campanhas para ver os dados aqui."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentCampaigns.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campanha</TableHead>
                  <TableHead>Influenciador</TableHead>
                  <TableHead>Período</TableHead>
                  <TableHead>Investimento</TableHead>
                  <TableHead>Receita</TableHead>
                  <TableHead>Lucro</TableHead>
                  <TableHead>ROI</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentCampaigns.slice(0, 5).map((campaign) => {
                  const roi = campaign.cost > 0 ? campaign.profit / campaign.cost : 0
                  return (
                    <TableRow key={campaign.id}>
                      <TableCell className="font-medium">{campaign.name}</TableCell>
                      <TableCell>{campaign.influencer}</TableCell>
                      <TableCell>
                        {formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}
                      </TableCell>
                      <TableCell>{formatCurrency(campaign.cost)}</TableCell>
                      <TableCell>{formatCurrency(campaign.revenue)}</TableCell>
                      <TableCell className="text-green-600 font-medium">{formatCurrency(campaign.profit)}</TableCell>
                      <TableCell>
                        <span
                          className={`font-medium ${roi >= 2.5 ? "text-green-600" : roi < 1.0 ? "text-red-600" : "text-yellow-600"}`}
                        >
                          {roi.toFixed(2)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeClass(campaign.status)}>{campaign.status}</Badge>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Target className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <p>Nenhuma campanha cadastrada ainda.</p>
              <p className="text-sm">Vá para a seção "Campanhas" para adicionar sua primeira campanha.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
