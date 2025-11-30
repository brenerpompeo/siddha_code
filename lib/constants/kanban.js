export const KANBAN_COLUMNS = [
  {
    id: 'potential',
    label: 'Potencial',
    description: 'Ideas awaiting response',
    color: '#6b7280',
    bgClass: 'bg-kanban-potential',
    borderClass: 'border-kanban-potential'
  },
  {
    id: 'response',
    label: 'Resposta',
    description: 'Responded YES, in progress',
    color: '#10b981',
    bgClass: 'bg-kanban-response',
    borderClass: 'border-kanban-response',
    requiresGutCheck: true
  },
  {
    id: 'integration',
    label: 'Integração',
    description: 'Integrating learnings',
    color: '#f59e0b',
    bgClass: 'bg-kanban-integration',
    borderClass: 'border-kanban-integration'
  },
  {
    id: 'wisdom',
    label: 'Sabedoria',
    description: 'Knowledge acquired',
    color: '#8b5cf6',
    bgClass: 'bg-kanban-wisdom',
    borderClass: 'border-kanban-wisdom'
  }
];

export const getColumnById = (id) => {
  return KANBAN_COLUMNS.find(col => col.id === id);
};

export const GUT_CHECK_PROMPTS = {
  generator: 'Você sente excitação genuína? Seu corpo responde com um "SIM" visceral?',
  manifesting_generator: 'Esta tarefa acende algo em você? Visualize o resultado.',
  projector: 'Você foi convidado ou reconhecido para isso?',
  manifestor: 'Isso vem de um impulso interno claro? Você informou os afetados?',
  reflector: 'Você esperou um ciclo lunar para decidir sobre isso?',
  default: 'De 1 a 10, quão alinhado você se sente com esta tarefa?'
};

export const XP_REWARDS = {
  task_complete: 10,
  daily_task_complete: 15,
  protocol_complete: 5,
  all_protocols_daily: 25,
  sprint_complete: 100,
  journal_entry: 10,
  not_self_log: 15,
  high_gut_check: 5
};