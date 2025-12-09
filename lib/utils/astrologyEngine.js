
export const ZODIAC_SIGNS = [
  { sign: 'Aquarius', startMonth: 1, startDay: 20, endMonth: 2, endDay: 18, element: 'Air', modality: 'Fixed' },
  { sign: 'Pisces', startMonth: 2, startDay: 19, endMonth: 3, endDay: 20, element: 'Water', modality: 'Mutable' },
  { sign: 'Aries', startMonth: 3, startDay: 21, endMonth: 4, endDay: 19, element: 'Fire', modality: 'Cardinal' },
  { sign: 'Taurus', startMonth: 4, startDay: 20, endMonth: 5, endDay: 20, element: 'Earth', modality: 'Fixed' },
  { sign: 'Gemini', startMonth: 5, startDay: 21, endMonth: 6, endDay: 20, element: 'Air', modality: 'Mutable' },
  { sign: 'Cancer', startMonth: 6, startDay: 21, endMonth: 7, endDay: 22, element: 'Water', modality: 'Cardinal' },
  { sign: 'Leo', startMonth: 7, startDay: 23, endMonth: 8, endDay: 22, element: 'Fire', modality: 'Fixed' },
  { sign: 'Virgo', startMonth: 8, startDay: 23, endMonth: 9, endDay: 22, element: 'Earth', modality: 'Mutable' },
  { sign: 'Libra', startMonth: 9, startDay: 23, endMonth: 10, endDay: 22, element: 'Air', modality: 'Cardinal' },
  { sign: 'Scorpio', startMonth: 10, startDay: 23, endMonth: 11, endDay: 21, element: 'Water', modality: 'Fixed' },
  { sign: 'Sagittarius', startMonth: 11, startDay: 22, endMonth: 12, endDay: 21, element: 'Fire', modality: 'Mutable' },
  { sign: 'Capricorn', startMonth: 12, startDay: 22, endMonth: 1, endDay: 19, element: 'Earth', modality: 'Cardinal' }
];

export function getZodiacSign(dateString) {
  if (!dateString) return null;
  const date = new Date(dateString);
  const month = date.getUTCMonth() + 1; // 1-12
  const day = date.getUTCDate();

  // Find sign
  const found = ZODIAC_SIGNS.find(z => {
    if (z.sign === 'Capricorn') {
        return (month === 12 && day >= 22) || (month === 1 && day <= 19);
    }
    return (month === z.startMonth && day >= z.startDay) || (month === z.endMonth && day <= z.endDay);
  });

  return found || null;
}
