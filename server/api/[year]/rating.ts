import transformLicense from '~/utils/transformers/license'
import transformNameMapping from '~/utils/transformers/nameMapping'
import { findMatchingLicense, calculatePoints } from '~/utils/transformers/shared'
import { transformerMap } from '~/utils/transformers'
import type { CompetitionsCollectionItem } from '@nuxt/content'
import { EventCategory } from '~/types'
import type { EventResult, License, EventPoints, RatingRow } from '~/types'

/**
 * Calculate total points based on the Scala algorithm
 * See p.14.8 of https://triatlon.by/assets/images/files/2025/polozhenie-lyubitelskaya-liga-triatlona-2025.pdf
 */
function calculateTotalPoints(eventsPoints: EventPoints[]): number {
  const otherCount = 4 // 14 * 0.6 = 8.4 (rounded to 8) - 4 = 4

  // Find best result for each category
  const bestSprint = eventsPoints
    .filter(ep => ep.eventCategory === EventCategory.Sprint)
    .sort((a, b) => (b.points || 0) - (a.points || 0))[0]

  const bestOlympic = eventsPoints
    .filter(ep => ep.eventCategory === EventCategory.Olympic)
    .sort((a, b) => (b.points || 0) - (a.points || 0))[0]

  const bestDuathlon = eventsPoints
    .filter(ep => ep.eventCategory === EventCategory.Duathlon)
    .sort((a, b) => (b.points || 0) - (a.points || 0))[0]

  const bestKross = eventsPoints
    .filter(ep => ep.eventCategory === EventCategory.Kross)
    .sort((a, b) => (b.points || 0) - (a.points || 0))[0]

  // Collect events taken with priority
  const takenWithPriority = [bestSprint, bestOlympic, bestDuathlon, bestKross]
    .filter(Boolean)
    .map(ep => ({ eventName: ep.eventName, points: ep.points }))

  // Get other events not already taken
  const other = eventsPoints
    .filter(ep => !takenWithPriority.some(t =>
      t.eventName === ep.eventName && t.points === ep.points,
    ))
    .sort((a, b) => (b.points || 0) - (a.points || 0))
    .slice(0, otherCount)

  // Sum up all points
  const bestSprintPoints = bestSprint?.points || 0
  const bestOlympicPoints = bestOlympic?.points || 0
  const bestDuathlonPoints = bestDuathlon?.points || 0
  const bestKrossPoints = bestKross?.points || 0
  const otherPoints = other.reduce((sum, ep) => sum + (ep.points || 0), 0)

  return bestSprintPoints + bestOlympicPoints + bestDuathlonPoints + bestKrossPoints + otherPoints
}

const applyTransformer = (rawResults: any[], competition: CompetitionsCollectionItem): EventResult[] => {
  const transformer = transformerMap[competition.readerType as keyof typeof transformerMap]

  if (!transformer) {
    throw createError({
      statusCode: 400,
      message: `Can't transform results with unknown ${JSON.stringify(competition)} ${competition.readerType}`,
    })
  }

  return transformer(rawResults)
}

export default defineEventHandler(async (event: any) => {
  const { year } = getRouterParams(event)

  if (!year) {
    throw createError({
      statusCode: 400,
      message: 'Year parameter is required',
    })
  }

  const [licensesData, nameMappingData, competitionsData, resultsData, competitionPointsData] = await Promise.all([
    queryCollection(event, 'licenses').where('stem', 'LIKE', `${year}%`).first(),
    queryCollection(event, 'nameMapping').where('stem', 'LIKE', `${year}%`).first(),
    queryCollection(event, 'competitions').where('stem', 'LIKE', `${year}%`).all(),
    queryCollection(event, 'results').where('stem', 'LIKE', `${year}%`).all(),
    queryCollection(event, 'competitionPoints').where('stem', 'LIKE', `${year}%`).first(),
  ])

  if (!licensesData) {
    throw createError({
      statusCode: 404,
      message: `No licenses found for year ${year}`,
    })
  }

  // Transform licenses and name mapping
  const licenses = licensesData.body.map(transformLicense).filter(license => license.id.startsWith('AG')) || []
  const nameMapping = nameMappingData?.body.map(transformNameMapping) || []

  const competitions = competitionsData.map((competitionData) => {
    if (Array.isArray(competitionData.events) && competitionData.events.length > 0) {
      const enrichedEvents = competitionData.events.map((event) => {
        const eventSlug = `${competitionData.slug}-${event.slug}`
        const eventResults = resultsData.filter((resultData) => {
          return resultData.stem.includes(eventSlug)
        }).flatMap((resultData) => {
          const results = applyTransformer(resultData.body, competitionData)
          const resultsWithLicenses = results.map((result) => {
            const license = findMatchingLicense(result, licenses, nameMapping)
            return {
              ...result,
              license,
              hasLicense: !!license,
            }
          })
          const sortedResultsWithLicenses = resultsWithLicenses.sort((resultA, resultB) => resultA.totalTimeSeconds - resultB.totalTimeSeconds)
          const licensedChampion = sortedResultsWithLicenses.find(result => result.hasLicense)
          return sortedResultsWithLicenses.map((result, index) => ({
            ...result,
            gender: resultData.stem.includes('women') ? 'female' : 'male',
            genderAbsolutePlace: index + 1,
            points: result.hasLicense ? calculatePoints(result.totalTimeSeconds, licensedChampion!.totalTimeSeconds, competitionPointsData.body.categories[event.category].basePoints) : undefined,
          }))
        }).sort((resultA, resultB) => resultA.totalTimeSeconds - resultB.totalTimeSeconds).map((result, index) => ({
          ...result,
          absolutePlace: index + 1,
        }))

        const participantsAmount = eventResults.length
        const licensedAmount = eventResults.filter(result => result.hasLicense).length
        const unlicensedAmount = participantsAmount - licensedAmount
        const maleParticipantsAmount = eventResults.filter(result => result.gender === 'male').length
        const femaleParticipantsAmount = participantsAmount - maleParticipantsAmount

        return {
          ...event,
          results: eventResults,
          hasResults: !!eventResults.length,
          statistics: {
            total: participantsAmount,
            men: maleParticipantsAmount,
            women: femaleParticipantsAmount,
            licensed: licensedAmount,
            unlicensed: unlicensedAmount,
          },
        }
      })

      return {
        ...competitionData,
        events: enrichedEvents,
        hasResults: enrichedEvents.some(event => event.hasResults),
        statistics: enrichedEvents.reduce((statistics, eventInfo) => {
          statistics.total += eventInfo.statistics.total
          statistics.men += eventInfo.statistics.men
          statistics.women += eventInfo.statistics.women
          statistics.licensed += eventInfo.statistics.licensed
          statistics.unlicensed += eventInfo.statistics.unlicensed
          return statistics
        },
        {
          total: 0,
          men: 0,
          women: 0,
          licensed: 0,
          unlicensed: 0,
        }),
      }
    }

    // For single event competitions, process results
    const eventResults = resultsData.filter(resultData => resultData.stem.includes(competitionData.slug)).flatMap((resultData) => {
      const results = applyTransformer(resultData.body, competitionData)
      const resultsWithLicenses = results.map((result) => {
        const license = findMatchingLicense(result, licenses, nameMapping)
        return {
          ...result,
          license,
          hasLicense: !!license,
        }
      })
      const sortedResultsWithLicenses = resultsWithLicenses.sort((resultA, resultB) => resultA.totalTimeSeconds - resultB.totalTimeSeconds)
      const licensedChampion = sortedResultsWithLicenses.find(result => !!result.license)
      return sortedResultsWithLicenses.map((result, index) => ({
        ...result,
        gender: resultData.stem.includes('women') ? 'female' : 'male',
        genderAbsolutePlace: index + 1,
        points: result.hasLicense ? calculatePoints(result.totalTimeSeconds, licensedChampion!.totalTimeSeconds, competitionPointsData.body.categories[competitionData.category].basePoints) : undefined,
      }))
    }).sort((resultA, resultB) => resultA.totalTimeSeconds - resultB.totalTimeSeconds).map((result, index) => ({
      ...result,
      absolutePlace: index + 1,
    }))

    const participantsAmount = eventResults.length
    const licensedAmount = eventResults.filter(result => result.hasLicense).length
    const unlicensedAmount = participantsAmount - licensedAmount
    const maleParticipantsAmount = eventResults.filter(result => result.gender === 'male').length
    const femaleParticipantsAmount = participantsAmount - maleParticipantsAmount

    return {
      ...competitionData,
      results: eventResults,
      hasResults: !!eventResults.length,
      statistics: {
        total: participantsAmount,
        men: maleParticipantsAmount,
        women: femaleParticipantsAmount,
        licensed: licensedAmount,
        unlicensed: unlicensedAmount,
      },
    }
  })

  const licensesWithPoints = licenses.map((license: License) => {
    // Initialize competitions array and totalPoints if they don't exist
    if (!license.competitions) license.competitions = []

    // Collect all event points for this license
    const eventsPoints: EventPoints[] = []

    competitions.forEach((competition) => {
      if (Array.isArray(competition.events)) {
        competition.events.forEach((event: any) => {
          const eventSlug = `${competition.slug}-${event.slug}`
          const eventTitle = `${competition.title} - ${event.title}`
          const relatedResult = event.results.find((result: any) => result.license === license)
          const resultPoints = relatedResult?.points ?? 0

          if (resultPoints > 0) {
            license.competitions!.push({
              competition: eventSlug,
              competitionTitle: eventTitle,
              points: resultPoints,
              category: event.category as EventCategory,
            })

            eventsPoints.push({
              eventName: eventSlug,
              eventCategory: event.category as EventCategory,
              points: resultPoints,
            })
          }
        })
      }
      else if (competition.results) {
        const relatedResult = competition.results.find((result: any) => result.license === license)
        const resultPoints = relatedResult?.points ?? 0

        if (resultPoints > 0) {
          license.competitions!.push({
            competition: competition.slug,
            competitionTitle: competition.title,
            points: resultPoints,
            category: competition.category as EventCategory,
          })

          eventsPoints.push({
            eventName: competition.slug,
            eventCategory: competition.category as EventCategory,
            points: resultPoints,
          })
        }
      }
    })

    // Calculate total points using the Scala algorithm
    const calculatedPoints = calculateTotalPoints(eventsPoints)
    // Fix floating point precision issues but keep 2 decimal places
    license.totalPoints = Number(calculatedPoints.toFixed(2))

    return license
  })

  // Sort licenses by total points
  const sortedLicenses = licensesWithPoints.sort((licenseA, licenseB) => (licenseB.totalPoints || 0) - (licenseA.totalPoints || 0))

  // Calculate places for athletes (absolute, gender, and age group)
  return calculatePlaces(sortedLicenses, competitions)
})

/**
 * Calculate places for athletes (absolute, gender, and age group)
 * Top 3 athletes in each gender category are excluded from age group rankings
 */
function calculatePlaces(athletes: License[], competitions: any[]): License[] {
  if (!athletes || athletes.length === 0) return []

  // Sort competitions by end date to determine the latest competition
  const sortedCompetitions = competitions
    .filter(comp => comp.hasResults && comp.endDate)
    .sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime())

  if (sortedCompetitions.length === 0) {
    // No competitions with results, just assign current places
    return assignCurrentPlaces(athletes)
  }

  // Get the latest competition
  const latestCompetition = sortedCompetitions[0]
  const previousCompetitions = sortedCompetitions.slice(1)

  // Calculate previous places (all competitions except the latest one)
  const athletesWithPreviousPoints = calculatePreviousPoints(athletes, previousCompetitions)
  const athletesWithPreviousPlaces = assignCurrentPlaces(athletesWithPreviousPoints)

  // Store previous places
  athletesWithPreviousPlaces.forEach(athlete => {
    athlete.previousAbsolutePlace = athlete.absolutePlace
    athlete.previousGenderPlace = athlete.genderPlace
    athlete.previousAgeGroupPlace = athlete.ageGroupPlace
  })

  // Calculate current places (all competitions including the latest)
  const athletesWithCurrentPlaces = assignCurrentPlaces(athletes)

  // Merge previous places into current athletes
  athletesWithCurrentPlaces.forEach(athlete => {
    const previousAthlete = athletesWithPreviousPlaces.find(prev => prev.id === athlete.id)
    if (previousAthlete) {
      athlete.previousAbsolutePlace = previousAthlete.previousAbsolutePlace
      athlete.previousGenderPlace = previousAthlete.previousGenderPlace
      athlete.previousAgeGroupPlace = previousAthlete.previousAgeGroupPlace
    }
  })

  return athletesWithCurrentPlaces
}

/**
 * Calculate points for athletes excluding the latest competition
 */
function calculatePreviousPoints(athletes: License[], previousCompetitions: any[]): License[] {
  return athletes.map(athlete => {
    const previousAthlete = { ...athlete }
    
    // Filter competitions to only include previous ones
    if (previousAthlete.competitions) {
      const previousCompetitionSlugs = new Set()
      
      previousCompetitions.forEach(comp => {
        if (Array.isArray(comp.events)) {
          comp.events.forEach((event: any) => {
            previousCompetitionSlugs.add(`${comp.slug}-${event.slug}`)
          })
        } else {
          previousCompetitionSlugs.add(comp.slug)
        }
      })

      // Keep only competitions that are in the previous competitions list
      previousAthlete.competitions = previousAthlete.competitions.filter(comp => 
        previousCompetitionSlugs.has(comp.competition)
      )

      // Recalculate total points with previous competitions only
      const eventsPoints: EventPoints[] = previousAthlete.competitions.map(comp => ({
        eventName: comp.competition,
        eventCategory: comp.category,
        points: comp.points
      }))

      const calculatedPoints = calculateTotalPoints(eventsPoints)
      previousAthlete.totalPoints = Number(calculatedPoints.toFixed(2))
    }

    return previousAthlete
  }).sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0))
}

/**
 * Assign places to athletes based on their current total points
 */
function assignCurrentPlaces(athletes: License[]): License[] {
  // Sort by total points
  const sortedAthletes = [...athletes].sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0))

  // Assign absolute places
  sortedAthletes.forEach((athlete, index) => {
    athlete.absolutePlace = index + 1
  })

  // Group athletes by gender
  const menAthletes = sortedAthletes.filter(athlete => athlete.gender === 'Мужской')
  const womenAthletes = sortedAthletes.filter(athlete => athlete.gender === 'Женский')

  // Assign gender places
  menAthletes.forEach((athlete, index) => {
    athlete.genderPlace = index + 1
  })

  womenAthletes.forEach((athlete, index) => {
    athlete.genderPlace = index + 1
  })

  // Group athletes by age group, excluding top 3 athletes in each gender category
  const ageGroups: Record<string, License[]> = {}

  sortedAthletes.forEach((athlete) => {
    // Skip top 3 athletes in their gender category for age group calculations
    if (athlete.ageGroup && athlete.genderPlace && athlete.genderPlace > 3) {
      if (!ageGroups[athlete.ageGroup]) {
        ageGroups[athlete.ageGroup] = []
      }
      ageGroups[athlete.ageGroup].push(athlete)
    }
  })

  // Sort each age group by points and assign places
  Object.keys(ageGroups).forEach((group) => {
    ageGroups[group].sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0))

    ageGroups[group].forEach((athlete, index) => {
      athlete.ageGroupPlace = index + 1
    })
  })

  return sortedAthletes
}
