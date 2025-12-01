// Human Design Constants - Based on HDKit
// Reference: https://github.com/jdempcy/hdkit

// Gate Order (Mandala sequence starting from Gate 41)
export const GATE_ORDER = [41, 19, 13, 49, 30, 55, 37, 63, 22, 36, 25, 17, 21, 51, 42, 3, 27, 24, 2, 23, 8, 20, 16, 35, 45, 12, 15, 52, 39, 53, 62, 56, 31, 33, 7, 4, 29, 59, 40, 64, 47, 6, 46, 18, 48, 57, 32, 50, 28, 44, 1, 43, 14, 34, 9, 5, 26, 11, 10, 58, 38, 54, 61, 60];

// Gate Names (I Ching)
export const GATE_NAMES = {
  1: { name: "O Criativo", gate: "Portal da Auto-Expressão", description: "Criatividade Enraizada em Direção Única" },
  2: { name: "O Receptivo", gate: "Portal da Direção do Eu", description: "O Motorista" },
  3: { name: "Dificuldades no Início", gate: "Portal da Ordenação", description: "Mutação é Gerada & Empoderada" },
  4: { name: "Loucura Juvenil", gate: "Portal da Formulização", description: "Lógica Protege da Infelicidade" },
  5: { name: "Esperando", gate: "Portal dos Ritmos Fixos", description: "O Padrão Fixo é Sagrado" },
  6: { name: "Conflito", gate: "Portal da Fricção", description: "Sentir, Emocionar e Sensibilidade" },
  7: { name: "O Exército", gate: "Portal do Papel do Eu na Interação", description: "O Líder Eleito" },
  8: { name: "Mantendo Junto", gate: "Portal da Contribuição", description: "Liderar pelo Exemplo" },
  9: { name: "O Poder Domador do Pequeno", gate: "Portal do Foco", description: "Foco Empodera Todo o Processo" },
  10: { name: "Pisando", gate: "Portal do Comportamento do Eu", description: "O Amor de Si é Despertar" },
  11: { name: "Paz", gate: "Portal das Ideias", description: "Ideias são Estímulo para Reflexão" },
  12: { name: "Estagnação", gate: "Portal da Cautela", description: "Liberando Consciência no Espírito Correto" },
  13: { name: "Comunhão dos Homens", gate: "Portal do Ouvinte", description: "O Ouvidor de Segredos" },
  14: { name: "Possessão em Grande Medida", gate: "Portal das Habilidades de Poder", description: "Combustível para Empoderar" },
  15: { name: "Modéstia", gate: "Portal dos Extremos", description: "O Amor pela Humanidade" },
  16: { name: "Entusiasmo", gate: "Portal das Habilidades", description: "Habilidades para Viver - Vida como Arte" },
  17: { name: "Seguindo", gate: "Portal das Opiniões", description: "Fundamentado em Detalhes" },
  18: { name: "Trabalho sobre o Corrompido", gate: "Portal da Correção", description: "Aprendizado Essencial" },
  19: { name: "Aproximação", gate: "Portal do Querer", description: "Combustível para Necessidades Sociais" },
  20: { name: "Contemplação", gate: "Portal do Agora", description: "Eu Sou Agora" },
  21: { name: "Mordendo Através", gate: "Portal do Caçador/Caçadora", description: "Força de Vontade" },
  22: { name: "Graça", gate: "Portal da Abertura", description: "Compartilhando Espírito com Outros" },
  23: { name: "Separando", gate: "Portal da Assimilação", description: "Eliminação da Intolerância" },
  24: { name: "Retornando", gate: "Portal da Racionalização", description: "Inspiração Deve Ter Forma Racional" },
  25: { name: "Inocência", gate: "Portal do Espírito do Eu", description: "O Guerreiro Espiritual" },
  26: { name: "O Poder Domador do Grande", gate: "Portal do Egoísta", description: "Tolos são Mentirosos e Profetas Também" },
  27: { name: "Nutrição", gate: "Portal do Cuidar", description: "Cuidar de Si Primeiro" },
  28: { name: "Preponderância do Grande", gate: "Portal do Jogador", description: "O Desafio é a Própria Vida" },
  29: { name: "O Abismal", gate: "Portal do Dizer Sim", description: "Energia para Perseverar Apesar das Circunstâncias" },
  30: { name: "O Fogo que Adere", gate: "Portal do Reconhecimento dos Sentimentos", description: "Rendendo-se ao Destino" },
  31: { name: "Influência", gate: "Portal da Liderança", description: "Eu Lidero" },
  32: { name: "Duração", gate: "Portal da Continuidade", description: "Conservadorismo" },
  33: { name: "Retiro", gate: "Portal da Privacidade", description: "A Revelação de Segredos" },
  34: { name: "O Poder do Grande", gate: "Portal da Força", description: "Poder Puro Incondicional" },
  35: { name: "Progresso", gate: "Portal da Mudança", description: "O Segredo é 'Sem Expectativa'" },
  36: { name: "Escurecimento da Luz", gate: "Portal da Crise", description: "Esperar por Clareza Emocional" },
  37: { name: "A Família", gate: "Portal da Amizade", description: "Pronto para Abraçar o Estranho" },
  38: { name: "Oposição", gate: "Portal do Lutador", description: "Teimosia Pode Vencer as Probabilidades" },
  39: { name: "Obstrução", gate: "Portal do Provocador", description: "A Jornada é em Direção ao Espírito" },
  40: { name: "Libertação", gate: "Portal da Solidão", description: "O Poder da Vontade de Entregar" },
  41: { name: "Diminuição", gate: "Portal da Contração", description: "Paciência é a Grande Virtude" },
  42: { name: "Aumento", gate: "Portal do Crescimento", description: "O 'Graal' é a Experiência" },
  43: { name: "Rompimento", gate: "Portal do Insight", description: "Ouça Sua Própria Voz Interior" },
  44: { name: "Vindo ao Encontro", gate: "Portal da Vigilância", description: "O Gerente de Pessoal" },
  45: { name: "Reunindo", gate: "Portal do Coletor", description: "O Governante" },
  46: { name: "Empurrando para Cima", gate: "Portal da Determinação do Eu", description: "O Corpo é o Templo" },
  47: { name: "Opressão", gate: "Portal da Realização", description: "Esperar pelo Momento da Realização" },
  48: { name: "O Poço", gate: "Portal da Profundidade", description: "Um Recurso Disponível no Agora" },
  49: { name: "Revolução", gate: "Portal da Rejeição", description: "Potencialmente Consciente e Ritualmente Espiritual" },
  50: { name: "O Caldeirão", gate: "Portal dos Valores", description: "Guardando e Mantendo a Tribo" },
  51: { name: "O Despertar", gate: "Portal do Choque", description: "Despertar Empodera a Direção do Amor" },
  52: { name: "Mantendo Quieto", gate: "Portal da Inação", description: "Energia Focada e Canalizada" },
  53: { name: "Desenvolvimento", gate: "Portal dos Começos", description: "Transição e Mudança" },
  54: { name: "A Noiva Que Casa", gate: "Portal da Ambição", description: "O Impulso de Subir" },
  55: { name: "Abundância", gate: "Portal do Espírito", description: "A Qualidade do Espírito está no Agora Emocional" },
  56: { name: "O Viajante", gate: "Portal da Estimulação", description: "O Contador de Histórias" },
  57: { name: "O Gentil", gate: "Portal da Intuição", description: "Penetrar no Núcleo no Agora" },
  58: { name: "O Alegre", gate: "Portal da Vitalidade", description: "A Vitalidade para Desafiar" },
  59: { name: "Dispersão", gate: "Portal da Sexualidade", description: "Vínculo e Intimidade Além das Palavras" },
  60: { name: "Limitação", gate: "Portal da Aceitação", description: "A Pressão Pulsante para Mutar" },
  61: { name: "Verdade Interior", gate: "Portal do Mistério", description: "A Pressão Pulsante para Mutar" },
  62: { name: "Preponderância do Pequeno", gate: "Portal do Detalhe", description: "Manifestação Através do Detalhe" },
  63: { name: "Após a Conclusão", gate: "Portal da Dúvida", description: "Dúvida é uma Inspiração Essencial" },
  64: { name: "Antes da Conclusão", gate: "Portal da Confusão", description: "Atividade Mental Pressurizada" }
};

// Human Design Centers (Chakras)
export const CENTERS = {
  head: { name: "Cabeça", function: "Inspiração", type: "pressure", undefined: "Pensamentos aleatórios", defined: "Perguntas consistentes" },
  ajna: { name: "Ajna", function: "Conceituação", type: "awareness", undefined: "Mente aberta", defined: "Pensamento fixo" },
  throat: { name: "Garganta", function: "Manifestação/Comunicação", type: "motor", undefined: "Falar sem timing", defined: "Voz consistente" },
  g: { name: "G (Eu)", function: "Identidade/Direção", type: "identity", undefined: "Busca de identidade", defined: "Senso de direção" },
  heart: { name: "Coração", function: "Força de Vontade", type: "motor", undefined: "Sem compromisso fixo", defined: "Vontade consistente" },
  spleen: { name: "Baço", function: "Intuição/Imunidade", type: "awareness", undefined: "Segurar demais", defined: "Instinto confiável" },
  sacral: { name: "Sacral", function: "Energia Vital/Resposta", type: "motor", undefined: "Não sabe quando parar", defined: "Energia sustentável" },
  solar: { name: "Plexo Solar", function: "Emoções/Clareza", type: "awareness", undefined: "Amplifica emoções", defined: "Onda emocional" },
  root: { name: "Raiz", function: "Pressão/Adrenalina", type: "pressure", undefined: "Pressa/Estresse", defined: "Pressão sustentável" }
};

// Human Design Profiles
export const PROFILES = [
  { key: "1/3", name: "Investigador/Mártir", description: "Aprende através de investigação profunda e experimentação" },
  { key: "1/4", name: "Investigador/Oportunista", description: "Fundamenta conhecimento e compartilha com a rede" },
  { key: "2/4", name: "Ermitão/Oportunista", description: "Talento natural que emerge através de conexões" },
  { key: "2/5", name: "Ermitão/Herético", description: "Talento natural com impacto universal" },
  { key: "3/5", name: "Mártir/Herético", description: "Aprende por tentativa e erro, compartilha soluções práticas" },
  { key: "3/6", name: "Mártir/Modelo", description: "Experimenta vida até 30, depois se torna modelo" },
  { key: "4/6", name: "Oportunista/Modelo", description: "Rede de conexões, torna-se autoridade com tempo" },
  { key: "4/1", name: "Oportunista/Investigador", description: "Influência através de rede, fundamentada em pesquisa" },
  { key: "5/1", name: "Herético/Investigador", description: "Projeção universal fundamentada em expertise" },
  { key: "5/2", name: "Herético/Ermitão", description: "Chamado para resolver problemas, com talento natural" },
  { key: "6/2", name: "Modelo/Ermitão", description: "Torna-se autoridade sábia, com dons naturais" },
  { key: "6/3", name: "Modelo/Mártir", description: "Experimenta profundamente antes de se tornar modelo" }
];

// Human Design Channels (36 total)
export const CHANNELS = {
  "1-8": { name: "Inspiração", centers: ["g", "throat"], circuit: "individual" },
  "2-14": { name: "Pulso", centers: ["g", "sacral"], circuit: "individual" },
  "3-60": { name: "Mutação", centers: ["sacral", "root"], circuit: "individual" },
  "4-63": { name: "Lógica", centers: ["ajna", "head"], circuit: "collective" },
  "5-15": { name: "Ritmo", centers: ["g", "sacral"], circuit: "collective" },
  "6-59": { name: "Intimidade", centers: ["sacral", "solar"], circuit: "tribal" },
  "7-31": { name: "Alfa", centers: ["g", "throat"], circuit: "collective" },
  "9-52": { name: "Concentração", centers: ["root", "sacral"], circuit: "collective" },
  "10-20": { name: "Despertar", centers: ["g", "throat"], circuit: "individual" },
  "10-34": { name: "Exploração", centers: ["g", "sacral"], circuit: "individual" },
  "10-57": { name: "Forma Perfeita", centers: ["g", "spleen"], circuit: "individual" },
  "11-56": { name: "Curiosidade", centers: ["ajna", "throat"], circuit: "collective" },
  "12-22": { name: "Abertura", centers: ["throat", "solar"], circuit: "individual" },
  "13-33": { name: "Pródigo", centers: ["g", "throat"], circuit: "collective" },
  "16-48": { name: "Talento", centers: ["throat", "spleen"], circuit: "collective" },
  "17-62": { name: "Aceitação", centers: ["ajna", "throat"], circuit: "collective" },
  "18-58": { name: "Julgamento", centers: ["spleen", "root"], circuit: "collective" },
  "19-49": { name: "Síntese", centers: ["root", "solar"], circuit: "tribal" },
  "20-34": { name: "Carisma", centers: ["throat", "sacral"], circuit: "individual" },
  "20-57": { name: "Onda Cerebral", centers: ["throat", "spleen"], circuit: "individual" },
  "21-45": { name: "Dinheiro", centers: ["throat", "heart"], circuit: "tribal" },
  "23-43": { name: "Estruturação", centers: ["ajna", "throat"], circuit: "individual" },
  "24-61": { name: "Consciência", centers: ["ajna", "head"], circuit: "individual" },
  "25-51": { name: "Iniciação", centers: ["g", "heart"], circuit: "individual" },
  "26-44": { name: "Rendição", centers: ["heart", "spleen"], circuit: "tribal" },
  "27-50": { name: "Preservação", centers: ["sacral", "spleen"], circuit: "tribal" },
  "28-38": { name: "Luta", centers: ["spleen", "root"], circuit: "individual" },
  "29-46": { name: "Descoberta", centers: ["sacral", "g"], circuit: "collective" },
  "30-41": { name: "Reconhecimento", centers: ["solar", "root"], circuit: "collective" },
  "32-54": { name: "Transformação", centers: ["spleen", "root"], circuit: "tribal" },
  "34-57": { name: "Poder", centers: ["sacral", "spleen"], circuit: "individual" },
  "35-36": { name: "Transitoriedade", centers: ["throat", "solar"], circuit: "collective" },
  "37-40": { name: "Comunidade", centers: ["solar", "heart"], circuit: "tribal" },
  "39-55": { name: "Emotividade", centers: ["root", "solar"], circuit: "individual" },
  "42-53": { name: "Maturação", centers: ["sacral", "root"], circuit: "collective" },
  "47-64": { name: "Abstração", centers: ["ajna", "head"], circuit: "collective" }
};

// Calculate Zodiac Sign from birth date
export function calculateZodiacSign(birthDate) {
  const date = new Date(birthDate);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'aries';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'taurus';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'gemini';
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'cancer';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'leo';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'virgo';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'libra';
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'scorpio';
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'sagittarius';
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'capricorn';
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'aquarius';
  return 'pisces';
}

// Get gate information
export function getGateInfo(gateNumber) {
  return GATE_NAMES[gateNumber] || null;
}

// Get profile information
export function getProfileInfo(profileKey) {
  return PROFILES.find(p => p.key === profileKey) || null;
}
