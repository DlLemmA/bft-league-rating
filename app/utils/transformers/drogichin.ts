import { timeToSeconds } from './shared'
import type { EventResult } from './shared'

export default function transformDrogichin(data: any[]): EventResult[] {
  return data.map(row => ({
    nickname: row['ИМЯ ФАМИЛИЯ'],
    stages: [],
    totalTime: row['РЕЗУЛЬТАТ'],
    totalTimeSeconds: timeToSeconds(row['РЕЗУЛЬТАТ']),
    rawFields: row,
  }))
}
