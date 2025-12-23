
import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { X, User, Mail, Save } from 'lucide-react';

export default function EditProfileModal({ user, userProfile, isOpen, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    username: userProfile?.username || '',
    full_name: userProfile?.full_name || '',
    bio: userProfile?.bio || '',
    avatar_url: userProfile?.avatar_url || '',
    email: user?.email || ''
  });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const updates = {
        username: formData.username,
        full_name: formData.full_name,
        bio: formData.bio,
        avatar_url: formData.avatar_url,
        updated_at: new Date()
      };

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;

      onUpdate(updates);
      toast.success('Perfil atualizado com sucesso!');
      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Erro ao atualizar perfil.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#0f0f12] border border-white/10 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <h2 className="text-lg font-bold text-white">Editar Perfil</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-5 h-5 text-white/50" />
          </button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto">
            {/* Avatar Preview */}
            <div className="flex justify-center">
                <div className="relative w-24 h-24 rounded-full bg-white/5 border border-white/10 overflow-hidden group">
                    {formData.avatar_url ? (
                        <img src={formData.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-purple-500/20">
                            <span className="text-3xl font-bold text-white/50">{formData.username?.[0]?.toUpperCase()}</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-medium text-white/40">URL do Avatar</label>
                <Input 
                    value={formData.avatar_url}
                    onChange={e => setFormData({...formData, avatar_url: e.target.value})}
                    placeholder="https://exemplo.com/foto.jpg"
                    className="bg-white/5 border-white/10"
                />
            </div>

            <div className="space-y-2">
                <label className="text-xs font-medium text-white/40">Nome de Exibição (Username)</label>
                <div className="relative">
                    <User className="absolute left-3 top-2.5 w-4 h-4 text-white/30" />
                    <Input 
                        value={formData.username}
                        onChange={e => setFormData({...formData, username: e.target.value})}
                        className="pl-9 bg-white/5 border-white/10"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-medium text-white/40">Nome Completo</label>
                <Input 
                    value={formData.full_name}
                    onChange={e => setFormData({...formData, full_name: e.target.value})}
                    className="bg-white/5 border-white/10"
                />
            </div>

            <div className="space-y-2">
                <label className="text-xs font-medium text-white/40">Bio</label>
                <Textarea 
                    value={formData.bio}
                    onChange={e => setFormData({...formData, bio: e.target.value})}
                    placeholder="Conte um pouco sobre você..."
                    className="bg-white/5 border-white/10 min-h-[100px] resize-none"
                />
            </div>

            <div className="space-y-2">
                <label className="text-xs font-medium text-white/40">Email (Não editável)</label>
                <div className="relative opacity-50">
                    <Mail className="absolute left-3 top-2.5 w-4 h-4 text-white/30" />
                    <Input 
                        value={formData.email}
                        disabled
                        className="pl-9 bg-white/5 border-white/10"
                    />
                </div>
            </div>
        </div>

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
