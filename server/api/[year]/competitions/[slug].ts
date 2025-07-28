import transformLicense from '~/utils/transformers/license'
import transformNameMapping from '~/utils/transformers/nameMapping'
import { transformerMap } from '~/utils/transformers'
import type { EventResult } from '~/utils/transformers/shared'
import { findMatchingLicense, calculatePoints } from '~/utils/transformers/shared'

function calculateAgeGroupPlaces(results: unknown[]): unknown[] {
  if (!results.length || !results[0].ageGroup) {
    return results
  }

  const ageGroups: Record<string, unknown[]> = {}

  results.forEach((result) => {
    if (result.ageGroup && result.genderAbsolutePlace && result.genderAbsolutePlace > 3) {
      if (!ageGroups[result.ageGroup]) {
        ageGroups[result.ageGroup] = []
      }
      ageGroups[result.ageGroup].push(result)
    }
  })

  Object.keys(ageGroups).forEach((group) => {
    ageGroups[group].sort((a, b) => a.totalTimeSeconds - b.totalTimeSeconds)

    ageGroups[group].forEach((result, index) => {
      result.ageGroupPlace = index + 1
    })
  })

  return results
}

const applyTransformer = (rawResults: unknown[], readerType: string): EventResult[] => {
  const transformer = transformerMap[readerType as keyof typeof transformerMap]

  if (!transformer) {
    throw createError({
      statusCode: 400,
      message: `Can't transform results with unknown ${readerType}`,
    })
  }

  return transformer(rawResults)
}

export default defineEventHandler(async (event) => {
  const { year, slug } = getRouterParams(event)

  if (!year || !slug) {
    throw createError({
      statusCode: 400,
      message: 'Year and slug parameters are required',
    })
  }

  const [competition, licensesData, resultsData, nameMappingData, competitionPointsData] = await Promise.all([
    queryCollection(event, 'competitions').where('stem', '=', `${year}/competitions/${slug}`).first(),
    queryCollection(event, 'licenses').where('stem', 'LIKE', `${year}%`).first(),
    queryCollection(event, 'results').where('stem', 'LIKE', `${year}/results/${slug}%`).all(),
    queryCollection(event, 'nameMapping').where('stem', 'LIKE', `${year}%`).first(),
    queryCollection(event, 'competitionPoints').where('stem', 'LIKE', `${year}%`).first(),
  ])

  if (!competition) {
    throw createError({
      statusCode: 404,
      statusMessage: `Competition not found: ${year}/${slug}`,
    })
  }

  const licenses = licensesData?.body?.map(transformLicense) || []
  const nameMapping = nameMappingData?.body.map(transformNameMapping) || []

  if (Array.isArray(competition.events) && competition.events.length > 0) {
    const enrichedEvents = competition.events.map((event) => {
      const eventSlug = `${competition.slug}-${event.slug}`
      const eventResults = resultsData.filter((resultData) => {
        return resultData.stem.includes(eventSlug)
      }).flatMap((resultData) => {
        const results = applyTransformer(resultData.body, competition.readerType)
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
          points: result.hasLicense ? calculatePoints(result.totalTimeSeconds, licensedChampion!.totalTimeSeconds, event.points) : undefined,
          calculationData: result.hasLicense && licensedChampion
            ? {
                basePoints: event.points,
                winnerTime: licensedChampion.totalTime,
                winnerTimeSeconds: licensedChampion.totalTimeSeconds,
                timeDifferenceSeconds: result.totalTimeSeconds - licensedChampion.totalTimeSeconds,
              }
            : undefined,
        }))
      }).sort((resultA, resultB) => resultA.totalTimeSeconds - resultB.totalTimeSeconds).map((result, index) => ({
        ...result,
        absolutePlace: index + 1,
      }))

      const eventResultsWithAgeGroups = calculateAgeGroupPlaces(eventResults)

      const participantsAmount = eventResultsWithAgeGroups.length
      const licensedAmount = eventResultsWithAgeGroups.filter(result => result.hasLicense).length
      const unlicensedAmount = participantsAmount - licensedAmount
      const maleParticipantsAmount = eventResultsWithAgeGroups.filter(result => result.gender === 'male').length
      const femaleParticipantsAmount = participantsAmount - maleParticipantsAmount

      return {
        ...event,
        results: eventResultsWithAgeGroups,
        hasResults: !!eventResults.length,
        points: competitionPointsData.body.categories[event.category].basePoints,
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
      ...competition,
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

  const eventResults = resultsData.flatMap((resultData) => {
    const results = applyTransformer(resultData.body, competition.readerType)
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
      points: result.hasLicense ? calculatePoints(result.totalTimeSeconds, licensedChampion!.totalTimeSeconds, competition.points) : undefined,
      calculationData: result.hasLicense && licensedChampion
        ? {
            basePoints: competition.points,
            winnerTime: licensedChampion.totalTime,
            winnerTimeSeconds: licensedChampion.totalTimeSeconds,
            timeDifferenceSeconds: result.totalTimeSeconds - licensedChampion.totalTimeSeconds,
          }
        : undefined,
    }))
  }).sort((resultA, resultB) => resultA.totalTimeSeconds - resultB.totalTimeSeconds).map((result, index) => ({
    ...result,
    absolutePlace: index + 1,
  }))

  const eventResultsWithAgeGroups = calculateAgeGroupPlaces(eventResults)

  const participantsAmount = eventResultsWithAgeGroups.length
  const licensedAmount = eventResultsWithAgeGroups.filter(result => result.hasLicense).length
  const unlicensedAmount = participantsAmount - licensedAmount
  const maleParticipantsAmount = eventResultsWithAgeGroups.filter(result => result.gender === 'male').length
  const femaleParticipantsAmount = participantsAmount - maleParticipantsAmount

  return {
    ...competition,
    points: competitionPointsData.body.categories[competition.category].basePoints,
    results: eventResultsWithAgeGroups,
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
