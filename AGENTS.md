# AGENTS.md — Siddha Code (Brener Rodrigues)

> **Para qualquer agente de IA** (Claude Code, Antigravity, OpenCode, Cursor): leia este arquivo antes de executar tarefas no repositório.

---

## 1. Identidade e Governança

- **Operador humano**: Brener Rodrigues (Brener Pompeo)
- **Email**: brenerpompeo@gmail.com
- **Localização**: Campinas, SP / Brasil
- **Idioma de trabalho**: **Português do Brasil (PT-BR)** sempre. Sem exceções.
- **Doutrina**: "Empresa Zero-Humanos" — o agente atua de ponta a ponta com rigor de engenharia; o humano apenas destrava gates críticos.

---

## 2. Topologia e Memória Canônica

- **Repo local**: `vibecoding/siddha-code/` (alias/symlink: `vibecoding/Siddhastia`)
- **Repo GitHub**: [`brenerpompeo/siddha_code`](https://github.com/brenerpompeo/siddha_code)
- **Branch principal**: `oficial`
- **Segundo Cérebro (Memória Canônica)**:
  `Second-Brain/10-Projetos/10.08-Siddha-Code/_MOC.md`

### Regra DRY (Memória vs Código)
- Decisões de arquitetura duradouras (ADRs) → registrar em `Second-Brain/10-Projetos/10.08-Siddha-Code/Decisions/`.
- Aprendizados reutilizáveis em outros projetos → registrar em `Second-Brain/40-Zettelkasten/40.03-Permanent/`.
- Mudanças operacionais de código → ficam nos commits sem poluir o vault.

---

## 3. Stack Tecnológica

| Camada | Tecnologia | Papel |
|---|---|---|
| **Framework** | Next.js 14.2 (App Router) | Servidor e rotas frontend |
| **Linguagem / UI** | React 18 + JavaScript / JSX | Componentização modular |
| **Estilização** | Tailwind CSS v3 | Design system utilitário |
| **Componentes Base** | Radix UI + Lucide Icons | Primitivas acessíveis e ícones |
| **Animações / Gráficos** | Framer Motion + Recharts | Interações de timeline e dashboards |
| **Banco de Dados & Auth** | Supabase (PostgreSQL) | Autenticação, perfis e persistência |
| **IA / LLMs** | OpenAI (gpt-4o) + Google GenAI | Assistente Siddha AI e sugestões |
| **Package Manager** | Yarn 1.22 (via corepack) | Gerenciamento de dependências |

---

## 4. Políticas Críticas do Ecossistema

### 4.1 Secrets e Credenciais
- **JAMAIS** commitar chaves de API, senhas ou tokens de serviço.
- Sempre manter chaves isoladas no `.env.local` (ignorado no `.gitignore`).
- Manter `.env.example` atualizado com novos parâmetros.
- Checar diffs de credenciais antes de commitar.

### 4.2 Matriz de Approval Gates
- 🟢 **Autônomos**: Refatorações sem quebra de comportamento, criação de testes, correções de bugs, documentações técnicas.
- 🟡 **Co-aprovação**: Criação de novas rotas de API, alterações em schemas SQL, adição de novas dependências npm/yarn.
- 🔴 **Sempre Humano**: Deploy de produção, exclusão de dados/tabelas em bancos de dados, gastos em novas APIs de terceiros.

### 4.3 Git e Commits
- Mensagens de commit estritamente em **PT-BR**.
- Padrão Conventional Commits: `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`, `test:`.
- Commits atômicos e descritivos.

---

## 5. Knowledge Graph (Graphify)

Quando `graphify-out/` estiver presente neste diretório:
- Utilize consultas via Graphify para mapear dependências cruzadas entre componentes e rotas antes de refatorações estruturais.
- Atualize o grafo após grandes mudanças com `graphify update .`.
