import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    licenses: defineCollection({
      type: 'data',
      source: '*/licenses.csv',
      schema: z.object({
        body: z.array(
          z.object({
            Номер: z.string(),
            fioRussian: z.string(),
            fioEnglish: z.string(),
            gender: z.string(),
            club: z.string(),
            birthDate: z.string(),
            ageGroup: z.string(),
          }),
        ),
      }),
    }),
    nameMapping: defineCollection({
      type: 'data',
      source: '*/name_mapping.csv',
      schema: z.object({
        body: z.array(z.object({
          'ФИО на русском': z.string(),
          'Альтернативы': z.array(z.string()),
        })),
      }),
    }),
    competitions: defineCollection({
      type: 'data',
      source: '*/competitions/**/*.json',
      schema: z.object({
        slug: z.string(),
        title: z.string(),
        description: z.string(),
        readerType: z.enum([
          'obelarus', // OBelarus: "Время" field, HH:MM:SS.mmm format
          'obelarus2', // OBelarus2: "Результат" field, HH:MM:SS format
          'minskIndoor', // MinskIndoorTriathlon: "Итоговое время" field, MM:SS format
          'athlinks', // Athlinks: "РЕЗУЛЬТАТ" field, HH:MM:SS.mmm format
          'zaslavl', // ZaslavlMultitriathlon: "Итоговое время" field, HH:MM:SS.mmm format
          'mogilev', // Mogilev: custom format
        ]),
        startDate: z.string(),
        endDate: z.string(),

        // unfort currently we can't use z.or in schema :(
        category: z.string().optional(),
        // or
        events: z.array(z.object({
          slug: z.string(),
          title: z.string(),
          description: z.string(),
          category: z.string(),
        })).optional(),
      }),
    }),

    results: defineCollection({
      type: 'data',
      source: '*/results/**/*.csv',
      schema: z.object({
        body: z.array(z.unknown()),
      }),
    }),

    competitionPoints: defineCollection({
      type: 'data',
      source: '*/competition-points.json',
      schema: z.object({
        body: z.object({
          categories: z.record(z.object({
            name: z.string(),
            basePoints: z.number(),
            defaultWinnerTime: z.object({
              hours: z.number(),
              minutes: z.number(),
              seconds: z.number(),
            }),
          })),
          categoryMapping: z.record(z.string()),
          eventDescriptions: z.record(z.string()),
        }),
      }),
    }),
  },
})
