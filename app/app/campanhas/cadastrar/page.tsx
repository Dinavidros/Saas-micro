'use client'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const schema = z.object({
  nome: z.string().min(1, 'Informe o nome da campanha'), // ✅ Adicionado
  influenciador_id: z.string().uuid({ message: 'Selecione um influenciador' }),
  valor_pago: z.coerce.number().min(0, 'Informe o valor pago'),
  faturamento: z.coerce.number().min(0, 'Informe o faturamento'),
  lucro_liquido: z.coerce.number().min(0, 'Informe o lucro líquido'),
  data_inicio: z.string().min(1, 'Informe a data de início'),
  data_fim: z.string().min(1, 'Informe a data de término'),
  status: z.string().min(1, 'Informe o status da campanha')
})

type FormData = z.infer<typeof schema>

export default function CadastrarCampanha() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema)
  })

  const [influenciadores, setInfluenciadores] = useState<any[]>([])
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchInfluenciadores = async () => {
      const { data, error } = await supabase.from('influenciadores').select('id, nome')
      if (error) console.error('Erro ao buscar influenciadores', error)
      else setInfluenciadores(data)
    }
    fetchInfluenciadores()
  }, [])

  const onSubmit = async (data: FormData) => {
    console.log('🧪 Enviando dados da campanha:', data)

    setErro('')
    setSucesso('')
    setLoading(true)

    const { error } = await supabase.from('campanhas').insert(data)

    if (error) {
      setErro('Erro ao cadastrar campanha.')
      console.error(error)
    } else {
      setSucesso('Campanha cadastrada com sucesso!')
      router.push('/campanhas') // Rota de redirecionamento após salvar
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl mx-auto p-4 space-y-4">
      <h1 className="text-xl font-bold">Cadastrar Campanha</h1>

      <div>
        <label>Nome da Campanha</label>
        <input type="text" {...register('nome')} className="w-full border p-2 rounded" />
        {errors.nome && <p className="text-red-500">{errors.nome.message}</p>}
      </div>

      <div>
        <label>Influenciador</label>
        <select {...register('influenciador_id')} className="w-full border p-2 rounded">
          <option value="">Selecione</option>
          {influenciadores.map((inf) => (
            <option key={inf.id} value={inf.id}>{inf.nome}</option>
          ))}
        </select>
        {errors.influenciador_id && <p className="text-red-500">{errors.influenciador_id.message}</p>}
      </div>

      <div>
        <label>Valor Pago</label>
        <input type="number" step="0.01" {...register('valor_pago')} className="w-full border p-2 rounded" />
        {errors.valor_pago && <p className="text-red-500">{errors.valor_pago.message}</p>}
      </div>

      <div>
        <label>Faturamento</label>
        <input type="number" step="0.01" {...register('faturamento')} className="w-full border p-2 rounded" />
        {errors.faturamento && <p className="text-red-500">{errors.faturamento.message}</p>}
      </div>

      <div>
        <label>Lucro Líquido</label>
        <input type="number" step="0.01" {...register('lucro_liquido')} className="w-full border p-2 rounded" />
        {errors.lucro_liquido && <p className="text-red-500">{errors.lucro_liquido.message}</p>}
      </div>

      <div>
        <label>Data de Início</label>
        <input type="date" {...register('data_inicio')} className="w-full border p-2 rounded" />
        {errors.data_inicio && <p className="text-red-500">{errors.data_inicio.message}</p>}
      </div>

      <div>
        <label>Data de Fim</label>
        <input type="date" {...register('data_fim')} className="w-full border p-2 rounded" />
        {errors.data_fim && <p className="text-red-500">{errors.data_fim.message}</p>}
      </div>

      <div>
        <label>Status</label>
        <input type="text" placeholder="Ativa, Pausada..." {...register('status')} className="w-full border p-2 rounded" />
        {errors.status && <p className="text-red-500">{errors.status.message}</p>}
      </div>

      <button type="submit" disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded">
        {loading ? 'Salvando...' : 'Cadastrar'}
      </button>

      {erro && <p className="text-red-600">{erro}</p>}
      {sucesso && <p className="text-green-600">{sucesso}</p>}
    </form>
  )
}