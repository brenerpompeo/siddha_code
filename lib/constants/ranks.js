export const RANKS = [
  { rank: 'iniciado', xp_min: 0, title: 'Recruta', color: '#a1a1aa' },
  { rank: 'buscador', xp_min: 500, title: 'Soldado', color: '#71717a' },
  { rank: 'praticante', xp_min: 1500, title: 'Cabo', color: '#52525b' },
  { rank: 'adepto', xp_min: 3500, title: 'Sargento', color: '#3b82f6' },
  { rank: 'guardiao', xp_min: 7000, title: 'Tenente', color: '#2563eb' },
  { rank: 'mistico', xp_min: 12000, title: 'Capitão', color: '#8b5cf6' },
  { rank: 'alquimista', xp_min: 20000, title: 'Major', color: '#7c3aed' },
  { rank: 'oraculo', xp_min: 32000, title: 'Coronel', color: '#a78bfa' },
  { rank: 'mestre_do_tempo', xp_min: 50000, title: 'General', color: '#0ea5e9' },
  { rank: 'marechal_siddha', xp_min: 75000, title: 'Marechal', color: '#06b6d4' }
];

export const getRankByXp = (xp) => {
  let currentRank = RANKS[0];
  for (const rank of RANKS) {
    if (xp >= rank.xp_min) {
      currentRank = rank;
    } else {
      break;
    }
  }
  return currentRank;
};

export const getNextRank = (xp) => {
  const currentRank = getRankByXp(xp);
  const currentIndex = RANKS.findIndex(r => r.rank === currentRank.rank);
  if (currentIndex < RANKS.length - 1) {
    return RANKS[currentIndex + 1];
  }
  return null;
};

export const getRankProgress = (xp) => {
  const currentRank = getRankByXp(xp);
  const nextRank = getNextRank(xp);
  
  if (!nextRank) return 100;
  
  const xpInCurrentRank = xp - currentRank.xp_min;
  const xpNeededForNext = nextRank.xp_min - currentRank.xp_min;
  
  return Math.min(100, (xpInCurrentRank / xpNeededForNext) * 100);
};