import { name, rootNotionSpaceId, rootNotionPageId, description } from './config'

import type { Site } from './types'

export const getSiteForDomain = (domain: string): Site => {
  return {
    domain,
    name: name,
    rootNotionPageId: rootNotionPageId,
    rootNotionSpaceId: rootNotionSpaceId,
    description: description,
  } as Site
}
