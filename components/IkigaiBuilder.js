
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { validateAlignment } from '@/lib/utils/compatibilityCore';
import { getZodiacSign } from '@/lib/utils/astrologyEngine';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, DollarSign, Target, Star, AlertTriangle, Info, CheckCircle } from 'lucide-react';

const CATEGORIES = {
  love: { label: 'O que você ama', icon: Heart, color: 'text-pink-500', bg: 'bg-pink-500/10' },
  good_at: { label: 'No que você é bom', icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
  paid_for: { label: 'Pelo que podem te pagar', icon: DollarSign, color: 'text-green-500', bg: 'bg-green-500/10' },
  needs: { label: 'O que o mundo precisa', icon: Target, color: 'text-blue-500', bg: 'bg-blue-500/10' }
};

export default function IkigaiBuilder({ userProfile }) {
  const [entries, setEntries] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [activeCategory, setActiveCategory] = useState('love');
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEntries();
  }, [userProfile?.id]);

  const fetchEntries = async () => {
    if (!userProfile?.id) return;
    try {
      const { data, error } = await supabase
        .from('ikigai_entries')
        .select('*')
        .eq('user_id', userProfile.id);
      
      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error('Error fetching ikigai:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async () => {
    if (!newItem.trim() || !userProfile?.id) return;

    const zodiac = getZodiacSign(userProfile.birth_date);
    const validationAlerts = validateAlignment(userProfile, zodiac, { 
      category: activeCategory, 
      description: newItem 
    });

    if (validationAlerts.length > 0) {
      setAlerts(validationAlerts); // Display alerts but proceed? Or ask confirmation?
      // For now, we show them and add anyway, as per plan "Alert/Warning"
    }

    try {
      const { data, error } = await supabase
        .from('ikigai_entries')
        .insert([{
          user_id: userProfile.id,
          category: activeCategory,
          description: newItem
        }])
        .select();

      if (error) throw error;

      setEntries([...entries, data[0]]);
      setNewItem('');
      
      // Clear alerts after 5 seconds
      if (validationAlerts.length > 0) {
        setTimeout(() => setAlerts([]), 8000);
      }
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const { error } = await supabase.from('ikigai_entries').delete().eq('id', id);
      if (error) throw error;
      setEntries(entries.filter(e => e.id !== id));
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          Sua Mandala Ikigai
        </h2>
        <p className="text-muted-foreground mt-2">Construa seu propósito alinhado aos astros</p>
      </div>

      {/* Tabs / Quadrant Selector */}
      <div className="flex flex-wrap gap-2 justify-center mb-6">
        {Object.entries(CATEGORIES).map(([key, config]) => (
          <button
            key={key}
            onClick={() => setActiveCategory(key)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-full border transition-all
              ${activeCategory === key 
                ? `${config.bg} ${config.color} border-${config.color.split('-')[1]}-500 ring-1 ring-${config.color.split('-')[1]}-500` 
                : 'bg-card border-border hover:bg-accent'}
            `}
          >
            <config.icon className="w-4 h-4" />
            <span>{config.label}</span>
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Input Area */}
        <Card className="bg-card/50 backdrop-blur border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {React.createElement(CATEGORIES[activeCategory].icon, { className: CATEGORIES[activeCategory].color })}
              Adicionar ao {CATEGORIES[activeCategory].label}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input 
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                placeholder="Ex: Programação, Cuidar de animais..."
                onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
              />
              <Button onClick={handleAddItem}>Adicionar</Button>
            </div>

            {/* Alerts Display */}
            {alerts.length > 0 && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                {alerts.map((alert, idx) => (
                  <div key={idx} className={`p-3 rounded-lg flex gap-3 text-sm ${
                    alert.type === 'warning' ? 'bg-orange-500/20 text-orange-200 border border-orange-500/30' :
                    alert.type === 'success' ? 'bg-green-500/20 text-green-200 border border-green-500/30' :
                    'bg-blue-500/20 text-blue-200 border border-blue-500/30'
                  }`}>
                    {alert.type === 'warning' ? <AlertTriangle className="w-5 h-5 shrink-0" /> :
                     alert.type === 'success' ? <CheckCircle className="w-5 h-5 shrink-0" /> :
                     <Info className="w-5 h-5 shrink-0" />}
                    <div>
                      <p className="font-bold">{alert.title}</p>
                      <p>{alert.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* List Area */}
        <Card className="bg-card/50 backdrop-blur border-white/10">
           <CardHeader>
            <CardTitle>Seus Itens</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
              {entries.filter(e => e.category === activeCategory).length === 0 ? (
                <p className="text-center text-muted-foreground py-8">Nenhum item adicionado ainda.</p>
              ) : (
                entries
                  .filter(e => e.category === activeCategory)
                  .map(entry => (
                    <div key={entry.id} className="group flex justify-between items-center p-2 rounded hover:bg-white/5 transition-colors">
                      <span>{entry.description}</span>
                      <button 
                        onClick={() => handleDelete(entry.id)}
                        className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-opacity"
                      >
                        Remover
                      </button>
                    </div>
                  ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary / Core Visualization (Placeholder for now) */}
      <div className="mt-8 p-6 bg-gradient-to-br from-purple-900/20 to-indigo-900/20 rounded-2xl border border-white/5 text-center">
        <h3 className="text-xl font-bold mb-2">Seu Centro Ikigai</h3>
        <p className="text-muted-foreground">
          {entries.length < 4 
            ? "Continue preenchendo os 4 quadrantes para revelar seu propósito central." 
            : "Você está coletando peças importantes do seu quebra-cabeça existencial. O sistema Astro-Ikigai está analisando conexões..."}
        </p>
      </div>
    </div>
  );
}
