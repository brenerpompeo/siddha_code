
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { PillarRadarChart, SubPillarPieChart } from '@/components/AnalyticsCharts';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Compass, Target, Star, Heart, DollarSign } from 'lucide-react';
import { getZodiacSign } from '@/lib/utils/astrologyEngine';

export default function IkigaiBuilder({ userProfile }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [zodiac, setZodiac] = useState(null);

  useEffect(() => {
    if (userProfile) {
        setZodiac(getZodiacSign(userProfile.birth_date));
        fetchEntries();
    }
  }, [userProfile]);

  const fetchEntries = async () => {
    const { data } = await supabase.from('ikigai_entries').select('*').eq('user_id', userProfile.id);
    setEntries(data || []);
    setLoading(false);
  };

  return (
    <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-end">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Astro-Ikigai</h1>
                <p className="text-white/50">Alinhando seu propósito com as estrelas</p>
            </div>
            {zodiac && (
                <div className="text-right">
                    <p className="text-2xl font-bold text-primary">{zodiac.sign}</p>
                    <p className="text-xs text-white/40 uppercase tracking-widest">{zodiac.element}</p>
                </div>
            )}
        </div>

        {/* Main Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Visualizer */}
            <div className="relative aspect-square max-h-[500px] mx-auto">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-full opacity-30">
                        {/* Placeholder for a Venn Diagram visualization using CSS or SVG */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-2/3 rounded-full bg-pink-500 blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-2/3 h-2/3 rounded-full bg-blue-500 blur-3xl" />
                        <div className="absolute bottom-0 right-0 w-2/3 h-2/3 rounded-full bg-yellow-500 blur-3xl" />
                    </div>
                </div>
                
                {/* Center Label */}
                <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="text-center">
                        <h2 className="text-4xl font-bold text-white drop-shadow-lg">IKIGAI</h2>
                        <p className="text-white/80 text-sm">Seu Centro de Gravidade</p>
                    </div>
                </div>

                {/* Quadrants (Interactive) */}
                {/* Top: Love */}
                <div className="absolute top-10 left-1/2 -translate-x-1/2 text-center w-48">
                    <Heart className="w-8 h-8 text-pink-400 mx-auto mb-2" />
                    <h3 className="font-bold text-white">O que você ama</h3>
                    <p className="text-xs text-white/50">{entries.filter(e => e.category === 'love').length} itens</p>
                </div>

                {/* Left: Good At */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 text-center w-48">
                    <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                    <h3 className="font-bold text-white">No que é bom</h3>
                    <p className="text-xs text-white/50">{entries.filter(e => e.category === 'good_at').length} itens</p>
                </div>

                {/* Right: Needs */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 text-center w-48">
                    <Target className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <h3 className="font-bold text-white">O mundo precisa</h3>
                    <p className="text-xs text-white/50">{entries.filter(e => e.category === 'needs').length} itens</p>
                </div>

                {/* Bottom: Paid For */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center w-48">
                    <DollarSign className="w-8 h-8 text-green-400 mx-auto mb-2" />
                    <h3 className="font-bold text-white">Pago para fazer</h3>
                    <p className="text-xs text-white/50">{entries.filter(e => e.category === 'paid_for').length} itens</p>
                </div>
            </div>

            {/* Editor & Insights */}
            <div className="space-y-6">
                <Card className="bg-white/5 border-white/10 p-6">
                    <h3 className="font-bold text-white mb-4">Análise de Compatibilidade</h3>
                    <div className="space-y-4">
                        <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                            <h4 className="text-sm font-bold text-green-400 mb-1">Potencial Astrológico</h4>
                            <p className="text-xs text-white/70">
                                Seu signo solar ({zodiac?.sign}) em {zodiac?.element} favorece carreiras em {zodiac?.element === 'Fire' ? 'liderança e inovação' : zodiac?.element === 'Earth' ? 'estruturação e finanças' : zodiac?.element === 'Air' ? 'comunicação e ideias' : 'cura e artes'}.
                            </p>
                        </div>
                        {/* Placeholder for dynamic insights based on entries */}
                        {entries.length < 5 && (
                            <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                                <h4 className="text-sm font-bold text-yellow-400 mb-1">Em Construção</h4>
                                <p className="text-xs text-white/70">
                                    Continue adicionando itens aos 4 quadrantes para desbloquear insights mais profundos.
                                </p>
                            </div>
                        )}
                    </div>
                </Card>

                <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="h-24 flex flex-col gap-2 border-white/10 hover:bg-white/5 hover:border-pink-500/50 group">
                        <Heart className="w-6 h-6 text-pink-400 group-hover:scale-110 transition-transform" />
                        <span>Adicionar Paixão</span>
                    </Button>
                    <Button variant="outline" className="h-24 flex flex-col gap-2 border-white/10 hover:bg-white/5 hover:border-yellow-500/50 group">
                        <Star className="w-6 h-6 text-yellow-400 group-hover:scale-110 transition-transform" />
                        <span>Adicionar Talento</span>
                    </Button>
                    <Button variant="outline" className="h-24 flex flex-col gap-2 border-white/10 hover:bg-white/5 hover:border-blue-400/50 group">
                        <Target className="w-6 h-6 text-blue-400 group-hover:scale-110 transition-transform" />
                        <span>Adicionar Missão</span>
                    </Button>
                    <Button variant="outline" className="h-24 flex flex-col gap-2 border-white/10 hover:bg-white/5 hover:border-green-400/50 group">
                        <DollarSign className="w-6 h-6 text-green-400 group-hover:scale-110 transition-transform" />
                        <span>Adicionar Profissão</span>
                    </Button>
                </div>
            </div>
        </div>
    </div>
  );
}
