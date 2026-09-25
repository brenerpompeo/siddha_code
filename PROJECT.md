# Project: Life OS — Siddha-Code Sovereign Centralization

## Architecture
- **Framework**: Next.js 14.2.3 (App Router), React 18, JavaScript ES6+ / JSX (Sem TypeScript no toolchain).
- **Design System**: Dark Sovereign Luxury (`#09090b` velvet background, `#0f0f13` surface cards, `border-white/[0.08]` hairline borders, acentos refinados por pilar, Bento grid layout, Sonner toasts).
- **Navigation Topology**:
  - Global Shell com Desktop Sidebar retrátil e elegante (6 seções primárias).
  - Mobile Bottom Navigation Bar ergonômica com safe areas e touch targets $\ge 44\text{px}$.
  - Rotas físicas dedicadas: `/dashboard`, `/corpo`, `/mente`, `/repertorio`, `/sprints`, `/relacoes`, além do redirecionamento transparente de `/` para `/dashboard`.
- **Data & Persistence Layer**:
  - `schema_life_os_v1.sql`: 7 tabelas com integridade relacional, índices B-Tree, RLS e seeds canônicos de Brener Pompêo no Supabase.
  - `LifeOSStorageAdapter` (Local-First Dual-Store): Carregamento síncrono e instantâneo via `localStorage` (com seeds embutidos quando vazio), dispensando login bloqueante em modo offline/desenvolvimento e despachando mutações em background para o Supabase quando disponível.
  - `LifeOSProvider` React Context: Distribui estado global e mutadores otimistas para todas as rotas sem re-fetches desnecessários.

---

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Supabase SQL Schema DDL | 7 tabelas (`workout_routines`, `workout_exercises`, `workout_logs`, `meal_plans`, `books`, `cultural_repertoire`, `social_commitments`), RLS policies e índices | M1 | R3 / Survey |
| 2 | Seeds Canônicos de Brener Pompêo | Rotina hipertrofia 4 dias, batch cooking dom/qua, estante Fanon/Caibalion/Porter, cofre Babylon/Racionais, diário e tribo | M1 | R3 / Survey |
| 3 | Local-First Dual Store Adapter | `LifeOSStorageAdapter` com persistência local resiliente, fallback offline transparente e sincronização Supabase | M1 | R3 / Survey |
| 4 | Global Provider & State Hook | `LifeOSProvider` e `useLifeOS()` fornecendo métodos unificados de leitura e mutação | M1 | R1, R3 / Survey |
| 5 | Dark Sovereign Luxury Theme & Shell | Fundo `#09090b`, Bento cards `#0f0f13`, hairlines `border-white/[0.08]`, montagem global do `<Toaster />` Sonner | M2 | R2 / Survey |
| 6 | Desktop Sidebar Navigation | Sidebar lateral com as 6 rotas centrais, perfil de Brener, indicador de sincronização e status dos pilares | M2 | R1, R2 / Survey |
| 7 | Mobile Bottom Navigation Bar | Barra de navegação inferior com touch targets $\ge 44\text{px}$, haptics visuais, labels e safe-area bottom | M2 | R1, R2 / Survey |
| 8 | Treinos de Academia (`/corpo`) | Rotinas A/B/C/D, checklist de exercícios, séries, repetições, carga (kg), cronômetro de descanso e histórico | M3 | R1 / Survey |
| 9 | Nutrição & Meal Prep (`/corpo`) | Planejamento de batch cooking (dom/qua), checklist diário de refeições, metas de macros e contador de água (3.5L) | M3 | R1 / Survey |
| 10 | Diário Analógico (`/mente`) | Digitalização de reflexões manuscritas, upload de foto/texto de páginas do caderno, mood tracker e prompts | M3 | R1 / Survey |
| 11 | Astro-Ikigai (`/mente`) | 4 quadrantes alinhados a Jornalismo, Cultura Negra, Narrativa, Hermetismo, Ciência e Shared Value/ESG | M3 | R1 / Survey |
| 12 | Estante de Livros (`/repertorio`) | Catálogo de livros físicos, status (Lendo, Fila, Lido), progresso de páginas, citações-chave e insights | M4 | R1 / Survey |
| 13 | Cofre Cultural (`/repertorio`) | Curadoria para cinema, música afrodiaspórica, pesquisa esotérica e científica com anotações reflexivas | M4 | R1 / Survey |
| 14 | Execução & Sprints (`/sprints`) | Kanban multi-pilar (Potencial, Fluxo, Sabedoria) conectado aos 7 pilares do Life OS | M4 | R1 / Survey |
| 15 | Relações & Tribo (`/relacoes`) | Rastreador de presença de qualidade (namorada e amigos), registros de encontros e recarga social sem culpa | M4 | R1 / Survey |
| 16 | Cockpit / Dashboard (`/dashboard`) | Command center com saudação, streak, seletor de humor, sprint ativo, preview do treino, meal checklist e card "Caderno de Hoje" | M5 | R1 / Survey |
| 17 | Root Route Redirection (`/`) | Redirecionamento da raiz `/` para o Cockpit soberano `/dashboard` | M5 | R1 / Survey |
| 18 | E2E Testing, Adversarial & Verification | Testes completos em todas as 6 rotas, interação de formulários, persistência offline e responsividade mobile | M6 | Acceptance / Survey |
| 19 | Forensic Integrity Audit | Auditoria estrita contra dummies, facades ou mocks vazios | M6 | Acceptance / Survey |
| 20 | Zero-Defect Production Build | Validação de `yarn build` / `./node_modules/.bin/next build` com código 0 e sem warnings bloqueantes | M6 | Acceptance / Survey |

---

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Database Foundation & Resilient Offline Persistence | `schema_life_os_v1.sql`, `lib/life-os-storage.js`, `components/providers/life-os-provider.jsx` | none | PLANNED |
| M2 | Dark Sovereign Luxury Navigation & Layout Framework | `app/layout.js`, `components/layout/life-os-shell.jsx`, `components/layout/life-os-sidebar.jsx`, `components/layout/life-os-bottom-nav.jsx` | M1 | PLANNED |
| M3 | Domain Modules: Corpo & Mente | `app/corpo/page.js`, `components/corpo/*`, `app/mente/page.js`, `components/mente/*` | M1, M2 | PLANNED |
| M4 | Domain Modules: Repertório, Sprints & Relações | `app/repertorio/page.js`, `components/repertorio/*`, `app/sprints/page.js`, `components/sprints/*`, `app/relacoes/page.js`, `components/relacoes/*` | M1, M2 | PLANNED |
| M5 | Unified Cockpit Dashboard & Root Route | `app/dashboard/page.js`, `components/dashboard/*`, `app/page.js` (redirecionamento ou cockpit root) | M1, M2, M3, M4 | PLANNED |
| M6 | E2E Verification, Forensic Audit & Build Validation | Testes E2E, auditoria de integridade forense e execução de `yarn build` com código 0 | M1-M5 | PLANNED |

---

## Interface Contracts

### `LifeOSStorageAdapter` ↔ React UI Components
Local: `lib/life-os-storage.js`
- `getLifeOSData()`: Retorna objeto completo `{ profile, workouts, workoutLogs, mealPlans, books, culturalItems, journalEntries, ikigaiEntries, sprints, socialCommitments }`.
- `saveWorkoutLog(log)`: Salva uma sessão concluída de treino (rotina, exercícios executados, cargas, data, duração).
- `updateWorkoutRoutine(routine)`: Atualiza rotina, séries e cargas de exercícios.
- `toggleMealCompleted(mealId, date)`: Alterna status de consumo de refeição no meal prep.
- `updateWaterIntake(amountMl)`: Atualiza consumo hídrico diário.
- `addBook(book)` / `updateBook(bookId, updates)`: Cria ou edita progresso de leitura, citações e status do livro.
- `addCulturalItem(item)`: Salva obra cultural, notas e tags.
- `saveJournalEntry(entry)`: Salva reflexão do diário analógico, humor, tags e anexo de foto/texto.
- `saveIkigaiItem(quadrant, item)`: Salva alinhamento no quadrante correspondente.
- `createTask(task)` / `updateTaskStatus(taskId, status)`: Manipula itens no Kanban multi-pilar.
- `logSocialMoment(moment)`: Registra momento com namorada ou amigos e nível de presença.

### `LifeOSContext` (Hook `useLifeOS()`)
Local: `components/providers/life-os-provider.jsx`
- Fornece: `{ data, isLoaded, isOnline, actions: { logWorkout, updateMeal, updateWater, saveBook, saveJournal, updateTask, saveSocial, setMood } }`.

### Rotas e URLs do Sitemap
- `/dashboard`: Cockpit principal do Life OS.
- `/corpo`: Treinos de academia (split A/B/C/D) e Nutrição & Meal Prep.
- `/mente`: Diário Analógico e Astro-Ikigai.
- `/repertorio`: Estante de Livros e Cofre Cultural.
- `/sprints`: Kanban de Sprints Multi-pilar (Potencial, Fluxo, Sabedoria).
- `/relacoes`: Relações, Presença de Qualidade e Tribo.

---

## Code Layout
```
siddha-code/
├── schema_life_os_v1.sql           # DDL canônico do Supabase + RLS + Seeds
├── lib/
│   ├── life-os-storage.js          # Adaptador Local-First resiliente + seeds iniciais
│   └── supabase.js                 # Cliente Supabase existente
├── components/
│   ├── providers/
│   │   └── life-os-provider.jsx    # React Context Provider do Life OS
│   ├── layout/
│   │   ├── life-os-shell.jsx       # Layout Shell contendo Sidebar + Bottom Nav + Content
│   │   ├── life-os-sidebar.jsx     # Desktop Sidebar Dark Sovereign Luxury
│   │   └── life-os-bottom-nav.jsx  # Mobile Bottom Nav com touch target >= 44px
│   ├── dashboard/                  # Componentes do Cockpit diário
│   ├── corpo/                      # Treinos de academia + Meal prep + Água
│   ├── mente/                      # Diário analógico + Astro-Ikigai
│   ├── repertorio/                 # Estante de livros + Cofre cultural
│   ├── sprints/                    # Kanban multi-pilar
│   └── relacoes/                   # Rastreador de presença e encontros
├── app/
│   ├── layout.js                   # Root layout com Sonner Toaster e LifeOSProvider
│   ├── page.js                     # Redirecionamento soberano para /dashboard
│   ├── dashboard/page.js           # Rota do Cockpit
│   ├── corpo/page.js               # Rota Corpo & Vigor
│   ├── mente/page.js               # Rota Mente & Diário Analógico
│   ├── repertorio/page.js          # Rota Repertório & Cultura
│   ├── sprints/page.js             # Rota Execução & Sprints
│   └── relacoes/page.js            # Rota Relações & Tribo
```
