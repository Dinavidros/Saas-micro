"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Search, Filter, Instagram, MessageCircle, ExternalLink, Edit, Trash2 } from "lucide-react"
import type { Influencer } from "@/lib/types"
import { openWhatsApp } from "@/lib/utils"
import { DeleteConfirmationDialog } from "./delete-confirmation-dialog"

interface InfluencersManagerProps {
  influencers: Influencer[]
  setInfluencers: (influencers: Influencer[]) => void
}

export function InfluencersManager({ influencers, setInfluencers }: InfluencersManagerProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddInfluencerOpen, setIsAddInfluencerOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    instagram: "",
    profileUrl: "",
    whatsapp: "",
    niche: "",
    engagement: "",
    followers: "",
    notes: "",
  })
  const [editingInfluencer, setEditingInfluencer] = useState<Influencer | null>(null)
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; influencer: Influencer | null }>({
    isOpen: false,
    influencer: null,
  })

  const filteredInfluencers = influencers.filter(
    (influencer) =>
      influencer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      influencer.instagram.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEditInfluencer = (influencer: Influencer) => {
    setEditingInfluencer(influencer)
    setFormData({
      name: influencer.name,
      instagram: influencer.instagram,
      profileUrl: influencer.profileUrl,
      whatsapp: influencer.whatsapp,
      niche: influencer.niche,
      engagement: influencer.engagement,
      followers: influencer.followers,
      notes: influencer.notes,
    })
    setIsAddInfluencerOpen(true)
  }

  const handleUpdateInfluencer = () => {
    if (!formData.name || !formData.instagram || !editingInfluencer) {
      alert("Nome e Instagram são obrigatórios!")
      return
    }

    const updatedInfluencer = {
      ...editingInfluencer,
      name: formData.name,
      instagram: formData.instagram.startsWith("@") ? formData.instagram : `@${formData.instagram}`,
      profileUrl: formData.profileUrl || `https://instagram.com/${formData.instagram.replace("@", "")}`,
      whatsapp: formData.whatsapp,
      niche: formData.niche,
      engagement: formData.engagement,
      followers: formData.followers,
      notes: formData.notes,
      updatedAt: new Date().toISOString(),
    }

    setInfluencers(influencers.map((inf) => (inf.id === editingInfluencer.id ? updatedInfluencer : inf)))

    // Limpa o formulário
    setFormData({
      name: "",
      instagram: "",
      profileUrl: "",
      whatsapp: "",
      niche: "",
      engagement: "",
      followers: "",
      notes: "",
    })

    setEditingInfluencer(null)
    setIsAddInfluencerOpen(false)
    alert("Influenciador atualizado com sucesso!")
  }

  const handleDeleteInfluencer = (influencer: Influencer) => {
    setDeleteDialog({ isOpen: true, influencer })
  }

  const confirmDeleteInfluencer = () => {
    if (deleteDialog.influencer) {
      setInfluencers(influencers.filter((inf) => inf.id !== deleteDialog.influencer!.id))
      setDeleteDialog({ isOpen: false, influencer: null })
      alert("Influenciador excluído com sucesso!")
    }
  }

  const handleAddInfluencer = () => {
    if (editingInfluencer) {
      handleUpdateInfluencer()
      return
    }

    if (!formData.name || !formData.instagram) {
      alert("Nome e Instagram são obrigatórios!")
      return
    }

    const newInfluencer = {
      id: Date.now(), // Gera um ID único baseado no timestamp
      name: formData.name,
      instagram: formData.instagram.startsWith("@") ? formData.instagram : `@${formData.instagram}`,
      profileUrl: formData.profileUrl || `https://instagram.com/${formData.instagram.replace("@", "")}`,
      whatsapp: formData.whatsapp,
      niche: formData.niche,
      engagement: formData.engagement,
      followers: formData.followers,
      notes: formData.notes,
      createdAt: new Date().toISOString(),
    }

    setInfluencers([...influencers, newInfluencer])

    // Limpa o formulário
    setFormData({
      name: "",
      instagram: "",
      profileUrl: "",
      whatsapp: "",
      niche: "",
      engagement: "",
      followers: "",
      notes: "",
    })

    setIsAddInfluencerOpen(false)
    alert("Influenciador adicionado com sucesso!")
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Microinfluenciadores</h2>
          <p className="text-gray-600">Gerencie sua rede de influenciadores</p>
        </div>
        <Dialog open={isAddInfluencerOpen} onOpenChange={setIsAddInfluencerOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Influenciador
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingInfluencer ? "Editar Microinfluenciador" : "Novo Microinfluenciador"}</DialogTitle>
              <DialogDescription>
                {editingInfluencer
                  ? "Edite as informações do influenciador"
                  : "Adicione um novo influenciador à sua rede"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nome
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="instagram" className="text-right">
                  Instagram
                </Label>
                <Input
                  id="instagram"
                  placeholder="@username"
                  value={formData.instagram}
                  onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="whatsapp" className="text-right">
                  WhatsApp
                </Label>
                <Input
                  id="whatsapp"
                  placeholder="+55 11 99999-9999"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="niche" className="text-right">
                  Nicho
                </Label>
                <Select value={formData.niche} onValueChange={(value) => setFormData({ ...formData, niche: value })}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecione o nicho" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fitness">Fitness</SelectItem>
                    <SelectItem value="Tecnologia">Tecnologia</SelectItem>
                    <SelectItem value="Empreendedorismo">Empreendedorismo</SelectItem>
                    <SelectItem value="Lifestyle">Lifestyle</SelectItem>
                    <SelectItem value="Beleza">Beleza</SelectItem>
                    <SelectItem value="Culinária">Culinária</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="engagement" className="text-right">
                  Engajamento
                </Label>
                <Input
                  id="engagement"
                  placeholder="4.2%"
                  value={formData.engagement}
                  onChange={(e) => setFormData({ ...formData, engagement: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notes" className="text-right">
                  Observações
                </Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="followers" className="text-right">
                  Seguidores
                </Label>
                <Input
                  id="followers"
                  placeholder="25K"
                  value={formData.followers}
                  onChange={(e) => setFormData({ ...formData, followers: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddInfluencer}>
                {editingInfluencer ? "Atualizar" : "Salvar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou @instagram..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filtros
        </Button>
      </div>

      {/* Influencers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInfluencers.map((influencer) => (
          <Card key={influencer.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{influencer.name}</CardTitle>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEditInfluencer(influencer)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteInfluencer(influencer)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardDescription className="flex items-center">
                <Instagram className="mr-1 h-4 w-4" />
                {influencer.instagram}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Nicho:</span>
                <Badge variant="secondary">{influencer.niche}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Seguidores:</span>
                <span className="font-medium">{influencer.followers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Engajamento:</span>
                <span className="font-medium text-green-600">{influencer.engagement}</span>
              </div>
              {influencer.notes && (
                <div>
                  <span className="text-sm text-gray-600">Observações:</span>
                  <p className="text-sm mt-1">{influencer.notes}</p>
                </div>
              )}
              <div className="flex space-x-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(influencer.profileUrl, "_blank")}
                  className="flex-1"
                >
                  <ExternalLink className="mr-1 h-3 w-3" />
                  Perfil
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openWhatsApp(influencer.whatsapp, influencer.name)}
                  className="flex-1"
                >
                  <MessageCircle className="mr-1 h-3 w-3" />
                  WhatsApp
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <DeleteConfirmationDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, influencer: null })}
        onConfirm={confirmDeleteInfluencer}
        title="Excluir Influenciador"
        description={`Tem certeza que deseja excluir ${deleteDialog.influencer?.name}? Esta ação não pode ser desfeita.`}
      />
    </div>
  )
}
