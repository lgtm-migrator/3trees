import React from 'react'
import { isDev, domain } from 'lib/config'
import { getSiteMaps } from 'lib/get-site-maps'
import { resolveNotionPage } from 'lib/resolve-notion-page'

import { NotionPage } from '@/components'
import type { GetStaticPropsResult, GetStaticPathsResult } from 'next'
import type { PageProps } from 'lib/types'

const DAY = 3600 * 24

export const getStaticProps = async (context: { params: { pageId: string } }) => {
  const rawPageId = context.params.pageId as string
  if (rawPageId === 'robots.txt') return { redirect: { destination: `/api/${rawPageId}` } }
  const props = await resolveNotionPage(domain, rawPageId)

  if (!props.error) return { props, revalidate: DAY * 3 } as GetStaticPropsResult<PageProps>
  else
    return { notFound: false, revalidate: true, props: { error: props.error } } as unknown as GetStaticPropsResult<PageProps>
}

export async function getStaticPaths() {
  if (isDev) return { paths: [], fallback: 'blocking' } as GetStaticPathsResult
  const siteMaps = await getSiteMaps()
  const paths = siteMaps.flatMap(siteMap => Object.keys(siteMap.canonicalPageMap).map(pageId => ({ params: { pageId } })))
  return { paths, fallback: true } as GetStaticPathsResult
}

const NotionDomainDynamicPage = (props: PageProps) => <NotionPage {...props} />

export default NotionDomainDynamicPage
