import transformObelarus from './obelarus'
import transformObelarus2 from './obelarus2'
import transformMinskIndoor from './minskIndoor'
import transformAthlinks from './athlinks'
import transformZaslavl from './zaslavl'
import transformMogilev from './mogilev'
import transformBrestAquathlon from './brestAquathlon'
import transformLogoiskWinter from './logoisk-winter'
import transformDrogichin from './drogichin'

export const transformerMap = {
  obelarus: transformObelarus,
  obelarus2: transformObelarus2,
  minskIndoor: transformMinskIndoor,
  athlinks: transformAthlinks,
  zaslavl: transformZaslavl,
  mogilev: transformMogilev,
  brestAquathlon: transformBrestAquathlon,
  logoiskWinter: transformLogoiskWinter,
  drogichin: transformDrogichin,
} as const

export type ReaderType = keyof typeof transformerMap

export {
  transformObelarus,
  transformObelarus2,
  transformMinskIndoor,
  transformAthlinks,
  transformZaslavl,
  transformMogilev,
  transformBrestAquathlon,
  transformLogoiskWinter,
  transformDrogichin,
}
