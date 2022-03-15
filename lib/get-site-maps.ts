import pMap from 'p-map'
import { getAllPages } from './get-all-pages'
import { getSites } from './get-sites'
import type { SiteMap } from './types'

export async function getSiteMaps(): Promise<SiteMap[]> {
  const sites = await getSites()
  const siteMaps = (
    await pMap(
      sites,
      async (site, index) => {
        try {
          console.debug('getSiteMap', `${index + 1}/${sites.length}`, `(${(((index + 1) / sites.length) * 100) | 0}%)`, site)
          return { site, ...(await getAllPages(site.rootNotionPageId, site.rootNotionSpaceId)) } as SiteMap
        } catch (err) {
          console.warn('site build error', index, site, err)
        }
      },
      { concurrency: 1 }
    )
  ).filter(Boolean) as SiteMap[]
  return siteMaps.filter(Boolean)
}
