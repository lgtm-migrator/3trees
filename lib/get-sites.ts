import { getSiteForDomain } from './get-site-for-domain'
import { domain } from './config'

import type { Site } from './types'

export async function getSites(): Promise<Site[]> {
  return [(await getSiteForDomain(domain)) as Site]
}
