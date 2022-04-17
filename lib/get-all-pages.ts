import pMemoize from 'p-memoize'
import PQueue from 'p-queue'

import { includeNotionIdInUrls } from './config'
import { getPage, notion, TIMEOUT } from './notion'
import { getCanonicalPageId } from './get-canonical-page-id'
import { parsePageId } from 'notion-utils'

import type { CanonicalPageMap, SiteMap } from './types'
import type { ExtendedRecordMap, PageMap } from 'notion-types'

const uuid = includeNotionIdInUrls
export const getAllPages = pMemoize(getAllPagesImpl, { maxAge: 60000 * 5 })

export const OPTIMIZED_CONCURRENCY = 10
export const MAX_PAGE = 10000
export const MAX_PENDING = 100
export const RETRY = 10

export async function getAllPagesImpl(rootNotionPageId: string, rootNotionSpaceId: string): Promise<Partial<SiteMap>> {
  const pageMap = await getAllPagesInSpace(rootNotionPageId, rootNotionSpaceId, getPage.bind(notion), {
    concurrency: OPTIMIZED_CONCURRENCY,
  })
  for (const uuid in pageMap) if (!pageMap[uuid]) delete pageMap[uuid]

  const canonicalPageMap: CanonicalPageMap = Object.keys(pageMap).reduce((map: CanonicalPageMap, pageId: string) => {
    const recordMap = pageMap[pageId]
    if (!recordMap) return map
    const canonicalPageId = getCanonicalPageId(pageId, recordMap, { uuid })
    if (!canonicalPageId) return map
    if (map[canonicalPageId]) {
      console.error('error duplicate canonical page id', canonicalPageId, pageId, map[canonicalPageId])
      return map
    } else {
      map[canonicalPageId] = pageId
      return map
    }
  }, <CanonicalPageMap>{})

  return { pageMap, canonicalPageMap }
}

export async function getAllPagesInSpace(
  rootPageId: string,
  rootSpaceId: string | undefined,
  getPage: (pageId: string, timeout: number) => Promise<ExtendedRecordMap | void>,
  {
    concurrency = OPTIMIZED_CONCURRENCY,
    traverseCollections = true,
    targetPageId,
  }: {
    concurrency?: number
    traverseCollections?: boolean
    targetPageId?: string
  } = {}
): Promise<PageMap> {
  let count = 0
  const pages: PageMap = {}
  const pendingPageIds = new Set<string>()
  const timeout = TIMEOUT
  const retry = RETRY
  const queue = new PQueue({ concurrency, timeout: timeout * retry })

  async function processPage(pageId: string) {
    if (targetPageId && pendingPageIds.has(targetPageId)) return
    pageId = parsePageId(pageId) as string
    if (pageId && !pages[pageId] && !pendingPageIds.has(pageId)) {
      if (pendingPageIds.size > MAX_PENDING) await sleep(timeout)
      if (count + pendingPageIds.size > MAX_PAGE || pendingPageIds.size > MAX_PENDING) return
      pendingPageIds.add(pageId)
      queue.add(async () => {
        try {
          if (targetPageId && pendingPageIds.has(targetPageId) && pageId !== targetPageId) return
          const page = await getPage(pageId, timeout)
          if (!page) return
          const spaceId = page.block[pageId]?.value?.space_id
          if (!rootSpaceId) rootSpaceId = spaceId
          else if (rootSpaceId !== spaceId) return
          Object.keys(page.block)
            .filter(key => {
              const block = page.block[key]?.value
              if (!block) return false
              // @ts-ignore
              const isPage = !block.is_template && (block.type === 'page' || block.type === 'collection_view_page')
              return isPage && block.space_id === rootSpaceId
            })
            .forEach(subPageId => processPage(subPageId))

          // traverse collection item pages as they may contain subpages as well
          if (traverseCollections)
            for (const collectionViews of Object.values(page.collection_query))
              for (const collectionData of Object.values(collectionViews)) {
                const { blockIds } = collectionData
                if (blockIds) for (const collectionItemId of blockIds) processPage(collectionItemId)
              }
          count++
          pages[pageId] = page
        } catch (err: any) {
          pages[pageId] = null
        }
        pendingPageIds.delete(pageId)
      })
    }
  }
  await processPage(rootPageId)
  const info = setInterval(() => console.debug('Pending', pendingPageIds.size), 2000)
  const counter = setInterval(() => console.debug('Complete', count), 2000)
  await queue.onIdle()
  clearInterval(info)
  clearInterval(counter)
  return pages
}

async function sleep(interval: number) {
  return new Promise(resolve => setTimeout(resolve, interval))
}
