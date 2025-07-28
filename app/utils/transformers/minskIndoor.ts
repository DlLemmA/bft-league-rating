import { timeToSeconds } from './shared'
import type { EventResult } from './shared'

export default function transformMinskIndoor(data: unknown[]): EventResult[] {
  return data.map(row => ({
    nickname: row['ФИО'],
    number: row['Номер'],
    ageGroup: row['ПВК'],
    stages: [
      { type: 'swim' as const, time: row['Время плавания'], label: 'Плавание' },
      { type: 'bike' as const, time: row['Время вело'], label: 'Велосипед' },
      { type: 'run' as const, time: row['Время бега'], label: 'Бег' },
    ].filter(stage => stage.time),
    totalTime: row['Итоговое время'],
    totalTimeSeconds: timeToSeconds(row['Итоговое время']),
    rawFields: row,
  }))
}
