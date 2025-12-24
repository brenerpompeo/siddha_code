# Siddha Code - V1.0 Release Candidate

## 🚀 Status do Projeto
O aplicativo foi refatorado e estabilizado. A arquitetura monolítica foi quebrada em componentes modulares para facilitar a manutenção e escalabilidade.

## 🛠️ Mudanças Realizadas
1. **Refatoração da Arquitetura**:
   - O arquivo `page.js` gigante foi dividido em:
     - `components/DashboardPage.js`
     - `components/CicloPage.js`
     - `components/SprintsPage.js`
     - `components/JournalPage.js`
     - `components/AuthPage.js`
   - Isso melhora a performance e previne bugs de regressão.

2. **Correção da IA (Siddha AI)**:
   - A rota `/api/suggestions` foi corrigida para usar o modelo `gpt-4o`.
   - Ajustada a `baseURL` para compatibilidade com a chave Emergent LLM.
   - Adicionado tratamento de erro para evitar que o chat trave se a API falhar.

3. **Correções de UI/UX**:
   - A página **Ciclo** agora possui o "Quadro dos Sonhos" e "Máquina do Tempo" (Timeline).
   - O **Dashboard** integra gráficos nativamente.
   - O **Journal** foi atualizado.

## 🧪 Como Testar (Tester Script)
Criamos um script para popular o banco de dados e verificar erros.

1. Execute o script de seed:
   ```bash
   node /app/scripts/seed.js
   ```
   *Nota: Se ocorrer erro de "Email invalid", verifique as configurações de Auth do seu projeto Supabase (confirmação de email, domínios permitidos).*

2. Teste a API de IA:
   Você pode conversar com o Siddha AI no chat flutuante. Se ele responder, a integração está funcionando.

## 📦 Preparação para Produção
Para lançar a versão 1.0:

1. **Variáveis de Ambiente**:
   Certifique-se de que as seguintes variáveis estão configuradas na sua plataforma de hospedagem (Vercel/Emergent):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `EMERGENT_LLM_KEY`

2. **Build**:
   O projeto está pronto para build.
   ```bash
   yarn build
   ```

3. **Próximos Passos (Roadmap V1.1)**:
   - Implementar Login com Facebook (requer App ID/Secret).
   - Cálculos reais de Human Design (atualmente usando lógica simplificada).
   - Sistema de Gamificação Avançado (Leaderboards).

## 🐛 Debugging
Se encontrar problemas, verifique os logs:
- Backend: `/var/log/supervisor/nextjs.out.log`
- Frontend: Console do navegador.
