'use client';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Search, Plus, BookOpen, X, Edit3, Trash2 } from 'lucide-react';
import { cn } from '@/lib/cn';
import { supabase } from '@/lib/supabase';
import { CustomButton as Button } from './custom-ui/CustomButton';
import { CustomInput as Input } from './custom-ui/CustomInput';
import { GlassCard } from './custom-ui/GlassCard';
import { SUB_PILLARS, getSubPillarByKey } from '@/lib/constants/sub-pillars';
import { PILLARS, getPillarByKey, getPillarColor } from '@/lib/constants/pillars';

export default function JournalPage({ journals, setJournals, userProfile }) {
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newEntry, setNewEntry] = useState({ title: '', content: '', tags: [], pillar: 'mental' });
  const [searchQuery, setSearchQuery] = useState('');
  const [tagInput, setTagInput] = useState('');
  
  const filteredJournals = journals.filter(j => 
    j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    j.content.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleCreateEntry = async () => {
    if (!newEntry.title.trim() || !newEntry.content.trim()) return;
    const entryId = uuidv4();
    const now = new Date().toISOString();
    const entry = {
      id: entryId,
      user_id: userProfile?.id || null,
      ...newEntry,
      created_at: now,
      linked_entries: []
    };
    setJournals(prev => [entry, ...prev]);
    setNewEntry({ title: '', content: '', tags: [], pillar: 'mental' });
    setTagInput('');
    setIsCreating(false);

    if (userProfile?.id) {
      try {
        await supabase.from('journal_entries').insert({
          id: entryId,
          user_id: userProfile.id,
          title: entry.title,
          content: entry.content,
          pillar: entry.pillar,
          tags: entry.tags || [],
          created_at: now
        });
      } catch (err) {
        console.error('Error inserting journal entry into Supabase:', err);
      }
    }
  };
  
  const handleDeleteEntry = async (entryId) => {
    if (confirm('Tem certeza que deseja excluir esta entrada?')) {
      setJournals(prev => prev.filter(j => j.id !== entryId));
      setSelectedEntry(null);
      try {
        await supabase.from('journal_entries').delete().eq('id', entryId);
      } catch (err) {
        console.error('Error deleting journal entry from Supabase:', err);
      }
    }
  };

  const handleUpdateEntry = async () => {
    if (!newEntry.title.trim() || !newEntry.content.trim()) return;
    const updated = {
      ...newEntry,
      updated_at: new Date().toISOString()
    };
    setJournals(prev => prev.map(j => j.id === updated.id ? { ...j, ...updated } : j));
    if (selectedEntry?.id === updated.id) {
      setSelectedEntry(prev => ({ ...prev, ...updated }));
    }
    setIsEditing(false);
    setNewEntry({ title: '', content: '', tags: [], pillar: 'mental' });

    try {
      await supabase.from('journal_entries').update({
        title: updated.title,
        content: updated.content,
        pillar: updated.pillar,
        tags: updated.tags || [],
        updated_at: updated.updated_at
      }).eq('id', updated.id);
    } catch (err) {
      console.error('Error updating journal entry in Supabase:', err);
    }
  };
  
  const handleTagInput = (e) => {
    const value = e.target.value;
    // Check if user typed # followed by text and space or enter
    if (value.endsWith(' ') && value.includes('#')) {
      const tags = value.match(/#(\w+)/g)?.map(t => t.slice(1)) || [];
      if (tags.length > 0) {
        setNewEntry(prev => ({ 
          ...prev, 
          tags: [...new Set([...(prev.tags || []), ...tags])] 
        }));
        setTagInput('');
        return;
      }
    }
    setTagInput(value);
  };
  
  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' && tagInput.includes('#')) {
      e.preventDefault();
      const tags = tagInput.match(/#(\w+)/g)?.map(t => t.slice(1)) || [];
      if (tags.length > 0) {
        setNewEntry(prev => ({ 
          ...prev, 
          tags: [...new Set([...(prev.tags || []), ...tags])] 
        }));
        setTagInput('');
      }
    }
  };
  
  const removeTag = (tagToRemove) => {
    setNewEntry(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tagToRemove)
    }));
  };
  
  // Get sub-pillars for selected pillar
  const subPillarsForPillar = SUB_PILLARS[newEntry.pillar] || [];
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Journal</h1>
          <p className="text-white/50">Seu segundo cérebro</p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Entrada
        </Button>
      </div>
      
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
        <input
          type="text"
          placeholder="Buscar entradas..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-primary"
        />
      </div>
      
      {/* Journal Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredJournals.map(entry => {
          const pillar = getPillarByKey(entry.pillar);
          return (
            <GlassCard
              key={entry.id}
              className="p-4 cursor-pointer hover:border-white/20 transition-all"
              onClick={() => setSelectedEntry(entry)}
            >
              <div className="flex items-center gap-2 mb-2">
                {pillar && (
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: pillar.color }} />
                )}
                <h3 className="font-semibold text-white line-clamp-1 flex-1">{entry.title}</h3>
              </div>
              <p className="text-sm text-white/60 line-clamp-3 mb-3">{entry.content}</p>
              <div className="flex items-center justify-between">
                <div className="flex gap-1 flex-wrap">
                  {entry.tags?.slice(0, 3).map(tag => {
                    const subPillar = getSubPillarByKey(tag);
                    return (
                      <span 
                        key={tag} 
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={subPillar ? { 
                          backgroundColor: `${getPillarColor(subPillar.pillar)}20`,
                          color: getPillarColor(subPillar.pillar)
                        } : { backgroundColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}
                      >
                        #{subPillar?.label || tag}
                      </span>
                    );
                  })}
                </div>
                <span className="text-xs text-white/40">
                  {new Date(entry.created_at).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </GlassCard>
          );
        })}
        
        {filteredJournals.length === 0 && (
          <div className="col-span-full">
            <GlassCard className="p-8 text-center">
              <BookOpen className="w-12 h-12 text-white/30 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Nenhuma entrada</h3>
              <p className="text-white/50 mb-4">Comece a documentar sua jornada</p>
              <Button onClick={() => setIsCreating(true)}>Criar Primeira Entrada</Button>
            </GlassCard>
          </div>
        )}
      </div>
      
      {/* Create or Edit Entry Modal */}
      {(isCreating || isEditing) && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-white/10 rounded-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">{isEditing ? 'Editar Entrada' : 'Nova Entrada'}</h3>
              <button onClick={() => { setIsCreating(false); setIsEditing(false); }} className="p-2 hover:bg-white/10 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <Input
                label="Título"
                placeholder="Título da entrada..."
                value={newEntry.title}
                onChange={(e) => setNewEntry(prev => ({ ...prev, title: e.target.value }))}
              />
              
              {/* Pillar Selection */}
              <div>
                <label className="block text-sm text-white/70 mb-2">Pilar Principal</label>
                <div className="flex flex-wrap gap-2">
                  {PILLARS.map(p => (
                    <button
                      key={p.key}
                      type="button"
                      onClick={() => setNewEntry(prev => ({ ...prev, pillar: p.key }))}
                      className={cn(
                        'px-3 py-1.5 rounded-full text-xs transition-all',
                        newEntry.pillar === p.key ? '' : 'bg-white/5 text-white/60'
                      )}
                      style={newEntry.pillar === p.key ? {
                        backgroundColor: `${p.color}30`,
                        color: p.color
                      } : {}}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-white/70 mb-2">Conteúdo</label>
                <textarea
                  placeholder="Escreva seus pensamentos... Use [[link]] para conectar outras entradas."
                  value={newEntry.content}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full h-48 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-primary resize-none"
                />
              </div>
              
              {/* Tags with # */}
              <div>
                <label className="block text-sm text-white/70 mb-2">Tags (use # para adicionar)</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {newEntry.tags?.map(tag => {
                    const subPillar = getSubPillarByKey(tag);
                    return (
                      <span 
                        key={tag} 
                        className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full"
                        style={subPillar ? { 
                          backgroundColor: `${getPillarColor(subPillar.pillar)}20`,
                          color: getPillarColor(subPillar.pillar)
                        } : { backgroundColor: 'rgba(139,92,246,0.2)', color: '#8b5cf6' }}
                      >
                        #{subPillar?.label || tag}
                        <button 
                          onClick={() => removeTag(tag)}
                          className="hover:opacity-70"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    );
                  })}
                </div>
                <input
                  placeholder="#meditacao #leitura #cardio"
                  value={tagInput}
                  onChange={handleTagInput}
                  onKeyDown={handleTagKeyDown}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-primary"
                />
                <p className="text-xs text-white/40 mt-1">Pressione espaço ou Enter após cada #tag</p>
              </div>
              
              {/* Quick Sub-Pillar Tags */}
              <div>
                <label className="block text-sm text-white/70 mb-2">Sub-pilares sugeridos ({getPillarByKey(newEntry.pillar)?.label})</label>
                <div className="flex flex-wrap gap-2">
                  {subPillarsForPillar.slice(0, 6).map(sp => (
                    <button
                      key={sp.key}
                      type="button"
                      onClick={() => {
                        if (!newEntry.tags?.includes(sp.key)) {
                          setNewEntry(prev => ({ ...prev, tags: [...(prev.tags || []), sp.key] }));
                        }
                      }}
                      disabled={newEntry.tags?.includes(sp.key)}
                      className={cn(
                        'px-2 py-1 rounded-full text-xs transition-all',
                        newEntry.tags?.includes(sp.key) 
                          ? 'bg-primary/20 text-primary opacity-50' 
                          : 'bg-white/5 text-white/60 hover:bg-white/10'
                      )}
                    >
                      {sp.icon} {sp.label}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="secondary" className="flex-1" onClick={() => { setIsCreating(false); setIsEditing(false); }}>Cancelar</Button>
                <Button className="flex-1" onClick={isEditing ? handleUpdateEntry : handleCreateEntry}>
                  {isEditing ? 'Salvar Alterações' : 'Salvar Entrada'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* View Entry Modal */}
      {selectedEntry && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-white/10 rounded-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                {getPillarByKey(selectedEntry.pillar) && (
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: getPillarByKey(selectedEntry.pillar)?.color }} 
                  />
                )}
                <h2 className="text-xl font-bold text-white">{selectedEntry.title}</h2>
              </div>
              <button onClick={() => setSelectedEntry(null)} className="p-2 hover:bg-white/10 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="prose prose-invert max-w-none">
              <p className="text-white/80 whitespace-pre-wrap">{selectedEntry.content}</p>
            </div>
            
            {selectedEntry.tags?.length > 0 && (
              <div className="flex gap-2 flex-wrap mt-6 pt-4 border-t border-white/10">
                {selectedEntry.tags.map(tag => {
                  const subPillar = getSubPillarByKey(tag);
                  return (
                    <span 
                      key={tag} 
                      className="text-xs px-2 py-1 rounded-full"
                      style={subPillar ? { 
                        backgroundColor: `${getPillarColor(subPillar.pillar)}20`,
                        color: getPillarColor(subPillar.pillar)
                      } : { backgroundColor: 'rgba(139,92,246,0.2)', color: '#8b5cf6' }}
                    >
                      #{subPillar?.label || tag}
                    </span>
                  );
                })}
              </div>
            )}
            
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
              <span className="text-xs text-white/40">
                Criado em {new Date(selectedEntry.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
              </span>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => {
                  setNewEntry({
                    id: selectedEntry.id,
                    title: selectedEntry.title,
                    content: selectedEntry.content,
                    tags: selectedEntry.tags || [],
                    pillar: selectedEntry.pillar || 'mental'
                  });
                  setIsEditing(true);
                  setSelectedEntry(null);
                }}>
                  <Edit3 className="w-4 h-4 mr-1" /> Editar
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDeleteEntry(selectedEntry.id)}>
                  <Trash2 className="w-4 h-4 mr-1" /> Excluir
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
