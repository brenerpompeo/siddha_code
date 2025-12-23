'use client';
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { Calendar, X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { GlassCard } from './custom-ui/GlassCard';
import { Badge } from './custom-ui/Badge';
import { CustomButton as Button } from './custom-ui/CustomButton';
import DreamBoard from './DreamBoard';

// Meta Year Modal Component
const CicloModal = ({ isOpen, ciclo, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    year: new Date().getFullYear(),
    theme: '',
    intention: ''
  });
  
  useEffect(() => {
    if (ciclo) {
      setFormData({
        year: ciclo.year,
        theme: ciclo.theme || '',
        intention: ciclo.intention || ''
      });
    } else {
      setFormData({
        year: new Date().getFullYear(),
        theme: '',
        intention: ''
      });
    }
  }, [ciclo]);
  
  if (!isOpen) return null;
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...ciclo,
      ...formData
    });
  };
  
  // Pre-defined themes
  const themesSuggestions = [
    'Ano da Transformação',
    'Ano da Soberania',
    'Ano da Construção',
    'Ano da Expansão',
    'Ano do Despertar',
    'Ano da Maestria',
    'Ano da Cura',
    'Ano da Abundância'
  ];
  
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-surface border border-white/10 rounded-xl w-full max-w-lg">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">
              {ciclo ? 'Editar Ciclo' : 'Nova Ciclo'}
            </h3>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Year */}
          <div>
            <label className="block text-sm text-white/70 mb-2">Ano</label>
            <input
              type="number"
              value={formData.year}
              onChange={(e) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary"
              min="2020"
              max="2100"
              required
            />
          </div>
          
          {/* Theme */}
          <div>
            <label className="block text-sm text-white/70 mb-2">Tema do Ano</label>
            <input
              type="text"
              value={formData.theme}
              onChange={(e) => setFormData(prev => ({ ...prev, theme: e.target.value }))}
              placeholder="Ex: Ano da Transformação"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-primary"
              required
            />
            {/* Suggestions */}
            <div className="flex flex-wrap gap-2 mt-2">
              {themesSuggestions.slice(0, 4).map(theme => (
                <button
                  key={theme}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, theme: `${theme} ${formData.year}` }))}
                  className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary hover:bg-primary/30 transition-all"
                >
                  {theme}
                </button>
              ))}
            </div>
          </div>
          
          {/* Intention */}
          <div>
            <label className="block text-sm text-white/70 mb-2">Intenção Macro</label>
            <textarea
              value={formData.intention}
              onChange={(e) => setFormData(prev => ({ ...prev, intention: e.target.value }))}
              placeholder="Qual é o grande objetivo deste ano?"
              className="w-full h-24 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-primary resize-none"
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              {ciclo ? 'Salvar' : 'Criar Ciclo'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function CicloPage({ ciclos, setCiclos, sprints, setSprints, tasks, userProfile }) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(null);
  const [activeTab, setActiveTab] = useState('vision'); // 'vision' (Dream Board) or 'timeline' (Time Machine)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [cicloToEdit, setCicloToEdit] = useState(null);

  const handleCreateCiclo = async (data) => {
    try {
      const newCiclo = {
        user_id: userProfile.id,
        year: parseInt(data.year),
        theme: data.theme,
        intention: data.intention,
        status: 'active'
      };
      
      const { data: created, error } = await supabase.from('meta_years').insert(newCiclo).select().single();
      if (error) throw error;
      
      setCiclos(prev => [...prev, created]);
      setSelectedYear(created);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Error creating ciclo:', error);
      alert('Erro ao criar ciclo');
    }
  };

  const handleUpdateCiclo = async (data) => {
    try {
      const { error } = await supabase
        .from('meta_years')
        .update({ theme: data.theme, intention: data.intention, year: data.year })
        .eq('id', data.id);
        
      if (error) throw error;
      
      setCiclos(prev => prev.map(m => m.id === data.id ? { ...m, ...data } : m));
      if (selectedYear?.id === data.id) {
        setSelectedYear(prev => ({ ...prev, ...data }));
      }
      setIsEditModalOpen(false);
      setCicloToEdit(null);
    } catch (error) {
      console.error('Error updating ciclo:', error);
    }
  };

  const handleDeleteCiclo = async (id) => {
    if(!confirm('Tem certeza? Isso pode afetar sprints vinculados.')) return;
    try {
      const { error } = await supabase.from('meta_years').delete().eq('id', id);
      if (error) throw error;
      
      setCiclos(prev => prev.filter(m => m.id !== id));
      if (selectedYear?.id === id) {
        setSelectedYear(null);
      }
    } catch (error) {
      console.error('Error deleting ciclo:', error);
    }
  };
  
  const currentYear = new Date().getFullYear();
  const activeCiclo = ciclos.find(m => m.status === 'active') || ciclos[0];
  
  // Auto-select active year
  useEffect(() => {
    if (!selectedYear && activeCiclo) {
      setSelectedYear(activeCiclo);
    }
  }, [activeCiclo, selectedYear]);
  
  // Get sprints for selected meta year
  const yearSprints = useMemo(() => {
    if (!selectedYear) return [];
    return sprints.filter(s => s.meta_year_id === selectedYear.id || 
      (new Date(s.created_at).getFullYear() === selectedYear.year));
  }, [sprints, selectedYear]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
            {selectedYear?.theme || `Ciclo ${currentYear}`}
          </h1>
          <p className="text-white/50 italic">"{selectedYear?.intention || 'Defina sua intenção anual'}"</p>
        </div>
        <div className="flex bg-white/5 p-1 rounded-lg">
            <button 
                onClick={() => setActiveTab('vision')}
                className={cn("px-4 py-2 rounded-md text-sm transition-all", activeTab === 'vision' ? "bg-primary text-white" : "text-white/60 hover:text-white")}
            >
                Quadro dos Sonhos
            </button>
            <button 
                onClick={() => setActiveTab('timeline')}
                className={cn("px-4 py-2 rounded-md text-sm transition-all", activeTab === 'timeline' ? "bg-primary text-white" : "text-white/60 hover:text-white")}
            >
                Máquina do Tempo
            </button>
        </div>
      </div>

      {activeTab === 'vision' && selectedYear && (
          <DreamBoard cicloId={selectedYear.id} />
      )}

      {activeTab === 'timeline' && (
          <div className="space-y-8 relative pl-8 border-l border-white/10 ml-4">
              {yearSprints.length === 0 ? (
                  <p className="text-white/40 italic">Nenhum sprint registrado neste ciclo ainda.</p>
              ) : (
                  yearSprints
                    .sort((a, b) => new Date(b.start_date) - new Date(a.start_date))
                    .map((sprint, index) => (
                      <div key={sprint.id} className="relative group">
                          {/* Timeline Dot */}
                          <div className={cn(
                              "absolute -left-[41px] top-4 w-5 h-5 rounded-full border-4 border-void",
                              sprint.status === 'active' ? "bg-primary" : "bg-white/20"
                          )} />
                          
                          <GlassCard className="p-6 transition-all hover:bg-white/[0.05]">
                              <div className="flex justify-between items-start mb-4">
                                  <div>
                                      <div className="flex items-center gap-2 mb-1">
                                          <h3 className="text-xl font-bold text-white">{sprint.title}</h3>
                                          <Badge className={cn(
                                              sprint.status === 'active' ? 'bg-primary/20 text-primary' : 'bg-white/10 text-white/50'
                                          )}>
                                              {sprint.status === 'active' ? 'Em Progresso' : 'Concluído'}
                                          </Badge>
                                      </div>
                                      <p className="text-sm text-white/50 flex items-center gap-2">
                                          <Calendar className="w-3 h-3" />
                                          {new Date(sprint.start_date).toLocaleDateString()} - {sprint.end_date ? new Date(sprint.end_date).toLocaleDateString() : 'Em aberto'}
                                      </p>
                                  </div>
                                  <div className="text-right">
                                      <div className="text-2xl font-bold text-white">
                                          {tasks.filter(t => t.sprintId === sprint.id && t.status === 'wisdom').length}
                                          <span className="text-sm text-white/30 font-normal">/{tasks.filter(t => t.sprintId === sprint.id).length} tarefas</span>
                                      </div>
                                  </div>
                              </div>
                              
                              <p className="text-white/80 mb-4 italic border-l-2 border-primary/30 pl-3">
                                  "{sprint.intention}"
                              </p>

                              <div className="flex gap-2 flex-wrap">
                                  {sprint.goals?.map((goal, i) => (
                                      <span key={i} className="text-xs px-2 py-1 rounded bg-white/5 text-white/60">
                                          {goal}
                                      </span>
                                  ))}
                              </div>
                          </GlassCard>
                      </div>
                  ))
              )}
          </div>
      )}
      {/* Create Meta Year Modal */}
      <CicloModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateCiclo}
      />
      
      {/* Edit Meta Year Modal */}
      <CicloModal
        isOpen={isEditModalOpen}
        ciclo={cicloToEdit}
        onClose={() => { setIsEditModalOpen(false); setCicloToEdit(null); }}
        onSave={handleUpdateCiclo}
      />
    </div>
  );
}
