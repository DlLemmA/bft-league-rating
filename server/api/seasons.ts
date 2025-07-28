import type { ResultsCollectionItem } from '@nuxt/content'
import type { SeasonInfo } from '~/types/seasonInfo';



const extractCompetitionMetaFromStem = (stem: string): { year: string, slug: string } => {
  // Format: "2025/results/braslav-kross/men"
  const parts = stem.split('/')
  const year = parts[0] || ''
  const slug = parts.length >= 3 ? parts[2] : ''

  return { year, slug }
}

const calculateGenderStatistics = (resultFiles: ResultsCollectionItem[]) => {
  let menCount = 0
  let womenCount = 0

  resultFiles.forEach((resultFile) => {
    const fileName = resultFile.stem.split('/').pop() || ''
    const participantCount = resultFile.body?.length || 0

    if (fileName.includes('women') || fileName.includes('female')) {
      womenCount += participantCount
    }
    else if (fileName.includes('men') || fileName.includes('male')) {
      menCount += participantCount
    }
  })

  return { men: menCount, women: womenCount, all: menCount + womenCount }
}

export default defineEventHandler(async (event) => {
  const [competitions, allResults, competitionsPointsData] = await Promise.all([
    queryCollection(event, 'competitions').all(),
    queryCollection(event, 'results').all(),
    queryCollection(event, 'competitionPoints').all(),
  ])

  const resultsByCompetition: Record<string, ResultsCollectionItem[]> = {}

  allResults.forEach((result) => {
    const { year, slug } = extractCompetitionMetaFromStem(result.stem)

    if (slug) {
      const yearCompKey = `${year}/${slug}`

      if (!resultsByCompetition[yearCompKey]) {
        resultsByCompetition[yearCompKey] = []
      }
      resultsByCompetition[yearCompKey].push(result)

      if (slug.includes('-')) {
        const [mainSlug] = slug.split('-')
        const mainCompKey = `${year}/${mainSlug}`

        if (!resultsByCompetition[mainCompKey]) {
          resultsByCompetition[mainCompKey] = []
        }
        resultsByCompetition[mainCompKey].push(result)
      }
    }
  })

  const enrichedCompetitions = competitions.map((competition) => {
    const { year: competitionYear } = extractCompetitionMetaFromStem(competition.stem)
    const competitionKey = `${competitionYear}/${competition.slug}`

    if (Array.isArray(competition.events)) {
      const enrichedEvents = competition.events.map((eventInfo) => {
        const eventKey = `${competitionYear}/${competition.slug}-${eventInfo.slug}`
        const eventResults = resultsByCompetition[eventKey] || []
        const stats = calculateGenderStatistics(eventResults)
        const hasResults = eventResults.length > 0

        const pointsInfo = competitionsPointsData.find((competitionPointData) => {
          return competitionPointData.stem.includes(competitionYear)
        })

        return {
          ...eventInfo,
          points: pointsInfo?.body.categories[eventInfo.category].basePoints,
          participantCount: stats.all,
          statistics: stats,
          hasResults,
        }
      })

      const totalStats = enrichedEvents.reduce(
        (acc, event) => ({
          all: acc.all + event.statistics.all,
          men: acc.men + event.statistics.men,
          women: acc.women + event.statistics.women,
        }),
        { all: 0, men: 0, women: 0 },
      )

      return {
        ...competition,
        year: competitionYear,
        events: enrichedEvents,
        statistics: totalStats,
        hasResults: enrichedEvents.some(event => event.hasResults),
      }
    }

    const competitionResults = resultsByCompetition[competitionKey] || []
    const statistics = calculateGenderStatistics(competitionResults)
    const hasResults = competitionResults.length > 0

    const pointsInfo = competitionsPointsData.find((competitionPointData) => {
      return competitionPointData.stem.includes(competitionYear)
    })

    return {
      ...competition,
      points: pointsInfo?.body.categories[competition.category!].basePoints,
      year: competitionYear,
      statistics,
      hasResults,
    }
  })

  const seasonsByYear: Record<string, SeasonInfo> = {}

  enrichedCompetitions.forEach((competition) => {
    const year = competition.year

    if (!seasonsByYear[year]) {
      seasonsByYear[year] = {
        statistics: {
          all: 0,
          men: 0,
          women: 0,
          competitionsCount: 0,
          competitionsWithResults: 0,
        },
        competitions: [],
      }
    }

    seasonsByYear[year].competitions.push(competition)

    seasonsByYear[year].statistics.all += competition.statistics.all
    seasonsByYear[year].statistics.men += competition.statistics.men
    seasonsByYear[year].statistics.women += competition.statistics.women
    seasonsByYear[year].statistics.competitionsCount += 1
    seasonsByYear[year].statistics.competitionsWithResults += competition.hasResults ? 1 : 0
  })

  return seasonsByYear
})
