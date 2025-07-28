import type { EventResult } from './shared'
import { timeToSeconds } from './shared'

export default function transformObelarus2(data: unknown[]): EventResult[] {
  return data.map(row => ({
    nickname: row['Фамилия Имя'],
    team: row['Команда'] || undefined,
    birthYear: row['Г.р.'] ? parseInt(row['Г.р.']) : undefined,
    number: row['Номер'],
    stages: [
      { type: 'swim' as const, time: row['Вода'], label: 'Плавание' },
      { type: 'transition1' as const, time: row['Т1'], label: 'Переход 1' },
      { type: 'bike' as const, time: row['Вело'], label: 'Велосипед' },
      { type: 'transition2' as const, time: row['Т2'], label: 'Переход 2' },
      { type: 'run' as const, time: row['Бег'], label: 'Бег' },
    ].filter(stage => stage.time),
    totalTime: row['Результат'],
    totalTimeSeconds: timeToSeconds(row['Результат']),
    rawFields: row,
  }))
}
