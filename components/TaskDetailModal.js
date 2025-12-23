
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { X, Calendar, Save } from 'lucide-react';
import { PILLARS, getPillarByKey } from '@/lib/constants/pillars';
import { SUB_PILLARS } from '@/lib/constants/sub-pillars';

const PRIORITY_OPTS = [
  { value: 'low', label: 'Baixa', color: 'bg-blue-500/20 text-blue-400' },
  { value: 'medium', label: 'Média', color: 'bg-yellow-500/20 text-yellow-400' },
  { value: 'high', label: 'Alta', color: 'bg-red-500/20 text-red-400' }
];

export default function TaskDetailModal({ task, isOpen, onClose, onUpdate }) {
  const [formData, setFormData] = useState({});
  const [metadata, setMetadata] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        pillar: task.pillar || 'physical',
        sub_pillar: task.sub_pillar || '',
        priority: task.priority || 'medium',
        due_date: task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : '',
        status: task.status || 'todo'
      });
      setMetadata(task.task_metadata || {});
    }
  }, [task]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const updates = {
        ...formData,
        task_metadata: metadata,
        due_date: formData.due_date ? new Date(formData.due_date).toISOString() : null
      };

      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', task.id)
        .select()
        .single();

      if (error) throw error;
      onUpdate(data);
      onClose();
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Erro ao salvar tarefa');
    } finally {
      setLoading(false);
    }
  };

  const handleMetadataChange = (key, value) => {
    setMetadata(prev => ({ ...prev, [key]: value }));
  };

  const renderDynamicInputs = () => {
    const pillar = formData.pillar;
    
    // Example: Physical Inputs
    if (pillar === 'physical') {
      return (
        <div className="space-y-3 p-3 bg-white/5 rounded-lg border border-white/10">
          <h4 className="text-xs font-semibold text-white/50 uppercase">Dados de Treino/Saúde</h4>
          <div className="grid grid-cols-2 gap-3">
             <div>
                <label className="text-xs text-white/60">Tipo de Treino</label>
                <Input 
                    value={metadata.workout_type || ''} 
                    onChange={e => handleMetadataChange('workout_type', e.target.value)}
                    placeholder="Ex: Musculação A"
                    className="h-8 text-sm"
                />
             </div>
             <div>
                <label className="text-xs text-white/60">Duração (min)</label>
                <Input 
                    type="number"
                    value={metadata.duration || ''} 
                    onChange={e => handleMetadataChange('duration', e.target.value)}
                    placeholder="45"
                    className="h-8 text-sm"
                />
             </div>
             <div className="col-span-2">
                <label className="text-xs text-white/60">Carga / Métricas</label>
                <Input 
                    value={metadata.metrics || ''} 
                    onChange={e => handleMetadataChange('metrics', e.target.value)}
                    placeholder="Ex: Supino 30kg, 10km run..."
                    className="h-8 text-sm"
                />
             </div>
          </div>
        </div>
      );
    }

    // Example: Intellectual Inputs
    if (pillar === 'intellectual') {
        return (
          <div className="space-y-3 p-3 bg-white/5 rounded-lg border border-white/10">
            <h4 className="text-xs font-semibold text-white/50 uppercase">Dados de Estudo</h4>
            <div className="grid grid-cols-2 gap-3">
               <div className="col-span-2">
                  <label className="text-xs text-white/60">Livro / Curso</label>
                  <Input 
                      value={metadata.source_title || ''} 
                      onChange={e => handleMetadataChange('source_title', e.target.value)}
                      placeholder="Nome do material"
                      className="h-8 text-sm"
                  />
               </div>
               <div>
                  <label className="text-xs text-white/60">Página Atual</label>
                  <Input 
                      type="number"
                      value={metadata.current_page || ''} 
                      onChange={e => handleMetadataChange('current_page', e.target.value)}
                      className="h-8 text-sm"
                  />
               </div>
               <div>
                  <label className="text-xs text-white/60">Meta Páginas</label>
                  <Input 
                      type="number"
                      value={metadata.target_page || ''} 
                      onChange={e => handleMetadataChange('target_page', e.target.value)}
                      className="h-8 text-sm"
                  />
               </div>
            </div>
          </div>
        );
      }

    return null;
  };

  if (!isOpen || !task) return null;

  // Get Sub-pillars for current pillar
  const currentSubPillars = SUB_PILLARS.filter(sp => sp.pillar === formData.pillar);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-[#0f0f12] border border-white/10 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-start justify-between bg-white/[0.02]">
          <div className="flex-1 mr-4">
             <div className="flex items-center gap-2 mb-2">
                <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider text-white bg-${getPillarByKey(formData.pillar)?.color.split('-')[1]}-500/20`}>
                    {getPillarByKey(formData.pillar)?.label || formData.pillar}
                </span>
                
                {/* Sub-Pillar Dropdown */}
                {currentSubPillars.length > 0 && (
                    <select
                        className="bg-white/5 text-xs text-white/70 border border-white/10 rounded px-2 py-0.5 outline-none focus:ring-0 cursor-pointer"
                        value={formData.sub_pillar}
                        onChange={e => setFormData({...formData, sub_pillar: e.target.value})}
                    >
                        <option value="">Sem categoria</option>
                        {currentSubPillars.map(sp => (
                            <option key={sp.key} value={sp.key}>{sp.label}</option>
                        ))}
                    </select>
                )}

                <select 
                    className="bg-transparent text-xs text-white/50 border-none outline-none focus:ring-0 cursor-pointer ml-auto"
                    value={formData.priority}
                    onChange={e => setFormData({...formData, priority: e.target.value})}
                >
                    {PRIORITY_OPTS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
             </div>
             <Input 
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="text-xl font-bold bg-transparent border-none px-0 h-auto focus-visible:ring-0 placeholder:text-white/20"
                placeholder="Nome da Tarefa"
             />
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-5 h-5 text-white/50" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Status & Dates */}
            <div className="flex gap-4">
                <div className="flex-1">
                    <label className="text-xs font-medium text-white/40 mb-1.5 block">Status</label>
                    <div className="flex gap-1 p-1 bg-white/5 rounded-lg">
                        {['todo', 'doing', 'wisdom'].map(s => (
                            <button
                                key={s}
                                onClick={() => setFormData({...formData, status: s})}
                                className={`flex-1 text-xs py-1.5 rounded-md transition-all ${formData.status === s ? 'bg-primary text-white shadow-sm' : 'text-white/40 hover:bg-white/5'}`}
                            >
                                {s === 'wisdom' ? 'Concluído' : s === 'doing' ? 'Fazendo' : 'A Fazer'}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="w-1/3">
                    <label className="text-xs font-medium text-white/40 mb-1.5 block">Prazo</label>
                    <div className="relative">
                        <Calendar className="absolute left-2.5 top-2.5 w-4 h-4 text-white/30" />
                        <Input 
                            type="date"
                            value={formData.due_date}
                            onChange={e => setFormData({...formData, due_date: e.target.value})}
                            className="pl-9 h-9 bg-white/5 border-white/10 text-xs"
                        />
                    </div>
                </div>
            </div>

            {/* Dynamic "Second Brain" Inputs */}
            {renderDynamicInputs()}

            {/* Description */}
            <div>
                <label className="text-xs font-medium text-white/40 mb-1.5 block">Notas & Detalhes</label>
                <Textarea 
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    placeholder="Adicione detalhes, links ou pensamentos..."
                    className="bg-white/5 border-white/10 min-h-[120px] text-sm resize-none"
                />
            </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-white/[0.02] flex justify-end gap-2">
            <Button variant="ghost" onClick={onClose} disabled={loading}>Cancelar</Button>
            <Button onClick={handleSave} disabled={loading}>
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
        </div>

      </div>
    </div>
  );
}
