import { timeToSeconds } from './shared'
import type { EventResult } from './shared'

export default function transformAthlinks(data: unknown[]): EventResult[] {
  return data.map(row => ({
    nickname: row['Участник'],
    club: row['Команда'].split(',')[0].trim(),
    ageGroup: row['Группа'],
    number: row['BIB'],
    stages: [
      { type: 'swim' as const, time: row['Плавание'] },
      { type: 'transition1' as const, time: row['T1'] },
      { type: 'bike' as const, time: row['Вело'] },
      { type: 'transition2' as const, time: row['T2'] },
      { type: 'run' as const, time: row['Бег'] },
    ].filter(stage => stage.time),
    totalTime: row['Результат'],
    totalTimeSeconds: timeToSeconds(row['Результат']),
    rawFields: row,
  }))
}
