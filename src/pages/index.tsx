import React from 'react'
import { domain, rootNotionPageId } from 'lib/config'
import { resolveNotionPage } from 'lib/resolve-notion-page'
import { NotionPage } from '@/components'
import { PageProps } from 'lib/types'
import Head from 'next/head'

import type { GetStaticPropsResult } from 'next'

const DAY = 3600 * 24

export const getStaticProps = async () => {
  const props = await resolveNotionPage(domain, rootNotionPageId)
  if (!props.error) return { props, revalidate: DAY * 3 } as GetStaticPropsResult<PageProps>
  else
    return { notFound: false, revalidate: true, props: { error: props.error } } as unknown as GetStaticPropsResult<PageProps>
}

export default function NotionDomainPage(props: PageProps) {
  return (
    <>
      <Head>
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="/ogimage.png" />
        <meta property="og:image" content="/ogimage.png" />
      </Head>
      <NotionPage {...props} />
    </>
  )
}
