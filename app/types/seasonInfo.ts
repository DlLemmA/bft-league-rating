import type { CompetitionsCollectionItem } from "@nuxt/content"

export type SeasonInfo = {
    statistics: {
        all: number
        men: number
        women: number
        competitionsCount: number
        competitionsWithResults: number
    }
    competitions: CompetitionsCollectionItem[]
}