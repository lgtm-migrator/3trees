import React from 'react'
import { isDev, domain } from 'lib/config'
import { getSiteMaps } from 'lib/get-site-maps'
import { resolveNotionPage } from 'lib/resolve-notion-page'

import { NotionPage } from '@/components'
import type { PageProps } from 'lib/types'

const DAY = 3600 * 24

export const getStaticProps = async (context: { params: { pageId: string } }) => {
  const rawPageId = context.params.pageId as string
  try {
    if (rawPageId === 'robots.txt') return { redirect: { destination: `/api/${rawPageId}` } }
    const props = await resolveNotionPage(domain, rawPageId)
    return { props, revalidate: DAY * 3 }
  } catch (err) {
    console.error(domain, rawPageId, err)
    return { notFound: false, revalidate: 10 }
  }
}

export async function getStaticPaths() {
  if (isDev) return { paths: [], fallback: 'blocking' }
  const siteMaps = await getSiteMaps()
  const ret = {
    paths: siteMaps.flatMap(siteMap => Object.keys(siteMap.canonicalPageMap).map(pageId => ({ params: { pageId } }))),
    fallback: 'blocking',
  }
  return ret
}

const NotionDomainDynamicPage = (props: PageProps) => <NotionPage {...props} />

export default NotionDomainDynamicPage
