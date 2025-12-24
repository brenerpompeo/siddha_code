import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Pre-defined suggestions as fallback
const FALLBACK_SUGGESTIONS = {
  sprintNames: [
    'Despertar do Guerreiro',
    'Jornada da Transformação',
    'Ciclo da Força Interior',
    'Semana do Foco Absoluto',
    'Sprint da Evolução'
  ],
  intentions: [
    'Fortalecer corpo e mente para alcançar meu máximo potencial',
    'Desenvolver disciplina inabalável através de práticas diárias consistentes',
    'Transformar hábitos limitantes em rotinas de alta performance'
  ],
  goals: {
    physical: [
      'Treinar 5x por semana',
      'Beber 3L de água diariamente',
      'Dormir 8h por noite',
      'Fazer 10.000 passos por dia',
      'Eliminar açúcar refinado'
    ],
    mental: [
      'Meditar 10 min diariamente',
      'Praticar gratidão todas as manhãs',
      'Journaling noturno',
      'Digital detox 1h antes de dormir',
      'Ler 20 páginas por dia'
    ],
    intellectual: [
      'Completar 1 curso online',
      'Ler 2 livros no mês',
      'Aprender 50 palavras em inglês',
      'Assistir 1 documentário por semana',
      'Escrever 1 artigo'
    ],
    spiritual: [
      'Oração/meditação matinal',
      'Contemplar natureza 3x semana',
      'Praticar perdão consciente',
      'Fazer 1 ato de caridade',
      'Retiro de silêncio 1h semanal'
    ],
    cultural: [
      'Visitar 1 museu ou exposição',
      'Assistir 2 filmes clássicos',
      'Ir a 1 evento cultural',
      'Aprender sobre nova cultura',
      'Cozinhar prato de outro país'
    ],
    professional: [
      'Definir OKRs semanais',
      'Fazer 3 conexões de networking',
      'Completar projeto prioritário',
      'Organizar workspace',
      'Revisar finanças mensais'
    ],
    personal: [
      'Date night semanal',
      'Ligar para família 2x semana',
      'Organizar casa',
      'Tempo de qualidade com filhos',
      'Hobby pessoal 2h semana'
    ]
  },
  commitments: {
    daily: [
      'Acordar às 6h',
      'Exercício matinal 30min',
      'Meditação 10min',
      'Gratidão 3 itens',
      'Planejamento do dia',
      'Beber 3L água',
      'Leitura 20min',
      'Journaling noturno',
      'Dormir às 22h'
    ],
    weekly: [
      'Revisão semanal domingo',
      'Treino intenso 3x',
      'Networking 1 pessoa',
      'Tempo em família',
      'Hobby pessoal',
      'Limpeza profunda casa',
      'Planejamento próxima semana'
    ],
    monthly: [
      'Revisão de metas',
      'Checkup saúde',
      'Atualizar finanças',
      'Evento cultural',
      'Day off completo',
      'Reflexão profunda',
      'Ajuste de rotinas'
    ]
  },
  archetypes: {
    hero: 'Você busca superar desafios e provar seu valor. Foque em metas de conquista e disciplina.',
    sage: 'Sua jornada é de conhecimento. Priorize aprendizado e reflexão profunda.',
    explorer: 'Liberdade é sua essência. Busque novas experiências e autodescoberta.',
    creator: 'Expressão é seu dom. Foque em projetos criativos e inovação.',
    caregiver: 'Cuidar é sua missão. Balance autocuidado com serviço aos outros.',
    magician: 'Transformação é seu poder. Trabalhe em manifestar visões em realidade.',
    ruler: 'Liderança é seu chamado. Foque em organização e impacto.',
    lover: 'Conexão é sua força. Priorize relacionamentos e experiências sensoriais.',
    jester: 'Alegria é seu dom. Mantenha leveza enquanto busca crescimento.',
    innocent: 'Pureza é sua essência. Busque simplicidade e otimismo.',
    everyman: 'Pertencimento é seu valor. Foque em conexões autênticas.',
    outlaw: 'Revolução é seu caminho. Quebre padrões que não servem mais.'
  }
};

const openai = new OpenAI({
  apiKey: process.env.EMERGENT_LLM_KEY,
  baseURL: 'https://api.emergent.sh/v1',
});

async function callAI(systemPrompt, userPrompt) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 800,
    });
    
    const content = response.choices[0]?.message?.content || '{}';
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : null;
  } catch (error) {
    console.error('AI call failed:', error.message);
    return null;
  }
}

export async function POST(request) {
  try {
    const { type, data } = await request.json();
    
    let result = null;
    
    switch (type) {
      case 'sprint-names': {
        result = await callAI(
          'Gere nomes criativos para sprints. Responda em JSON: {"names": ["nome1", "nome2", "nome3"]}',
          `Intenção: "${data.intention}". Gere 3 nomes inspiradores (2-4 palavras).`
        );
        if (!result?.names) {
          result = { names: FALLBACK_SUGGESTIONS.sprintNames.slice(0, 3) };
        }
        break;
      }
      
      case 'intentions': {
        result = await callAI(
          'Gere intenções transformadoras. Responda em JSON: {"intentions": ["intenção1", "intenção2", "intenção3"]}',
          `Sprint: "${data.title}", Pilares: ${data.pillars?.join(', ') || 'todos'}. Gere 3 intenções profundas.`
        );
        if (!result?.intentions) {
          result = { intentions: FALLBACK_SUGGESTIONS.intentions };
        }
        break;
      }
      
      case 'archetype-recommendation': {
        result = await callAI(
          'Recomende arquétipo Junguiano. Arquétipos: hero, sage, explorer, creator, caregiver, magician, ruler, lover, jester, innocent, everyman, outlaw. Responda em JSON: {"recommended": "key", "reason": "explicação"}',
          `Intenção: "${data.intention}". Qual arquétipo é mais adequado?`
        );
        if (!result?.recommended) {
          result = { recommended: 'hero', reason: FALLBACK_SUGGESTIONS.archetypes.hero };
        }
        break;
      }
      
      case 'goals': {
        const pillars = data.pillars || ['physical', 'mental'];
        result = await callAI(
          'Gere metas específicas. Responda em JSON: {"goals": ["meta1", "meta2", "meta3", "meta4", "meta5"]}',
          `Pilares: ${pillars.join(', ')}, Arquétipo: ${data.archetype}, Intenção: "${data.intention}", Duração: ${data.duration || 7} dias. Gere 5 metas alcançáveis.`
        );
        if (!result?.goals) {
          // Use fallback goals from selected pillars
          const fallbackGoals = [];
          pillars.forEach(p => {
            if (FALLBACK_SUGGESTIONS.goals[p]) {
              fallbackGoals.push(...FALLBACK_SUGGESTIONS.goals[p].slice(0, 2));
            }
          });
          result = { goals: fallbackGoals.slice(0, 5) };
        }
        break;
      }
      
      case 'commitments': {
        result = await callAI(
          'Gere compromissos práticos. Responda em JSON: {"daily": ["1", "2", "3"], "weekly": ["1", "2"], "monthly": ["1", "2"]}',
          `Pilares: ${data.pillars?.join(', ')}, Arquétipo: ${data.archetype}, Intenção: "${data.intention}". Gere compromissos diários, semanais e mensais.`
        );
        if (!result?.daily) {
          result = {
            daily: FALLBACK_SUGGESTIONS.commitments.daily.slice(0, 5),
            weekly: FALLBACK_SUGGESTIONS.commitments.weekly.slice(0, 3),
            monthly: FALLBACK_SUGGESTIONS.commitments.monthly.slice(0, 3)
          };
        }
        break;
      }
      
      case 'magic-draft': {
        result = await callAI(
          `Crie um Sprint completo. Pilares disponíveis: physical, mental, intellectual, spiritual, cultural, professional, personal. Arquétipos: hero, sage, explorer, creator, caregiver, magician, ruler, lover, jester, innocent, everyman, outlaw.
Responda em JSON:
{
  "sprintName": "Nome",
  "intention": "Intenção",
  "suggestedPillars": ["pillar1", "pillar2"],
  "suggestedArchetype": "archetype_key",
  "goals": ["meta1", "meta2", "meta3", "meta4", "meta5"],
  "dailyCommitments": ["compromisso1", "compromisso2", "compromisso3"]
}`,
          `O usuário disse: "${data.userInput}". Crie um Sprint completo baseado neste input.`
        );
        if (!result?.sprintName) {
          result = {
            sprintName: 'Sprint de Transformação',
            intention: 'Evoluir consistentemente em todas as áreas da vida',
            suggestedPillars: ['physical', 'mental'],
            suggestedArchetype: 'hero',
            goals: FALLBACK_SUGGESTIONS.goals.physical.slice(0, 3).concat(FALLBACK_SUGGESTIONS.goals.mental.slice(0, 2)),
            dailyCommitments: FALLBACK_SUGGESTIONS.commitments.daily.slice(0, 3)
          };
        }
        break;
      }
      
      case 'chat': {
        result = await callAI(
          `Você é o Siddha AI, um mentor de produtividade e autoconhecimento. 
           Seu objetivo é ajudar o usuário a alinhar suas ações diárias com sua essência (Human Design e Arquétipos).
           Responda de forma curta, empática e inspiradora. Use emojis.`,
          data.message
        );
        if (!result) {
            // Fallback for chat if AI fails
            result = { reply: "Estou em silêncio profundo no momento. Tente novamente mais tarde. 🧘‍♂️" };
        } else if (result.reply === undefined) {
             // If the JSON prompt instruction wasn't explicit enough in callAI for this case, 
             // we might have gotten an object but not 'reply'.
             // Let's just trust the fallback above for text chat.
        }
        break;
      }
      case 'get-suggestions': {
        // Return all pre-defined suggestions
        result = {
          goals: FALLBACK_SUGGESTIONS.goals,
          commitments: FALLBACK_SUGGESTIONS.commitments,
          sprintNames: FALLBACK_SUGGESTIONS.sprintNames,
          intentions: FALLBACK_SUGGESTIONS.intentions
        };
        break;
      }
      
      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('Suggestion API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
