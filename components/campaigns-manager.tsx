"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Plus, Eye, Edit, Trash2, Search, Calendar, DollarSign } from "lucide-react"
import type { Campaign, Influencer } from "@/lib/types"
import { formatCurrency, formatDate, getStatusBadgeClass } from "@/lib/utils"
import { DeleteConfirmationDialog } from "./delete-confirmation-dialog"

interface CampaignsManagerProps {
  campaigns: Campaign[]
  setCampaigns: (campaigns: Campaign[]) => void
  influencers: Influencer[]
}

interface CampaignFormData {
  name: string
  influencer: string
  startDate: string
  endDate: string
  cost: string
  revenue: string
  status: "ativa" | "encerrada" | "planejada"
}

export function CampaignsManager({ campaigns, setCampaigns, influencers }: CampaignsManagerProps) {
  const [isAddCampaignOpen, setIsAddCampaignOpen] = useState(false)
  const [isViewCampaignOpen, setIsViewCampaignOpen] = useState(false)
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null)
  const [viewingCampaign, setViewingCampaign] = useState<Campaign | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [influencerFilter, setInfluencerFilter] = useState("all")

  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; campaign: Campaign | null }>({
    isOpen: false,
    campaign: null,
  })

  const [campaignFormData, setCampaignFormData] = useState<CampaignFormData>({
    name: "",
    influencer: "",
    startDate: "",
    endDate: "",
    cost: "",
    revenue: "",
    status: "planejada",
  })

  // Filtros aplicados
  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch =
      campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.influencer.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || campaign.status === statusFilter
    const matchesInfluencer = influencerFilter === "all" || campaign.influencer === influencerFilter

    return matchesSearch && matchesStatus && matchesInfluencer
  })

  const resetForm = () => {
    setCampaignFormData({
      name: "",
      influencer: "",
      startDate: "",
      endDate: "",
      cost: "",
      revenue: "",
      status: "planejada",
    })
    setEditingCampaign(null)
  }

  const validateForm = (): boolean => {
    if (!campaignFormData.name.trim()) {
      alert("Nome da campanha é obrigatório!")
      return false
    }
    if (!campaignFormData.influencer) {
      alert("Selecione um influenciador!")
      return false
    }
    if (!campaignFormData.startDate) {
      alert("Data de início é obrigatória!")
      return false
    }
    if (!campaignFormData.endDate) {
      alert("Data de fim é obrigatória!")
      return false
    }
    if (new Date(campaignFormData.startDate) >= new Date(campaignFormData.endDate)) {
      alert("Data de fim deve ser posterior à data de início!")
      return false
    }
    return true
  }

  const parseMoneyValue = (value: string): number => {
    return Number.parseFloat(value.replace(/[^\d,.-]/g, "").replace(",", ".")) || 0
  }

  const formatMoneyInput = (value: string): string => {
    const numericValue = value.replace(/[^\d]/g, "")
    if (!numericValue) return ""

    const number = Number.parseInt(numericValue) / 100
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(number)
  }

  const handleMoneyInputChange = (field: "cost" | "revenue", value: string) => {
    const formatted = formatMoneyInput(value)
    setCampaignFormData({ ...campaignFormData, [field]: formatted })
  }

  const handleAddCampaign = () => {
    if (!validateForm()) return

    const cost = parseMoneyValue(campaignFormData.cost)
    const revenue = parseMoneyValue(campaignFormData.revenue)
    const profit = revenue - cost

    if (editingCampaign) {
      // Atualizar campanha existente
      const updatedCampaign: Campaign = {
        ...editingCampaign,
        name: campaignFormData.name.trim(),
        influencer: campaignFormData.influencer,
        startDate: campaignFormData.startDate,
        endDate: campaignFormData.endDate,
        cost,
        revenue,
        profit,
        status: campaignFormData.status,
        updatedAt: new Date().toISOString(),
      }

      setCampaigns(campaigns.map((c) => (c.id === editingCampaign.id ? updatedCampaign : c)))
      alert("Campanha atualizada com sucesso!")
    } else {
      // Criar nova campanha
      const newCampaign: Campaign = {
        id: Date.now(),
        name: campaignFormData.name.trim(),
        influencer: campaignFormData.influencer,
        influencerId: influencers.find((i) => i.name === campaignFormData.influencer)?.id,
        startDate: campaignFormData.startDate,
        endDate: campaignFormData.endDate,
        cost,
        revenue,
        profit,
        status: campaignFormData.status,
        createdAt: new Date().toISOString(),
      }

      setCampaigns([...campaigns, newCampaign])
      alert("Campanha criada com sucesso!")
    }

    resetForm()
    setIsAddCampaignOpen(false)
  }

  const handleEditCampaign = (campaign: Campaign) => {
    setEditingCampaign(campaign)
    setCampaignFormData({
      name: campaign.name,
      influencer: campaign.influencer,
      startDate: campaign.startDate,
      endDate: campaign.endDate,
      cost: formatCurrency(campaign.cost),
      revenue: formatCurrency(campaign.revenue),
      status: campaign.status,
    })
    setIsAddCampaignOpen(true)
  }

  const handleViewCampaign = (campaign: Campaign) => {
    setViewingCampaign(campaign)
    setIsViewCampaignOpen(true)
  }

  const handleDeleteCampaign = (campaign: Campaign) => {
    setDeleteDialog({ isOpen: true, campaign })
  }

  const confirmDeleteCampaign = () => {
    if (deleteDialog.campaign) {
      setCampaigns(campaigns.filter((c) => c.id !== deleteDialog.campaign!.id))
      setDeleteDialog({ isOpen: false, campaign: null })
      alert("Campanha excluída com sucesso!")
    }
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Campanhas</h2>
          <p className="text-gray-600">Gerencie suas colaborações e campanhas</p>
        </div>
        <Button onClick={() => setIsAddCampaignOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Campanha
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar campanha ou influenciador..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="ativa">Ativa</SelectItem>
                <SelectItem value="encerrada">Encerrada</SelectItem>
                <SelectItem value="planejada">Planejada</SelectItem>
              </SelectContent>
            </Select>
            <Select value={influencerFilter} onValueChange={setInfluencerFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Influenciador" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Influenciadores</SelectItem>
                {influencers.map((influencer) => (
                  <SelectItem key={influencer.id} value={influencer.name}>
                    {influencer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setStatusFilter("all")
                setInfluencerFilter("all")
              }}
            >
              Limpar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Total de Campanhas</p>
                <p className="text-2xl font-bold">{filteredCampaigns.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 bg-green-500 rounded-full" />
              <div>
                <p className="text-sm text-gray-600">Ativas</p>
                <p className="text-2xl font-bold text-green-600">
                  {filteredCampaigns.filter((c) => c.status === "ativa").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Receita Total</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(filteredCampaigns.reduce((sum, c) => sum + c.revenue, 0))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 bg-blue-500 rounded-full" />
              <div>
                <p className="text-sm text-gray-600">ROI Médio</p>
                <p className="text-2xl font-bold text-blue-600">
                  {filteredCampaigns.length > 0
                    ? (
                        filteredCampaigns.reduce((sum, c) => sum + calculateROI(c.profit, c.cost), 0) /
                        filteredCampaigns.length
                      ).toFixed(2)
                    : "0.00"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Campanhas */}
      <Card>
        <CardHeader>
          <CardTitle>
            {filteredCampaigns.length === campaigns.length
              ? "Todas as Campanhas"
              : `Campanhas Filtradas (${filteredCampaigns.length})`}
          </CardTitle>
          <CardDescription>
            {filteredCampaigns.length > 0
              ? "Histórico completo de campanhas e colaborações"
              : "Nenhuma campanha encontrada com os filtros aplicados"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredCampaigns.length > 0 ? (
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
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCampaigns.map((campaign) => {
                  const roi = calculateROI(campaign.profit, campaign.cost)
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
                      <TableCell className={`font-medium ${getROIColor(roi)}`}>{roi.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeClass(campaign.status)}>{campaign.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => handleViewCampaign(campaign)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleEditCampaign(campaign)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteCampaign(campaign)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <p>Nenhuma campanha encontrada.</p>
              <p className="text-sm">
                {campaigns.length === 0
                  ? "Clique em 'Nova Campanha' para adicionar sua primeira campanha."
                  : "Tente ajustar os filtros para encontrar campanhas."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog para Adicionar/Editar Campanha */}
      <Dialog
        open={isAddCampaignOpen}
        onOpenChange={(open) => {
          setIsAddCampaignOpen(open)
          if (!open) resetForm()
        }}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingCampaign ? "Editar Campanha" : "Nova Campanha"}</DialogTitle>
            <DialogDescription>
              {editingCampaign ? "Edite as informações da campanha" : "Crie uma nova campanha com influenciador"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="campaign-name" className="text-right">
                Nome *
              </Label>
              <Input
                id="campaign-name"
                value={campaignFormData.name}
                onChange={(e) => setCampaignFormData({ ...campaignFormData, name: e.target.value })}
                className="col-span-3"
                placeholder="Ex: Curso de Emagrecimento"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="influencer-select" className="text-right">
                Influenciador *
              </Label>
              <Select
                value={campaignFormData.influencer}
                onValueChange={(value) => setCampaignFormData({ ...campaignFormData, influencer: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione o influenciador" />
                </SelectTrigger>
                <SelectContent>
                  {influencers.map((influencer) => (
                    <SelectItem key={influencer.id} value={influencer.name}>
                      {influencer.name} ({influencer.instagram})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="start-date" className="text-right">
                Data Início *
              </Label>
              <Input
                id="start-date"
                type="date"
                value={campaignFormData.startDate}
                onChange={(e) => setCampaignFormData({ ...campaignFormData, startDate: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="end-date" className="text-right">
                Data Fim *
              </Label>
              <Input
                id="end-date"
                type="date"
                value={campaignFormData.endDate}
                onChange={(e) => setCampaignFormData({ ...campaignFormData, endDate: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cost" className="text-right">
                Valor Pago
              </Label>
              <Input
                id="cost"
                placeholder="R$ 0,00"
                value={campaignFormData.cost}
                onChange={(e) => handleMoneyInputChange("cost", e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="revenue" className="text-right">
                Receita
              </Label>
              <Input
                id="revenue"
                placeholder="R$ 0,00"
                value={campaignFormData.revenue}
                onChange={(e) => handleMoneyInputChange("revenue", e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select
                value={campaignFormData.status}
                onValueChange={(value) => setCampaignFormData({ ...campaignFormData, status: value as any })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planejada">Planejada</SelectItem>
                  <SelectItem value="ativa">Ativa</SelectItem>
                  <SelectItem value="encerrada">Encerrada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddCampaignOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddCampaign}>{editingCampaign ? "Atualizar Campanha" : "Criar Campanha"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para Visualizar Campanha */}
      <Dialog open={isViewCampaignOpen} onOpenChange={setIsViewCampaignOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Detalhes da Campanha</DialogTitle>
            <DialogDescription>Informações completas da campanha</DialogDescription>
          </DialogHeader>
          {viewingCampaign && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Nome da Campanha</Label>
                  <p className="text-lg font-semibold">{viewingCampaign.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Status</Label>
                  <div className="mt-1">
                    <Badge className={getStatusBadgeClass(viewingCampaign.status)}>{viewingCampaign.status}</Badge>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Influenciador</Label>
                  <p className="text-lg">{viewingCampaign.influencer}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Período</Label>
                  <p className="text-lg">
                    {formatDate(viewingCampaign.startDate)} - {formatDate(viewingCampaign.endDate)}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Investimento</Label>
                  <p className="text-lg font-semibold text-red-600">{formatCurrency(viewingCampaign.cost)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Receita</Label>
                  <p className="text-lg font-semibold text-green-600">{formatCurrency(viewingCampaign.revenue)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Lucro</Label>
                  <p className="text-lg font-semibold text-blue-600">{formatCurrency(viewingCampaign.profit)}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">ROI (Return on Investment)</Label>
                <p
                  className={`text-2xl font-bold ${getROIColor(calculateROI(viewingCampaign.profit, viewingCampaign.cost))}`}
                >
                  {calculateROI(viewingCampaign.profit, viewingCampaign.cost).toFixed(2)}
                </p>
                <p className="text-sm text-gray-500">
                  Para cada R$ 1,00 investido, você obteve R${" "}
                  {(calculateROI(viewingCampaign.profit, viewingCampaign.cost) + 1).toFixed(2)} de retorno
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewCampaignOpen(false)}>
              Fechar
            </Button>
            {viewingCampaign && (
              <Button
                onClick={() => {
                  setIsViewCampaignOpen(false)
                  handleEditCampaign(viewingCampaign)
                }}
              >
                Editar Campanha
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Confirmação de Exclusão */}
      <DeleteConfirmationDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, campaign: null })}
        onConfirm={confirmDeleteCampaign}
        title="Excluir Campanha"
        description={`Tem certeza que deseja excluir a campanha "${deleteDialog.campaign?.name}"? Esta ação não pode ser desfeita.`}
      />
    </div>
  )
}
