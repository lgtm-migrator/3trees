import { parsePageId } from 'notion-utils'
import { ExtendedRecordMap } from 'notion-types'

import { pageAcl } from './acl'
import { pageUrlOverrides, pageUrlAdditions } from './config'
import { getPage } from './notion'
import { getSiteForDomain } from './get-site-for-domain'

import type { Site, PageProps } from './types'

export async function resolveNotionPage(domain: string, rawPageId: string) {
  let site: Site
  let pageId: string
  let recordMap: ExtendedRecordMap | undefined
  let error: Error
  site = getSiteForDomain(domain)

  // Non Root
  pageId = parsePageId(rawPageId)
  if (!pageId) {
    const override = pageUrlOverrides[rawPageId] || pageUrlAdditions[rawPageId]
    if (override) pageId = parsePageId(override)
  }
  console.debug('pageid', pageId)
  if (pageId)
    recordMap = (await getPage(pageId).catch(err => {
      error = new Error(err.name)
    })) as ExtendedRecordMap

  const props = { site, recordMap, pageId } as PageProps
  return { ...props, ...pageAcl(props) }
}
