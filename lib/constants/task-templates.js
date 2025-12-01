// Task Templates Database - 140 Tasks across 7 Pillars
// Each pillar has 10 sub-pillars and 20 task suggestions

export const TASK_TEMPLATES = {
  physical: {
    label: 'Físico',
    color: '#ef4444',
    subPillars: [
      'Musculação', 'Cardio', 'Nutrição', 'Sono', 'Estética',
      'Hidratação', 'Flexibilidade', 'Check-ups', 'Postura', 'Suplementação'
    ],
    tasks: [
      { id: 'phy-1', content: 'Treino de Hipertrofia (Peito/Tríceps)', subPillar: 'Musculação', xp: 50 },
      { id: 'phy-2', content: 'Corrida de 5km (Zona 2)', subPillar: 'Cardio', xp: 40 },
      { id: 'phy-3', content: 'Jejum Intermitente (16h)', subPillar: 'Nutrição', xp: 30 },
      { id: 'phy-4', content: 'Preparar Marmitas da Semana (Meal Prep)', subPillar: 'Nutrição', xp: 45 },
      { id: 'phy-5', content: 'Beber 4L de Água', subPillar: 'Hidratação', xp: 20 },
      { id: 'phy-6', content: 'Dormir antes das 22h', subPillar: 'Sono', xp: 35 },
      { id: 'phy-7', content: 'Rotina de Skin Care Matinal', subPillar: 'Estética', xp: 25 },
      { id: 'phy-8', content: 'Sessão de Alongamento (15 min)', subPillar: 'Flexibilidade', xp: 25 },
      { id: 'phy-9', content: 'Exame de Sangue Completo', subPillar: 'Check-ups', xp: 60 },
      { id: 'phy-10', content: 'Massagem Miofascial', subPillar: 'Flexibilidade', xp: 35 },
      { id: 'phy-11', content: 'Caminhada ao Sol (Vitamin D)', subPillar: 'Cardio', xp: 25 },
      { id: 'phy-12', content: 'Zero Açúcar por 24h', subPillar: 'Nutrição', xp: 40 },
      { id: 'phy-13', content: 'Banho Gelado (3 min)', subPillar: 'Estética', xp: 30 },
      { id: 'phy-14', content: 'Treino de Mobilidade de Quadril', subPillar: 'Flexibilidade', xp: 30 },
      { id: 'phy-15', content: 'Consulta com Nutricionista', subPillar: 'Check-ups', xp: 50 },
      { id: 'phy-16', content: 'Comprar Suplementos (Whey/Creatina)', subPillar: 'Suplementação', xp: 20 },
      { id: 'phy-17', content: 'Yoga (Saudação ao Sol)', subPillar: 'Flexibilidade', xp: 35 },
      { id: 'phy-18', content: 'Medir Percentual de Gordura', subPillar: 'Check-ups', xp: 25 },
      { id: 'phy-19', content: 'Higiene do Sono (Sem telas 1h antes)', subPillar: 'Sono', xp: 30 },
      { id: 'phy-20', content: 'Cortar Cabelo / Barba', subPillar: 'Estética', xp: 20 }
    ]
  },
  mental: {
    label: 'Mental',
    color: '#3b82f6',
    subPillars: [
      'Meditação', 'Terapia', 'Gestão Emocional', 'Resiliência', 'Autoconhecimento',
      'Mindfulness', 'Ansiedade', 'Gratidão', 'Journaling', 'Respiração'
    ],
    tasks: [
      { id: 'men-1', content: 'Meditação Guiada (10 min)', subPillar: 'Meditação', xp: 30 },
      { id: 'men-2', content: 'Sessão de Terapia', subPillar: 'Terapia', xp: 60 },
      { id: 'men-3', content: 'Escrever no Diário de Emoções', subPillar: 'Journaling', xp: 35 },
      { id: 'men-4', content: 'Prática de Gratidão (3 itens)', subPillar: 'Gratidão', xp: 25 },
      { id: 'men-5', content: 'Exercício de Respiração Wim Hof', subPillar: 'Respiração', xp: 30 },
      { id: 'men-6', content: 'Leitura sobre Estoicismo', subPillar: 'Resiliência', xp: 35 },
      { id: 'men-7', content: 'Digital Detox (1h sem celular)', subPillar: 'Mindfulness', xp: 30 },
      { id: 'men-8', content: 'Identificar Gatilho de Ansiedade', subPillar: 'Ansiedade', xp: 40 },
      { id: 'men-9', content: 'Prática de Visualização do Futuro', subPillar: 'Autoconhecimento', xp: 35 },
      { id: 'men-10', content: 'Caminhada Consciente (Mindful Walking)', subPillar: 'Mindfulness', xp: 30 },
      { id: 'men-11', content: 'Dizer "Não" a um compromisso indesejado', subPillar: 'Gestão Emocional', xp: 45 },
      { id: 'men-12', content: 'Observar pensamentos sem julgar (5 min)', subPillar: 'Mindfulness', xp: 25 },
      { id: 'men-13', content: 'Box Breathing (4-4-4-4) para calma', subPillar: 'Respiração', xp: 20 },
      { id: 'men-14', content: 'Revisão de Valores Pessoais', subPillar: 'Autoconhecimento', xp: 40 },
      { id: 'men-15', content: 'Escrever Carta de Perdão (não enviar)', subPillar: 'Gestão Emocional', xp: 50 },
      { id: 'men-16', content: 'Monitorar Humor do Dia', subPillar: 'Gestão Emocional', xp: 20 },
      { id: 'men-17', content: 'Prática de Ho\'oponopono', subPillar: 'Resiliência', xp: 35 },
      { id: 'men-18', content: 'Definir Limites Emocionais', subPillar: 'Gestão Emocional', xp: 45 },
      { id: 'men-19', content: 'Sessão de Brain Dump (Esvaziar mente)', subPillar: 'Journaling', xp: 30 },
      { id: 'men-20', content: 'Ler anotações antigas do Journal', subPillar: 'Journaling', xp: 25 }
    ]
  },
  intellectual: {
    label: 'Intelectual',
    color: '#8b5cf6',
    subPillars: [
      'Leitura', 'Estudos', 'Idiomas', 'Escrita', 'Cursos',
      'Podcasts', 'Documentários', 'Debates', 'Pesquisas', 'Mentorias'
    ],
    tasks: [
      { id: 'int-1', content: 'Ler 10 páginas de um livro técnico', subPillar: 'Leitura', xp: 30 },
      { id: 'int-2', content: 'Aula de Inglês (Duolingo/Professor)', subPillar: 'Idiomas', xp: 35 },
      { id: 'int-3', content: 'Assistir Aula do Curso Online', subPillar: 'Cursos', xp: 40 },
      { id: 'int-4', content: 'Escrever Resumo do Capítulo', subPillar: 'Escrita', xp: 35 },
      { id: 'int-5', content: 'Ouvir Podcast Educativo no trânsito', subPillar: 'Podcasts', xp: 25 },
      { id: 'int-6', content: 'Assistir Documentário Histórico', subPillar: 'Documentários', xp: 35 },
      { id: 'int-7', content: 'Pesquisar sobre Investimentos', subPillar: 'Pesquisas', xp: 40 },
      { id: 'int-8', content: 'Escrever Artigo/Post no LinkedIn', subPillar: 'Escrita', xp: 50 },
      { id: 'int-9', content: 'Praticar Conversação (Shadowing)', subPillar: 'Idiomas', xp: 35 },
      { id: 'int-10', content: 'Revisar Flashcards (Anki)', subPillar: 'Estudos', xp: 25 },
      { id: 'int-11', content: 'Mentoria (Sessão como Mentor ou Mentorado)', subPillar: 'Mentorias', xp: 60 },
      { id: 'int-12', content: 'Aprender uma nova ferramenta de IA', subPillar: 'Estudos', xp: 45 },
      { id: 'int-13', content: 'Estudar Lógica de Programação', subPillar: 'Estudos', xp: 40 },
      { id: 'int-14', content: 'Ler Notícias do Setor (Curadoria)', subPillar: 'Leitura', xp: 20 },
      { id: 'int-15', content: 'Participar de Webinar', subPillar: 'Cursos', xp: 35 },
      { id: 'int-16', content: 'Ensinar algo a alguém (Técnica Feynman)', subPillar: 'Mentorias', xp: 50 },
      { id: 'int-17', content: 'Organizar Biblioteca de Arquivos', subPillar: 'Estudos', xp: 25 },
      { id: 'int-18', content: 'Comprar Livros do mês', subPillar: 'Leitura', xp: 20 },
      { id: 'int-19', content: 'Planejar Matriz de Estudos', subPillar: 'Estudos', xp: 30 },
      { id: 'int-20', content: 'Resolver Problema de Lógica/Xadrez', subPillar: 'Debates', xp: 35 }
    ]
  },
  spiritual: {
    label: 'Espiritual',
    color: '#f59e0b',
    subPillars: [
      'Natureza', 'Oração', 'Silêncio', 'Caridade', 'Rituais',
      'Propósito', 'Reflexão', 'Comunidade', 'Perdão', 'Fé'
    ],
    tasks: [
      { id: 'spi-1', content: 'Oração Matinal / Intenção do Dia', subPillar: 'Oração', xp: 25 },
      { id: 'spi-2', content: 'Retiro de Silêncio (1h)', subPillar: 'Silêncio', xp: 45 },
      { id: 'spi-3', content: 'Doação para Caridade', subPillar: 'Caridade', xp: 50 },
      { id: 'spi-4', content: 'Voluntariado', subPillar: 'Caridade', xp: 60 },
      { id: 'spi-5', content: 'Contemplar o Pôr do Sol', subPillar: 'Natureza', xp: 25 },
      { id: 'spi-6', content: 'Ler Texto Sagrado', subPillar: 'Fé', xp: 35 },
      { id: 'spi-7', content: 'Acender Incenso/Vela (Ritual)', subPillar: 'Rituais', xp: 20 },
      { id: 'spi-8', content: 'Revisar Missão de Vida (Ikigai)', subPillar: 'Propósito', xp: 50 },
      { id: 'spi-9', content: 'Conexão com a Natureza (Pisar na grama)', subPillar: 'Natureza', xp: 25 },
      { id: 'spi-10', content: 'Jejum Espiritual', subPillar: 'Rituais', xp: 40 },
      { id: 'spi-11', content: 'Meditação Transcendental', subPillar: 'Silêncio', xp: 40 },
      { id: 'spi-12', content: 'Agradecer a alguém importante', subPillar: 'Comunidade', xp: 35 },
      { id: 'spi-13', content: 'Perdoar uma ofensa antiga', subPillar: 'Perdão', xp: 55 },
      { id: 'spi-14', content: 'Participar de Culto/Cerimônia', subPillar: 'Comunidade', xp: 45 },
      { id: 'spi-15', content: 'Ouvir Mantras / Música Sacra', subPillar: 'Rituais', xp: 25 },
      { id: 'spi-16', content: 'Limpeza Energética do Ambiente', subPillar: 'Rituais', xp: 30 },
      { id: 'spi-17', content: 'Oferenda / Dízimo', subPillar: 'Fé', xp: 40 },
      { id: 'spi-18', content: 'Estudo de Teologia/Filosofia', subPillar: 'Reflexão', xp: 40 },
      { id: 'spi-19', content: 'Prática de Compaixão', subPillar: 'Comunidade', xp: 35 },
      { id: 'spi-20', content: 'Olhar as Estrelas', subPillar: 'Natureza', xp: 20 }
    ]
  },
  cultural: {
    label: 'Cultural',
    color: '#ec4899',
    subPillars: [
      'Música', 'Cinema', 'Arte', 'Viagens', 'Gastronomia',
      'Teatro', 'Exposições', 'Literatura', 'Fotografia', 'Dança'
    ],
    tasks: [
      { id: 'cul-1', content: 'Ouvir um Álbum Clássico inteiro', subPillar: 'Música', xp: 30 },
      { id: 'cul-2', content: 'Assistir um Filme Cult/Premiado', subPillar: 'Cinema', xp: 35 },
      { id: 'cul-3', content: 'Visitar Museu ou Galeria', subPillar: 'Exposições', xp: 50 },
      { id: 'cul-4', content: 'Jantar em Restaurante Típico', subPillar: 'Gastronomia', xp: 40 },
      { id: 'cul-5', content: 'Planejar Roteiro de Viagem', subPillar: 'Viagens', xp: 35 },
      { id: 'cul-6', content: 'Ler Ficção/Poesia', subPillar: 'Literatura', xp: 30 },
      { id: 'cul-7', content: 'Ir ao Teatro / Show', subPillar: 'Teatro', xp: 55 },
      { id: 'cul-8', content: 'Tocar Instrumento Musical', subPillar: 'Música', xp: 40 },
      { id: 'cul-9', content: 'Fotografia Urbana (Hobby)', subPillar: 'Fotografia', xp: 35 },
      { id: 'cul-10', content: 'Aula de Dança', subPillar: 'Dança', xp: 45 },
      { id: 'cul-11', content: 'Cozinhar um prato exótico', subPillar: 'Gastronomia', xp: 40 },
      { id: 'cul-12', content: 'Assistir Ópera ou Orquestra', subPillar: 'Música', xp: 50 },
      { id: 'cul-13', content: 'Pesquisar História de um País', subPillar: 'Viagens', xp: 30 },
      { id: 'cul-14', content: 'Comprar Ingresso para Evento', subPillar: 'Teatro', xp: 25 },
      { id: 'cul-15', content: 'Ver Exposição de Arte', subPillar: 'Arte', xp: 45 },
      { id: 'cul-16', content: 'Ler Biografia de Artista', subPillar: 'Literatura', xp: 35 },
      { id: 'cul-17', content: 'Apreciar Arquitetura Local', subPillar: 'Arte', xp: 30 },
      { id: 'cul-18', content: 'Degustação de Vinhos', subPillar: 'Gastronomia', xp: 40 },
      { id: 'cul-19', content: 'Ver Documentário de Arte', subPillar: 'Cinema', xp: 30 },
      { id: 'cul-20', content: 'Escrever Crítica de Filme/Livro', subPillar: 'Literatura', xp: 35 }
    ]
  },
  professional: {
    label: 'Profissional',
    color: '#10b981',
    subPillars: [
      'Projetos', 'Finanças', 'Liderança', 'Vendas', 'Networking',
      'Produtividade', 'Negociação', 'Marketing', 'Inovação', 'Comunicação'
    ],
    tasks: [
      { id: 'pro-1', content: 'Definir OKRs da Semana', subPillar: 'Projetos', xp: 40 },
      { id: 'pro-2', content: 'Reunião de Alinhamento com Equipe', subPillar: 'Liderança', xp: 35 },
      { id: 'pro-3', content: 'Atualizar Planilha Financeira', subPillar: 'Finanças', xp: 30 },
      { id: 'pro-4', content: 'Fazer 5 Ligações de Prospecção', subPillar: 'Vendas', xp: 45 },
      { id: 'pro-5', content: 'Café com Contato de Networking', subPillar: 'Networking', xp: 40 },
      { id: 'pro-6', content: 'Organizar Inbox (Inbox Zero)', subPillar: 'Produtividade', xp: 30 },
      { id: 'pro-7', content: 'Criar Apresentação de Vendas', subPillar: 'Vendas', xp: 50 },
      { id: 'pro-8', content: 'Negociar Contrato / Proposta', subPillar: 'Negociação', xp: 60 },
      { id: 'pro-9', content: 'Atualizar Perfil do LinkedIn', subPillar: 'Marketing', xp: 25 },
      { id: 'pro-10', content: 'Revisar Fluxo de Caixa', subPillar: 'Finanças', xp: 40 },
      { id: 'pro-11', content: 'Dar Feedback para Colaborador', subPillar: 'Liderança', xp: 45 },
      { id: 'pro-12', content: 'Brainstorming de Novo Produto', subPillar: 'Inovação', xp: 50 },
      { id: 'pro-13', content: 'Analisar Métricas de Marketing', subPillar: 'Marketing', xp: 35 },
      { id: 'pro-14', content: 'Responder Emails Críticos', subPillar: 'Comunicação', xp: 25 },
      { id: 'pro-15', content: 'Organizar Arquivos do Drive', subPillar: 'Produtividade', xp: 25 },
      { id: 'pro-16', content: 'Pagar Contas da Empresa', subPillar: 'Finanças', xp: 30 },
      { id: 'pro-17', content: 'Estudar Concorrentes', subPillar: 'Inovação', xp: 40 },
      { id: 'pro-18', content: 'Planejar Pauta de Conteúdo', subPillar: 'Marketing', xp: 35 },
      { id: 'pro-19', content: 'Delegar Tarefas Operacionais', subPillar: 'Liderança', xp: 40 },
      { id: 'pro-20', content: 'Reunião de Fechamento Mensal', subPillar: 'Projetos', xp: 45 }
    ]
  },
  personal: {
    label: 'Pessoal',
    color: '#06b6d4',
    subPillars: [
      'Família', 'Relacionamento', 'Hobbies', 'Casa', 'Amizades',
      'Pets', 'Presentes', 'Filhos', 'Autocuidado', 'Lazer'
    ],
    tasks: [
      { id: 'per-1', content: 'Jantar Romântico (Date Night)', subPillar: 'Relacionamento', xp: 45 },
      { id: 'per-2', content: 'Brincar com os Filhos (sem celular)', subPillar: 'Filhos', xp: 40 },
      { id: 'per-3', content: 'Ligar para os Pais', subPillar: 'Família', xp: 30 },
      { id: 'per-4', content: 'Sair com Amigos', subPillar: 'Amizades', xp: 40 },
      { id: 'per-5', content: 'Passear com o Cachorro', subPillar: 'Pets', xp: 25 },
      { id: 'per-6', content: 'Limpeza da Casa (Faxina)', subPillar: 'Casa', xp: 40 },
      { id: 'per-7', content: 'Comprar Presente de Aniversário', subPillar: 'Presentes', xp: 30 },
      { id: 'per-8', content: 'Jogar Videogame / Boardgame', subPillar: 'Lazer', xp: 30 },
      { id: 'per-9', content: 'Consertar algo quebrado em casa', subPillar: 'Casa', xp: 35 },
      { id: 'per-10', content: 'Organizar Guarda-Roupa', subPillar: 'Casa', xp: 35 },
      { id: 'per-11', content: 'Dia de Spa em casa', subPillar: 'Autocuidado', xp: 40 },
      { id: 'per-12', content: 'Levar Pet ao Veterinário', subPillar: 'Pets', xp: 35 },
      { id: 'per-13', content: 'Planejar Férias em Família', subPillar: 'Família', xp: 45 },
      { id: 'per-14', content: 'Ir ao Supermercado', subPillar: 'Casa', xp: 20 },
      { id: 'per-15', content: 'Regar as Plantas', subPillar: 'Casa', xp: 15 },
      { id: 'per-16', content: 'Lavar o Carro', subPillar: 'Casa', xp: 25 },
      { id: 'per-17', content: 'Praticar Hobby (ex: Jardinagem)', subPillar: 'Hobbies', xp: 35 },
      { id: 'per-18', content: 'Almoço de Domingo em Família', subPillar: 'Família', xp: 40 },
      { id: 'per-19', content: 'Rever Fotos Antigas', subPillar: 'Família', xp: 25 },
      { id: 'per-20', content: 'Pagar Contas Pessoais', subPillar: 'Casa', xp: 25 }
    ]
  }
};

// Get all tasks for a pillar
export const getTasksByPillar = (pillarKey) => {
  return TASK_TEMPLATES[pillarKey]?.tasks || [];
};

// Get tasks by sub-pillar
export const getTasksBySubPillar = (pillarKey, subPillar) => {
  const tasks = TASK_TEMPLATES[pillarKey]?.tasks || [];
  return tasks.filter(t => t.subPillar === subPillar);
};

// Get all sub-pillars for a pillar
export const getSubPillars = (pillarKey) => {
  return TASK_TEMPLATES[pillarKey]?.subPillars || [];
};

// Search tasks by keyword
export const searchTasks = (keyword) => {
  const results = [];
  const lowerKeyword = keyword.toLowerCase();
  
  Object.entries(TASK_TEMPLATES).forEach(([pillarKey, pillarData]) => {
    pillarData.tasks.forEach(task => {
      if (task.content.toLowerCase().includes(lowerKeyword)) {
        results.push({ ...task, pillar: pillarKey, pillarLabel: pillarData.label });
      }
    });
  });
  
  return results;
};

// Get random tasks for suggestions
export const getRandomTasks = (pillarKey, count = 5) => {
  const tasks = getTasksByPillar(pillarKey);
  const shuffled = [...tasks].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

// Get all 140 tasks as flat array
export const getAllTasks = () => {
  const allTasks = [];
  Object.entries(TASK_TEMPLATES).forEach(([pillarKey, pillarData]) => {
    pillarData.tasks.forEach(task => {
      allTasks.push({ ...task, pillar: pillarKey, pillarLabel: pillarData.label, color: pillarData.color });
    });
  });
  return allTasks;
};
