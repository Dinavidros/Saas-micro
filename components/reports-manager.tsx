"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileText, FileSpreadsheet } from "lucide-react"
import type { Campaign, Influencer, KPIData } from "@/lib/types"
import { formatCurrency, calculateCampaignDuration, calculateCPM } from "@/lib/utils"

interface ReportsManagerProps {
  campaigns: Campaign[]
  influencers: Influencer[]
  kpis: KPIData
}

export function ReportsManager({ campaigns, influencers, kpis }: ReportsManagerProps) {
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [selectedInfluencer, setSelectedInfluencer] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")

  // Filtrar campanhas baseado nos filtros
  const filteredCampaigns = campaigns.filter((campaign) => {
    const campaignDate = new Date(campaign.startDate)
    const fromDate = dateFrom ? new Date(dateFrom) : null
    const toDate = dateTo ? new Date(dateTo) : null

    const matchesDateRange = (!fromDate || campaignDate >= fromDate) && (!toDate || campaignDate <= toDate)

    const matchesInfluencer = selectedInfluencer === "all" || campaign.influencer === selectedInfluencer
    const matchesStatus = selectedStatus === "all" || campaign.status === selectedStatus

    return matchesDateRange && matchesInfluencer && matchesStatus
  })

  // Calcular KPIs filtrados
  const filteredKPIs = {
    totalRevenue: filteredCampaigns.reduce((sum, c) => sum + c.revenue, 0),
    totalCosts: filteredCampaigns.reduce((sum, c) => sum + c.cost, 0),
    totalProfit: filteredCampaigns.reduce((sum, c) => sum + c.profit, 0),
    totalCampaigns: filteredCampaigns.length,
    activeCampaigns: filteredCampaigns.filter((c) => c.status === "ativa").length,
    averageROI:
      filteredCampaigns.length > 0
        ? filteredCampaigns.reduce((sum, c) => sum + c.profit / c.cost, 0) / filteredCampaigns.length
        : 0,
    averageTicket:
      filteredCampaigns.length > 0
        ? filteredCampaigns.reduce((sum, c) => sum + c.revenue, 0) / filteredCampaigns.length
        : 0,
  }

  const calculateROI = (profit: number, cost: number): number => {
    if (cost === 0) return 0
    return profit / cost
  }

  const getROIColor = (roi: number): string => {
    if (roi >= 2) return "text-green-600"
    if (roi >= 1) return "text-yellow-600"
    return "text-red-600"
  }

  const exportToCSV = () => {
    const headers = [
      "Campanha",
      "Influenciador",
      "Nicho",
      "Data Início",
      "Data Fim",
      "Duração (dias)",
      "Investimento",
      "Receita",
      "Lucro",
      "ROI",
      "Status",
      "CPM",
    ]

    const csvData = filteredCampaigns.map((campaign) => {
      const influencer = influencers.find((i) => i.name === campaign.influencer)
      const duration = calculateCampaignDuration(campaign.startDate, campaign.endDate)
      const roi = calculateROI(campaign.profit, campaign.cost)
      const cpm = calculateCPM(campaign.cost, influencer?.followers || "1K")

      return [
        campaign.name,
        campaign.influencer,
        influencer?.niche || "",
        campaign.startDate,
        campaign.endDate,
        duration,
        campaign.cost,
        campaign.revenue,
        campaign.profit,
        roi.toFixed(2),
        campaign.status,
        cpm,
      ]
    })

    const csvContent = [headers, ...csvData].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `relatorio-campanhas-${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const exportToPDF = () => {
    // Implementação básica - em produção usaria uma biblioteca como jsPDF
    alert("Funcionalidade de exportação PDF será implementada em breve!")
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Relatórios</h2>
          <p className="text-gray-600">Análises detalhadas e exportação de dados</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={exportToCSV}>
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Exportar CSV
          </Button>
          <Button variant="outline" onClick={exportToPDF}>
            <FileText className="mr-2 h-4 w-4" />
            Exportar PDF
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Filtre os dados para análises específicas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="date-from">Data Início</Label>
              <Input id="date-from" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="date-to">Data Fim</Label>
              <Input id="date-to" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="influencer-filter">Influenciador</Label>
              <Select value={selectedInfluencer} onValueChange={setSelectedInfluencer}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {influencers.map((influencer) => (
                    <SelectItem key={influencer.id} value={influencer.name}>
                      {influencer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status-filter">Status</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="ativa">Ativa</SelectItem>
                  <SelectItem value="encerrada">Encerrada</SelectItem>
                  <SelectItem value="planejada">Planejada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4 flex space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                setDateFrom("")
                setDateTo("")
                setSelectedInfluencer("all")
                setSelectedStatus("all")
              }}
            >
              Limpar Filtros
            </Button>
            <Button variant="outline">Aplicar Filtros</Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Campanhas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredKPIs.totalCampaigns}</div>
            <p className="text-xs text-muted-foreground">
              {filteredKPIs.totalCampaigns !== kpis.totalCampaigns && `de ${kpis.totalCampaigns} campanhas totais`}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Campanhas Ativas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{filteredKPIs.activeCampaigns}</div>
            <p className="text-xs text-muted-foreground">
              {((filteredKPIs.activeCampaigns / filteredKPIs.totalCampaigns) * 100 || 0).toFixed(1)}% do total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">ROI Médio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getROIColor(filteredKPIs.averageROI)}`}>
              {filteredKPIs.averageROI.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {filteredKPIs.averageROI >= 1 ? "Lucro positivo" : "Necessita otimização"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{formatCurrency(filteredKPIs.averageTicket)}</div>
            <p className="text-xs text-muted-foreground">Receita média por campanha</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Report Table */}
      <Card>
        <CardHeader>
          <CardTitle>Relatório Detalhado</CardTitle>
          <CardDescription>
            Análise completa de performance por campanha
            {filteredCampaigns.length !== campaigns.length &&
              ` (${filteredCampaigns.length} de ${campaigns.length} campanhas)`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredCampaigns.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campanha</TableHead>
                  <TableHead>Influenciador</TableHead>
                  <TableHead>Nicho</TableHead>
                  <TableHead>Duração (dias)</TableHead>
                  <TableHead>Investimento</TableHead>
                  <TableHead>Receita</TableHead>
                  <TableHead>Lucro</TableHead>
                  <TableHead>ROI</TableHead>
                  <TableHead>CPM</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCampaigns.map((campaign) => {
                  const influencer = influencers.find((i) => i.name === campaign.influencer)
                  const duration = calculateCampaignDuration(campaign.startDate, campaign.endDate)
                  const roi = calculateROI(campaign.profit, campaign.cost)
                  const cpm = calculateCPM(campaign.cost, influencer?.followers || "1K")

                  return (
                    <TableRow key={campaign.id}>
                      <TableCell className="font-medium">{campaign.name}</TableCell>
                      <TableCell>{campaign.influencer}</TableCell>
                      <TableCell>{influencer?.niche || "-"}</TableCell>
                      <TableCell>{duration}</TableCell>
                      <TableCell>{formatCurrency(campaign.cost)}</TableCell>
                      <TableCell>{formatCurrency(campaign.revenue)}</TableCell>
                      <TableCell className="text-green-600 font-medium">{formatCurrency(campaign.profit)}</TableCell>
                      <TableCell className={`font-medium ${getROIColor(roi)}`}>{roi.toFixed(2)}</TableCell>
                      <TableCell>R$ {cpm}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            campaign.status === "ativa"
                              ? "bg-green-100 text-green-800"
                              : campaign.status === "encerrada"
                                ? "bg-gray-100 text-gray-800"
                                : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {campaign.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FileText className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <p>Nenhuma campanha encontrada com os filtros aplicados.</p>
              <p className="text-sm">Tente ajustar os filtros ou adicionar mais campanhas.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
