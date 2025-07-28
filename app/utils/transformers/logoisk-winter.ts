import { timeToSeconds } from './shared'
import type { EventResult } from './shared'

export default function transformLogoiskWinter(data: unknown[]): EventResult[] {
  return data.map(row => ({
    nickname: row['Фамилия Имя'],
    club: row['Команда'],
    birthYear: row['Г.р.'] ? parseInt(row['Г.р.']) : undefined,
    number: row['Номер'],
    stages: [
      { type: 'run' as const, time: row['Бег'], label: 'Бег' },
      { type: 'bike' as const, time: row['Вело'], label: 'Велосипед' },
      { type: 'ski' as const, time: row['Лыжи'], label: 'Лыжи' },
    ].filter(stage => stage.time),
    totalTime: row['Время'],
    totalTimeSeconds: timeToSeconds(row['Время']),
    rawFields: row,
  }))
}
