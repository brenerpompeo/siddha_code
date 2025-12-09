
export function validateAlignment(hdProfile, zodiac, ikigaiEntry) {
    const alerts = [];
    if (!hdProfile || !zodiac || !ikigaiEntry) return alerts;

    // Rule 1: Bio-energy mismatch
    if (ikigaiEntry.category === 'paid_for') {
        const highEnergyKeywords = ['vendas', 'sales', 'construção', 'construction', 'evento', 'eventos', 'stock market', 'emergência', 'emergency', 'startup founder', 'atleta', 'athlete'];
        const isLowEnergyType = ['Projector', 'Reflector', 'Manifestor'].includes(hdProfile.type); 
        // Note: Manifestors have energy but not consistent sacral energy for sustaining long work
        
        const desc = ikigaiEntry.description.toLowerCase();
        const isHighEnergyJob = highEnergyKeywords.some(k => desc.includes(k));
        
        if (isLowEnergyType && isHighEnergyJob) {
            alerts.push({
                id: 'burnout_risk',
                title: 'Risco de Burnout',
                type: 'warning',
                message: `Atenção: Seu tipo no Human Design (${hdProfile.type}) sugere gerenciamento cuidadoso de energia. Funções de alta intensidade contínua como esta podem levar a exaustão sem estratégias claras de delegação e descanso.`
            });
        }
    }
    
    // Rule 2: Elemental friction
    if (zodiac.element === 'Earth' && ikigaiEntry.category === 'love') {
        const unstableKeywords = ['nomad', 'travel', 'long distance', 'change', 'aventura', 'adventure', 'nômade', 'viagem'];
        const desc = ikigaiEntry.description.toLowerCase();
        const isUnstable = unstableKeywords.some(k => desc.includes(k));
        
        if (isUnstable) {
             alerts.push({
                id: 'stability_friction',
                title: 'Fricção de Estabilidade',
                type: 'info',
                message: `Nota Astrológica: Como um signo de Terra (${zodiac.sign}), você tipicamente busca estabilidade e fundações sólidas. O elemento de constante mudança aqui pode gerar desconforto se não houver uma base segura.`
            });
        }
    }

    // Rule 3: 43-23 Channel Suggestion (Insight)
    if (ikigaiEntry.category === 'good_at' && hdProfile.channels && hdProfile.channels.includes('43-23')) {
        alerts.push({
            id: 'channel_insight',
            title: 'Canal da Estruturação (43-23)',
            type: 'success',
            message: 'Você tem o canal do "Insight". Considere adicionar tags como: "Simplificação", "Mentoria", "Expressão Individual".'
        });
    }

    return alerts;
}
