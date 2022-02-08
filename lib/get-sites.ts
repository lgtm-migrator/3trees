import { getSiteForDomain } from './get-site-for-domain'
import * as config from './config'
import type { Site } from './types'

export async function getSites(): Promise<Site[]> {
  return [(await getSiteForDomain(config.domain)) as Site]
}
