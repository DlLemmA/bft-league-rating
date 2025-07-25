import { timeToSeconds } from './shared'
import type { EventResult } from './shared'

export default function transformObelarus(data: any[]): EventResult[] {
  return data.map(row => ({
    nickname: row['Фамилия Имя'],
    club: row['Команда'],
    birthYear: row['Г.р.'] ? parseInt(row['Г.р.']) : undefined,
    number: row['Номер'] || undefined,
    stages: [
      { type: 'swim' as const, time: row['Плав'] },
      { type: 'transition1' as const, time: row['Т1'] },
      { type: 'bike' as const, time: row['Вело'] },
      { type: 'transition2' as const, time: row['Т1'] },
      { type: 'run' as const, time: row['Бег'] },
    ].filter(stage => stage.time),
    totalTime: row['Время'],
    totalTimeSeconds: timeToSeconds(row['Время']),
    rawFields: row,
  }))
}
