// Junguian Archetypes
export const ARCHETYPES = [
  {
    key: 'innocent',
    name: 'Inocente',
    nameEn: 'The Innocent',
    motto: 'Livre para ser você mesmo',
    color: '#fef3c7',
    icon: '🕊️',
    focus: ['spiritual', 'personal'],
    description: 'Busca a felicidade através da simplicidade e otimismo'
  },
  {
    key: 'explorer',
    name: 'Explorador',
    nameEn: 'The Explorer',
    motto: 'Não me limite',
    color: '#d1fae5',
    icon: '🧭',
    focus: ['physical', 'cultural'],
    description: 'Busca liberdade através de aventura e descoberta'
  },
  {
    key: 'sage',
    name: 'Sábio',
    nameEn: 'The Sage',
    motto: 'A verdade libertará você',
    color: '#dbeafe',
    icon: '📚',
    focus: ['intellectual', 'mental'],
    description: 'Busca verdade através de conhecimento e análise'
  },
  {
    key: 'hero',
    name: 'Herói',
    nameEn: 'The Hero',
    motto: 'Onde há vontade, há um caminho',
    color: '#fecaca',
    icon: '⚔️',
    focus: ['physical', 'professional'],
    description: 'Prova seu valor através de coragem e ação'
  },
  {
    key: 'outlaw',
    name: 'Fora da Lei',
    nameEn: 'The Outlaw',
    motto: 'Regras são feitas para serem quebradas',
    color: '#1f2937',
    icon: '🔥',
    focus: ['personal', 'cultural'],
    description: 'Busca revolução e libertação das estruturas'
  },
  {
    key: 'magician',
    name: 'Mago',
    nameEn: 'The Magician',
    motto: 'Eu faço acontecer',
    color: '#c4b5fd',
    icon: '✨',
    focus: ['spiritual', 'intellectual'],
    description: 'Transforma realidade através de visão e conhecimento'
  },
  {
    key: 'everyman',
    name: 'Cara Comum',
    nameEn: 'The Everyman',
    motto: 'Todos são criados iguais',
    color: '#e5e7eb',
    icon: '🤝',
    focus: ['personal', 'mental'],
    description: 'Busca pertencimento e conexão autêntica'
  },
  {
    key: 'lover',
    name: 'Amante',
    nameEn: 'The Lover',
    motto: 'Você é o único',
    color: '#fce7f3',
    icon: '💕',
    focus: ['personal', 'cultural'],
    description: 'Busca intimidade e experiências sensoriais'
  },
  {
    key: 'jester',
    name: 'Bobo da Corte',
    nameEn: 'The Jester',
    motto: 'Você só vive uma vez',
    color: '#fef08a',
    icon: '🎭',
    focus: ['cultural', 'mental'],
    description: 'Vive o momento com alegria e leveza'
  },
  {
    key: 'caregiver',
    name: 'Cuidador',
    nameEn: 'The Caregiver',
    motto: 'Ame seu próximo como a si mesmo',
    color: '#bbf7d0',
    icon: '🌱',
    focus: ['personal', 'spiritual'],
    description: 'Protege e cuida dos outros com compaixão'
  },
  {
    key: 'creator',
    name: 'Criador',
    nameEn: 'The Creator',
    motto: 'Se pode ser imaginado, pode ser criado',
    color: '#fbcfe8',
    icon: '🎨',
    focus: ['intellectual', 'cultural'],
    description: 'Cria valor duradouro através de inovação'
  },
  {
    key: 'ruler',
    name: 'Governante',
    nameEn: 'The Ruler',
    motto: 'O poder não é tudo, é a única coisa',
    color: '#fcd34d',
    icon: '👑',
    focus: ['professional', 'intellectual'],
    description: 'Exerce controle e cria ordem do caos'
  }
];

export const getArchetypeByKey = (key) => ARCHETYPES.find(a => a.key === key);

// Human Design Types
export const HD_TYPES = [
  {
    key: 'generator',
    name: 'Gerador',
    nameEn: 'Generator',
    strategy: 'Responder',
    strategyEn: 'To Respond',
    authority: 'Sacral',
    percentage: '37%',
    color: '#ef4444',
    description: 'Força de trabalho do planeta. Energia sustentável quando responde ao que ama.',
    gutCheckPrompt: 'Você sente excitação genuína? Seu corpo responde com um "SIM" visceral?',
    notSelfTheme: 'Frustração'
  },
  {
    key: 'manifesting_generator',
    name: 'Gerador Manifestante',
    nameEn: 'Manifesting Generator',
    strategy: 'Responder e Informar',
    strategyEn: 'To Respond & Inform',
    authority: 'Sacral',
    percentage: '33%',
    color: '#f97316',
    description: 'Multi-apaixonado. Pula etapas naturalmente quando segue a resposta sacral.',
    gutCheckPrompt: 'Visualize o resultado. Isso acende algo em você? Sente pressa ou resposta genuína?',
    notSelfTheme: 'Frustração e Raiva'
  },
  {
    key: 'projector',
    name: 'Projetor',
    nameEn: 'Projector',
    strategy: 'Aguardar o Convite',
    strategyEn: 'Wait for the Invitation',
    authority: 'Varies',
    percentage: '20%',
    color: '#3b82f6',
    description: 'Guias naturais. Veem profundamente os outros quando reconhecidos.',
    gutCheckPrompt: 'Você foi convidado ou reconhecido para isso? Este é um convite genuíno para seus talentos?',
    notSelfTheme: 'Amargura'
  },
  {
    key: 'manifestor',
    name: 'Manifestador',
    nameEn: 'Manifestor',
    strategy: 'Informar',
    strategyEn: 'To Inform',
    authority: 'Emotional/Splenic',
    percentage: '8%',
    color: '#8b5cf6',
    description: 'Iniciadores. Impactam o mundo quando informam antes de agir.',
    gutCheckPrompt: 'Isso vem de um impulso interno claro? Você informou os que serão afetados?',
    notSelfTheme: 'Raiva'
  },
  {
    key: 'reflector',
    name: 'Refletor',
    nameEn: 'Reflector',
    strategy: 'Esperar Ciclo Lunar',
    strategyEn: 'Wait a Lunar Cycle',
    authority: 'Lunar',
    percentage: '1%',
    color: '#06b6d4',
    description: 'Espelhos da comunidade. Sabedoria única quando dão tempo às decisões.',
    gutCheckPrompt: 'Você esperou um ciclo lunar (28 dias) para decidir sobre decisões importantes?',
    notSelfTheme: 'Decepção'
  }
];

export const getHDTypeByKey = (key) => HD_TYPES.find(t => t.key === key);

// Zodiac Signs
export const ZODIAC_SIGNS = [
  { key: 'aries', name: 'Áries', symbol: '♈', element: 'fire', dates: '21/03 - 19/04' },
  { key: 'taurus', name: 'Touro', symbol: '♉', element: 'earth', dates: '20/04 - 20/05' },
  { key: 'gemini', name: 'Gêmeos', symbol: '♊', element: 'air', dates: '21/05 - 20/06' },
  { key: 'cancer', name: 'Câncer', symbol: '♋', element: 'water', dates: '21/06 - 22/07' },
  { key: 'leo', name: 'Leão', symbol: '♌', element: 'fire', dates: '23/07 - 22/08' },
  { key: 'virgo', name: 'Virgem', symbol: '♍', element: 'earth', dates: '23/08 - 22/09' },
  { key: 'libra', name: 'Libra', symbol: '♎', element: 'air', dates: '23/09 - 22/10' },
  { key: 'scorpio', name: 'Escorpião', symbol: '♏', element: 'water', dates: '23/10 - 21/11' },
  { key: 'sagittarius', name: 'Sagitário', symbol: '♐', element: 'fire', dates: '22/11 - 21/12' },
  { key: 'capricorn', name: 'Capricórnio', symbol: '♑', element: 'earth', dates: '22/12 - 19/01' },
  { key: 'aquarius', name: 'Aquário', symbol: '♒', element: 'air', dates: '20/01 - 18/02' },
  { key: 'pisces', name: 'Peixes', symbol: '♓', element: 'water', dates: '19/02 - 20/03' }
];

export const getZodiacByKey = (key) => ZODIAC_SIGNS.find(z => z.key === key);