'use client'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { supabase } from '@/lib/supabase'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const schema = z.object({
  nome: z.string().min(3, 'Nome é obrigatório'),
  instagram_handle: z.string().min(2, 'Instagram obrigatório'),
  whatsapp: z.string().optional(),
  engajamento: z.coerce.number().optional(),
  nicho: z.string().optional(),
  observacoes: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export default function CadastrarInfluenciador() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema)
  })
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const router = useRouter()

  const onSubmit = async (data: FormData) => {
    setErro('')
    setSucesso('')
    setLoading(true)

    const { error } = await supabase.from('influenciadores').insert([data])

    setLoading(false)

    if (error) {
      setErro(error.message)
    } else {
      setSucesso('Influenciador cadastrado com sucesso!')
      reset()
      setTimeout(() => router.push('/dashboard'), 1500)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
      <h1 className="text-xl font-bold mb-4">Cadastrar Influenciador</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label>Nome</label>
          <input {...register('nome')} className="w-full border px-3 py-2" />
          {errors.nome && <p className="text-red-500 text-sm">{errors.nome.message}</p>}
        </div>

        <div>
          <label>@Instagram</label>
          <input {...register('instagram_handle')} className="w-full border px-3 py-2" />
          {errors.instagram_handle && <p className="text-red-500 text-sm">{errors.instagram_handle.message}</p>}
        </div>

        <div>
          <label>WhatsApp</label>
          <input {...register('whatsapp')} className="w-full border px-3 py-2" />
        </div>

        <div>
          <label>Engajamento (%)</label>
          <input type="number" step="0.01" {...register('engajamento')} className="w-full border px-3 py-2" />
        </div>

        <div>
          <label>Nicho</label>
          <input {...register('nicho')} className="w-full border px-3 py-2" />
        </div>

        <div>
          <label>Observações</label>
          <textarea {...register('observacoes')} className="w-full border px-3 py-2" />
        </div>

        <button type="submit" disabled={loading} className="w-full bg-black text-white py-2 rounded">
          {loading ? 'Salvando...' : 'Cadastrar'}
        </button>

        {erro && <p className="text-red-500 text-sm mt-2">{erro}</p>}
        {sucesso && <p className="text-green-600 text-sm mt-2">{sucesso}</p>}
      </form>
    </div>
  )
}