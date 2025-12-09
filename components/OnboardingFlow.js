
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { getZodiacSign } from '@/lib/utils/astrologyEngine';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Sparkles, ArrowRight, User, Calendar, MapPin } from 'lucide-react';

import { calculateHumanDesign } from '@/lib/utils/humanDesign';

export default function OnboardingFlow({ user, onComplete }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    birth_date: '',
    birth_time: '',
    birth_location: '',
    human_design_type: 'Generator',
    human_design_profile: '1/3',
    zodiac_sign: '',
    zodiac_element: ''
  });

  const [zodiacFeedback, setZodiacFeedback] = useState(null);
  const [calculatedHD, setCalculatedHD] = useState(null);

  // Watch birth_date for zodiac calculation
  useEffect(() => {
    if (formData.birth_date) {
      const zodiac = getZodiacSign(formData.birth_date);
      if (zodiac) {
        setFormData(prev => ({
          ...prev,
          zodiac_sign: zodiac.sign,
          zodiac_element: zodiac.element
        }));
        setZodiacFeedback(zodiac);
      }
    }
  }, [formData.birth_date]);

  const handleCalculateHD = () => {
      const hd = calculateHumanDesign(formData.birth_date, formData.birth_time, formData.birth_location);
      if (hd) {
          setFormData(prev => ({
              ...prev,
              human_design_type: hd.type,
              human_design_profile: hd.profile
          }));
          setCalculatedHD(hd);
      }
  };

  const handleNext = () => {
    setStep(prev => prev + 1);
  };


  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email,
          ...formData,
          ikigai_status: {},
          updated_at: new Date()
        });

      if (error) throw error;
      onComplete();
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Erro ao salvar perfil. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <Card className="w-full max-w-lg bg-surface border-white/10 shadow-2xl relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            Bem-vindo ao Siddha Code
          </CardTitle>
          <CardDescription>
            Vamos calibrar seu perfil existencial. Passo {step} de 3.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6 relative z-10">
          
          {step === 1 && (
            <div className="space-y-4 animate-in slide-in-from-right">
              <div className="space-y-2">
                <Label>Como você gostaria de ser chamado?</Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input 
                    className="pl-10"
                    placeholder="Seu nome"
                    value={formData.full_name}
                    onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  />
                </div>
              </div>
              <Button className="w-full" onClick={handleNext} disabled={!formData.full_name}>
                Continuar <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in slide-in-from-right">
              <div className="space-y-2">
                <Label>Data de Nascimento</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input 
                    type="date"
                    className="pl-10"
                    value={formData.birth_date}
                    onChange={(e) => setFormData({...formData, birth_date: e.target.value})}
                  />
                </div>
              </div>
              
              {zodiacFeedback && (
                <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg flex items-center gap-3 animate-in fade-in zoom-in">
                  <span className="text-2xl">✨</span>
                  <div>
                    <p className="font-semibold text-primary">Detectado: {zodiacFeedback.sign}</p>
                    <p className="text-xs text-muted-foreground">Elemento: {zodiacFeedback.element} | Modalidade: {zodiacFeedback.modality}</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Hora (Opcional)</Label>
                  <Input 
                    type="time"
                    value={formData.birth_time}
                    onChange={(e) => setFormData({...formData, birth_time: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Local (Opcional)</Label>
                  <div className="relative">
                     <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      className="pl-9"
                      placeholder="Cidade"
                      value={formData.birth_location}
                      onChange={(e) => setFormData({...formData, birth_location: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <Button className="w-full" onClick={handleNext} disabled={!formData.birth_date}>
                Continuar <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-in slide-in-from-right">
              <div className="space-y-2">
                <Label>Human Design Type (Se souber)</Label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.human_design_type}
                  onChange={(e) => setFormData({...formData, human_design_type: e.target.value})}
                >
                  <option value="Generator">Generator</option>
                  <option value="Manifesting Generator">Manifesting Generator</option>
                  <option value="Projector">Projector</option>
                  <option value="Manifestor">Manifestor</option>
                  <option value="Reflector">Reflector</option>
                </select>
                <p className="text-xs text-muted-foreground">
                  Se não souber, calcularemos depois (mock por enquanto).
                </p>
              </div>

              <Button className="w-full" onClick={handleSubmit} disabled={loading}>
                {loading ? 'Salvando...' : 'Finalizar Setup'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
