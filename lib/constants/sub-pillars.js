// 70 Sub-Pillars organized by Pillar
export const SUB_PILLARS = {
  physical: [
    { key: 'musculacao', label: 'Musculação', icon: '💪' },
    { key: 'cardio', label: 'Cardio', icon: '🏃' },
    { key: 'nutricao', label: 'Nutrição', icon: '🥗' },
    { key: 'sono', label: 'Sono', icon: '😴' },
    { key: 'estetica', label: 'Estética', icon: '✨' },
    { key: 'hidratacao', label: 'Hidratação', icon: '💧' },
    { key: 'flexibilidade', label: 'Flexibilidade', icon: '🧘' },
    { key: 'checkups', label: 'Check-ups', icon: '🏥' },
    { key: 'postura', label: 'Postura', icon: '🧍' },
    { key: 'suplementacao', label: 'Suplementação', icon: '💊' }
  ],
  mental: [
    { key: 'meditacao', label: 'Meditação', icon: '🧘‍♀️' },
    { key: 'terapia', label: 'Terapia', icon: '🛋️' },
    { key: 'gestao_emocional', label: 'Gestão Emocional', icon: '💭' },
    { key: 'resiliencia', label: 'Resiliência', icon: '🔥' },
    { key: 'autoconhecimento', label: 'Autoconhecimento', icon: '🔍' },
    { key: 'mindfulness', label: 'Mindfulness', icon: '🌿' },
    { key: 'ansiedade', label: 'Ansiedade', icon: '😮‍💨' },
    { key: 'gratidao', label: 'Gratidão', icon: '🙏' },
    { key: 'journaling', label: 'Journaling', icon: '📝' },
    { key: 'respiracao', label: 'Respiração', icon: '🌬️' }
  ],
  intellectual: [
    { key: 'leitura', label: 'Leitura', icon: '📚' },
    { key: 'estudos', label: 'Estudos', icon: '📖' },
    { key: 'idiomas', label: 'Idiomas', icon: '🌍' },
    { key: 'escrita', label: 'Escrita', icon: '✍️' },
    { key: 'cursos', label: 'Cursos', icon: '🎓' },
    { key: 'podcasts', label: 'Podcasts', icon: '🎧' },
    { key: 'documentarios', label: 'Documentários', icon: '🎬' },
    { key: 'debates', label: 'Debates', icon: '💬' },
    { key: 'pesquisas', label: 'Pesquisas', icon: '🔬' },
    { key: 'mentorias', label: 'Mentorias', icon: '👨‍🏫' }
  ],
  spiritual: [
    { key: 'natureza', label: 'Natureza', icon: '🌳' },
    { key: 'oracao', label: 'Oração', icon: '🙏' },
    { key: 'silencio', label: 'Silêncio', icon: '🤫' },
    { key: 'caridade', label: 'Caridade', icon: '💝' },
    { key: 'rituais', label: 'Rituais', icon: '🕯️' },
    { key: 'proposito', label: 'Propósito', icon: '🎯' },
    { key: 'reflexao', label: 'Reflexão', icon: '💭' },
    { key: 'comunidade', label: 'Comunidade', icon: '👥' },
    { key: 'perdao', label: 'Perdão', icon: '🕊️' },
    { key: 'fe', label: 'Fé', icon: '✝️' }
  ],
  cultural: [
    { key: 'musica', label: 'Música', icon: '🎵' },
    { key: 'cinema', label: 'Cinema', icon: '🎬' },
    { key: 'arte', label: 'Arte', icon: '🎨' },
    { key: 'viagens', label: 'Viagens', icon: '✈️' },
    { key: 'gastronomia', label: 'Gastronomia', icon: '🍽️' },
    { key: 'teatro', label: 'Teatro', icon: '🎭' },
    { key: 'exposicoes', label: 'Exposições', icon: '🖼️' },
    { key: 'literatura', label: 'Literatura', icon: '📖' },
    { key: 'fotografia', label: 'Fotografia', icon: '📷' },
    { key: 'danca', label: 'Dança', icon: '💃' }
  ],
  professional: [
    { key: 'projetos', label: 'Projetos', icon: '📋' },
    { key: 'financas', label: 'Finanças', icon: '💰' },
    { key: 'lideranca', label: 'Liderança', icon: '👔' },
    { key: 'vendas', label: 'Vendas', icon: '🤝' },
    { key: 'networking', label: 'Networking', icon: '🌐' },
    { key: 'produtividade', label: 'Produtividade', icon: '⚡' },
    { key: 'negociacao', label: 'Negociação', icon: '🤝' },
    { key: 'marketing', label: 'Marketing', icon: '📢' },
    { key: 'inovacao', label: 'Inovação', icon: '💡' },
    { key: 'comunicacao', label: 'Comunicação', icon: '🗣️' }
  ],
  personal: [
    { key: 'familia', label: 'Família', icon: '👨‍👩‍👧‍👦' },
    { key: 'relacionamento', label: 'Relacionamento', icon: '💑' },
    { key: 'hobbies', label: 'Hobbies', icon: '🎮' },
    { key: 'casa', label: 'Casa', icon: '🏠' },
    { key: 'amizades', label: 'Amizades', icon: '👯' },
    { key: 'pets', label: 'Pets', icon: '🐕' },
    { key: 'presentes', label: 'Presentes', icon: '🎁' },
    { key: 'filhos', label: 'Filhos', icon: '👶' },
    { key: 'autocuidado', label: 'Autocuidado', icon: '🛁' },
    { key: 'lazer', label: 'Lazer', icon: '🎉' }
  ]
};

// Get all sub-pillars as flat array
export const getAllSubPillars = () => {
  return Object.entries(SUB_PILLARS).flatMap(([pillarKey, subPillars]) => 
    subPillars.map(sp => ({ ...sp, pillar: pillarKey }))
  );
};

// Get sub-pillars by pillar key
export const getSubPillarsByPillar = (pillarKey) => SUB_PILLARS[pillarKey] || [];

// Find sub-pillar by key
export const getSubPillarByKey = (key) => {
  for (const [pillarKey, subPillars] of Object.entries(SUB_PILLARS)) {
    const found = subPillars.find(sp => sp.key === key);
    if (found) return { ...found, pillar: pillarKey };
  }
  return null;
};

// Pillar-specific task fields
export const PILLAR_FIELDS = {
  physical: [
    { key: 'weight', label: 'Carga/Peso', type: 'text', placeholder: 'Ex: 50kg' },
    { key: 'distance', label: 'Distância', type: 'text', placeholder: 'Ex: 5km' },
    { key: 'duration', label: 'Duração', type: 'text', placeholder: 'Ex: 45min' }
  ],
  mental: [
    { key: 'emotion', label: 'Emoção Principal', type: 'text', placeholder: 'Ex: Ansiedade' },
    { key: 'intensity', label: 'Intensidade (1-10)', type: 'number', placeholder: '7' }
  ],
  intellectual: [
    { key: 'link', label: 'Link/Resumo', type: 'url', placeholder: 'URL do material' },
    { key: 'page', label: 'Página Atual', type: 'number', placeholder: 'Página' },
    { key: 'progress', label: 'Progresso %', type: 'number', placeholder: '75' }
  ],
  spiritual: [
    { key: 'intention', label: 'Intenção', type: 'textarea', placeholder: 'Qual a intenção?' }
  ],
  cultural: [
    { key: 'rating', label: 'Avaliação (1-5)', type: 'number', placeholder: '5' },
    { key: 'review', label: 'Resenha', type: 'textarea', placeholder: 'O que achou?' }
  ],
  professional: [
    { key: 'value', label: 'Valor (R$)', type: 'number', placeholder: '1000' },
    { key: 'stakeholder', label: 'Stakeholder', type: 'text', placeholder: 'Nome do responsável' },
    { key: 'deadline', label: 'Prazo', type: 'date', placeholder: '' }
  ],
  personal: [
    { key: 'people', label: 'Pessoas Envolvidas', type: 'text', placeholder: 'Nomes' },
    { key: 'location', label: 'Local', type: 'text', placeholder: 'Onde?' }
  ]
};