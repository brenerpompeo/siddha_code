'use client';
import { Settings, Zap, Flame, Trophy, Sparkles } from 'lucide-react';
import { cn } from '@/lib/cn';
import { CustomButton as Button } from './custom-ui/CustomButton';
import { Badge } from './custom-ui/Badge';
import { GlassCard } from './custom-ui/GlassCard';
import { getRankByXp } from '@/lib/constants/ranks';
import { getHDTypeByKey, getArchetypeByKey } from '@/lib/constants/archetypes';
import { PILLARS, getPillarByKey } from '@/lib/constants/pillars';

export default function ProfilePage({ user, userProfile, setUserProfile, onEditProfile }) {
  const currentRank = getRankByXp(userProfile?.xp || 0);
  const hdType = getHDTypeByKey(userProfile?.hd_type);
  const archetype = getArchetypeByKey(userProfile?.archetype);
  
  return (
    <div className="space-y-6">
      <div className="relative h-48 rounded-2xl overflow-hidden bg-gradient-to-r from-primary/20 to-purple-600/20 border border-white/10">
        <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')" }} />
        <div className="absolute bottom-6 left-6 flex items-end gap-6">
          <div className="w-24 h-24 rounded-2xl bg-[#0f0f13] border-4 border-[#0f0f13] flex items-center justify-center text-3xl font-bold text-white shadow-xl">
            {userProfile?.username?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="mb-2">
            <h1 className="text-3xl font-bold text-white">{userProfile?.username || 'Warrior'}</h1>
            <p className="text-white/60">{user?.email}</p>
          </div>
        </div>
        <Button 
          className="absolute top-6 right-6" 
          variant="secondary"
          onClick={onEditProfile}
        >
          <Settings className="w-4 h-4 mr-2" />
          Editar Perfil
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stats */}
        <GlassCard className="p-6 space-y-6">
          <h3 className="font-semibold text-white">Estatísticas</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center">
              <Zap className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{userProfile?.xp || 0}</p>
              <p className="text-xs text-white/50">XP Total</p>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center">
              <Flame className="w-6 h-6 text-orange-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{userProfile?.streak || 0}</p>
              <p className="text-xs text-white/50">Dias Streak</p>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center col-span-2">
              <Trophy className="w-6 h-6 text-purple-500 mx-auto mb-2" />
              <p className="text-xl font-bold text-white">{currentRank}</p>
              <p className="text-xs text-white/50">Rank Atual</p>
            </div>
          </div>
        </GlassCard>
        
        {/* HD & Archetype */}
        <GlassCard className="lg:col-span-2 p-6">
          <h3 className="font-semibold text-white mb-6">Seu Design</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {hdType && (
              <div className="p-4 rounded-xl border relative overflow-hidden" style={{ backgroundColor: `${hdType.color}10`, borderColor: `${hdType.color}30` }}>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-3">
                    <Sparkles className="w-5 h-5" style={{ color: hdType.color }} />
                    <h4 className="font-bold text-white">{hdType.name}</h4>
                  </div>
                  <p className="text-sm text-white/70 mb-2">{hdType.description}</p>
                  <p className="text-xs text-white/50">Estratégia: <strong className="text-white">{hdType.strategy}</strong></p>
                </div>
              </div>
            )}
            
            {archetype && (
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{archetype.icon}</span>
                  <h4 className="font-bold text-white">{archetype.name}</h4>
                </div>
                <p className="text-sm text-white/60 italic mb-2">"{archetype.motto}"</p>
                <div className="flex gap-2 mt-3">
                  {archetype.focus.map(f => {
                    const p = getPillarByKey(f);
                    return p ? <Badge key={f} color={p.color}>{p.label}</Badge> : null;
                  })}
                </div>
              </div>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
