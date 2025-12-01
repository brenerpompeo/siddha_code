import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.EMERGENT_LLM_KEY,
  baseURL: 'https://api.emergentai.cloud/v1',
});

export async function POST(request) {
  try {
    const { type, data } = await request.json();
    
    let systemPrompt = '';
    let userPrompt = '';
    
    switch (type) {
      case 'sprint-names':
        systemPrompt = `Você é um assistente especializado em produtividade e desenvolvimento pessoal. 
Gere nomes criativos e inspiradores para sprints baseados em intenções do usuário.
Responda APENAS em JSON válido com o formato: {"names": ["nome1", "nome2", "nome3"]}`;
        userPrompt = `Baseado nesta intenção: "${data.intention}", gere 3 nomes criativos para um sprint de desenvolvimento pessoal. 
Nomes devem ser curtos (2-4 palavras), inspiradores e refletir a transformação desejada.`;
        break;
        
      case 'intentions':
        systemPrompt = `Você é um coach de desenvolvimento pessoal especializado em Human Design e crescimento interior.
Gere sugestões de intenções transformadoras para sprints.
Responda APENAS em JSON válido com o formato: {"intentions": ["intenção1", "intenção2", "intenção3"]}`;
        userPrompt = `Baseado no nome do sprint: "${data.title}" e nos pilares: ${data.pillars?.join(', ') || 'todos'}, 
gere 3 intenções profundas e transformadoras para este sprint. 
Cada intenção deve ter 1-2 frases que descrevam a transformação desejada.`;
        break;
        
      case 'archetype-recommendation':
        systemPrompt = `Você é um especialista em arquétipos Junguianos e desenvolvimento pessoal.
Analise a intenção do usuário e recomende o arquétipo mais adequado.
Os arquétipos disponíveis são: hero (Herói), caregiver (Cuidador), explorer (Explorador), sage (Sábio), innocent (Inocente), creator (Criador), ruler (Governante), magician (Mago), lover (Amante), jester (Bobo), everyman (Homem Comum), outlaw (Rebelde).
Responda APENAS em JSON válido com o formato: {"recommended": "key", "reason": "explicação curta", "alternatives": ["key1", "key2"]}`;
        userPrompt = `Baseado nesta intenção: "${data.intention}", qual arquétipo Junguiano seria mais benéfico para guiar este sprint?
Explique brevemente por que este arquétipo é adequado.`;
        break;
        
      case 'commitments':
        systemPrompt = `Você é um coach de produtividade especializado em criar hábitos sustentáveis.
Gere sugestões de compromissos diários práticos e alcançáveis.
Responda APENAS em JSON válido com o formato: {"commitments": ["compromisso1", "compromisso2", "compromisso3", "compromisso4", "compromisso5"]}`;
        userPrompt = `Baseado nos pilares selecionados: ${data.pillars?.join(', ')}, no arquétipo: ${data.archetype}, e na intenção: "${data.intention}",
gere 5 compromissos diários específicos e práticos que o usuário pode assumir.
Cada compromisso deve ser acionável e levar menos de 30 minutos.`;
        break;
        
      case 'goals':
        systemPrompt = `Você é um especialista em definição de metas e OKRs.
Gere metas específicas e mensuráveis para sprints de desenvolvimento pessoal.
Responda APENAS em JSON válido com o formato: {"goals": ["meta1", "meta2", "meta3", "meta4", "meta5"]}`;
        userPrompt = `Baseado nos pilares: ${data.pillars?.join(', ')}, arquétipo: ${data.archetype}, e intenção: "${data.intention}",
gere 5 metas específicas e alcançáveis para um sprint de ${data.duration || 7} dias.
Metas devem ser claras, mensuráveis e desafiadoras mas realistas.`;
        break;
      
      case 'magic-draft':
        systemPrompt = `Você é o Siddha AI, um assistente de desenvolvimento pessoal que combina produtividade com sabedoria ancestral.
Analise o input do usuário e gere um rascunho completo de Sprint.
Os 7 pilares disponíveis são: physical (Físico), mental (Mental), intellectual (Intelectual), spiritual (Espiritual), cultural (Cultural), professional (Profissional), personal (Pessoal).
Responda APENAS em JSON válido com este formato exato:
{
  "sprintName": "Nome inspirador do Sprint",
  "intention": "Intenção transformadora de 1-2 frases",
  "suggestedPillars": ["pillar_key1", "pillar_key2"],
  "suggestedArchetype": "archetype_key",
  "archetypeReason": "Por que este arquétipo",
  "tasks": [
    {"content": "Task 1", "pillar": "pillar_key", "xp": 30},
    {"content": "Task 2", "pillar": "pillar_key", "xp": 40}
  ],
  "dailyCommitments": ["Compromisso 1", "Compromisso 2", "Compromisso 3"]
}`;
        userPrompt = `O usuário disse: "${data.userInput}"

Baseado neste input, gere um Sprint completo com:
- Nome criativo e inspirador (2-4 palavras)
- Intenção profunda
- 2-3 pilares mais relevantes (use as keys: physical, mental, intellectual, spiritual, cultural, professional, personal)
- Arquétipo mais adequado (use as keys: hero, sage, explorer, creator, caregiver, magician, ruler, lover, jester, innocent, everyman, outlaw)
- 5-8 tasks específicas mapeadas para os pilares sugeridos
- 3 compromissos diários práticos`;
        break;
        
      case 'task-suggestions':
        systemPrompt = `Você é um assistente de produtividade que gera tarefas específicas e acionáveis.
Responda APENAS em JSON válido com o formato:
{"tasks": [{"content": "descrição da task", "xp": 30}, {"content": "outra task", "xp": 40}]}`;
        userPrompt = `Gere 5 sugestões de tasks para o pilar "${data.pillar}" (${data.pillarLabel}) relacionadas ao sub-pilar "${data.subPillar || 'geral'}".
${data.context ? `Contexto adicional: ${data.context}` : ''}
Cada task deve ser específica, acionável e completável em um dia. XP deve variar de 20 a 60 baseado na dificuldade.`;
        break;
        
      default:
        return NextResponse.json({ error: 'Invalid suggestion type' }, { status: 400 });
    }
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });
    
    const content = response.choices[0]?.message?.content || '{}';
    
    // Parse JSON from response
    let result;
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      result = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      result = { error: 'Failed to parse response', raw: content };
    }
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('AI Suggestion Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate suggestions' },
      { status: 500 }
    );
  }
}
