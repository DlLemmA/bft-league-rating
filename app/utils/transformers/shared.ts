import type { License } from './license'
import type { NameMapping } from './nameMapping'

// Supported discipline types for different race formats
export type DisciplineType = 'swim' | 'run' | 'bike' | 'transition1' | 'transition2' | 'ski' | 'stage1' | 'stage2' | 'stage3'

export type RaceStage = {
  type: DisciplineType
  time: string
  label?: string // Human-readable label for the stage
  durationSeconds?: number // Duration in seconds for calculations
}

export type EventResult = {
  nickname: string
  club?: string
  number?: string
  birthYear?: number
  stages: RaceStage[]
  totalTime: string
  totalTimeSeconds: number
  rawFields: unknown
  hasLicense?: boolean
  license?: License
  place?: number
  points?: number
}

/**
 * Convert time strings to seconds for easier comparison
 * Handles multiple time formats:
 * - HH:MM:SS.mmm (hours, minutes, seconds, milliseconds)
 * - HH:MM:SS (hours, minutes, seconds)
 * - MM:SS.mmm (minutes, seconds, milliseconds)
 * - MM:SS (minutes, seconds)
 */
export const timeToSeconds = (timeStr?: string): number | null => {
  if (!timeStr) return null
  try {
    const parts = timeStr.split(':')

    if (parts.length === 3) {
      // Format: HH:MM:SS or HH:MM:SS.mmm
      const hours = parseInt(parts[0] || '0')
      const minutes = parseInt(parts[1] || '0')
      const secondsPart = parts[2] || '0'

      if (secondsPart.includes('.')) {
        const [seconds, millisStr] = secondsPart.split('.')
        const millis = millisStr.length === 1
          ? parseInt(millisStr) * 100
          : millisStr.length === 2
            ? parseInt(millisStr) * 10
            : parseInt(millisStr)
        return hours * 3600 + minutes * 60 + parseInt(seconds) + millis / 1000
      }
      else {
        return hours * 3600 + minutes * 60 + parseFloat(secondsPart)
      }
    }
    else if (parts.length === 2) {
      // Format: MM:SS or MM:SS.mmm
      const minutes = parseInt(parts[0] || '0')
      const secondsPart = parts[1] || '0'

      if (secondsPart.includes('.')) {
        const [seconds, millisStr] = secondsPart.split('.')
        const millis = millisStr.length === 1
          ? parseInt(millisStr) * 100
          : millisStr.length === 2
            ? parseInt(millisStr) * 10
            : parseInt(millisStr)
        return minutes * 60 + parseInt(seconds) + millis / 1000
      }
      else {
        return minutes * 60 + parseFloat(secondsPart)
      }
    }
    return parseFloat(timeStr)
  }
  catch (e) {
    console.error(`Error parsing time: ${timeStr}`, e)
    return null
  }
}

/**
 * Format seconds to a time string (HH:MM:SS.mmm)
 */
export const secondsToTime = (seconds: number): string => {
  if (seconds === null || isNaN(seconds)) return ''

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toFixed(3).padStart(6, '0')}`
  }
  else {
    return `${minutes.toString().padStart(2, '0')}:${secs.toFixed(3).padStart(6, '0')}`
  }
}

// Find stage time by type
export const findStageTime = (stages: RaceStage[], type: string): string | undefined => {
  return stages?.find(stage => stage.type === type)?.time
}

// Add calculated fields to participants
export const addCalculatedFields = (participants: EventResult[]): EventResult[] => {
  return participants.map(participant => ({
    ...participant,
    totalTimeSeconds: timeToSeconds(participant.totalTime),
    stages: participant.stages.map(stage => ({
      ...stage,
      durationSeconds: timeToSeconds(stage.time) || 0,
    })),
  }))
}

/**
 * Calculate points based on the Scala algorithm
 * Points = basePoints * max(1 - (athleteTime - championTime) / (0.8 * championTime), 0)
 */
export const calculatePoints = (
  athleteTimeSeconds: number | undefined | null,
  championTimeSeconds: number | undefined | null,
  basePoints: number = 700,
): number => {
  if (!athleteTimeSeconds || !championTimeSeconds || championTimeSeconds === 0) {
    return 0
  }

  const points = basePoints * Math.max(
    1 - (athleteTimeSeconds - championTimeSeconds) / (0.8 * championTimeSeconds),
    0,
  )

  // Round to 2 decimal places
  return Math.round(points * 100) / 100
}

/**
 * Format trend value for display
 * Positive trend (improvement): ▲N
 * Negative trend (decline): ▼N
 * No change: −0
 */
export const formatTrend = (trend: number | undefined): string => {
  if (trend === undefined) return '−0'
  if (trend < 0) return `▲${-trend}` // Negative trend value means position improved (moved up)
  if (trend > 0) return `▼${trend}` // Positive trend value means position declined (moved down)
  return '−0' // No change
}

/**
 * Enhanced license matching algorithm based on the Scala implementation
 * Tries multiple matching strategies:
 * 1. Match by Russian name (first name + last name)
 * 2. Match by full Russian name
 * 3. Match by English name
 * 4. Match by nickname mapping
 */
export const findMatchingLicense = (
  result: EventResult,
  licenses: License[],
  nameMapping?: NameMapping[],
): License | undefined | null => {
  if (!licenses || licenses.length === 0) {
    return null
  }

  const resultName = result.nickname?.toLowerCase().trim() || ''
  if (!resultName) return null

  // Strategy 1: Match by Russian name (first name + last name)
  const byRussianName = licenses.filter((license) => {
    const fullName = license.fioRussian?.toLowerCase().trim() || ''
    if (!fullName) return false

    const nameParts = fullName.split(' ').filter(Boolean).slice(0, 2)
    if (nameParts.length < 2) return false

    const [lastName, firstName] = nameParts
    return `${lastName} ${firstName}` === resultName || `${firstName} ${lastName}` === resultName
  })

  if (byRussianName.length === 1) {
    return byRussianName[0]
  }

  // Strategy 2: Match by full Russian name
  const byFullRussianName = licenses.filter((license) => {
    const fullName = license.fioRussian?.toLowerCase().trim() || ''
    return fullName === resultName
  })

  if (byFullRussianName.length === 1) {
    return byFullRussianName[0]
  }

  // Strategy 3: Match by English name
  const byEnglishName = licenses.filter((license) => {
    const fullName = license.fioEnglish?.toLowerCase().trim() || ''
    if (!fullName) return false

    const nameParts = fullName.split(' ').filter(Boolean).slice(0, 2)
    if (nameParts.length < 2) return false

    const [lastName, firstName] = nameParts
    return `${lastName} ${firstName}` === resultName || `${firstName} ${lastName}` === resultName
  })

  if (byEnglishName.length === 1) {
    return byEnglishName[0]
  }

  // Strategy 4: Match by nickname mapping
  if (nameMapping) {
    const matchedFioRussian = nameMapping.find(({ alternatives }) =>
      Array.isArray(alternatives) && alternatives.some(nick =>
        nick.toLowerCase().trim() === resultName,
      ),
    )?.name

    if (matchedFioRussian) {
      const byNickname = licenses.filter(license =>
        license.fioRussian?.toLowerCase().trim() === matchedFioRussian.toLowerCase().trim(),
      )

      if (byNickname.length === 1) {
        return byNickname[0]
      }
    }
  }

  return null

  // Fallback: Fuzzy matching (partial match)
  // const byPartialMatch = licenses.find(license => {
  //   const russianName = license.fioRussian?.toLowerCase().trim() || ''
  //   const englishName = license.fioEnglish?.toLowerCase().trim() || ''

  //   return russianName.includes(resultName) ||
  //          resultName.includes(russianName) ||
  //          englishName.includes(resultName) ||
  //          resultName.includes(englishName) ||
  //          russianName.split(' ').some(part => resultName.includes(part)) ||
  //          englishName.split(' ').some(part => resultName.includes(part))
  // })

  // return byPartialMatch || null
}
