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

export interface RatingStatistics {
  total: number
  men: number
  women: number
  competitions: number
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

export interface RatingRow {
  place: number
  trend: number
  license: License
  placeAG?: number
  eventsPoints: EventPoints[]
  totalPoints: number
  theBestTrend: boolean
}
