import type { EventResult } from './shared'
import { addCalculatedFields } from './shared'

// Transformer for obelarus2 format (Classic Triathlon)
export default function transformObelarus2(data: any[]): EventResult[] {
  const participants = data.map((row, index) => ({
    nickname: row['Фамилия Имя'] || '',
    team: row['Команда'] || undefined,
    birthYear: row['Г.р.'] ? parseInt(row['Г.р.']) : undefined,
    number: row['Номер'] || undefined,
    stages: [
      { type: 'swim' as const, time: row['Вода'], label: 'Плавание' },
      { type: 'transition1' as const, time: row['Т1'], label: 'Переход 1' },
      { type: 'bike' as const, time: row['Вело'], label: 'Велосипед' },
      { type: 'transition2' as const, time: row['Т2'], label: 'Переход 2' },
      { type: 'run' as const, time: row['Бег'], label: 'Бег' },
    ].filter(stage => stage.time), // Remove stages without time
    totalTime: row['Результат'] || '',
    place: parseInt(row['Место']) || index + 1,
    rawFields: row,
  }))

  return addCalculatedFields(participants)
}
