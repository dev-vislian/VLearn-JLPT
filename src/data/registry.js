import { unitData as n5Kanji1 } from './n5/kanji/unit-1.js'
import { unitData as n5Kanji2 } from './n5/kanji/unit-2.js'
import { unitData as n5Kanji3 } from './n5/kanji/unit-3.js'
import { unitData as n5Kanji4 } from './n5/kanji/unit-4.js'
import { unitData as n5Kanji5 } from './n5/kanji/unit-5.js'

import { unitData as n5Vocab1 } from './n5/vocab/unit-1.js'
import { unitData as n5Vocab2 } from './n5/vocab/unit-2.js'
import { unitData as n5Vocab3 } from './n5/vocab/unit-3.js'
import { unitData as n5Vocab4 } from './n5/vocab/unit-4.js'
import { unitData as n5Vocab5 } from './n5/vocab/unit-5.js'
import { unitData as n5Vocab6 } from './n5/vocab/unit-6.js'
import { unitData as n5Vocab7 } from './n5/vocab/unit-7.js'
import { unitData as n5Vocab8 } from './n5/vocab/unit-8.js'
import { unitData as n5Vocab9 } from './n5/vocab/unit-9.js'
import { unitData as n5Vocab10 } from './n5/vocab/unit-10.js'
import { unitData as n5Vocab11 } from './n5/vocab/unit-11.js'
import { unitData as n5Vocab12 } from './n5/vocab/unit-12.js'
import { unitData as n5Vocab13 } from './n5/vocab/unit-13.js'
import { unitData as n5Vocab14 } from './n5/vocab/unit-14.js'
import { unitData as n5Vocab15 } from './n5/vocab/unit-15.js'
import { unitData as n5Vocab16 } from './n5/vocab/unit-16.js'

import { unitData as n5Grammar1 } from './n5/grammar/unit-1.js'
import { unitData as n5Grammar2 } from './n5/grammar/unit-2.js'
import { unitData as n5Grammar3 } from './n5/grammar/unit-3.js'
import { unitData as n5Grammar4 } from './n5/grammar/unit-4.js'
import { unitData as n5Grammar5 } from './n5/grammar/unit-5.js'
import { unitData as n5Grammar6 } from './n5/grammar/unit-6.js'
import { unitData as n5Grammar7 } from './n5/grammar/unit-7.js'
import { unitData as n5Grammar8 } from './n5/grammar/unit-8.js'
import { unitData as n5Grammar9 } from './n5/grammar/unit-9.js'
import { unitData as n5Grammar10 } from './n5/grammar/unit-10.js'
import { unitData as n5Grammar11 } from './n5/grammar/unit-11.js'
import { unitData as n5Grammar12 } from './n5/grammar/unit-12.js'
import { unitData as n5Grammar13 } from './n5/grammar/unit-13.js'
import { unitData as n5Grammar14 } from './n5/grammar/unit-14.js'
import { unitData as n5Grammar15 } from './n5/grammar/unit-15.js'
import { unitData as n5Grammar16 } from './n5/grammar/unit-16.js'

const dataRegistry = {
  n5: {
    kanji: {
      'unit-1': n5Kanji1 || [],
      'unit-2': n5Kanji2 || [],
      'unit-3': n5Kanji3 || [],
      'unit-4': n5Kanji4 || [],
      'unit-5': n5Kanji5 || [],
    },
    vocab: {
      'unit-1': n5Vocab1 || [],
      'unit-2': n5Vocab2 || [],
      'unit-3': n5Vocab3 || [],
      'unit-4': n5Vocab4 || [],
      'unit-5': n5Vocab5 || [],
      'unit-6': n5Vocab6 || [],
      'unit-7': n5Vocab7 || [],
      'unit-8': n5Vocab8 || [],
      'unit-9': n5Vocab9 || [],
      'unit-10': n5Vocab10 || [],
      'unit-11': n5Vocab11 || [],
      'unit-12': n5Vocab12 || [],
      'unit-13': n5Vocab13 || [],
      'unit-14': n5Vocab14 || [],
      'unit-15': n5Vocab15 || [],
      'unit-16': n5Vocab16 || [],
    },
    grammar: {
      'unit-1': n5Grammar1 || [],
      'unit-2': n5Grammar2 || [],
      'unit-3': n5Grammar3 || [],
      'unit-4': n5Grammar4 || [],
      'unit-5': n5Grammar5 || [],
      'unit-6': n5Grammar6 || [],
      'unit-7': n5Grammar7 || [],
      'unit-8': n5Grammar8 || [],
      'unit-9': n5Grammar9 || [],
      'unit-10': n5Grammar10 || [],
      'unit-11': n5Grammar11 || [],
      'unit-12': n5Grammar12 || [],
      'unit-13': n5Grammar13 || [],
      'unit-14': n5Grammar14 || [],
      'unit-15': n5Grammar15 || [],
      'unit-16': n5Grammar16 || [],
    },
  },
}

export function getUnitData(level, module, unitId) {
  try {
    const l = level?.toLowerCase()
    const m = module?.toLowerCase()
    const u = unitId?.toLowerCase()
    const data = dataRegistry[l]?.[m]?.[u] || dataRegistry[l]?.[m]?.['unit-1'] || []
    return data
  } catch (e) {
    console.error('Error fetching unit data:', e)
    return []
  }
}
