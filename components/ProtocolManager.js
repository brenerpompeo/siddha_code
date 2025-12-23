
import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Plus, Edit2, Trash2, Check, Clock, CalendarDays } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ProtocolManager({ protocols, setProtocols, user, isOpen, onClose }) {
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', frequency: 'daily', time: '' });
  const [isAdding, setIsAdding] = useState(false);

  const resetForm = () => {
    setFormData({ name: '', frequency: 'daily', time: '' });
    setEditingId(null);
    setIsAdding(false);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) return;

    try {
      if (editingId) {
        // Update
        const { error } = await supabase
          .from('protocols')
          .update({
            title: formData.name, // Mapping 'name' to 'title' in DB based on schema
            name: formData.name, // Keep for legacy/frontend compatibility
            frequency: formData.frequency,
            time: formData.time
          })
          .eq('id', editingId);

        if (error) throw error;

        setProtocols(prev => prev.map(p => 
          p.id === editingId ? { ...p, ...formData, title: formData.name } : p
        ));
      } else {
        // Create
        const newProtocol = {
          user_id: user.id,
          title: formData.name,
          name: formData.name,
          frequency: formData.frequency,
          time: formData.time,
          completed_today: false
        };

        const { data, error } = await supabase
          .from('protocols')
          .insert(newProtocol)
          .select()
          .single();

        if (error) throw error;
        setProtocols(prev => [...prev, data]);
      }
      resetForm();
    } catch (error) {
      console.error('Error saving protocol:', error);
      alert('Erro ao salvar protocolo');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este protocolo?')) return;
    try {
      const { error } = await supabase.from('protocols').delete().eq('id', id);
      if (error) throw error;
      setProtocols(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-surface border-white/10 max-h-[85vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Gerenciar Protocolos</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Add New Button */}
          {!isAdding && !editingId && (
            <Button onClick={() => setIsAdding(true)} className="w-full dashed border-white/20 hover:bg-white/5">
              <Plus className="w-4 h-4 mr-2" /> Adicionar Novo Protocolo
            </Button>
          )}

          {/* Form */}
          {(isAdding || editingId) && (
            <div className="p-4 bg-white/5 rounded-lg space-y-4 animate-in fade-in slide-in-from-top-2">
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">Nome do Hábito</label>
                <Input 
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Ler 10 páginas"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">Frequência</label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={formData.frequency}
                    onChange={e => setFormData(prev => ({ ...prev, frequency: e.target.value }))}
                  >
                    <option value="daily">Diário</option>
                    <option value="weekly">Semanal</option>
                    <option value="monthly">Mensal</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">Horário (Opcional)</label>
                  <Input 
                    type="time"
                    value={formData.time}
                    onChange={e => setFormData(prev => ({ ...prev, time: e.target.value }))}
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="ghost" onClick={resetForm}>Cancelar</Button>
                <Button onClick={handleSave}>Salvar</Button>
              </div>
            </div>
          )}

          {/* List */}
          <div className="space-y-2">
            {protocols.map(p => (
              <div key={p.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg group">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "p-2 rounded-full",
                    p.frequency === 'daily' ? 'bg-blue-500/20 text-blue-400' :
                    p.frequency === 'weekly' ? 'bg-purple-500/20 text-purple-400' :
                    'bg-orange-500/20 text-orange-400'
                  )}>
                    {p.frequency === 'daily' ? <Clock className="w-4 h-4" /> : <CalendarDays className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="font-medium">{p.name || p.title}</p>
                    <p className="text-xs text-muted-foreground capitalize">{p.frequency} • {p.time || 'Qualquer horário'}</p>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" onClick={() => {
                    setEditingId(p.id);
                    setFormData({ name: p.name || p.title, frequency: p.frequency, time: p.time || '' });
                    setIsAdding(false);
                  }}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-300" onClick={() => handleDelete(p.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
