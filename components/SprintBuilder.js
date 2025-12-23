'use client';
import { useState } from 'react';
import { 
  Target, Sparkles, BarChart3, Calendar, CheckCircle2, 
  X, ChevronRight, Plus, Loader2 
} from 'lucide-react';
import { cn } from '@/lib/cn';
import { CustomButton as Button } from './custom-ui/CustomButton';
import { CustomInput as Input } from './custom-ui/CustomInput';
import { 
  getArchetypeByKey, 
  getHDTypeByKey,
  ARCHETYPES 
} from '@/lib/constants/archetypes';
import { 
  PILLARS, 
  getPillarByKey 
} from '@/lib/constants/pillars';

const GATEKEEPER_STEPS = [
  { 
    id: 'intention', 
    title: 'Intenção',
    description: 'Defina a intenção clara do seu sprint',
    icon: Target,
    gatekeeperQuestion: 'Qual é a transformação que você busca neste ciclo?'
  },
  { 
    id: 'archetype', 
    title: 'Arquétipo',
    description: 'Escolha a energia que guiará seu sprint',
    icon: Sparkles,
    gatekeeperQuestion: 'Qual energia arquetípica ressoa com sua jornada atual?'
  },
  { 
    id: 'pillars', 
    title: 'Pilares',
    description: 'Selecione os pilares de foco',
    icon: BarChart3,
    gatekeeperQuestion: 'Quais áreas da vida você deseja desenvolver?'
  },
  { 
    id: 'commitment', 
    title: 'Compromisso',
    description: 'Defina suas metas e tempo',
    icon: Calendar,
    gatekeeperQuestion: 'O que você está disposto a comprometer para este sprint?'
  },
  { 
    id: 'alignment', 
    title: 'Alinhamento',
    description: 'Validação final do Gatekeeper',
    icon: CheckCircle2,
    gatekeeperQuestion: 'Este sprint está alinhado com seu Design?'
  }
];

// AI Suggestion Chip Component
const SuggestionChip = ({ text, onClick, loading }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={loading}
    className="px-3 py-1.5 text-xs rounded-full bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 transition-all disabled:opacity-50"
  >
    {text}
  </button>
);

// Commitment Pill Component
const CommitmentPill = ({ text, selected, onClick, color }) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      'px-3 py-1.5 text-xs rounded-full transition-all',
      selected 
        ? 'ring-2 ring-offset-1 ring-offset-void' 
        : 'bg-white/5 border border-white/10 hover:border-white/20'
    )}
    style={selected ? { backgroundColor: `${color}30`, color: color, ringColor: color } : {}}
  >
    {text}
  </button>
);

export default function SprintBuilder({ isOpen, onClose, onCreateSprint, userProfile }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [sprintData, setSprintData] = useState({
    title: '',
    intention: '',
    archetype: 'hero',
    focusPillars: [],
    duration: 7,
    goals: [],
    dailyCommitments: [],
    alignmentScore: 7
  });
  const [newGoal, setNewGoal] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationPassed, setValidationPassed] = useState(false);
  
  // AI Suggestions states
  const [aiLoading, setAiLoading] = useState(false);
  const [nameSuggestions, setNameSuggestions] = useState([]);
  const [intentionSuggestions, setIntentionSuggestions] = useState([]);
  const [recommendedArchetype, setRecommendedArchetype] = useState(null);
  const [commitmentSuggestions, setCommitmentSuggestions] = useState([]);
  const [goalSuggestions, setGoalSuggestions] = useState([]);
  
  if (!isOpen) return null;
  
  const currentStepData = GATEKEEPER_STEPS[currentStep];
  const selectedArchetype = getArchetypeByKey(sprintData.archetype);
  const hdType = getHDTypeByKey(userProfile?.hd_type || 'generator');
  
  // Fetch AI Suggestions
  const fetchAISuggestions = async (type, data) => {
    setAiLoading(true);
    try {
      const response = await fetch('/api/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, data })
      });
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('AI suggestion error:', error);
      return null;
    } finally {
      setAiLoading(false);
    }
  };
  
  // Generate name suggestions
  const handleGenerateNames = async () => {
    if (!sprintData.intention) return;
    const result = await fetchAISuggestions('sprint-names', { intention: sprintData.intention });
    if (result?.names) {
      setNameSuggestions(result.names);
    }
  };
  
  // Generate intention suggestions
  const handleGenerateIntentions = async () => {
    if (!sprintData.title) return;
    const result = await fetchAISuggestions('intentions', { 
      title: sprintData.title, 
      pillars: sprintData.focusPillars 
    });
    if (result?.intentions) {
      setIntentionSuggestions(result.intentions);
    }
  };
  
  // Get archetype recommendation
  const handleGetArchetypeRecommendation = async () => {
    if (!sprintData.intention) return;
    const result = await fetchAISuggestions('archetype-recommendation', { intention: sprintData.intention });
    if (result?.recommended) {
      setRecommendedArchetype(result);
    }
  };
  
  // Generate commitment suggestions
  const handleGenerateCommitments = async () => {
    const result = await fetchAISuggestions('commitments', {
      pillars: sprintData.focusPillars.map(p => getPillarByKey(p)?.label),
      archetype: selectedArchetype?.name,
      intention: sprintData.intention
    });
    if (result?.commitments) {
      setCommitmentSuggestions(result.commitments);
    }
  };
  
  // Generate goal suggestions
  const handleGenerateGoals = async () => {
    const result = await fetchAISuggestions('goals', {
      pillars: sprintData.focusPillars.map(p => getPillarByKey(p)?.label),
      archetype: selectedArchetype?.name,
      intention: sprintData.intention,
      duration: sprintData.duration
    });
    if (result?.goals) {
      setGoalSuggestions(result.goals);
    }
  };
  
  const canProceed = () => {
    switch (currentStep) {
      case 0: return sprintData.title.trim().length >= 3 && sprintData.intention.trim().length >= 10;
      case 1: return !!sprintData.archetype;
      case 2: return sprintData.focusPillars.length >= 1 && sprintData.focusPillars.length <= 3;
      case 3: return sprintData.goals.length >= 1 && sprintData.dailyCommitments.length >= 1;
      case 4: return sprintData.alignmentScore >= 7 && validationPassed;
      default: return false;
    }
  };
  
  const handleNext = () => {
    if (currentStep === GATEKEEPER_STEPS.length - 1) {
      handleCreateSprintSubmit();
    } else {
      setCurrentStep(prev => prev + 1);
      // Auto-fetch suggestions for next step
      if (currentStep === 0) handleGetArchetypeRecommendation();
      if (currentStep === 2) {
        handleGenerateCommitments();
        handleGenerateGoals();
      }
    }
  };
  
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setValidationPassed(false);
    }
  };
  
  const handleCreateSprintSubmit = async () => {
    // Pass raw data, parent component will handle formatting and saving
    await onCreateSprint({
      title: sprintData.title.trim(),
      intention: sprintData.intention.trim(),
      archetype: sprintData.archetype,
      focusPillars: sprintData.focusPillars,
      duration: sprintData.duration,
      goals: sprintData.goals,
      dailyCommitments: sprintData.dailyCommitments,
      alignmentScore: sprintData.alignmentScore
    });
    
    // Reset state
    setSprintData({
      title: '', intention: '', archetype: 'hero', focusPillars: [],
      duration: 7, goals: [], dailyCommitments: [], alignmentScore: 7
    });
    setCurrentStep(0);
    setValidationPassed(false);
    setNameSuggestions([]);
    setIntentionSuggestions([]);
    setRecommendedArchetype(null);
    setCommitmentSuggestions([]);
    setGoalSuggestions([]);
    onClose();
  };
  
  const addGoal = (goal) => {
    if (goal?.trim() && !sprintData.goals.includes(goal.trim())) {
      setSprintData(prev => ({ ...prev, goals: [...prev.goals, goal.trim()] }));
    }
    setNewGoal('');
  };
  
  const removeGoal = (index) => {
    setSprintData(prev => ({ ...prev, goals: prev.goals.filter((_, i) => i !== index) }));
  };
  
  const toggleCommitment = (commitment) => {
    setSprintData(prev => {
      const current = prev.dailyCommitments;
      if (current.includes(commitment)) {
        return { ...prev, dailyCommitments: current.filter(c => c !== commitment) };
      }
      return { ...prev, dailyCommitments: [...current, commitment] };
    });
  };
  
  const togglePillar = (pillarKey) => {
    setSprintData(prev => {
      const current = prev.focusPillars;
      if (current.includes(pillarKey)) {
        return { ...prev, focusPillars: current.filter(p => p !== pillarKey) };
      }
      if (current.length < 3) {
        return { ...prev, focusPillars: [...current, pillarKey] };
      }
      return prev;
    });
  };
  
  const handleValidation = () => {
    setIsValidating(true);
    setTimeout(() => {
      setIsValidating(false);
      if (sprintData.alignmentScore >= 7) setValidationPassed(true);
    }, 1500);
  };
  
  // Pre-defined commitment options based on pillars
  const getCommitmentOptions = () => {
    const options = [];
    sprintData.focusPillars.forEach(pillarKey => {
      const pillar = getPillarByKey(pillarKey);
      if (pillar) {
        switch (pillarKey) {
          case 'physical':
            options.push('30min exercício', 'Beber 2L água', 'Dormir 7h+', 'Caminhada matinal');
            break;
          case 'mental':
            options.push('Meditação 10min', 'Journaling', 'Leitura 20min', 'Digital detox 1h');
            break;
          case 'intellectual':
            options.push('Estudar 30min', 'Aprender algo novo', 'Curso online', 'Podcast educativo');
            break;
          case 'professional':
            options.push('Deep work 2h', 'Revisar metas', 'Networking', 'Organizar tarefas');
            break;
          case 'personal':
            options.push('Tempo sozinho', 'Hobby 30min', 'Autocuidado', 'Gratidão 3 itens');
            break;
          case 'cultural':
            options.push('Arte/Música', 'Evento cultural', 'Aprender idioma', 'Explorar novo');
            break;
          case 'spiritual':
            options.push('Meditação', 'Reflexão', 'Natureza', 'Práticas espirituais');
            break;
        }
      }
    });
    return [...new Set(options)];
  };
  
  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Intention
        return (
          <div className="space-y-5">
            <div>
              <label className="block text-sm text-white/70 mb-2">Nome do Sprint</label>
              <input
                type="text"
                placeholder="Ex: Despertar do Guerreiro Interior"
                value={sprintData.title}
                onChange={(e) => setSprintData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-primary"
                autoFocus
              />
              
              {/* Name Suggestions */}
              {nameSuggestions.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {nameSuggestions.map((name, i) => (
                    <SuggestionChip 
                      key={i} 
                      text={name} 
                      onClick={() => setSprintData(prev => ({ ...prev, title: name }))}
                    />
                  ))}
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm text-white/70 mb-2">Intenção Principal</label>
              <textarea
                placeholder="Descreva a transformação que busca... O que mudará em você ao final deste sprint?"
                value={sprintData.intention}
                onChange={(e) => setSprintData(prev => ({ ...prev, intention: e.target.value }))}
                className="w-full h-28 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-primary resize-none"
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-white/40">{sprintData.intention.length}/10 caracteres mínimos</p>
                <button
                  type="button"
                  onClick={handleGenerateIntentions}
                  disabled={aiLoading || !sprintData.title}
                  className="text-xs text-primary hover:text-primary/80 disabled:opacity-50 flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  {aiLoading ? 'Gerando...' : 'Sugestões IA'}
                </button>
              </div>
              
              {/* Intention Suggestions */}
              {intentionSuggestions.length > 0 && (
                <div className="mt-3 space-y-2">
                  <p className="text-xs text-white/50">Sugestões:</p>
                  {intentionSuggestions.map((intention, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSprintData(prev => ({ ...prev, intention }))}
                      className="w-full text-left p-3 text-sm bg-white/5 rounded-lg hover:bg-white/10 text-white/70 transition-all"
                    >
                      {intention}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {sprintData.intention.length >= 10 && !nameSuggestions.length && (
              <button
                type="button"
                onClick={handleGenerateNames}
                disabled={aiLoading}
                className="w-full py-2 text-sm bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                {aiLoading ? 'Gerando sugestões...' : 'Gerar sugestões de nome com IA'}
              </button>
            )}
          </div>
        );
        
      case 1: // Archetype
        return (
          <div className="space-y-4">
            {/* Recommended Archetype */}
            {recommendedArchetype && (
              <div className="p-4 rounded-xl bg-primary/10 border border-primary/30 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">Recomendação da IA</span>
                </div>
                <p className="text-sm text-white/80">
                  Baseado na sua intenção, o arquétipo <strong className="text-primary">{getArchetypeByKey(recommendedArchetype.recommended)?.name}</strong> pode ser ideal para você.
                </p>
                <p className="text-xs text-white/50 mt-1">{recommendedArchetype.reason}</p>
              </div>
            )}
            
            <div>
              <h4 className="text-sm font-medium text-white/70 mb-3">Escolha seu Arquétipo</h4>
              <div className="grid grid-cols-3 gap-2 max-h-[220px] overflow-y-auto pr-2">
                {ARCHETYPES.map(arch => {
                  const isRecommended = recommendedArchetype?.recommended === arch.key;
                  return (
                    <button
                      key={arch.key}
                      type="button"
                      onClick={() => setSprintData(prev => ({ ...prev, archetype: arch.key }))}
                      className={cn(
                        'p-3 rounded-xl text-center transition-all duration-300 relative',
                        sprintData.archetype === arch.key 
                          ? 'ring-2 ring-primary scale-105 shadow-lg' 
                          : 'bg-white/5 border border-white/10 hover:border-white/20'
                      )}
                      style={sprintData.archetype === arch.key ? { 
                        backgroundColor: `${arch.color}15`,
                        borderColor: arch.color
                      } : {}}
                    >
                      {isRecommended && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                          <Sparkles className="w-2.5 h-2.5 text-white" />
                        </span>
                      )}
                      <span className="text-2xl block mb-1">{arch.icon}</span>
                      <span className="text-xs font-medium text-white">{arch.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            
            {/* Selected Archetype Details */}
            {selectedArchetype && (
              <div className="p-4 rounded-xl border border-white/10" style={{ backgroundColor: `${selectedArchetype.color}10` }}>
                <h4 className="text-sm font-medium text-white/50 mb-2">Arquétipo Selecionado</h4>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{selectedArchetype.icon}</span>
                  <div>
                    <h4 className="font-semibold text-white">{selectedArchetype.name}</h4>
                    <p className="text-xs text-white/50">{selectedArchetype.nameEn}</p>
                  </div>
                </div>
                <p className="text-sm text-primary italic mb-3">"{selectedArchetype.motto}"</p>
                <p className="text-sm text-white/70 mb-3">{selectedArchetype.fullDescription || selectedArchetype.description}</p>
                
                {/* Strengths */}
                {selectedArchetype.strengths && (
                  <div className="mb-3">
                    <p className="text-xs text-white/50 mb-1">Forças:</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedArchetype.strengths.map((s, i) => (
                        <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400">{s}</span>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Related Pillars */}
                <div className="flex gap-2">
                  <span className="text-xs text-white/50">Pilares relacionados:</span>
                  {selectedArchetype.focus.map(f => {
                    const pillar = getPillarByKey(f);
                    return pillar ? (
                      <span 
                        key={f}
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: `${pillar.color}20`, color: pillar.color }}
                      >
                        {pillar.label}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </div>
        );
        
      case 2: // Pillars
        return (
          <div className="space-y-4">
            <p className="text-sm text-white/60">
              Selecione de 1 a 3 pilares para focar durante este sprint.
              <span className="text-primary ml-1">({sprintData.focusPillars.length}/3 selecionados)</span>
            </p>
            
            <div className="grid grid-cols-2 gap-3">
              {PILLARS.map(pillar => {
                const isSelected = sprintData.focusPillars.includes(pillar.key);
                const isRecommended = selectedArchetype?.focus.includes(pillar.key);
                return (
                  <button
                    key={pillar.key}
                    type="button"
                    onClick={() => togglePillar(pillar.key)}
                    className={cn(
                      'p-4 rounded-xl text-left transition-all duration-200 relative',
                      isSelected ? 'ring-2 scale-[1.02]' : 'bg-white/5 border border-white/10 hover:border-white/20'
                    )}
                    style={isSelected ? { 
                      backgroundColor: `${pillar.color}15`,
                      ringColor: pillar.color,
                      borderColor: pillar.color
                    } : {}}
                  >
                    {isRecommended && !isSelected && (
                      <span className="absolute top-2 right-2 text-[10px] px-1.5 py-0.5 rounded bg-primary/20 text-primary">
                        Recomendado
                      </span>
                    )}
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${pillar.color}20` }}
                      >
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: pillar.color }} />
                      </div>
                      <div>
                        <p className="font-medium text-white">{pillar.label}</p>
                        <p className="text-xs text-white/50">{pillar.description?.slice(0, 25)}...</p>
                      </div>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="absolute bottom-3 right-3 w-5 h-5" style={{ color: pillar.color }} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
        
      case 3: // Commitment
        return (
          <div className="space-y-5">
            {/* Duration */}
            <div>
              <label className="block text-sm text-white/70 mb-2">Duração do Sprint</label>
              <div className="grid grid-cols-4 gap-2">
                {[7, 14, 21, 30].map(d => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setSprintData(prev => ({ ...prev, duration: d }))}
                    className={cn(
                      'py-3 rounded-xl text-center transition-all',
                      sprintData.duration === d 
                        ? 'bg-primary text-white font-semibold' 
                        : 'bg-white/5 text-white/60 hover:bg-white/10'
                    )}
                  >
                    <span className="block text-lg">{d}</span>
                    <span className="text-xs">dias</span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Daily Commitments */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm text-white/70">
                  Compromissos Diários ({sprintData.dailyCommitments.length} selecionados)
                </label>
                <button
                  type="button"
                  onClick={handleGenerateCommitments}
                  disabled={aiLoading}
                  className="text-xs text-primary hover:text-primary/80 disabled:opacity-50 flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  {aiLoading ? 'Gerando...' : 'Sugestões IA'}
                </button>
              </div>
              
              {/* Pre-defined options */}
              <div className="flex flex-wrap gap-2 mb-3">
                {getCommitmentOptions().map((opt, i) => (
                  <CommitmentPill
                    key={i}
                    text={opt}
                    selected={sprintData.dailyCommitments.includes(opt)}
                    onClick={() => toggleCommitment(opt)}
                    color="#a855f7"
                  />
                ))}
              </div>
              
              {/* AI Suggestions */}
              {commitmentSuggestions.length > 0 && (
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <p className="text-xs text-primary mb-2">Sugestões da IA:</p>
                  <div className="flex flex-wrap gap-2">
                    {commitmentSuggestions.map((sug, i) => (
                      <CommitmentPill
                        key={i}
                        text={sug}
                        selected={sprintData.dailyCommitments.includes(sug)}
                        onClick={() => toggleCommitment(sug)}
                        color="#22c55e"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Goals */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm text-white/70">
                  Metas do Sprint ({sprintData.goals.length} definidas)
                </label>
                <button
                  type="button"
                  onClick={handleGenerateGoals}
                  disabled={aiLoading}
                  className="text-xs text-primary hover:text-primary/80 disabled:opacity-50 flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  {aiLoading ? 'Gerando...' : 'Sugestões IA'}
                </button>
              </div>
              
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  placeholder="Adicione uma meta..."
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addGoal(newGoal))}
                  className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-primary text-sm"
                />
                <Button type="button" onClick={() => addGoal(newGoal)} size="icon">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Goal suggestions */}
              {goalSuggestions.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {goalSuggestions.filter(g => !sprintData.goals.includes(g)).map((goal, i) => (
                    <SuggestionChip key={i} text={goal} onClick={() => addGoal(goal)} />
                  ))}
                </div>
              )}
              
              {/* Selected goals */}
              <div className="space-y-2 max-h-[120px] overflow-y-auto">
                {sprintData.goals.map((goal, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 bg-white/5 rounded-lg">
                    <Target className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="flex-1 text-sm text-white">{goal}</span>
                    <button type="button" onClick={() => removeGoal(idx)} className="p-1 hover:bg-white/10 rounded">
                      <X className="w-4 h-4 text-white/50" />
                    </button>
                  </div>
                ))}
                {sprintData.goals.length === 0 && (
                  <p className="text-center text-white/40 py-3 text-sm">Adicione pelo menos uma meta</p>
                )}
              </div>
            </div>
          </div>
        );
        
      case 4: // Alignment
        return (
          <div className="space-y-5">
            {/* Summary */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <h4 className="font-semibold text-white mb-3">Resumo do Sprint</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/50">Nome:</span>
                  <span className="text-white font-medium">{sprintData.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Arquétipo:</span>
                  <span className="text-white">{selectedArchetype?.icon} {selectedArchetype?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Duração:</span>
                  <span className="text-white">{sprintData.duration} dias</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/50">Pilares:</span>
                  <div className="flex gap-1">
                    {sprintData.focusPillars.map(p => {
                      const pillar = getPillarByKey(p);
                      return (
                        <span key={p} className="w-4 h-4 rounded-full" style={{ backgroundColor: pillar?.color }} title={pillar?.label} />
                      );
                    })}
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Metas:</span>
                  <span className="text-white">{sprintData.goals.length} definidas</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Compromissos:</span>
                  <span className="text-white">{sprintData.dailyCommitments.length} selecionados</span>
                </div>
              </div>
            </div>
            
            {/* HD Type Reminder */}
            {hdType && (
              <div className="p-4 rounded-xl border" style={{ backgroundColor: `${hdType.color}10`, borderColor: `${hdType.color}30` }}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${hdType.color}30` }}>
                    <Sparkles className="w-4 h-4" style={{ color: hdType.color }} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{hdType.name}</p>
                    <p className="text-xs text-white/50">Estratégia: {hdType.strategy}</p>
                  </div>
                </div>
                <p className="text-sm italic text-white/70">{hdType.gutCheckPrompt}</p>
              </div>
            )}
            
            {/* Alignment Score */}
            <div>
              <label className="block text-sm text-white/70 mb-2">Nível de Alinhamento</label>
              <div className="flex items-center gap-4">
                <input
                  type="range" min="1" max="10"
                  value={sprintData.alignmentScore}
                  onChange={(e) => {
                    setSprintData(prev => ({ ...prev, alignmentScore: parseInt(e.target.value) }));
                    setValidationPassed(false);
                  }}
                  className="flex-1 accent-primary"
                />
                <span className={cn(
                  'text-2xl font-bold w-12 text-center',
                  sprintData.alignmentScore >= 7 ? 'text-green-500' : 'text-yellow-500'
                )}>
                  {sprintData.alignmentScore}
                </span>
              </div>
              {sprintData.alignmentScore < 7 && (
                <p className="text-sm text-yellow-500 mt-2">Score abaixo de 7 - Reconsidere este sprint.</p>
              )}
            </div>
            
            {/* Validation */}
            {!validationPassed && sprintData.alignmentScore >= 7 && (
              <Button type="button" onClick={handleValidation} loading={isValidating} className="w-full" variant="secondary">
                {isValidating ? 'Validando...' : 'Solicitar Validação'}
              </Button>
            )}
            
            {validationPassed && (
              <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-center">
                <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto mb-2" />
                <p className="text-green-400 font-medium">Aprovado!</p>
                <p className="text-sm text-white/60">Este sprint está alinhado com seu Design.</p>
              </div>
            )}
          </div>
        );
        
      default: return null;
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-surface border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-white">Construa seu Sprint</h3>
              <p className="text-sm text-white/50">Monte sua jornada de acordo com o melhor para você</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Progress */}
          <div className="flex items-center justify-between">
            {GATEKEEPER_STEPS.map((step, idx) => {
              const StepIcon = step.icon;
              const isActive = idx === currentStep;
              const isCompleted = idx < currentStep;
              return (
                <div key={step.id} className="flex items-center">
                  <div className={cn(
                    'w-9 h-9 rounded-full flex items-center justify-center transition-all',
                    isActive ? 'bg-primary text-white scale-110' :
                    isCompleted ? 'bg-green-500 text-white' : 'bg-white/10 text-white/40'
                  )}>
                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <StepIcon className="w-4 h-4" />}
                  </div>
                  {idx < GATEKEEPER_STEPS.length - 1 && (
                    <div className={cn('w-6 lg:w-12 h-0.5 mx-1', idx < currentStep ? 'bg-green-500' : 'bg-white/10')} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Step Info */}
        <div className="px-5 py-3 bg-white/[0.02] border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              {(() => { const StepIcon = currentStepData.icon; return <StepIcon className="w-5 h-5 text-primary" />; })()}
            </div>
            <div>
              <h4 className="font-semibold text-white">{currentStepData.title}</h4>
              <p className="text-xs text-white/50">{currentStepData.description}</p>
            </div>
          </div>
          <div className="mt-2 p-2 rounded-lg bg-primary/10 border border-primary/20">
            <p className="text-xs text-primary italic">{currentStepData.gatekeeperQuestion}</p>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {renderStepContent()}
        </div>
        
        {/* Footer */}
        <div className="p-5 border-t border-white/10 flex justify-between items-center">
          <Button type="button" variant="ghost" onClick={currentStep === 0 ? onClose : handleBack}>
            {currentStep === 0 ? 'Cancelar' : 'Voltar'}
          </Button>
          <div className="flex items-center gap-3">
            <span className="text-xs text-white/40">Passo {currentStep + 1}/{GATEKEEPER_STEPS.length}</span>
            <Button type="button" onClick={handleNext} disabled={!canProceed()}>
              {currentStep === GATEKEEPER_STEPS.length - 1 ? (
                <><Sparkles className="w-4 h-4 mr-2" />Criar Sprint</>
              ) : (
                <>Próximo<ChevronRight className="w-4 h-4 ml-2" /></>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
