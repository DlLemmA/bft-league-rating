import { timeToSeconds } from './shared'
import type { EventResult } from './shared'

export default function transformBrestAquathlon(data: unknown[]): EventResult[] {
  return data.map(row => ({
    nickname: row['Фамилия Имя'],
    club: row['Команда'],
    birthYear: row['Год рождения'] ? parseInt(row['Год рождения']) : undefined,
    number: row['Номер'] || undefined,
    stages: [
      { type: 'swim' as const, time: row['Плав'], label: 'Плавание' },
      { type: 'transition' as const, time: row['T1'], label: 'Переход' },
      { type: 'run' as const, time: row['Бег'], label: 'Бег' },
    ].filter(stage => stage.time),
    totalTime: row['Время'],
    totalTimeSeconds: timeToSeconds(row['Время']),
    rawFields: row,
  }))
}
