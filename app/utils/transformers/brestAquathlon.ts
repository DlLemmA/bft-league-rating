import { timeToSeconds } from './shared'
import type { EventResult } from './shared'

// п/п,Фамилия Имя,Команда,Г.р.,Номер,Плав,Т1,Бег,Время,Место,Прим.

// Transformer for brestAquathlon format (Aquathlon: Swim + Run)
export default function transformBrestAquathlon(data: any[]): EventResult[] {
  return data.map((row, index) => ({
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
