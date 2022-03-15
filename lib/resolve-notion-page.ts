import { parsePageId } from 'notion-utils'
import { ExtendedRecordMap } from 'notion-types'

import * as acl from './acl'
import { pageUrlOverrides, pageUrlAdditions } from './config'
import { getPage } from './notion'
import { getSiteMaps } from './get-site-maps'
import { getSiteForDomain } from './get-site-for-domain'

import type { Site } from './types'

const root = 'wiki'

export async function resolveNotionPage(domain: string, rawPageId?: string) {
  let site: Site
  let pageId: string
  let recordMap: ExtendedRecordMap
  const error = { error: { message: `Not found "${rawPageId}"`, statusCode: 404 } }

  if (rawPageId && rawPageId !== root) {
    pageId = parsePageId(rawPageId)
    if (!pageId) {
      const override = pageUrlOverrides[rawPageId] || pageUrlAdditions[rawPageId]
      if (override) pageId = parsePageId(override)
    }
    if (pageId) {
      const resources = await Promise.all([getSiteForDomain(domain), getPage(pageId)])
      site = resources[0] as Site
      if (!resources[1]) return error
      recordMap = resources[1]
    } else {
      const siteMaps = await getSiteMaps()
      const siteMap = siteMaps[0]
      pageId = siteMap?.canonicalPageMap[rawPageId]
      if (pageId) {
        const resources = await Promise.all([getSiteForDomain(domain), getPage(pageId)])
        site = resources[0] as Site
        if (!resources[1]) return error
        recordMap = resources[1]
      } else return error
    }
  } else {
    site = (await getSiteForDomain(domain)) as Site
    pageId = site.rootNotionPageId
    console.table(site)
    const pageMap = await getPage(pageId)
    if (!pageMap) return error
    recordMap = pageMap
  }

  const props = { site, recordMap, pageId }
  return { ...props, ...(await acl.pageAcl(props)) }
}
