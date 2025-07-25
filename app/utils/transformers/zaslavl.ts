import { timeToSeconds } from './shared'
import type { EventResult } from './shared'

// Transformer for zaslavl format (Multitriathlon with generic stages)
export default function transformZaslavl(data: any[]): EventResult[] {
  return data.map(row => ({
    nickname: row['Участник'],
    club: row['Команда'],
    number: row['BIB'],
    stages: [
      { type: 'stage1' as const, time: row['Этап 1'], label: 'Этап 1' },
      { type: 'stage2' as const, time: row['Этап 2'], label: 'Этап 2' },
      { type: 'stage3' as const, time: row['Этап 3'], label: 'Этап 3' },
    ].filter(stage => stage.time),
    totalTime: row['Итоговое время'],
    totalTimeSeconds: timeToSeconds(row['Итоговое время']),
    rawFields: row,
  }))
}
