
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Image as ImageIcon, Type, X, Trash2 } from 'lucide-react';

export default function DreamBoard({ cicloId }) {
  const [items, setItems] = useState([]);
  const [isAdding, setIsAdding] = useState(null); // 'image' or 'text'
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (cicloId) fetchItems();
  }, [cicloId]);

  const fetchItems = async () => {
    const { data } = await supabase
      .from('dream_board_items')
      .select('*')
      .eq('ciclo_id', cicloId)
      .order('created_at', { ascending: true });
    setItems(data || []);
  };

  const handleAddItem = async () => {
    if (!content.trim()) return;
    setLoading(true);
    try {
      const newItem = {
        ciclo_id: cicloId,
        type: isAdding,
        content: content,
        width: isAdding === 'image' ? 300 : 200,
        height: 200
      };

      const { data, error } = await supabase
        .from('dream_board_items')
        .insert(newItem)
        .select()
        .single();

      if (error) throw error;
      setItems([...items, data]);
      setIsAdding(null);
      setContent('');
    } catch (error) {
      console.error('Error adding item:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Remover este item?')) return;
    try {
      await supabase.from('dream_board_items').delete().eq('id', id);
      setItems(items.filter(i => i.id !== id));
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Quadro dos Sonhos</h3>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setIsAdding('image')}>
            <ImageIcon className="w-4 h-4 mr-2" /> Imagem
          </Button>
          <Button size="sm" variant="outline" onClick={() => setIsAdding('text')}>
            <Type className="w-4 h-4 mr-2" /> Texto
          </Button>
        </div>
      </div>

      {isAdding && (
        <div className="p-4 bg-white/5 rounded-lg border border-white/10 flex gap-2 animate-in fade-in">
          <Input 
            placeholder={isAdding === 'image' ? "Cole a URL da imagem..." : "Digite sua afirmação ou meta..."}
            value={content}
            onChange={e => setContent(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleAddItem} disabled={loading}>Adicionar</Button>
          <Button variant="ghost" size="icon" onClick={() => setIsAdding(null)}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Masonry-style Grid */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
        {items.map(item => (
          <div key={item.id} className="break-inside-avoid relative group">
            <Card className="bg-white/5 border-white/10 overflow-hidden hover:border-primary/50 transition-colors">
              <div className="relative">
                 {item.type === 'image' ? (
                   <img src={item.content} alt="Dream" className="w-full h-auto object-cover" />
                 ) : (
                   <div className="p-6 text-center flex items-center justify-center min-h-[150px] bg-gradient-to-br from-primary/10 to-purple-500/10">
                     <p className="text-lg font-medium text-white font-serif italic">"{item.content}"</p>
                   </div>
                 )}
                 
                 <button 
                   onClick={() => handleDelete(item.id)}
                   className="absolute top-2 right-2 p-2 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-white hover:bg-red-500"
                 >
                   <Trash2 className="w-3 h-3" />
                 </button>
              </div>
            </Card>
          </div>
        ))}
      </div>
      
      {items.length === 0 && !isAdding && (
        <div className="text-center py-12 border-2 border-dashed border-white/10 rounded-xl">
          <p className="text-white/40">Seu quadro está vazio. Adicione imagens e afirmações para visualizar seu futuro.</p>
        </div>
      )}
    </div>
  );
}
