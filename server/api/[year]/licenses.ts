import transformLicense from '~/utils/transformers/license'

export default defineEventHandler(async (event) => {
  const year = getRouterParam(event, 'year')

  const licensesData = await queryCollection(event, 'licenses').where('stem', 'LIKE', `${year}%`).first()

  const licenses = licensesData?.body.map(transformLicense).filter(license => license.id.startsWith('AG')) || []

  return licenses
})
