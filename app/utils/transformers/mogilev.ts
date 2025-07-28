import { timeToSeconds } from './shared'
import type { EventResult } from './shared'

export default function transformMogilev(data: unknown[]): EventResult[] {
  return data.map(row => ({
    number: row['Номер'],
    nickname: row['ИМЯ ФАМИЛИЯ'],
    club: row['КОМАНДА']?.split(',')[0]?.trim() || row['КОМАНДА']?.split(',')?.[1]?.trim(),
    ageGroup: row['ГРУППА'],
    birthYear: row['Год рождения'] ? parseInt(row['Год рождения']) : undefined,
    stages: [
      { type: 'swim' as const, time: row['Swim'], label: 'Плавание' },
      { type: 'transition1' as const, time: row['T1'], label: 'Переход 1' },
      { type: 'bike' as const, time: row['Bike'], label: 'Велосипед' },
      { type: 'transition2' as const, time: row['T2'], label: 'Переход 2' },
      { type: 'run' as const, time: row['Run'], label: 'Бег' },
    ].filter(stage => stage.time),
    totalTime: row['РЕЗУЛЬТАТ'] || '',
    totalTimeSeconds: timeToSeconds(row['РЕЗУЛЬТАТ']),
    rawFields: row,
  }))
}
