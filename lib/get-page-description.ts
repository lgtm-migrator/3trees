import { getPageProperty } from 'notion-utils'
import type { Block, ExtendedRecordMap } from 'notion-types'

export function getPageDescription(block: Block, recordMap: ExtendedRecordMap): string | null {
  try {
    return getPageProperty('Description', block, recordMap)
  } catch {
    return null
  }
}
