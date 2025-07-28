import type { SeasonInfo } from '~/types/seasonInfo'

export const hasMultipleEvents = (competition: SeasonInfo['competitions'][number]) => {
  return competition && competition.events && competition.events.length > 0
}

const categoryClasses: Record<string, string> = {
  Sprint: 'bg-blue-100 text-blue-800',
  Olympic: 'bg-green-100 text-green-800',
  Duathlon: 'bg-orange-100 text-orange-800',
  Kross: 'bg-purple-100 text-purple-800',
  HalfIronman: 'bg-red-100 text-red-800',
  Ironman: 'bg-red-100 text-red-800',
}

export const getCategoryBadgeClass = (category: string) => {
  return `${categoryClasses[category] || 'bg-gray-100 text-gray-800'} text-xs font-medium px-2.5 py-0.5 rounded`
}

const categoryTranslations: Record<string, string> = {
  Sprint: 'Спринт',
  Olympic: 'Олимпийка',
  Duathlon: 'Дуатлон',
  Kross: 'Кросс',
  HalfIronman: 'Ironman 70.3',
  Ironman: 'Ironman',
}

export const translateCategory = (category: string) => {
  return categoryTranslations[category] || category
}

export const formatDate = (dateString: string) => {
  if (!dateString) return ''

  const date = new Date(dateString)

  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

export const formatDateRange = (startDate: string, endDate: string) => {
  if (!startDate) return ''

  const start = new Date(startDate)

  if (!endDate || startDate === endDate) {
    return formatDate(startDate)
  }

  const end = new Date(endDate)

  if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
    return `${start.getDate()} - ${end.getDate()} ${new Intl.DateTimeFormat('ru-RU', { month: 'long' }).format(end)} ${end.getFullYear()}`
  }

  if (start.getFullYear() === end.getFullYear()) {
    return `${start.getDate()} ${new Intl.DateTimeFormat('ru-RU', { month: 'long' }).format(start)} - ${end.getDate()} ${new Intl.DateTimeFormat('ru-RU', { month: 'long' }).format(end)} ${end.getFullYear()}`
  }

  return `${formatDate(startDate)} - ${formatDate(endDate)}`
}

export const sortedCompetitions = (competitions: SeasonInfo['competitions']) => {
  if (!competitions) return []

  return [...competitions].sort((a, b) => {
    if (a.startDate && b.startDate) {
      return new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    }

    return a.title.localeCompare(b.title)
  })
}

export const isUpcoming = (dateString: string) => {
  if (!dateString) return false

  const now = new Date()
  const competitionDate = new Date(dateString)
  const timeDiff = competitionDate.getTime() - now.getTime()
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))

  return daysDiff > 0 && daysDiff <= 30
}
