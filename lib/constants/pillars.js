export const PILLARS = [
  {
    key: 'physical',
    label: 'Físico',
    color: '#10b981',
    bgClass: 'bg-pillar-physical',
    textClass: 'text-pillar-physical',
    description: 'Health, fitness, energy management'
  },
  {
    key: 'mental',
    label: 'Mental',
    color: '#0ea5e9',
    bgClass: 'bg-pillar-mental',
    textClass: 'text-pillar-mental',
    description: 'Emotional well-being, mindfulness'
  },
  {
    key: 'intellectual',
    label: 'Intelectual',
    color: '#6366f1',
    bgClass: 'bg-pillar-intellectual',
    textClass: 'text-pillar-intellectual',
    description: 'Learning, skills, knowledge'
  },
  {
    key: 'spiritual',
    label: 'Espiritual',
    color: '#8b5cf6',
    bgClass: 'bg-pillar-spiritual',
    textClass: 'text-pillar-spiritual',
    description: 'Purpose, meaning, inner peace'
  },
  {
    key: 'cultural',
    label: 'Cultural',
    color: '#ec4899',
    bgClass: 'bg-pillar-cultural',
    textClass: 'text-pillar-cultural',
    description: 'Arts, creativity, experiences'
  },
  {
    key: 'professional',
    label: 'Profissional',
    color: '#f59e0b',
    bgClass: 'bg-pillar-professional',
    textClass: 'text-pillar-professional',
    description: 'Career, skills, achievements'
  },
  {
    key: 'personal',
    label: 'Pessoal',
    color: '#ef4444',
    bgClass: 'bg-pillar-personal',
    textClass: 'text-pillar-personal',
    description: 'Relationships, family, self-care'
  }
];

export const getPillarByKey = (key) => {
  return PILLARS.find(p => p.key === key);
};

export const getPillarColor = (key) => {
  const pillar = getPillarByKey(key);
  return pillar ? pillar.color : '#6b7280';
};