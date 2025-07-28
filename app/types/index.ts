export interface CompetitionResult {
  competition: string
  competitionTitle: string
  points: number
  category: EventCategory
}

export interface License {
  id: string
  fioRussian: string
  fioEnglish: string
  birthDate?: string
  club?: string
  gender: string
  ageGroup?: string
  ageGroupPlace?: number
  genderPlace?: number
  absolutePlace?: number
  previousAgeGroupPlace?: number
  previousGenderPlace?: number
  previousAbsolutePlace?: number
  competitions?: CompetitionResult[]
  totalPoints?: number
}

export interface EventResult {
  nickname: string
  totalTimeSeconds: number
  totalTime: string
  place?: number
  absolutePlace?: number
  genderAbsolutePlace?: number
  gender?: 'male' | 'female'
  club?: string
  birthYear?: number
  ageGroup?: string
  license?: License | null
  hasLicense?: boolean
  points?: number
  stages?: Array<{
    type: string
    time: string
    timeSeconds: number
  }>
}

export enum EventCategory {
  Sprint = 'Sprint',
  Olympic = 'Olympic',
  Duathlon = 'Duathlon',
  Kross = 'Kross',
  HalfIronman = 'HalfIronman',
  Ironman = 'Ironman',
  WinterDuathlon = 'WinterDuathlon',
}

export interface EventPoints {
  eventName: string
  eventCategory: EventCategory
  points?: number
}
