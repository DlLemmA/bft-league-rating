export default defineEventHandler(async (event) => {
  const year = getRouterParam(event, 'year')

  if (!year) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Year parameter is required',
    })
  }

  return queryCollection(event, 'competitionPoints').where('stem', 'LIKE', `${year}%`).first()
})
