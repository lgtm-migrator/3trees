import { parsePageId } from 'notion-utils'
import { HTTPError } from 'got/dist/source'
import { ExtendedRecordMap } from 'notion-types'

import { pageAcl } from './acl'
import { pageUrlOverrides, pageUrlAdditions } from './config'
import { getPage } from './notion'
import { getSiteForDomain } from './get-site-for-domain'

import type { Site, PageProps, PageError } from './types'

const SERVER_ERR = 500

export async function resolveNotionPage(domain: string, rawPageId: string) {
  const site: Site = getSiteForDomain(domain)
  let pageId: string
  let recordMap: ExtendedRecordMap | undefined
  let error: PageError | undefined

  // Non Root
  pageId = parsePageId(rawPageId)
  if (!pageId) {
    const override = pageUrlOverrides[rawPageId] || pageUrlAdditions[rawPageId]
    if (override) pageId = parsePageId(override)
  }
  if (pageId)
    recordMap = (await getPage(pageId).catch((err: HTTPError) => {
      error = { statusCode: SERVER_ERR, message: err.name }
    })) as ExtendedRecordMap

  const props = { site, recordMap, pageId } as PageProps
  if (error) props.error = error
  return { ...props, ...pageAcl(props) }
}
