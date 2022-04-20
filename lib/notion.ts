import { NotionAPI } from 'notion-client'
import { ExtendedRecordMap, SearchParams, SearchResults } from 'notion-types'
import { PHASE_PRODUCTION_BUILD } from 'next/constants'
import { writeFile, readFile, mkdir, stat } from 'fs/promises'
import { join } from 'path'

import { getPreviewImageMap } from './preview-images'
import { getSiteConfig } from './get-config-value'

export const TIMEOUT = 20000

// Rmove notion-client's vervose warning
console.warn = (...args) => console.debug(...args.map(arg => (arg instanceof Error ? arg.message : arg)))

export const activeUser: string = getSiteConfig('notionUserId')
export const notion = new NotionAPI({
  apiBaseUrl: process.env.NOTION_API_BASE_URL,
  activeUser,
})

export async function getPage(pageId: string, timeout: number = TIMEOUT): Promise<ExtendedRecordMap | void> {
  let recordMap: ExtendedRecordMap | void
  if (PHASE_PRODUCTION_BUILD) {
    recordMap = await cacher.get(pageId)
    if (recordMap) return recordMap
  }
  recordMap = await notion
    .getPage(pageId, { gotOptions: { timeout: { request: timeout } } })
    .catch(err => console.debug(err.message, pageId))
  if (!recordMap) return recordMap
  const previewImageMap = await getPreviewImageMap(recordMap)
  const map = recordMap as any
  map.preview_images = previewImageMap
  await cacher.set(pageId, map)
  return map
}

export const exists = async (path: string) => await stat(path).catch(() => false)
exists(join(process.cwd(), 'cache')).then(exist => {
  if (!exist) mkdir(join(process.cwd(), 'cache'))
})

const cacher = {
  get: async (id: string): Promise<ExtendedRecordMap | void> => {
    const data = await readFile(join(process.cwd(), 'cache', `${id}.json`)).catch(() => null)
    if (!data) return
    const recordMap: ExtendedRecordMap = JSON.parse(data as unknown as string)
    return recordMap
  },
  set: async (id: string, recordMap: ExtendedRecordMap) => {
    return writeFile(join(process.cwd(), 'cache', `${id}.json`), JSON.stringify(recordMap), {})
  },
}

export async function search(params: SearchParams): Promise<SearchResults> {
  return notion.search(params)
}
