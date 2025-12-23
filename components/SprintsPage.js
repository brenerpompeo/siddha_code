'use client';
import { useState, useEffect, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  Kanban, Calendar, BarChart3, Plus, ChevronDown, Flame, Clock, X, CheckCircle2, 
  CalendarDays, Edit3, Trash2, GripVertical, Star, Target
} from 'lucide-react';
import { 
  DndContext, DragOverlay, closestCorners, KeyboardSensor, PointerSensor, 
  useSensor, useSensors, useDroppable 
} from '@dnd-kit/core';
import { 
  arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, 
  verticalListSortingStrategy 
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/cn';
import { GlassCard } from './custom-ui/GlassCard';
import { CustomButton as Button } from './custom-ui/CustomButton';
import { Badge } from './custom-ui/Badge';
import { CustomInput as Input } from './custom-ui/CustomInput';
import { Tabs } from './custom-ui/Tabs';
import SprintBuilder from './SprintBuilder';
import TaskDetailModal from './TaskDetailModal';
import { getArchetypeByKey, getHDTypeByKey } from '@/lib/constants/archetypes';
import { PILLARS, getPillarByKey } from '@/lib/constants/pillars';
import { KANBAN_COLUMNS, XP_REWARDS } from '@/lib/constants/kanban';

// Sprint Status Badge Component
const SprintStatusBadge = ({ status }) => {
  const statusConfig = {
    active: { label: 'Ativo', color: '#10b981', bg: '#10b98120' },
    scheduled: { label: 'Programado', color: '#3b82f6', bg: '#3b82f620' },
    paused: { label: 'Pausado', color: '#f59e0b', bg: '#f59e0b20' },
    cancelled: { label: 'Cancelado', color: '#ef4444', bg: '#ef444420' },
    completed: { label: 'Concluído', color: '#8b5cf6', bg: '#8b5cf620' }
  };
  const config = statusConfig[status] || statusConfig.active;
  return (
    <span 
      className="px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ backgroundColor: config.bg, color: config.color }}
    >
      {config.label}
    </span>
  );
};

// Sprint Selector Component
const SprintSelector = ({ sprints, selectedSprint, onSelect, onNewSprint }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all min-w-[250px]"
      >
        {selectedSprint ? (
          <>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-white">{selectedSprint.title}</p>
              <p className="text-xs text-white/50">
                {getArchetypeByKey(selectedSprint.archetype)?.icon} {selectedSprint.duration} dias
              </p>
            </div>
            <SprintStatusBadge status={selectedSprint.status} />
          </>
        ) : (
          <span className="text-white/50">Selecionar Sprint</span>
        )}
        <ChevronDown className={cn('w-4 h-4 text-white/50 transition-transform', isOpen && 'rotate-180')} />
      </button>
      
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 mt-2 w-full bg-surface border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden">
            <div className="max-h-[300px] overflow-y-auto">
              {sprints.length === 0 ? (
                <div className="p-4 text-center text-white/50">
                  <p className="text-sm">Nenhum sprint criado</p>
                </div>
              ) : (
                sprints.map(sprint => (
                  <button
                    key={sprint.id}
                    onClick={() => { onSelect(sprint); setIsOpen(false); }}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-all text-left',
                      selectedSprint?.id === sprint.id && 'bg-white/10'
                    )}
                  >
                    <span className="text-xl">{getArchetypeByKey(sprint.archetype)?.icon}</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{sprint.title}</p>
                      <p className="text-xs text-white/50">{sprint.duration} dias</p>
                    </div>
                    <SprintStatusBadge status={sprint.status} />
                  </button>
                ))
              )}
            </div>
            <div className="border-t border-white/10 p-2">
              <button
                onClick={() => { onNewSprint(); setIsOpen(false); }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-primary hover:bg-primary/10 rounded-lg transition-all"
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm">Novo Sprint</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Sprint Master Section (Status Tabs)
const SprintMasterSection = ({ sprints, selectedStatus, onSelectStatus, onSelectSprint }) => {
  const statusTabs = [
    { id: 'active', label: 'Ativos', icon: Flame, count: sprints.filter(s => s.status === 'active').length },
    { id: 'scheduled', label: 'Programados', icon: CalendarDays, count: sprints.filter(s => s.status === 'scheduled').length },
    { id: 'paused', label: 'Pausados', icon: Clock, count: sprints.filter(s => s.status === 'paused').length },
    { id: 'cancelled', label: 'Cancelados', icon: X, count: sprints.filter(s => s.status === 'cancelled').length },
    { id: 'completed', label: 'Concluídos', icon: CheckCircle2, count: sprints.filter(s => s.status === 'completed').length },
  ];
  
  const filteredSprints = sprints.filter(s => s.status === selectedStatus);
  
  return (
    <GlassCard className="p-4">
      {/* Status Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {statusTabs.map(tab => {
          const TabIcon = tab.icon;
          const isActive = selectedStatus === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectStatus(tab.id)}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-lg whitespace-nowrap transition-all text-sm',
                isActive ? 'bg-primary text-white' : 'bg-white/5 text-white/60 hover:bg-white/10'
              )}
            >
              <TabIcon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span className={cn(
                  'px-1.5 py-0.5 rounded-full text-xs',
                  isActive ? 'bg-white/20' : 'bg-white/10'
                )}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
      
      {/* Sprint Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredSprints.length === 0 ? (
          <div className="col-span-full text-center py-8 text-white/40">
            <p>Nenhum sprint {statusTabs.find(t => t.id === selectedStatus)?.label.toLowerCase()}</p>
          </div>
        ) : (
          filteredSprints.map(sprint => {
            const archetype = getArchetypeByKey(sprint.archetype);
            const progress = sprint.tasks_count > 0 
              ? Math.round((sprint.completed_tasks || 0) / sprint.tasks_count * 100) 
              : 0;
            return (
              <button
                key={sprint.id}
                onClick={() => onSelectSprint(sprint)}
                className="p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:border-white/15 transition-all text-left group"
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-2xl">{archetype?.icon}</span>
                  <SprintStatusBadge status={sprint.status} />
                </div>
                <h4 className="font-medium text-white mb-1 group-hover:text-primary transition-colors">
                  {sprint.title}
                </h4>
                <p className="text-xs text-white/50 mb-3 line-clamp-2">{sprint.intention}</p>
                
                {/* Progress Bar */}
                <div className="mb-2">
                  <div className="flex justify-between text-xs text-white/50 mb-1">
                    <span>{sprint.tasks_count || 0} tasks</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                
                {/* Pillars */}
                {sprint.focusPillars?.length > 0 && (
                  <div className="flex gap-1">
                    {sprint.focusPillars.map(p => {
                      const pillar = getPillarByKey(p);
                      return (
                        <span key={p} className="w-3 h-3 rounded-full" style={{ backgroundColor: pillar?.color }} title={pillar?.label} />
                      );
                    })}
                  </div>
                )}
              </button>
            );
          })
        )}
      </div>
    </GlassCard>
  );
};

// Timeline View Component
const TimelineView = ({ tasks, sprints, selectedSprint }) => {
  const sprintTasks = selectedSprint 
    ? tasks.filter(t => t.sprintId === selectedSprint.id)
    : tasks;
  
  const days = selectedSprint?.duration || 7;
  const startDate = selectedSprint?.created_at ? new Date(selectedSprint.created_at) : new Date();
  
  return (
    <GlassCard className="p-4 overflow-x-auto">
      <h4 className="text-sm font-medium text-white/70 mb-4">Timeline do Sprint</h4>
      <div className="min-w-[600px]">
        {/* Days Header */}
        <div className="flex border-b border-white/10 pb-2 mb-4">
          <div className="w-40 flex-shrink-0" />
          {Array.from({ length: Math.min(days, 14) }).map((_, i) => {
            const date = new Date(startDate);
            date.setDate(date.getDate() + i);
            const isToday = date.toDateString() === new Date().toDateString();
            return (
              <div key={i} className={cn(
                'flex-1 text-center text-xs px-1',
                isToday ? 'text-primary font-bold' : 'text-white/50'
              )}>
                <div>{['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][date.getDay()]}</div>
                <div className={cn(
                  'w-6 h-6 rounded-full mx-auto mt-1 flex items-center justify-center',
                  isToday && 'bg-primary text-white'
                )}>
                  {date.getDate()}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Tasks by Pillar */}
        {PILLARS.filter(p => sprintTasks.some(t => t.pillar === p.key)).map(pillar => (
          <div key={pillar.key} className="flex items-center mb-3">
            <div className="w-40 flex-shrink-0 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: pillar.color }} />
              <span className="text-sm text-white/70 truncate">{pillar.label}</span>
            </div>
            <div className="flex-1 h-8 bg-white/5 rounded-lg relative">
              {sprintTasks.filter(t => t.pillar === pillar.key).map((task, i) => (
                <div
                  key={task.id}
                  className="absolute h-6 top-1 rounded px-2 text-xs flex items-center truncate"
                  style={{ 
                    backgroundColor: `${pillar.color}30`,
                    color: pillar.color,
                    left: `${(i * 15) % 70}%`,
                    width: '25%',
                    maxWidth: '120px'
                  }}
                  title={task.content}
                >
                  {task.content?.slice(0, 15)}...
                </div>
              ))}
            </div>
          </div>
        ))}
        
        {sprintTasks.length === 0 && (
          <div className="text-center py-8 text-white/40">
            <p>Nenhuma tarefa neste sprint</p>
          </div>
        )}
      </div>
    </GlassCard>
  );
};

// Roadmap View Component (List by Pillar)
const RoadmapView = ({ tasks, selectedSprint }) => {
  const sprintTasks = selectedSprint 
    ? tasks.filter(t => t.sprintId === selectedSprint.id)
    : tasks;
  
  const tasksByPillar = useMemo(() => {
    const grouped = {};
    PILLARS.forEach(p => {
      grouped[p.key] = sprintTasks.filter(t => t.pillar === p.key);
    });
    return grouped;
  }, [sprintTasks]);
  
  return (
    <div className="space-y-4">
      {PILLARS.filter(p => tasksByPillar[p.key]?.length > 0).map(pillar => (
        <GlassCard key={pillar.key} className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${pillar.color}20` }}
            >
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: pillar.color }} />
            </div>
            <div>
              <h4 className="font-medium text-white">{pillar.label}</h4>
              <p className="text-xs text-white/50">{tasksByPillar[pillar.key].length} tarefas</p>
            </div>
          </div>
          
          <div className="space-y-2">
            {tasksByPillar[pillar.key].map(task => (
              <div 
                key={task.id}
                className="flex items-center gap-3 p-3 bg-white/[0.02] rounded-lg border border-white/5"
              >
                <div className={cn(
                  'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0',
                  task.status === 'wisdom' ? 'border-green-500 bg-green-500' : 'border-white/30'
                )}>
                  {task.status === 'wisdom' && <CheckCircle2 className="w-3 h-3 text-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    'text-sm',
                    task.status === 'wisdom' ? 'text-white/50 line-through' : 'text-white'
                  )}>
                    {task.content}
                  </p>
                  {task.subPillar && (
                    <span className="text-xs text-white/40">{task.subPillar}</span>
                  )}
                </div>
                <Badge color={KANBAN_COLUMNS.find(c => c.id === task.status)?.color}>
                  {KANBAN_COLUMNS.find(c => c.id === task.status)?.label}
                </Badge>
              </div>
            ))}
          </div>
        </GlassCard>
      ))}
      
      {sprintTasks.length === 0 && (
        <GlassCard className="p-8 text-center">
          <p className="text-white/40">Nenhuma tarefa neste sprint</p>
        </GlassCard>
      )}
    </div>
  );
};

// Sprint Detail Panel
const SprintDetailPanel = ({ sprint, onClose, onUpdateStatus, onEdit, onDelete, tasksCount }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  if (!sprint) return null;
  
  const archetype = getArchetypeByKey(sprint.archetype);
  
  return (
    <GlassCard className="p-5 mb-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div 
            className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl"
            style={{ backgroundColor: `${archetype?.color}20` }}
          >
            {archetype?.icon}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{sprint.title}</h2>
            <div className="flex items-center gap-2 mt-1">
              <SprintStatusBadge status={sprint.status} />
              <span className="text-xs text-white/40">•</span>
              <span className="text-xs text-white/50">{sprint.duration} dias</span>
              <span className="text-xs text-white/40">•</span>
              <span className="text-xs text-white/50">{archetype?.name}</span>
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Status Actions */}
          {sprint.status === 'active' && (
            <>
              <Button variant="ghost" size="sm" onClick={() => onUpdateStatus(sprint.id, 'paused')}>
                <Clock className="w-4 h-4 mr-1" />
                Pausar
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onUpdateStatus(sprint.id, 'completed')}>
                <CheckCircle2 className="w-4 h-4 mr-1" />
                Concluir
              </Button>
            </>
          )}
          {sprint.status === 'paused' && (
            <Button size="sm" onClick={() => onUpdateStatus(sprint.id, 'active')}>
              <Flame className="w-4 h-4 mr-1" />
              Retomar
            </Button>
          )}
          {sprint.status === 'scheduled' && (
            <Button size="sm" onClick={() => onUpdateStatus(sprint.id, 'active')}>
              <Flame className="w-4 h-4 mr-1" />
              Iniciar
            </Button>
          )}
          
          {/* Edit & Delete */}
          <div className="h-6 w-px bg-white/10 mx-1" />
          <Button variant="ghost" size="sm" onClick={() => onEdit(sprint)}>
            <Edit3 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setShowDeleteConfirm(true)} className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg mb-4">
          <p className="text-sm text-red-400 mb-3">
            Tem certeza que deseja excluir este sprint? 
            {tasksCount > 0 && ` ${tasksCount} tarefa(s) serão desvinculadas.`}
          </p>
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={() => setShowDeleteConfirm(false)}>
              Cancelar
            </Button>
            <Button size="sm" className="bg-red-500 hover:bg-red-600" onClick={() => {
              onDelete(sprint.id);
              setShowDeleteConfirm(false);
            }}>
              <Trash2 className="w-4 h-4 mr-1" />
              Excluir Sprint
            </Button>
          </div>
        </div>
      )}
      
      {/* Sprint Info */}
      {sprint.intention && (
        <div className="p-3 bg-white/[0.02] rounded-lg border border-white/5 mb-4">
          <p className="text-sm text-white/70 italic">{sprint.intention}</p>
        </div>
      )}
      
      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3 bg-white/[0.02] rounded-lg text-center">
          <p className="text-2xl font-bold text-white">{sprint.tasks_count || 0}</p>
          <p className="text-xs text-white/50">Tarefas</p>
        </div>
        <div className="p-3 bg-white/[0.02] rounded-lg text-center">
          <p className="text-2xl font-bold text-white">{sprint.completed_tasks || 0}</p>
          <p className="text-xs text-white/50">Concluídas</p>
        </div>
        <div className="p-3 bg-white/[0.02] rounded-lg text-center">
          <p className="text-2xl font-bold text-white">{sprint.dailyCommitments?.length || 0}</p>
          <p className="text-xs text-white/50">Compromissos</p>
        </div>
        <div className="p-3 bg-white/[0.02] rounded-lg text-center">
          <p className="text-2xl font-bold text-white">{sprint.goals?.length || 0}</p>
          <p className="text-xs text-white/50">Metas</p>
        </div>
      </div>
      
      {/* Focus Pillars */}
      {sprint.focusPillars?.length > 0 && (
        <div className="mt-4 flex items-center gap-2">
          <span className="text-xs text-white/50">Pilares:</span>
          {sprint.focusPillars.map(p => {
            const pillar = getPillarByKey(p);
            return (
              <span 
                key={p}
                className="text-xs px-2 py-1 rounded-full"
                style={{ backgroundColor: `${pillar?.color}20`, color: pillar?.color }}
              >
                {pillar?.label}
              </span>
            );
          })}
        </div>
      )}
    </GlassCard>
  );
};

// Edit Sprint Modal Component
const EditSprintModal = ({ isOpen, sprint, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    intention: '',
    archetype: 'hero',
    status: 'active',
    duration: 7,
    focusPillars: [],
    dailyCommitments: [],
    goals: []
  });
  
  // Sync form data when sprint changes
  useEffect(() => {
    if (sprint) {
      setFormData({
        title: sprint.title || '',
        intention: sprint.intention || '',
        archetype: sprint.archetype || 'hero',
        status: sprint.status || 'active',
        duration: sprint.duration || 7,
        focusPillars: sprint.focusPillars || [],
        dailyCommitments: sprint.dailyCommitments || [],
        goals: sprint.goals || []
      });
    }
  }, [sprint]);
  
  if (!isOpen) return null;
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...sprint,
      ...formData
    });
    onClose();
  };
  
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-surface border border-white/10 rounded-xl w-full max-w-lg">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Editar Sprint</h3>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Input 
            label="Título" 
            value={formData.title} 
            onChange={e => setFormData({...formData, title: e.target.value})} 
          />
          <div>
             <label className="block text-sm text-white/70 mb-2">Intenção</label>
             <textarea
               className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white"
               value={formData.intention}
               onChange={e => setFormData({...formData, intention: e.target.value})}
             />
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>Cancelar</Button>
            <Button type="submit" className="flex-1">Salvar</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Gut Check Modal
const GutCheckModal = ({ isOpen, onClose, onConfirm, task, hdType }) => {
  const [score, setScore] = useState(7);
  if (!isOpen) return null;
  const hdTypeData = getHDTypeByKey(hdType);
  const prompt = hdTypeData?.gutCheckPrompt || 'De 1 a 10, quão alinhado você se sente com esta tarefa?';
  
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <GlassCard className="w-full max-w-md p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-kanban-response/20 flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-kanban-response" />
          </div>
          <h3 className="text-xl font-semibold text-white">Gut Check</h3>
          <p className="text-white/50 text-sm mt-2">Validação para mover para "Resposta"</p>
        </div>
        
        <div className="p-4 rounded-lg bg-white/5 border border-white/10 mb-6">
          <p className="text-sm text-white/80 italic">"{prompt}"</p>
          {hdTypeData && (
            <p className="text-xs mt-2" style={{ color: hdTypeData.color }}>
              Sua estratégia: {hdTypeData.strategy}
            </p>
          )}
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-white/50">Nível de Alinhamento</span>
            <span className={cn('font-bold', score >= 7 ? 'text-kanban-response' : 'text-yellow-500')}>{score}/10</span>
          </div>
          <input type="range" min="1" max="10" value={score} onChange={(e) => setScore(parseInt(e.target.value))} className="w-full accent-primary" />
        </div>
        
        {score < 7 && (
          <div className="mb-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
            <p className="text-sm text-yellow-400">Score abaixo de 7 - Considere se esta tarefa realmente se alinha com sua energia.</p>
          </div>
        )}
        
        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={onClose}>Cancelar</Button>
          <Button className="flex-1" onClick={() => onConfirm(score)}>Confirmar</Button>
        </div>
      </GlassCard>
    </div>
  );
};

// Create Task Modal
const CreateTaskModal = ({ isOpen, onClose, onCreateTask }) => {
  const [title, setTitle] = useState('');
  const [pillar, setPillar] = useState('physical');
  if (!isOpen) return null;
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onCreateTask({ title: title.trim(), pillar, xp_reward: XP_REWARDS.task_complete });
    setTitle('');
    setPillar('physical');
    onClose();
  };
  
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <GlassCard className="w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Nova Tarefa</h3>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Título" placeholder="Digite o título da tarefa..." value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
          <div>
            <label className="block text-sm text-white/70 mb-2">Pilar</label>
            <div className="grid grid-cols-2 gap-2">
              {PILLARS.map(p => (
                <button key={p.key} type="button" onClick={() => setPillar(p.key)}
                  className={cn('px-3 py-2 rounded-lg text-sm text-left transition-all', pillar === p.key ? 'border-2' : 'bg-white/5 border border-white/10')}
                  style={pillar === p.key ? { backgroundColor: `${p.color}20`, borderColor: p.color, color: p.color } : {}}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>Cancelar</Button>
            <Button type="submit" className="flex-1">Criar</Button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
};

// DnD Components
const SortableTaskCard = ({ task }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };
  const pillar = getPillarByKey(task.pillar);
  
  return (
    <div ref={setNodeRef} style={style} className={cn('bg-surface border border-white/10 rounded-lg p-4 hover:border-white/20 transition-all', isDragging && 'shadow-lg shadow-primary/20 border-primary/50')}>
      <div className="flex items-start gap-3">
        <div {...attributes} {...listeners} className="mt-1 cursor-grab active:cursor-grabbing touch-none">
          <GripVertical className="w-4 h-4 text-white/30 hover:text-white/60" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-white font-medium mb-2">{task.title}</p>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge color={pillar?.color || '#6b7280'}>{pillar?.label || task.pillar}</Badge>
            {task.gut_check_score && <span className="text-xs text-white/50">Gut: {task.gut_check_score}/10</span>}
          </div>
          {task.xp_reward > 0 && <p className="text-xs text-primary mt-2">+{task.xp_reward} XP</p>}
        </div>
      </div>
    </div>
  );
};

const DroppableColumn = ({ column, tasks, children }) => {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });
  return (
    <div className="flex-1 min-w-[300px]">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: column.color }} />
        <h3 className="font-semibold text-white">{column.label}</h3>
        <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/60">{tasks.length}</span>
      </div>
      <GlassCard ref={setNodeRef} className={cn('p-3 min-h-[400px] transition-all duration-200', isOver && 'ring-2 ring-primary/50 bg-primary/5')}>
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">{tasks.length === 0 ? <div className="py-8 text-center text-white/30 text-sm">{isOver ? 'Solte aqui!' : 'Sem tarefas'}</div> : children}</div>
        </SortableContext>
      </GlassCard>
    </div>
  );
};

const DragOverlayCard = ({ task }) => {
  const pillar = getPillarByKey(task.pillar);
  return (
    <div className="bg-surface border-2 border-primary rounded-lg p-4 shadow-xl shadow-primary/20 w-[280px]">
      <div className="flex items-start gap-3">
        <GripVertical className="w-4 h-4 text-primary mt-1" />
        <div className="flex-1">
          <p className="text-sm text-white font-medium mb-2">{task.title}</p>
          <Badge color={pillar?.color || '#6b7280'}>{pillar?.label || task.pillar}</Badge>
        </div>
      </div>
    </div>
  );
};

const KanbanView = ({ tasks, setTasks, onUpdateTask, userProfile }) => {
  const [activeId, setActiveId] = useState(null);
  const [gutCheckTask, setGutCheckTask] = useState(null);
  const [pendingMove, setPendingMove] = useState(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );
  
  const tasksByColumn = useMemo(() => {
    const result = {};
    KANBAN_COLUMNS.forEach(col => {
      result[col.id] = tasks.filter(t => t.status === col.id);
    });
    return result;
  }, [tasks]);
  
  const activeTask = useMemo(() => activeId ? tasks.find(t => t.id === activeId) : null, [activeId, tasks]);
  
  const handleDragStart = (event) => setActiveId(event.active.id);
  
  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;
    
    const draggedTask = tasks.find(t => t.id === active.id);
    if (!draggedTask) return;
    
    const targetColumn = KANBAN_COLUMNS.find(col => col.id === over.id);
    const targetTask = tasks.find(t => t.id === over.id);
    let newStatus = draggedTask.status;
    
    if (targetColumn) newStatus = targetColumn.id;
    else if (targetTask) newStatus = targetTask.status;
    
    if (newStatus === 'response' && draggedTask.status !== 'response' && !draggedTask.gut_check_score) {
      setGutCheckTask(draggedTask);
      setPendingMove(newStatus);
      return;
    }
    
    if (newStatus !== draggedTask.status) {
      onUpdateTask({ ...draggedTask, status: newStatus });
    }
  };
  
  const handleGutCheckConfirm = (score) => {
    if (gutCheckTask && pendingMove) {
      onUpdateTask({ ...gutCheckTask, status: pendingMove, gut_check_score: score });
    }
    setGutCheckTask(null);
    setPendingMove(null);
  };
  
  return (
    <>
      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {KANBAN_COLUMNS.map(column => (
            <DroppableColumn key={column.id} column={column} tasks={tasksByColumn[column.id]}>
              {tasksByColumn[column.id].map(task => (
                <SortableTaskCard key={task.id} task={task} />
              ))}
            </DroppableColumn>
          ))}
        </div>
        <DragOverlay>{activeTask && <DragOverlayCard task={activeTask} />}</DragOverlay>
      </DndContext>
      
      <GutCheckModal
        isOpen={!!gutCheckTask}
        onClose={() => { setGutCheckTask(null); setPendingMove(null); }}
        onConfirm={handleGutCheckConfirm}
        task={gutCheckTask}
        hdType={userProfile?.hd_type || 'generator'}
      />
    </>
  );
};

export default function SprintsPage({ tasks, setTasks, userProfile, onUpdateTask, sprints, setSprints, ciclos = [], setCiclos }) {
  const [viewMode, setViewMode] = useState('kanban');
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [isCreateSprintModalOpen, setIsCreateSprintModalOpen] = useState(false);
  const [isEditSprintModalOpen, setIsEditSprintModalOpen] = useState(false);
  const [sprintToEdit, setSprintToEdit] = useState(null);
  const [selectedPillar, setSelectedPillar] = useState(null);
  const [selectedSprint, setSelectedSprint] = useState(null);
  const [masterStatus, setMasterStatus] = useState('active');
  const [showMasterSection, setShowMasterSection] = useState(true);
  
  // Auto-select first active sprint on mount
  useEffect(() => {
    if (!selectedSprint && sprints.length > 0) {
      const activeSprint = sprints.find(s => s.status === 'active');
      if (activeSprint) setSelectedSprint(activeSprint);
    }
  }, [sprints, selectedSprint]);
  
  // Get current Meta Year
  const currentYear = new Date().getFullYear();
  const currentCiclo = ciclos?.find(m => m.year === currentYear);
  
  const viewTabs = [
    { id: 'kanban', label: 'Kanban', icon: Kanban },
    { id: 'timeline', label: 'Timeline', icon: Calendar },
    { id: 'roadmap', label: 'Roadmap', icon: BarChart3 },
  ];
  
  // Filter tasks by sprint and pillar
  const filteredTasks = useMemo(() => {
    let filtered = tasks;
    if (selectedSprint) {
      filtered = filtered.filter(t => t.sprintId === selectedSprint.id);
    }
    if (selectedPillar) {
      filtered = filtered.filter(t => t.pillar === selectedPillar);
    }
    return filtered;
  }, [tasks, selectedSprint, selectedPillar]);
  
  // Count tasks for selected sprint
  const selectedSprintTasksCount = useMemo(() => {
    if (!selectedSprint) return 0;
    return tasks.filter(t => t.sprintId === selectedSprint.id).length;
  }, [tasks, selectedSprint]);
  
  const handleUpdateSprintStatus = (sprintId, newStatus) => {
    setSprints(prev => prev.map(s => 
      s.id === sprintId ? { ...s, status: newStatus } : s
    ));
    if (selectedSprint?.id === sprintId) {
      setSelectedSprint(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };
  
  const handleCreateTaskForSprint = (task) => {
    const newTask = {
      ...task,
      id: uuidv4(),
      status: 'potential',
      gut_check_score: null,
      sprintId: selectedSprint?.id || null
    };
    setTasks(prev => [...prev, newTask]);
    
    // Update sprint task count
    if (selectedSprint) {
      setSprints(prev => prev.map(s => 
        s.id === selectedSprint.id 
          ? { ...s, tasks_count: (s.tasks_count || 0) + 1 }
          : s
      ));
    }
  };
  
  // Edit Sprint
  const handleEditSprint = (sprint) => {
    setSprintToEdit(sprint);
    setIsEditSprintModalOpen(true);
  };
  
  // Update Sprint
  const handleUpdateSprint = (updatedSprint) => {
    setSprints(prev => prev.map(s => 
      s.id === updatedSprint.id ? { ...s, ...updatedSprint } : s
    ));
    if (selectedSprint?.id === updatedSprint.id) {
      setSelectedSprint(prev => prev ? { ...prev, ...updatedSprint } : null);
    }
    setIsEditSprintModalOpen(false);
    setSprintToEdit(null);
  };
  
  const [selectedTask, setSelectedTask] = useState(null); // For Task Detail Modal

  // Delete Sprint
  const handleDeleteSprint = (sprintId) => {
    // Remove sprint
    setSprints(prev => prev.filter(s => s.id !== sprintId));
    
    // Unlink tasks from this sprint (don't delete them)
    setTasks(prev => prev.map(t => 
      t.sprintId === sprintId ? { ...t, sprintId: null } : t
    ));
    
    // Clear selection if deleted sprint was selected
    if (selectedSprint?.id === sprintId) {
      const remainingSprints = sprints.filter(s => s.id !== sprintId);
      const nextActive = remainingSprints.find(s => s.status === 'active');
      setSelectedSprint(nextActive || null);
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          {currentCiclo && (
            <p className="text-xs text-primary mb-1 flex items-center gap-1">
              <Star className="w-3 h-3" />
              Parte do "{currentCiclo.theme || `Ano ${currentYear}`}"
            </p>
          )}
          <h1 className="text-2xl font-bold text-white">Command Center</h1>
          <p className="text-white/50">Gerencie seus ciclos de desenvolvimento</p>
        </div>
        
        <div className="flex items-center gap-3">
          <SprintSelector 
            sprints={sprints}
            selectedSprint={selectedSprint}
            onSelect={setSelectedSprint}
            onNewSprint={() => setIsCreateSprintModalOpen(true)}
          />
          <Button onClick={() => setIsCreateTaskModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nova Tarefa
          </Button>
        </div>
      </div>
      
      {/* Master Section Toggle */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowMasterSection(!showMasterSection)}
          className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
        >
          <ChevronDown className={cn('w-4 h-4 transition-transform', !showMasterSection && '-rotate-90')} />
          Gerenciar Sprints
        </button>
      </div>
      
      {/* Sprint Master Section */}
      {showMasterSection && (
        <SprintMasterSection 
          sprints={sprints}
          selectedStatus={masterStatus}
          onSelectStatus={setMasterStatus}
          onSelectSprint={setSelectedSprint}
        />
      )}
      
      {/* Selected Sprint Detail */}
      {selectedSprint && (
        <SprintDetailPanel 
          sprint={selectedSprint}
          onUpdateStatus={handleUpdateSprintStatus}
          onEdit={handleEditSprint}
          onDelete={handleDeleteSprint}
          tasksCount={selectedSprintTasksCount}
          onTaskClick={setSelectedTask} // Now passing handler to panel
        />
      )}
      
      {/* View Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* View Tabs */}
        <div className="flex items-center gap-4">
          <span className="text-xs text-white/40 uppercase tracking-wider">Visualização</span>
          <Tabs tabs={viewTabs} activeTab={viewMode} onChange={setViewMode} className="w-auto" />
        </div>
        
        {/* Pillar Filter */}
        <div className="flex items-center gap-4">
          <span className="text-xs text-white/40 uppercase tracking-wider">Pilares</span>
          <div className="flex gap-2 overflow-x-auto">
            <button
              onClick={() => setSelectedPillar(null)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all',
                selectedPillar === null ? 'bg-white/20 text-white' : 'bg-white/5 text-white/60'
              )}
            >
              Todos
            </button>
            {PILLARS.map(pillar => (
              <button
                key={pillar.key}
                onClick={() => setSelectedPillar(pillar.key)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all',
                  selectedPillar === pillar.key ? '' : 'bg-white/5 text-white/60'
                )}
                style={selectedPillar === pillar.key ? {
                  backgroundColor: `${pillar.color}30`,
                  color: pillar.color
                } : {}}
              >
                {pillar.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Content based on view mode */}
      {viewMode === 'kanban' && (
        <KanbanView tasks={filteredTasks} setTasks={setTasks} onUpdateTask={onUpdateTask} userProfile={userProfile} />
      )}
      
      {viewMode === 'timeline' && (
        <TimelineView tasks={filteredTasks} sprints={sprints} selectedSprint={selectedSprint} />
      )}
      
      {viewMode === 'roadmap' && (
        <RoadmapView tasks={filteredTasks} selectedSprint={selectedSprint} />
      )}
      
      <CreateTaskModal 
        isOpen={isCreateTaskModalOpen}
        onClose={() => setIsCreateTaskModalOpen(false)}
        onCreateTask={handleCreateTaskForSprint}
        selectedSprint={selectedSprint}
      />

      <SprintBuilder
        isOpen={isCreateSprintModalOpen}
        onClose={() => setIsCreateSprintModalOpen(false)}
        onCreateSprint={(sprint) => {
          const sprintId = uuidv4();
          const currentCiclo = ciclos?.find(m => m.status === 'active');
          const newSprint = { 
            ...sprint, 
            id: sprintId, 
            status: 'active', 
            created_at: new Date().toISOString(), 
            tasks_count: sprint.goals?.length || 0, 
            completed_tasks: 0,
            cicloId: currentCiclo?.id || null
          };
          setSprints(prev => [...prev, newSprint]);
          
          // Create tasks from goals automatically
          if (sprint.goals && sprint.goals.length > 0) {
            const newTasks = sprint.goals.map((goal, index) => ({
              id: uuidv4(),
              title: goal,
              content: goal,
              pillar: sprint.focusPillars?.[index % sprint.focusPillars.length] || 'personal',
              status: 'potential',
              sprintId: sprintId,
              gut_check_score: null,
              xp: 30,
              created_at: new Date().toISOString()
            }));
            setTasks(prev => [...prev, ...newTasks]);
          }
          
          setSelectedSprint(newSprint);
        }}
        userProfile={userProfile}
      />
      
      <EditSprintModal
        isOpen={isEditSprintModalOpen}
        sprint={sprintToEdit}
        onClose={() => {
          setIsEditSprintModalOpen(false);
          setSprintToEdit(null);
        }}
        onSave={handleUpdateSprint}
      />
      
      <TaskDetailModal
        isOpen={!!selectedTask}
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
        onUpdate={(updatedTask) => {
            setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
            if (onUpdateTask) onUpdateTask(updatedTask);
        }}
      />
    </div>
  );
}
