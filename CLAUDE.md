# CLAUDE.md — Siddha Code

> Leia este arquivo ao iniciar qualquer sessão. Depois consulte `AGENTS.md` para regras operacionais e aprovações.
> **Idioma: PT-BR** | Operador: Brener Rodrigues (Campinas/BR)

---

## 🎯 O que é

**Siddha Code** (também referenciado no ecossistema como **Siddhastia**) é uma plataforma de desenvolvimento pessoal, autoliderança, sprints e alinhamento de rotina com base em princípios de autoconhecimento (Human Design), ciclos de produtividade, journaling e inteligência aumentada com o assistente **Siddha AI**.

---

## ⚡ Contexto imediato

1. Leia `AGENTS.md` no root para regras de arquitetura, convenções e approval gates.
2. Memória canônica no Obsidian Vault: `Second-Brain/10-Projetos/10.08-Siddha-Code/_MOC.md`.
3. Branch de desenvolvimento canônico: `oficial`.

---

## 🛠️ Stack Tecnológica

```
Frontend:  Next.js 14.2 (App Router) + React 18 + Tailwind CSS v3
UI/UX:     Radix UI + Lucide Icons + Framer Motion + Recharts + dnd-kit
Backend:   Supabase (PostgreSQL + Auth + Storage)
AI Engine: OpenAI (gpt-4o via route /api/suggestions) + Google GenAI (/api/gemini)
Manager:   Yarn 1.22 (via corepack) / Node ≥20
```

---

## 📁 Estrutura de Pastas

```
siddha-code/
├── app/                  ← Rotas Next.js (App Router) e API routes
│   ├── api/
│   │   ├── gemini/       ← Integração Google GenAI
│   │   └── suggestions/  ← Assistente Siddha AI (OpenAI / Emergent)
│   ├── layout.js
│   └── page.js
├── components/           ← Módulos isolados da aplicação
│   ├── AuthPage.js       ← Fluxo de login e registro Supabase
│   ├── CicloPage.js      ← Quadro dos Sonhos e Máquina do Tempo (Timeline)
│   ├── DashboardPage.js  ← Métricas, gráficos e visão geral
│   ├── JournalPage.js    ← Diário e reflexões
│   ├── SprintsPage.js    ← Gerenciamento ágil de metas pessoais
│   └── ui/               ← Componentes atômicos (Radix UI / shadcn)
├── hooks/                ← Custom React hooks
├── lib/                  ← Utilitários, Supabase client/server
│   ├── supabase.js
│   └── supabase-server.js
├── scripts/              ← Scripts de seed e automação
├── *.sql                 ← Schemas SQL do Supabase (supabase_schema.sql, etc.)
├── AGENTS.md             ← Governança técnica e doctrine Zero-Humanos
└── CLAUDE.md             ← Este arquivo
```

---

## 🚦 Approval Gates (Matriz de Governança)

| 🔴 Sempre Humano (Brener) | 🟡 Co-Aprovação | 🟢 Autônomo |
|---|---|---|
| Deploy de produção | Mudanças em schemas SQL (`*.sql`) | Refactor sem quebra de contrato |
| Gastos com APIs pagas de IA | Novas dependências no `package.json` | Criação/atualização de testes |
| Alterações de tese do produto | Alteração no pipeline do Siddha AI | Correção de bugs confirmados |
| Deleção de tabelas no Supabase | Criação de novas rotas de API | Documentação interna e lints |

---

## 💻 Comandos Principais

```bash
# Instalação de dependências
corepack yarn install

# Rodar servidor de desenvolvimento (porta 3000)
corepack yarn dev

# Build de produção
corepack yarn build

# Executar testes
corepack yarn test
```
