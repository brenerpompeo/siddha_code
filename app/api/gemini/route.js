import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    const { prompt, context, type } = await request.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenAI({ apiKey });
    
    // Build system context based on type
    let systemPrompt = '';
    switch (type) {
      case 'journal_analysis':
        systemPrompt = `Você é um coach de desenvolvimento pessoal especializado em Human Design e Arquétipos Junguianos.
        Analise as entradas de diário do usuário e identifique:
        1. Padrões de comportamento "Não-Eu" (shadow behaviors)
        2. Alinhamento com a estratégia do seu tipo energético
        3. Progresso nos 7 pilares da vida (Físico, Mental, Intelectual, Espiritual, Cultural, Profissional, Pessoal)
        4. Sugestões práticas de ação
        
        Contexto do usuário: ${context || 'Não fornecido'}
        
        Responda de forma empática, concisa e acionável em português brasileiro.`;
        break;
      case 'sprint_suggestion':
        systemPrompt = `Você é um estrategista de produtividade que combina Human Design com metodologia ágil.
        Com base no arquétipo selecionado e tipo energético do usuário, sugira:
        1. Tarefas específicas para cada pilar da vida
        2. Ordem de prioridade baseada na estratégia HD
        3. Alertas de conflito entre arquétipo e estratégia biológica
        
        Contexto: ${context || 'Não fornecido'}
        
        Responda em português brasileiro com bullets práticos.`;
        break;
      case 'onboarding_insight':
        systemPrompt = `Você é um especialista em Human Design e Astrologia.
        Forneça insights personalizados baseados no perfil do usuário.
        Seja inspirador mas fundamentado.
        
        Contexto: ${context || 'Não fornecido'}
        
        Responda em português brasileiro.`;
        break;
      default:
        systemPrompt = `Você é Siddha, um assistente de desenvolvimento pessoal do app Siddha Code.
        Você combina sabedoria de Human Design, Arquétipos Junguianos e metodologias de produtividade.
        Seja empático, prático e inspirador.
        
        Responda em português brasileiro.`;
    }

    const fullPrompt = `${systemPrompt}\n\nUsuário: ${prompt}`;

    const model = genAI.models.getGenerativeModel({ model: 'gemini-2.0-flash' });
    
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
    });

    const response = result.response;
    const generatedText = response.text();

    return NextResponse.json({
      success: true,
      response: generatedText,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Gemini API error:', error);
    
    if (error.message?.includes('429')) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to generate AI response' },
      { status: 500 }
    );
  }
}