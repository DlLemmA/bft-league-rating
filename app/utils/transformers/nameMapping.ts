import type { NameMappingCollectionItem } from '@nuxt/content'

export type NameMapping = {
  name: string
  alternatives: string[]
}

export default function transformNameMapping(row: NameMappingCollectionItem['body'][number]): NameMapping {
  return {
    name: row['ФИО на русском'],
    alternatives: row['Альтернативы']?.split(';'),
  }
}
