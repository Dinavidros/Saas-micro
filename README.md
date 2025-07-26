# InfluencerHub - Painel Administrativo SaaS

Sistema completo para gerenciar campanhas com microinfluenciadores voltadas à venda de infoprodutos.

## 🚀 Funcionalidades

### Dashboard Principal
- KPIs financeiros (Faturamento, Gastos, Lucro)
- Gráficos interativos de performance
- Tabela com últimas campanhas
- Indicadores de tendência

### Gestão de Microinfluenciadores
- Cadastro completo de influenciadores
- Busca e filtros avançados
- Integração direta com WhatsApp e Instagram
- Métricas de engajamento e seguidores

### Campanhas e Colaborações
- Criação e gestão de campanhas
- Cálculo automático de ROI e lucro
- Controle de status e prazos
- Análise de performance

### Relatórios Avançados
- Filtros por data, influenciador e status
- Métricas detalhadas (CPM, duração, etc.)
- Exportação de dados (preparado para CSV/PDF)
- Análises de performance

## 🛠️ Tecnologias

- **Next.js 14** - Framework React
- **TypeScript** - Type safety
- **TailwindCSS** - Estilização
- **shadcn/ui** - Componentes UI
- **Recharts** - Gráficos interativos
- **Lucide React** - Ícones

## 📦 Instalação

1. Clone o repositório
2. Instale as dependências:
   \`\`\`bash
   npm install
   \`\`\`
3. Execute o projeto:
   \`\`\`bash
   npm run dev
   \`\`\`
4. Acesse: `http://localhost:3000`

## 🔧 Integração com Banco de Dados

O sistema está preparado para integração com:

### Supabase
\`\`\`typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)
\`\`\`

### Firebase
\`\`\`typescript
// lib/firebase.ts
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  // sua configuração
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
\`\`\`

### API REST
\`\`\`typescript
// lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

export const api = {
  influencers: {
    getAll: () => fetch(`${API_BASE_URL}/influencers`),
    create: (data) => fetch(`${API_BASE_URL}/influencers`, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }
}
\`\`\`

## 📁 Estrutura do Projeto

\`\`\`
├── app/
│   ├── layout.tsx          # Layout principal
│   ├── page.tsx           # Página principal
│   └── globals.css        # Estilos globais
├── components/
│   ├── ui/                # Componentes shadcn/ui
│   ├── sidebar.tsx        # Navegação lateral
│   ├── dashboard-overview.tsx
│   ├── influencers-manager.tsx
│   ├── campaigns-manager.tsx
│   └── reports-manager.tsx
├── lib/
│   ├── types.ts           # Tipos TypeScript
│   ├── data.ts            # Dados mockados
│   └── utils.ts           # Funções utilitárias
└── README.md
\`\`\`

## 🎯 Próximos Passos

1. **Autenticação**: Implementar login com NextAuth ou Supabase Auth
2. **Banco de Dados**: Conectar com Supabase/Firebase
3. **Exportação**: Implementar exportação real CSV/PDF
4. **Notificações**: Sistema de alertas e lembretes
5. **Analytics**: Métricas avançadas e insights

## 📱 Responsividade

O sistema é totalmente responsivo e otimizado para:
- Desktop (1920px+)
- Tablet (768px - 1024px)
- Mobile (320px - 767px)

## 🔒 Segurança

- Validação de dados no frontend
- Preparado para autenticação JWT
- Sanitização de inputs
- Proteção contra XSS

## 📄 Licença

Este projeto está sob a licença MIT.
