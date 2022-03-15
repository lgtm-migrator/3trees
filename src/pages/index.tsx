import React from 'react'
import { domain } from 'lib/config'
import { resolveNotionPage } from 'lib/resolve-notion-page'
import { NotionPage } from '@/components'
import { PageProps } from 'lib/types'

import type { GetStaticPropsResult } from 'next'

const DAY = 3600 * 24

export const getStaticProps = async () => {
  const props = await resolveNotionPage(domain, '')
  if (!props.error) return { props, revalidate: DAY * 3 } as GetStaticPropsResult<PageProps>
  else
    return { notFound: false, revalidate: true, props: { error: props.error } } as unknown as GetStaticPropsResult<PageProps>
}

export default function NotionDomainPage(props: PageProps) {
  return <NotionPage {...props} />
}
