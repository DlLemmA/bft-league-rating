import type { LicensesCollectionItem } from '@nuxt/content'

export type License = {
  id: string
  fioRussian: string
  fioEnglish: string
  gender: string
  club: string
  birthDate: string
  ageGroup: string
}

export default function transformLicense(row: LicensesCollectionItem['body'][number]): License {
  return {
    id: row['Номер'].trim(),
    fioRussian: row['ФИО на русском'].trim(),
    fioEnglish: row['ФИО на английском'].trim(),
    gender: row['Пол'],
    club: row['Спорт клуб'],
    birthDate: row['Дата рождения'],
    ageGroup: row['Категория'],
    avatarSrc: `/img/avatars/thumbnails/${row['ФИО на русском'].trim()}.jpg`,
  }
}
